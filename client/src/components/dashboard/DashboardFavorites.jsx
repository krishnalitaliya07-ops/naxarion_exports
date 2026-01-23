import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Heart, 
  Loader2, 
  ShoppingCart, 
  Star, 
  Trash2, 
  Eye, 
  Package, 
  Search,
  Filter,
  ChevronDown,
  TrendingUp,
  DollarSign,
  Box,
  Grid,
  List,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { apiconnector } from '../../services/apiconnector';
import { dashboardEndpoints } from '../../services/apis';

const DashboardFavorites = () => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('recent'); // recent, price-low, price-high, name
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    filterAndSortFavorites();
  }, [favorites, searchQuery, categoryFilter, sortBy]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await apiconnector(
        'GET',
        dashboardEndpoints.GET_FAVORITES_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.success) {
        setFavorites(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortFavorites = () => {
    let filtered = [...favorites];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.supplier?.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => 
        product.category?.name?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.price?.min || 0) - (b.price?.min || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price?.min || 0) - (a.price?.min || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default: // recent
        // Already in reverse chronological order from API
        break;
    }

    setFilteredFavorites(filtered);
  };

  const handleRemoveFromFavorites = async (productId, productName) => {
    try {
      const response = await apiconnector(
        'DELETE',
        dashboardEndpoints.REMOVE_FROM_FAVORITES_API(productId),
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.success) {
        setFavorites(favorites.filter(product => product._id !== productId));
        toast.success(`${productName} removed from favorites`);
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  const handleAddToCart = (product) => {
    toast.success(`${product.name} added to cart!`);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const getCategories = () => {
    const categories = new Set(favorites.map(p => p.category?.name).filter(Boolean));
    return Array.from(categories);
  };

  const getTotalValue = () => {
    return favorites.reduce((sum, product) => sum + (product.price?.min || 0), 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
            <Heart className="w-8 h-8 text-red-500 fill-red-500 animate-pulse-slow" />
            My Favorites
          </h1>
          <p className="text-gray-600 mt-1">
            {favorites.length} {favorites.length === 1 ? 'product' : 'products'} in your wishlist
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {favorites.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Products"
            value={favorites.length}
            icon={Package}
            color="blue"
          />
          <StatCard
            title="Categories"
            value={getCategories().length}
            icon={Grid}
            color="purple"
          />
          <StatCard
            title="Total Value"
            value={`$${getTotalValue().toLocaleString()}`}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Avg. Rating"
            value={(favorites.reduce((sum, p) => sum + (p.rating || 0), 0) / favorites.length).toFixed(1)}
            icon={Star}
            color="yellow"
          />
        </div>
      )}

      {/* Search, Filters, and View Controls */}
      {favorites.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, categories, or suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="lg:w-48 relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Categories</option>
                {getCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="lg:w-48 relative">
              <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              >
                <option value="recent">Recently Added</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg border transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-teal-50 border-teal-500 text-teal-600'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-lg border transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-teal-50 border-teal-500 text-teal-600'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Favorites Display */}
      {filteredFavorites.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {favorites.length === 0 ? 'No Favorites Yet' : 'No Products Found'}
          </h3>
          <p className="text-gray-600">
            {favorites.length === 0 
              ? 'Start adding products to your favorites!' 
              : 'Try adjusting your filters or search query'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFavorites.map((product, index) => (
            <ProductCard
              key={product._id}
              product={product}
              index={index}
              onRemove={handleRemoveFromFavorites}
              onAddToCart={handleAddToCart}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFavorites.map((product, index) => (
            <ProductListItem
              key={product._id}
              product={product}
              index={index}
              onRemove={handleRemoveFromFavorites}
              onAddToCart={handleAddToCart}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Product Details Modal */}
      {showDetails && selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => {
            setShowDetails(false);
            setSelectedProduct(null);
          }}
          onRemove={handleRemoveFromFavorites}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/30',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/30',
    green: 'from-green-500 to-green-600 shadow-green-500/30',
    yellow: 'from-yellow-500 to-yellow-600 shadow-yellow-500/30'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}>
      <div className="flex items-center justify-between mb-3">
        <div className="p-2.5 bg-white/20 rounded-lg backdrop-blur-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-black group-hover:scale-110 transition-transform duration-300">
            {value}
          </p>
        </div>
      </div>
      <h3 className="text-sm font-semibold opacity-90">{title}</h3>
    </div>
  );
};

// Product Card Component (Grid View)
const ProductCard = ({ product, index, onRemove, onAddToCart, onViewDetails }) => {
  return (
    <div
      className="group bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fadeInUp"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Remove Button */}
        <button
          onClick={() => onRemove(product._id, product.name)}
          className="absolute top-3 right-3 p-2.5 bg-white/90 hover:bg-red-50 rounded-lg backdrop-blur-sm text-red-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
          title="Remove from favorites"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        {/* Stock Badge */}
        {product.stock !== undefined && (
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg ${
              product.stock > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="text-xs text-teal-600 font-semibold mb-2 uppercase tracking-wide">
          {product.category?.name || 'Uncategorized'}
        </div>

        {/* Product Name */}
        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-teal-600 transition-colors duration-200">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating || 0)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-700">
            {product.rating?.toFixed(1) || '0.0'}
          </span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-teal-600">
              ${product.price?.min}
            </span>
            {product.price?.max && product.price.max > product.price.min && (
              <span className="text-sm text-gray-500 font-semibold">
                - ${product.price.max}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-600 font-medium">
            MOQ: {product.moq} {product.unit || 'pcs'}
          </span>
        </div>

        {/* Supplier */}
        {product.supplier?.companyName && (
          <p className="text-xs text-gray-600 mb-4 truncate flex items-center gap-1">
            <Box className="w-3 h-3" />
            by {product.supplier.companyName}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onAddToCart(product)}
            className="flex-1 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-300 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
          <button 
            onClick={() => onViewDetails(product)}
            className="p-2.5 border-2 border-gray-300 hover:border-teal-500 hover:bg-teal-50 rounded-lg transition-all duration-200 group/btn"
          >
            <Eye className="w-4 h-4 text-gray-600 group-hover/btn:text-teal-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Product List Item Component (List View)
const ProductListItem = ({ product, index, onRemove, onAddToCart, onViewDetails }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-md border border-gray-200 p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 animate-fadeInUp"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex gap-4">
        {/* Image */}
        <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={product.images?.[0]?.url || 'https://via.placeholder.com/200'}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-teal-600 font-semibold mb-1 uppercase tracking-wide">
                {product.category?.name || 'Uncategorized'}
              </div>
              <h3 className="text-lg font-bold text-gray-900 truncate hover:text-teal-600 transition-colors duration-200">
                {product.name}
              </h3>
            </div>
            <button
              onClick={() => onRemove(product._id, product.name)}
              className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-all duration-200"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-3">
            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {product.rating?.toFixed(1) || '0.0'}
              </span>
            </div>

            {/* Supplier */}
            {product.supplier?.companyName && (
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Box className="w-4 h-4" />
                {product.supplier.companyName}
              </p>
            )}

            {/* MOQ */}
            <span className="text-sm text-gray-600">
              MOQ: {product.moq} {product.unit || 'pcs'}
            </span>
          </div>

          {/* Price and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-teal-600">
                ${product.price?.min}
              </span>
              {product.price?.max && product.price.max > product.price.min && (
                <span className="text-sm text-gray-500 font-semibold">
                  - ${product.price.max}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onAddToCart(product)}
                className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-300 flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
              <button 
                onClick={() => onViewDetails(product)}
                className="px-4 py-2 border-2 border-gray-300 hover:border-teal-500 hover:bg-teal-50 rounded-lg transition-all duration-200 flex items-center gap-2 group"
              >
                <Eye className="w-4 h-4 text-gray-600 group-hover:text-teal-600" />
                <span className="text-gray-700 group-hover:text-teal-600 font-semibold">View</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Details Modal Component
const ProductDetailsModal = ({ product, onClose, onRemove, onAddToCart }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-100 rounded-lg">
                <Package className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">{product.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{product.category?.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] scrollbar-hide p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img
                  src={product.images?.[0]?.url || 'https://via.placeholder.com/500'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img src={img.url} alt={`${product.name} ${idx + 2}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              {/* Price */}
              <div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-black text-teal-600">
                    ${product.price?.min}
                  </span>
                  {product.price?.max && product.price.max > product.price.min && (
                    <span className="text-xl text-gray-500 font-semibold">
                      - ${product.price.max}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  MOQ: <span className="font-semibold">{product.moq} {product.unit || 'pcs'}</span>
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {product.rating?.toFixed(1) || '0.0'}
                </span>
                <span className="text-gray-600">({product.reviewCount || 0} reviews)</span>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Supplier */}
              {product.supplier && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Supplier</h3>
                  <p className="font-bold text-gray-900">{product.supplier.companyName}</p>
                  {product.supplier.country && (
                    <p className="text-sm text-gray-600 mt-1">{product.supplier.country}</p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg font-bold transition-all duration-200 shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-300 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={() => {
                    onRemove(product._id, product.name);
                    onClose();
                  }}
                  className="w-full py-3 border-2 border-red-300 hover:bg-red-50 text-red-600 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Remove from Favorites</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFavorites;
