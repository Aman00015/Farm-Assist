import React, { useState, useEffect } from 'react';
import { TrendingUp, MapPin, Wheat, AlertCircle, CheckCircle, Loader, Download, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { yieldApi } from '../services/yieldApi';
import { generateYieldReport } from '../utils/pdfGenerator'; // We'll create this utility

const YieldPredictionPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    crop: '',
    state: '',
    area: '',
    fertilizer: '',
    pesticide: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelStatus, setModelStatus] = useState(false);
  const [availableData, setAvailableData] = useState({ crops: [], states: [] });
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState(false);
  const [autoTraining, setAutoTraining] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  // Check backend health on component mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const health = await yieldApi.healthCheck();
      setBackendStatus(true);
      await checkModelStatus();
      await loadAvailableData();
    } catch (err) {
      setBackendStatus(false);
      setError('Backend server is not running. Please start the Flask server on port 5000.');
    }
  };

  const checkModelStatus = async () => {
    try {
      const status = await yieldApi.getStatus();
      setModelStatus(status.yield_model?.is_trained || false);
    } catch (err) {
      console.error('Error checking model status:', err);
    }
  };

  const loadAvailableData = async () => {
    try {
      const cropsData = await yieldApi.getAvailableCrops();
      const statesData = await yieldApi.getAvailableStates();
      
      if (cropsData.crops && statesData.states) {
        setAvailableData({
          crops: cropsData.crops,
          states: statesData.states
        });
      }
    } catch (err) {
      console.error('Error loading available data:', err);
      // Set default options if API fails
      setAvailableData({
        crops: ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane'],
        states: ['Punjab', 'Maharashtra', 'Karnataka', 'Uttar Pradesh', 'Tamil Nadu']
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!backendStatus) {
      setError('Backend server is not available. Please start the Flask server.');
      return;
    }

    // Validate all fields are filled
    if (!formData.crop || !formData.state || !formData.area || !formData.fertilizer || !formData.pesticide) {
      setError('Please fill all fields');
      return;
    }

    // Validate numeric fields
    const area = parseFloat(formData.area);
    const fertilizer = parseFloat(formData.fertilizer);
    const pesticide = parseFloat(formData.pesticide);
    
    if (isNaN(area) || isNaN(fertilizer) || isNaN(pesticide)) {
      setError('Area, fertilizer, and pesticide must be valid numbers');
      return;
    }

    if (area <= 0 || fertilizer < 0 || pesticide < 0) {
      setError('Area must be positive, fertilizer and pesticide must be non-negative');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);
      
      // Show auto-training message if model is not trained
      if (!modelStatus) {
        setAutoTraining(true);
      }

      const predictionResult = await yieldApi.predictYield({
        crop: formData.crop,
        state: formData.state,
        area: area,
        fertilizer: fertilizer,
        pesticide: pesticide
      });
      
      if (predictionResult.success) {
        setResult({
          crop: formData.crop,
          state: formData.state,
          area: area,
          fertilizer: fertilizer,
          pesticide: pesticide,
          predictedYield: predictionResult.prediction.predicted_yield_per_hectare,
          production: predictionResult.prediction.total_production,
          units: predictionResult.prediction.units,
          modelWasAutoTrained: predictionResult.model_was_auto_trained,
          recommendations: [
            'Apply organic fertilizer 2 weeks before sowing',
            'Monitor soil moisture levels regularly',
            'Consider drip irrigation for better water management',
            'Test soil pH and adjust if necessary',
            'Implement crop rotation for better yield'
          ],
          predictionDate: new Date().toLocaleDateString(),
          predictionTime: new Date().toLocaleTimeString()
        });
        
        // Update model status after successful prediction
        if (predictionResult.model_was_auto_trained) {
          setModelStatus(true);
        }
      } else {
        setError(predictionResult.error || 'Prediction failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Failed to get prediction. Please check your inputs and try again.');
    } finally {
      setLoading(false);
      setAutoTraining(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleReset = () => {
    setFormData({
      crop: '',
      state: '',
      area: '',
      fertilizer: '',
      pesticide: ''
    });
    setResult(null);
    setError('');
  };

  const handleDownloadReport = async () => {
    if (!result) return;
    
    try {
      setGeneratingReport(true);
      await generateYieldReport(result);
    } catch (err) {
      setError('Failed to generate report. Please try again.');
      console.error('Report generation error:', err);
    } finally {
      setGeneratingReport(false);
    }
  };

  if (!backendStatus) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Backend Server Not Running</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Please start the Flask backend server on port 5000.
          </p>
          <Button onClick={checkBackendHealth}>
            Retry Connection
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <TrendingUp className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">
          {t('predictYield') || 'Yield Prediction'}
        </h1>
        <p className="text-lg text-gray-600">
          {t('getAccurateYield') || 'Get accurate yield predictions based on your farm inputs'}
        </p>
      </div>

      {autoTraining && (
        <Card className="p-6 border-blue-200 bg-blue-50">
          <div className="flex items-center text-blue-800">
            <Loader className="h-5 w-5 mr-2 animate-spin" />
            <span>Training model for the first time. This may take a few seconds...</span>
          </div>
        </Card>
      )}

      {error && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-center text-red-800">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center text-lg font-medium text-gray-900 dark:text-white mb-3">
                <Wheat className="mr-2 h-5 w-5 text-green-600" />
                Select Crop
              </label>
              <select
                name="crop"
                value={formData.crop}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Choose a crop...</option>
                {availableData.crops.map((crop) => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center text-lg font-medium text-gray-900 dark:text-white mb-3">
                <MapPin className="mr-2 h-5 w-5 text-green-600" />
                Select State
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Choose a state...</option>
                {availableData.states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-lg font-medium text-gray-900 dark:text-white mb-3 block">
                Area (hectares)
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                placeholder="e.g., 2.5"
                step="0.1"
                min="0.1"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="text-lg font-medium text-gray-900 dark:text-white mb-3 block">
                Fertilizer (kg)
              </label>
              <input
                type="number"
                name="fertilizer"
                value={formData.fertilizer}
                onChange={handleInputChange}
                placeholder="e.g., 50"
                step="0.1"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label className="text-lg font-medium text-gray-900 dark:text-white mb-3 block">
                Pesticide (litres)
              </label>
              <input
                type="number"
                name="pesticide"
                value={formData.pesticide}
                onChange={handleInputChange}
                placeholder="e.g., 10"
                step="0.1"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                required
              />
            </div>

            <div className="flex space-x-4 ">
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Predicting Yield...
                  </span>
                ) : (
                  'Predict Yield'
                )}
              </Button>
              
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </Button>
            </div>

            {!modelStatus && !loading && (
              <p className="text-sm text-blue-600 text-center">
                💡 First-time prediction will automatically train the model
              </p>
            )}
          </form>
        </Card>

        {/* Results */}
        {result && (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Yield Prediction Results
              </h3>
              <Button
                onClick={handleDownloadReport}
                disabled={generatingReport}
                size="sm"
                className="flex items-center space-x-2"
              >
                {generatingReport ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>{generatingReport ? 'Generating...' : 'Download PDF'}</span>
              </Button>
            </div>
            
            <div className="space-y-4">
              {result.modelWasAutoTrained && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">
                    ✅ Model was automatically trained for this prediction
                  </p>
                </div>
              )}
              
              {/* Prediction Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {result.predictedYield} {result.units}
                  </div>
                  <div className="text-sm text-gray-600">Yield per hectare</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {result.production} {result.units}
                  </div>
                  <div className="text-sm text-gray-600">Total production</div>
                </div>
              </div>
              
              {/* Input Summary */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-gray-600" />
                  Farm Input Summary
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Crop:</span>
                    <span className="font-medium ml-2  dark:text-black">{result.crop}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">State:</span>
                    <span className="font-medium ml-2 dark:text-black">{result.state}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Area:</span>
                    <span className="font-medium ml-2 dark:text-black">{result.area} hectares</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fertilizer:</span>
                    <span className="font-medium ml-2 dark:text-black">{result.fertilizer} kg</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Pesticide:</span>
                    <span className="font-medium ml-2 dark:text-black">{result.pesticide} litres</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium ml-2 dark:text-black">{result.predictionDate}</span>
                  </div>
                </div>
              </div>
              
              {/* Recommendations */}
              <div>
                <h4 className="font-medium dark:text-white">Recommendations:</h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-green-100 text-green-600 rounded-full w-2 h-2 mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-600">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {!result && (
          <Card className="p-6 flex items-center justify-center min-h-[400px]">
            <div className="text-center text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Fill the form and predict yield to see results</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default YieldPredictionPage;