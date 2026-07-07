# Cloud Deployment Guide (No Localhost)

To launch Aegis AI as a fully accessible cloud application without using localhost, follow this systematic guide.

---

## 1. Database Deployment (Railway Cloud)
1. Go to [Railway.app](https://railway.app/) and sign in.
2. Click **New Project** → Select **Provision MySQL**.
3. Once initialized, go to the MySQL service variables to view public connection settings:
   - `MYSQLHOST` (Host)
   - `MYSQLPORT` (Port)
   - `MYSQLDATABASE` (Database name)
   - `MYSQLUSER` (User, usually 'root')
   - `MYSQLPASSWORD` (Password)
4. Use a SQL client (DBeaver, MySQL Workbench, or CLI) to run the `database/schema.sql` script against the Railway database to initialize the tables and seed data.

---

## 2. AI API Deployment (Render Cloud)
1. Commit the `ai-service` folder code to a GitHub repository.
2. Sign in to [Render.com](https://render.com/).
3. Click **New +** → Select **Web Service**.
4. Connect your GitHub repository.
5. In the settings, configure:
   - **Root Directory**: `ai-service`
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt && python train_models.py` (This will train models during Render build time!)
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Once deployed, Render will provide a public URL like `https://aegis-ai-service.onrender.com`. Copy this URL.

---

## 3. Backend Deployment (Render Cloud)
1. Push the `backend` folder code to your GitHub repository.
2. Go to Render, click **New +** → Select **Web Service**.
3. Connect your GitHub repository.
4. Configure:
   - **Root Directory**: `backend`
   - **Runtime**: `Java` (Ensure Java 17+ environment is selected)
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/system-0.0.1-SNAPSHOT.jar`
5. In the **Environment** section, add the following variables:
   - `DATABASE_HOST` = (Your Railway host URL)
   - `DATABASE_PORT` = `3306`
   - `DATABASE_NAME` = `railway` (or database name configured on Railway)
   - `DATABASE_USER` = `root`
   - `DATABASE_PASSWORD` = (Your Railway database password)
   - `AI_SERVICE_URL` = `https://aegis-ai-service.onrender.com` (Your Render AI Service URL)
   - `JWT_SECRET` = (A secure random 64-character hex string)
6. Save and deploy. Render will provide a public URL like `https://aegis-backend.onrender.com`.

---

## 4. Frontend Deployment (Vercel)
1. Push the `frontend` folder code to your GitHub repository.
2. Sign in to [Vercel](https://vercel.com/).
3. Click **Add New** → **Project**.
4. Import your GitHub repository.
5. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variable:
   - `VITE_API_BASE_URL` = `https://aegis-backend.onrender.com` (Your public Render Spring Boot URL)
7. Click **Deploy**. Vercel will provide your live public web application link (e.g., `https://aegis-health.vercel.app`).
