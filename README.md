# Aegis AI: Disease Prediction & Personalized Healthcare Recommendation System

Aegis AI is a production-ready, full-stack application designed to predict diseases (Diabetes, Heart Disease, Hypertension) and generate personalized recommendations using machine learning models with Explainable AI (SHAP-like contributions).

---

## Folder Structure

```
/
├── ai-service/             # FastAPI + Scikit-learn + XGBoost machine learning API
│   ├── app/                # Server source code (main.py)
│   ├── data/               # Training datasets
│   ├── models/             # Binary model saves
│   └── requirements.txt    # Python dependencies
├── backend/                # Spring Boot + Spring Security (JWT) + JPA orchestration API
│   ├── src/                # Spring Boot source code
│   └── pom.xml             # Maven dependencies
├── frontend/               # React + Tailwind CSS dashboard UI
│   ├── src/                # Vite React pages & components
│   └── package.json        # Frontend configuration
├── database/               # SQL setup
│   └── schema.sql          # DB schema & seed data
├── .env.example            # Environment variables template
└── .gitignore              # Git ignore lists
```

---

## Technology Stack

- **Frontend**: React.js, Tailwind CSS (Vite-based)
- **Backend Orchestrator**: Spring Boot (Java 17), JPA Hibernate, Spring Security + JWT
- **AI Core Service**: Python, FastAPI, Scikit-learn, XGBoost
- **Database**: MySQL

---

## Local Development Setup

### 1. Database Initialization
1. Start your local MySQL server.
2. Run the SQL script located in `database/schema.sql` to initialize tables and add mock login credentials:
   ```sql
   SOURCE database/schema.sql;
   ```

### 2. Python AI Service
1. Navigate to the `ai-service` directory:
   ```bash
   cd ai-service
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Train the ML models:
   ```bash
   python train_models.py
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   FastAPI will be running at `http://localhost:8000`.

### 3. Spring Boot Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Configure credentials in `src/main/resources/application.properties` (or set matching env variables).
3. Build and run the project:
   ```bash
   # Windows PowerShell/CMD:
   mvnw spring-boot:run
   # macOS/Linux:
   ./mvnw spring-boot:run
   ```
   Backend API endpoints will be accessible at `http://localhost:8080`.

### 4. React Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The application UI will run at `http://localhost:5173`.
