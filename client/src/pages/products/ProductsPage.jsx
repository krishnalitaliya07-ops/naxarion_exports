import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid3x3, List, Eye, Phone, Star, Building, CheckCircle, DollarSign, LayoutGrid, Globe, Box } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 }
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

// Reusable animated section wrapper
const AnimatedSection = ({ children, variants = fadeInUp, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

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
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8">
          <AnimatedSection className="text-center">
            <motion.div 
              className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full px-5 py-2 mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="font-bold text-xs uppercase tracking-wide">Our Products</p>
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-5xl font-black text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Explore Global <span className="bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">Products</span>
            </motion.h1>
            <motion.p 
              className="text-lg text-slate-300 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Browse through 500+ verified products from trusted suppliers worldwide
            </motion.p>
          </AnimatedSection>
        </div>
      </div>

      {/* Search Bar - Sticky */}
      <motion.div 
        className="bg-white py-6 sticky top-[60px] z-40 shadow-md border-b border-slate-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 items-center">
            
            {/* Mobile Filter Toggle */}
            <motion.button 
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter size={18} />
              Filters
            </motion.button>

            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search products, categories, suppliers..." 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-3 pl-12 pr-24 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <motion.button 
                  className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl active:shadow-md"
                >
                  Search
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

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
                <div className="mb-7 pb-7 border-b border-slate-200">
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
                  <div className="mt-5 pt-5 border-t border-slate-200">
                    <p className="text-xs text-slate-700 mb-4 font-semibold uppercase tracking-wider">Custom Range</p>
                    <div className="flex gap-2 items-center w-full">
                      <input 
                        type="number" 
                        placeholder="Min" 
                        className="w-1/3 bg-slate-50 border-2 border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder-slate-400"
                      />
                      <span className="text-slate-400 font-semibold text-center flex-shrink-0">-</span>
                      <input 
                        type="number" 
                        placeholder="Max" 
                        className="w-1/3 bg-slate-50 border-2 border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-7 pb-7 border-b border-slate-200">
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
                <div className="mb-7 pb-7 border-b border-slate-200">
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
                <div className="mb-7 pb-7 border-b border-slate-200">
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
              <motion.div 
                className="bg-white rounded-[20px] shadow-md p-4 mb-6 flex flex-wrap gap-4 items-center justify-between"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
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

                  {/* View Toggle - Single Button */}
                  <motion.button 
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl font-semibold text-sm transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        <Grid3x3 size={18} />
                        Grid View
                      </>
                    ) : (
                      <>
                        <List size={18} />
                        List View
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>

              {/* Active Filters */}
              <motion.div 
                className="flex flex-wrap gap-2 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {['Electronics', '$25 - $50', '4★ & above'].map((filter, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-emerald-100 transition-colors"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {filter}
                    <motion.button 
                      className="hover:text-emerald-900 transition-colors"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ×
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>

              {/* Products Grid */}
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                
                {products.map((product, index) => (
                  <AnimatedSection key={product.id} variants={scaleIn} delay={0.1 + index * 0.05} className="h-full">
                    <motion.div 
                      className="bg-white border-2 border-slate-200 rounded-[25px] overflow-hidden hover:border-emerald-500 hover:shadow-xl transition-all duration-500 group h-full"
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative h-48 bg-slate-100 overflow-hidden">
                        <motion.img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        />
                        {product.featured && (
                          <motion.div 
                            className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            Featured
                          </motion.div>
                        )}
                        {product.hotDeal && (
                          <motion.div 
                            className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            Hot Deal
                          </motion.div>
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
                          <motion.button 
                            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-2.5 rounded-xl font-bold text-xs hover:shadow-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-1"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Eye size={14} />
                            Details
                          </motion.button>
                          <motion.button 
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-2.5 rounded-xl font-bold text-xs hover:shadow-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-1"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Phone size={14} />
                            Contact
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatedSection>
                ))}

              </div>

              {/* Pagination */}
              <motion.div 
                className="mt-12 flex justify-center items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <motion.button 
                  className="w-10 h-10 bg-white border-2 border-slate-200 rounded-lg flex items-center justify-center hover:border-emerald-500 hover:text-emerald-600 transition-all font-bold"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ‹
                </motion.button>
                <motion.button 
                  className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-bold shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  1
                </motion.button>
                <motion.button 
                  className="w-10 h-10 bg-white border-2 border-slate-200 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-all font-bold"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  2
                </motion.button>
                <motion.button 
                  className="w-10 h-10 bg-white border-2 border-slate-200 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-all font-bold"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  3
                </motion.button>
                <span className="text-slate-400 font-bold">...</span>
                <motion.button 
                  className="w-10 h-10 bg-white border-2 border-slate-200 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-all font-bold"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  42
                </motion.button>
                <motion.button 
                  className="w-10 h-10 bg-white border-2 border-slate-200 rounded-lg flex items-center justify-center hover:border-emerald-500 hover:text-emerald-600 transition-all font-bold"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ›
                </motion.button>
              </motion.div>

            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductsPage;
