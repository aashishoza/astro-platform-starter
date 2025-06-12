import React, { useState } from 'react';
import { Store, CheckCircle, XCircle, Eye, Search, Filter, MapPin, Calendar } from 'lucide-react';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface Merchant {
  id: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  joinDate: string;
  totalRevenue: number;
  totalOrders: number;
  rating: number;
  exclusivityEndDate: string;
}

const MerchantManagement: React.FC = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([
    {
      id: 'M001',
      storeName: 'Tech World Electronics',
      ownerName: 'Rajesh Kumar',
      email: 'rajesh@techworld.com',
      phone: '+91 9876543210',
      address: '123 MG Road, Bangalore',
      city: 'Bangalore',
      status: 'active',
      joinDate: '2024-01-15T00:00:00Z',
      totalRevenue: 450000,
      totalOrders: 125,
      rating: 4.8,
      exclusivityEndDate: '2026-01-15T00:00:00Z'
    },
    {
      id: 'M002',
      storeName: 'Mobile Hub',
      ownerName: 'Priya Sharma',
      email: 'priya@mobilehub.com',
      phone: '+91 9876543211',
      address: '456 Park Street, Mumbai',
      city: 'Mumbai',
      status: 'pending',
      joinDate: '2024-01-20T00:00:00Z',
      totalRevenue: 0,
      totalOrders: 0,
      rating: 0,
      exclusivityEndDate: '2026-01-20T00:00:00Z'
    },
    {
      id: 'M003',
      storeName: 'Gadget Galaxy',
      ownerName: 'Amit Patel',
      email: 'amit@gadgetgalaxy.com',
      phone: '+91 9876543212',
      address: '789 CP, Delhi',
      city: 'Delhi',
      status: 'suspended',
      joinDate: '2023-12-10T00:00:00Z',
      totalRevenue: 280000,
      totalOrders: 89,
      rating: 3.2,
      exclusivityEndDate: '2025-12-10T00:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);

  const cities = [...new Set(merchants.map(m => m.city))];

  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch = merchant.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         merchant.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         merchant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || merchant.status === statusFilter;
    const matchesCity = cityFilter === 'all' || merchant.city === cityFilter;
    return matchesSearch && matchesStatus && matchesCity;
  });

  const handleStatusChange = (merchantId: string, newStatus: 'active' | 'suspended') => {
    setMerchants(prev => 
      prev.map(merchant => 
        merchant.id === merchantId ? { ...merchant, status: newStatus } : merchant
      )
    );
    toast.success(`Merchant ${newStatus === 'active' ? 'activated' : 'suspended'} successfully!`);
  };

  const handleApproval = (merchantId: string, approved: boolean) => {
    setMerchants(prev => 
      prev.map(merchant => 
        merchant.id === merchantId 
          ? { ...merchant, status: approved ? 'active' : 'inactive' }
          : merchant
      )
    );
    toast.success(`Merchant ${approved ? 'approved' : 'rejected'} successfully!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const MerchantDetailModal = () => {
    if (!selectedMerchant) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Merchant Details
              </h2>
              <button
                onClick={() => setSelectedMerchant(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XCircle size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Store Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Store Name</label>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedMerchant.storeName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Owner Name</label>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedMerchant.ownerName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Email</label>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedMerchant.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Phone</label>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedMerchant.phone}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Business Metrics</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</label>
                    <p className="font-medium text-gray-900 dark:text-white">₹{selectedMerchant.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Total Orders</label>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedMerchant.totalOrders}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Rating</label>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedMerchant.rating}/5.0</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Join Date</label>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {format(new Date(selectedMerchant.joinDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Location & Exclusivity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Address</label>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedMerchant.address}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">Exclusivity Ends</label>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {format(new Date(selectedMerchant.exclusivityEndDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              {selectedMerchant.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleApproval(selectedMerchant.id, true);
                      setSelectedMerchant(null);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Approve Merchant
                  </button>
                  <button
                    onClick={() => {
                      handleApproval(selectedMerchant.id, false);
                      setSelectedMerchant(null);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Reject Application
                  </button>
                </>
              )}
              
              {selectedMerchant.status === 'active' && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedMerchant.id, 'suspended');
                    setSelectedMerchant(null);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Suspend Merchant
                </button>
              )}
              
              {selectedMerchant.status === 'suspended' && (
                <button
                  onClick={() => {
                    handleStatusChange(selectedMerchant.id, 'active');
                    setSelectedMerchant(null);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Reactivate Merchant
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Merchant Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage merchant applications and monitor their performance</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Store className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Merchants</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{merchants.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {merchants.filter(m => m.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {merchants.filter(m => m.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Suspended</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {merchants.filter(m => m.status === 'suspended').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Merchants
              </label>
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or store..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City
              </label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Merchants Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Merchant</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Contact</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Location</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Performance</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMerchants.map((merchant) => (
                  <tr key={merchant.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                          {merchant.storeName.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900 dark:text-white">{merchant.storeName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{merchant.ownerName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">{merchant.email}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{merchant.phone}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <MapPin size={14} className="text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900 dark:text-white">{merchant.city}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">₹{merchant.totalRevenue.toLocaleString()}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{merchant.totalOrders} orders</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(merchant.status)}`}>
                        {merchant.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedMerchant(merchant)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                        >
                          <Eye size={16} />
                        </button>
                        {merchant.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproval(merchant.id, true)}
                              className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleApproval(merchant.id, false)}
                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMerchants.length === 0 && (
            <div className="text-center py-12">
              <Store size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No merchants found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || statusFilter !== 'all' || cityFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No merchants have registered yet'
                }
              </p>
            </div>
          )}
        </div>

        {/* Merchant Detail Modal */}
        <MerchantDetailModal />
      </div>
    </Layout>
  );
};

export default MerchantManagement;