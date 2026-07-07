package com.healthcare.system.service;

import com.healthcare.system.config.JwtService;
import com.healthcare.system.dto.AuthResponse;
import com.healthcare.system.dto.LoginRequest;
import com.healthcare.system.dto.RegisterRequest;
import com.healthcare.system.entity.Doctor;
import com.healthcare.system.entity.Patient;
import com.healthcare.system.entity.User;
import com.healthcare.system.repository.DoctorRepository;
import com.healthcare.system.repository.PatientRepository;
import com.healthcare.system.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    public AuthService(
            UserRepository userRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            CustomUserDetailsService userDetailsService
    ) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        String role = request.getRole() == null ? "PATIENT" : request.getRole().toUpperCase();

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        User savedUser = userRepository.save(user);

        if ("PATIENT".equals(role)) {
            Patient patient = new Patient();
            patient.setUser(savedUser);
            patient.setFullName(request.getFullName() != null ? request.getFullName() : request.getUsername());
            patient.setDateOfBirth(request.getDateOfBirth());
            patient.setGender(request.getGender() != null ? request.getGender() : "Other");
            patient.setBloodGroup(request.getBloodGroup());
            patientRepository.save(patient);
        } else if ("DOCTOR".equals(role)) {
            Doctor doctor = new Doctor();
            doctor.setUser(savedUser);
            doctor.setFullName(request.getFullName() != null ? request.getFullName() : request.getUsername());
            doctor.setSpecialization(request.getSpecialization() != null ? request.getSpecialization() : "General Medicine");
            doctor.setContactNumber(request.getContactNumber());
            doctorRepository.save(doctor);
        }

        var userDetails = userDetailsService.loadUserByUsername(savedUser.getUsername());
        String jwtToken = jwtService.generateToken(userDetails);

        return new AuthResponse(jwtToken, savedUser.getUsername(), savedUser.getRole(), savedUser.getId());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        var userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String jwtToken = jwtService.generateToken(userDetails);

        return new AuthResponse(jwtToken, user.getUsername(), user.getRole(), user.getId());
    }
}
