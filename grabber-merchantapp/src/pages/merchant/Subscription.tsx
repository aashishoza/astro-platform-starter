import React, { useState, useEffect } from 'react';
import { Crown, Check, X, CreditCard, Calendar, Bell, Gift, Zap, Users, TrendingUp } from 'lucide-react';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';
import { format, addMonths, isBefore, differenceInDays } from 'date-fns';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number; // in months
  features: string[];
  popular?: boolean;
  color: string;
  savings?: string;
}

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

const Subscription: React.FC = () => {
  const [plans] = useState<SubscriptionPlan[]>([
    {
      id: 'basic',
      name: 'Basic',
      price: 499,
      duration: 3,
      color: 'blue',
      features: [
        'Upload up to 50 products',
        'Basic customer interaction',
        'Standard support',
        'Basic analytics',
        'Email notifications'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 999,
      duration: 6,
      color: 'purple',
      popular: true,
      savings: 'Save ₹500',
      features: [
        'Upload unlimited products',
        'Advanced customer interaction',
        'Priority support',
        'Advanced analytics & reports',
        'Push notifications',
        'Custom offers & discounts',
        'Bulk product management',
        'Customer insights'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 1799,
      duration: 12,
      color: 'gold',
      savings: 'Save ₹1200',
      features: [
        'Everything in Premium',
        'Dedicated account manager',
        '24/7 priority support',
        'Advanced API access',
        'Custom integrations',
        'White-label options',
        'Multi-store management',
        'Advanced fraud protection'
      ]
    }
  ]);

  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>({
    planId: 'premium',
    planName: 'Premium',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-07-01T00:00:00Z',
    status: 'active',
    paymentMethod: 'Razorpay',
    transactionId: 'pay_123456789',
    autoRenew: true
  });

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState('razorpay');
  const [loading, setLoading] = useState(false);

  const paymentGateways = [
    { id: 'razorpay', name: 'Razorpay', logo: '💳', description: 'UPI, Cards, Wallets' },
    { id: 'stripe', name: 'Stripe', logo: '🌐', description: 'International Cards' },
    { id: 'payu', name: 'PayU', logo: '💰', description: 'All Payment Methods' },
    { id: 'cashfree', name: 'Cashfree', logo: '🏦', description: 'Banking & UPI' }
  ];

  const isSubscriptionActive = currentSubscription?.status === 'active' && 
    !isBefore(new Date(currentSubscription.endDate), new Date());

  const daysUntilExpiry = currentSubscription ? 
    differenceInDays(new Date(currentSubscription.endDate), new Date()) : 0;

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;

    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful payment
      const newSubscription: UserSubscription = {
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        startDate: new Date().toISOString(),
        endDate: addMonths(new Date(), selectedPlan.duration).toISOString(),
        status: 'active',
        paymentMethod: paymentGateways.find(g => g.id === selectedPaymentGateway)?.name || 'Razorpay',
        transactionId: `pay_${Date.now()}`,
        autoRenew: true
      };

      setCurrentSubscription(newSubscription);
      setShowPaymentModal(false);
      setSelectedPlan(null);
      toast.success(`Successfully subscribed to ${selectedPlan.name} plan!`);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = () => {
    if (currentSubscription) {
      setCurrentSubscription({
        ...currentSubscription,
        autoRenew: false
      });
      toast.success('Auto-renewal cancelled. Your subscription will expire on the end date.');
    }
  };

  const PaymentModal = () => {
    if (!selectedPlan) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Complete Payment
              </h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Plan Summary */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">{selectedPlan.name} Plan</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedPlan.duration} months</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{selectedPlan.price}</span>
                {selectedPlan.savings && (
                  <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded text-sm">
                    {selectedPlan.savings}
                  </span>
                )}
              </div>
            </div>

            {/* Payment Gateway Selection */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Select Payment Method</h4>
              <div className="space-y-2">
                {paymentGateways.map((gateway) => (
                  <label key={gateway.id} className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="paymentGateway"
                      value={gateway.id}
                      checked={selectedPaymentGateway === gateway.id}
                      onChange={(e) => setSelectedPaymentGateway(e.target.value)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{gateway.logo}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{gateway.name}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{gateway.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <CreditCard size={20} className="mr-2" />
              {loading ? 'Processing...' : `Pay ₹${selectedPlan.price}`}
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Secure payment powered by {paymentGateways.find(g => g.id === selectedPaymentGateway)?.name}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription Plans</h1>
          <p className="text-gray-600 dark:text-gray-400">Choose the perfect plan for your business needs</p>
        </div>

        {/* Current Subscription Status */}
        {currentSubscription && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Current Subscription</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isSubscriptionActive 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}>
                {currentSubscription.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Plan</p>
                <p className="font-semibold text-gray-900 dark:text-white">{currentSubscription.planName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Expires</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {format(new Date(currentSubscription.endDate), 'MMM dd, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Days Remaining</p>
                <p className={`font-semibold ${daysUntilExpiry <= 7 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                  {daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : 'Expired'}
                </p>
              </div>
            </div>

            {daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    Your subscription expires in {daysUntilExpiry} days. Renew now to avoid service interruption.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4 flex space-x-3">
              {currentSubscription.autoRenew ? (
                <button
                  onClick={handleCancelSubscription}
                  className="px-4 py-2 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                >
                  Cancel Auto-Renewal
                </button>
              ) : (
                <span className="px-4 py-2 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-lg">
                  Auto-renewal cancelled
                </span>
              )}
            </div>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 ${
              plan.popular 
                ? 'border-purple-500 dark:border-purple-400' 
                : 'border-gray-200 dark:border-gray-700'
            } p-6`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Crown size={14} className="mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{plan.price}</span>
                  <span className="text-gray-600 dark:text-gray-400">/{plan.duration} months</span>
                </div>
                {plan.savings && (
                  <div className="mt-2">
                    <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded text-sm">
                      {plan.savings}
                    </span>
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanSelect(plan)}
                disabled={currentSubscription?.planId === plan.id && isSubscriptionActive}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                  currentSubscription?.planId === plan.id && isSubscriptionActive
                    ? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {currentSubscription?.planId === plan.id && isSubscriptionActive
                  ? 'Current Plan'
                  : 'Choose Plan'
                }
              </button>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Why Choose Premium?</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Unlimited Products</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add as many products as you want without restrictions</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Customer Insights</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Advanced analytics and customer behavior data</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Gift className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Custom Offers</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create personalized discounts and promotions</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Priority Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get faster response times and dedicated assistance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && <PaymentModal />}
      </div>
    </Layout>
  );
};

export default Subscription;