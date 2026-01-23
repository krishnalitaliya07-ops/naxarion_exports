import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  TrendingUp,
  Plane,
  Ship,
  ArrowRight,
  Box,
  FileText,
  User,
  Phone,
  Building2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { apiconnector } from '../../services/apiconnector';
import { dashboardEndpoints, shipmentEndpoints } from '../../services/apis';

const DashboardShipments = () => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pendingPickup: 0,
    inTransit: 0,
    delivered: 0,
    delayed: 0
  });

  const statusConfig = {
    'Pending Pickup': {
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      badge: 'bg-yellow-100 text-yellow-800',
      label: 'Pending Pickup'
    },
    'Picked Up': {
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800',
      label: 'Picked Up'
    },
    'In Transit': {
      icon: Truck,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      badge: 'bg-purple-100 text-purple-800',
      label: 'In Transit'
    },
    'Customs Clearance': {
      icon: FileText,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      badge: 'bg-orange-100 text-orange-800',
      label: 'Customs'
    },
    'Out for Delivery': {
      icon: TrendingUp,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      badge: 'bg-cyan-100 text-cyan-800',
      label: 'Out for Delivery'
    },
    'Delivered': {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      badge: 'bg-green-100 text-green-800',
      label: 'Delivered'
    },
    'Delayed': {
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-800',
      label: 'Delayed'
    },
    'Failed Delivery': {
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-800',
      label: 'Failed'
    }
  };

  const shippingMethodIcons = {
    'Air': Plane,
    'Sea': Ship,
    'Land': Truck,
    'Express': Plane,
    'Standard': Truck
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  useEffect(() => {
    filterShipments();
  }, [shipments, statusFilter, searchQuery]);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const response = await apiconnector(
        'GET',
        dashboardEndpoints.GET_SHIPMENTS_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.success) {
        const shipmentsData = response.data.data || [];
        setShipments(shipmentsData);
        calculateStats(shipmentsData);
      }
    } catch (error) {
      console.error('Error fetching shipments:', error);
      toast.error('Failed to load shipments');
      // Mock data for demo
      const mockShipments = generateMockShipments();
      setShipments(mockShipments);
      calculateStats(mockShipments);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (shipmentsData) => {
    const stats = {
      total: shipmentsData.length,
      pendingPickup: shipmentsData.filter(s => s.status === 'Pending Pickup').length,
      inTransit: shipmentsData.filter(s => s.status === 'In Transit').length,
      delivered: shipmentsData.filter(s => s.status === 'Delivered').length,
      delayed: shipmentsData.filter(s => s.status === 'Delayed').length
    };
    setStats(stats);
  };

  const filterShipments = () => {
    let filtered = [...shipments];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(shipment => shipment.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(shipment =>
        shipment.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.carrier?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.destination?.city?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredShipments(filtered);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generateMockShipments = () => {
    return [
      {
        _id: '1',
        trackingNumber: 'DHL-2026-000001',
        order: { _id: 'ord1', orderNumber: 'ORD-2026-00001' },
        carrier: { name: 'DHL Express', contactNumber: '+1-800-225-5345' },
        status: 'In Transit',
        shippingMethod: 'Air',
        currentLocation: 'Hong Kong International Airport',
        origin: {
          city: 'Shanghai',
          country: 'China',
          address: '123 Factory Road'
        },
        destination: {
          city: 'New York',
          country: 'USA',
          address: '456 Business Ave'
        },
        packageInfo: {
          weight: { value: 25, unit: 'kg' },
          numberOfPackages: 2,
          packageType: 'Box'
        },
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        shippingCost: 250,
        timeline: [
          { status: 'Picked Up', description: 'Package picked up', location: 'Shanghai', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), isCompleted: true },
          { status: 'In Transit', description: 'In transit to destination', location: 'Hong Kong', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), isCompleted: true },
          { status: 'Out for Delivery', description: 'Pending', location: '', timestamp: null, isCompleted: false }
        ],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];
  };

  const handleViewDetails = (shipment) => {
    setSelectedShipment(shipment);
    setShowDetails(true);
  };

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Shipment Tracking
          </h1>
          <p className="text-gray-600 mt-1">Monitor and track all your shipments</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Shipments"
          value={stats.total}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Pending Pickup"
          value={stats.pendingPickup}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="In Transit"
          value={stats.inTransit}
          icon={Truck}
          color="purple"
        />
        <StatCard
          title="Delivered"
          value={stats.delivered}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Delayed"
          value={stats.delayed}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by tracking number, carrier, or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="lg:w-64 relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="Pending Pickup">Pending Pickup</option>
              <option value="In Transit">In Transit</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Delayed">Delayed</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Shipments List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      ) : filteredShipments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Shipments Found</h3>
          <p className="text-gray-600">No shipments match your current filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredShipments.map((shipment) => (
            <ShipmentCard
              key={shipment._id}
              shipment={shipment}
              config={statusConfig[shipment.status] || statusConfig['In Transit']}
              formatDate={formatDate}
              shippingMethodIcons={shippingMethodIcons}
              onViewDetails={() => handleViewDetails(shipment)}
            />
          ))}
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedShipment && (
        <ShipmentDetailsModal
          shipment={selectedShipment}
          onClose={() => {
            setShowDetails(false);
            setSelectedShipment(null);
          }}
          config={statusConfig[selectedShipment.status] || statusConfig['In Transit']}
          formatDate={formatDate}
          formatDateTime={formatDateTime}
          shippingMethodIcons={shippingMethodIcons}
        />
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/30',
    yellow: 'from-yellow-500 to-yellow-600 shadow-yellow-500/30',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/30',
    green: 'from-green-500 to-green-600 shadow-green-500/30',
    red: 'from-red-500 to-red-600 shadow-red-500/30'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}>
      <div className="flex items-center justify-between mb-3">
        <div className="p-2.5 bg-white/20 rounded-lg backdrop-blur-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-right">
          <p className="text-3xl font-black group-hover:scale-110 transition-transform duration-300">
            {value}
          </p>
        </div>
      </div>
      <h3 className="text-sm font-semibold opacity-90">{title}</h3>
    </div>
  );
};

// Shipment Card Component
const ShipmentCard = ({ shipment, config, formatDate, shippingMethodIcons, onViewDetails }) => {
  const StatusIcon = config.icon;
  const MethodIcon = shippingMethodIcons[shipment.shippingMethod] || Truck;
  
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-teal-600" />
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors duration-200">
                {shipment.trackingNumber}
              </h3>
            </div>
            <p className="text-sm text-gray-600 flex items-center gap-1.5">
              <Box className="w-4 h-4" />
              {shipment.carrier?.name}
            </p>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${config.badge} flex items-center gap-1.5`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {config.label}
          </span>
        </div>

        {/* Route */}
        <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-600 mb-1">From</p>
              <p className="font-semibold text-gray-900 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-teal-600" />
                {shipment.origin?.city}
              </p>
              <p className="text-xs text-gray-600">{shipment.origin?.country}</p>
            </div>
            <div className="flex items-center gap-2 px-3">
              <ArrowRight className="w-5 h-5 text-teal-600 animate-pulse" />
              <MethodIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1 text-right">
              <p className="text-xs text-gray-600 mb-1">To</p>
              <p className="font-semibold text-gray-900 flex items-center justify-end gap-1">
                {shipment.destination?.city}
                <MapPin className="w-4 h-4 text-red-600" />
              </p>
              <p className="text-xs text-gray-600">{shipment.destination?.country}</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2.5 mb-4">
          {shipment.currentLocation && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                Current Location
              </span>
              <span className="font-medium text-gray-900">{shipment.currentLocation}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Est. Delivery
            </span>
            <span className="font-semibold text-gray-900">{formatDate(shipment.estimatedDelivery)}</span>
          </div>

          {shipment.packageInfo && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-1.5">
                <Package className="w-4 h-4" />
                Packages
              </span>
              <span className="font-medium text-gray-900">
                {shipment.packageInfo.numberOfPackages} x {shipment.packageInfo.weight?.value}{shipment.packageInfo.weight?.unit}
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {shipment.timeline && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600 font-medium">Progress</span>
              <span className="text-xs font-semibold text-teal-600">
                {Math.round((shipment.timeline.filter(t => t.isCompleted).length / shipment.timeline.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-teal-600 h-full rounded-full transition-all duration-500 shadow-md"
                style={{
                  width: `${(shipment.timeline.filter(t => t.isCompleted).length / shipment.timeline.length) * 100}%`
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onViewDetails}
          className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Track Shipment
        </button>
      </div>
    </div>
  );
};

// Shipment Details Modal Component
const ShipmentDetailsModal = ({ shipment, onClose, config, formatDate, formatDateTime, shippingMethodIcons }) => {
  const StatusIcon = config.icon;
  const MethodIcon = shippingMethodIcons[shipment.shippingMethod] || Truck;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className={`${config.bg} border-b ${config.border} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2.5 ${config.bg} ${config.border} border-2 rounded-lg`}>
                  <StatusIcon className={`w-6 h-6 ${config.color}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">
                    {shipment.trackingNumber}
                  </h2>
                  <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
                    <Box className="w-4 h-4" />
                    {shipment.carrier?.name}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${config.badge} flex items-center gap-2`}>
                <StatusIcon className="w-4 h-4" />
                {config.label}
              </span>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <XCircle className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] scrollbar-hide">
          <div className="p-6 space-y-6">
            {/* Route Information */}
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6 border border-teal-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MethodIcon className="w-5 h-5 text-teal-600" />
                Shipment Route
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium mb-2">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    Origin
                  </div>
                  {shipment.origin?.name && (
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">{shipment.origin.name}</p>
                        {shipment.origin.company && (
                          <p className="text-sm text-gray-600">{shipment.origin.company}</p>
                        )}
                      </div>
                    </div>
                  )}
                  <p className="text-gray-900">{shipment.origin?.address}</p>
                  <p className="text-gray-900">
                    {shipment.origin?.city}, {shipment.origin?.state && `${shipment.origin.state}, `}
                    {shipment.origin?.country}
                  </p>
                  {shipment.origin?.zipCode && (
                    <p className="text-gray-600 text-sm">{shipment.origin.zipCode}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium mb-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    Destination
                  </div>
                  {shipment.destination?.name && (
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">{shipment.destination.name}</p>
                        {shipment.destination.company && (
                          <p className="text-sm text-gray-600">{shipment.destination.company}</p>
                        )}
                      </div>
                    </div>
                  )}
                  <p className="text-gray-900">{shipment.destination?.address}</p>
                  <p className="text-gray-900">
                    {shipment.destination?.city}, {shipment.destination?.state && `${shipment.destination.state}, `}
                    {shipment.destination?.country}
                  </p>
                  {shipment.destination?.zipCode && (
                    <p className="text-gray-600 text-sm">{shipment.destination.zipCode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Package Information */}
            {shipment.packageInfo && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-teal-600" />
                  Package Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Weight</p>
                    <p className="font-semibold text-gray-900">
                      {shipment.packageInfo.weight?.value} {shipment.packageInfo.weight?.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Packages</p>
                    <p className="font-semibold text-gray-900">{shipment.packageInfo.numberOfPackages}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Type</p>
                    <p className="font-semibold text-gray-900">{shipment.packageInfo.packageType}</p>
                  </div>
                  {shipment.packageInfo.dimensions && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Dimensions</p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {shipment.packageInfo.dimensions.length} x {shipment.packageInfo.dimensions.width} x {shipment.packageInfo.dimensions.height} {shipment.packageInfo.dimensions.unit}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tracking Timeline */}
            {shipment.timeline && shipment.timeline.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-600" />
                  Tracking History
                </h3>
                <div className="space-y-4">
                  {shipment.timeline.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          event.isCompleted ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {event.isCompleted ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Clock className="w-5 h-5" />
                          )}
                        </div>
                        {index < shipment.timeline.length - 1 && (
                          <div className={`w-0.5 h-12 ${event.isCompleted ? 'bg-teal-200' : 'bg-gray-200'}`} />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <p className={`font-semibold ${event.isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                          {event.status}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        {event.location && (
                          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {event.location}
                          </p>
                        )}
                        {event.timestamp && (
                          <p className="text-xs text-gray-400 mt-1">{formatDateTime(event.timestamp)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Shipping Method</p>
                <p className="font-semibold text-gray-900 flex items-center gap-2">
                  <MethodIcon className="w-4 h-4" />
                  {shipment.shippingMethod}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Shipping Cost</p>
                <p className="font-semibold text-gray-900">${shipment.shippingCost}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
                <p className="font-semibold text-gray-900">{formatDate(shipment.estimatedDelivery)}</p>
              </div>
              {shipment.actualDelivery && (
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <p className="text-sm text-green-600 mb-1">Delivered On</p>
                  <p className="font-semibold text-green-900">{formatDate(shipment.actualDelivery)}</p>
                </div>
              )}
            </div>

            {/* Carrier Contact */}
            {shipment.carrier?.contactNumber && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Carrier Contact</h3>
                <p className="text-blue-800 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {shipment.carrier.contactNumber}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardShipments;
