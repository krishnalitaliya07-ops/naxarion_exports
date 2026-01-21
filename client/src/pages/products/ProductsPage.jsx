import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid3x3, List, Eye, Phone, Star, Building, CheckCircle, DollarSign, LayoutGrid, Globe, Box } from 'lucide-react';

const ProductsPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const products = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      description: 'High-quality audio with noise cancellation technology',
      price: '$25-35',
      moq: 100,
      category: 'Electronics',
      categoryColor: 'amber',
      rating: 4.8,
      reviews: 234,
      supplier: 'TechSupply Co.',
      country: 'China',
      verified: true,
      featured: true,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&q=80'
    },
    {
      id: 2,
      name: 'Luxury Smartwatch',
      description: 'Advanced fitness tracking with GPS',
      price: '$45-65',
      moq: 500,
      category: 'Accessories',
      categoryColor: 'cyan',
      rating: 4.9,
      reviews: 156,
      supplier: 'SmartTech Ltd.',
      country: 'Taiwan',
      verified: true,
      featured: false,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop&q=80'
    },
    {
      id: 3,
      name: 'Premium Running Shoes',
      description: 'Professional grade athletic footwear',
      price: '$30-50',
      moq: 200,
      category: 'Footwear',
      categoryColor: 'purple',
      rating: 4.7,
      reviews: 89,
      supplier: 'SportGear Inc.',
      country: 'Vietnam',
      verified: true,
      hotDeal: true,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&q=80'
    },
    {
      id: 4,
      name: 'Designer Sunglasses',
      description: 'UV protection with premium frames',
      price: '$15-25',
      moq: 50,
      category: 'Fashion',
      categoryColor: 'pink',
      rating: 4.6,
      reviews: 145,
      supplier: 'Fashion Hub',
      country: 'India',
      verified: true,
      featured: false,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop&q=80'
    },
    {
      id: 5,
      name: 'Bluetooth Speaker',
      description: 'Portable waterproof wireless speaker',
      price: '$20-30',
      moq: 150,
      category: 'Electronics',
      categoryColor: 'amber',
      rating: 4.8,
      reviews: 312,
      supplier: 'SoundWave Co.',
      country: 'China',
      verified: true,
      featured: true,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop&q=80'
    },
    {
      id: 6,
      name: 'Leather Backpack',
      description: 'Premium leather with laptop compartment',
      price: '$35-55',
      moq: 100,
      category: 'Bags',
      categoryColor: 'orange',
      rating: 4.9,
      reviews: 98,
      supplier: 'LeatherCraft',
      country: 'Turkey',
      verified: true,
      featured: false,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop&q=80'
    }
  ];

  const getCategoryColorClass = (color) => {
    const colors = {
      amber: 'bg-amber-100 text-amber-700',
      cyan: 'bg-cyan-100 text-cyan-700',
      purple: 'bg-purple-100 text-purple-700',
      pink: 'bg-pink-100 text-pink-700',
      orange: 'bg-orange-100 text-orange-700'
    };
    return colors[color] || 'bg-slate-100 text-slate-700';
  };

  const getSupplierGradient = (categoryColor) => {
    const gradients = {
      amber: 'from-emerald-400 to-teal-600',
      cyan: 'from-cyan-400 to-blue-600',
      purple: 'from-purple-400 to-purple-600',
      pink: 'from-pink-400 to-rose-600',
      orange: 'from-orange-400 to-orange-600'
    };
    return gradients[categoryColor] || 'from-emerald-400 to-teal-600';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Page Header */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-fadeInUp">
            <div className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full px-5 py-2 mb-4">
              <p className="font-bold text-xs uppercase tracking-wide">Our Products</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Explore Global <span className="bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">Products</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">Browse through 500+ verified products from trusted suppliers worldwide</p>
          </div>
        </div>
      </div>

      {/* Search Bar - Sticky */}
      <div className="bg-white py-6 sticky top-[60px] z-40 shadow-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 items-center">
            
            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg"
            >
              <Filter size={18} />
              Filters
            </button>

            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search products, categories, suppliers..." 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-3.5 pl-12 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            
            {/* LEFT SIDEBAR - FILTERS */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-72 flex-shrink-0`}>
              <div className="bg-white rounded-[25px] shadow-lg p-6 sticky top-32">
                
                {/* Filter Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Filter className="text-emerald-500" size={20} />
                    Filters
                  </h3>
                  <button className="text-sm text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">Clear All</button>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <DollarSign className="text-emerald-500" size={16} />
                    Price Range
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Under $25', count: 120 },
                      { label: '$25 - $50', count: 85 },
                      { label: '$50 - $100', count: 92 },
                      { label: 'Over $100', count: 45 }
                    ].map((item, index) => (
                      <label key={index} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 text-emerald-500 rounded border-slate-300 focus:ring-emerald-500" />
                        <span className="text-sm text-slate-700 group-hover:text-emerald-600 transition-colors">{item.label}</span>
                        <span className="text-xs text-slate-400 ml-auto">({item.count})</span>
                      </label>
                    ))}
                  </div>
                  
                  {/* Custom Price Range */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-600 mb-3 font-semibold">Custom Range</p>
                    <div className="flex gap-2 items-center">
                      <input type="number" placeholder="Min" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500" />
                      <span className="text-slate-400">-</span>
                      <input type="number" placeholder="Max" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500" />
                    </div>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <LayoutGrid className="text-emerald-500" size={16} />
                    Categories
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Electronics', count: 156 },
                      { label: 'Textiles', count: 98 },
                      { label: 'Fashion', count: 124 },
                      { label: 'Home Decor', count: 67 },
                      { label: 'Machinery', count: 55 }
                    ].map((item, index) => (
                      <label key={index} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 text-emerald-500 rounded border-slate-300 focus:ring-emerald-500" />
                        <span className="text-sm text-slate-700 group-hover:text-emerald-600 transition-colors">{item.label}</span>
                        <span className="text-xs text-slate-400 ml-auto">({item.count})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Star className="text-emerald-500" size={16} />
                    Supplier Rating
                  </h4>
                  <div className="space-y-3">
                    {[
                      { stars: 5, count: 45 },
                      { stars: 4, count: 128 },
                      { stars: 3, count: 256 }
                    ].map((item, index) => (
                      <label key={index} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 text-emerald-500 rounded border-slate-300 focus:ring-emerald-500" />
                        <div className="flex items-center gap-1">
                          {[...Array(item.stars)].map((_, i) => (
                            <Star key={i} className="text-amber-400 fill-amber-400" size={12} />
                          ))}
                          {item.stars < 5 && [...Array(5 - item.stars)].map((_, i) => (
                            <Star key={i} className="text-slate-300" size={12} />
                          ))}
                          {item.stars < 5 && <span className="text-xs text-slate-600 ml-1">& above</span>}
                        </div>
                        <span className="text-xs text-slate-400 ml-auto">({item.count})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* MOQ Filter */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Box className="text-emerald-500" size={16} />
                    Min Order Quantity
                  </h4>
                  <div className="space-y-3">
                    {['1-100 Units', '100-500 Units', '500+ Units'].map((item, index) => (
                      <label key={index} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 text-emerald-500 rounded border-slate-300 focus:ring-emerald-500" />
                        <span className="text-sm text-slate-700 group-hover:text-emerald-600 transition-colors">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Country Filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Globe className="text-emerald-500" size={16} />
                    Country of Origin
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: 'China', count: 234 },
                      { label: 'India', count: 156 },
                      { label: 'Vietnam', count: 89 },
                      { label: 'Turkey', count: 67 }
                    ].map((item, index) => (
                      <label key={index} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 text-emerald-500 rounded border-slate-300 focus:ring-emerald-500" />
                        <span className="text-sm text-slate-700 group-hover:text-emerald-600 transition-colors">{item.label}</span>
                        <span className="text-xs text-slate-400 ml-auto">({item.count})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Apply Filter Button */}
                <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-bold text-sm hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                  Apply Filters
                </button>

              </div>
            </div>

            {/* RIGHT CONTENT - Products */}
            <div className="flex-1">
              
              {/* Sort & View Options */}
              <div className="bg-white rounded-[20px] shadow-md p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                  <p className="text-sm text-slate-600 font-semibold">
                    Showing <span className="text-emerald-600">1-{products.length}</span> of <span className="text-emerald-600">500+</span> products
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select className="bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-semibold text-slate-700 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer">
                      <option>Sort by: Relevance</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Rating: High to Low</option>
                      <option>Newest First</option>
                      <option>MOQ: Low to High</option>
                    </select>
                  </div>

                  {/* View Toggle */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`w-10 h-10 ${viewMode === 'grid' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' : 'bg-slate-100 text-slate-600'} rounded-lg flex items-center justify-center shadow-lg transition-all hover:scale-105`}
                    >
                      <Grid3x3 size={18} />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`w-10 h-10 ${viewMode === 'list' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' : 'bg-slate-100 text-slate-600'} rounded-lg flex items-center justify-center transition-all hover:scale-105`}
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['Electronics', '$25 - $50', '4★ & above'].map((filter, index) => (
                  <div key={index} className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-emerald-100 transition-colors">
                    {filter}
                    <button className="hover:text-emerald-900 transition-colors">×</button>
                  </div>
                ))}
              </div>

              {/* Products Grid */}
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                
                {products.map((product) => (
                  <div key={product.id} className="bg-white border-2 border-slate-200 rounded-[25px] overflow-hidden hover:border-emerald-500 hover:shadow-xl transition-all duration-500 group">
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.featured && (
                        <div className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          Featured
                        </div>
                      )}
                      {product.hotDeal && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          Hot Deal
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
                        MOQ: {product.moq}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`${getCategoryColorClass(product.categoryColor)} px-2.5 py-1 rounded-lg text-xs font-bold`}>
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 text-xs ml-auto">
                          <Star className="fill-amber-400" size={14} />
                          <span className="font-bold text-slate-900">{product.rating}</span>
                          <span className="text-slate-400">({product.reviews})</span>
                        </div>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-600 mb-4 line-clamp-2">{product.description}</p>
                      
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-200">
                        <div className={`w-8 h-8 bg-gradient-to-br ${getSupplierGradient(product.categoryColor)} rounded-lg flex items-center justify-center`}>
                          <Building className="text-white" size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-900">{product.supplier}</p>
                          <p className="text-[10px] text-slate-500">{product.country} • Verified</p>
                        </div>
                        {product.verified && <CheckCircle className="text-emerald-500" size={16} />}
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase font-semibold">Price Range</p>
                          <p className="text-xl font-black text-emerald-600">{product.price}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-2.5 rounded-xl font-bold text-xs hover:shadow-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-1">
                          <Eye size={14} />
                          Details
                        </button>
                        <button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-2.5 rounded-xl font-bold text-xs hover:shadow-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-1">
                          <Phone size={14} />
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              </div>

              {/* Pagination */}
              <div className="mt-12 flex justify-center items-center gap-2">
                <button className="w-10 h-10 bg-white border-2 border-slate-200 rounded-lg flex items-center justify-center hover:border-emerald-500 hover:text-emerald-600 transition-all font-bold">
                  ‹
                </button>
                <button className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-bold shadow-lg">
                  1
                </button>
                <button className="w-10 h-10 bg-white border-2 border-slate-200 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-all font-bold">
                  2
                </button>
                <button className="w-10 h-10 bg-white border-2 border-slate-200 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-all font-bold">
                  3
                </button>
                <span className="text-slate-400 font-bold">...</span>
                <button className="w-10 h-10 bg-white border-2 border-slate-200 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-all font-bold">
                  42
                </button>
                <button className="w-10 h-10 bg-white border-2 border-slate-200 rounded-lg flex items-center justify-center hover:border-emerald-500 hover:text-emerald-600 transition-all font-bold">
                  ›
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductsPage;
