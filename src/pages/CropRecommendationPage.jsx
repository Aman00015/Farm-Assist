import React, { useState, useEffect } from "react";
import {
  Sprout,
  MapPin,
  Layers,
  Sun,
  Droplets,
  TrendingUp,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import Card from "../components/Card";
import Button from "../components/Button";

const CropRecommendationPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    region: "", // This will be mapped to 'state' in backend
    area: "1.0", // Added area field
    fertilizer: "50.0", // Added fertilizer field
    pesticide: "10.0", // Added pesticide field
    soilType: "",
    season: "",
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableStates, setAvailableStates] = useState([]);
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

  // Fetch available states on component mount
  useEffect(() => {
    fetchAvailableStates();
  }, []);

  const fetchAvailableStates = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/available-states`);
      const data = await response.json();
      if (data.states) {
        setAvailableStates(data.states);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      // Fallback to default regions if API fails
      setAvailableStates([
        "North India",
        "South India",
        "West India",
        "East India",
        "Central India",
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/recommend-crops`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Add icon to each recommendation
        const recommendationsWithIcons = result.recommendations.map((crop) => ({
          ...crop,
          icon: getCropIcon(crop.name),
          suitabilityDisplay:
            crop.suitability_percentage ?? crop.suitability ?? null,
          expectedYieldDisplay:
            crop.expected_yield_range ?? crop.expectedYield ?? null,
          tipsDisplay: crop.cultivation_tips ?? crop.tips ?? null,
        }));
        setRecommendations(recommendationsWithIcons);
      } else {
        alert(result.error || "Error getting recommendations");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const getCropIcon = (cropName) => {
    const icons = {
      Rice: "🌾",
      Wheat: "🌾",
      Maize: "🌽",
      Cotton: "🧵",
      Sugarcane: "🎋",
      Soybean: "🫘",
      Potato: "🥔",
      Tomato: "🍅",
      Corn: "🌽",
      Barley: "🌾",
    };
    return icons[cropName] || "🌱";
  };

  const soilTypes = [
    "Alluvial",
    "Black",
    "Red",
    "Laterite",
    "Desert",
    "Mountain",
  ];
  const seasons = ["Kharif (Monsoon)", "Rabi (Winter)", "Zaid (Summer)"];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Sprout className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t("recommendCrop")}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t("getPersonalizedCrops")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center text-lg font-medium text-gray-900 dark:text-white mb-3">
                  <MapPin className="mr-2 h-5 w-5 text-green-600" />
                  {t("selectRegion")}
                </label>
                <select
                  value={formData.region}
                  onChange={(e) =>
                    setFormData({ ...formData, region: e.target.value })
                  }
                  className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">{t("selectRegion")}</option>
                  {availableStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center text-lg font-medium text-gray-900 dark:text-white mb-3">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                  Area (hectares)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                  className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="e.g., 2.5"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-lg font-medium text-gray-900 mb-3 dark:text-white">
                  <Sun className="mr-2 h-5 w-5 text-green-600" />
                  Fertilizer (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.fertilizer}
                  onChange={(e) =>
                    setFormData({ ...formData, fertilizer: e.target.value })
                  }
                  className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="e.g., 50"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-lg font-medium text-gray-900 mb-3 dark:text-white">
                  <Droplets className="mr-2 h-5 w-5 text-green-600" />
                  Pesticide (litres)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.pesticide}
                  onChange={(e) =>
                    setFormData({ ...formData, pesticide: e.target.value })
                  }
                  className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="e.g., 10"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-lg font-medium text-gray-900 mb-3 dark:text-white">
                  <Layers className="mr-2 h-5 w-5 text-green-600" />
                  {t("selectSoilType")}
                </label>
                <select
                  value={formData.soilType}
                  onChange={(e) =>
                    setFormData({ ...formData, soilType: e.target.value })
                  }
                  className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                >
                  <option value="">{t("selectSoilType")} (Optional)</option>
                  {soilTypes.map((soil) => (
                    <option key={soil} value={soil}>
                      {soil}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center text-lg font-medium text-gray-900 mb-3 dark:text-white">
                  <Sun className="mr-2 h-5 w-5 text-green-600" />
                  {t("selectSeason")}
                </label>
                <select
                  value={formData.season}
                  onChange={(e) =>
                    setFormData({ ...formData, season: e.target.value })
                  }
                  className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                >
                  <option value="">{t("selectSeason")} (Optional)</option>
                  {seasons.map((season) => (
                    <option key={season} value={season}>
                      {season}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? t("loading") : t("getSuggestions")}
              </Button>
            </form>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {recommendations.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {t("recommendedCrops")}
              </h3>
              <div className="space-y-4">
                {recommendations.map((crop, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="text-4xl">{getCropIcon(crop.name)}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {crop.name}
                            </h4>
                            <div className="flex items-center space-x-2">
                              {crop.suitabilityDisplay !== null && (
                                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {crop.suitabilityDisplay}% {t("suitable")}
                                </div>
                              )}
                              {crop.confidence && (
                                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                  Confidence:{" "}
                                  {(crop.confidence * 100).toFixed(1)}%
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-600 mb-2 dark:text-white">
                            <strong>{t("expectedYield")}:</strong>{" "}
                            {crop.expectedYieldDisplay}
                          </p>
                          <p className="text-gray-600 text-sm dark:text-white">
                            <strong>Tips:</strong> {crop.tipsDisplay}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropRecommendationPage;
