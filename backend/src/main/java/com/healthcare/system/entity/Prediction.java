package com.healthcare.system.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "health_record_id", nullable = false)
    private HealthRecord healthRecord;

    @Column(name = "disease_type", nullable = false, length = 50)
    private String diseaseType; // 'Diabetes', 'Heart Disease', 'Hypertension'

    @Column(name = "prediction_result", nullable = false)
    private Boolean predictionResult; // false: healthy, true: risk

    @Column(name = "confidence_score", nullable = false)
    private Float confidenceScore;

    @Column(name = "shap_explanation", columnDefinition = "TEXT")
    private String shapExplanation; // JSON string

    @Column(name = "predicted_at")
    private LocalDateTime predictedAt = LocalDateTime.now();

    public Prediction() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public HealthRecord getHealthRecord() {
        return healthRecord;
    }

    public void setHealthRecord(HealthRecord healthRecord) {
        this.healthRecord = healthRecord;
    }

    public String getDiseaseType() {
        return diseaseType;
    }

    public void setDiseaseType(String diseaseType) {
        this.diseaseType = diseaseType;
    }

    public Boolean getPredictionResult() {
        return predictionResult;
    }

    public void setPredictionResult(Boolean predictionResult) {
        this.predictionResult = predictionResult;
    }

    public Float getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Float confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public String getShapExplanation() {
        return shapExplanation;
    }

    public void setShapExplanation(String shapExplanation) {
        this.shapExplanation = shapExplanation;
    }

    public LocalDateTime getPredictedAt() {
        return predictedAt;
    }

    public void setPredictedAt(LocalDateTime predictedAt) {
        this.predictedAt = predictedAt;
    }
}
