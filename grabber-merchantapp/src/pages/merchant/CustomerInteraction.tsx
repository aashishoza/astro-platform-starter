import React, { useState } from 'react';
import { Users, MapPin, MessageSquare, Send, Bell, Filter } from 'lucide-react';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';

interface Customer {
  id: string;
  name: string;
  distance: number;
  lastSeen: string;
  totalOrders: number;
  preferredCategories: string[];
  status: 'online' | 'offline';
}

interface CustomerRequest {
  id: string;
  customerId: string;
  customerName: string;
  message: string;
  requestedDiscount: number;
  category: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const CustomerInteraction: React.FC = () => {
  const [nearbyCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'John Doe',
      distance: 1.2,
      lastSeen: '2 mins ago',
      totalOrders: 5,
      preferredCategories: ['Smartphones', 'Accessories'],
      status: 'online'
    },
    {
      id: '2',
      name: 'Jane Smith',
      distance: 2.8,
      lastSeen: '15 mins ago',
      totalOrders: 12,
      preferredCategories: ['Laptops', 'Tablets'],
      status: 'online'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      distance: 3.5,
      lastSeen: '1 hour ago',
      totalOrders: 3,  
      preferredCategories: ['Smart Watches'],
      status: 'offline'
    }
  ]);

  const [customerRequests, setCustomerRequests] = useState<CustomerRequest[]>([
    {
      id: '1',
      customerId: '1',
      customerName: 'John Doe',
      message: 'Hi! I\'m interested in the iPhone 15 Pro. Can you offer any discount?',
      requestedDiscount: 15,
      category: 'Smartphones',
      timestamp: '5 mins ago',
      status: 'pending'
    },
    {
      id: '2',
      customerId: '2',
      customerName: 'Jane Smith',
      message: 'Looking for a MacBook Air. Any ongoing offers?',
      requestedDiscount: 10,
      category: 'Laptops',
      timestamp: '12 mins ago',  
      status: 'pending'
    }
  ]);

  const [acceptOffersEnabled, setAcceptOffersEnabled] = useState(true);
  const [discountRange, setDiscountRange] = useState({ min: 5, max: 25 });
  const [newMessage, setNewMessage] = useState('');

  const handleRequestResponse = (requestId: string, action: 'accepted' | 'rejected') => {
    setCustomerRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: action } : req
      )
    );
    toast.success(`Request ${action} successfully!`);
  };

  const sendNotificationToCustomers = () => {
    if (!newMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    toast.success('Notification sent to nearby customers!');
    setNewMessage('');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Interaction</h1>
          <p className="text-gray-600 dark:text-gray-400">Engage with nearby customers and manage their requests</p>
        </div>

        {/* Settings Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Interaction Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={acceptOffersEnabled}
                  onChange={(e) => setAcceptOffersEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                  Accept Customer Offers
                </span>
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Allow customers to request custom discounts
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={discountRange.min}
                onChange={(e) => setDiscountRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={discountRange.max}
                onChange={(e) => setDiscountRange(prev => ({ ...prev, max: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Nearby Customers */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Nearby Customers ({nearbyCustomers.length})
                </h2>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin size={16} className="mr-1" />
                  Within 5km
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {nearbyCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        customer.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">{customer.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin size={12} className="mr-1" />
                        {customer.distance}km away • {customer.lastSeen}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {customer.preferredCategories.slice(0, 2).map(category => (
                          <span key={category} className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 text-xs rounded">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {customer.totalOrders} orders
                    </div>
                    <button className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                      Send Offer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Requests */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Customer Requests ({customerRequests.filter(r => r.status === 'pending').length})
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {customerRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {request.customerName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{request.customerName}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{request.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 text-xs rounded">
                        {request.requestedDiscount}% off
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{request.message}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 text-xs rounded">
                      {request.category}
                    </span>
                  </div>

                  {request.status === 'pending' ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRequestResponse(request.id, 'accepted')}
                        className="flex-1 px-3 py-2 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRequestResponse(request.id, 'rejected')}
                        className="flex-1 px-3 py-2 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className={`text-center py-2 rounded-lg text-sm font-medium ${
                      request.status === 'accepted' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}>
                      {request.status === 'accepted' ? 'Accepted' : 'Rejected'}
                    </div>
                  )}
                </div>
              ))}

              {customerRequests.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare size={48} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600 dark:text-gray-400">No customer requests yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Send Notification */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Send Notification to Customers</h2>
          
          <div className="flex space-x-4">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message to nearby customers..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />
            </div>
            <div className="flex flex-col justify-end">
              <button
                onClick={sendNotificationToCustomers}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <Send size={16} className="mr-2" />
                Send
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Bell size={16} className="mr-2" />
            This will send a push notification to all customers within 5km radius
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerInteraction;