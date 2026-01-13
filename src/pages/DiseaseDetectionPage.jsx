import React, { useState, useRef } from "react";
import {
  Upload,
  Camera,
  AlertCircle,
  CheckCircle,
  Leaf,
  Thermometer,
} from "lucide-react";

const DiseaseDetection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [modelStatus, setModelStatus] = useState(false);
  const fileInputRef = useRef(null);

  // Check model status on component mount
  React.useEffect(() => {
    checkModelStatus();
  }, []);

  const checkModelStatus = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(
        `${baseUrl}/api/disease-detection/status`
      );
      const data = await response.json();
      setModelStatus(data.is_loaded);
    } catch (err) {
      console.error("Error checking model status:", err);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPEG, PNG, etc.)");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image size should be less than 10MB");
      return;
    }

    setSelectedFile(file);
    setError("");
    setResult(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(
        `${baseUrl}/api/disease-detection/predict`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || "Prediction failed");
      }
    } catch (err) {
      setError("Failed to connect to server. Please try again.");
      console.error("Prediction error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError("");
  };

  const getSeverityColor = (disease) => {
    const severeDiseases = ["Late Blight", "Early Blight", "Bacterial Spot"];
    return severeDiseases.includes(disease) ? "red" : "yellow";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full mb-6">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Plant Disease Detection
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Upload a photo of your plant leaves to detect diseases and get
            treatment recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Upload Section - Glass Effect */}
          <div className="glass-container rounded-2xl shadow-lg backdrop-blur-sm border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 dark:text-white">
                Upload Plant Image
            </h2>

            {!previewUrl ? (
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer glass-upload ${
                  dragActive
                    ? "border-green-400/50 bg-white/20"
                    : "border-gray-300/30 hover:border-green-400/40"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleFileSelect}
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                    <Camera className="h-8 w-8 text-gray-600" />
                  </div>
                  <p className="text-gray-700 mb-2 dark:text-white">Drag & drop image here</p>
                  <p className="text-sm text-gray-500 mb-4 dark:text-white">
                    or click to select
                  </p>
                  <button className="glass-button px-6 py-3 border-2 border-green-400/30 text-green-700 font-medium rounded-xl hover:bg-white/20 transition-all">
                    <Upload className="h-5 w-5 mr-2" />
                    Select Image
                  </button>
                  <p className="text-xs text-gray-400 mt-3">
                    Supports JPG, PNG • Max 10MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="glass-preview rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-full h-64 object-cover"
                    />
                  </div>
                  <button
                    onClick={handleNewImage}
                    className="absolute top-3 right-3 bg-red-500/90 text-white p-2 rounded-full hover:bg-red-600 backdrop-blur-sm"
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {selectedFile.name}
                </p>
                <button
                  onClick={handlePredict}
                  disabled={loading}
                  className="glass-primary-button w-full py-3 px-4 rounded-xl font-medium disabled:bg-gray-400/50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-shadow"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 "></div>
                      Analyzing Image...
                    </span>
                  ) : (
                    "Detect Disease"
                  )}
                </button>
              </div>
            )}

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>

          {/* Results Section - Glass Effect */}
          <div className="glass-container rounded-2xl shadow-lg backdrop-blur-sm border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 dark:text-white">
              Detection Results
            </h2>

            {error && (
              <div className="glass-error rounded-xl p-4 mb-4">
                <div className="flex items-center text-red-700">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {error}
                </div>
              </div>
            )}

            {result ? (
              <div className="space-y-6">
                {/* Prediction Result */}
                <div className="glass-result rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                      Detection Result
                    </h3>
                    <span
                      className={`glass-severity px-3 py-1 rounded-full text-sm font-medium ${
                        getSeverityColor(result.prediction.disease) === "red"
                          ? "glass-severe"
                          : "glass-moderate"
                      }`}
                    >
                      {getSeverityColor(result.prediction.disease) === "red"
                        ? "Severe"
                        : "Moderate"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="glass-info">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Crop</p>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {result.prediction.crop}
                      </p>
                    </div>
                    <div className="glass-info">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Disease</p>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {result.prediction.disease}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-300/20">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Confidence</span>
                    <span className="font-medium text-green-600 bg-green-400/10 px-3 py-1 rounded-full">
                      {result.prediction.confidence}%
                    </span>
                  </div>
                </div>

                {/* Treatment Recommendations */}
                <div className="glass-treatment rounded-xl p-4">
                  <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-3 flex items-center">
                    <Thermometer className="h-5 w-5 mr-2 text-orange-500" />
                    Treatment Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {result.treatment.map((treatment, index) => (
                      <li key={index} className="flex items-start">
                        <span className="glass-bullet mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700 dark:text-gray-300">{treatment}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={handleNewImage}
                  className="glass-secondary-button w-full py-2 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
                >
                  Analyze Another Image
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="glass-empty w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500">
                  Upload a plant image to see detection results
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-medium text-blue-900 mb-3">
            💡 Tips for Best Results
          </h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Take photos in good lighting conditions</li>
            <li>• Focus on the affected leaves or areas</li>
            <li>• Ensure the image is clear and not blurry</li>
            <li>• Include multiple leaves if possible for better analysis</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;
