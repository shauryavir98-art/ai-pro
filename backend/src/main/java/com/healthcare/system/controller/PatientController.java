package com.healthcare.system.controller;

import com.healthcare.system.entity.Patient;
import com.healthcare.system.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        return ResponseEntity.ok(patientService.getPatientByUserId(1L));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Patient> getPatientByUserId(@PathVariable Long userId) {
        return patientService.getPatientByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return patientService.getPatientById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patientDetails) {
        return patientService.getPatientById(id)
                .map(existingPatient -> {
                    existingPatient.setFullName(patientDetails.getFullName());
                    existingPatient.setDateOfBirth(patientDetails.getDateOfBirth());
                    existingPatient.setGender(patientDetails.getGender());
                    existingPatient.setBloodGroup(patientDetails.getBloodGroup());
                    return ResponseEntity.ok(patientService.savePatient(existingPatient));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
