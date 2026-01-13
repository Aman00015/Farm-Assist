import React from 'react';
import { Building2, ExternalLink, Calendar, Users, DollarSign } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const GovtSchemesPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const jump = () => {
    navigate('/csc-locator');
  };
  const schemes = [
    {
      title: 'PM-KISAN Samman Nidhi',
      description: 'Direct income support to farmer families owning cultivable land',
      amount: '₹6,000 per year',
      eligibility: 'Small & marginal farmers',
      deadline: '31 Dec 2024',
      category: 'Income Support',
      link: 'https://pmkisan.gov.in',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Pradhan Mantri Fasal Bima Yojana',
      description: 'Crop insurance scheme for farmers against crop loss',
      amount: 'Up to ₹2 Lakh coverage',
      eligibility: 'All farmers',
      deadline: 'Before sowing season',
      category: 'Insurance',
      link: 'https://pmfby.gov.in',
      icon: Building2,
      color: 'bg-blue-500'
    },
    {
      title: 'Kisan Credit Card',
      description: 'Easy credit facility for farmers at subsidized rates',
      amount: 'Up to ₹3 Lakh',
      eligibility: 'All categories of farmers',
      deadline: 'Open throughout year',
      category: 'Credit',
      link: 'https://kcc.gov.in',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Soil Health Card Scheme',
      description: 'Free soil testing and nutrient recommendations',
      amount: 'Free service',
      eligibility: 'All farmers',
      deadline: 'Ongoing',
      category: 'Technical Support',
      link: 'https://soilhealth.dac.gov.in',
      icon: Calendar,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
          <Building2 className="h-8 w-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('governmentSchemes')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Explore government schemes and subsidies available for farmers
        </p>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schemes.map((scheme, index) => {
          const Icon = scheme.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`${scheme.color} p-2 rounded-lg flex-shrink-0`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {scheme.title}
                      </h3>
                      <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full mb-2">
                        {scheme.category}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {scheme.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Amount:</span>
                    <span className="text-sm font-semibold text-green-600">{scheme.amount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Eligibility:</span>
                    <span className="text-sm text-gray-600">{scheme.eligibility}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Deadline:</span>
                    <span className="text-sm text-gray-600">{scheme.deadline}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full"
                    onClick={() => window.open(scheme.link, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {t('knowMore')}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Contact Information */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-800">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
            Need Help with Applications?
          </h3>
          <p className="text-blue-700 dark:text-blue-300">
            Contact your local agricultural extension officer or visit the nearest Common Service Center (CSC)
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={jump} variant="primary">
              Find Nearest CSC
            </Button>
            <Button  variant="outline">
              Call Helpline: 1800-180-1551
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GovtSchemesPage;