package com.healthcare.system.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthcare.system.dto.PredictRequest;
import com.healthcare.system.dto.PredictResponse;
import com.healthcare.system.entity.HealthRecord;
import com.healthcare.system.entity.Patient;
import com.healthcare.system.entity.Prediction;
import com.healthcare.system.entity.Recommendation;
import com.healthcare.system.repository.HealthRecordRepository;
import com.healthcare.system.repository.PredictionRepository;
import com.healthcare.system.repository.RecommendationRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PredictionService {

    private final HealthRecordRepository healthRecordRepository;
    private final PredictionRepository predictionRepository;
    private final RecommendationRepository recommendationRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    public PredictionService(
            HealthRecordRepository healthRecordRepository,
            PredictionRepository predictionRepository,
            RecommendationRepository recommendationRepository
    ) {
        this.healthRecordRepository = healthRecordRepository;
        this.predictionRepository = predictionRepository;
        this.recommendationRepository = recommendationRepository;
    }

    public List<Prediction> getHistoryByPatient(Long patientId) {
        return predictionRepository.findByPatientIdOrderByPredictedAtDesc(patientId);
    }

    public List<Prediction> getPredictionsByPatient(Long patientId) {
        return predictionRepository.findByPatientIdOrderByPredictedAtDesc(patientId);
    }

    @Transactional
    public List<Prediction> processHealthRecordAndPredict(Patient patient, HealthRecord record) {
        // Save the health record
        record.setPatient(patient);
        HealthRecord savedRecord = healthRecordRepository.save(record);

        // Prepare request for FastAPI
        PredictRequest pyRequest = new PredictRequest();
        pyRequest.setAge(savedRecord.getAge());
        pyRequest.setGender(savedRecord.getGender());
        pyRequest.setSystolic_bp(savedRecord.getSystolicBp());
        pyRequest.setDiastolic_bp(savedRecord.getDiastolicBp());
        pyRequest.setCholesterol(savedRecord.getCholesterol());
        pyRequest.setGlucose(savedRecord.getGlucose());
        pyRequest.setBmi(savedRecord.getBmi());
        pyRequest.setSmoking(savedRecord.getSmoking());
        pyRequest.setPhysical_activity(savedRecord.getPhysicalActivity());
        pyRequest.setHeart_rate(savedRecord.getHeartRate());

        String[] diseases = {"diabetes", "heart_disease", "hypertension"};
        List<Prediction> predictionsList = new ArrayList<>();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<PredictRequest> entity = new HttpEntity<>(pyRequest, headers);

        for (String disease : diseases) {
            PredictResponse pyResponse = null;
            try {
                String url = aiServiceUrl + "/predict/" + disease;
                pyResponse = restTemplate.postForObject(url, entity, PredictResponse.class);
            } catch (Exception e) {
                // Fallback basic risk engine in case AI service is offline
                pyResponse = fallbackPredictionEngine(disease, pyRequest);
            }

            if (pyResponse != null) {
                Prediction prediction = new Prediction();
                prediction.setPatient(patient);
                prediction.setHealthRecord(savedRecord);
                prediction.setDiseaseType(capitalize(disease));
                prediction.setPredictionResult(pyResponse.getPrediction() == 1);
                prediction.setConfidenceScore(pyResponse.getConfidence_score());
                
                try {
                    prediction.setShapExplanation(objectMapper.writeValueAsString(pyResponse.getShap_values()));
                } catch (Exception e) {
                    prediction.setShapExplanation("[]");
                }

                Prediction savedPrediction = predictionRepository.save(prediction);
                predictionsList.add(savedPrediction);

                // Generate personalized recommendations
                Recommendation rec = new Recommendation();
                rec.setPrediction(savedPrediction);
                rec.setDietPlan(generateDietPlan(disease, pyResponse.getPrediction() == 1, pyRequest));
                rec.setExercisePlan(generateExercisePlan(disease, pyResponse.getPrediction() == 1, pyRequest));
                rec.setPrecautions(generatePrecautions(disease, pyResponse.getPrediction() == 1, pyRequest));
                recommendationRepository.save(rec);
            }
        }

        return predictionsList;
    }

    private PredictResponse fallbackPredictionEngine(String disease, PredictRequest req) {
        PredictResponse res = new PredictResponse();
        res.setDisease(disease);
        res.setModel_used("Fallback Rule-based Engine");
        
        boolean highRisk = false;
        float score = 30.0f;

        if ("diabetes".equals(disease)) {
            if (req.getGlucose() > 1) { score += 30.0f; }
            if (req.getBmi() > 28.0) { score += 20.0f; }
            if (req.getAge() > 45) { score += 15.0f; }
            if (req.getPhysical_activity() == 0) { score += 10.0f; }
        } else if ("heart_disease".equals(disease)) {
            if (req.getSystolic_bp() > 140) { score += 25.0f; }
            if (req.getCholesterol() > 1) { score += 25.0f; }
            if (req.getSmoking() == 1) { score += 20.0f; }
            if (req.getAge() > 50) { score += 15.0f; }
        } else { // hypertension
            if (req.getSystolic_bp() > 130 || req.getDiastolic_bp() > 85) { score += 40.0f; }
            if (req.getBmi() > 26.0) { score += 20.0f; }
            if (req.getAge() > 40) { score += 15.0f; }
        }

        if (score > 100.0f) { score = 98.5f; }
        highRisk = score >= 50.0f;

        res.setPrediction(highRisk ? 1 : 0);
        res.setConfidence_score(score);
        
        // Mock SHAP values
        List<Map<String, Object>> shapList = new ArrayList<>();
        Map<String, Object> shap1 = new HashMap<>();
        shap1.put("feature", "age");
        shap1.put("value", req.getAge());
        shap1.put("contribution", 0.12);
        shapList.add(shap1);
        res.setShap_values(shapList);
        
        return res;
    }

    private String generateDietPlan(String disease, boolean isAtRisk, PredictRequest req) {
        if (!isAtRisk) {
            return "Maintain a balanced diet rich in whole grains, lean proteins, vegetables, and healthy fats. Stay hydrated and limit sugar intake.";
        }
        
        switch (disease) {
            case "diabetes":
                return "Strict low-glycemic index (GI) diet. Focus on high-fiber foods (oats, legumes), non-starchy vegetables, and lean proteins. Strictly avoid simple sugars, refined carbohydrates, and sugary beverages.";
            case "heart_disease":
                return "Dash or Mediterranean diet. Limit saturated fats, trans fats, and sodium intake (< 1500mg per day). Increase consumption of omega-3 rich foods (fish, walnuts), olive oil, fruits, and leafy greens.";
            case "hypertension":
                return "Low-sodium diet (< 1.5g sodium/day). Focus on potassium-rich foods (bananas, spinach, sweet potatoes) to help lower blood pressure. Avoid processed foods, pickles, and canned items.";
            default:
                return "Healthy balanced diet with reduced caloric intake.";
        }
    }

    private String generateExercisePlan(String disease, boolean isAtRisk, PredictRequest req) {
        if (!isAtRisk) {
            return "150 minutes of moderate-intensity aerobic exercise (walking, swimming, cycling) per week, plus strength training 2 days a week.";
        }

        switch (disease) {
            case "diabetes":
                return "Perform at least 30 minutes of aerobic exercise (brisk walking, swimming) daily. Exercise helps improve insulin sensitivity. Include light strength training.";
            case "heart_disease":
                return "Start with low-intensity activities like walking for 20-30 minutes, 4 times a week. Avoid high-intensity lifting or sudden bursts of energy without consulting your doctor first.";
            case "hypertension":
                return "Focus on regular aerobic activities like brisk walking, cycling, or jogging. Avoid heavy weightlifting which can spike blood pressure rapidly.";
            default:
                return "Moderate physical activity as tolerated.";
        }
    }

    private String generatePrecautions(String disease, boolean isAtRisk, PredictRequest req) {
        if (!isAtRisk) {
            return "Get annual health checkups, monitor weight, and maintain healthy habits.";
        }

        switch (disease) {
            case "diabetes":
                return "Monitor blood glucose levels daily. Carry a fast-acting carb source in case of hypoglycemia. Inspect feet daily for cuts or sores.";
            case "heart_disease":
                return "Monitor heart rate and blood pressure regularly. Avoid extreme temperatures. Seek immediate medical attention if you experience chest pain, shortness of breath, or dizziness.";
            case "hypertension":
                return "Check blood pressure daily at the same time. Limit stress and practice relaxation techniques. Avoid excessive caffeine and alcohol consumption.";
            default:
                return "Consult a physician for regular checkups.";
        }
    }

    private String capitalize(String str) {
        if (str == null || str.isEmpty()) return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1).replace("_", " ");
    }
}
