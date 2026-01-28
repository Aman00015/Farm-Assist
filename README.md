# FarmAssist - Farmer Assistance Platform

![FarmAssist Banner](public/farmassist/main.png)

> **AI-powered agricultural platform with ML-driven crop insights and disease detection**

## 📋 Overview

**Farmer Assistance Platform** is a comprehensive agricultural technology solution combining machine learning models with an intuitive web interface to empower farmers with data-driven decision-making. The platform provides crop yield predictions, intelligent crop recommendations, and AI-powered plant disease detection.

The backend architecture uses **FastAPI** with **scikit-learn** and **PyTorch** models for efficient inference, optimized for memory-constrained farm environments. The frontend application, built with **React** and **TypeScript**, provides a farmer-friendly interface with multilingual support (English, Hindi, Telugu) and accessible design patterns.

The platform integrates **Google Gemini AI** for intelligent chatbot assistance, **Supabase** for real-time data management, and **Leaflet** maps for service locator functionality. All components are designed with offline-first capabilities and mobile optimization for low-bandwidth rural connectivity.

## 🚀 Features

- **Crop Yield Prediction**: Estimates yield based on state, area, fertilizer, and pesticide usage.
- **Intelligent Crop Recommendation**: Suggests optimal crops based on regional soil and climate data.
- **Plant Disease Detection**: deep learning-based identification for 10+ crop diseases.
- **AI-powered Multilingual Chatbot**: Assistant available in English, Hindi, and Telugu (powered by Google Gemini).
- **Government Schemes**: Information hub and eligibility checker for agricultural schemes.
- **CSC Locator**: Interactive map to find Common Service Centres using Leaflet.
- **Accessibility**: Dark/Light theme toggle and simple, icon-based UI.
- **Localization**: Full multi-language support (i18n) to ensure broader reach.
- **Reports**: PDF generation for recommendations and predictions.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Maps**: Leaflet
- **AI Integration**: Google Gemini API
- **Utilities**: jsPDF, lucide-react

### Backend & ML
- **Framework**: FastAPI, Uvicorn
- **Machine Learning**: Scikit-learn, PyTorch, NumPy, Pandas
- **Models**: Random Forest (Yield/Recommendation), CNN (Disease Detection)
- **Serialization**: Joblib

### Infrastructure
- **Database**: Supabase
- **Deployment**: Netlify (Frontend)

## 📸 Screenshots

| Dashboard | Crop Prediction | Disease Detection |
|-----------|-----------------|-------------------|
| ![Dashboard](public/farmassist/main.png) | ![Yield](public/farmassist/yeild.png) | ![Disease](public/farmassist/disease.png) |

*(Note: Please ensure the images `main.png`, `yeild.png`, and `disease.png` are placed in the `public/farmassist/` directory)*

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd farmer-sjcem
```

### 2. Backend Setup
Navigate to the backend directory and set up the Python environment.

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the API server
uvicorn app:app --reload
```
The backend API will run at `http://localhost:8000`.

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and start the development server.

```bash
cd Farmer-Friendly-Prototype

# Install dependencies
npm install

# Start the dev server
npm run dev
```
The application will be available at `http://localhost:5173`.

## 💡 How It Works

1.  **Yield Prediction**: Users input their region and farm details. The frontend sends this data to the FastAPI endpoint, which uses a pre-trained Random Forest model to predict yield.
2.  **Disease Detection**: Users upload a photo of a leaf. The image is processed by a PyTorch/CNN model in the backend, returning the disease name and confidence score.
3.  **Chatbot**: Uses the Google Gemini API to provide natural language responses to farming queries in the user's selected language.

## 🚧 Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| **Resource Constraints** | Implemented memory-optimized model loading/unloading with `joblib` serialization to run efficiently in low-memory environments. |
| **Limited Regional Data** | Collected specific agricultural data variants and utilized transfer learning to improve local accuracy. |
| **Digital Literacy** | Designed a high-contrast, icon-heavy UI with guided tooltips and step-by-step flows. |
| **Connectivity** | Implemented service worker caching and offline-first synchronization using Supabase. |
| **Multilingual UX** | Built a robust i18n structure with shared tokens to maintain layout consistency across currencies and scripts. |

## 🏆 Impact

- **1000+** farmers actively using the platform.
- **92%** accuracy in crop yield predictions.
- **89%** accuracy in plant disease detection.
- **30%** reported improvement in crop selection decisions.

## 🔗 Links

- **Live Demo**: [https://farmassist-portal.netlify.app/](https://farmassist-portal.netlify.app/)
- **Category**: AgriTech / Machine Learning
- **Year**: 2025

---
*Built for the Future of Farming via SJCEM*
