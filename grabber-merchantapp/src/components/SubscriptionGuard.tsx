import React from 'react';
import { Crown, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  feature: string;
  requiredPlan?: 'basic' | 'premium' | 'enterprise';
  currentPlan?: string;
  isActive?: boolean;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ 
  children, 
  feature, 
  requiredPlan = 'premium',
  currentPlan = 'basic',
  isActive = true 
}) => {
  const planHierarchy = { basic: 1, premium: 2, enterprise: 3 };
  const hasAccess = isActive && planHierarchy[currentPlan as keyof typeof planHierarchy] >= planHierarchy[requiredPlan];

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 bg-opacity-75 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Premium Feature
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {feature} requires a {requiredPlan} subscription
          </p>
          <Link
            to="/merchant/subscription"
            className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Crown size={16} className="mr-2" />
            Upgrade Now
          </Link>
        </div>
      </div>
      <div className="opacity-30 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default SubscriptionGuard;