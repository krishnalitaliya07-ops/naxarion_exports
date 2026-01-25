import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Eye,
  Download,
  Loader2,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  FileText,
  X,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { apiconnector } from '../../services/apiconnector';
import { orderEndpoints, dashboardEndpoints } from '../../services/apis';

const DashboardOrders = () => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    delivered: 0,
    cancelled: 0
  });

  const statusConfig = {
    'Pending': { 
      icon: Clock, 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-50', 
      border: 'border-yellow-200',
      badge: 'bg-yellow-100 text-yellow-800'
    },
    'Processing': { 
      icon: Package, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800'
    },
    'Confirmed': { 
      icon: CheckCircle, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50', 
      border: 'border-purple-200',
      badge: 'bg-purple-100 text-purple-800'
    },
    'Shipped': { 
      icon: Truck, 
      color: 'text-cyan-600', 
      bg: 'bg-cyan-50', 
      border: 'border-cyan-200',
      badge: 'bg-cyan-100 text-cyan-800'
    },
    'Delivered': { 
      icon: CheckCircle, 
      color: 'text-green-600', 
      bg: 'bg-green-50', 
      border: 'border-green-200',
      badge: 'bg-green-100 text-green-800'
    },
    'Cancelled': { 
      icon: XCircle, 
      color: 'text-red-600', 
      bg: 'bg-red-50', 
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-800'
    },
    'Refunded': { 
      icon: AlertCircle, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50', 
      border: 'border-orange-200',
      badge: 'bg-orange-100 text-orange-800'
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, searchQuery]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await apiconnector(
        'GET',
        dashboardEndpoints.GET_ORDERS_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.success) {
        const ordersData = response.data.data || [];
        setOrders(ordersData);
        calculateStats(ordersData);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      // Mock data for demo
      const mockOrders = generateMockOrders();
      setOrders(mockOrders);
      calculateStats(mockOrders);
    } finally {
      setLoading(false);
  
    }
  };

  const calculateStats = (ordersData) => {
    const stats = {
      total: ordersData.length,
      pending: ordersData.filter(o => o.orderStatus === 'Pending').length,
      processing: ordersData.filter(o => ['Processing', 'Confirmed'].includes(o.orderStatus)).length,
      delivered: ordersData.filter(o => o.orderStatus === 'Delivered').length,
      cancelled: ordersData.filter(o => o.orderStatus === 'Cancelled').length
    };
    setStats(stats);
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderItems?.some(item => 
          item.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredOrders(filtered);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const response = await apiconnector(
        'PUT',
        orderEndpoints.CANCEL_ORDER_API(orderId),
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.success) {
        toast.success('Order cancelled successfully');
        fetchOrders();
        setShowDetails(false);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const generateMockOrders = () => {
    const statuses = ['Pending', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
    return Array.from({ length: 8 }, (_, i) => ({
      _id: `order-${i + 1}`,
      orderId: `ORD-2025-${String(i + 1).padStart(5, '0')}`,
      orderStatus: statuses[Math.floor(Math.random() * statuses.length)],
      paymentStatus: i % 3 === 0 ? 'Paid' : 'Pending',
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      orderItems: [
        {
          name: `Industrial Product ${i + 1}`,
          quantity: Math.floor(Math.random() * 50) + 10,
          price: 100 + i * 50,
          image: `https://via.placeholder.com/80?text=Product+${i + 1}`
        }
      ],
      pricing: {
        itemsPrice: 1000 + i * 500,
        shippingPrice: 50,
        taxPrice: 100,
        totalPrice: 1150 + i * 500
      },
      shippingAddress: {
        fullName: 'John Doe',
        company: 'ABC Corp',
        phone: '+1234567890',
        email: 'john@example.com',
        street: '123 Main St',
        city: 'New York',
        zipCode: '10001',
        country: 'USA'
      }
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
            <Package className="w-8 h-8 text-teal-600" />
            My Orders
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage your orders
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          title="Total Orders"
          value={stats.total}
          icon={Package}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="bg-gradient-to-br from-yellow-500 to-yellow-600"
        />
        <StatCard
          title="Processing"
          value={stats.processing}
          icon={Package}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          title="Delivered"
          value={stats.delivered}
          icon={CheckCircle}
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Cancelled"
          value={stats.cancelled}
          icon={XCircle}
          color="bg-gradient-to-br from-red-500 to-red-600"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders by ID or product..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative w-full lg:w-64">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white cursor-pointer"
            >
              <option value="all">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
          <p className="text-gray-600">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'You haven\'t placed any orders yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <OrderCard
              key={order._id}
              order={order}
              index={index}
              statusConfig={statusConfig}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              onViewDetails={() => {
                setSelectedOrder(order);
                setShowDetails(true);
              }}
              onCancel={handleCancelOrder}
            />
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          statusConfig={statusConfig}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          onClose={() => {
            setShowDetails(false);
            setSelectedOrder(null);
          }}
          onCancel={handleCancelOrder}
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

// Order Card Component
const OrderCard = ({ order, index, statusConfig, formatDate, formatCurrency, onViewDetails, onCancel }) => {
  const config = statusConfig[order.orderStatus] || statusConfig['Pending'];
  const StatusIcon = config.icon;

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 animate-slideInLeft overflow-hidden"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Order Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-4">
              {/* Product Image */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={order.orderItems?.[0]?.image || 'https://via.placeholder.com/80'}
                  alt={order.orderItems?.[0]?.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {order.orderId}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {order.orderItems?.[0]?.name}
                      {order.orderItems?.length > 1 && (
                        <span className="text-gray-500"> +{order.orderItems.length - 1} more</span>
                      )}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.badge} flex items-center gap-1.5 whitespace-nowrap`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {order.orderStatus}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Package className="w-4 h-4" />
                    <span>{order.orderItems?.length} item(s)</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                    <DollarSign className="w-4 h-4" />
                    <span>{formatCurrency(order.pricing?.totalPrice || 0)}</span>
                  </div>
                  {order.paymentStatus && (
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      order.paymentStatus === 'Paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
            <button
              onClick={onViewDetails}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-300 hover:-translate-y-0.5 transform"
            >
              <Eye className="w-4 h-4" />
              <span>View Details</span>
            </button>
            
            {['Pending', 'Processing', 'Confirmed'].includes(order.orderStatus) && (
              <button
                onClick={() => onCancel(order._id)}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transform"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            )}

            <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transform">
              <Download className="w-4 h-4" />
              <span>Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-gray-100">
        <div
          className={`h-full ${config.bg.replace('bg-', 'bg-gradient-to-r from-')} transition-all duration-500`}
          style={{
            width: order.orderStatus === 'Delivered' ? '100%' :
                   order.orderStatus === 'Shipped' ? '75%' :
                   order.orderStatus === 'Confirmed' ? '50%' :
                   order.orderStatus === 'Processing' ? '25%' : '10%'
          }}
        />
      </div>
    </div>
  );
};

// Order Details Modal Component
const OrderDetailsModal = ({ order, statusConfig, formatDate, formatCurrency, onClose, onCancel }) => {
  const config = statusConfig[order.orderStatus] || statusConfig['Pending'];
  const StatusIcon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className={`${config.bg} ${config.border} border-b p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${config.bg} ${config.border} border-2 flex items-center justify-center`}>
                <StatusIcon className={`w-6 h-6 ${config.color}`} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">{order.orderId}</h2>
                <p className="text-sm text-gray-600">Placed on {formatDate(order.createdAt)}</p>
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
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${config.badge} flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300`}>
                <StatusIcon className="w-4 h-4" />
                {order.orderStatus}
              </span>
              {order.paymentStatus && (
                <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 ${
                  order.paymentStatus === 'Paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  Payment: {order.paymentStatus}
                </span>
              )}
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-teal-600" />
                Order Items
              </h3>
              <div className="space-y-3">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                    <img
                      src={item.image || 'https://via.placeholder.com/60'}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                      <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-teal-600" />
                Pricing Details
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex justify-between text-gray-600">
                  <span>Items Total</span>
                  <span>{formatCurrency(order.pricing?.itemsPrice || 0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{formatCurrency(order.pricing?.shippingPrice || 0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{formatCurrency(order.pricing?.taxPrice || 0)}</span>
                </div>
                {order.pricing?.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.pricing.discount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatCurrency(order.pricing?.totalPrice || 0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-teal-600" />
                  Shipping Address
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 shadow-sm hover:shadow-md transition-all duration-300">
                  <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
                  {order.shippingAddress.company && (
                    <p className="text-gray-600">{order.shippingAddress.company}</p>
                  )}
                  <p className="text-gray-600">
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                    {order.shippingAddress.country}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4" />
                      <span>{order.shippingAddress.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      <span>{order.shippingAddress.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Notes */}
            {order.orderNotes && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-600" />
                  Order Notes
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300">
                  <p className="text-gray-600">{order.orderNotes}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 flex gap-3">
          {['Pending', 'Processing', 'Confirmed'].includes(order.orderStatus) && (
            <button
              onClick={() => {
                onCancel(order._id);
                onClose();
              }}
              className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transform"
            >
              <XCircle className="w-5 h-5" />
              Cancel Order
            </button>
          )}
          <button className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transform">
            <Download className="w-5 h-5" />
            Download Invoice
          </button>
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

export default DashboardOrders;
