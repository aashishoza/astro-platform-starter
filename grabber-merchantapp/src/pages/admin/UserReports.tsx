import React, { useState } from 'react';
import { MessageSquare, AlertTriangle, CheckCircle, XCircle, Eye, Filter, Search } from 'lucide-react';
import Layout from '../../components/Layout';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface UserReport {
  id: string;
  reporterName: string;
  reporterEmail: string;
  reportType: 'inappropriate_content' | 'fake_product' | 'poor_service' | 'fraud' | 'other';
  targetType: 'merchant' | 'product';
  targetName: string;
  targetId: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  adminNotes?: string;
}

const UserReports: React.FC = () => {
  const [reports, setReports] = useState<UserReport[]>([
    {
      id: 'R001',
      reporterName: 'John Doe',
      reporterEmail: 'john.doe@email.com',
      reportType: 'inappropriate_content',
      targetType: 'product',
      targetName: 'iPhone 15 Pro',
      targetId: 'P123',
      description: 'Product images contain inappropriate content that violates community guidelines.',
      status: 'pending',
      priority: 'high',
      timestamp: '2024-01-15T10:30:00Z'
    },
    {
      id: 'R002',
      reporterName: 'Jane Smith',
      reporterEmail: 'jane.smith@email.com',
      reportType: 'fake_product',
      targetType: 'merchant',
      targetName: 'Tech World Electronics',
      targetId: 'M001',
      description: 'This merchant is selling counterfeit products claiming them to be original.',
      status: 'investigating',
      priority: 'critical',
      timestamp: '2024-01-14T15:45:00Z'
    },
    {
      id: 'R003',
      reporterName: 'Mike Johnson',
      reporterEmail: 'mike.j@email.com',
      reportType: 'poor_service',
      targetType: 'merchant',
      targetName: 'Mobile Hub',
      targetId: 'M002',
      description: 'Merchant provided poor customer service and refused to honor warranty.',
      status: 'resolved',
      priority: 'medium',
      timestamp: '2024-01-13T09:20:00Z',
      adminNotes: 'Contacted merchant and resolved the issue. Merchant agreed to honor warranty.'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter;
    const matchesType = typeFilter === 'all' || report.reportType === typeFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const handleStatusUpdate = (reportId: string, newStatus: UserReport['status']) => {
    setReports(prev => 
      prev.map(report => 
        report.id === reportId ? { ...report, status: newStatus } : report
      )
    );
    toast.success(`Report status updated to ${newStatus}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'investigating':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'inappropriate_content':
        return 'Inappropriate Content';
      case 'fake_product':
        return 'Fake Product';
      case 'poor_service':
        return 'Poor Service';
      case 'fraud':
        return 'Fraud';
      case 'other':
        return 'Other';
      default:
        return type;
    }
  };

  const ReportDetailModal = () => {
    if (!selectedReport) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Report Details - {selectedReport.id}
              </h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XCircle size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Reporter Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Name</label>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedReport.reporterName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Email</label>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedReport.reporterEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Report Date</label>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {format(new Date(selectedReport.timestamp), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Report Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Type</label>
                    <p className="font-medium text-gray-900 dark:text-white">{getReportTypeLabel(selectedReport.reportType)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Target</label>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedReport.targetName} ({selectedReport.targetType})
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400">Priority</label>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedReport.priority)}`}>
                      {selectedReport.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                {selectedReport.description}
              </p>
            </div>

            {selectedReport.adminNotes && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Admin Notes</h3>
                <p className="text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  {selectedReport.adminNotes}
                </p>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedReport.id, 'investigating');
                    setSelectedReport(null);
                  }}
                  className="px-3 py-2 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Investigate
                </button>
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedReport.id, 'resolved');
                    setSelectedReport(null);
                  }}
                  className="px-3 py-2 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Resolve
                </button>
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedReport.id, 'dismissed');
                    setSelectedReport(null);
                  }}
                  className="px-3 py-2 bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    toast.success('Merchant/Product suspended successfully!');
                    setSelectedReport(null);
                  }}
                  className="px-3 py-2 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Suspend
                </button>
              </div>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Reports & Abuse Handling</h1>
          <p className="text-gray-600 dark:text-gray-400">Review and manage user-reported issues</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {reports.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Investigating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {reports.filter(r => r.status === 'investigating').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {reports.filter(r => r.status === 'resolved').length}
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {reports.filter(r => r.priority === 'critical').length}
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
                Search Reports
              </label>
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
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
                <option value="pending">Pending</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="inappropriate_content">Inappropriate Content</option>
                <option value="fake_product">Fake Product</option>
                <option value="poor_service">Poor Service</option>
                <option value="fraud">Fraud</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Report ID</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Reporter</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Target</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Priority</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-4">
                      <span className="font-medium text-gray-900 dark:text-white">{report.id}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{report.reporterName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{report.reporterEmail}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-900 dark:text-white">{getReportTypeLabel(report.reportType)}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{report.targetName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{report.targetType}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(report.priority)}`}>
                        {report.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {format(new Date(report.timestamp), 'MMM dd, yyyy')}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No reports found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No user reports have been submitted yet'
                }
              </p>
            </div>
          )}
        </div>

        {/* Report Detail Modal */}
        <ReportDetailModal />
      </div>
    </Layout>
  );
};

export default UserReports;