package com.healthcare.system.dto;

import java.util.Map;

public class DashboardStats {
    private Long totalPatients;
    private Long totalPredictions;
    private Long totalDoctors;
    private Map<String, Long> diseaseRiskDistribution;

    public DashboardStats() {}

    public DashboardStats(Long totalPatients, Long totalPredictions, Long totalDoctors, Map<String, Long> diseaseRiskDistribution) {
        this.totalPatients = totalPatients;
        this.totalPredictions = totalPredictions;
        this.totalDoctors = totalDoctors;
        this.diseaseRiskDistribution = diseaseRiskDistribution;
    }

    public Long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(Long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public Long getTotalPredictions() {
        return totalPredictions;
    }

    public void setTotalPredictions(Long totalPredictions) {
        this.totalPredictions = totalPredictions;
    }

    public Long getTotalDoctors() {
        return totalDoctors;
    }

    public void setTotalDoctors(Long totalDoctors) {
        this.totalDoctors = totalDoctors;
    }

    public Map<String, Long> getDiseaseRiskDistribution() {
        return diseaseRiskDistribution;
    }

    public void setDiseaseRiskDistribution(Map<String, Long> diseaseRiskDistribution) {
        this.diseaseRiskDistribution = diseaseRiskDistribution;
    }

    // Traditional Builder Mock
    public static DashboardStatsBuilder builder() {
        return new DashboardStatsBuilder();
    }

    public static class DashboardStatsBuilder {
        private Long totalPatients;
        private Long totalPredictions;
        private Long totalDoctors;
        private Map<String, Long> diseaseRiskDistribution;

        public DashboardStatsBuilder totalPatients(Long totalPatients) {
            this.totalPatients = totalPatients;
            return this;
        }

        public DashboardStatsBuilder totalPredictions(Long totalPredictions) {
            this.totalPredictions = totalPredictions;
            return this;
        }

        public DashboardStatsBuilder totalDoctors(Long totalDoctors) {
            this.totalDoctors = totalDoctors;
            return this;
        }

        public DashboardStatsBuilder diseaseRiskDistribution(Map<String, Long> diseaseRiskDistribution) {
            this.diseaseRiskDistribution = diseaseRiskDistribution;
            return this;
        }

        public DashboardStats build() {
            return new DashboardStats(totalPatients, totalPredictions, totalDoctors, diseaseRiskDistribution);
        }
    }
}
