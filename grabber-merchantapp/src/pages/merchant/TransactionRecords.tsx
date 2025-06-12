import React, { useState } from 'react';
import { CreditCard, Download, Filter, Search, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import Layout from '../../components/Layout';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  customerName: string;
  customerUpi: string;
  amount: number;
  products: string[];
  paymentMethod: 'UPI' | 'Card' | 'Cash';
  status: 'completed' | 'pending' | 'failed';
  payoutStatus: 'paid' | 'pending' | 'processing';
  timestamp: string;
  transactionId: string;
}

const TransactionRecords: React.FC = () => {
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      customerName: 'John Doe',
      customerUpi: 'john.doe@paytm',
      amount: 129900,
      products: ['iPhone 15 Pro', 'Wireless Charger'],
      paymentMethod: 'UPI',
      status: 'completed',
      payoutStatus: 'paid',
      timestamp: '2024-01-15T10:30:00Z',
      transactionId: 'TXN001234567'
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      customerUpi: 'jane.smith@gpay',
      amount: 89999,
      products: ['Samsung Galaxy S24'],
      paymentMethod: 'UPI',
      status: 'completed',
      payoutStatus: 'pending',
      timestamp: '2024-01-15T09:15:00Z',
      transactionId: 'TXN001234568'
    },
    {
      id: '3',
      customerName: 'Mike Johnson',
      customerUpi: 'mike.j@phonepe',
      amount: 45999,
      products: ['Smart Watch', 'Bluetooth Earbuds'],
      paymentMethod: 'UPI',
      status: 'pending',
      payoutStatus: 'processing',
      timestamp: '2024-01-15T08:45:00Z',
      transactionId: 'TXN001234569'
    },
    {
      id: '4',
      customerName: 'Sarah Wilson',
      customerUpi: 'sarah.w@paytm',
      amount: 134900,
      products: ['MacBook Air M3'],
      paymentMethod: 'UPI',
      status: 'completed',
      payoutStatus: 'paid',
      timestamp: '2024-01-14T16:20:00Z',
      transactionId: 'TXN001234570'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [payoutFilter, setPayoutFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesPayout = payoutFilter === 'all' || transaction.payoutStatus === payoutFilter;
    return matchesSearch && matchesStatus && matchesPayout;
  });

  const totalAmount = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const completedTransactions = filteredTransactions.filter(t => t.status === 'completed').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'paid':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'processing':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const exportToCSV = () => {
    const headers = ['Transaction ID', 'Customer Name', 'UPI ID', 'Amount', 'Products', 'Payment Method', 'Status', 'Payout Status', 'Date'];
    const csvData = filteredTransactions.map(transaction => [
      transaction.transactionId,
      transaction.customerName,
      transaction.customerUpi,
      transaction.amount,
      transaction.products.join('; '),
      transaction.paymentMethod,
      transaction.status,
      transaction.payoutStatus,
      format(new Date(transaction.timestamp), 'yyyy-MM-dd HH:mm:ss')
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction Records</h1>
            <p className="text-gray-600 dark:text-gray-400">View and manage your transaction history</p>
          </div>
          <button
            onClick={exportToCSV}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Download size={20} className="mr-2" />
            Export CSV
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedTransactions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Payouts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {transactions.filter(t => t.payoutStatus === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Transaction Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payout Status
              </label>
              <select
                value={payoutFilter}
                onChange={(e) => setPayoutFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Payouts</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Transaction</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Products</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Payout</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{transaction.transactionId}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.paymentMethod}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{transaction.customerName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.customerUpi}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-900 dark:text-white">₹{transaction.amount.toLocaleString()}</p>
                    </td>
                    <td className="p-4">
                      <div className="max-w-xs">
                        {transaction.products.map((product, index) => (
                          <span key={index} className="inline-block bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs mr-1 mb-1">
                            {product}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        {getStatusIcon(transaction.status)}
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.payoutStatus)}`}>
                        {transaction.payoutStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {format(new Date(transaction.timestamp), 'MMM dd, yyyy')}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {format(new Date(transaction.timestamp), 'HH:mm')}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <CreditCard size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No transactions found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || statusFilter !== 'all' || payoutFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Your transactions will appear here once customers start making purchases'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TransactionRecords;