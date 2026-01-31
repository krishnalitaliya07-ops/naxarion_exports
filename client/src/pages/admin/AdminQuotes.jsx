import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  getAllQuotes,
  getQuoteStats,
  updateQuoteStatus,
  sendQuoteResponse,
  deleteQuote
} from '../../services/operations/quoteAPI';

const AdminQuotes = () => {
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inReview: 0,
    quoted: 0,
    expired: 0,
    quotedPercentage: 0,
    expiredPercentage: 0
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    search: '',
    dateRange: '30days',
    page: 1,
    limit: 10
  });
  const [activeTab, setActiveTab] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseData, setResponseData] = useState({
    quotedPrice: '',
    moq: '',
    leadTimeValue: '',
    leadTimeUnit: 'days',
    paymentTerms: '',
    shippingTerms: '',
    validUntil: '',
    notes: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [filters, activeTab]);

  const fetchStats = async () => {
    try {
      const response = await getQuoteStats(token);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const params = { ...filters };
      
      // Apply tab filter
      if (activeTab !== 'all') {
        params.status = activeTab;
      }
      
      const response = await getAllQuotes(token, params);
      if (response.success) {
        setQuotes(response.data || []);
        setPagination({
          page: response.page || 1,
          pages: response.pages || 1,
          total: response.total || 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (quoteId, newStatus) => {
    try {
      await updateQuoteStatus(quoteId, newStatus, token);
      fetchQuotes();
      fetchStats();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleSendResponse = async () => {
    if (!selectedQuote) return;
    
    try {
      const data = {
        quotedPrice: parseFloat(responseData.quotedPrice),
        moq: parseInt(responseData.moq),
        leadTime: {
          value: parseInt(responseData.leadTimeValue),
          unit: responseData.leadTimeUnit
        },
        paymentTerms: responseData.paymentTerms,
        shippingTerms: responseData.shippingTerms,
        validUntil: responseData.validUntil,
        notes: responseData.notes
      };
      
      await sendQuoteResponse(selectedQuote._id, data, token);
      setShowResponseModal(false);
      setSelectedQuote(null);
      setResponseData({
        quotedPrice: '',
        moq: '',
        leadTimeValue: '',
        leadTimeUnit: 'days',
        paymentTerms: '',
        shippingTerms: '',
        validUntil: '',
        notes: ''
      });
      fetchQuotes();
      fetchStats();
    } catch (error) {
      console.error('Failed to send response:', error);
    }
  };

  const handleDelete = async (quoteId) => {
    if (!window.confirm('Are you sure you want to delete this quote?')) return;
    
    try {
      await deleteQuote(quoteId, token);
      fetchQuotes();
      fetchStats();
    } catch (error) {
      console.error('Failed to delete quote:', error);
    }
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      priority: '',
      category: '',
      search: '',
      dateRange: '30days',
      page: 1,
      limit: 10
    });
    setActiveTab('all');
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-blue-500 text-white',
      'in-review': 'bg-amber-500 text-white',
      'quoted': 'bg-green-500 text-white',
      'negotiating': 'bg-purple-500 text-white',
      'accepted': 'bg-emerald-600 text-white',
      'rejected': 'bg-red-500 text-white',
      'expired': 'bg-slate-500 text-white'
    };
    return colors[status] || 'bg-slate-500 text-white';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'New Request',
      'in-review': 'In Progress',
      'quoted': 'Quoted',
      'negotiating': 'Negotiating',
      'accepted': 'Accepted',
      'rejected': 'Rejected',
      'expired': 'Expired'
    };
    return labels[status] || status;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'bg-red-500 text-white',
      'medium': 'bg-amber-500 text-white',
      'low': 'bg-green-500 text-white'
    };
    return colors[priority] || 'bg-slate-500 text-white';
  };

  const getTimeRemaining = (expiresAt) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;
    
    if (diff <= 0) return { text: 'Expired', color: 'text-red-600' };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 7) return { text: `${days} days`, color: 'text-green-600' };
    if (days > 3) return { text: `${days} days ${hours}h`, color: 'text-amber-600' };
    return { text: `${days}d ${hours}h`, color: 'text-red-600' };
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading && quotes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <i className="fas fa-circle-notch fa-spin text-4xl text-violet-500"></i>
          <p className="text-slate-600">Loading quotes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 -mx-6 -mt-6 px-8 py-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-file-invoice text-white text-xl"></i>
              </div>
              Quote Requests (RFQ)
            </h1>
            <p className="text-sm text-slate-600">Manage and monitor all buyer quotation requests</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white border-2 border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:border-violet-500 hover:text-violet-600 transition-all flex items-center gap-2">
              <i className="fas fa-download"></i>
              Export CSV
            </button>
            <button className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-xl transition-all flex items-center gap-2">
              <i className="fas fa-plus"></i>
              Create RFQ
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Total RFQs */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200 hover:border-violet-500 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-file-invoice text-violet-600 text-xl"></i>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg">
              <i className="fas fa-arrow-up text-xs mr-1"></i>18.2%
            </span>
          </div>
          <p className="text-sm font-bold text-slate-600 mb-1">Total RFQs</p>
          <p className="text-2xl font-black text-slate-900">{stats.total.toLocaleString()}</p>
        </div>

        {/* New Requests */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200 hover:border-blue-500 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-inbox text-blue-600 text-xl"></i>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-lg">New</span>
          </div>
          <p className="text-sm font-bold text-slate-600 mb-1">New Requests</p>
          <p className="text-2xl font-black text-slate-900">{stats.pending.toLocaleString()}</p>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200 hover:border-amber-500 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-spinner text-amber-600 text-xl"></i>
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-lg">Active</span>
          </div>
          <p className="text-sm font-bold text-slate-600 mb-1">In Progress</p>
          <p className="text-2xl font-black text-slate-900">{stats.inReview.toLocaleString()}</p>
        </div>

        {/* Quoted */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200 hover:border-green-500 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-check-circle text-green-600 text-xl"></i>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg">{stats.quotedPercentage}%</span>
          </div>
          <p className="text-sm font-bold text-slate-600 mb-1">Quoted</p>
          <p className="text-2xl font-black text-slate-900">{stats.quoted.toLocaleString()}</p>
        </div>

        {/* Expired */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200 hover:border-red-500 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-hourglass-end text-red-600 text-xl"></i>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">{stats.expiredPercentage}%</span>
          </div>
          <p className="text-sm font-bold text-slate-600 mb-1">Expired</p>
          <p className="text-2xl font-black text-slate-900">{stats.expired.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                placeholder="Search by RFQ ID, buyer, product..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm focus:border-violet-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:border-violet-500 focus:outline-none transition-all"
          >
            <option value="">All Status</option>
            <option value="pending">New Request</option>
            <option value="in-review">In Progress</option>
            <option value="quoted">Quoted</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value, page: 1 })}
            className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:border-violet-500 focus:outline-none transition-all"
          >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Date Filter */}
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value, page: 1 })}
            className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:border-violet-500 focus:outline-none transition-all"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="today">Today</option>
          </select>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
          >
            <i className="fas fa-redo text-xs"></i> Reset
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-6 py-4 font-bold text-sm border-b-4 whitespace-nowrap transition-all ${
              activeTab === 'all'
                ? 'border-violet-500 text-violet-600 bg-violet-50'
                : 'border-transparent text-slate-600 hover:bg-slate-50'
            }`}
          >
            <i className="fas fa-list mr-2"></i>
            All Quotes ({stats.total})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 px-6 py-4 font-bold text-sm border-b-4 whitespace-nowrap transition-all ${
              activeTab === 'pending'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-slate-600 hover:bg-slate-50'
            }`}
          >
            <i className="fas fa-inbox mr-2"></i>
            New Requests ({stats.pending})
          </button>
          <button
            onClick={() => setActiveTab('in-review')}
            className={`flex-1 px-6 py-4 font-bold text-sm border-b-4 whitespace-nowrap transition-all ${
              activeTab === 'in-review'
                ? 'border-amber-500 text-amber-600 bg-amber-50'
                : 'border-transparent text-slate-600 hover:bg-slate-50'
            }`}
          >
            <i className="fas fa-spinner mr-2"></i>
            In Progress ({stats.inReview})
          </button>
          <button
            onClick={() => setActiveTab('quoted')}
            className={`flex-1 px-6 py-4 font-bold text-sm border-b-4 whitespace-nowrap transition-all ${
              activeTab === 'quoted'
                ? 'border-green-500 text-green-600 bg-green-50'
                : 'border-transparent text-slate-600 hover:bg-slate-50'
            }`}
          >
            <i className="fas fa-check-circle mr-2"></i>
            Quoted ({stats.quoted})
          </button>
          <button
            onClick={() => setActiveTab('expired')}
            className={`flex-1 px-6 py-4 font-bold text-sm border-b-4 whitespace-nowrap transition-all ${
              activeTab === 'expired'
                ? 'border-red-500 text-red-600 bg-red-50'
                : 'border-transparent text-slate-600 hover:bg-slate-50'
            }`}
          >
            <i className="fas fa-hourglass-end mr-2"></i>
            Expired ({stats.expired})
          </button>
        </div>
      </div>

      {/* Quote Cards */}
      <div className="space-y-6">
        {quotes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-file-invoice text-slate-400 text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No quote requests found</h3>
            <p className="text-slate-500">Quote requests will appear here when customers submit them.</p>
          </div>
        ) : (
          quotes.map((quote) => {
            const timeRemaining = getTimeRemaining(quote.expiresAt);
            
            return (
              <div
                key={quote._id}
                className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 hover:border-violet-500 transition-all overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-4 border-b border-slate-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-xl font-black text-slate-900">#{quote.quoteId}</h3>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(quote.status)}`}>
                          <i className="fas fa-circle text-xs mr-1"></i>
                          {getStatusLabel(quote.status)}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getPriorityColor(quote.priority)}`}>
                          <i className="fas fa-exclamation-circle mr-1"></i>
                          {quote.priority?.charAt(0).toUpperCase() + quote.priority?.slice(1)} Priority
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">
                        Submitted: {formatDateTime(quote.createdAt)} • Expires: {formatDate(quote.expiresAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {quote.status === 'pending' || quote.status === 'in-review' ? (
                        <>
                          <button
                            onClick={() => {
                              setSelectedQuote(quote);
                              setShowResponseModal(true);
                            }}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                          >
                            <i className="fas fa-paper-plane"></i> Send Quote
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(quote._id, 'in-review')}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                          >
                            <i className="fas fa-user-plus"></i> Assign
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Buyer & Product Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Buyer Information */}
                    <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                      <h4 className="text-sm font-black text-blue-900 mb-4 uppercase flex items-center gap-2">
                        <i className="fas fa-user"></i> Buyer Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold">{getInitials(quote.customerInfo?.name || quote.customer?.name)}</span>
                          </div>
                          <div>
                            <p className="text-base font-black text-slate-900">{quote.customerInfo?.name || quote.customer?.name || 'N/A'}</p>
                            <p className="text-sm text-slate-600">{quote.customerInfo?.company || 'Individual'}</p>
                            {quote.deliveryLocation?.country && (
                              <div className="flex items-center gap-2 mt-1">
                                <i className="fas fa-map-marker-alt text-blue-600"></i>
                                <span className="text-xs font-semibold text-slate-700">{quote.deliveryLocation.country}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <i className="fas fa-envelope text-blue-600"></i>
                          <span className="text-slate-700">{quote.customerInfo?.email || quote.customer?.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <i className="fas fa-phone text-blue-600"></i>
                          <span className="text-slate-700">{quote.customerInfo?.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Product Requirements */}
                    <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                      <h4 className="text-sm font-black text-purple-900 mb-4 uppercase flex items-center gap-2">
                        <i className="fas fa-box"></i> Product Requirements
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-slate-600">Product / Category</p>
                          <p className="text-sm font-bold text-slate-900">{quote.productName || quote.product?.name || 'N/A'} - {quote.category || 'General'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Quantity Required</p>
                          <p className="text-lg font-black text-purple-600">{quote.quantity?.toLocaleString() || 'N/A'} {quote.unit || 'units'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Target Price</p>
                          <p className="text-sm font-bold text-slate-900">
                            {quote.targetPrice ? `$${quote.targetPrice.toLocaleString()}` : 'Flexible'}
                            {quote.budget?.min && quote.budget?.max && (
                              <span className="text-slate-500 ml-1">
                                (Budget: ${quote.budget.min} - ${quote.budget.max})
                              </span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Expected Delivery</p>
                          <p className="text-sm font-bold text-slate-900">{formatDate(quote.expectedDeliveryDate)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {quote.description && (
                    <div className="bg-slate-50 rounded-xl p-5 mb-6 border border-slate-200">
                      <h4 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                        <i className="fas fa-clipboard-list"></i> Detailed Requirements & Specifications
                      </h4>
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{quote.description}</p>
                      {quote.specifications && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <p className="text-xs font-bold text-slate-600 mb-2">Specifications:</p>
                          <p className="text-sm text-slate-700">{quote.specifications}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Additional Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 border-2 border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <i className="fas fa-flag text-violet-600"></i>
                        <p className="text-xs font-bold text-slate-600">Urgency</p>
                      </div>
                      <p className="text-sm font-bold text-slate-900">{quote.urgency || 'Medium'}</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border-2 border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <i className="fas fa-shipping-fast text-cyan-600"></i>
                        <p className="text-xs font-bold text-slate-600">Delivery Location</p>
                      </div>
                      <p className="text-sm font-bold text-slate-900">
                        {quote.deliveryLocation?.city ? `${quote.deliveryLocation.city}, ` : ''}
                        {quote.deliveryLocation?.country || 'Not specified'}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border-2 border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <i className="fas fa-paperclip text-amber-600"></i>
                        <p className="text-xs font-bold text-slate-600">Attachments</p>
                      </div>
                      <p className="text-sm font-bold text-slate-900">{quote.attachments?.length || 0} files</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border-2 border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <i className="fas fa-clock text-red-600"></i>
                        <p className="text-xs font-bold text-slate-600">Time Remaining</p>
                      </div>
                      <p className={`text-sm font-bold ${timeRemaining?.color || 'text-slate-900'}`}>
                        {timeRemaining?.text || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-4">
                      <button className="text-sm font-bold text-violet-600 hover:text-violet-700 flex items-center gap-2">
                        <i className="fas fa-eye"></i> View Full Details
                      </button>
                      <button className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2">
                        <i className="fas fa-comment"></i> Contact Buyer
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(quote._id)}
                        className="px-4 py-2 bg-slate-100 hover:bg-red-100 text-slate-700 hover:text-red-600 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                      >
                        <i className="fas fa-archive"></i> Archive
                      </button>
                      {(quote.status === 'pending' || quote.status === 'in-review') && (
                        <button
                          onClick={() => {
                            setSelectedQuote(quote);
                            setShowResponseModal(true);
                          }}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                        >
                          <i className="fas fa-paper-plane"></i> Send Quote
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
            disabled={filters.page === 1}
            className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold disabled:opacity-50 hover:border-violet-500 transition-all"
          >
            <i className="fas fa-chevron-left mr-2"></i> Previous
          </button>
          <span className="px-4 py-2 text-sm font-bold text-slate-600">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => setFilters({ ...filters, page: Math.min(pagination.pages, filters.page + 1) })}
            disabled={filters.page === pagination.pages}
            className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold disabled:opacity-50 hover:border-violet-500 transition-all"
          >
            Next <i className="fas fa-chevron-right ml-2"></i>
          </button>
        </div>
      )}

      {/* Send Quote Response Modal */}
      {showResponseModal && selectedQuote && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">
                  Send Quote Response - #{selectedQuote.quoteId}
                </h2>
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setSelectedQuote(null);
                  }}
                  className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-all"
                >
                  <i className="fas fa-times text-slate-600"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Quoted Price per Unit ($) *
                  </label>
                  <input
                    type="number"
                    value={responseData.quotedPrice}
                    onChange={(e) => setResponseData({ ...responseData, quotedPrice: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-violet-500 focus:outline-none"
                    placeholder="e.g., 45.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Minimum Order Quantity *
                  </label>
                  <input
                    type="number"
                    value={responseData.moq}
                    onChange={(e) => setResponseData({ ...responseData, moq: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-violet-500 focus:outline-none"
                    placeholder="e.g., 1000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Lead Time *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={responseData.leadTimeValue}
                      onChange={(e) => setResponseData({ ...responseData, leadTimeValue: e.target.value })}
                      className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-violet-500 focus:outline-none"
                      placeholder="e.g., 30"
                    />
                    <select
                      value={responseData.leadTimeUnit}
                      onChange={(e) => setResponseData({ ...responseData, leadTimeUnit: e.target.value })}
                      className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-violet-500 focus:outline-none"
                    >
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Quote Valid Until *
                  </label>
                  <input
                    type="date"
                    value={responseData.validUntil}
                    onChange={(e) => setResponseData({ ...responseData, validUntil: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-violet-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Payment Terms
                  </label>
                  <input
                    type="text"
                    value={responseData.paymentTerms}
                    onChange={(e) => setResponseData({ ...responseData, paymentTerms: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-violet-500 focus:outline-none"
                    placeholder="e.g., 30% Advance, 70% L/C"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Shipping Terms
                  </label>
                  <input
                    type="text"
                    value={responseData.shippingTerms}
                    onChange={(e) => setResponseData({ ...responseData, shippingTerms: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-violet-500 focus:outline-none"
                    placeholder="e.g., FOB China"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={responseData.notes}
                  onChange={(e) => setResponseData({ ...responseData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-violet-500 focus:outline-none resize-none"
                  placeholder="Any additional information for the buyer..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowResponseModal(false);
                  setSelectedQuote(null);
                }}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSendResponse}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-xl transition-all flex items-center gap-2"
              >
                <i className="fas fa-paper-plane"></i>
                Send Quote Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuotes;
