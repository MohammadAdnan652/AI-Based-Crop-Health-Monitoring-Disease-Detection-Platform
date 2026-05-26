# AI Based Crop Health Monitoring And Disease Detection System

A crop monitoring and disease detection platform built using AI, computer vision, and modern web technologies.  
The system helps detect crop diseases, analyze plant health, and provide farming recommendations using deep learning models and real-time analytics.

---
<img width="1879" height="895" alt="image" src="https://github.com/user-attachments/assets/dd890823-b046-4e32-9c8b-8aa63cb1b0c2" />



<img width="1461" height="977" alt="image" src="https://github.com/user-attachments/assets/3cb683c4-0805-4d9f-98be-33f281288c58" />



<img width="1594" height="958" alt="image" src="https://github.com/user-attachments/assets/4bc8a14b-6fc4-4ca9-851b-c1d9fa325ee6" />



<img width="1708" height="903" alt="Screenshot 2026-05-25 220835" src="https://github.com/user-attachments/assets/4bc090f3-043e-4343-819d-3951476f7db4" />



<img width="1538" height="941" alt="Screenshot 2026-05-25 220857" src="https://github.com/user-attachments/assets/a4c75a6f-88e6-47d1-98c9-2d986820b0ed" />
















--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Features

- Crop disease detection
- Healthy vs unhealthy crop classification
- Disease severity analysis
- Infected region detection using YOLOv8
- Smart treatment recommendations
- Real-time monitoring dashboard
- IoT sensor integration
- Drone image support
- AI farming assistant
- Analytics and reporting

---

# Supported Crops

- Tomato
- Potato
- Rice
- Wheat
- Corn
- Cotton
- Sugarcane
- Apple
- Mango

---

# Tech Stack

## Backend
- FastAPI
- Python
- Redis
- Celery

## Frontend
- React.js / Next.js
- Tailwind CSS
- TypeScript

## AI Models
- YOLOv8
- EfficientNet
- ResNet
- Vision Transformer (ViT)

## Database
- PostgreSQL
- MongoDB
- Redis

## DevOps
- Docker
- Kubernetes
- MLflow
- Prometheus
- Grafana

---

# Project Structure

```text
smart-agriculture-platform/
│
├── backend/
├── frontend/
├── ai_engine/
├── datasets/
├── docker/
├── kubernetes/
└── docs/
```

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/yourusername/smart-agriculture-platform.git

cd smart-agriculture-platform
```

---

# 2. Create Virtual Environment

## Windows

```bash
python -m venv venv

venv\Scripts\activate
```

## Linux / Mac

```bash
python3 -m venv venv

source venv/bin/activate
```

---

# 3. Install Backend Dependencies

```bash
cd backend

pip install -r requirements.txt
```

---

# 4. Setup Environment Variables

Create a `.env` file inside the backend folder.

```env
POSTGRES_URL=postgresql://user:password@localhost:5432/agrodb

MONGO_URI=mongodb://localhost:27017/agrodb

REDIS_URL=redis://localhost:6379

JWT_SECRET_KEY=your_secret_key
```

---

# 5. Run Backend Server

```bash
uvicorn app.main:app --reload
```

Backend will run on:

```text
http://localhost:8000
```

Swagger API docs:

```text
http://localhost:8000/docs
```

---

# 6. Install Frontend Dependencies

Open a new terminal:

```bash
cd frontend

npm install
```

---

# 7. Run Frontend

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:3000
```

---

# 8. Run with Docker

```bash
docker-compose up --build
```

---

# API Modules

## Authentication APIs
- Register
- Login
- Refresh Token
- Logout

## Prediction APIs
- Upload Image
- Disease Detection
- Severity Analysis
- Recommendation Generation

## Analytics APIs
- Dashboard Summary
- Disease Trends
- Heatmaps

## Sensor APIs
- IoT Upload
- Monitoring
- Alerts

---

# Security Features

- JWT Authentication
- OAuth2
- Role-based access control
- API rate limiting
- Secure file uploads

---

# Datasets

- PlantVillage Dataset
- PlantDoc Dataset
- Rice Leaf Disease Dataset
- Kaggle Crop Disease Datasets

---

# Future Improvements

- Mobile app
- Weather integration
- WhatsApp alerts
- Offline mode
- Voice assistant
- Explainable AI

---

# License

MIT License
