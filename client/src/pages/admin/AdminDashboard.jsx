import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { apiConnector } from '../../services/apiconnector';
import { adminEndpoints } from '../../services/apis';

const { GET_ADMIN_DASHBOARD_API } = adminEndpoints;

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
        GET_ADMIN_DASHBOARD_API,
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
            <p className="text-sm text-slate-600">Welcome back, Admin! Here's what's happening today.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchDashboardData}
              className="bg-white border-2 border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center gap-2"
            >
              <i className="fas fa-download"></i>
              Export Report
            </button>
            <button 
              onClick={fetchDashboardData}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-xl transition-all flex items-center gap-2"
            >
              <i className="fas fa-sync-alt"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Revenue Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <i className="fas fa-dollar-sign text-white text-xl"></i>
              </div>
              <span className="text-xs font-bold text-emerald-100 bg-white bg-opacity-20 px-2 py-1 rounded-lg">
                <i className="fas fa-arrow-up text-xs"></i> 12.5%
              </span>
            </div>
            <p className="text-sm text-emerald-100 mb-1">Total Revenue</p>
            <p className="text-3xl font-black text-white mb-2">
              ${(dashboardData.overview.totalRevenue || 0).toLocaleString()}
            </p>
            <p className="text-xs text-emerald-100">vs last month: +${((dashboardData.overview.totalRevenue || 0) * 0.1).toLocaleString()}</p>
          </div>
        </div>

        {/* Active Users Card */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <i className="fas fa-users text-white text-xl"></i>
              </div>
              <span className="text-xs font-bold text-blue-100 bg-white bg-opacity-20 px-2 py-1 rounded-lg">
                <i className="fas fa-arrow-up text-xs"></i> 8.3%
              </span>
            </div>
            <p className="text-sm text-blue-100 mb-1">Active Users</p>
            <p className="text-3xl font-black text-white mb-2">
              {(dashboardData.overview.totalUsers || 0).toLocaleString()}
            </p>
            <p className="text-xs text-blue-100">Total registered users</p>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <i className="fas fa-shopping-cart text-white text-xl"></i>
              </div>
              <span className="text-xs font-bold text-purple-100 bg-white bg-opacity-20 px-2 py-1 rounded-lg">
                <i className="fas fa-arrow-up text-xs"></i> 15.7%
              </span>
            </div>
            <p className="text-sm text-purple-100 mb-1">Total Orders</p>
            <p className="text-3xl font-black text-white mb-2">
              {(dashboardData.overview.totalOrders || 0).toLocaleString()}
            </p>
            <p className="text-xs text-purple-100">Pending: {dashboardData.orderStats?.pending || 0} | Completed: {dashboardData.orderStats?.completed || 0}</p>
          </div>
        </div>

        {/* Products Listed Card */}
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <i className="fas fa-box text-white text-xl"></i>
              </div>
              <span className="text-xs font-bold text-orange-100 bg-white bg-opacity-20 px-2 py-1 rounded-lg">
                <i className="fas fa-arrow-up text-xs"></i> 6.2%
              </span>
            </div>
            <p className="text-sm text-orange-100 mb-1">Products Listed</p>
            <p className="text-3xl font-black text-white mb-2">
              {(dashboardData.overview.totalProducts || 0).toLocaleString()}
            </p>
            <p className="text-xs text-orange-100">Active products in catalog</p>
          </div>
        </div>

      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Pending Verifications */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-slate-200 hover:border-amber-500">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-clock text-amber-600 text-lg"></i>
            </div>
            <span className="text-xl font-black text-amber-600">{dashboardData.overview.pendingVerifications || 0}</span>
          </div>
          <p className="text-sm font-bold text-slate-900 mb-1">Pending Verifications</p>
          <p className="text-xs text-slate-600">Suppliers awaiting approval</p>
        </div>

        {/* Active Shipments */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-slate-200 hover:border-cyan-500">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-shipping-fast text-cyan-600 text-lg"></i>
            </div>
            <span className="text-xl font-black text-cyan-600">
              {dashboardData.overview.totalShipments || 0}
            </span>
          </div>
          <p className="text-sm font-bold text-slate-900 mb-1">Active Shipments</p>
          <p className="text-xs text-slate-600">Currently in transit</p>
        </div>

        {/* Commission Earned */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-slate-200 hover:border-green-500">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-percentage text-green-600 text-lg"></i>
            </div>
            <span className="text-xl font-black text-green-600">${(dashboardData.overview.commissionEarned || 0).toLocaleString()}</span>
          </div>
          <p className="text-sm font-bold text-slate-900 mb-1">Commission Earned</p>
          <p className="text-xs text-slate-600">This month</p>
        </div>

        {/* Quote Requests */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-slate-200 hover:border-violet-500">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-file-invoice text-violet-600 text-lg"></i>
            </div>
            <span className="text-xl font-black text-violet-600">
              {dashboardData.overview.totalQuotes || 0}
            </span>
          </div>
          <p className="text-sm font-bold text-slate-900 mb-1">Quote Requests</p>
          <p className="text-xs text-slate-600">New RFQs this week</p>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">Revenue Trend</h3>
              <p className="text-xs text-slate-600">Last 6 months performance</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">Monthly</button>
              <button className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-200">Weekly</button>
            </div>
          </div>
          
          {/* Simple CSS Chart */}
          <div className="flex items-end justify-between h-48 gap-3">
            <div className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t-lg transition-all hover:opacity-80" style={{height: '60%'}}></div>
            <div className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t-lg transition-all hover:opacity-80" style={{height: '75%'}}></div>
            <div className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t-lg transition-all hover:opacity-80" style={{height: '55%'}}></div>
            <div className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t-lg transition-all hover:opacity-80" style={{height: '85%'}}></div>
            <div className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t-lg transition-all hover:opacity-80" style={{height: '70%'}}></div>
            <div className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-500 rounded-t-lg transition-all hover:opacity-80" style={{height: '95%'}}></div>
          </div>
          <div className="flex justify-between mt-3">
            <span className="text-xs text-slate-500 font-semibold">Jul</span>
            <span className="text-xs text-slate-500 font-semibold">Aug</span>
            <span className="text-xs text-slate-500 font-semibold">Sep</span>
            <span className="text-xs text-slate-500 font-semibold">Oct</span>
            <span className="text-xs text-slate-500 font-semibold">Nov</span>
            <span className="text-xs text-slate-500 font-semibold">Dec</span>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200">
          <div className="mb-6">
            <h3 className="text-lg font-black text-slate-900">Top Categories</h3>
            <p className="text-xs text-slate-600">By order volume</p>
          </div>
          
          <div className="space-y-4">
            {/* Electronics */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900">Electronics</span>
                <span className="text-sm font-bold text-blue-600">35%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all" style={{width: '35%'}}></div>
              </div>
            </div>

            {/* Fashion */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900">Fashion & Apparel</span>
                <span className="text-sm font-bold text-pink-600">28%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div className="bg-gradient-to-r from-pink-500 to-rose-600 h-3 rounded-full transition-all" style={{width: '28%'}}></div>
              </div>
            </div>

            {/* Machinery */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900">Machinery</span>
                <span className="text-sm font-bold text-slate-600">22%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div className="bg-gradient-to-r from-slate-500 to-slate-600 h-3 rounded-full transition-all" style={{width: '22%'}}></div>
              </div>
            </div>

            {/* Home & Living */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-900">Home & Living</span>
                <span className="text-sm font-bold text-orange-600">15%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div className="bg-gradient-to-r from-orange-500 to-amber-600 h-3 rounded-full transition-all" style={{width: '15%'}}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">Recent Activity</h3>
            <p className="text-xs text-slate-600">Latest platform updates</p>
          </div>
          <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-all">
            View All
            <i className="fas fa-arrow-right text-xs"></i>
          </button>
        </div>

        <div className="space-y-4">
          
          {/* Activity Item 1 */}
          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fas fa-user-check text-white"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">New supplier verified</p>
              <p className="text-xs text-slate-600 mb-1">Global Electronics Ltd. from China has been approved</p>
              <span className="text-xs text-slate-500">2 minutes ago</span>
            </div>
          </div>

          {/* Activity Item 2 */}
          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fas fa-shopping-cart text-white"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">Large order placed</p>
              <p className="text-xs text-slate-600 mb-1">TechMart Inc. ordered 5,000 units worth $285,000</p>
              <span className="text-xs text-slate-500">15 minutes ago</span>
            </div>
          </div>

          {/* Activity Item 3 */}
          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fas fa-box text-white"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">New product submitted</p>
              <p className="text-xs text-slate-600 mb-1">128 products awaiting approval in Electronics category</p>
              <span className="text-xs text-slate-500">32 minutes ago</span>
            </div>
          </div>

          {/* Activity Item 4 */}
          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fas fa-dollar-sign text-white"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">Payment received</p>
              <p className="text-xs text-slate-600 mb-1">$45,200 commission credited to account</p>
              <span className="text-xs text-slate-500">1 hour ago</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
