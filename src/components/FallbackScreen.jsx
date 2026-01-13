import React from 'react';
import { AlertTriangle, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Card from './Card';
import Button from './Button';

const FallbackScreen = ({
  title = 'Data Unavailable',
  message = 'We don\'t have complete data for your region yet.',
  showContactInfo = true
}) => {
  const { t } = useLanguage();

  const contacts = [
    {
      name: 'Agricultural Extension Officer',
      phone: '1800-180-1551',
      description: 'For soil testing and crop guidance'
    },
    {
      name: 'Krishi Vigyan Kendra',
      phone: '1800-180-1551',
      description: 'For technical farming support'
    },
    {
      name: 'District Collector Office',
      phone: '1800-180-1551',
      description: 'For government scheme information'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
          <AlertTriangle className="h-8 w-8 text-orange-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {t('dataUnavailable')}
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          {t('contactAuthority')}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
          <Button variant="primary" size="lg">
            <Phone className="mr-2 h-5 w-5" />
            {t('callNow')}
          </Button>
          <Button variant="outline" size="lg">
            <MapPin className="mr-2 h-5 w-5" />
            Find Nearest Office
          </Button>
        </div>
      </Card>

      {showContactInfo && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
            Important Contacts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contacts.map((contact, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="mb-3">
                  <Phone className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">{contact.name}</h4>
                </div>
                <p className="text-2xl font-bold text-green-600 mb-2">{contact.phone}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{contact.description}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 w-full"
                  onClick={() => window.open(`tel:${contact.phone}`)}
                >
                  Call Now
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">
              What you can do while waiting:
            </h4>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Use our Chatbot for general farming questions</li>
              <li>• Check Government Schemes available in your state</li>
              <li>• Get soil testing done through local agriculture office</li>
              <li>• Join local farmer groups for knowledge sharing</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FallbackScreen;