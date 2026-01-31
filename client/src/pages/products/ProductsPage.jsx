import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getAllProducts } from '../../services/operations/productAPI';
import { getAllCategories } from '../../services/operations/categoryAPI';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priceRange: '',
    minPrice: '',
    maxPrice: '',
    moqRange: '',
    supplierRating: '',
    country: '',
    page: 1,
    limit: 12
  });
  const [sortBy, setSortBy] = useState('latest');
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortBy]);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.country) params.country = filters.country;
      params.page = filters.page;
      params.limit = filters.limit;
      params.isApproved = 'approved'; // Only show approved products
      
      // Add sorting parameters
      if (sortBy === 'priceAsc') {
        params.sort = 'price.min';
      } else if (sortBy === 'priceDesc') {
        params.sort = '-price.min';
      } else if (sortBy === 'popular') {
        params.sort = '-views,-totalOrders';
      } else {
        params.sort = '-createdAt'; // Latest (default)
      }

      const response = await getAllProducts(params);
      if (response.success) {
        setProducts(response.data || []);
        setPagination({
          page: response.page,
          pages: response.pages,
          total: response.total
        });
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleFilterChange = (key, value) => {
    // Handle price range radio buttons
    if (key === 'priceRange') {
      const [min, max] = value.split('-');
      setFilters({ ...filters, priceRange: value, minPrice: min, maxPrice: max, page: 1 });
    } else {
      setFilters({ ...filters, [key]: value, page: 1 });
    }
  };

  const handleApplyFilters = () => {
    fetchProducts();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      priceRange: '',
      minPrice: '',
      maxPrice: '',
      moqRange: '',
      supplierRating: '',
      country: '',
      page: 1,
      limit: 12
    });
    setSortBy('latest');
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full px-5 py-2 mb-4">
              <p className="font-bold text-xs uppercase tracking-wide">Our Products</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Explore Global <span className="bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">Products</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Discover premium products from verified suppliers worldwide
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products by name, category, or supplier..."
                value={filters.search}
                onChange={handleSearch}
                className="w-full px-6 py-4 rounded-full text-slate-900 bg-white shadow-xl border-2 border-transparent focus:border-emerald-500 focus:outline-none pl-14 text-base"
              />
              <i className="fas fa-search absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <i className="fas fa-filter text-emerald-600"></i>
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
                >
                  Clear All
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <i className="fas fa-dollar-sign text-emerald-600"></i>
                  Price Range
                </h4>
                <div className="space-y-2">
                  {[
                    { label: 'Under $25', value: '0-25', count: 120 },
                    { label: '$25 - $50', value: '25-50', count: 185 },
                    { label: '$50 - $100', value: '50-100', count: 82 },
                    { label: 'Over $100', value: '100-999999', count: 43 }
                  ].map((range) => (
                    <label key={range.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="priceRange"
                        value={range.value}
                        checked={filters.priceRange === range.value}
                        onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900">{range.label}</span>
                      <span className="text-xs text-slate-400 ml-auto">({range.count})</span>
                    </label>
                  ))}
                </div>

                {/* Custom Range */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 mb-2">CUSTOM RANGE</p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-1/2 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-1/2 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <i className="fas fa-th-large text-emerald-600"></i>
                  Categories
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map((cat) => (
                    <label key={cat._id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.category === cat._id}
                        onChange={(e) => handleFilterChange('category', e.target.checked ? cat._id : '')}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900">{cat.name}</span>
                      <span className="text-xs text-slate-400 ml-auto">({cat.productCount || 0})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Supplier Rating */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <i className="fas fa-star text-emerald-600"></i>
                  Supplier Rating
                </h4>
                <div className="space-y-2">
                  {[
                    { label: '5 stars', value: '5', count: 45 },
                    { label: '4 & above', value: '4', count: 128 },
                    { label: '3 & above', value: '3', count: 238 }
                  ].map((rating) => (
                    <label key={rating.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="supplierRating"
                        value={rating.value}
                        checked={filters.supplierRating === rating.value}
                        onChange={(e) => handleFilterChange('supplierRating', e.target.value)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex items-center gap-1">
                        {[...Array(parseInt(rating.value))].map((_, i) => (
                          <i key={i} className="fas fa-star text-amber-400 text-xs"></i>
                        ))}
                      </div>
                      <span className="text-sm text-slate-600 group-hover:text-slate-900">{rating.label}</span>
                      <span className="text-xs text-slate-400 ml-auto">({rating.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Min Order Quantity */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <i className="fas fa-boxes text-emerald-600"></i>
                  Min Order Quantity
                </h4>
                <div className="space-y-2">
                  {[
                    { label: '1-100 Units', value: '1-100' },
                    { label: '100-500 Units', value: '100-500' },
                    { label: '500+ Units', value: '500-999999' }
                  ].map((moq) => (
                    <label key={moq.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="moqRange"
                        value={moq.value}
                        checked={filters.moqRange === moq.value}
                        onChange={(e) => handleFilterChange('moqRange', e.target.value)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900">{moq.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Country of Origin */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <i className="fas fa-globe text-emerald-600"></i>
                  Country of Origin
                </h4>
                <div className="space-y-2">
                  {[
                    { label: 'China', value: 'China', count: 234 },
                    { label: 'India', value: 'India', count: 158 },
                    { label: 'Vietnam', value: 'Vietnam', count: 49 },
                    { label: 'Turkey', value: 'Turkey', count: 67 }
                  ].map((country) => (
                    <label key={country.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.country === country.value}
                        onChange={(e) => handleFilterChange('country', e.target.checked ? country.value : '')}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900">{country.label}</span>
                      <span className="text-xs text-slate-400 ml-auto">({country.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Apply Filters Button */}
              <button
                onClick={handleApplyFilters}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-lg font-bold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="text-center py-12">
                <i className="fas fa-spinner fa-spin text-4xl text-emerald-600"></i>
                <p className="mt-4 text-slate-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
                <i className="fas fa-box-open text-6xl text-slate-300 mb-4"></i>
                <h3 className="text-xl font-bold text-slate-700 mb-2">No Products Found</h3>
                <p className="text-slate-500">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-slate-600">
                    Showing <span className="font-semibold text-slate-900">{products.length}</span> of{' '}
                    <span className="font-semibold text-slate-900">{pagination.total}</span> products
                  </p>
                  <select 
                    value={sortBy}
                    onChange={handleSortChange}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="latest">Sort by: Latest</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                      {/* Product Image */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                        <img
                          src={product.images[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.isFeatured && (
                            <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                              Featured
                            </span>
                          )}
                          {product.badges?.includes('Hot Deal') && (
                            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                              Hot Deal
                            </span>
                          )}
                          {product.stock < 10 && product.stock > 0 && (
                            <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                              Low Stock
                            </span>
                          )}
                        </div>

                        {/* MOQ Badge */}
                        <div className="absolute top-3 right-3">
                          <div className="bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-slate-200">
                            MOQ: {product.moq}
                          </div>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        {/* Category */}
                        <div className="mb-2">
                          <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1 rounded">
                            {product.category?.name || 'Uncategorized'}
                          </span>
                        </div>

                        {/* Product Name */}
                        <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 text-base">
                          {product.name}
                        </h3>

                        {/* Short Description */}
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                          {product.shortDescription || product.description}
                        </p>

                        {/* Supplier Info */}
                        {product.supplier && (
                          <div className="flex items-center gap-2 mb-3 p-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                              <i className="fas fa-building text-white text-xs"></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-900 truncate">{product.supplier.companyName}</p>
                              <div className="flex items-center gap-1">
                                <i className="fas fa-map-marker-alt text-emerald-600 text-[10px]"></i>
                                <p className="text-[10px] text-slate-600">{product.supplier.country} • Verified</p>
                                <i className="fas fa-check-circle text-emerald-600 text-[10px]"></i>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Rating (if available) */}
                        {product.rating > 0 && (
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <i
                                  key={i}
                                  className={`fas fa-star text-xs ${
                                    i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-300'
                                  }`}
                                ></i>
                              ))}
                            </div>
                            <span className="text-sm font-semibold text-slate-700">{product.rating}</span>
                            <span className="text-xs text-slate-500">({product.totalReviews})</span>
                          </div>
                        )}

                        {/* Price Range */}
                        <div className="mb-4">
                          <p className="text-xs text-slate-500 mb-1">PRICE RANGE</p>
                          <p className="text-xl font-black text-emerald-600">
                            ${product.price?.min}-{product.price?.max}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => navigate(`/products/${product._id}`)}
                            className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-2.5 rounded-lg font-semibold hover:from-indigo-600 hover:to-blue-700 transition-all shadow-md flex items-center justify-center gap-2"
                          >
                            <i className="fas fa-eye"></i>
                            <span>Details</span>
                          </button>
                          <button
                            onClick={() => toast.success('Contact feature coming soon!')}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2.5 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md flex items-center justify-center gap-2"
                          >
                            <i className="fas fa-phone"></i>
                            <span>Contact</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleFilterChange('page', Math.max(1, filters.page - 1))}
                      disabled={filters.page === 1}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    
                    {[...Array(pagination.pages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handleFilterChange('page', i + 1)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          filters.page === i + 1
                            ? 'bg-emerald-600 text-white'
                            : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handleFilterChange('page', Math.min(pagination.pages, filters.page + 1))}
                      disabled={filters.page === pagination.pages}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
