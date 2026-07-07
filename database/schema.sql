-- Database Schema for AI-Based Disease Prediction & Healthcare Recommendation System

-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS healthcare_db;
USE healthcare_db;

-- 1. Users Table (Authentication and Role-based authorization)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'PATIENT', -- PATIENT, DOCTOR, ADMIN
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Patients Table (Demographic profiles linked to users)
CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL, -- Male, Female, Other
    blood_group VARCHAR(5),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Doctors Table (Linked to users)
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    contact_number VARCHAR(15),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Health Records Table (Input parameters for disease prediction)
CREATE TABLE IF NOT EXISTS health_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    age INT NOT NULL,
    gender INT NOT NULL, -- 0 for Female, 1 for Male
    systolic_bp INT NOT NULL, -- e.g. 120
    diastolic_bp INT NOT NULL, -- e.g. 80
    cholesterol INT NOT NULL, -- 1: Normal, 2: Above Normal, 3: Well Above Normal
    glucose INT NOT NULL, -- 1: Normal, 2: Above Normal, 3: Well Above Normal
    bmi FLOAT NOT NULL,
    smoking INT NOT NULL, -- 0: No, 1: Yes
    physical_activity INT NOT NULL, -- 0: No, 1: Yes
    heart_rate INT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Predictions Table (Outputs from AI Models)
CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    health_record_id INT NOT NULL,
    disease_type VARCHAR(50) NOT NULL, -- 'Diabetes', 'Heart Disease', 'Hypertension'
    prediction_result BOOLEAN NOT NULL, -- 0: Healthy, 1: At Risk
    confidence_score FLOAT NOT NULL, -- Percentage (e.g. 85.5)
    shap_explanation TEXT, -- JSON holding SHAP values for visualization
    predicted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (health_record_id) REFERENCES health_records(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Recommendations Table (Personalized diet/exercise plans generated based on predictions)
CREATE TABLE IF NOT EXISTS recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prediction_id INT NOT NULL,
    diet_plan TEXT NOT NULL,
    exercise_plan TEXT NOT NULL,
    precautions TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prediction_id) REFERENCES predictions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Initial Seed Data for Testing (Passwords are bcrypt hashed versions of 'password')
INSERT INTO users (username, email, password, role) VALUES
('john_patient', 'john@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8GP.3q3g9a5O.YVqOkyEwX2tI8s81Sg8pXe', 'PATIENT'),
('doc_smith', 'smith@hospital.com', '$2a$10$8.UnVuG9HHgffUDAlk8GP.3q3g9a5O.YVqOkyEwX2tI8s81Sg8pXe', 'DOCTOR'),
('admin_user', 'admin@healthcare.com', '$2a$10$8.UnVuG9HHgffUDAlk8GP.3q3g9a5O.YVqOkyEwX2tI8s81Sg8pXe', 'ADMIN');

INSERT INTO patients (user_id, full_name, date_of_birth, gender, blood_group) VALUES
(1, 'John Doe', '1985-05-15', 'Male', 'O+');

INSERT INTO doctors (user_id, full_name, specialization, contact_number) VALUES
(2, 'Dr. Sarah Smith', 'Cardiology', '+1234567890');
