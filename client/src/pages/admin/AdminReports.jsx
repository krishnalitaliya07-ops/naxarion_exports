import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
  getReportOverview,
  getWeeklyReport,
  getMonthlyReport,
  getQuarterlyReport,
  getYearlyReport,
  getSalesByCategory,
  getSalesByRegion,
  getTopSellingProducts,
  getUserActivityReport,
  getKPIMetrics,
  exportReportPDF,
  generateLocalReportData
} from '../../services/operations/reportAPI';

// Tab configuration
const reportTabs = [
  { id: 'weekly', label: 'Weekly Report', icon: 'fa-calendar-week' },
  { id: 'monthly', label: 'Monthly Report', icon: 'fa-calendar-alt' },
  { id: 'quarterly', label: 'Quarterly Report', icon: 'fa-calendar' },
  { id: 'yearly', label: 'Yearly Report', icon: 'fa-calendar-check' }
];

// Category icons/colors
const categoryConfig = {
  'Electronics': { icon: 'fa-microchip', color: 'bg-blue-500' },
  'Fashion & Apparel': { icon: 'fa-tshirt', color: 'bg-pink-500' },
  'Machinery': { icon: 'fa-cogs', color: 'bg-slate-500' },
  'Home & Living': { icon: 'fa-couch', color: 'bg-amber-500' },
  'Food & Beverages': { icon: 'fa-utensils', color: 'bg-green-500' },
  'Default': { icon: 'fa-box', color: 'bg-purple-500' }
};

// Country flag colors
const countryColors = {
  'US': 'text-blue-600 bg-blue-100',
  'CN': 'text-red-600 bg-red-100',
  'IN': 'text-orange-600 bg-orange-100',
  'DE': 'text-slate-700 bg-slate-100',
  'AE': 'text-green-600 bg-green-100',
  'GB': 'text-indigo-600 bg-indigo-100',
  'JP': 'text-rose-600 bg-rose-100'
};

const AdminReports = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('weekly');
  const [overview, setOverview] = useState({});
  const [reportData, setReportData] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [userActivity, setUserActivity] = useState({});
  const [kpiMetrics, setKPIMetrics] = useState({});
  const [scheduleModal, setScheduleModal] = useState(false);
  const [trendView, setTrendView] = useState('revenue');

  // Fetch all report data
  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [
        overviewRes,
        weeklyRes,
        categoryRes,
        regionRes,
        productsRes,
        activityRes,
        kpiRes
      ] = await Promise.all([
        getReportOverview(activeTab).catch(() => ({ data: {} })),
        activeTab === 'weekly' ? getWeeklyReport().catch(() => ({ data: {} })) :
        activeTab === 'monthly' ? getMonthlyReport().catch(() => ({ data: {} })) :
        activeTab === 'quarterly' ? getQuarterlyReport().catch(() => ({ data: {} })) :
        getYearlyReport().catch(() => ({ data: {} })),
        getSalesByCategory({ period: activeTab }).catch(() => ({ data: [] })),
        getSalesByRegion({ period: activeTab }).catch(() => ({ data: [] })),
        getTopSellingProducts(5).catch(() => ({ data: [] })),
        getUserActivityReport({ period: activeTab }).catch(() => ({ data: {} })),
        getKPIMetrics({ period: activeTab }).catch(() => ({ data: {} }))
      ]);

      setOverview(overviewRes.data || {});
      setReportData(weeklyRes.data || {});
      setCategoryData(categoryRes.data || []);
      setRegionData(regionRes.data || []);
      setTopProducts(productsRes.data || []);
      setUserActivity(activityRes.data || {});
      setKPIMetrics(kpiRes.data || {});
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // Get report period string
  const getReportPeriod = () => {
    const now = new Date();
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    
    switch (activeTab) {
      case 'weekly': {
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return `${weekStart.toLocaleDateString('en-US', options)} - ${now.toLocaleDateString('en-US', options)} (Last 7 Days)`;
      }
      case 'monthly':
        return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'quarterly': {
        const quarter = Math.floor(now.getMonth() / 3) + 1;
        return `Q${quarter} ${now.getFullYear()}`;
      }
      case 'yearly':
        return now.getFullYear().toString();
      default:
        return '';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount?.toFixed(2) || '0'}`;
  };

  // Handle export
  const handleExport = async (format = 'pdf') => {
    try {
      if (format === 'pdf') {
        await exportReportPDF(activeTab, { period: activeTab });
      } else {
        // Generate local CSV export
        const exportData = [
          { metric: 'Total Revenue', value: overview.revenue?.current || 0 },
          { metric: 'Total Orders', value: overview.orders?.current || 0 },
          { metric: 'New Users', value: overview.newUsers?.current || 0 },
          { metric: 'Conversion Rate', value: `${overview.conversionRate?.current || 0}%` }
        ];
        generateLocalReportData(exportData, `${activeTab}-report`);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <i className="fas fa-circle-notch fa-spin text-4xl text-indigo-500"></i>
          <p className="text-slate-600">Loading reports...</p>
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
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-chart-bar text-white text-lg lg:text-xl"></i>
              </div>
              Reports & Analytics
            </h1>
            <p className="text-sm text-slate-600">Comprehensive business insights and performance metrics</p>
          </div>
          <div className="flex flex-wrap gap-2 lg:gap-3">
            <button 
              onClick={() => handleExport('csv')}
              className="bg-white border-2 border-slate-200 text-slate-700 px-3 lg:px-5 py-2 lg:py-2.5 rounded-xl font-bold text-xs lg:text-sm hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center gap-2"
            >
              <i className="fas fa-download"></i>
              <span className="hidden sm:inline">Export All</span>
            </button>
            <button 
              onClick={() => setScheduleModal(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 lg:px-5 py-2 lg:py-2.5 rounded-xl font-bold text-xs lg:text-sm hover:shadow-xl transition-all flex items-center gap-2"
            >
              <i className="fas fa-calendar-plus"></i>
              <span className="hidden sm:inline">Schedule Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Period Tabs */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border-2 border-slate-200 mb-6">
        <div className="flex overflow-x-auto scrollbar-hide">
          {reportTabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[140px] px-4 lg:px-6 py-3 lg:py-4 font-semibold text-xs lg:text-sm border-b-4 whitespace-nowrap transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id 
                  ? 'border-indigo-500 text-indigo-600 bg-indigo-50 font-bold' 
                  : 'border-transparent text-slate-600 hover:bg-slate-50'
              }`}
            >
              <i className={`fas ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Report Header Card */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl lg:rounded-2xl p-4 lg:p-6 mb-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-black mb-1">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Performance Report
            </h2>
            <p className="text-sm text-indigo-100">
              Report Period: {getReportPeriod()}
            </p>
          </div>
          <div className="flex gap-2 lg:gap-3">
            <button 
              onClick={() => window.print()}
              className="px-4 lg:px-5 py-2 lg:py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold text-sm hover:bg-white/30 transition-all flex items-center gap-2"
            >
              <i className="fas fa-print"></i> Print
            </button>
            <button 
              onClick={() => handleExport('pdf')}
              className="px-4 lg:px-5 py-2 lg:py-2.5 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:shadow-xl transition-all flex items-center gap-2"
            >
              <i className="fas fa-download"></i> Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6">
        {/* Weekly Revenue */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200 hover:border-blue-500 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-dollar-sign text-blue-600 text-lg lg:text-xl"></i>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
              (overview.revenue?.growth || 0) >= 0 
                ? 'text-green-600 bg-green-100' 
                : 'text-red-600 bg-red-100'
            }`}>
              <i className={`fas fa-arrow-${(overview.revenue?.growth || 0) >= 0 ? 'up' : 'down'} text-xs`}></i> {Math.abs(overview.revenue?.growth || 0)}%
            </span>
          </div>
          <p className="text-xs lg:text-sm font-bold text-slate-600 mb-1">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Revenue</p>
          <p className="text-xl lg:text-2xl font-black text-slate-900">{formatCurrency(overview.revenue?.current || 0)}</p>
          <p className="text-xs text-slate-500 mt-1">vs last {activeTab}: +{formatCurrency((overview.revenue?.current || 0) - (overview.revenue?.previous || 0))}</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200 hover:border-purple-500 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-shopping-cart text-purple-600 text-lg lg:text-xl"></i>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
              (overview.orders?.growth || 0) >= 0 
                ? 'text-green-600 bg-green-100' 
                : 'text-red-600 bg-red-100'
            }`}>
              <i className={`fas fa-arrow-${(overview.orders?.growth || 0) >= 0 ? 'up' : 'down'} text-xs`}></i> {Math.abs(overview.orders?.growth || 0)}%
            </span>
          </div>
          <p className="text-xs lg:text-sm font-bold text-slate-600 mb-1">Total Orders</p>
          <p className="text-xl lg:text-2xl font-black text-slate-900">{(overview.orders?.current || 0).toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">vs last {activeTab}: +{(overview.orders?.current || 0) - (overview.orders?.previous || 0)} orders</p>
        </div>

        {/* New Users */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200 hover:border-green-500 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-user-plus text-green-600 text-lg lg:text-xl"></i>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
              (overview.newUsers?.growth || 0) >= 0 
                ? 'text-green-600 bg-green-100' 
                : 'text-red-600 bg-red-100'
            }`}>
              <i className={`fas fa-arrow-${(overview.newUsers?.growth || 0) >= 0 ? 'up' : 'down'} text-xs`}></i> {Math.abs(overview.newUsers?.growth || 0)}%
            </span>
          </div>
          <p className="text-xs lg:text-sm font-bold text-slate-600 mb-1">New Users</p>
          <p className="text-xl lg:text-2xl font-black text-slate-900">{(overview.newUsers?.current || 0).toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-1">vs last {activeTab}: +{(overview.newUsers?.current || 0) - (overview.newUsers?.previous || 0)} users</p>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200 hover:border-amber-500 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-percentage text-amber-600 text-lg lg:text-xl"></i>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
              (overview.conversionRate?.growth || 0) >= 0 
                ? 'text-green-600 bg-green-100' 
                : 'text-red-600 bg-red-100'
            }`}>
              <i className={`fas fa-arrow-${(overview.conversionRate?.growth || 0) >= 0 ? 'up' : 'down'} text-xs`}></i> {Math.abs(overview.conversionRate?.growth || 0)}%
            </span>
          </div>
          <p className="text-xs lg:text-sm font-bold text-slate-600 mb-1">Conversion Rate</p>
          <p className="text-xl lg:text-2xl font-black text-slate-900">{overview.conversionRate?.current || 0}%</p>
          <p className="text-xs text-slate-500 mt-1">vs last {activeTab}: +{((overview.conversionRate?.current || 0) - (overview.conversionRate?.previous || 0)).toFixed(1)}%</p>
        </div>
      </div>

      {/* Revenue Trend Section */}
      <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-3">
          <div>
            <h3 className="text-base lg:text-lg font-black text-slate-900">Revenue Trend - {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
            <p className="text-xs text-slate-500">Daily breakdown for the last 7 days</p>
          </div>
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button 
              onClick={() => setTrendView('revenue')}
              className={`px-3 lg:px-4 py-1.5 rounded-lg text-xs lg:text-sm font-bold transition-all ${
                trendView === 'revenue' ? 'bg-white text-indigo-600 shadow' : 'text-slate-600'
              }`}
            >
              Revenue
            </button>
            <button 
              onClick={() => setTrendView('orders')}
              className={`px-3 lg:px-4 py-1.5 rounded-lg text-xs lg:text-sm font-bold transition-all ${
                trendView === 'orders' ? 'bg-white text-indigo-600 shadow' : 'text-slate-600'
              }`}
            >
              Orders
            </button>
          </div>
        </div>

        {/* Trend Stats */}
        <div className="grid grid-cols-3 gap-4 lg:gap-6 mb-6 p-4 bg-slate-50 rounded-xl">
          <div className="text-center">
            <p className="text-xs text-slate-500 mb-1">Highest Day</p>
            <p className="text-lg lg:text-xl font-black text-green-600">{reportData.summary?.highestDay?.day || 'N/A'} - {formatCurrency(reportData.summary?.highestDay?.amount || 0)}</p>
          </div>
          <div className="text-center border-x border-slate-200">
            <p className="text-xs text-slate-500 mb-1">Average Daily</p>
            <p className="text-lg lg:text-xl font-black text-indigo-600">{formatCurrency(reportData.summary?.averageDaily || 0)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 mb-1">Growth Rate</p>
            <p className={`text-lg lg:text-xl font-black ${(reportData.summary?.growthRate || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(reportData.summary?.growthRate || 0) >= 0 ? '+' : ''}{reportData.summary?.growthRate || 0}%
            </p>
          </div>
        </div>

        {/* Daily Data Bars */}
        <div className="space-y-3">
          {(reportData.dailyData || []).map((day, index) => {
            const maxValue = Math.max(...(reportData.dailyData || []).map(d => trendView === 'revenue' ? d.revenue : d.orders));
            const value = trendView === 'revenue' ? day.revenue : day.orders;
            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
            
            return (
              <div key={index} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600 w-20">{day.day}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-900 w-20 text-right">
                  {trendView === 'revenue' ? formatCurrency(value) : value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Geographic Performance & Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Geographic Performance */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
          <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4">Geographic Performance</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {(regionData.slice(0, 5) || []).map((region, index) => (
              <div 
                key={index} 
                className={`p-3 lg:p-4 rounded-xl border-2 transition-all hover:border-indigo-300 ${
                  index === 0 ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-black px-2 py-1 rounded ${countryColors[region.countryCode] || 'bg-slate-100 text-slate-600'}`}>
                    {region.countryCode}
                  </span>
                  <span className="text-xs text-slate-600 truncate">{region.country}</span>
                </div>
                <p className={`text-lg font-black ${index === 0 ? 'text-indigo-600' : 'text-slate-900'}`}>
                  {formatCurrency(region.revenue)}
                </p>
                <p className="text-xs text-slate-500">{region.orders} orders • {region.percentage}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
          <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4">Top Categories - This {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
          <div className="space-y-4">
            {(categoryData.slice(0, 4) || []).map((category, index) => {
              const config = categoryConfig[category.category] || categoryConfig['Default'];
              return (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 ${config.color} rounded-lg flex items-center justify-center`}>
                        <i className={`fas ${config.icon} text-white text-xs`}></i>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{category.category || 'Unknown'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-green-600">{formatCurrency(category.revenue)}</span>
                      <span className="text-xs text-slate-500 ml-2">{category.percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full ${config.color} rounded-full transition-all duration-500`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{category.orders} orders</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Products & User Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Selling Products */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
          <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {(topProducts || []).map((product, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-all">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-white ${
                  index === 0 ? 'bg-indigo-500' :
                  index === 1 ? 'bg-purple-500' :
                  index === 2 ? 'bg-pink-500' :
                  index === 3 ? 'bg-amber-500' :
                  'bg-slate-500'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900 truncate">{product.name}</p>
                  <p className="text-xs text-slate-500">{product.category || 'Uncategorized'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-green-600">{formatCurrency(product.revenue)}</p>
                  <p className="text-xs text-slate-500">{product.totalSold} units</p>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && (
              <div className="text-center py-8">
                <i className="fas fa-box text-4xl text-slate-300 mb-2"></i>
                <p className="text-slate-500 text-sm">No product data available</p>
              </div>
            )}
          </div>
        </div>

        {/* User Activity Overview */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
          <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4">User Activity Overview</h3>
          <div className="space-y-3">
            {[
              { icon: 'fa-user-plus', color: 'bg-blue-100 text-blue-600', label: 'New Registrations', subLabel: 'This week', value: userActivity.newRegistrations?.value || 0, growth: userActivity.newRegistrations?.growth || 0 },
              { icon: 'fa-eye', color: 'bg-purple-100 text-purple-600', label: 'Total Page Views', subLabel: 'This week', value: (userActivity.totalPageViews?.value || 0).toLocaleString(), growth: userActivity.totalPageViews?.growth || 0 },
              { icon: 'fa-users', color: 'bg-green-100 text-green-600', label: 'Active Users', subLabel: 'Daily average', value: (userActivity.activeUsers?.value || 0).toLocaleString(), growth: userActivity.activeUsers?.growth || 0 },
              { icon: 'fa-clock', color: 'bg-amber-100 text-amber-600', label: 'Avg. Session Duration', subLabel: 'Per user', value: userActivity.avgSessionDuration?.value || '0:00', growth: userActivity.avgSessionDuration?.growth || 0 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.subLabel}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-slate-900">{item.value}</p>
                  <p className={`text-xs font-bold ${item.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.growth >= 0 ? '+' : ''}{item.growth}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200 mb-6">
        <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4">Key Performance Metrics</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: 'fa-check-circle', color: 'bg-green-100 text-green-600', label: 'Order Success Rate', subLabel: kpiMetrics.orderSuccessRate?.label || 'Completed orders', value: `${kpiMetrics.orderSuccessRate?.value || 0}%`, growth: kpiMetrics.orderSuccessRate?.growth || 0 },
            { icon: 'fa-coins', color: 'bg-amber-100 text-amber-600', label: 'Average Order Value', subLabel: kpiMetrics.avgOrderValue?.label || 'Per transaction', value: `$${kpiMetrics.avgOrderValue?.value || 0}`, growth: kpiMetrics.avgOrderValue?.growth || 0 },
            { icon: 'fa-redo', color: 'bg-indigo-100 text-indigo-600', label: 'Customer Return Rate', subLabel: kpiMetrics.customerReturnRate?.label || 'Repeat customers', value: `${kpiMetrics.customerReturnRate?.value || 0}%`, growth: kpiMetrics.customerReturnRate?.growth || 0 },
            { icon: 'fa-star', color: 'bg-pink-100 text-pink-600', label: 'Customer Satisfaction', subLabel: kpiMetrics.customerSatisfaction?.label || 'Average rating', value: `${kpiMetrics.customerSatisfaction?.value || 0}/5`, growth: kpiMetrics.customerSatisfaction?.growth || 0 }
          ].map((item, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 hover:border-indigo-300 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.subLabel}</p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-black text-slate-900">{item.value}</p>
                <p className={`text-xs font-bold ${item.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.growth >= 0 ? '+' : ''}{item.growth}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Summary */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white">
        <h3 className="text-lg lg:text-xl font-black mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Report Summary</h3>
        <p className="text-sm text-indigo-100">
          Overall performance is <span className="font-bold text-white">
            {(overview.revenue?.growth || 0) >= 10 ? 'excellent' : 
             (overview.revenue?.growth || 0) >= 0 ? 'good' : 'needs attention'}
          </span> with {(overview.revenue?.growth || 0) >= 0 ? 'strong' : 'declining'} growth across all metrics. 
          Revenue {(overview.revenue?.growth || 0) >= 0 ? 'up' : 'down'} {Math.abs(overview.revenue?.growth || 0)}%, 
          new users {(overview.newUsers?.growth || 0) >= 0 ? 'up' : 'down'} {Math.abs(overview.newUsers?.growth || 0)}%, 
          and conversion rate {(overview.conversionRate?.growth || 0) >= 0 ? 'improved' : 'declined'} by {Math.abs(overview.conversionRate?.growth || 0)}%.
        </p>
      </div>

      {/* Schedule Report Modal */}
      {scheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">Schedule Report</h2>
                <button onClick={() => setScheduleModal(false)} className="text-slate-400 hover:text-slate-600">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Report Type</label>
                <select className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none">
                  <option>Weekly Performance Report</option>
                  <option>Monthly Performance Report</option>
                  <option>Quarterly Performance Report</option>
                  <option>Revenue Report</option>
                  <option>User Activity Report</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Frequency</label>
                <select className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Recipients (Email)</label>
                <input 
                  type="email" 
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setScheduleModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    toast.success('Report scheduled successfully');
                    setScheduleModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
