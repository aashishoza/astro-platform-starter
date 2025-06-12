import React, { useState } from 'react';
import { TrendingUp, Users, MapPin, Calendar, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import Layout from '../../components/Layout';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const [userGrowthData] = useState([
    { date: '2024-01-01', users: 1200, merchants: 45 },
    { date: '2024-01-02', users: 1350, merchants: 48 },
    { date: '2024-01-03', users: 1420, merchants: 52 },
    { date: '2024-01-04', users: 1580, merchants: 55 },
    { date: '2024-01-05', users: 1720, merchants: 58 },
    { date: '2024-01-06', users: 1890, merchants: 62 },
    { date: '2024-01-07', users: 2100, merchants: 65 },
  ]);

  const [revenueData] = useState([
    { month: 'Jan', revenue: 125000, orders: 450 },
    { month: 'Feb', revenue: 145000, orders: 520 },
    { month: 'Mar', revenue: 165000, orders: 580 },
    { month: 'Apr', revenue: 185000, orders: 640 },
    { month: 'May', revenue: 205000, orders: 720 },
    { month: 'Jun', revenue: 225000, orders: 800 },
  ]);

  const [categoryData] = useState([
    { name: 'Smartphones', value: 35, color: '#3B82F6' },
    { name: 'Laptops', value: 25, color: '#10B981' },
    { name: 'Accessories', value: 20, color: '#F59E0B' },
    { name: 'Tablets', value: 12, color: '#EF4444' },
    { name: 'Smart Watches', value: 8, color: '#8B5CF6' },
  ]);

  const [cityAnalytics] = useState([
    { city: 'Mumbai', users: 4500, merchants: 85, revenue: 850000 },
    { city: 'Delhi', users: 3800, merchants: 72, revenue: 720000 },
    { city: 'Bangalore', users: 3200, merchants: 68, revenue: 680000 },
    { city: 'Chennai', users: 2100, merchants: 45, revenue: 450000 },
    { city: 'Pune', users: 1800, merchants: 38, revenue: 380000 },
    { city: 'Hyderabad', users: 1500, merchants: 32, revenue: 320000 },
  ]);

  const [hourlyActivity] = useState([
    { hour: '00', activity: 120 },
    { hour: '02', activity: 80 },
    { hour: '04', activity: 60 },
    { hour: '06', activity: 150 },
    { hour: '08', activity: 300 },
    { hour: '10', activity: 450 },
    { hour: '12', activity: 600 },
    { hour: '14', activity: 550 },
    { hour: '16', activity: 480 },
    { hour: '18', activity: 650 },
    { hour: '20', activity: 720 },
    { hour: '22', activity: 400 },
  ]);

  const exportAnalytics = () => {
    // Simulate export functionality
    const data = {
      userGrowth: userGrowthData,
      revenue: revenueData,
      categories: categoryData,
      cities: cityAnalytics
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Comprehensive platform analytics and insights</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={exportAnalytics}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Download size={20} className="mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">15,420</p>
                <p className="text-sm text-green-600 dark:text-green-400">+12.5% from last week</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹24.5L</p>
                <p className="text-sm text-green-600 dark:text-green-400">+18.2% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Cities</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">28</p>
                <p className="text-sm text-green-600 dark:text-green-400">+3 new cities</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Session</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">8.5m</p>
                <p className="text-sm text-green-600 dark:text-green-400">+2.1m from last week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Growth Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }} 
                />
                <Area type="monotone" dataKey="users" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }} 
                />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Distribution</h3>
            <div className="flex items-center">
              <ResponsiveContainer width="60%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-40% space-y-2">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: category.color }} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{category.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{category.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hourly Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hourly Activity Pattern</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={hourlyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }} 
                />
                <Bar dataKey="activity" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* City Analytics Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">City-wise Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">City</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Users</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Merchants</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Revenue</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Avg Revenue/User</th>
                </tr>
              </thead>
              <tbody>
                {cityAnalytics.map((city, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-4">
                      <div className="flex items-center">
                        <MapPin size={16} className="text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900 dark:text-white">{city.city}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-900 dark:text-white">{city.users.toLocaleString()}</td>
                    <td className="p-4 text-gray-900 dark:text-white">{city.merchants}</td>
                    <td className="p-4 text-gray-900 dark:text-white">₹{(city.revenue / 100000).toFixed(1)}L</td>
                    <td className="p-4 text-gray-900 dark:text-white">₹{Math.round(city.revenue / city.users)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;