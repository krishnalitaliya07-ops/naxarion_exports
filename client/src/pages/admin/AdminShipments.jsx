import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { shipmentEndpoints, adminEndpoints } from '../../services/apis';
import {
  getAllShipments,
  getShipmentStats,
  updateShipmentStatus,
  addTrackingUpdate,
  createShipment,
  deleteShipment,
  exportShipmentsCSV
} from '../../services/operations/shipmentAPI';

const {
  NOTIFY_CUSTOMER_API
} = shipmentEndpoints;

// Status colors and icons
const statusConfig = {
  'Pending Pickup': { color: 'amber', icon: 'fa-clock', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
  'Picked Up': { color: 'blue', icon: 'fa-box', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  'In Transit': { color: 'cyan', icon: 'fa-truck', bgColor: 'bg-cyan-100', textColor: 'text-cyan-700' },
  'Customs Clearance': { color: 'purple', icon: 'fa-shield-alt', bgColor: 'bg-purple-100', textColor: 'text-purple-700' },
  'Out for Delivery': { color: 'indigo', icon: 'fa-shipping-fast', bgColor: 'bg-indigo-100', textColor: 'text-indigo-700' },
  'Delivered': { color: 'green', icon: 'fa-check-circle', bgColor: 'bg-green-100', textColor: 'text-green-700' },
  'Delayed': { color: 'red', icon: 'fa-exclamation-triangle', bgColor: 'bg-red-100', textColor: 'text-red-700' },
  'Failed Delivery': { color: 'red', icon: 'fa-times-circle', bgColor: 'bg-red-100', textColor: 'text-red-700' },
  'Returned': { color: 'slate', icon: 'fa-undo', bgColor: 'bg-slate-100', textColor: 'text-slate-700' }
};

const carriers = ['DHL Express', 'FedEx', 'UPS', 'Maersk', 'Local Courier', 'Other'];

const AdminShipments = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState([]);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [carrierFilter, setCarrierFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedShipment, setExpandedShipment] = useState(null);
  const [newShipmentModal, setNewShipmentModal] = useState(false);
  const [trackingModal, setTrackingModal] = useState(null);
  const [newShipmentData, setNewShipmentData] = useState({
    order: '',
    carrier: { name: 'DHL Express', service: 'Express International' },
    origin: { name: '', company: '', address: '', city: '', country: '', zipCode: '' },
    destination: { name: '', company: '', address: '', city: '', country: '', zipCode: '' },
    packageInfo: { weight: { value: 0 }, dimensions: { length: 0, width: 0, height: 0 }, numberOfPackages: 1 },
    estimatedDelivery: '',
    shippingCost: 0,
    shippingMethod: 'Express'
  });
  const [newTrackingUpdate, setNewTrackingUpdate] = useState({
    status: '',
    description: '',
    location: ''
  });

  // Fetch data
  const fetchShipments = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        status: activeTab !== 'all' ? activeTab : (statusFilter !== 'all' ? statusFilter : undefined),
        carrier: carrierFilter !== 'all' ? carrierFilter : undefined,
        endDate: dateFilter || undefined
      };

      const response = await getAllShipments(params);
      setShipments(response.data || []);
      setTotalPages(response.pages || 1);
    } catch (error) {
      console.error('Failed to fetch shipments:', error);
      toast.error('Failed to load shipments');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, activeTab, statusFilter, carrierFilter, dateFilter]);

  const fetchStats = async () => {
    try {
      const response = await getShipmentStats();
      setStats(response.data || {});
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchShipments();
    fetchStats();
  }, [fetchShipments]);

  // Handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCarrierFilter('all');
    setDateFilter('');
    setActiveTab('all');
    setCurrentPage(1);
  };

  const handleStatusUpdate = async (shipmentId, newStatus) => {
    try {
      await updateShipmentStatus(shipmentId, newStatus);
      fetchShipments();
      fetchStats();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleAddTrackingUpdate = async () => {
    if (!trackingModal || !newTrackingUpdate.status) return;
    try {
      await addTrackingUpdate(trackingModal, newTrackingUpdate);
      setTrackingModal(null);
      setNewTrackingUpdate({ status: '', description: '', location: '' });
      fetchShipments();
    } catch (error) {
      console.error('Failed to add tracking update:', error);
    }
  };

  const handleNotifyCustomer = async (shipmentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        NOTIFY_CUSTOMER_API(shipmentId),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Customer notified successfully');
    } catch (error) {
      toast.error('Failed to notify customer');
    }
  };

  const handleCreateShipment = async (e) => {
    e.preventDefault();
    try {
      await createShipment(newShipmentData);
      setNewShipmentModal(false);
      setNewShipmentData({
        order: '',
        carrier: { name: 'DHL Express', service: 'Express International' },
        origin: { name: '', company: '', address: '', city: '', country: '', zipCode: '' },
        destination: { name: '', company: '', address: '', city: '', country: '', zipCode: '' },
        packageInfo: { weight: { value: 0 }, dimensions: { length: 0, width: 0, height: 0 }, numberOfPackages: 1 },
        estimatedDelivery: '',
        shippingCost: 0,
        shippingMethod: 'Express'
      });
      fetchShipments();
      fetchStats();
    } catch (error) {
      console.error('Failed to create shipment:', error);
    }
  };

  const handleExportReport = () => {
    exportShipmentsCSV(shipments);
  };

  // Calculate progress for shipment
  const calculateProgress = (shipment) => {
    const statusOrder = ['Pending Pickup', 'Picked Up', 'In Transit', 'Customs Clearance', 'Out for Delivery', 'Delivered'];
    const currentIndex = statusOrder.indexOf(shipment.status);
    if (currentIndex === -1) return 0;
    return Math.round(((currentIndex + 1) / statusOrder.length) * 100);
  };

  // Calculate days remaining
  const getDaysRemaining = (estimatedDelivery) => {
    if (!estimatedDelivery) return null;
    const eta = new Date(estimatedDelivery);
    const now = new Date();
    const diffTime = eta - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Loading state
  if (loading && shipments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <i className="fas fa-circle-notch fa-spin text-4xl text-cyan-500"></i>
          <p className="text-slate-600">Loading shipments...</p>
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
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-shipping-fast text-white text-lg lg:text-xl"></i>
              </div>
              Shipping & Logistics
            </h1>
            <p className="text-sm text-slate-600">Track and manage all shipments in real-time</p>
          </div>
          <div className="flex flex-wrap gap-2 lg:gap-3">
            <button 
              onClick={handleExportReport}
              className="bg-white border-2 border-slate-200 text-slate-700 px-3 lg:px-5 py-2 lg:py-2.5 rounded-xl font-bold text-xs lg:text-sm hover:border-cyan-500 hover:text-cyan-600 transition-all flex items-center gap-2"
            >
              <i className="fas fa-download"></i>
              <span className="hidden sm:inline">Export Report</span>
            </button>
            <button 
              onClick={() => setNewShipmentModal(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 lg:px-5 py-2 lg:py-2.5 rounded-xl font-bold text-xs lg:text-sm hover:shadow-xl transition-all flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              <span className="hidden sm:inline">New Shipment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-6 mb-6 lg:mb-8">
        {/* Total Shipments */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200 hover:border-cyan-500 transition-all">
          <div className="flex items-center justify-between mb-2 lg:mb-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-shipping-fast text-cyan-600 text-lg lg:text-xl"></i>
            </div>
            {stats.monthlyGrowth > 0 && (
              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg">
                <i className="fas fa-arrow-up text-xs"></i> {stats.monthlyGrowth}%
              </span>
            )}
          </div>
          <p className="text-xs lg:text-sm font-bold text-slate-600 mb-1">Total Shipments</p>
          <p className="text-xl lg:text-2xl font-black text-slate-900">{stats.total?.toLocaleString() || 0}</p>
        </div>

        {/* In Transit */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200 hover:border-blue-500 transition-all">
          <div className="flex items-center justify-between mb-2 lg:mb-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-truck text-blue-600 text-lg lg:text-xl"></i>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-lg">Live</span>
          </div>
          <p className="text-xs lg:text-sm font-bold text-slate-600 mb-1">In Transit</p>
          <p className="text-xl lg:text-2xl font-black text-slate-900">{stats.inTransit?.toLocaleString() || 0}</p>
        </div>

        {/* Delivered */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200 hover:border-green-500 transition-all">
          <div className="flex items-center justify-between mb-2 lg:mb-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-check-circle text-green-600 text-lg lg:text-xl"></i>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg">{stats.deliveryRate || 0}%</span>
          </div>
          <p className="text-xs lg:text-sm font-bold text-slate-600 mb-1">Delivered</p>
          <p className="text-xl lg:text-2xl font-black text-slate-900">{stats.delivered?.toLocaleString() || 0}</p>
        </div>

        {/* Pending Pickup */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200 hover:border-amber-500 transition-all">
          <div className="flex items-center justify-between mb-2 lg:mb-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-clock text-amber-600 text-lg lg:text-xl"></i>
            </div>
            {stats.pendingPickup > 0 && (
              <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-lg">Urgent</span>
            )}
          </div>
          <p className="text-xs lg:text-sm font-bold text-slate-600 mb-1">Pending Pickup</p>
          <p className="text-xl lg:text-2xl font-black text-slate-900">{stats.pendingPickup?.toLocaleString() || 0}</p>
        </div>

        {/* Issues/Delays */}
        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200 hover:border-red-500 transition-all col-span-2 md:col-span-1">
          <div className="flex items-center justify-between mb-2 lg:mb-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-red-600 text-lg lg:text-xl"></i>
            </div>
            {stats.issues > 0 && (
              <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-lg">Alert</span>
            )}
          </div>
          <p className="text-xs lg:text-sm font-bold text-slate-600 mb-1">Issues/Delays</p>
          <p className="text-xl lg:text-2xl font-black text-slate-900">{stats.issues?.toLocaleString() || 0}</p>
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
                placeholder="Search by tracking number, order ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 lg:pl-12 pr-4 py-2.5 lg:py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm focus:border-cyan-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 lg:px-4 py-2.5 lg:py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:border-cyan-500 focus:outline-none transition-all"
          >
            <option value="all">All Status</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Pending Pickup">Pending Pickup</option>
            <option value="Delayed">Delayed</option>
            <option value="Customs Clearance">Customs Clearance</option>
          </select>

          {/* Carrier Filter */}
          <select 
            value={carrierFilter}
            onChange={(e) => setCarrierFilter(e.target.value)}
            className="px-3 lg:px-4 py-2.5 lg:py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:border-cyan-500 focus:outline-none transition-all hidden md:block"
          >
            <option value="all">All Carriers</option>
            {carriers.map(carrier => (
              <option key={carrier} value={carrier}>{carrier}</option>
            ))}
          </select>

          {/* Date Filter */}
          <input 
            type="date" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 lg:px-4 py-2.5 lg:py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:border-cyan-500 focus:outline-none transition-all hidden lg:block"
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
            { id: 'In Transit', label: 'In Transit', count: stats.inTransit, icon: 'fa-truck' },
            { id: 'Pending Pickup', label: 'Pending', count: stats.pendingPickup, icon: 'fa-clock' },
            { id: 'Customs Clearance', label: 'Customs', count: stats.customsClearance, icon: 'fa-shield-alt' },
            { id: 'Delayed', label: 'Issues', count: stats.issues, icon: 'fa-exclamation-triangle' },
            { id: 'Delivered', label: 'Delivered', count: stats.delivered, icon: 'fa-check-circle' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 min-w-[100px] px-3 lg:px-6 py-3 lg:py-4 font-semibold text-xs lg:text-sm border-b-4 whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'border-cyan-500 text-cyan-600 bg-cyan-50 font-bold' 
                  : 'border-transparent text-slate-600 hover:bg-slate-50'
              }`}
            >
              <i className={`fas ${tab.icon} mr-1 lg:mr-2`}></i>
              <span className="hidden sm:inline">{tab.label}</span> ({tab.count || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Shipments List */}
      <div className="space-y-4 lg:space-y-6">
        {shipments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-lg border-2 border-slate-200 text-center">
            <i className="fas fa-shipping-fast text-6xl text-slate-300 mb-4"></i>
            <p className="text-slate-600 font-semibold">No shipments found</p>
            <p className="text-slate-500 text-sm mt-2">Try adjusting your filters or create a new shipment</p>
          </div>
        ) : (
          shipments.map((shipment) => (
            <div 
              key={shipment._id} 
              className={`bg-white rounded-xl lg:rounded-2xl shadow-lg border-2 ${
                shipment.status === 'Delayed' || shipment.status === 'Failed Delivery' 
                  ? 'border-red-300 hover:border-red-500' 
                  : 'border-slate-200 hover:border-cyan-500'
              } transition-all overflow-hidden`}
            >
              {/* Header */}
              <div className={`px-4 lg:px-6 py-3 lg:py-4 ${
                shipment.status === 'Delayed' || shipment.status === 'Failed Delivery'
                  ? 'bg-gradient-to-r from-red-500 to-orange-600'
                  : shipment.status === 'Delivered'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <i className="fas fa-shipping-fast text-white text-lg lg:text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-base lg:text-lg font-black text-white mb-0.5 lg:mb-1">
                        Tracking #: {shipment.trackingNumber}
                      </h3>
                      <p className="text-xs text-cyan-100">
                        Order ID: #{shipment.order?.orderId || 'N/A'} • Shipped: {new Date(shipment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-3">
                    <span className="px-3 lg:px-4 py-1.5 lg:py-2 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-lg text-xs lg:text-sm font-bold">
                      <i className={`fas ${statusConfig[shipment.status]?.icon || 'fa-box'} mr-1`}></i>
                      {shipment.status}
                    </span>
                    <button 
                      onClick={() => setExpandedShipment(expandedShipment === shipment._id ? null : shipment._id)}
                      className="w-8 h-8 lg:w-10 lg:h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-opacity-30 transition-all"
                    >
                      <i className={`fas ${expandedShipment === shipment._id ? 'fa-chevron-up' : 'fa-chevron-down'} text-white`}></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedShipment === shipment._id && (
                <div className="p-4 lg:p-6">
                  {/* Timeline */}
                  <div className="mb-4 lg:mb-6">
                    <h4 className="text-sm font-black text-slate-900 mb-3 lg:mb-4">Shipping Timeline</h4>
                    <div className="relative">
                      {/* Progress Line */}
                      <div className="absolute left-5 lg:left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                      <div 
                        className="absolute left-5 lg:left-6 top-0 w-0.5 bg-cyan-500" 
                        style={{ height: `${calculateProgress(shipment)}%` }}
                      ></div>

                      {/* Timeline Items */}
                      <div className="space-y-4 lg:space-y-6">
                        {shipment.timeline?.map((item, index) => (
                          <div key={index} className={`flex items-start gap-3 lg:gap-4 relative ${!item.isCompleted && item.status !== shipment.status ? 'opacity-50' : ''}`}>
                            <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-lg ${
                              item.isCompleted 
                                ? 'bg-green-500' 
                                : item.status === shipment.status 
                                  ? 'bg-cyan-500 animate-pulse' 
                                  : 'bg-slate-300'
                            }`}>
                              <i className={`fas ${item.isCompleted ? 'fa-check' : statusConfig[item.status]?.icon || 'fa-circle'} text-white text-sm lg:text-base`}></i>
                            </div>
                            <div className="flex-1 pt-1 lg:pt-2">
                              <p className="text-sm font-bold text-slate-900">{item.status}</p>
                              <p className="text-xs text-slate-600 mb-1">{item.description}</p>
                              {item.location && (
                                <p className="text-xs text-cyan-600 font-semibold">
                                  <i className="fas fa-map-marker-alt mr-1"></i>
                                  {item.location} • {new Date(item.timestamp).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-cyan-500 h-2 rounded-full transition-all" 
                          style={{ width: `${calculateProgress(shipment)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-cyan-600">{calculateProgress(shipment)}%</span>
                    </div>
                  </div>

                  {/* Shipment Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4">
                    {/* Origin */}
                    <div className="bg-blue-50 rounded-xl p-3 lg:p-4 border border-blue-200">
                      <h5 className="text-xs font-black text-blue-900 mb-1 lg:mb-2 uppercase flex items-center gap-2">
                        <i className="fas fa-map-marker-alt"></i> Origin
                      </h5>
                      <p className="text-sm font-bold text-slate-900">{shipment.origin?.city}, {shipment.origin?.country}</p>
                      <p className="text-xs text-slate-600">{shipment.origin?.company || shipment.origin?.name}</p>
                    </div>

                    {/* Destination */}
                    <div className="bg-purple-50 rounded-xl p-3 lg:p-4 border border-purple-200">
                      <h5 className="text-xs font-black text-purple-900 mb-1 lg:mb-2 uppercase flex items-center gap-2">
                        <i className="fas fa-map-marker-alt"></i> Destination
                      </h5>
                      <p className="text-sm font-bold text-slate-900">{shipment.destination?.city}, {shipment.destination?.country}</p>
                      <p className="text-xs text-slate-600">{shipment.destination?.company || shipment.destination?.name}</p>
                    </div>

                    {/* Carrier */}
                    <div className="bg-amber-50 rounded-xl p-3 lg:p-4 border border-amber-200">
                      <h5 className="text-xs font-black text-amber-900 mb-1 lg:mb-2 uppercase flex items-center gap-2">
                        <i className="fas fa-truck"></i> Carrier
                      </h5>
                      <p className="text-sm font-bold text-slate-900">{shipment.carrier?.name}</p>
                      <p className="text-xs text-slate-600">{shipment.carrier?.service || shipment.shippingMethod}</p>
                    </div>

                    {/* ETA */}
                    <div className="bg-green-50 rounded-xl p-3 lg:p-4 border border-green-200">
                      <h5 className="text-xs font-black text-green-900 mb-1 lg:mb-2 uppercase flex items-center gap-2">
                        <i className="fas fa-calendar-check"></i> ETA
                      </h5>
                      <p className="text-sm font-bold text-slate-900">
                        {shipment.estimatedDelivery 
                          ? new Date(shipment.estimatedDelivery).toLocaleDateString() 
                          : 'N/A'}
                      </p>
                      {getDaysRemaining(shipment.estimatedDelivery) !== null && (
                        <p className="text-xs text-slate-600">
                          {getDaysRemaining(shipment.estimatedDelivery) > 0 
                            ? `${getDaysRemaining(shipment.estimatedDelivery)} days remaining`
                            : getDaysRemaining(shipment.estimatedDelivery) === 0 
                              ? 'Arriving today'
                              : 'Past due'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Package Details */}
                  <div className="bg-slate-50 rounded-xl p-3 lg:p-4 mb-4">
                    <h5 className="text-sm font-black text-slate-900 mb-2 lg:mb-3">Package Information</h5>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Weight</p>
                        <p className="text-sm font-bold text-slate-900">
                          {shipment.packageInfo?.weight?.value || 0} {shipment.packageInfo?.weight?.unit || 'kg'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Dimensions</p>
                        <p className="text-sm font-bold text-slate-900">
                          {shipment.packageInfo?.dimensions?.length || 0}×
                          {shipment.packageInfo?.dimensions?.width || 0}×
                          {shipment.packageInfo?.dimensions?.height || 0} {shipment.packageInfo?.dimensions?.unit || 'cm'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Packages</p>
                        <p className="text-sm font-bold text-slate-900">
                          {shipment.packageInfo?.numberOfPackages || 1} {shipment.packageInfo?.packageType || 'boxes'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Shipping Cost</p>
                        <p className="text-sm font-bold text-emerald-600">${shipment.shippingCost?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
                    <button 
                      onClick={() => setTrackingModal(shipment._id)}
                      className="bg-cyan-100 hover:bg-cyan-200 text-cyan-700 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl text-xs lg:text-sm font-bold transition-all flex items-center justify-center gap-1 lg:gap-2"
                    >
                      <i className="fas fa-plus"></i> <span className="hidden sm:inline">Add</span> Update
                    </button>
                    <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl text-xs lg:text-sm font-bold transition-all flex items-center justify-center gap-1 lg:gap-2">
                      <i className="fas fa-file-pdf"></i> <span className="hidden sm:inline">Download</span> Label
                    </button>
                    <button 
                      onClick={() => handleNotifyCustomer(shipment._id)}
                      className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl text-xs lg:text-sm font-bold transition-all flex items-center justify-center gap-1 lg:gap-2"
                    >
                      <i className="fas fa-envelope"></i> Notify
                    </button>
                    <select 
                      value={shipment.status}
                      onChange={(e) => handleStatusUpdate(shipment._id, e.target.value)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl text-xs lg:text-sm font-bold transition-all cursor-pointer"
                    >
                      {Object.keys(statusConfig).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Collapsed View - Quick Info */}
              {expandedShipment !== shipment._id && (
                <div className="p-3 lg:p-4 flex flex-wrap items-center gap-3 lg:gap-4 text-xs lg:text-sm">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-map-marker-alt text-blue-500"></i>
                    <span className="text-slate-600">{shipment.origin?.city} → {shipment.destination?.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-truck text-amber-500"></i>
                    <span className="text-slate-600">{shipment.carrier?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-calendar text-green-500"></i>
                    <span className="text-slate-600">
                      ETA: {shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="ml-auto">
                    <button 
                      onClick={() => setExpandedShipment(shipment._id)}
                      className="text-cyan-600 font-bold hover:text-cyan-700"
                    >
                      View Details <i className="fas fa-chevron-down ml-1"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="px-4 py-2 text-sm font-bold text-slate-600">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* New Shipment Modal */}
      {newShipmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">Create New Shipment</h2>
                <button onClick={() => setNewShipmentModal(false)} className="text-slate-400 hover:text-slate-600">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>
            <form onSubmit={handleCreateShipment} className="p-6 space-y-4">
              {/* Order ID */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Order ID</label>
                <input 
                  type="text" 
                  value={newShipmentData.order}
                  onChange={(e) => setNewShipmentData({...newShipmentData, order: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-none"
                  placeholder="Enter Order ID"
                />
              </div>

              {/* Carrier Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Carrier</label>
                  <select 
                    value={newShipmentData.carrier.name}
                    onChange={(e) => setNewShipmentData({...newShipmentData, carrier: {...newShipmentData.carrier, name: e.target.value}})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-none"
                  >
                    {carriers.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Shipping Method</label>
                  <select 
                    value={newShipmentData.shippingMethod}
                    onChange={(e) => setNewShipmentData({...newShipmentData, shippingMethod: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Air">Air</option>
                    <option value="Sea">Sea</option>
                    <option value="Land">Land</option>
                    <option value="Express">Express</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>
              </div>

              {/* Origin */}
              <div>
                <h4 className="text-sm font-black text-slate-900 mb-2">Origin</h4>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="City"
                    value={newShipmentData.origin.city}
                    onChange={(e) => setNewShipmentData({...newShipmentData, origin: {...newShipmentData.origin, city: e.target.value}})}
                    className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-none"
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="Country"
                    value={newShipmentData.origin.country}
                    onChange={(e) => setNewShipmentData({...newShipmentData, origin: {...newShipmentData.origin, country: e.target.value}})}
                    className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Address"
                  value={newShipmentData.origin.address}
                  onChange={(e) => setNewShipmentData({...newShipmentData, origin: {...newShipmentData.origin, address: e.target.value}})}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-none mt-2"
                  required
                />
              </div>

              {/* Destination */}
              <div>
                <h4 className="text-sm font-black text-slate-900 mb-2">Destination</h4>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="City"
                    value={newShipmentData.destination.city}
                    onChange={(e) => setNewShipmentData({...newShipmentData, destination: {...newShipmentData.destination, city: e.target.value}})}
                    className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-none"
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="Country"
                    value={newShipmentData.destination.country}
                    onChange={(e) => setNewShipmentData({...newShipmentData, destination: {...newShipmentData.destination, country: e.target.value}})}
                    className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Address"
                  value={newShipmentData.destination.address}
                  onChange={(e) => setNewShipmentData({...newShipmentData, destination: {...newShipmentData.destination, address: e.target.value}})}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-none mt-2"
                  required
                />
              </div>

              {/* Package Info & Cost */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Weight (kg)</label>
                  <input 
                    type="number" 
                    value={newShipmentData.packageInfo.weight.value}
                    onChange={(e) => setNewShipmentData({
                      ...newShipmentData, 
                      packageInfo: {
                        ...newShipmentData.packageInfo, 
                        weight: {...newShipmentData.packageInfo.weight, value: parseFloat(e.target.value)}
                      }
                    })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">ETA</label>
                  <input 
                    type="date" 
                    value={newShipmentData.estimatedDelivery}
                    onChange={(e) => setNewShipmentData({...newShipmentData, estimatedDelivery: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Cost ($)</label>
                  <input 
                    type="number" 
                    value={newShipmentData.shippingCost}
                    onChange={(e) => setNewShipmentData({...newShipmentData, shippingCost: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setNewShipmentModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
                >
                  Create Shipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Tracking Update Modal */}
      {trackingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">Add Tracking Update</h2>
                <button onClick={() => setTrackingModal(null)} className="text-slate-400 hover:text-slate-600">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                <select 
                  value={newTrackingUpdate.status}
                  onChange={(e) => setNewTrackingUpdate({...newTrackingUpdate, status: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-none"
                  required
                >
                  <option value="">Select Status</option>
                  {Object.keys(statusConfig).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea 
                  value={newTrackingUpdate.description}
                  onChange={(e) => setNewTrackingUpdate({...newTrackingUpdate, description: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-none"
                  rows="3"
                  placeholder="Enter update description..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                <input 
                  type="text" 
                  value={newTrackingUpdate.location}
                  onChange={(e) => setNewTrackingUpdate({...newTrackingUpdate, location: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:outline-none"
                  placeholder="e.g., Singapore Hub"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setTrackingModal(null)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddTrackingUpdate}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
                >
                  Add Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShipments;
