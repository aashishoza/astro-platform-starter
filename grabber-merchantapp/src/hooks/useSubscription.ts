import { useState, useEffect } from 'react';
import { isBefore, differenceInDays } from 'date-fns';

interface UserSubscription {
  planId: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  paymentMethod: string;
  transactionId: string;
  autoRenew: boolean;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<UserSubscription | null>({
    planId: 'premium',
    planName: 'Premium',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-07-01T00:00:00Z',
    status: 'active',
    paymentMethod: 'Razorpay',
    transactionId: 'pay_123456789',
    autoRenew: true
  });

  const [loading, setLoading] = useState(false);

  const isActive = subscription?.status === 'active' && 
    !isBefore(new Date(subscription.endDate), new Date());

  const daysUntilExpiry = subscription ? 
    differenceInDays(new Date(subscription.endDate), new Date()) : 0;

  const hasFeatureAccess = (requiredPlan: 'basic' | 'premium' | 'enterprise') => {
    if (!isActive) return false;
    
    const planHierarchy = { basic: 1, premium: 2, enterprise: 3 };
    const currentPlanLevel = planHierarchy[subscription?.planId as keyof typeof planHierarchy] || 0;
    const requiredLevel = planHierarchy[requiredPlan];
    
    return currentPlanLevel >= requiredLevel;
  };

  const checkSubscriptionStatus = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from Firebase/API
      // For now, we'll use the mock data
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error checking subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  return {
    subscription,
    isActive,
    daysUntilExpiry,
    hasFeatureAccess,
    loading,
    refreshSubscription: checkSubscriptionStatus
  };
};