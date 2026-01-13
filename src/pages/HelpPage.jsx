import React, { useState } from 'react';
import { HelpCircle, Play, Phone, MapPin, Book, Video } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

const HelpPage = () => {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState('getting-started');
  const navigate = useNavigate();

  const jump = () =>{
    navigate('/csc-locator');
  };
  const jumptoguide = () =>{
    navigate('/');
  };
  const helpSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Play,
      content: [
        {
          title: 'Welcome to FarmAssist',
          description: 'Your digital farming companion designed to help you make better farming decisions.',
          steps: [
            'Select your preferred language from the top menu',
            'Navigate using the sidebar or bottom menu on mobile',
            'Start with Yield Prediction or Crop Recommendation',
            'Use the Chatbot for quick questions anytime'
          ]
        }
      ]
    },
    {
      id: 'features',
      title: 'Features Guide',
      icon: Book,
      content: [
        {
          title: 'Yield Prediction',
          description: 'Get accurate yield estimates for your crops',
          steps: [
            'Select your region from the dropdown',
            'Choose your soil type (get soil tested if unsure)',
            'Pick the crop you want to plant',
            'View predicted yield and recommendations'
          ]
        },
        {
          title: 'Crop Recommendation',
          description: 'Find the best crops for your land and season',
          steps: [
            'Enter your region and soil type',
            'Select the growing season',
            'Review recommended crops with suitability scores',
            'Choose crops with 80%+ suitability for best results'
          ]
        },
        {
          title: 'Disease Detection',
          description: 'Identify plant diseases from photos',
          steps: [
            'Take a clear photo of affected plant leaves',
            'Upload the image or drag and drop',
            'Wait for AI analysis (may take 1-2 minutes)',
            'Follow the treatment recommendations'
          ]
        }
      ]
    },
    {
      id: 'support',
      title: 'Support & Contact',
      icon: Phone,
      content: [
        {
          title: 'Technical Support',
          description: 'Get help with using the app',
          steps: [
            'Use the Chatbot for instant answers',
            'Call our helpline: 1800-180-1551 (toll-free)',
            'Visit your nearest Common Service Center (CSC)',
            'Email: support@farmassist.gov.in'
          ]
        },
        {
          title: 'Agricultural Support',
          description: 'Get expert farming advice',
          steps: [
            'Contact your local Agricultural Extension Officer',
            'Visit Krishi Vigyan Kendra in your district',
            'Call state agriculture helpline',
            'Join local farmer producer organizations (FPOs)'
          ]
        }
      ]
    }
  ];

  const videoTutorials = [
    {
      title: 'How to Predict Crop Yield',
      duration: '3:45',
      thumbnail: 'https://images.pexels.com/photos/2132240/pexels-photo-2132240.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    },
    {
      title: 'Using Disease Detection',
      duration: '2:30',
      thumbnail: 'https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    },
    {
      title: 'Finding Government Schemes',
      duration: '4:15',
      thumbnail: 'https://images.pexels.com/photos/1595476/pexels-photo-1595476.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
          <HelpCircle className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('help')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Learn how to use FarmAssist effectively
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4 sticky top-4">
            <nav className="space-y-2">
              {helpSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {section.title}
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {helpSections.find(s => s.id === activeSection)?.content.map((item, index) => (
            <Card key={index} className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {item.description}
              </p>
              <div className="space-y-3">
                {item.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-start">
                    <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                      {stepIndex + 1}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{step}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          {/* Video Tutorials */}
          {activeSection === 'features' && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Video className="mr-2 h-6 w-6 text-blue-600" />
                Video Tutorials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {videoTutorials.map((video, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">{video.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{video.duration}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Emergency Contacts */}
          {activeSection === 'support' && (
            <Card className="p-6 bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-800">
              <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-4 flex items-center">
                <Phone className="mr-2 h-6 w-6 text-red-600" />
                Emergency Agricultural Support
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">National Helpline</h4>
                  <p className="text-2xl font-bold text-green-600">1800-180-1551</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">24/7 Toll-Free</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Kisan Call Center</h4>
                  <p className="text-2xl font-bold text-green-600">1800-180-1551</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Technical Support</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="primary" onClick={jumptoguide} size="lg" className="justify-center">
            <Play className="mr-2 h-5 w-5" />
            Start Guided Tour
          </Button>
          <Button variant="outline" size="lg" onClick={jump} className="justify-center">
            <Phone className="mr-2 h-5 w-5" />
            Call Support
          </Button>
          <Button variant="outline" size="lg" onClick={jump} className="justify-center">
            <MapPin className="mr-2 h-5 w-5" />
            Find Nearest CSC
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default HelpPage;