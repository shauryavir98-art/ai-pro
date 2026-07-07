# Aegis AI: Verification & Testing Guide

This guide describes how to run tests and verify each module of the Aegis AI application.

---

## 1. Automated Tests

### Python AI Service
We use python's build metrics to verify accuracy. You can verify model performance immediately after running model training:
```bash
cd ai-service
.\venv\Scripts\python train_models.py
```
This will log the metrics for **Logistic Regression**, **Random Forest**, **SVM**, and **XGBoost** for each disease type (Diabetes, Heart Disease, Hypertension), listing:
- Accuracy
- Precision
- Recall
- F1 Score
- ROC-AUC

### Spring Boot Backend
Verify backend compilation and baseline security contexts by running:
```bash
cd backend
mvn test
```

---

## 2. API Endpoint Testing

You can use Curl or Postman to test the backend REST endpoints:

### User Registration
- **URL**: `POST http://localhost:8080/api/auth/register`
- **Body** (JSON):
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "PATIENT",
    "fullName": "John Doe",
    "dateOfBirth": "1990-05-12",
    "gender": "Male",
    "bloodGroup": "O+"
  }
  ```

### User Login
- **URL**: `POST http://localhost:8080/api/auth/login`
- **Body** (JSON):
  ```json
  {
    "username": "john_doe",
    "password": "password123"
  }
  ```
- **Response**: Returns a JWT token. Use this token in the header of subsequent requests: `Authorization: Bearer <your-jwt-token>`.

### Submit Health Entry & Predict
- **URL**: `POST http://localhost:8080/api/predictions/patient/1`
- **Headers**: `Authorization: Bearer <your-jwt-token>`
- **Body** (JSON):
  ```json
  {
    "age": 55,
    "gender": 1,
    "systolicBp": 145,
    "diastolicBp": 95,
    "cholesterol": 2,
    "glucose": 1,
    "bmi": 29.4,
    "smoking": 1,
    "physicalActivity": 0,
    "heartRate": 82
  }
  ```
- **Response**: An array of 3 predictions (Diabetes, Heart Disease, Hypertension) complete with confidence scores, simulated SHAP values, and personalized diet/exercise recommendations.

---

## 3. UI Flow Verification

1. Start all local servers:
   - FastAPI: `uvicorn app.main:app` (Port 8000)
   - Spring Boot: `mvn spring-boot:run` (Port 8080)
   - Vite React: `npm run dev` (Port 5173)
2. Open `http://localhost:5173` in your browser.
3. Toggle between **Light/Dark Mode** (sun/moon icon in the navbar) and observe the smooth style shifts.
4. Log in as a Patient using username `john_patient` and password `password`.
5. Navigate to **New Health Entry** and input patient details (e.g. Age = 60, Glucose = 3, BMI = 30, Systolic BP = 150) and click **Evaluate Patient Profiles**.
6. View the predictions, confidence scores, and local SHAP impact charts instantly.
7. Click **Download PDF Report** to verify client-side print layout works correctly.
8. Log out, and log back in as a Doctor using username `doc_smith` and password `password`.
9. Navigate to **Clinic Analytics** to observe the aggregated flag statistics and risk charts.
