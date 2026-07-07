package com.healthcare.system.repository;

import com.healthcare.system.entity.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    List<Prediction> findByPatientIdOrderByPredictedAtDesc(Long patientId);
    List<Prediction> findByPatientIdAndDiseaseTypeOrderByPredictedAtDesc(Long patientId, String diseaseType);
}
