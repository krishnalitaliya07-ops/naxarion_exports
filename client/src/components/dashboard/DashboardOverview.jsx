import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Truck, 
  FileText, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  DollarSign,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiconnector } from '../../services/apiconnector';
import { dashboardEndpoints } from '../../services/apis';

const DashboardOverview = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalQuotes: 0,
    activeShipments: 0,
    totalSpent: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  // Fetch dashboard data from backend
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    console.log('\n📊 ===== FETCHING DASHBOARD DATA =====');
    setLoading(true);
    
    try {
      const response = await apiconnector(
        'GET',
        dashboardEndpoints.GET_OVERVIEW_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log('✅ Dashboard data received:', response.data);

      if (response.data.success) {
        setStats(response.data.data.stats);
        setRecentOrders(response.data.data.recentOrders || []);
        console.log('✅ Dashboard state updated');
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard:', error);
      toast.error('Failed to load dashboard data');
      // Set mock data on error for demo
      setStats({
        totalOrders: 42,
        pendingOrders: 5,
        completedOrders: 35,
        totalQuotes: 12,
        activeShipments: 8,
        totalSpent: 45680
      });
    } finally {
      setLoading(false);
      console.log('===== DASHBOARD FETCH COMPLETED =====\n');
    }
  };

  const statsCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      change: '+12.5%',
      icon: ShoppingCart,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Active Shipments',
      value: stats.activeShipments,
      change: '+8.3%',
      icon: Truck,
      gradient: 'from-teal-500 to-cyan-600',
      bgGradient: 'from-teal-50 to-cyan-100',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      change: '-5.2%',
      icon: Clock,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Quote Requests',
      value: stats.totalQuotes,
      change: '+15.7%',
      icon: FileText,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  // Mock data fallback for recent orders display
  const displayOrders = recentOrders.length > 0 ? recentOrders : [
    { id: 'ORD-2025-001', orderNumber: 'ORD-2025-001', product: 'Industrial Machinery Parts', status: 'in_transit', amount: 12450, date: new Date('2026-01-20') },
    { id: 'ORD-2025-002', orderNumber: 'ORD-2025-002', product: 'Electronic Components', status: 'pending', amount: 8900, date: new Date('2026-01-18') },
    { id: 'ORD-2025-003', orderNumber: 'ORD-2025-003', product: 'Textile Materials', status: 'completed', amount: 5600, date: new Date('2026-01-15') },
  ];

  const quickActions = [
    { label: 'Request Quote', icon: FileText, to: '/dashboard/quotes', color: 'from-teal-500 to-cyan-600' },
    { label: 'Browse Products', icon: Package, to: '/dashboard/products', color: 'from-blue-500 to-blue-600' },
    { label: 'Track Shipment', icon: Truck, to: '/dashboard/shipments', color: 'from-purple-500 to-purple-600' },
    { label: 'View Orders', icon: ShoppingCart, to: '/dashboard/orders', color: 'from-orange-500 to-orange-600' },
  ];

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase().replace('_', ' ');
    switch (statusLower) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in transit':
      case 'shipping':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'processing':
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatStatus = (status) => {
    return status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-transparent border-t-teal-500 border-r-cyan-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-purple-500 border-l-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-[fadeInUp_0.6s_ease-out]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">Here's what's happening with your account today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/quotes"
            className="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-teal-500 hover:text-teal-600 transition-all hover:shadow-md"
          >
            Request Quote
          </Link>
          <Link
            to="/dashboard/products"
            className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/30 hover:shadow-xl hover:scale-105 active:scale-95"
          >
            Browse Products
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`bg-gradient-to-br ${stat.bgGradient} border-2 border-gray-200 rounded-2xl p-6 hover:shadow-2xl hover:border-gray-300 transition-all duration-300 hover:-translate-y-2 cursor-pointer shadow-lg`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-md border-2 border-white`}>
                  <Icon className={stat.iconColor} size={24} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg shadow-sm border ${
                  stat.change.startsWith('+') 
                    ? 'bg-green-100 text-green-700 border-green-300' 
                    : 'bg-red-100 text-red-700 border-red-300'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-semibold mb-1">{stat.title}</h3>
              <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-xl">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.to}
                className={`bg-gradient-to-br ${action.color} p-6 rounded-xl text-white hover:shadow-2xl transition-all hover:-translate-y-2 group border-2 border-white/20 shadow-lg`}
                style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
              >
                <Icon size={28} className="mb-3 group-hover:scale-110 transition-transform drop-shadow-lg" />
                <p className="font-bold text-sm">{action.label}</p>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border-2 border-gray-200 shadow-xl">
          <div className="p-6 border-b-2 border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link to="/dashboard/orders" className="text-teal-600 hover:text-teal-700 font-semibold text-sm flex items-center gap-1 group">
              View All
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
          <div className="p-6">
            {displayOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-semibold">No orders yet</p>
                <p className="text-sm text-gray-400 mt-1">Start browsing products to place your first order</p>
                <Link
                  to="/dashboard/products"
                  className="inline-block mt-4 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all shadow-lg"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {displayOrders.map((order, index) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-200 hover:border-teal-400 group shadow-md"
                    style={{ animationDelay: `${index * 0.1 + 0.6}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg border-2 border-teal-400">
                        <ShoppingCart className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{order.orderNumber || order.id}</p>
                        <p className="text-sm text-gray-600">{order.product || 'Product details'}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(order.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 mb-2">${order.amount?.toLocaleString() || '0'}</p>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border-2 shadow-sm ${getStatusColor(order.status)}`}>
                        {formatStatus(order.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border-2 border-green-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center border-2 border-green-300 shadow-sm">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-xl font-black text-gray-900">{stats.completedOrders}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50 border-2 border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center border-2 border-orange-300 shadow-sm">
                    <Clock className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-xl font-black text-gray-900">{stats.pendingOrders}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center border-2 border-blue-300 shadow-sm">
                    <Truck className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">In Transit</p>
                    <p className="text-xl font-black text-gray-900">{stats.activeShipments}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Spent */}
          <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 text-white shadow-2xl border-2 border-teal-400 hover:shadow-3xl hover:-translate-y-1 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-white/30 shadow-lg">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-sm text-white/80 font-semibold">Total Spent</p>
                <p className="text-3xl font-black">${stats.totalSpent.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-white/80">Lifetime purchases</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
