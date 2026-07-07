package com.healthcare.system.controller;

import com.healthcare.system.dto.DashboardStats;
import com.healthcare.system.entity.Doctor;
import com.healthcare.system.entity.Patient;
import com.healthcare.system.entity.Prediction;
import com.healthcare.system.service.DoctorService;
import com.healthcare.system.service.PatientService;
import com.healthcare.system.service.PredictionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    private final DoctorService doctorService;
    private final PatientService patientService;
    private final PredictionService predictionService;

    public DoctorController(DoctorService doctorService, PatientService patientService, PredictionService predictionService) {
        this.doctorService = doctorService;
        this.patientService = patientService;
        this.predictionService = predictionService;
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @GetMapping("/analytics")
    public ResponseEntity<DashboardStats> getAnalytics() {
        List<Patient> patients = patientService.getAllPatients();
        List<Doctor> doctors = doctorService.getAllDoctors();
        
        long totalPredictions = 0;
        long diabetesRiskCount = 0;
        long heartRiskCount = 0;
        long hyperRiskCount = 0;

        for (Patient p : patients) {
            List<Prediction> preds = predictionService.getPredictionsByPatient(p.getId());
            totalPredictions += preds.size();
            for (Prediction pr : preds) {
                if (Boolean.TRUE.equals(pr.getPredictionResult())) {
                    if ("Diabetes".equalsIgnoreCase(pr.getDiseaseType())) {
                        diabetesRiskCount++;
                    } else if ("Heart Disease".equalsIgnoreCase(pr.getDiseaseType())) {
                        heartRiskCount++;
                    } else if ("Hypertension".equalsIgnoreCase(pr.getDiseaseType())) {
                        hyperRiskCount++;
                    }
                }
            }
        }

        Map<String, Long> distribution = new HashMap<>();
        distribution.put("Diabetes Risk", diabetesRiskCount);
        distribution.put("Heart Disease Risk", heartRiskCount);
        distribution.put("Hypertension Risk", hyperRiskCount);

        DashboardStats stats = DashboardStats.builder()
                .totalPatients((long) patients.size())
                .totalDoctors((long) doctors.size())
                .totalPredictions(totalPredictions)
                .diseaseRiskDistribution(distribution)
                .build();

        return ResponseEntity.ok(stats);
    }
}
