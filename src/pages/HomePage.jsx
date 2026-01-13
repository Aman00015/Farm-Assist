import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Sprout,
  Shield,
  Building2,
  PlayCircle,
  Cloud,
  Sun,
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  MapPin,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import Card from "../components/Card";
import Button from "../components/Button";
import GuidedTour from "../components/GuidedTour";
import "./HomePage.css";

const HomePage = () => {
  const { t } = useLanguage();
  const [showTour, setShowTour] = useState(false);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [location, setLocation] = useState(null);

  // Your OpenWeatherMap API key
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  // Get user's location
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    });
  };

  // Fetch weather by coordinates
  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return parseWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather by coordinates:", error);
      throw error;
    }
  };

  // Fetch weather by city name (fallback)
  const fetchWeatherByCity = async (cityName = "New Delhi") => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.cod === "404") {
        throw new Error("City not found");
      }

      return parseWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather by city:", error);
      throw error;
    }
  };

  // Parse weather data from API response
  const parseWeatherData = (data) => {
    const temp = Math.round(data.main.temp);
    const condition = data.weather[0].main;
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = Math.round(data.wind.speed * 10) / 10;
    const location =
      data.name + (data.sys.country ? `, ${data.sys.country}` : "");

    return {
      temperature: temp,
      condition: condition,
      description: description,
      humidity: humidity,
      windSpeed: windSpeed,
      location: location,
      icon: data.weather[0].icon,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      farmingAdvice: generateFarmingAdvice(
        temp,
        humidity,
        condition.toLowerCase()
      ),
    };
  };

  // Generate farming advice based on weather conditions
  const generateFarmingAdvice = (temp, humidity, condition) => {
    if (
      condition.includes("rain") ||
      condition.includes("drizzle") ||
      condition.includes("thunderstorm")
    ) {
      return {
        icon: "🌧",
        title: "Rainy Weather Advisory",
        advice:
          "Good day to avoid field work. Check drainage systems and consider indoor farm maintenance tasks. Ensure proper crop protection.",
      };
    } else if (temp > 35) {
      return {
        icon: "🌡",
        title: "Hot Weather Alert",
        advice:
          "High temperatures detected. Increase irrigation frequency, provide shade for livestock, and avoid midday field work.",
      };
    } else if (temp < 5) {
      return {
        icon: "❄",
        title: "Cold Weather Warning",
        advice:
          "Protect sensitive crops from frost. Consider covering plants or moving potted crops indoors. Check livestock heating.",
      };
    } else if (humidity < 30) {
      return {
        icon: "💨",
        title: "Low Humidity Alert",
        advice:
          "Dry conditions detected. Monitor soil moisture levels closely and consider additional irrigation for sensitive crops.",
      };
    } else if (
      condition.includes("clear") &&
      temp >= 20 &&
      temp <= 25 &&
      humidity >= 40 &&
      humidity <= 70
    ) {
      return {
        icon: "🌱",
        title: "Perfect Growing Conditions",
        advice:
          "Ideal weather for most farming activities. Great time for planting, transplanting, and general field work.",
      };
    } else if (condition.includes("cloud")) {
      return {
        icon: "☁",
        title: "Cloudy Weather",
        advice:
          "Good conditions for outdoor work without direct sun stress. Monitor for potential rain and plan accordingly.",
      };
    } else {
      return {
        icon: "🌤",
        title: "Good Farming Weather",
        advice:
          "Favorable conditions for outdoor farm work. Monitor soil moisture and continue with regular agricultural activities.",
      };
    }
  };

  // Get weather icon component
  const getWeatherIcon = (condition, iconCode) => {
    const iconProps = { className: "w-8 h-8" };

    switch (condition?.toLowerCase()) {
      case "clear":
        return <Sun {...iconProps} className="w-8 h-8 text-yellow-500" />;
      case "clouds":
        return <Cloud {...iconProps} className="w-8 h-8 text-gray-500" />;
      case "rain":
      case "drizzle":
        return <CloudRain {...iconProps} className="w-8 h-8 text-blue-600" />;
      case "thunderstorm":
        return <CloudRain {...iconProps} className="w-8 h-8 text-purple-600" />;
      case "snow":
        return <Cloud {...iconProps} className="w-8 h-8 text-blue-200" />;
      case "mist":
      case "fog":
      case "haze":
        return <Cloud {...iconProps} className="w-8 h-8 text-gray-400" />;
      default:
        return <Sun {...iconProps} className="w-8 h-8 text-yellow-500" />;
    }
  };

  // Load weather data
  useEffect(() => {
    const loadWeather = async () => {
      try {
        setWeatherLoading(true);
        setWeatherError(null);

        let weatherData;

        try {
          const userLocation = await getUserLocation();
          setLocation(userLocation);
          weatherData = await fetchWeatherByCoords(
            userLocation.latitude,
            userLocation.longitude
          );
          console.log("Weather loaded using user location");
        } catch (locationError) {
          console.log("Location access denied or failed, using default city");
          weatherData = await fetchWeatherByCity("New Delhi");
          console.log("Weather loaded using default city");
        }

        setWeather(weatherData);
      } catch (error) {
        console.error("All weather fetch attempts failed:", error);
        setWeatherError("Unable to fetch weather data");

        setWeather({
          temperature: 25,
          condition: "Clear",
          description: "clear sky",
          humidity: 60,
          windSpeed: 3.5,
          location: "Your Location",
          farmingAdvice: {
            icon: "🌱",
            title: "Good Farming Weather",
            advice:
              "Favorable conditions for outdoor farm work. Monitor soil moisture and continue regular activities.",
          },
        });
      } finally {
        setWeatherLoading(false);
      }
    };

    loadWeather();
  }, []);

  // Refresh weather data
  const refreshWeather = () => {
    setWeatherLoading(true);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const quickLinks = [
    {
      title: t("yieldPrediction"),
      description: "Predict crop yields based on soil and weather data",
      href: "/yield-prediction",
      icon: TrendingUp,
      color: "bg-blue-500",
      tourId: "yield-prediction",
    },
    {
      title: t("cropRecommendation"),
      description: "Get crop suggestions for your soil and climate",
      href: "/crop-recommendation",
      icon: Sprout,
      color: "bg-green-500",
      tourId: "crop-recommendation",
    },
    {
      title: t("diseaseDetection"),
      description: "Identify plant diseases from photos",
      href: "/disease-detection",
      icon: Shield,
      color: "bg-red-500",
      tourId: "disease-detection",
    },
    {
      title: t("govtSchemes"),
      description: "Explore government agricultural schemes",
      href: "/govt-schemes",
      icon: Building2,
      color: "bg-purple-500",
      tourId: "govt-schemes",
    },
  ];

  const problems = [
    "Crop losses due to disease misdiagnosis",
    "Low yield predictability affecting planning",
    "Inefficient resource allocation",
    "Limited access to expert agricultural advice",
  ];

  const solutions = [
    {
      icon: TrendingUp,
      title: "Yield Prediction",
      description:
        "AI-powered predictions help you plan better and maximize harvests",
    },
    {
      icon: Shield,
      title: "Disease Detection",
      description: "Instant identification of plant diseases from photos",
    },
    {
      icon: Sprout,
      title: "Crop Recommendation",
      description:
        "Get personalized crop suggestions based on your soil and climate",
    },
  ];

  return (
    <>
      <div className="homepage-wrapper">
        {/* Hero Section - Full Viewport */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <Zap className="badge-icon" />
              <span>AI-Powered Farming Assistant</span>
            </div>
            <h1 className="hero-title">
              <span className="hero-title-line1">Smart Farming</span>
              <span className="hero-title-line2">Assistant</span>
            </h1>
            <p className="hero-description">
              Your digital farming companion for better yields and smarter
              decisions. Harness the power of AI to transform your agricultural
              practices.
            </p>
            <div className="hero-actions">
              <Button
                size="lg"
                className="hero-cta-primary"
                onClick={() => setShowTour(true)}
              >
                <PlayCircle className="cta-icon" />
                Start Guided Tour
              </Button>
              <Link to="/yield-prediction" className="hero-cta-secondary">
                Explore Features
                <ArrowRight className="cta-icon" />
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-icon-wrapper">
              <Sprout className="hero-icon" />
            </div>
          </div>
        </section>

        {/* Problem & Solution Section - Two Column */}
        <section className="problem-solution-section">
          <div className="section-badge">
            <AlertTriangle className="badge-icon" />
            <span>The Problem Every Farmer Faces</span>
          </div>
          <h2 className="section-title">60-70% of Crop Potential is Lost</h2>
          <p className="section-description">
            While you're working hard in the fields, critical decisions are
            being made without the right data. Here's how we fix it.
          </p>

          <div className="problem-solution-grid">
            {/* Problem Card */}
            <div className="problem-card">
              <div className="problem-card-header">
                <AlertTriangle className="problem-icon" />
                <h3>The Reality</h3>
              </div>
              <div className="problem-stats">
                <div className="stat-number">4+ Hours</div>
                <p className="stat-description">
                  Average response time to crop issues, but early detection
                  saves 80% of affected crops.
                </p>
              </div>
              <ul className="problem-list">
                {problems.map((problem, index) => (
                  <li key={index}>
                    <span className="problem-bullet" />
                    {problem}
                  </li>
                ))}
              </ul>
            </div>

            {/* Solution Card */}
            <div className="solution-card">
              <div className="solution-card-header">
                <CheckCircle className="solution-icon" />
                <h3>Our AI-Powered Solution</h3>
              </div>
              <div className="solution-stats">
                <div className="stat-number">24/7</div>
                <p className="stat-description">
                  AI assistant provides instant insights, detects diseases, and
                  recommends crops while you focus on farming.
                </p>
              </div>
              <div className="solution-features">
                {solutions.map((solution, index) => {
                  const Icon = solution.icon;
                  return (
                    <div key={index} className="solution-feature">
                      <div className="solution-feature-icon">
                        <Icon />
                      </div>
                      <div>
                        <h4>{solution.title}</h4>
                        <p>{solution.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title">How FarmAssist Works</h2>
          <p className="section-description">
            Simple, powerful, and designed for farmers
          </p>
          <div className="features-grid">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="feature-card-link"
                >
                  <Card
                    className={`feature-card ${link.color}`}
                    data-tour={link.tourId}
                  >
                    <div className="feature-card-content">
                      <div className={`feature-icon ${link.color}`}>
                        <Icon className="icon" />
                      </div>
                      <h3 className="feature-title">{link.title}</h3>
                      <p className="feature-description">{link.description}</p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Weather & Tips Section */}
        {(weather || weatherLoading) && (
          <section className="weather-section">
            <div className="weather-grid">
              {/* Weather Widget */}
              <Card className="weather-widget">
                {weatherLoading ? (
                  <div className="weather-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading current weather conditions...</p>
                  </div>
                ) : weather ? (
                  <div className="weather-content">
                    <div className="weather-info">
                      <div className="weather-header">
                        {getWeatherIcon(weather.condition, weather.icon)}
                        <div>
                          <h3 className="weather-title">
                            <MapPin className="location-icon" />
                            {weather.location}
                          </h3>
                          <p className="weather-subtitle">
                            {weather.description.charAt(0).toUpperCase() +
                              weather.description.slice(1)}
                          </p>
                        </div>
                      </div>
                      <div className="weather-details">
                        <div className="weather-stat">
                          <Droplets className="stat-icon" />
                          <span>{weather.humidity}% Humidity</span>
                        </div>
                        <div className="weather-stat">
                          <Wind className="stat-icon" />
                          <span>{weather.windSpeed} m/s Wind</span>
                        </div>
                      </div>
                    </div>
                    <div className="weather-stats">
                      <div className="temperature">{weather.temperature}°C</div>
                      <button
                        className="refresh-btn"
                        onClick={refreshWeather}
                        title="Refresh weather data"
                        disabled={weatherLoading}
                      >
                        ↻
                      </button>
                    </div>
                  </div>
                ) : null}

                {weatherError && (
                  <div className="weather-error">
                    <Thermometer className="error-icon" />
                    <div>
                      <h3 className="weather-title">Weather Unavailable</h3>
                      <p className="weather-subtitle">{weatherError}</p>
                      <button className="retry-btn" onClick={refreshWeather}>
                        Try Again
                      </button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Farming Tip */}
              {weather && weather.farmingAdvice && (
                <Card className="farming-tip">
                  <h3 className="tip-title">
                    {weather.farmingAdvice.icon} {weather.farmingAdvice.title}
                  </h3>
                  <p className="tip-content">{weather.farmingAdvice.advice}</p>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="cta-section">
          <h2 className="cta-title">Start Smarter Farming Today</h2>
          <p className="cta-description">
            Join thousands of farmers using AI to improve their yields and make
            better decisions.
          </p>
          <div className="cta-actions">
            <Button
              size="lg"
              className="cta-button-primary"
              onClick={() => setShowTour(true)}
            >
              Get Started
              <ArrowRight className="cta-icon" />
            </Button>
            <Link to="/help" className="cta-button-secondary">
              Learn More
            </Link>
          </div>
        </section>
      </div>

      <GuidedTour isOpen={showTour} onClose={() => setShowTour(false)} />
    </>
  );
};

export default HomePage;
