import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Laptop, Shirt, Sofa, Cog, Scissors, Sprout, TestTube, Car, Sparkles, Dumbbell, Utensils, Package, ArrowRight, TrendingUp, Star, Zap, Building2, Pill, Palette, Camera, Watch, Phone } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

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

const CategoriesPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      id: 1,
      name: 'Electronics',
      description: 'Latest gadgets and devices',
      productCount: 2345,
      icon: Laptop,
      gradient: 'from-blue-500 to-blue-700',
      bgPattern: 'from-blue-500/10 to-blue-700/10',
      badge: { text: '🔥 Hot', color: 'bg-red-500/90' },
      trending: true
    },
    {
      id: 2,
      name: 'Fashion',
      description: 'Clothing and accessories',
      productCount: 1876,
      icon: Shirt,
      gradient: 'from-pink-500 to-rose-700',
      bgPattern: 'from-pink-500/10 to-rose-700/10',
      badge: { text: '⭐ Top', color: 'bg-yellow-500/90' },
      popular: true
    },
    {
      id: 3,
      name: 'Home & Living',
      description: 'Furniture and decor',
      productCount: 1432,
      icon: Sofa,
      gradient: 'from-amber-500 to-orange-700',
      bgPattern: 'from-amber-500/10 to-orange-700/10',
      badge: null
    },
    {
      id: 4,
      name: 'Machinery',
      description: 'Industrial equipment',
      productCount: 987,
      icon: Cog,
      gradient: 'from-slate-600 to-slate-800',
      bgPattern: 'from-slate-600/10 to-slate-800/10',
      badge: null
    },
    {
      id: 5,
      name: 'Textiles',
      description: 'Fabrics and materials',
      productCount: 2145,
      icon: Scissors,
      gradient: 'from-purple-500 to-purple-700',
      bgPattern: 'from-purple-500/10 to-purple-700/10',
      badge: { text: '📈 Trending', color: 'bg-purple-500/90' },
      trending: true
    },
    {
      id: 6,
      name: 'Agriculture',
      description: 'Farming equipment',
      productCount: 892,
      icon: Sprout,
      gradient: 'from-green-500 to-green-700',
      bgPattern: 'from-green-500/10 to-green-700/10',
      badge: null
    },
    {
      id: 7,
      name: 'Chemicals',
      description: 'Industrial chemicals',
      productCount: 1123,
      icon: TestTube,
      gradient: 'from-cyan-500 to-cyan-700',
      bgPattern: 'from-cyan-500/10 to-cyan-700/10',
      badge: null
    },
    {
      id: 8,
      name: 'Automotive',
      description: 'Vehicle parts & accessories',
      productCount: 1234,
      icon: Car,
      gradient: 'from-red-500 to-red-700',
      bgPattern: 'from-red-500/10 to-red-700/10',
      badge: null,
      popular: true
    },
    {
      id: 9,
      name: 'Beauty & Care',
      description: 'Cosmetics & skincare',
      productCount: 1567,
      icon: Sparkles,
      gradient: 'from-fuchsia-500 to-fuchsia-700',
      bgPattern: 'from-fuchsia-500/10 to-fuchsia-700/10',
      badge: { text: '✨ New', color: 'bg-fuchsia-500/90' },
      new: true
    },
    {
      id: 10,
      name: 'Sports & Fitness',
      description: 'Athletic equipment',
      productCount: 892,
      icon: Dumbbell,
      gradient: 'from-indigo-500 to-indigo-700',
      bgPattern: 'from-indigo-500/10 to-indigo-700/10',
      badge: null
    },
    {
      id: 11,
      name: 'Food & Beverage',
      description: 'Processed foods',
      productCount: 1123,
      icon: Utensils,
      gradient: 'from-yellow-500 to-yellow-700',
      bgPattern: 'from-yellow-500/10 to-yellow-700/10',
      badge: null
    },
    {
      id: 12,
      name: 'Packaging',
      description: 'Boxes & containers',
      productCount: 765,
      icon: Package,
      gradient: 'from-teal-500 to-teal-700',
      bgPattern: 'from-teal-500/10 to-teal-700/10',
      badge: null
    },
    {
      id: 13,
      name: 'Construction',
      description: 'Building materials',
      productCount: 1654,
      icon: Building2,
      gradient: 'from-orange-500 to-orange-700',
      bgPattern: 'from-orange-500/10 to-orange-700/10',
      badge: null
    },
    {
      id: 14,
      name: 'Healthcare',
      description: 'Medical supplies',
      productCount: 987,
      icon: Pill,
      gradient: 'from-emerald-500 to-emerald-700',
      bgPattern: 'from-emerald-500/10 to-emerald-700/10',
      badge: null
    },
    {
      id: 15,
      name: 'Art & Craft',
      description: 'Creative supplies',
      productCount: 543,
      icon: Palette,
      gradient: 'from-violet-500 to-violet-700',
      bgPattern: 'from-violet-500/10 to-violet-700/10',
      badge: null
    },
    {
      id: 16,
      name: 'Photography',
      description: 'Camera & studio gear',
      productCount: 432,
      icon: Camera,
      gradient: 'from-slate-500 to-slate-700',
      bgPattern: 'from-slate-500/10 to-slate-700/10',
      badge: null
    },
    {
      id: 17,
      name: 'Watches & Jewelry',
      description: 'Timepieces & accessories',
      productCount: 876,
      icon: Watch,
      gradient: 'from-amber-600 to-yellow-700',
      bgPattern: 'from-amber-600/10 to-yellow-700/10',
      badge: null,
      popular: true
    },
    {
      id: 18,
      name: 'Mobile Accessories',
      description: 'Phone cases & gadgets',
      productCount: 1987,
      icon: Phone,
      gradient: 'from-sky-500 to-sky-700',
      bgPattern: 'from-sky-500/10 to-sky-700/10',
      badge: { text: '🔥 Hot', color: 'bg-red-500/90' },
      trending: true
    }
  ];

  const filters = [
    { id: 'all', label: 'All Categories' },
    { id: 'popular', label: 'Most Popular' },
    { id: 'trending', label: 'Trending' },
    { id: 'new', label: 'New Arrivals' }
  ];

  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      activeFilter === 'all' ||
      (activeFilter === 'popular' && cat.popular) ||
      (activeFilter === 'trending' && cat.trending) ||
      (activeFilter === 'new' && cat.new);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 relative">
      {/* Subtle Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)' }}></div>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 pt-20 pb-8 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection variants={scaleIn} className="text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-500 rounded-full px-3 py-1 mb-3">
              <Zap className="w-3 h-3 text-white" />
              <span className="text-white font-bold text-xs">BROWSE CATEGORIES</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
              Product <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Categories</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">Discover products organized by industry-leading categories</p>
          </AnimatedSection>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header with Search and Results Count */}
          <AnimatedSection variants={fadeInUp} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/50">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {activeFilter === 'all' ? 'All Categories' : filters.find(f => f.id === activeFilter)?.label}
              </h2>
              <p className="text-slate-600 text-sm mt-1">Showing {filteredCategories.length} categories</p>
            </div>
            
            {/* Search Bar - Right Side */}
            <div className="lg:w-96">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search categories..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg px-10 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </AnimatedSection>

          {/* Filter Tabs - Left Aligned */}
          <AnimatedSection variants={slideInLeft} className="flex flex-wrap gap-2 mb-6 bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/50">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:shadow-md hover:scale-105'
                } px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform`}
              >
                {filter.label}
              </button>
            ))}
          </AnimatedSection>

          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div 
              className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-xl p-4 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group cursor-pointer ring-4 ring-emerald-500/10"
              variants={fadeInUp}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-2xl font-black mb-1">18+</div>
                <div className="text-xs font-semibold text-white/80">Total Categories</div>
              </div>
            </motion.div>
            <motion.div 
              className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-xl p-4 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group cursor-pointer ring-4 ring-amber-500/10"
              variants={fadeInUp}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-2xl font-black mb-1">22.9K+</div>
                <div className="text-xs font-semibold text-white/80">Products Available</div>
              </div>
            </motion.div>
            <motion.div 
              className="bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 rounded-xl p-4 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group cursor-pointer ring-4 ring-cyan-500/10"
              variants={fadeInUp}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-2xl font-black mb-1">150+</div>
                <div className="text-xs font-semibold text-white/80">Countries Served</div>
              </div>
            </motion.div>
            <motion.div 
              className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-xl p-4 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group cursor-pointer ring-4 ring-purple-500/10"
              variants={fadeInUp}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-2xl font-black mb-1">500+</div>
                <div className="text-xs font-semibold text-white/80">Trusted Suppliers</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Grid */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {filteredCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <motion.div
                  key={category.id}
                  variants={fadeInUp}
                >
                  <Link
                    to="/products"
                    className="group block bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-2xl shadow-lg transition-all duration-500 overflow-hidden transform hover:-translate-y-2 hover:ring-4 hover:ring-emerald-500/10"
                  >
                    {/* Card Header with Gradient */}
                    <div className={`bg-gradient-to-br ${category.gradient} p-4 relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {category.badge && (
                        <div className={`absolute top-2 right-2 ${category.badge.color} backdrop-blur-sm px-2 py-0.5 rounded-md`}>
                          <span className="text-white text-[9px] font-bold">{category.badge.text}</span>
                        </div>
                      )}
                      
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="text-white" size={20} />
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4">
                      <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs text-slate-600 mb-4">{category.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">
                          {category.productCount.toLocaleString()} Products
                        </span>
                        <ArrowRight className="text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" size={16} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {filteredCategories.length === 0 && (
            <AnimatedSection variants={scaleIn} className="text-center py-16">
              <div className="text-slate-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No categories found</h3>
              <p className="text-slate-600">Try adjusting your search or filters</p>
            </AnimatedSection>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <AnimatedSection variants={fadeInUp} className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-sm text-white/90 mb-6 max-w-2xl mx-auto">
            Contact our team and we'll help you find the perfect products from our global supplier network
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="bg-white text-emerald-600 px-5 py-2 rounded-lg font-bold text-sm hover:bg-slate-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center gap-2"
            >
              <Search size={16} />
              Request Custom Category
            </Link>
            <Link
              to="/products"
              className="bg-white/10 backdrop-blur-md border-2 border-white text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-white/20 transition-all inline-flex items-center gap-2 transform hover:scale-105"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </AnimatedSection>

    </div>
  );
};

export default CategoriesPage;
