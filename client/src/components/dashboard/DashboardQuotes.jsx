import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Plus,
  Eye,
  Loader2,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  DollarSign,
  Package,
  TrendingUp,
  AlertCircle,
  X,
  Send,
  Paperclip,
  Building2,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';
import { apiconnector } from '../../services/apiconnector';
import { quoteEndpoints, dashboardEndpoints } from '../../services/apis';

const DashboardQuotes = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState([]);
  const [filteredQuotes, setFilteredQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    quoted: 0,
    accepted: 0,
    rejected: 0
  });

  const statusConfig = {
    'pending': {
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      badge: 'bg-yellow-100 text-yellow-800',
      label: 'Pending'
    },
    'in-review': {
      icon: MessageSquare,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800',
      label: 'In Review'
    },
    'quoted': {
      icon: FileText,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      badge: 'bg-purple-100 text-purple-800',
      label: 'Quoted'
    },
    'negotiating': {
      icon: TrendingUp,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      badge: 'bg-cyan-100 text-cyan-800',
      label: 'Negotiating'
    },
    'accepted': {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      badge: 'bg-green-100 text-green-800',
      label: 'Accepted'
    },
    'rejected': {
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-800',
      label: 'Rejected'
    },
    'expired': {
      icon: AlertCircle,
      color: 'text-gray-600',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      badge: 'bg-gray-100 text-gray-800',
      label: 'Expired'
    }
  };

  const urgencyConfig = {
    'Low': { badge: 'bg-gray-100 text-gray-700', label: 'Low' },
    'Medium': { badge: 'bg-blue-100 text-blue-700', label: 'Medium' },
    'High': { badge: 'bg-orange-100 text-orange-700', label: 'High' },
    'Urgent': { badge: 'bg-red-100 text-red-700', label: 'Urgent' }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    filterQuotes();
  }, [quotes, statusFilter, searchQuery]);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const response = await apiconnector(
        'GET',
        dashboardEndpoints.GET_QUOTES_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.success) {
        const quotesData = response.data.data || [];
        setQuotes(quotesData);
        calculateStats(quotesData);
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast.error('Failed to load quotes');
      // Mock data for demo
      const mockQuotes = generateMockQuotes();
      setQuotes(mockQuotes);
      calculateStats(mockQuotes);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (quotesData) => {
    const stats = {
      total: quotesData.length,
      pending: quotesData.filter(q => q.status === 'pending').length,
      quoted: quotesData.filter(q => q.status === 'quoted').length,
      accepted: quotesData.filter(q => q.status === 'accepted').length,
      rejected: quotesData.filter(q => q.status === 'rejected').length
    };
    setStats(stats);
  };

  const filterQuotes = () => {
    let filtered = [...quotes];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(quote => quote.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(quote =>
        quote.quoteId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.productName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredQuotes(filtered);
  };

  const generateMockQuotes = () => {
    const statuses = ['pending', 'in-review', 'quoted', 'negotiating', 'accepted', 'rejected'];
    const urgencies = ['Low', 'Medium', 'High', 'Urgent'];
    
    return Array.from({ length: 8 }, (_, i) => ({
      _id: `quote-${i + 1}`,
      quoteId: `QTE-2025-${String(i + 1).padStart(5, '0')}`,
      productName: `Industrial Product ${i + 1}`,
      category: 'Industrial Equipment',
      quantity: Math.floor(Math.random() * 500) + 100,
      unit: 'pieces',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      urgency: urgencies[Math.floor(Math.random() * urgencies.length)],
      targetPrice: 100 + i * 50,
      description: 'High-quality industrial component with specific requirements',
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      expectedDeliveryDate: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      deliveryLocation: {
        city: 'New York',
        country: 'USA'
      },
      customerInfo: {
        name: user?.name || 'John Doe',
        email: user?.email || 'john@example.com',
        phone: '+1234567890',
        company: user?.company || 'ABC Corp'
      },
      supplierResponse: i % 3 === 0 ? {
        quotedPrice: 120 + i * 60,
        moq: 50,
        leadTime: { value: 15, unit: 'days' },
        paymentTerms: '50% advance, 50% on delivery',
        validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
      } : null
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-teal-600" />
            Quote Requests
          </h1>
          <p className="text-gray-600 mt-1">
            Request and manage product quotes
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-300 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Quote Request
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          title="Total Quotes"
          value={stats.total}
          icon={FileText}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="bg-gradient-to-br from-yellow-500 to-yellow-600"
        />
        <StatCard
          title="Quoted"
          value={stats.quoted}
          icon={MessageSquare}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          title="Accepted"
          value={stats.accepted}
          icon={CheckCircle}
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={XCircle}
          color="bg-gradient-to-br from-red-500 to-red-600"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search quotes by ID or product..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="relative w-full lg:w-64">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-review">In Review</option>
              <option value="quoted">Quoted</option>
              <option value="negotiating">Negotiating</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Quotes List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : filteredQuotes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Quotes Found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Start by creating your first quote request'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              Create Quote Request
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredQuotes.map((quote, index) => (
            <QuoteCard
              key={quote._id}
              quote={quote}
              index={index}
              statusConfig={statusConfig}
              urgencyConfig={urgencyConfig}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              onViewDetails={() => {
                setSelectedQuote(quote);
                setShowDetails(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Quote Details Modal */}
      {showDetails && selectedQuote && (
        <QuoteDetailsModal
          quote={selectedQuote}
          statusConfig={statusConfig}
          urgencyConfig={urgencyConfig}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          onClose={() => {
            setShowDetails(false);
            setSelectedQuote(null);
          }}
        />
      )}

      {/* Create Quote Modal */}
      {showCreateModal && (
        <CreateQuoteModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchQuotes();
          }}
        />
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`${color} rounded-xl p-4 text-white shadow-lg hover:shadow-2xl transition-all duration-300 animate-fadeInUp cursor-pointer group hover:-translate-y-1 transform`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/90 text-sm font-medium group-hover:text-white transition-colors duration-200">{title}</p>
        <p className="text-3xl font-black mt-1 group-hover:scale-110 transition-transform duration-300 inline-block">{value}</p>
      </div>
      <Icon className="w-10 h-10 opacity-80 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" />
    </div>
  </div>
);

// Quote Card Component
const QuoteCard = ({ quote, index, statusConfig, urgencyConfig, formatDate, formatCurrency, onViewDetails }) => {
  const config = statusConfig[quote.status] || statusConfig['pending'];
  const StatusIcon = config.icon;
  const urgency = urgencyConfig[quote.urgency] || urgencyConfig['Medium'];

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 animate-slideInLeft overflow-hidden"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-gray-900">{quote.quoteId}</h3>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${urgency.badge}`}>
                {quote.urgency}
              </span>
            </div>
            <p className="text-gray-600 font-medium">{quote.productName}</p>
            <p className="text-sm text-gray-500">{quote.category}</p>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${config.badge} flex items-center gap-1.5`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {config.label}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1.5">
              <Package className="w-4 h-4" />
              Quantity
            </span>
            <span className="font-semibold text-gray-900">
              {quote.quantity} {quote.unit}
            </span>
          </div>

          {quote.targetPrice && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" />
                Target Price
              </span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(quote.targetPrice)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Requested
            </span>
            <span className="font-medium text-gray-900">
              {formatDate(quote.createdAt)}
            </span>
          </div>

          {quote.expectedDeliveryDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Expected Delivery
              </span>
              <span className="font-medium text-gray-900">
                {formatDate(quote.expectedDeliveryDate)}
              </span>
            </div>
          )}
        </div>

        {/* Supplier Response */}
        {quote.supplierResponse && quote.supplierResponse.quotedPrice && (
          <div className={`${config.bg} border ${config.border} rounded-lg p-3 mb-4`}>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className={`w-4 h-4 ${config.color}`} />
              <span className={`text-sm font-semibold ${config.color}`}>
                Supplier Quote
              </span>
            </div>
            <div className="space-y-1 text-sm">
              {quote.supplierResponse.quotedPrice && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Quoted Price:</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(quote.supplierResponse.quotedPrice)}
                  </span>
                </div>
              )}
              {quote.supplierResponse.moq && (
                <div className="flex justify-between">
                  <span className="text-gray-600">MOQ:</span>
                  <span className="font-medium text-gray-900">
                    {quote.supplierResponse.moq} pieces
                  </span>
                </div>
              )}
              {quote.supplierResponse.leadTime?.value && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Lead Time:</span>
                  <span className="font-medium text-gray-900">
                    {quote.supplierResponse.leadTime.value} {quote.supplierResponse.leadTime.unit || 'days'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onViewDetails}
          className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          View Full Details
        </button>
      </div>
    </div>
  );
};

// Quote Details Modal Component
const QuoteDetailsModal = ({ quote, statusConfig, urgencyConfig, formatDate, formatCurrency, onClose }) => {
  const config = statusConfig[quote.status] || statusConfig['pending'];
  const StatusIcon = config.icon;
  const urgency = urgencyConfig[quote.urgency] || urgencyConfig['Medium'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scaleIn transform transition-all duration-300">
        {/* Header */}
        <div className={`${config.bg} ${config.border} border-b p-6 transition-all duration-300`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${config.bg} ${config.border} border-2 flex items-center justify-center`}>
                <StatusIcon className={`w-6 h-6 ${config.color}`} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">{quote.quoteId}</h2>
                <p className="text-sm text-gray-600">Created on {formatDate(quote.createdAt)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 scrollbar-hide">
          <div className="space-y-6">
            {/* Status and Urgency */}
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${config.badge} flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300`}>
                <StatusIcon className="w-4 h-4" />
                {config.label}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${urgency.badge} shadow-md hover:shadow-lg transition-all duration-300`}>
                {quote.urgency} Priority
              </span>
            </div>

            {/* Product Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-teal-600" />
                Product Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Product Name</p>
                    <p className="font-semibold text-gray-900">{quote.productName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Category</p>
                    <p className="font-semibold text-gray-900">{quote.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Quantity</p>
                    <p className="font-semibold text-gray-900">{quote.quantity} {quote.unit}</p>
                  </div>
                  {quote.targetPrice && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Target Price</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(quote.targetPrice)}</p>
                    </div>
                  )}
                </div>
                {quote.description && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Description</p>
                    <p className="text-gray-900">{quote.description}</p>
                  </div>
                )}
                {quote.specifications && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Specifications</p>
                    <p className="text-gray-900">{quote.specifications}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-600" />
                Delivery Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Delivery Location</p>
                    <p className="font-semibold text-gray-900">
                      {quote.deliveryLocation?.city}, {quote.deliveryLocation?.country}
                    </p>
                  </div>
                  {quote.expectedDeliveryDate && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Expected Delivery</p>
                      <p className="font-semibold text-gray-900">{formatDate(quote.expectedDeliveryDate)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Information */}
            {quote.customerInfo && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-600" />
                  Contact Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 shadow-sm hover:shadow-md transition-all duration-300">
                  <p className="font-semibold text-gray-900">{quote.customerInfo.name}</p>
                  {quote.customerInfo.company && (
                    <p className="text-gray-600">{quote.customerInfo.company}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-600 pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      <span>{quote.customerInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4" />
                      <span>{quote.customerInfo.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Supplier Response */}
            {quote.supplierResponse && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-teal-600" />
                  Supplier Response
                </h3>
                <div className={`${config.bg} ${config.border} border rounded-lg p-4 space-y-3 shadow-md hover:shadow-lg transition-all duration-300`}>
                  <div className="grid grid-cols-2 gap-4">
                    {quote.supplierResponse.quotedPrice && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Quoted Price</p>
                        <p className="text-xl font-bold text-gray-900">
                          {formatCurrency(quote.supplierResponse.quotedPrice)}
                        </p>
                      </div>
                    )}
                    {quote.supplierResponse.moq && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Minimum Order Quantity</p>
                        <p className="text-xl font-bold text-gray-900">
                          {quote.supplierResponse.moq} pieces
                        </p>
                      </div>
                    )}
                    {quote.supplierResponse.leadTime?.value && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Lead Time</p>
                        <p className="font-semibold text-gray-900">
                          {quote.supplierResponse.leadTime.value} {quote.supplierResponse.leadTime.unit || 'days'}
                        </p>
                      </div>
                    )}
                    {quote.supplierResponse.validUntil && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Valid Until</p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(quote.supplierResponse.validUntil)}
                        </p>
                      </div>
                    )}
                  </div>
                  {quote.supplierResponse.paymentTerms && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Payment Terms</p>
                      <p className="text-gray-900">{quote.supplierResponse.paymentTerms}</p>
                    </div>
                  )}
                  {quote.supplierResponse.shippingTerms && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Shipping Terms</p>
                      <p className="text-gray-900">{quote.supplierResponse.shippingTerms}</p>
                    </div>
                  )}
                  {quote.supplierResponse.notes && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Additional Notes</p>
                      <p className="text-gray-900">{quote.supplierResponse.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 flex gap-3">
          {quote.status === 'quoted' && (
            <>
              <button className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 hover:-translate-y-0.5 transform">
                <CheckCircle className="w-5 h-5" />
                Accept Quote
              </button>
              <button className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transform">
                <XCircle className="w-5 h-5" />
                Reject
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="ml-auto px-6 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 transform"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Create Quote Modal Component
const CreateQuoteModal = ({ onClose, onSuccess }) => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    quantity: '',
    unit: 'pieces',
    description: '',
    specifications: '',
    targetPrice: '',
    urgency: 'Medium',
    expectedDeliveryDate: '',
    deliveryCity: '',
    deliveryCountry: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format data for backend
      const quoteData = {
        productName: formData.productName,
        category: formData.category,
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        description: formData.description,
        specifications: formData.specifications,
        targetPrice: formData.targetPrice ? parseFloat(formData.targetPrice) : undefined,
        urgency: formData.urgency,
        expectedDeliveryDate: formData.expectedDeliveryDate || undefined,
        deliveryLocation: {
          city: formData.deliveryCity || '',
          country: formData.deliveryCountry
        }
      };

      const response = await apiconnector(
        'POST',
        quoteEndpoints.CREATE_QUOTE_API,
        quoteData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.success) {
        toast.success('Quote request created successfully!');
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating quote:', error);
      toast.error(error.response?.data?.message || 'Failed to create quote request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-scaleIn transform transition-all duration-300">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Plus className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-black">New Quote Request</h2>
                <p className="text-teal-100 text-sm">Fill in the details to request a quote</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-hide">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 hover:border-teal-400 shadow-sm focus:shadow-md"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Industrial Equipment"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="pieces">Pieces</option>
                  <option value="kg">Kilograms</option>
                  <option value="tons">Tons</option>
                  <option value="units">Units</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Describe your requirements..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specifications
              </label>
              <textarea
                rows={2}
                value={formData.specifications}
                onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Technical specifications (optional)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Price (USD)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.targetPrice}
                  onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  value={formData.expectedDeliveryDate}
                  onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Country *
                </label>
                <input
                  type="text"
                  required
                  value={formData.deliveryCountry}
                  onChange={(e) => setFormData({ ...formData, deliveryCountry: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., USA"
                />
              </div>
            </div>
          </div>
        </form>

        <div className="border-t border-gray-200 p-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 transform"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-6 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-300 hover:-translate-y-0.5 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Quote Request
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardQuotes;
