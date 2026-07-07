package com.healthcare.system.controller;

import com.healthcare.system.entity.HealthRecord;
import com.healthcare.system.entity.Patient;
import com.healthcare.system.entity.Prediction;
import com.healthcare.system.service.PatientService;
import com.healthcare.system.service.PredictionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/predictions")
@CrossOrigin(origins = "*")
public class PredictionController {

    private final PredictionService predictionService;
    private final PatientService patientService;

    public PredictionController(PredictionService predictionService, PatientService patientService) {
        this.predictionService = predictionService;
        this.patientService = patientService;
    }

    @PostMapping("/patient/{patientId}")
    public ResponseEntity<?> predictAndSave(
            @PathVariable Long patientId,
            @RequestBody HealthRecord healthRecord
    ) {
        return patientService.getPatientById(patientId)
                .map(patient -> {
                    List<Prediction> predictions = predictionService.processHealthRecordAndPredict(patient, healthRecord);
                    return ResponseEntity.ok(predictions);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}/history")
    public ResponseEntity<List<Prediction>> getHistory(@PathVariable Long patientId) {
        return ResponseEntity.ok(predictionService.getHistoryByPatient(patientId));
    }
}
