import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Package, 
  Tag, 
  TrendingUp, 
  Users, 
  Eye,
  ShoppingCart,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Layout from '../../components/Layout';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    todaySales: 12450,
    totalProducts: 85,
    activeOffers: 12,
    customerVisits: 245
  });

  const [chartData] = useState([
    { name: 'Mon', sales: 2400, clicks: 1200 },
    { name: 'Tue', sales: 1398, clicks: 800 },
    { name: 'Wed', sales: 9800, clicks: 1500 },
    { name: 'Thu', sales: 3908, clicks: 1100 },
    { name: 'Fri', sales: 4800, clicks: 1800 },
    { name: 'Sat', sales: 3800, clicks: 1600 },
    { name: 'Sun', sales: 4300, clicks: 1900 },
  ]);

  const [recentOrders] = useState([
    { id: '1', customer: 'John Doe', amount: 125.50, status: 'completed', time: '2 mins ago' },
    { id: '2', customer: 'Jane Smith', amount: 89.99, status: 'pending', time: '15 mins ago' },
    { id: '3', customer: 'Mike Johnson', amount: 200.00, status: 'completed', time: '1 hour ago' },
    { id: '4', customer: 'Sarah Wilson', amount: 45.75, status: 'processing', time: '2 hours ago' },
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
              {change > 0 ? '+' : ''}{change}% from yesterday
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor your store performance and customer activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Today's Sales"
            value={`₹${stats.todaySales.toLocaleString()}`}
            icon={DollarSign}
            change={12.5}
            color="bg-green-500"
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            change={5.2}
            color="bg-blue-500"
          />
          <StatCard
            title="Active Offers"
            value={stats.activeOffers}
            icon={Tag}
            change={-2.1}
            color="bg-purple-500"
          />
          <StatCard
            title="Customer Visits"
            value={stats.customerVisits}
            icon={Users}
            change={8.7}
            color="bg-orange-500"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sales Trend</h3>
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
                <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Clicks</h3>
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
                <Bar dataKey="clicks" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {order.customer.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="ml-3 text-gray-900 dark:text-white">{order.customer}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-900 dark:text-white font-medium">₹{order.amount}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">{order.time}</td>
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

export default Dashboard;