import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

# Ensure directories exist
os.makedirs("models", exist_ok=True)
os.makedirs("data", exist_ok=True)

def generate_synthetic_data(disease_type, n_samples=1000):
    """Generates synthetic patient health data with a realistic target correlation."""
    np.random.seed(42)
    
    # Common features
    age = np.random.randint(18, 85, n_samples)
    gender = np.random.randint(0, 2, n_samples) # 0: Female, 1: Male
    systolic_bp = np.random.randint(90, 180, n_samples)
    diastolic_bp = np.random.randint(60, 110, n_samples)
    cholesterol = np.random.choice([1, 2, 3], size=n_samples, p=[0.7, 0.2, 0.1])
    glucose = np.random.choice([1, 2, 3], size=n_samples, p=[0.7, 0.2, 0.1])
    bmi = np.random.uniform(15.0, 40.0, n_samples)
    smoking = np.random.randint(0, 2, n_samples)
    physical_activity = np.random.choice([0, 1], size=n_samples, p=[0.3, 0.7])
    heart_rate = np.random.randint(60, 100, n_samples)
    
    # Calculate target based on disease type logic
    if disease_type == "diabetes":
        # Risk factors: age, glucose, BMI, physical activity (negative impact)
        risk_score = (age / 85) * 2.0 + (glucose * 2.5) + (bmi / 40) * 3.0 - physical_activity * 1.5
        noise = np.random.normal(0, 1.0, n_samples)
        target = (risk_score + noise > 5.5).astype(int)
        
    elif disease_type == "heart_disease":
        # Risk factors: age, systolic_bp, cholesterol, smoking, physical activity (negative)
        risk_score = (age / 85) * 2.0 + (systolic_bp / 180) * 3.0 + cholesterol * 2.0 + smoking * 1.5 - physical_activity * 1.0
        noise = np.random.normal(0, 1.0, n_samples)
        target = (risk_score + noise > 6.0).astype(int)
        
    else: # hypertension
        # Risk factors: age, diastolic_bp, BMI, physical activity (negative)
        risk_score = (age / 85) * 1.5 + (systolic_bp / 120) * 2.5 + (diastolic_bp / 80) * 2.5 + (bmi / 40) * 1.5 - physical_activity * 1.0
        noise = np.random.normal(0, 1.0, n_samples)
        target = (risk_score + noise > 6.5).astype(int)

    df = pd.DataFrame({
        "age": age,
        "gender": gender,
        "systolic_bp": systolic_bp,
        "diastolic_bp": diastolic_bp,
        "cholesterol": cholesterol,
        "glucose": glucose,
        "bmi": bmi,
        "smoking": smoking,
        "physical_activity": physical_activity,
        "heart_rate": heart_rate,
        "target": target
    })
    
    return df

def train_and_evaluate(disease_name):
    print(f"\n--- Training Models for {disease_name.upper()} Prediction ---")
    df = generate_synthetic_data(disease_name)
    df.to_csv(f"data/{disease_name}_dataset.csv", index=False)
    
    X = df.drop(columns=["target"])
    y = df["target"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Save the scaler
    joblib.dump(scaler, f"models/{disease_name}_scaler.joblib")
    
    models = {
        "Logistic Regression": LogisticRegression(random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "SVM": SVC(probability=True, random_state=42),
        "XGBoost": XGBClassifier(use_label_encoder=False, eval_metric="logloss", random_state=42)
    }
    
    best_f1 = 0
    best_model_name = ""
    best_model = None
    results = {}

    for name, model in models.items():
        # XGBoost doesn't strictly require scaling, but we use scaled for consistency or raw
        if name == "XGBoost":
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
            y_prob = model.predict_proba(X_test)[:, 1]
        else:
            model.fit(X_train_scaled, y_train)
            y_pred = model.predict(X_test_scaled)
            y_prob = model.predict_proba(X_test_scaled)[:, 1]
            
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred)
        rec = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        auc = roc_auc_score(y_test, y_prob)
        
        print(f"{name} -> Accuracy: {acc:.4f}, Precision: {prec:.4f}, Recall: {rec:.4f}, F1: {f1:.4f}, ROC-AUC: {auc:.4f}")
        
        results[name] = {
            "accuracy": acc,
            "precision": prec,
            "recall": rec,
            "f1_score": f1,
            "roc_auc": auc
        }
        
        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_model = model

    print(f"--> Best Model selected: {best_model_name} with F1-Score: {best_f1:.4f}")
    
    # Save the best model and model name
    joblib.dump(best_model, f"models/{disease_name}_model.joblib")
    
    # Save training metadata/results
    joblib.dump({
        "best_model_name": best_model_name,
        "metrics": results
    }, f"models/{disease_name}_metadata.joblib")

if __name__ == "__main__":
    for disease in ["diabetes", "heart_disease", "hypertension"]:
        train_and_evaluate(disease)
    print("\nModel Training Complete! All model files saved to `models/` folder.")
