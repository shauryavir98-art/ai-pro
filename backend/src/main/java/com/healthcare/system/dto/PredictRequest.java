package com.healthcare.system.dto;

public class PredictRequest {
    private Integer age;
    private Integer gender; // 0 for Female, 1 for Male
    private Integer systolic_bp;
    private Integer diastolic_bp;
    private Integer cholesterol;
    private Integer glucose;
    private Float bmi;
    private Integer smoking;
    private Integer physical_activity;
    private Integer heart_rate;

    public PredictRequest() {}

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Integer getGender() {
        return gender;
    }

    public void setGender(Integer gender) {
        this.gender = gender;
    }

    public Integer getSystolic_bp() {
        return systolic_bp;
    }

    public void setSystolic_bp(Integer systolic_bp) {
        this.systolic_bp = systolic_bp;
    }

    public Integer getDiastolic_bp() {
        return diastolic_bp;
    }

    public void setDiastolic_bp(Integer diastolic_bp) {
        this.diastolic_bp = diastolic_bp;
    }

    public Integer getCholesterol() {
        return cholesterol;
    }

    public void setCholesterol(Integer cholesterol) {
        this.cholesterol = cholesterol;
    }

    public Integer getGlucose() {
        return glucose;
    }

    public void setGlucose(Integer glucose) {
        this.glucose = glucose;
    }

    public Float getBmi() {
        return bmi;
    }

    public void setBmi(Float bmi) {
        this.bmi = bmi;
    }

    public Integer getSmoking() {
        return smoking;
    }

    public void setSmoking(Integer smoking) {
        this.smoking = smoking;
    }

    public Integer getPhysical_activity() {
        return physical_activity;
    }

    public void setPhysical_activity(Integer physical_activity) {
        this.physical_activity = physical_activity;
    }

    public Integer getHeart_rate() {
        return heart_rate;
    }

    public void setHeart_rate(Integer heart_rate) {
        this.heart_rate = heart_rate;
    }
}
