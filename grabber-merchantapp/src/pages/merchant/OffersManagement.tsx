import React, { useState } from 'react';
import { Plus, Calendar, Percent, Clock, Edit, Trash2, Tag } from 'lucide-react';
import Layout from '../../components/Layout';
import SubscriptionGuard from '../../components/SubscriptionGuard';
import { useSubscription } from '../../hooks/useSubscription';
import toast from 'react-hot-toast';
import { format, addDays } from 'date-fns';

interface Offer {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  maxUsage: number;
  currentUsage: number;
  minOrderValue: number;
  status: 'active' | 'inactive' | 'expired';
  categories: string[];
}

const OffersManagement: React.FC = () => {
  const { hasFeatureAccess } = useSubscription();
  
  const [offers, setOffers] = useState<Offer[]>([
    {
      id: '1',
      title: 'Flash Sale - 20% Off',
      description: 'Get 20% off on all smartphones',
      discountType: 'percentage',
      discountValue: 20,
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      maxUsage: 100,
      currentUsage: 45,
      minOrderValue: 5000,
      status: 'active',
      categories: ['Smartphones']
    },
    {
      id: '2',
      title: 'Laptop Bonanza',
      description: 'Flat ₹10,000 off on premium laptops',
      discountType: 'fixed',
      discountValue: 10000,
      startDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
      maxUsage: 50,
      currentUsage: 12,
      minOrderValue: 50000,
      status: 'active',
      categories: ['Laptops']
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const [newOffer, setNewOffer] = useState<Omit<Offer, 'id' | 'currentUsage'>>({
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    maxUsage: 100,
    minOrderValue: 0,
    status: 'active',
    categories: []
  });

  const categories = ['Smartphones', 'Laptops', 'Tablets', 'Accessories', 'Smart Watches'];

  const handleAddOffer = () => {
    if (!hasFeatureAccess('premium')) {
      toast.error('Custom offers require a Premium subscription');
      return;
    }

    if (!newOffer.title || !newOffer.description || newOffer.discountValue <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (new Date(newOffer.endDate) <= new Date(newOffer.startDate)) {
      toast.error('End date must be after start date');
      return;
    }

    const offer: Offer = {
      ...newOffer,
      id: Date.now().toString(),
      currentUsage: 0
    };

    setOffers([...offers, offer]);
    setNewOffer({
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      maxUsage: 100,
      minOrderValue: 0,
      status: 'active',
      categories: []
    });
    setShowAddModal(false);
    toast.success('Offer created successfully!');
  };

  const handleDeleteOffer = (id: string) => {
    setOffers(offers.filter(o => o.id !== id));
    toast.success('Offer deleted successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const OfferModal = ({ isEdit = false }: { isEdit?: boolean }) => {
    const offer = isEdit ? editingOffer : newOffer;
    const setOffer = isEdit ? setEditingOffer : setNewOffer;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Offer' : 'Create New Offer'}
            </h2>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Offer Title *
              </label>
              <input
                type="text"
                value={offer?.title || ''}
                onChange={(e) => setOffer(prev => ({ ...prev!, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter offer title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={offer?.description || ''}
                onChange={(e) => setOffer(prev => ({ ...prev!, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe your offer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discount Type *
                </label>
                <select
                  value={offer?.discountType || 'percentage'}
                  onChange={(e) => setOffer(prev => ({ ...prev!, discountType: e.target.value as 'percentage' | 'fixed' }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discount Value *
                </label>
                <input
                  type="number"
                  min="0"
                  value={offer?.discountValue || ''}
                  onChange={(e) => setOffer(prev => ({ ...prev!, discountValue: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={offer?.discountType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={offer?.startDate || ''}
                  onChange={(e) => setOffer(prev => ({ ...prev!, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={offer?.endDate || ''}
                  onChange={(e) => setOffer(prev => ({ ...prev!, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Usage
                </label>
                <input
                  type="number"
                  min="1"
                  value={offer?.maxUsage || ''}
                  onChange={(e) => setOffer(prev => ({ ...prev!, maxUsage: parseInt(e.target.value) || 100 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Maximum number of uses"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Order Value
                </label>
                <input
                  type="number"
                  min="0"
                  value={offer?.minOrderValue || ''}
                  onChange={(e) => setOffer(prev => ({ ...prev!, minOrderValue: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Minimum order amount"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Applicable Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <label key={category} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={offer?.categories.includes(category) || false}
                      onChange={(e) => {
                        const categories = offer?.categories || [];
                        if (e.target.checked) {
                          setOffer(prev => ({ ...prev!, categories: [...categories, category] }));
                        } else {
                          setOffer(prev => ({ ...prev!, categories: categories.filter(c => c !== category) }));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={offer?.status || 'active'}
                onChange={(e) => setOffer(prev => ({ ...prev!, status: e.target.value as 'active' | 'inactive' }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditingOffer(null);
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={isEdit ? () => {
                setEditingOffer(null);
                toast.success('Offer updated successfully!');
              } : handleAddOffer}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              {isEdit ? 'Update Offer' : 'Create Offer'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Offers & Discounts</h1>
            <p className="text-gray-600 dark:text-gray-400">Create and manage promotional offers</p>
          </div>
          <button
            onClick={() => hasFeatureAccess('premium') ? setShowAddModal(true) : toast.error('Custom offers require Premium subscription')}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Plus size={20} className="mr-2" />
            Create Offer
          </button>
        </div>

        {/* Offers Grid */}
        <SubscriptionGuard 
          feature="Custom offers and advanced discount management"
          requiredPlan="premium"
          currentPlan="basic"
          isActive={hasFeatureAccess('premium')}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg mr-3">
                      <Tag size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{offer.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{offer.description}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(offer.status)}`}>
                    {offer.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Percent size={16} className="text-blue-600 dark:text-blue-400 mr-1" />
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Discount</p>
                  </div>

                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <Clock size={16} className="text-green-600 dark:text-green-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {offer.currentUsage}/{offer.maxUsage}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Used</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>{format(new Date(offer.startDate), 'MMM dd')} - {format(new Date(offer.endDate), 'MMM dd, yyyy')}</span>
                  </div>
                  {offer.minOrderValue > 0 && (
                    <span>Min: ₹{offer.minOrderValue}</span>
                  )}
                </div>

                {offer.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {offer.categories.map(category => (
                      <span key={category} className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 text-xs rounded">
                        {category}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingOffer(offer)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteOffer(offer.id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SubscriptionGuard>

        {offers.length === 0 && (
          <div className="text-center py-12">
            <Tag size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No offers created</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first promotional offer to attract customers
            </p>
            <button
              onClick={() => hasFeatureAccess('premium') ? setShowAddModal(true) : toast.error('Custom offers require Premium subscription')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Plus size={20} className="mr-2" />
              Create Your First Offer
            </button>
          </div>
        )}

        {/* Modals */}
        {showAddModal && <OfferModal />}
        {editingOffer && <OfferModal isEdit />}
      </div>
    </Layout>
  );
};

export default OffersManagement;