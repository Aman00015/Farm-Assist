import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    // Navigation
    home: 'Home',
    yieldPrediction: 'Yield Prediction',
    cropRecommendation: 'Crop Recommendation',
    diseaseDetection: 'Disease Detection',
    govtSchemes: 'Govt Schemes',
    chatbot: 'Chatbot',
    help: 'Help',
    
    // Homepage
    smartFarmingAssistant: 'Smart Farming Assistant',
    welcomeMessage: 'Your digital farming companion for better yields and smarter decisions',
    startGuidedTour: 'Start Guided Tour',
    quickAccess: 'Quick Access',
    yieldPredictionDesc: 'Predict crop yields based on soil and weather data',
    cropRecommendationDesc: 'Get crop suggestions for your soil and climate',
    diseaseDetectionDesc: 'Identify plant diseases from photos',
    govtSchemesDesc: 'Explore government agricultural schemes',
    todaysWeather: 'Today\'s Weather',
    perfectConditions: 'Perfect conditions for irrigation',
    farmingTip: '💡 Today\'s Farming Tip',
    tipContent: 'Check soil moisture before irrigation. Over-watering can lead to root rot and reduce crop yield. Use the finger test - insert your finger 2 inches into soil, if it\'s dry, it\'s time to water.',
    
    // Yield Prediction
    predictYield: 'Predict Yield',
    selectRegion: 'Select Region',
    selectSoilType: 'Select Soil Type',
    selectCrop: 'Select Crop',
    calculateYield: 'Calculate Yield',
    predictedYield: 'Predicted Yield',
    getAccurateYield: 'Get accurate yield predictions based on your farming conditions',
    tonsPerHectare: 'tons/hectare',
    confidence: 'Confidence',
    recommendations: 'Recommendations',
    
    // Crop Recommendation
    recommendCrop: 'Recommend Crop',
    selectSeason: 'Select Season',
    getSuggestions: 'Get Suggestions',
    recommendedCrops: 'Recommended Crops',
    getPersonalizedCrops: 'Get personalized crop recommendations for your land',
    expectedYield: 'Expected Yield',
    suitable: 'suitable',
    tips: 'Tips',
    
    // Disease Detection
    detectDisease: 'Detect Disease',
    uploadImage: 'Upload Plant Image',
    dragDrop: 'Drag & drop image here or click to select',
    analyzeImage: 'Analyze Image',
    diseaseDetected: 'Disease Detected',
    treatment: 'Treatment',
    uploadPhotoToDetect: 'Upload a photo of your plant to detect diseases',
    selectImage: 'Select Image',
    uploadNew: 'Upload New',
    severity: 'Severity',
    preventionTips: 'Prevention Tips',
    confident: 'confident',
    
    // Government Schemes
    governmentSchemes: 'Government Schemes',
    knowMore: 'Know More',
    exploreSchemes: 'Explore government schemes and subsidies available for farmers',
    amount: 'Amount',
    eligibility: 'Eligibility',
    deadline: 'Deadline',
    needHelpWithApplications: 'Need Help with Applications?',
    contactLocalOfficer: 'Contact your local agricultural extension officer or visit the nearest Common Service Center (CSC)',
    findNearestCSC: 'Find Nearest CSC',
    callHelpline: 'Call Helpline: 1800-180-1551',
    
    // Chatbot
    askQuestion: 'Ask me anything about farming...',
    send: 'Send',
    getInstantAnswers: 'Get instant answers to your farming questions',
    quickQuestions: 'Quick Questions',
    howToIncreaseYield: 'How to increase crop yield?',
    bestFertilizerForRice: 'Best fertilizer for rice?',
    organicPestControl: 'Organic pest control methods',
    waterManagementTips: 'Water management tips',
    soilTestingImportance: 'Soil testing importance',
    governmentLoanSchemes: 'Government loan schemes',
    
    // Guided Tour
    navigationMenu: 'Navigation Menu',
    navigationMenuDesc: 'Use this menu to access all features. On mobile, tap the menu icon in the top right.',
    languageSettings: 'Language Settings',
    languageSettingsDesc: 'Change the app language to Hindi, Telugu, or English for better understanding.',
    yieldPredictionTour: 'Yield Prediction',
    yieldPredictionTourDesc: 'Get accurate crop yield estimates based on your soil type, region, and crop selection.',
    cropRecommendationTour: 'Crop Recommendation',
    cropRecommendationTourDesc: 'Find the best crops to grow based on your soil conditions and local climate.',
    diseaseDetectionTour: 'Disease Detection',
    diseaseDetectionTourDesc: 'Upload photos of your plants to identify diseases and get treatment recommendations.',
    aiAssistant: 'AI Assistant',
    aiAssistantDesc: 'Ask questions anytime! The chatbot can help with farming advice in your preferred language.',
    previous: 'Previous',
    next: 'Next',
    finish: 'Finish',
    of: 'of',
    
    // Common
    back: 'Back',
    close: 'Close',
    loading: 'Loading...',
    error: 'Error occurred',
    
    // Fallback
    dataUnavailable: 'Data Unavailable',
    contactAuthority: 'Please contact your local agricultural authority for soil sample collection and analysis.',
    callNow: 'Call Now',
    
    // Additional Yield Prediction
    backendServerNotRunning: 'Backend Server Not Running',
    pleaseStartFlaskServer: 'Please start the Flask backend server on port 5000.',
    retryConnection: 'Retry Connection',
    yieldModelReady: '✅ Yield prediction model is ready',
    modelWillTrainAutomatically: 'ℹ️ Model will train automatically when you make your first prediction',
    trainingModel: 'Training model for the first time. This may take a few seconds...',
    chooseCrop: 'Choose a crop...',
    loadingAvailableCrops: 'Loading available crops...',
    selectState: 'Select State',
    chooseState: 'Choose a state...',
    loadingAvailableStates: 'Loading available states...',
    areaHectares: 'Area (hectares)',
    fertilizerKg: 'Fertilizer (kg)',
    pesticideLitres: 'Pesticide (litres)',
    predictingYield: 'Predicting Yield...',
    reset: 'Reset',
    firstTimePrediction: '💡 First-time prediction will automatically train the model',
    yieldPredictionResults: 'Yield Prediction Results',
    modelWasAutoTrained: '✅ Model was automatically trained for this prediction',
    yieldPerHectare: 'Yield per hectare',
    totalProduction: 'Total production',
    predictionFor: 'Prediction for:',
    area: 'Area',
    hectares: 'hectares',
    fillFormAndPredict: 'Fill the form and predict yield to see results',
    
    // Additional Crop Recommendation
    selectSoilTypeOptional: 'Select Soil Type (Optional)',
    selectSeasonOptional: 'Select Season (Optional)',
    
    // Additional CSC Locator
    locator: 'Locator',
    agriServeCscLocator: 'AgriServe CSC Locator',
    findNearbyCscs: 'Find nearby Common Service Centers for agricultural services',
    servingRuralIndia: 'Serving Rural India',
    yourLocation: 'Your Location',
    gpsCoordinatesDetected: 'GPS Coordinates Detected',
    refresh: 'Refresh',
    locating: 'Locating...',
    currentAddress: 'Current Address:',
    searchPreferences: 'Search Preferences',
    smartSearchActive: 'Smart Search Active',
    searchRadius: 'Search Radius',
    findingNearbyCscs: 'Finding nearby Common Service Centers...',
    nearbyServiceCenters: 'Nearby Service Centers',
    multiSourceResults: 'Multi-source results',
    getDirections: 'Get Directions',
    viewDetails: 'View Details',
    allAvailableServices: 'All Available Services:',
    contactInformation: 'Contact Information:',
    operatingHours: 'Operating Hours:',
    getDirectionsOnGoogleMaps: 'Get Directions on Google Maps',
    locationPermissionRequired: 'Location permission required for directions',
    poweredByRealTimeData: 'Powered by real-time data sources • Serving rural communities across India',
    agriculturalServices: '🌾 Agricultural Services',
    digitalIndiaInitiative: '📱 Digital India Initiative',
    ruralEmpowerment: '🤝 Rural Empowerment',
    
    // Additional Help Page
    learnHowToUse: 'Learn how to use FarmAssist effectively',
    gettingStarted: 'Getting Started',
    featuresGuide: 'Features Guide',
    supportContact: 'Support & Contact',
    welcomeToFarmAssist: 'Welcome to FarmAssist',
    yourDigitalFarmingCompanion: 'Your digital farming companion designed to help you make better farming decisions.',
    selectPreferredLanguage: 'Select your preferred language from the top menu',
    navigateUsingSidebar: 'Navigate using the sidebar or bottom menu on mobile',
    startWithYieldPrediction: 'Start with Yield Prediction or Crop Recommendation',
    useChatbotForQuestions: 'Use the Chatbot for quick questions anytime',
    getAccurateYieldEstimates: 'Get accurate yield estimates for your crops',
    selectRegionFromDropdown: 'Select your region from the dropdown',
    chooseSoilType: 'Choose your soil type (get soil tested if unsure)',
    pickCropToPlant: 'Pick the crop you want to plant',
    viewPredictedYield: 'View predicted yield and recommendations',
    findBestCrops: 'Find the best crops for your land and season',
    enterRegionAndSoil: 'Enter your region and soil type',
    selectGrowingSeason: 'Select the growing season',
    reviewRecommendedCrops: 'Review recommended crops with suitability scores',
    chooseCropsWithHighSuitability: 'Choose crops with 80%+ suitability for best results',
    identifyPlantDiseases: 'Identify plant diseases from photos',
    takeClearPhoto: 'Take a clear photo of affected plant leaves',
    uploadImageOrDrag: 'Upload the image or drag and drop',
    waitForAiAnalysis: 'Wait for AI analysis (may take 1-2 minutes)',
    followTreatmentRecommendations: 'Follow the treatment recommendations',
    technicalSupport: 'Technical Support',
    getHelpWithApp: 'Get help with using the app',
    useChatbotForInstantAnswers: 'Use the Chatbot for instant answers',
    visitNearestCsc: 'Visit your nearest Common Service Center (CSC)',
    emailSupport: 'Email: support@farmassist.gov.in',
    agriculturalSupport: 'Agricultural Support',
    getExpertFarmingAdvice: 'Get expert farming advice',
    contactLocalExtensionOfficer: 'Contact your local Agricultural Extension Officer',
    visitKrishiVigyanKendra: 'Visit Krishi Vigyan Kendra in your district',
    callStateAgricultureHelpline: 'Call state agriculture helpline',
    joinLocalFpos: 'Join local farmer producer organizations (FPOs)',
    videoTutorials: 'Video Tutorials',
    howToPredictCropYield: 'How to Predict Crop Yield',
    usingDiseaseDetection: 'Using Disease Detection',
    findingGovernmentSchemes: 'Finding Government Schemes',
    emergencyAgriculturalSupport: 'Emergency Agricultural Support',
    nationalHelpline: 'National Helpline',
    tollFree: '24/7 Toll-Free',
    kisanCallCenter: 'Kisan Call Center',
    quickActions: 'Quick Actions',
    callSupport: 'Call Support',
    findNearestCsc: 'Find Nearest CSC',
    
    // Additional Chatbot
    configureGeminiAi: 'Configure Gemini AI',
    enterGeminiApiKey: 'Enter your Gemini API key to enable AI-powered responses. You can get your API key from Google AI Studio.',
    enterYourGeminiApiKey: 'Enter your Gemini API key',
    skipForNow: 'Skip for now',
    configure: 'Configure',
    configureAiAssistant: 'Configure AI Assistant',
    voiceInput: 'Voice input',
    sendMessage: 'Send message',
    
    // Additional Layout
    farmAssist: 'FarmAssist'
  },
  hi: {
    // Navigation
    home: 'होम',
    yieldPrediction: 'उत्पादन पूर्वानुमान',
    cropRecommendation: 'फसल सुझाव',
    diseaseDetection: 'रोग पहचान',
    govtSchemes: 'सरकारी योजनाएं',
    chatbot: 'चैटबॉट',
    help: 'सहायता',
    
    // Homepage
    smartFarmingAssistant: 'स्मार्ट किसान सहायक',
    welcomeMessage: 'बेहतर उत्पादन और स्मार्ट निर्णयों के लिए आपका डिजिटल किसान साथी',
    startGuidedTour: 'गाइडेड टूर शुरू करें',
    quickAccess: 'त्वरित पहुंच',
    yieldPredictionDesc: 'मिट्टी और मौसम के आंकड़ों के आधार पर फसल उत्पादन की भविष्यवाणी करें',
    cropRecommendationDesc: 'अपनी मिट्टी और जलवायु के लिए फसल सुझाव प्राप्त करें',
    diseaseDetectionDesc: 'फोटो से पौधों के रोगों की पहचान करें',
    govtSchemesDesc: 'किसानों के लिए उपलब्ध सरकारी कृषि योजनाओं का अन्वेषण करें',
    todaysWeather: 'आज का मौसम',
    perfectConditions: 'सिंचाई के लिए आदर्श स्थितियां',
    farmingTip: '💡 आज का कृषि सुझाव',
    tipContent: 'सिंचाई से पहले मिट्टी की नमी जांचें। अधिक पानी देने से जड़ सड़न हो सकती है और फसल उत्पादन कम हो सकता है। उंगली टेस्ट का उपयोग करें - मिट्टी में 2 इंच उंगली डालें, यदि सूखी है तो पानी देने का समय है।',
    
    // Yield Prediction
    predictYield: 'उत्पादन की भविष्यवाणी',
    selectRegion: 'क्षेत्र चुनें',
    selectSoilType: 'मिट्टी का प्रकार चुनें',
    selectCrop: 'फसल चुनें',
    calculateYield: 'उत्पादन की गणना करें',
    predictedYield: 'अनुमानित उत्पादन',
    getAccurateYield: 'अपनी कृषि स्थितियों के आधार पर सटीक उत्पादन पूर्वानुमान प्राप्त करें',
    tonsPerHectare: 'टन/हेक्टेयर',
    confidence: 'आत्मविश्वास',
    recommendations: 'सुझाव',
    
    // Crop Recommendation
    recommendCrop: 'फसल सुझाव',
    selectSeason: 'मौसम चुनें',
    getSuggestions: 'सुझाव प्राप्त करें',
    recommendedCrops: 'सुझाई गई फसलें',
    getPersonalizedCrops: 'अपनी जमीन के लिए व्यक्तिगत फसल सुझाव प्राप्त करें',
    expectedYield: 'अपेक्षित उत्पादन',
    suitable: 'उपयुक्त',
    tips: 'सुझाव',
    
    // Disease Detection
    detectDisease: 'रोग की पहचान',
    uploadImage: 'पौधे की तस्वीर अपलोड करें',
    dragDrop: 'यहाँ तस्वीर खींचें और छोड़ें या चुनने के लिए क्लिक करें',
    analyzeImage: 'तस्वीर का विश्लेषण करें',
    diseaseDetected: 'रोग की पहचान',
    treatment: 'उपचार',
    uploadPhotoToDetect: 'रोगों का पता लगाने के लिए अपने पौधे की फोटो अपलोड करें',
    selectImage: 'तस्वीर चुनें',
    uploadNew: 'नई अपलोड करें',
    severity: 'गंभीरता',
    preventionTips: 'रोकथाम के सुझाव',
    confident: 'आत्मविश्वास',
    
    // Government Schemes
    governmentSchemes: 'सरकारी योजनाएं',
    knowMore: 'और जानें',
    exploreSchemes: 'किसानों के लिए उपलब्ध सरकारी योजनाओं और सब्सिडी का अन्वेषण करें',
    amount: 'राशि',
    eligibility: 'पात्रता',
    deadline: 'समय सीमा',
    needHelpWithApplications: 'आवेदन में सहायता चाहिए?',
    contactLocalOfficer: 'अपने स्थानीय कृषि विस्तार अधिकारी से संपर्क करें या निकटतम कॉमन सर्विस सेंटर (CSC) पर जाएं',
    findNearestCSC: 'निकटतम CSC खोजें',
    callHelpline: 'हेल्पलाइन: 1800-180-1551',
    
    // Chatbot
    askQuestion: 'कृषि के बारे में कुछ भी पूछें...',
    send: 'भेजें',
    getInstantAnswers: 'अपने कृषि प्रश्नों के तुरंत उत्तर प्राप्त करें',
    quickQuestions: 'त्वरित प्रश्न',
    howToIncreaseYield: 'फसल उत्पादन कैसे बढ़ाएं?',
    bestFertilizerForRice: 'चावल के लिए सबसे अच्छा उर्वरक?',
    organicPestControl: 'जैविक कीट नियंत्रण विधियां',
    waterManagementTips: 'जल प्रबंधन सुझाव',
    soilTestingImportance: 'मिट्टी परीक्षण का महत्व',
    governmentLoanSchemes: 'सरकारी ऋण योजनाएं',
    
    // Guided Tour
    navigationMenu: 'नेविगेशन मेनू',
    navigationMenuDesc: 'सभी सुविधाओं तक पहुंचने के लिए इस मेनू का उपयोग करें। मोबाइल पर, ऊपर दाएं में मेनू आइकन पर टैप करें।',
    languageSettings: 'भाषा सेटिंग्स',
    languageSettingsDesc: 'बेहतर समझ के लिए ऐप की भाषा को हिंदी, तेलुगु या अंग्रेजी में बदलें।',
    yieldPredictionTour: 'उत्पादन पूर्वानुमान',
    yieldPredictionTourDesc: 'अपने मिट्टी के प्रकार, क्षेत्र और फसल चुनाव के आधार पर सटीक फसल उत्पादन अनुमान प्राप्त करें।',
    cropRecommendationTour: 'फसल सुझाव',
    cropRecommendationTourDesc: 'अपनी मिट्टी की स्थिति और स्थानीय जलवायु के आधार पर उगाने के लिए सबसे अच्छी फसलें खोजें।',
    diseaseDetectionTour: 'रोग पहचान',
    diseaseDetectionTourDesc: 'रोगों की पहचान और उपचार सुझाव प्राप्त करने के लिए अपने पौधों की फोटो अपलोड करें।',
    aiAssistant: 'AI सहायक',
    aiAssistantDesc: 'कभी भी प्रश्न पूछें! चैटबॉट आपकी पसंदीदा भाषा में कृषि सलाह में मदद कर सकता है।',
    previous: 'पिछला',
    next: 'अगला',
    finish: 'समाप्त',
    of: 'का',
    
    // Common
    back: 'वापस',
    close: 'बंद करें',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि हुई',
    
    // Fallback
    dataUnavailable: 'डेटा उपलब्ध नहीं',
    contactAuthority: 'मिट्टी के नमूने के संग्रह और विश्लेषण के लिए कृपया अपने स्थानीय कृषि अधिकारी से संपर्क करें।',
    callNow: 'अभी कॉल करें'
  },
  te: {
    // Navigation
    home: 'హోమ్',
    yieldPrediction: 'దిగుబడి అంచనా',
    cropRecommendation: 'పంట సిఫార్సు',
    diseaseDetection: 'వ్యాధి గుర్తింపు',
    govtSchemes: 'ప్రభుత్వ పథకాలు',
    chatbot: 'చాట్‌బాట్',
    help: 'సహాయం',
    
    // Homepage
    smartFarmingAssistant: 'స్మార్ట్ వ్యవసాయ సహాయకుడు',
    welcomeMessage: 'మెరుగైన దిగుబడి మరియు తెలివైన నిర్ణయాల కోసం మీ డిజిటల్ వ్యవసాయ సహచరుడు',
    startGuidedTour: 'గైడెడ్ టూర్ ప్రారంభించండి',
    quickAccess: 'త్వరిత యాక్సెస్',
    yieldPredictionDesc: 'మట్టి మరియు వాతావరణ డేటా ఆధారంగా పంట దిగుబడులను అంచనా వేయండి',
    cropRecommendationDesc: 'మీ మట్టి మరియు వాతావరణానికి పంట సూచనలను పొందండి',
    diseaseDetectionDesc: 'ఫోటోల నుండి మొక్కల వ్యాధులను గుర్తించండి',
    govtSchemesDesc: 'రైతులకు అందుబాటులో ఉన్న ప్రభుత్వ వ్యవసాయ పథకాలను అన్వేషించండి',
    todaysWeather: 'ఈరోజు వాతావరణం',
    perfectConditions: 'నీటిపారుదలకు అనువైన పరిస్థితులు',
    farmingTip: '💡 ఈరోజు వ్యవసాయ చిట్కా',
    tipContent: 'నీటిపారుదలకు ముందు మట్టి తేమను తనిఖీ చేయండి. అధిక నీరు ఇవ్వడం వల్ల వేర్లు కుళ్ళిపోవచ్చు మరియు పంట దిగుబడి తగ్గుతుంది. వేలు పరీక్షను ఉపయోగించండి - మట్టిలో 2 అంగుళాలు వేలు ఉంచండి, ఎండిపోయినట్లయితే నీరు ఇచ్చే సమయం వచ్చింది.',
    
    // Yield Prediction
    predictYield: 'దిగుబడి అంచనా వేయండి',
    selectRegion: 'ప్రాంతం ఎంచుకోండి',
    selectSoilType: 'మట్టి రకం ఎంచుకోండి',
    selectCrop: 'పంట ఎంచుకోండి',
    calculateYield: 'దిగుబడిని లెక్కించండి',
    predictedYield: 'అంచనా వేసిన దిగుబడి',
    getAccurateYield: 'మీ వ్యవసాయ పరిస్థితుల ఆధారంగా ఖచ్చితమైన దిగుబడి అంచనాలను పొందండి',
    tonsPerHectare: 'టన్నులు/హెక్టారు',
    confidence: 'విశ్వాసం',
    recommendations: 'సూచనలు',
    
    // Crop Recommendation
    recommendCrop: 'పంట సిఫార్సు',
    selectSeason: 'సీజన్ ఎంచుకోండి',
    getSuggestions: 'సూచనలు పొందండి',
    recommendedCrops: 'సిఫార్సు చేసిన పంటలు',
    getPersonalizedCrops: 'మీ భూమికి వ్యక్తిగత పంట సూచనలను పొందండి',
    expectedYield: 'అంచనా దిగుబడి',
    suitable: 'అనువైన',
    tips: 'చిట్కాలు',
    
    // Disease Detection
    detectDisease: 'వ్యాధి గుర్తించండి',
    uploadImage: 'మొక్క చిత్రాన్ని అప్‌లోడ్ చేయండి',
    dragDrop: 'ఇక్కడ చిత్రాన్ని లాగి వదలండి లేదా ఎంచుకోవడానికి క్లిక్ చేయండి',
    analyzeImage: 'చిత్రాన్ని విశ్లేషించండి',
    diseaseDetected: 'వ్యాధి కనుగొనబడింది',
    treatment: 'చికిత్స',
    uploadPhotoToDetect: 'వ్యాధులను గుర్తించడానికి మీ మొక్క ఫోటోను అప్‌లోడ్ చేయండి',
    selectImage: 'చిత్రం ఎంచుకోండి',
    uploadNew: 'కొత్తది అప్‌లోడ్ చేయండి',
    severity: 'తీవ్రత',
    preventionTips: 'నివారణ చిట్కాలు',
    confident: 'విశ్వాసం',
    
    // Government Schemes
    governmentSchemes: 'ప్రభుత్వ పథకాలు',
    knowMore: 'మరింత తెలుసుకోండి',
    exploreSchemes: 'రైతులకు అందుబాటులో ఉన్న ప్రభుత్వ పథకాలు మరియు సబ్సిడీలను అన్వేషించండి',
    amount: 'మొత్తం',
    eligibility: 'అర్హత',
    deadline: 'గడువు',
    needHelpWithApplications: 'అప్లికేషన్లతో సహాయం కావాలా?',
    contactLocalOfficer: 'మీ స్థానిక వ్యవసాయ విస్తరణ అధికారిని సంప్రదించండి లేదా సమీప కామన్ సర్వీస్ సెంటర్ (CSC)ని సందర్శించండి',
    findNearestCSC: 'సమీప CSCని కనుగొనండి',
    callHelpline: 'హెల్ప్‌లైన్: 1800-180-1551',
    
    // Chatbot
    askQuestion: 'వ్యవసాయం గురించి ఏదైనా అడగండి...',
    send: 'పంపండి',
    getInstantAnswers: 'మీ వ్యవసాయ ప్రశ్నలకు తక్షణ సమాధానాలను పొందండి',
    quickQuestions: 'త్వరిత ప్రశ్నలు',
    howToIncreaseYield: 'పంట దిగుబడిని ఎలా పెంచాలి?',
    bestFertilizerForRice: 'వరి కోసం ఉత్తమ ఎరువు?',
    organicPestControl: 'సేంద్రీయ పీడక నియంత్రణ పద్ధతులు',
    waterManagementTips: 'నీటి నిర్వహణ చిట్కాలు',
    soilTestingImportance: 'మట్టి పరీక్ష యొక్క ప్రాముఖ్యత',
    governmentLoanSchemes: 'ప్రభుత్వ రుణ పథకాలు',
    
    // Guided Tour
    navigationMenu: 'నావిగేషన్ మెనూ',
    navigationMenuDesc: 'అన్ని ఫీచర్‌లకు యాక్సెస్ చేయడానికి ఈ మెనూను ఉపయోగించండి. మొబైల్‌లో, పైన కుడివైపున మెనూ ఐకాన్‌ను ట్యాప్ చేయండి.',
    languageSettings: 'భాషా సెట్టింగ్‌లు',
    languageSettingsDesc: 'మెరుగైన అవగాహన కోసం అనువర్తన భాషను హిందీ, తెలుగు లేదా ఇంగ్లీష్‌గా మార్చండి.',
    yieldPredictionTour: 'దిగుబడి అంచనా',
    yieldPredictionTourDesc: 'మీ మట్టి రకం, ప్రాంతం మరియు పంట ఎంపిక ఆధారంగా ఖచ్చితమైన పంట దిగుబడి అంచనాలను పొందండి.',
    cropRecommendationTour: 'పంట సిఫార్సు',
    cropRecommendationTourDesc: 'మీ మట్టి పరిస్థితులు మరియు స్థానిక వాతావరణం ఆధారంగా పండించడానికి ఉత్తమ పంటలను కనుగొనండి.',
    diseaseDetectionTour: 'వ్యాధి గుర్తింపు',
    diseaseDetectionTourDesc: 'వ్యాధులను గుర్తించడానికి మరియు చికిత్స సూచనలను పొందడానికి మీ మొక్కల ఫోటోలను అప్‌లోడ్ చేయండి.',
    aiAssistant: 'AI సహాయకుడు',
    aiAssistantDesc: 'ఎప్పుడైనా ప్రశ్నలు అడగండి! చాట్‌బాట్ మీ ప్రాధాన్య భాషలో వ్యవసాయ సలహాలలో సహాయపడుతుంది.',
    previous: 'మునుపటి',
    next: 'తదుపరి',
    finish: 'పూర్తి',
    of: 'లో',
    
    // Common
    back: 'వెనుకకు',
    close: 'మూసివేయండి',
    loading: 'లోడ్ అవుతోంది...',
    error: 'లోపం సంభవించింది',
    
    // Fallback
    dataUnavailable: 'డేటా అందుబాటులో లేదు',
    contactAuthority: 'మట్టి నమూనా సేకరణ మరియు విశ్లేషణ కోసం దయచేసి మీ స్థానిక వ్యవసాయ అధికారిని సంప్రదించండి.',
    callNow: 'ఇప్పుడే కాల్ చేయండి'
  }
};

const LanguageContext = createContext(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};