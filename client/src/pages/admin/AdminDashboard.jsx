import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { apiConnector } from '../../services/apiconnector';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    overview: {},
    orderStats: {},
    recentActivity: {}
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiConnector(
        'GET',
        `${import.meta.env.VITE_BASE_URL}/admin/dashboard/overview`,
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `$${(dashboardData.overview.totalRevenue || 0).toLocaleString()}`,
      icon: 'fa-dollar-sign',
      gradient: 'from-emerald-500 to-teal-600',
      change: '+12.5%',
      changeType: 'increase'
    },
    {
      title: 'Total Orders',
      value: dashboardData.overview.totalOrders || 0,
      icon: 'fa-shopping-cart',
      gradient: 'from-blue-500 to-indigo-600',
      change: '+8.2%',
      changeType: 'increase'
    },
    {
      title: 'Total Users',
      value: dashboardData.overview.totalUsers || 0,
      icon: 'fa-users',
      gradient: 'from-purple-500 to-pink-600',
      change: '+5.7%',
      changeType: 'increase'
    },
    {
      title: 'Total Products',
      value: dashboardData.overview.totalProducts || 0,
      icon: 'fa-box',
      gradient: 'from-orange-500 to-red-600',
      change: '+3.1%',
      changeType: 'increase'
    }
  ];

  const quickStats = [
    {
      label: 'Active Users',
      value: dashboardData.overview.activeUsers || 0,
      icon: 'fa-user-check',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Pending Orders',
      value: dashboardData.orderStats.pending || 0,
      icon: 'fa-clock',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    },
    {
      label: 'Completed Orders',
      value: dashboardData.orderStats.completed || 0,
      icon: 'fa-check-circle',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      label: 'Total Shipments',
      value: dashboardData.overview.totalShipments || 0,
      icon: 'fa-shipping-fast',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100'
    }
  ];

  const recentActivityItems = [
    {
      label: 'New Users (7 days)',
      value: dashboardData.recentActivity.newUsers || 0,
      icon: 'fa-user-plus',
      color: 'purple'
    },
    {
      label: 'New Orders (7 days)',
      value: dashboardData.recentActivity.newOrders || 0,
      icon: 'fa-shopping-bag',
      color: 'blue'
    },
    {
      label: 'New Quotes (7 days)',
      value: dashboardData.recentActivity.newQuotes || 0,
      icon: 'fa-file-alt',
      color: 'indigo'
    },
    {
      label: 'New Products (7 days)',
      value: dashboardData.recentActivity.newProducts || 0,
      icon: 'fa-box-open',
      color: 'orange'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <i className="fas fa-circle-notch fa-spin text-4xl text-emerald-500"></i>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-chart-line text-white text-xl"></i>
              </div>
              Dashboard Overview
            </h1>
            <p className="text-sm text-slate-600">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchDashboardData}
              className="bg-white border-2 border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center gap-2"
            >
              <i className="fas fa-sync-alt"></i>
              Refresh
            </button>
            <button className="bg-white border-2 border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center gap-2">
              <i className="fas fa-download"></i>
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${card.gradient} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <i className={`fas ${card.icon} text-white text-xl`}></i>
                </div>
                <span className="text-xs font-bold bg-white bg-opacity-20 px-2 py-1 rounded-lg text-white">
                  <i className="fas fa-arrow-up text-xs"></i> {card.change}
                </span>
              </div>
              <p className="text-sm text-white text-opacity-90 mb-1">{card.title}</p>
              <p className="text-3xl font-black text-white mb-2">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-slate-200 hover:border-emerald-500">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <i className={`fas ${stat.icon} ${stat.color} text-lg`}></i>
              </div>
              <span className="text-xl font-black text-slate-900">{stat.value}</span>
            </div>
            <p className="text-sm font-bold text-slate-900 mb-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Activity Card */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">Recent Activity (Last 7 Days)</h3>
              <p className="text-xs text-slate-600">Latest platform updates</p>
            </div>
          </div>
          <div className="space-y-3">
            {recentActivityItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-${item.color}-100 rounded-lg flex items-center justify-center`}>
                    <i className={`fas ${item.icon} text-${item.color}-600`}></i>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                </div>
                <span className="text-lg font-black text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-black text-slate-900">System Information</h3>
            <p className="text-xs text-slate-600">Platform status and metrics</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm font-semibold text-slate-700">Total Quotes</span>
              <span className="text-lg font-black text-slate-900">{dashboardData.overview.totalQuotes || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-sm font-semibold text-slate-700">Contact Messages</span>
              <span className="text-lg font-black text-slate-900">{dashboardData.overview.totalContacts || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
              <span className="text-sm font-semibold text-emerald-700">System Status</span>
              <span className="text-sm font-black text-emerald-600 flex items-center gap-2">
                <i className="fas fa-check-circle"></i>
                All Systems Operational
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
              <span className="text-sm font-semibold text-blue-700">Server Status</span>
              <span className="text-sm font-black text-blue-600 flex items-center gap-2">
                <i className="fas fa-server"></i>
                Online
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
