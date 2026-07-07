package com.healthcare.system.dto;

import java.util.List;
import java.util.Map;

public class PredictResponse {
    private String disease;
    private Integer prediction;
    private Float confidence_score;
    private String model_used;
    private List<Map<String, Object>> shap_values;

    public PredictResponse() {}

    public String getDisease() {
        return disease;
    }

    public void setDisease(String disease) {
        this.disease = disease;
    }

    public Integer getPrediction() {
        return prediction;
    }

    public void setPrediction(Integer prediction) {
        this.prediction = prediction;
    }

    public Float getConfidence_score() {
        return confidence_score;
    }

    public void setConfidence_score(Float confidence_score) {
        this.confidence_score = confidence_score;
    }

    public String getModel_used() {
        return model_used;
    }

    public void setModel_used(String model_used) {
        this.model_used = model_used;
    }

    public List<Map<String, Object>> getShap_values() {
        return shap_values;
    }

    public void setShap_values(List<Map<String, Object>> shap_values) {
        this.shap_values = shap_values;
    }
}
