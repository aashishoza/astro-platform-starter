import React, { useState } from 'react';
import { Users, Store, TrendingUp, MapPin, Bell, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Layout from '../../components/Layout';

const AdminDashboard: React.FC = () => {
  const [stats] = useState({
    totalUsers: 15420,
    activeMerchants: 342,
    liveUsers: 1250,
    totalRevenue: 2450000
  });

  const [chartData] = useState([
    { name: 'Mon', users: 1200, merchants: 45, revenue: 125000 },
    { name: 'Tue', users: 1100, merchants: 52, revenue: 135000 },
    { name: 'Wed', users: 1800, merchants: 48, revenue: 180000 },
    { name: 'Thu', users: 1600, merchants: 55, revenue: 165000 },
    { name: 'Fri', users: 2100, merchants: 62, revenue: 220000 },
    { name: 'Sat', users: 1900, merchants: 58, revenue: 195000 },
    { name: 'Sun', users: 1750, merchants: 51, revenue: 175000 },
  ]);

  const [cityData] = useState([
    { name: 'Mumbai', value: 35, color: '#3B82F6' },
    { name: 'Delhi', value: 28, color: '#10B981' },
    { name: 'Bangalore', value: 22, color: '#F59E0B' },
    { name: 'Chennai', value: 15, color: '#EF4444' },
  ]);

  const [recentActivities] = useState([
    { id: '1', type: 'merchant_join', message: 'New merchant "Tech Store" joined', time: '5 mins ago' },
    { id: '2', type: 'user_report', message: 'Product reported by user for inappropriate content', time: '12 mins ago' },
    { id: '3', type: 'payout', message: 'Payout of ₹45,000 processed for Merchant ID: M123', time: '25 mins ago' },
    { id: '4', type: 'merchant_suspend', message: 'Merchant "ABC Electronics" suspended for policy violation', time: '1 hour ago' },
  ]);

  const StatCard = ({ title, value, icon: Icon, change, color }: any) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${
              change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp size={14} className="mr-1" />
              {change > 0 ? '+' : ''}{change}% from last week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'merchant_join':
        return <Store size={16} className="text-green-500" />;
      case 'user_report':
        return <Bell size={16} className="text-red-500" />;
      case 'payout':
        return <TrendingUp size={16} className="text-blue-500" />;
      case 'merchant_suspend':
        return <Users size={16} className="text-orange-500" />;
      default:
        return <Activity size={16} className="text-gray-500" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor platform performance and user activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={Users}
            change={8.2}
            color="bg-blue-500"
          />
          <StatCard
            title="Active Merchants"
            value={stats.activeMerchants}
            icon={Store}
            change={12.5}
            color="bg-green-500"
          />
          <StatCard
            title="Live Users"
            value={stats.liveUsers.toLocaleString()}
            icon={Activity}
            change={-2.1}
            color="bg-purple-500"
          />
          <StatCard
            title="Total Revenue"
            value={`₹${(stats.totalRevenue / 100000).toFixed(1)}L`}
            icon={TrendingUp}
            change={15.7}
            color="bg-orange-500"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Activity Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }} 
                />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue by Day</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }} 
                />
                <Bar dataKey="revenue" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* City Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Distribution by City</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={cityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {cityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {cityData.map((city, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: city.color }} />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{city.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{city.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activities</h3>
            </div>
            <div className="p-6 space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-left transition-colors duration-200">
              <Store className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
              <h4 className="font-medium text-gray-900 dark:text-white">Approve Merchants</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Review pending applications</p>
            </button>

            <button className="p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg text-left transition-colors duration-200">
              <Bell className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
              <h4 className="font-medium text-gray-900 dark:text-white">Send Notifications</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Broadcast to all users</p>
            </button>

            <button className="p-4 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg text-left transition-colors duration-200">
              <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-2" />
              <h4 className="font-medium text-gray-900 dark:text-white">Process Payouts</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Review pending payments</p>
            </button>

            <button className="p-4 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-left transition-colors duration-200">
              <Users className="w-8 h-8 text-red-600 dark:text-red-400 mb-2" />
              <h4 className="font-medium text-gray-900 dark:text-white">Review Reports</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Handle user complaints</p>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;