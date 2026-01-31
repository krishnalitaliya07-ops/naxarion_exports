import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
  getAllPayments,
  getPaymentStats,
  getCommissionBreakdown,
  getPaymentMethodsDistribution,
  processRefund,
  processPayout,
  updatePaymentStatus,
  exportPaymentsCSV
} from '../../services/operations/paymentAPI';

// Status colors and icons
const statusConfig = {
  'pending': { color: 'amber', icon: 'fa-clock', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
  'processing': { color: 'blue', icon: 'fa-spinner', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  'completed': { color: 'green', icon: 'fa-check-circle', bgColor: 'bg-green-100', textColor: 'text-green-700' },
  'failed': { color: 'red', icon: 'fa-times-circle', bgColor: 'bg-red-100', textColor: 'text-red-700' },
  'refunded': { color: 'purple', icon: 'fa-undo', bgColor: 'bg-purple-100', textColor: 'text-purple-700' },
  'cancelled': { color: 'slate', icon: 'fa-ban', bgColor: 'bg-slate-100', textColor: 'text-slate-700' }
};

const paymentMethods = ['Credit Card', 'PayPal', 'Bank Transfer', 'Wire Transfer', 'Crypto'];

const AdminPayments = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({});
  const [commissionBreakdown, setCommissionBreakdown] = useState([]);
  const [paymentMethodsData, setPaymentMethodsData] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refundModal, setRefundModal] = useState(null);
  const [payoutModal, setPayoutModal] = useState(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [viewDetailsModal, setViewDetailsModal] = useState(null);

  // Fetch data
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        status: activeTab !== 'all' ? activeTab : (statusFilter !== 'all' ? statusFilter : undefined),
        method: methodFilter !== 'all' ? methodFilter : undefined,
        endDate: dateFilter || undefined
      };

      const response = await getAllPayments(params);
      setPayments(response.data || []);
      setTotalPages(response.pages || 1);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, activeTab, statusFilter, methodFilter, dateFilter]);

  const fetchStats = async () => {
    try {
      const response = await getPaymentStats();
      setStats(response.data || {});
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchCommissionBreakdown = async () => {
    try {
      const response = await getCommissionBreakdown();
      setCommissionBreakdown(response.data || []);
    } catch (error) {
      console.error('Failed to fetch commission breakdown:', error);
    }
  };

  const fetchPaymentMethodsData = async () => {
    try {
      const response = await getPaymentMethodsDistribution();
      setPaymentMethodsData(response.data || []);
    } catch (error) {
      console.error('Failed to fetch payment methods data:', error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    fetchStats();
    fetchCommissionBreakdown();
    fetchPaymentMethodsData();
  }, []);

  // Handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setMethodFilter('all');
    setDateFilter('');
    setActiveTab('all');
    setCurrentPage(1);
  };

  const handleRefund = async () => {
    if (!refundModal || !refundAmount) return;
    try {
      await processRefund(refundModal._id, { amount: parseFloat(refundAmount), reason: refundReason });
      setRefundModal(null);
      setRefundAmount('');
      setRefundReason('');
      fetchPayments();
      fetchStats();
    } catch (error) {
      console.error('Failed to process refund:', error);
    }
  };

  const handlePayout = async (paymentId) => {
    try {
      await processPayout(paymentId);
      fetchPayments();
      fetchStats();
      toast.success('Payout processed successfully');
    } catch (error) {
      console.error('Failed to process payout:', error);
    }
  };

  const handleExportReport = () => {
    exportPaymentsCSV(payments);
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount?.toFixed(2) || '0.00'}`;
  };

  // Get method icon
  const getMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'credit card': return 'fa-credit-card';
      case 'paypal': return 'fa-brands fa-paypal';
      case 'bank transfer': return 'fa-university';
      case 'wire transfer': return 'fa-exchange-alt';
      case 'crypto': return 'fa-bitcoin';
      default: return 'fa-money-bill';
    }
  };

  // Get method color
  const getMethodColor = (method) => {
    switch (method?.toLowerCase()) {
      case 'credit card': return 'text-blue-600 bg-blue-100';
      case 'paypal': return 'text-indigo-600 bg-indigo-100';
      case 'bank transfer': return 'text-green-600 bg-green-100';
      case 'wire transfer': return 'text-purple-600 bg-purple-100';
      case 'crypto': return 'text-amber-600 bg-amber-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  // Loading state
  if (loading && payments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <i className="fas fa-circle-notch fa-spin text-4xl text-green-500"></i>
          <p className="text-slate-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-dollar-sign text-white text-lg lg:text-xl"></i>
              </div>
              Payments & Commission
            </h1>
            <p className="text-sm text-slate-600">Track revenue, commissions and manage payouts</p>
          </div>
          <div className="flex flex-wrap gap-2 lg:gap-3">
            <button 
              onClick={handleExportReport}
              className="bg-white border-2 border-slate-200 text-slate-700 px-3 lg:px-5 py-2 lg:py-2.5 rounded-xl font-bold text-xs lg:text-sm hover:border-green-500 hover:text-green-600 transition-all flex items-center gap-2"
            >
              <i className="fas fa-download"></i>
              <span className="hidden sm:inline">Export Report</span>
            </button>
            <button 
              onClick={() => setPayoutModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 lg:px-5 py-2 lg:py-2.5 rounded-xl font-bold text-xs lg:text-sm hover:shadow-xl transition-all flex items-center gap-2"
            >
              <i className="fas fa-money-bill-wave"></i>
              <span className="hidden sm:inline">Process Payouts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-6 mb-6 lg:mb-8">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200 hover:border-green-500 transition-all">
          <div className="flex items-center justify-between mb-2 lg:mb-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-chart-line text-green-600 text-lg lg:text-xl"></i>
            </div>
            {stats.revenueGrowth > 0 && (
              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg">
                <i className="fas fa-arrow-up text-xs"></i> {stats.revenueGrowth}%
              </span>
            )}
          </div>
          <p className="text-xs lg:text-sm font-bold text-slate-600 mb-1">Total Revenue</p>
          <p className="text-xl lg:text-2xl font-black text-slate-900">{formatCurrency(stats.totalRevenue || 0)}</p>
        </div>

        {/* Commission */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200 hover:border-emerald-500 transition-all">
          <div className="flex items-center justify-between mb-2 lg:mb-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-percent text-emerald-600 text-lg lg:text-xl"></i>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">15%</span>
          </div>
          <p className="text-xs lg:text-sm font-bold text-slate-600 mb-1">Commission</p>
          <p className="text-xl lg:text-2xl font-black text-slate-900">{formatCurrency(stats.totalCommission || 0)}</p>
        </div>

        {/* Pending Payouts */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200 hover:border-amber-500 transition-all">
          <div className="flex items-center justify-between mb-2 lg:mb-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-clock text-amber-600 text-lg lg:text-xl"></i>
            </div>
            {(stats.pendingPayouts || 0) > 50000 && (
              <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-lg">Urgent</span>
            )}
          </div>
          <p className="text-xs lg:text-sm font-bold text-slate-600 mb-1">Pending Payouts</p>
          <p className="text-xl lg:text-2xl font-black text-slate-900">{formatCurrency(stats.pendingPayouts || 0)}</p>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200 hover:border-blue-500 transition-all">
          <div className="flex items-center justify-between mb-2 lg:mb-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-check-circle text-blue-600 text-lg lg:text-xl"></i>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-lg">
              {stats.successRate || 0}%
            </span>
          </div>
          <p className="text-xs lg:text-sm font-bold text-slate-600 mb-1">Completed</p>
          <p className="text-xl lg:text-2xl font-black text-slate-900">{stats.completed?.toLocaleString() || 0}</p>
        </div>

        {/* Failed/Refunds */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200 hover:border-red-500 transition-all col-span-2 md:col-span-1">
          <div className="flex items-center justify-between mb-2 lg:mb-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-red-600 text-lg lg:text-xl"></i>
            </div>
            {(stats.failed + stats.refunded) > 100 && (
              <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-lg">Alert</span>
            )}
          </div>
          <p className="text-xs lg:text-sm font-bold text-slate-600 mb-1">Failed/Refunds</p>
          <p className="text-xl lg:text-2xl font-black text-slate-900">{((stats.failed || 0) + (stats.refunded || 0)).toLocaleString()}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {/* Commission Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
          <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-chart-pie text-green-600"></i>
            Commission Breakdown
          </h3>
          <div className="space-y-3">
            {commissionBreakdown.length > 0 ? (
              commissionBreakdown.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-green-50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{item.category || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{item.transactionCount || 0} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-green-600">{formatCurrency(item.commission || 0)}</p>
                    <p className="text-xs text-slate-500">{item.percentage || 0}% of total</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <i className="fas fa-chart-pie text-4xl text-slate-300 mb-2"></i>
                <p className="text-slate-500 text-sm">No commission data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods Distribution */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
          <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <i className="fas fa-credit-card text-blue-600"></i>
            Payment Methods
          </h3>
          <div className="space-y-3">
            {paymentMethodsData.length > 0 ? (
              paymentMethodsData.map((method, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getMethodColor(method.method)}`}>
                      <i className={`fas ${getMethodIcon(method.method)}`}></i>
                    </div>
                    <p className="font-bold text-slate-900 text-sm">{method.method || 'Unknown'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900">{method.count || 0}</p>
                    <p className="text-xs text-slate-500">{method.percentage || 0}%</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <i className="fas fa-credit-card text-4xl text-slate-300 mb-2"></i>
                <p className="text-slate-500 text-sm">No payment methods data</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200 mb-4 lg:mb-6">
        <div className="flex flex-wrap items-center gap-3 lg:gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px] lg:min-w-[300px]">
            <div className="relative">
              <i className="fas fa-search absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
              <input 
                type="text" 
                placeholder="Search by transaction ID, order..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 lg:pl-12 pr-4 py-2.5 lg:py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm focus:border-green-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 lg:px-4 py-2.5 lg:py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:border-green-500 focus:outline-none transition-all"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          {/* Method Filter */}
          <select 
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 lg:px-4 py-2.5 lg:py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:border-green-500 focus:outline-none transition-all hidden md:block"
          >
            <option value="all">All Methods</option>
            {paymentMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>

          {/* Date Filter */}
          <input 
            type="date" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 lg:px-4 py-2.5 lg:py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:border-green-500 focus:outline-none transition-all hidden lg:block"
          />

          {/* Reset Button */}
          <button 
            onClick={handleReset}
            className="px-3 lg:px-4 py-2.5 lg:py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all"
          >
            <i className="fas fa-redo text-xs"></i> <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border-2 border-slate-200 mb-4 lg:mb-6">
        <div className="flex overflow-x-auto scrollbar-hide">
          {[
            { id: 'all', label: 'All', count: stats.total, icon: 'fa-list' },
            { id: 'completed', label: 'Completed', count: stats.completed, icon: 'fa-check-circle' },
            { id: 'pending', label: 'Pending', count: stats.pending, icon: 'fa-clock' },
            { id: 'failed', label: 'Failed', count: stats.failed, icon: 'fa-times-circle' },
            { id: 'refunded', label: 'Refunded', count: stats.refunded, icon: 'fa-undo' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 min-w-[100px] px-3 lg:px-6 py-3 lg:py-4 font-semibold text-xs lg:text-sm border-b-4 whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'border-green-500 text-green-600 bg-green-50 font-bold' 
                  : 'border-transparent text-slate-600 hover:bg-slate-50'
              }`}
            >
              <i className={`fas ${tab.icon} mr-1 lg:mr-2`}></i>
              <span className="hidden sm:inline">{tab.label}</span> ({tab.count || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Transaction</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider hidden md:table-cell">Customer</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Amount</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider hidden lg:table-cell">Commission</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider hidden sm:table-cell">Method</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <i className="fas fa-dollar-sign text-6xl text-slate-300 mb-4"></i>
                    <p className="text-slate-600 font-semibold">No payments found</p>
                    <p className="text-slate-500 text-sm mt-2">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-slate-50 transition-all">
                    {/* Transaction */}
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{payment.transactionId || 'N/A'}</p>
                        <p className="text-xs text-slate-500">
                          Order: #{payment.order?.orderId || 'N/A'}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-4 lg:px-6 py-3 lg:py-4 hidden md:table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                          {payment.user?.firstName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {payment.user?.firstName} {payment.user?.lastName}
                          </p>
                          <p className="text-xs text-slate-500">{payment.user?.email || 'N/A'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <p className="font-black text-emerald-600 text-lg">${payment.amount?.toLocaleString() || '0.00'}</p>
                      <p className="text-xs text-slate-500">{payment.currency || 'USD'}</p>
                    </td>

                    {/* Commission */}
                    <td className="px-4 lg:px-6 py-3 lg:py-4 hidden lg:table-cell">
                      <p className="font-bold text-green-600">${(payment.amount * 0.15)?.toFixed(2) || '0.00'}</p>
                      <p className="text-xs text-slate-500">15% rate</p>
                    </td>

                    {/* Method */}
                    <td className="px-4 lg:px-6 py-3 lg:py-4 hidden sm:table-cell">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${getMethodColor(payment.method)}`}>
                        <i className={`fas ${getMethodIcon(payment.method)} text-sm`}></i>
                        <span className="text-xs font-bold">{payment.method || 'Unknown'}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold ${statusConfig[payment.status]?.bgColor || 'bg-slate-100'} ${statusConfig[payment.status]?.textColor || 'text-slate-700'}`}>
                        <i className={`fas ${statusConfig[payment.status]?.icon || 'fa-circle'}`}></i>
                        {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setViewDetailsModal(payment)}
                          className="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg flex items-center justify-center transition-all"
                          title="View Details"
                        >
                          <i className="fas fa-eye text-sm"></i>
                        </button>
                        {payment.status === 'completed' && (
                          <button 
                            onClick={() => setRefundModal(payment)}
                            className="w-8 h-8 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-lg flex items-center justify-center transition-all"
                            title="Process Refund"
                          >
                            <i className="fas fa-undo text-sm"></i>
                          </button>
                        )}
                        {payment.status === 'pending' && (
                          <button 
                            onClick={() => handlePayout(payment._id)}
                            className="w-8 h-8 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg flex items-center justify-center transition-all"
                            title="Process Payout"
                          >
                            <i className="fas fa-money-bill-wave text-sm"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="px-4 py-2 text-sm font-bold text-slate-600">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* Refund Modal */}
      {refundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">Process Refund</h2>
                <button onClick={() => setRefundModal(null)} className="text-slate-400 hover:text-slate-600">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-600">Transaction: <span className="font-bold text-slate-900">{refundModal.transactionId}</span></p>
                <p className="text-sm text-slate-600">Original Amount: <span className="font-bold text-emerald-600">${refundModal.amount?.toLocaleString()}</span></p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Refund Amount</label>
                <input 
                  type="number" 
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  max={refundModal.amount}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:outline-none"
                  placeholder="Enter refund amount"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Reason</label>
                <textarea 
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:outline-none"
                  rows="3"
                  placeholder="Enter refund reason..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setRefundModal(null)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleRefund}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
                >
                  Process Refund
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewDetailsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">Payment Details</h2>
                <button onClick={() => setViewDetailsModal(null)} className="text-slate-400 hover:text-slate-600">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* Transaction Info */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                <p className="text-sm opacity-80">Transaction ID</p>
                <p className="text-lg font-black">{viewDetailsModal.transactionId}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-600 mb-1">Amount</p>
                  <p className="text-xl font-black text-emerald-600">${viewDetailsModal.amount?.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-600 mb-1">Commission (15%)</p>
                  <p className="text-xl font-black text-green-600">${(viewDetailsModal.amount * 0.15)?.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-600">Order ID</span>
                  <span className="font-bold text-slate-900">#{viewDetailsModal.order?.orderId || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-600">Customer</span>
                  <span className="font-bold text-slate-900">{viewDetailsModal.user?.firstName} {viewDetailsModal.user?.lastName}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-600">Email</span>
                  <span className="font-bold text-slate-900">{viewDetailsModal.user?.email}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-600">Payment Method</span>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${getMethodColor(viewDetailsModal.method)}`}>
                    <i className={`fas ${getMethodIcon(viewDetailsModal.method)}`}></i>
                    {viewDetailsModal.method}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-600">Status</span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${statusConfig[viewDetailsModal.status]?.bgColor} ${statusConfig[viewDetailsModal.status]?.textColor}`}>
                    {viewDetailsModal.status?.charAt(0).toUpperCase() + viewDetailsModal.status?.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-600">Date</span>
                  <span className="font-bold text-slate-900">{new Date(viewDetailsModal.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={() => setViewDetailsModal(null)}
                className="w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payout Modal */}
      {payoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">Process Payouts</h2>
                <button onClick={() => setPayoutModal(false)} className="text-slate-400 hover:text-slate-600">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <i className="fas fa-exclamation-triangle text-amber-600 text-xl"></i>
                  <div>
                    <p className="font-bold text-amber-900">Pending Payouts</p>
                    <p className="text-2xl font-black text-amber-700">{formatCurrency(stats.pendingPayouts || 0)}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                This will process all pending supplier payouts. Make sure you have verified all transactions before proceeding.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setPayoutModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    toast.success('Batch payout processing initiated');
                    setPayoutModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
                >
                  Process All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
