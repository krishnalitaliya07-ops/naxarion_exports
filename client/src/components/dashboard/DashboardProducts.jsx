import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Search,
  SlidersHorizontal,
  Grid3x3,
  List,
  Heart,
  Eye,
  ShoppingCart,
  Star,
  Loader2,
  Package,
  X,
  ChevronDown,
  TrendingUp,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { apiconnector } from '../../services/apiconnector';
import { productEndpoints } from '../../services/apis';

const DashboardProducts = () => {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('newest');
  const [minRating, setMinRating] = useState(0);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // Categories for filter
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'machinery', name: 'Machinery' },
    { id: 'textiles', name: 'Textiles' },
    { id: 'chemicals', name: 'Chemicals' },
    { id: 'automotive', name: 'Automotive' }
  ];

  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortBy, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        sort: getSortValue(sortBy)
      });

      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await apiconnector(
        'GET',
        `${productEndpoints.GET_ALL_PRODUCTS_API}?${params}`,
        null,
        token ? { Authorization: `Bearer ${token}` } : {}
      );

      if (response.data.success) {
        setProducts(response.data.data);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalProducts(response.data.pagination?.total || response.data.data.length);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      // Mock data for demo
      setProducts(generateMockProducts());
      setTotalPages(3);
      setTotalProducts(36);
    } finally {
      setLoading(false);
    }
  };

  const getSortValue = (sortOption) => {
    const sortMap = {
      'newest': '-createdAt',
      'oldest': 'createdAt',
      'price-low': 'price.min',
      'price-high': '-price.min',
      'popular': '-totalOrders',
      'rating': '-rating'
    };
    return sortMap[sortOption] || '-createdAt';
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts();
  };

  const handleAddToCart = (product) => {
    toast.success(`${product.name} added to cart!`);
  };

  const handleAddToFavorites = (product) => {
    toast.success(`${product.name} added to favorites!`);
    // Call API to add to favorites
    apiconnector(
      'POST',
      dashboardEndpoints.ADD_TO_FAVORITES_API(product._id),
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    ).catch(error => {
      console.error('Error adding to favorites:', error);
    });
  };

  const generateMockProducts = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      _id: `product-${i + 1}`,
      name: `Industrial Product ${i + 1}`,
      shortDescription: 'High-quality industrial component for manufacturing',
      price: { min: 100 + i * 50, max: 500 + i * 100, currency: 'USD' },
      moq: 10 + i * 5,
      images: [{ url: `https://via.placeholder.com/300?text=Product+${i + 1}` }],
      rating: 4 + Math.random(),
      totalReviews: Math.floor(Math.random() * 100),
      totalOrders: Math.floor(Math.random() * 500),
      supplier: { companyName: `Supplier ${i + 1}`, country: 'China' },
      category: { name: categories[Math.floor(Math.random() * (categories.length - 1)) + 1].name },
      badges: i % 3 === 0 ? ['Hot Deal'] : [],
      isFeatured: i % 4 === 0
    }));
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <Package className="w-8 h-8 text-teal-600" />
            Products Catalog
          </h1>
          <p className="text-gray-600 mt-1">
            Browse and discover quality industrial products
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-all duration-200 ${
              viewMode === 'grid'
                ? 'bg-white shadow-sm text-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-all duration-200 ${
              viewMode === 'list'
                ? 'bg-white shadow-sm text-teal-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
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
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative w-full lg:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative w-full lg:w-48">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors duration-200"
          >
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filters</span>
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (USD)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Min"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(+e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="0">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>

              {/* Apply Filters Button */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setCurrentPage(1);
                    fetchProducts();
                  }}
                  className="w-full px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Bar */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing <span className="font-semibold text-gray-900">{products.length}</span> of{' '}
          <span className="font-semibold text-gray-900">{totalProducts}</span> products
        </span>
        <span>Page {currentPage} of {totalPages}</span>
      </div>

      {/* Products Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
          <p className="text-gray-600">Try adjusting your filters or search criteria</p>
        </div>
      ) : (
        <>
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {products.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product}
                viewMode={viewMode}
                index={index}
                onAddToCart={handleAddToCart}
                onAddToFavorites={handleAddToFavorites}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-teal-600 text-white shadow-lg shadow-teal-200'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, viewMode, index, onAddToCart, onAddToFavorites }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  if (viewMode === 'list') {
    return (
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 animate-slideInLeft"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex gap-4">
          {/* Image */}
          <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={product.images?.[0]?.url || 'https://via.placeholder.com/200'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.shortDescription || product.description}
                </p>
                
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{product.rating?.toFixed(1) || '0.0'}</span>
                    <span>({product.totalReviews || 0})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{product.views || 0} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{product.totalOrders || 0} orders</span>
                  </div>
                </div>

                {/* Price and MOQ */}
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-2xl font-bold text-teal-600">
                      ${product.price?.min}
                    </span>
                    {product.price?.max > product.price?.min && (
                      <span className="text-sm text-gray-500">
                        {' '}- ${product.price?.max}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    MOQ: {product.moq} {product.unit || 'pcs'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onAddToFavorites(product)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isFavorite
                      ? 'bg-red-50 text-red-600'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => onAddToCart(product)}
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-300"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div
      className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 animate-fadeInUp"
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images?.[0]?.url || 'https://via.placeholder.com/300'}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        
        {/* Badges */}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {product.badges.map((badge, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {product.isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <div
          className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}
        >
          <button
            onClick={() => {
              setIsFavorite(!isFavorite);
              onAddToFavorites(product);
            }}
            className={`p-2 rounded-lg backdrop-blur-sm transition-all duration-200 ${
              isFavorite
                ? 'bg-red-500/90 text-white'
                : 'bg-white/90 hover:bg-white text-gray-700'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button className="p-2 bg-white/90 hover:bg-white rounded-lg backdrop-blur-sm text-gray-700 transition-colors duration-200">
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Overlay on Hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category and Supplier */}
        <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
          <span className="font-medium">{product.category?.name || 'Uncategorized'}</span>
          <span>{product.supplier?.country}</span>
        </div>

        {/* Product Name */}
        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating || 0)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating?.toFixed(1) || '0.0'}
          </span>
          <span className="text-xs text-gray-400">
            ({product.totalReviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-teal-600">
              ${product.price?.min}
            </span>
            {product.price?.max > product.price?.min && (
              <span className="text-sm text-gray-500">
                - ${product.price?.max}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            MOQ: {product.moq} {product.unit || 'pcs'}
          </span>
        </div>

        {/* Supplier Info */}
        <p className="text-xs text-gray-600 mb-3 truncate">
          by {product.supplier?.companyName}
        </p>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-300 flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardProducts;
