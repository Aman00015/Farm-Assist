import React from 'react';
import 'leaflet/dist/leaflet.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import YieldPredictionPage from './pages/YieldPredictionPage';
import CropRecommendationPage from './pages/CropRecommendationPage';
import DiseaseDetectionPage from './pages/DiseaseDetectionPage';
import GovtSchemesPage from './pages/GovtSchemesPage';
import ChatbotPage from './pages/ChatbotPage';
import HelpPage from './pages/HelpPage';
import CscLocatorPage from './pages/CscLocatorPage';
import { ThemeProvider } from './contexts/ThemeContext';


function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="yield-prediction" element={<YieldPredictionPage />} />
            <Route path="crop-recommendation" element={<CropRecommendationPage />} />
            <Route path="disease-detection" element={<DiseaseDetectionPage />} />
            <Route path="govt-schemes" element={<GovtSchemesPage />} />
            <Route path="chatbot" element={<ChatbotPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="csc-locator" element={<CscLocatorPage />} />

          </Route>
        </Routes>
      </Router>
    </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;