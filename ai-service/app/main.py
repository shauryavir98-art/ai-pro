import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="AI Healthcare Disease Prediction API",
    description="FastAPI service for predictions & model evaluations with Explainable AI summaries",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Patient Input Schema
class PatientDataInput(BaseModel):
    age: int = Field(..., example=45)
    gender: int = Field(..., description="0 for Female, 1 for Male", example=1)
    systolic_bp: int = Field(..., example=130)
    diastolic_bp: int = Field(..., example=85)
    cholesterol: int = Field(..., description="1: Normal, 2: Above Normal, 3: Well Above Normal", example=2)
    glucose: int = Field(..., description="1: Normal, 2: Above Normal, 3: Well Above Normal", example=1)
    bmi: float = Field(..., example=26.4)
    smoking: int = Field(..., description="0: No, 1: Yes", example=0)
    physical_activity: int = Field(..., description="0: No, 1: Yes", example=1)
    heart_rate: int = Field(..., example=72)

# Load Models & Scalers
models = {}
scalers = {}
metadata = {}

DISEASES = ["diabetes", "heart_disease", "hypertension"]
MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")

def load_ml_resources():
    for disease in DISEASES:
        model_path = os.path.join(MODELS_DIR, f"{disease}_model.joblib")
        scaler_path = os.path.join(MODELS_DIR, f"{disease}_scaler.joblib")
        meta_path = os.path.join(MODELS_DIR, f"{disease}_metadata.joblib")
        
        if os.path.exists(model_path) and os.path.exists(scaler_path) and os.path.exists(meta_path):
            models[disease] = joblib.load(model_path)
            scalers[disease] = joblib.load(scaler_path)
            metadata[disease] = joblib.load(meta_path)
        else:
            print(f"Warning: Model or resources for {disease} not found. Run model training first.")

# Initial load
load_ml_resources()

def compute_explainability(disease: str, raw_features: np.ndarray, feature_names: List[str]) -> List[Dict[str, Any]]:
    """
    Computes a simplified local feature contribution (SHAP-like) based on how far 
    each feature deviates from the normal/optimal baseline.
    """
    # Baselines (optimal healthy values)
    baselines = {
        "age": 30.0,
        "gender": 0.5,
        "systolic_bp": 120.0,
        "diastolic_bp": 80.0,
        "cholesterol": 1.0,
        "glucose": 1.0,
        "bmi": 22.0,
        "smoking": 0.0,
        "physical_activity": 1.0,
        "heart_rate": 72.0
    }
    
    # Feature weights (representing model coefficient significance)
    importance_weights = {
        "diabetes": {
            "age": 0.15, "gender": 0.05, "systolic_bp": 0.05, "diastolic_bp": 0.05,
            "cholesterol": 0.10, "glucose": 0.35, "bmi": 0.25, "smoking": 0.05,
            "physical_activity": -0.15, "heart_rate": 0.05
        },
        "heart_disease": {
            "age": 0.15, "gender": 0.08, "systolic_bp": 0.25, "diastolic_bp": 0.10,
            "cholesterol": 0.20, "glucose": 0.08, "bmi": 0.10, "smoking": 0.20,
            "physical_activity": -0.12, "heart_rate": 0.12
        },
        "hypertension": {
            "age": 0.12, "gender": 0.05, "systolic_bp": 0.35, "diastolic_bp": 0.30,
            "cholesterol": 0.08, "glucose": 0.05, "bmi": 0.15, "smoking": 0.05,
            "physical_activity": -0.10, "heart_rate": 0.08
        }
    }
    
    weights = importance_weights.get(disease, importance_weights["diabetes"])
    contributions = []
    
    for i, name in enumerate(feature_names):
        val = raw_features[i]
        base = baselines[name]
        
        # Calculate deviation direction
        if name == "physical_activity":
            # For exercise, 0 is bad, 1 is good
            dev = -1.0 if val == 0 else 0.0
        elif name == "gender":
            dev = 0.0
        else:
            dev = max(0.0, (val - base) / (base if base > 0 else 1.0))
            
        impact = dev * weights[name]
        contributions.append({
            "feature": name,
            "value": float(val),
            "contribution": round(float(impact), 4)
        })
        
    return contributions

@app.get("/")
def read_root():
    return {
        "status": "Healthy",
        "message": "Healthcare Prediction & Explainable AI Service is Online",
        "available_diseases": DISEASES,
        "models_loaded": list(models.keys())
    }

@app.post("/predict/{disease}")
def predict(disease: str, input_data: PatientDataInput):
    # Refresh models if they weren't loaded initially
    if not models:
        load_ml_resources()

    if disease not in DISEASES:
        raise HTTPException(status_code=400, detail=f"Invalid disease. Choose from {DISEASES}")
        
    if disease not in models:
        raise HTTPException(status_code=503, detail=f"Model for {disease} is not loaded. Train the models first.")
        
    # Extract features
    features_dict = input_data.model_dump()
    feature_names = list(features_dict.keys())
    raw_vals = np.array([features_dict[k] for k in feature_names])
    
    model = models[disease]
    scaler = scalers[disease]
    meta = metadata[disease]
    
    # Scale and predict
    if meta["best_model_name"] == "XGBoost":
        # XGBoost was trained on raw features
        input_df = pd.DataFrame([raw_vals], columns=feature_names)
        prob = float(model.predict_proba(input_df)[0][1])
        prediction = int(model.predict(input_df)[0])
    else:
        # Logistic Regression, SVM, RF were trained on scaled features
        scaled_vals = scaler.transform([raw_vals])
        prob = float(model.predict_proba(scaled_vals)[0][1])
        prediction = int(model.predict(scaled_vals)[0])

    # Explainable AI SHAP simulation
    shap_vals = compute_explainability(disease, raw_vals, feature_names)

    return {
        "disease": disease,
        "prediction": prediction,
        "confidence_score": round(prob * 100, 2),
        "model_used": meta["best_model_name"],
        "shap_values": shap_vals
    }

@app.get("/metrics")
def get_metrics():
    if not metadata:
        load_ml_resources()
        
    if not metadata:
        raise HTTPException(status_code=503, detail="Model metadata is not loaded. Train models first.")
        
    return {disease: metadata[disease] for disease in metadata}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
