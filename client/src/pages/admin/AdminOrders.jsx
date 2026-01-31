import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { adminEndpoints } from '../../services/apis';
import axios from 'axios';

const { 
  GET_ALL_ORDERS_API, 
  GET_ORDER_STATS_API,
  GET_ORDER_BY_ID_API,
  UPDATE_ORDER_STATUS_API,
  DELETE_ORDER_API,
  CREATE_ORDER_API
} = adminEndpoints;

const AdminOrders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewOrderModalOpen, setViewOrderModalOpen] = useState(false);
  const [newOrderModalOpen, setNewOrderModalOpen] = useState(false);
  const [newOrderData, setNewOrderData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    itemsPrice: '',
    taxPrice: '',
    shippingPrice: '',
    paymentStatus: 'Pending'
  });

  // Fetch orders and stats
  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [activeTab, searchQuery, statusFilter, timeFilter, paymentFilter, currentPage]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(GET_ORDER_STATS_API, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch order stats:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (activeTab !== 'all') {
        params.append('status', activeTab);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (paymentFilter !== 'all') {
        params.append('paymentStatus', paymentFilter);
      }
      params.append('page', currentPage);
      params.append('limit', 20);

      const response = await axios.get(`${GET_ALL_ORDERS_API}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setOrders(response.data.data);
      setTotalPages(response.data.pages || 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const response = await axios.get(GET_ORDER_BY_ID_API(orderId), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSelectedOrder(response.data.data);
      setViewOrderModalOpen(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch order details');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        UPDATE_ORDER_STATUS_API(orderId),
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      toast.success('Order status updated successfully');
      fetchOrders();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['Order ID', 'Customer', 'Date', 'Status', 'Payment', 'Total'];
    const rows = orders.map(order => [
      order.orderId,
      order.shippingAddress?.fullName || 'N/A',
      new Date(order.createdAt).toLocaleDateString(),
      order.orderStatus,
      order.paymentStatus,
      `$${order.pricing?.totalPrice?.toFixed(2) || '0.00'}`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  const handleReset = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTimeFilter('all');
    setPaymentFilter('all');
    setCurrentPage(1);
    setActiveTab('all');
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const orderPayload = {
        buyer: null, // Admin creates order without buyer ID
        supplier: null, // Can be null for now
        orderItems: [], // Empty for now, will be added later
        shippingAddress: {
          fullName: newOrderData.customerName,
          email: newOrderData.customerEmail,
          phone: newOrderData.customerPhone,
          street: newOrderData.address,
          city: newOrderData.city,
          country: newOrderData.country,
          zipCode: newOrderData.zipCode
        },
        pricing: {
          itemsPrice: parseFloat(newOrderData.itemsPrice) || 0,
          taxPrice: parseFloat(newOrderData.taxPrice) || 0,
          shippingPrice: parseFloat(newOrderData.shippingPrice) || 0,
          totalPrice: (parseFloat(newOrderData.itemsPrice) || 0) + (parseFloat(newOrderData.taxPrice) || 0) + (parseFloat(newOrderData.shippingPrice) || 0)
        },
        paymentStatus: newOrderData.paymentStatus
      };

      await axios.post(
        CREATE_ORDER_API,
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      toast.success('Order created successfully!');
      setNewOrderModalOpen(false);
      setNewOrderData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        address: '',
        city: '',
        country: '',
        zipCode: '',
        itemsPrice: '',
        taxPrice: '',
        shippingPrice: '',
        paymentStatus: 'Pending'
      });
      fetchOrders();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create order');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-amber-100 text-amber-700',
      'Processing': 'bg-blue-100 text-blue-700',
      'Confirmed': 'bg-cyan-100 text-cyan-700',
      'Shipped': 'bg-indigo-100 text-indigo-700',
      'Delivered': 'bg-emerald-100 text-emerald-700',
      'Cancelled': 'bg-red-100 text-red-700',
      'Refunded': 'bg-orange-100 text-orange-700'
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-amber-100 text-amber-700',
      'Paid': 'bg-emerald-100 text-emerald-700',
      'Failed': 'bg-red-100 text-red-700',
      'Refunded': 'bg-orange-100 text-orange-700'
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-purple-600 mb-4"></i>
          <p className="text-slate-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <i className="fas fa-shopping-cart text-2xl"></i>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Orders Management</h1>
              <p className="text-slate-600 text-sm">Track and manage all orders across the platform</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportCSV}
              className="px-5 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-bold text-sm transition-all shadow-sm flex items-center gap-2"
            >
              <i className="fas fa-download"></i>
              Export CSV
            </button>
            <button
              onClick={() => setNewOrderModalOpen(true)}
              className="px-5 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl hover:shadow-lg font-bold text-sm transition-all flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              New Order
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-6 mb-6">
        {/* Total Orders */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-shopping-cart text-pink-600 text-xl"></i>
            </div>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-1">
              <i className="fas fa-arrow-up"></i>
              {stats.growthPercentage || 0}%
            </span>
          </div>
          <p className="text-slate-600 text-sm font-bold mb-1">Total Orders</p>
          <p className="text-3xl font-black text-slate-900">{stats.totalOrders?.toLocaleString() || 0}</p>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-clock text-amber-600 text-xl"></i>
            </div>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold">
              Action
            </span>
          </div>
          <p className="text-slate-600 text-sm font-bold mb-1">Pending</p>
          <p className="text-3xl font-black text-slate-900">{stats.pending?.toLocaleString() || 0}</p>
        </div>

        {/* Processing */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-sync text-blue-600 text-xl"></i>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
              Active
            </span>
          </div>
          <p className="text-slate-600 text-sm font-bold mb-1">Processing</p>
          <p className="text-3xl font-black text-slate-900">{stats.processing?.toLocaleString() || 0}</p>
        </div>

        {/* Shipped */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-truck text-indigo-600 text-xl"></i>
            </div>
            <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-lg text-xs font-bold">
              Transit
            </span>
          </div>
          <p className="text-slate-600 text-sm font-bold mb-1">Shipped</p>
          <p className="text-3xl font-black text-slate-900">{stats.shipped?.toLocaleString() || 0}</p>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-check-circle text-emerald-600 text-xl"></i>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">
              Done
            </span>
          </div>
          <p className="text-slate-600 text-sm font-bold mb-1">Completed</p>
          <p className="text-3xl font-black text-slate-900">{stats.completed?.toLocaleString() || 0}</p>
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-dollar-sign text-emerald-600 text-xl"></i>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">
              This Month
            </span>
          </div>
          <p className="text-slate-600 text-sm font-bold mb-1">Total Revenue</p>
          <p className="text-3xl font-black text-slate-900">${(stats.monthlyRevenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

        {/* Avg Order Value */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-chart-line text-purple-600"></i>
            </div>
          </div>
          <p className="text-slate-600 text-sm font-bold mb-1">Avg Order Value</p>
          <p className="text-3xl font-black text-slate-900">${stats.avgOrderValue?.toFixed(2) || '0.00'}</p>
        </div>

        {/* Cancelled */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-times-circle text-red-600"></i>
            </div>
          </div>
          <p className="text-slate-600 text-sm font-bold mb-1">Cancelled</p>
          <p className="text-3xl font-black text-slate-900">{stats.cancelled || 0}</p>
        </div>

        {/* Returns */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-undo text-orange-600"></i>
            </div>
          </div>
          <p className="text-slate-600 text-sm font-bold mb-1">Returns</p>
          <p className="text-3xl font-black text-slate-900">{stats.returns || 0}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
            <input
              type="text"
              placeholder="Search by Order ID, customer, product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none font-bold text-slate-700"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none font-bold text-slate-700"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:outline-none font-bold text-slate-700"
          >
            <option value="all">Payment Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Failed">Failed</option>
          </select>
          <button
            onClick={handleReset}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all flex items-center gap-2"
          >
            <i className="fas fa-redo"></i>
            Reset
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 mb-6 overflow-hidden">
        <div className="flex border-b-2 border-slate-200">
          {[
            { key: 'all', label: 'All Orders', count: stats.totalOrders, icon: 'fa-list' },
            { key: 'pending', label: 'Pending', count: stats.pending, icon: 'fa-clock' },
            { key: 'processing', label: 'Processing', count: stats.processing, icon: 'fa-sync' },
            { key: 'shipped', label: 'Shipped', count: stats.shipped, icon: 'fa-truck' },
            { key: 'delivered', label: 'Completed', count: stats.completed, icon: 'fa-check-circle' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setCurrentPage(1);
              }}
              className={`flex-1 px-6 py-4 font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white border-b-4 border-pink-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <i className={`fas ${tab.icon}`}></i>
              {tab.label} ({tab.count || 0})
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          {orders.length > 0 ? (
            <table className="w-full">
              <thead className="bg-slate-50 border-b-2 border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">Items</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">Payment</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-purple-600">{order.orderId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900">{order.shippingAddress?.fullName || 'N/A'}</p>
                        <p className="text-xs text-slate-600">{order.shippingAddress?.email || ''}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-slate-600">{new Date(order.createdAt).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-700">{order.orderItems?.length || 0} items</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black text-slate-900 text-lg">${order.pricing?.totalPrice?.toFixed(2) || '0.00'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewOrder(order._id)}
                          className="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all flex items-center justify-center"
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <div className="relative group">
                          <button className="w-8 h-8 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-lg transition-all flex items-center justify-center">
                            <i className="fas fa-ellipsis-v"></i>
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border-2 border-slate-200 py-2 hidden group-hover:block z-10">
                            {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                              <button
                                key={status}
                                onClick={() => handleUpdateStatus(order._id, status)}
                                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 font-bold"
                              >
                                Mark as {status}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <i className="fas fa-shopping-cart text-6xl text-slate-300 mb-4"></i>
              <p className="text-xl font-bold text-slate-600">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {orders.length > 0 && (
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6">
          <div className="text-sm text-slate-600">
            Showing <span className="font-bold">{orders.length}</span> orders
          </div>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm transition-all"
            >
              <i className="fas fa-chevron-left mr-2"></i>Previous
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                    currentPage === idx + 1
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm transition-all"
            >
              Next<i className="fas fa-chevron-right ml-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {viewOrderModalOpen && selectedOrder && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setViewOrderModalOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Order Details</h3>
                  <p className="text-sm text-white/80">Order ID: {selectedOrder.orderId}</p>
                </div>
                <button onClick={() => setViewOrderModalOpen(false)} className="text-white/80 hover:text-white">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm font-bold text-slate-600 mb-1">Order Status</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(selectedOrder.orderStatus)}`}>
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm font-bold text-slate-600 mb-1">Payment Status</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-sm font-bold text-slate-600 mb-1">Order Date</p>
                  <p className="text-slate-900 font-bold">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-blue-50 p-6 rounded-2xl">
                <h4 className="text-lg font-black text-slate-900 mb-4">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-600">Name</p>
                    <p className="text-slate-900">{selectedOrder.shippingAddress?.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-600">Email</p>
                    <p className="text-slate-900">{selectedOrder.shippingAddress?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-600">Phone</p>
                    <p className="text-slate-900">{selectedOrder.shippingAddress?.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-600">Address</p>
                    <p className="text-slate-900">
                      {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.country}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-purple-50 p-6 rounded-2xl">
                <h4 className="text-lg font-black text-slate-900 mb-4">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-xl">
                      <div className="w-16 h-16 bg-slate-200 rounded-lg"></div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-black text-slate-900">${item.price?.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-emerald-50 p-6 rounded-2xl">
                <h4 className="text-lg font-black text-slate-900 mb-4">Pricing Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Items Price:</span>
                    <span className="font-bold text-slate-900">${selectedOrder.pricing?.itemsPrice?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tax:</span>
                    <span className="font-bold text-slate-900">${selectedOrder.pricing?.taxPrice?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Shipping:</span>
                    <span className="font-bold text-slate-900">${selectedOrder.pricing?.shippingPrice?.toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-slate-300 pt-2 mt-2 flex justify-between">
                    <span className="font-black text-slate-900">Total:</span>
                    <span className="font-black text-2xl text-emerald-600">${selectedOrder.pricing?.totalPrice?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setViewOrderModalOpen(false)}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Order Modal */}
      {newOrderModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setNewOrderModalOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Create New Order</h3>
                  <p className="text-sm text-white/80">Add order details for manual order creation</p>
                </div>
                <button onClick={() => setNewOrderModalOpen(false)} className="text-white/80 hover:text-white">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCreateOrder} className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="bg-blue-50 p-6 rounded-2xl">
                <h4 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-user text-blue-600"></i>
                  Customer Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newOrderData.customerName}
                      onChange={(e) => setNewOrderData({ ...newOrderData, customerName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:outline-none"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={newOrderData.customerEmail}
                      onChange={(e) => setNewOrderData({ ...newOrderData, customerEmail: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:outline-none"
                      placeholder="customer@example.com"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={newOrderData.customerPhone}
                      onChange={(e) => setNewOrderData({ ...newOrderData, customerPhone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:outline-none"
                      placeholder="+1 234 567 8900"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-purple-50 p-6 rounded-2xl">
                <h4 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-purple-600"></i>
                  Shipping Address
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newOrderData.address}
                      onChange={(e) => setNewOrderData({ ...newOrderData, address: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:outline-none"
                      placeholder="123 Main Street"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newOrderData.city}
                      onChange={(e) => setNewOrderData({ ...newOrderData, city: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:outline-none"
                      placeholder="New York"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newOrderData.country}
                      onChange={(e) => setNewOrderData({ ...newOrderData, country: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:outline-none"
                      placeholder="United States"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Zip Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newOrderData.zipCode}
                      onChange={(e) => setNewOrderData({ ...newOrderData, zipCode: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:outline-none"
                      placeholder="10001"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Details */}
              <div className="bg-emerald-50 p-6 rounded-2xl">
                <h4 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-dollar-sign text-emerald-600"></i>
                  Pricing Details
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Items Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newOrderData.itemsPrice}
                      onChange={(e) => setNewOrderData({ ...newOrderData, itemsPrice: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:outline-none"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tax Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newOrderData.taxPrice}
                      onChange={(e) => setNewOrderData({ ...newOrderData, taxPrice: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Shipping Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newOrderData.shippingPrice}
                      onChange={(e) => setNewOrderData({ ...newOrderData, shippingPrice: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white rounded-xl border-2 border-emerald-300">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-slate-900">Total Price:</span>
                    <span className="text-2xl font-black text-emerald-600">
                      ${((parseFloat(newOrderData.itemsPrice) || 0) + (parseFloat(newOrderData.taxPrice) || 0) + (parseFloat(newOrderData.shippingPrice) || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="bg-amber-50 p-6 rounded-2xl">
                <h4 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <i className="fas fa-credit-card text-amber-600"></i>
                  Payment Status
                </h4>
                <select
                  value={newOrderData.paymentStatus}
                  onChange={(e) => setNewOrderData({ ...newOrderData, paymentStatus: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:outline-none font-bold text-slate-700"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <i className="fas fa-check"></i>
                  Create Order
                </button>
                <button
                  type="button"
                  onClick={() => setNewOrderModalOpen(false)}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
