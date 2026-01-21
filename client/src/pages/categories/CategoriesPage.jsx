import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Laptop, Shirt, Sofa, Cog, Scissors, Sprout, TestTube, Car, Sparkles, Dumbbell, Utensils, Package, ArrowRight } from 'lucide-react';

const CategoriesPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const categories = [
    {
      id: 1,
      name: 'Electronics',
      description: 'Latest gadgets and devices',
      productCount: 2345,
      icon: Laptop,
      gradient: 'from-blue-500 to-blue-700',
      badge: { text: '🔥 Hot', color: 'bg-white/20' }
    },
    {
      id: 2,
      name: 'Fashion',
      description: 'Clothing and accessories',
      productCount: 1876,
      icon: Shirt,
      gradient: 'from-pink-500 to-rose-700',
      badge: { text: '⭐ Top', color: 'bg-white/20' }
    },
    {
      id: 3,
      name: 'Home & Living',
      description: 'Furniture and decor',
      productCount: 1432,
      icon: Sofa,
      gradient: 'from-amber-500 to-orange-700',
      badge: null
    },
    {
      id: 4,
      name: 'Machinery',
      description: 'Industrial equipment',
      productCount: 987,
      icon: Cog,
      gradient: 'from-slate-600 to-slate-800',
      badge: null
    },
    {
      id: 5,
      name: 'Textiles',
      description: 'Fabrics and materials',
      productCount: 2145,
      icon: Scissors,
      gradient: 'from-purple-500 to-purple-700',
      badge: { text: '📈 Trending', color: 'bg-white/20' }
    },
    {
      id: 6,
      name: 'Agriculture',
      description: 'Farming equipment',
      productCount: 756,
      icon: Sprout,
      gradient: 'from-green-500 to-green-700',
      badge: null
    },
    {
      id: 7,
      name: 'Chemicals',
      description: 'Industrial chemicals',
      productCount: 654,
      icon: TestTube,
      gradient: 'from-cyan-500 to-cyan-700',
      badge: null
    },
    {
      id: 8,
      name: 'Automotive',
      description: 'Vehicle parts & accessories',
      productCount: 1234,
      icon: Car,
      gradient: 'from-red-500 to-red-700',
      badge: null
    },
    {
      id: 9,
      name: 'Beauty & Care',
      description: 'Cosmetics & skincare',
      productCount: 1567,
      icon: Sparkles,
      gradient: 'from-fuchsia-500 to-fuchsia-700',
      badge: null
    },
    {
      id: 10,
      name: 'Sports & Fitness',
      description: 'Athletic equipment',
      productCount: 892,
      icon: Dumbbell,
      gradient: 'from-indigo-500 to-indigo-700',
      badge: null
    },
    {
      id: 11,
      name: 'Food & Beverage',
      description: 'Processed foods',
      productCount: 1123,
      icon: Utensils,
      gradient: 'from-yellow-500 to-yellow-700',
      badge: { text: '✨ New', color: 'bg-white/20' }
    },
    {
      id: 12,
      name: 'Packaging',
      description: 'Boxes & containers',
      productCount: 765,
      icon: Package,
      gradient: 'from-teal-500 to-teal-700',
      badge: null
    }
  ];

  const filters = [
    { id: 'all', label: 'All Categories' },
    { id: 'popular', label: 'Most Popular' },
    { id: 'trending', label: 'Trending' },
    { id: 'new', label: 'New Arrivals' },
    { id: 'bestsellers', label: 'Best Sellers' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-emerald-50/30 to-purple-50/40">
      
      {/* Page Header */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-fadeInUp">
            <div className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full px-5 py-2 mb-6">
              <p className="font-bold text-xs uppercase tracking-wide">Browse Categories</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              Product <span className="bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">Categories</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">Discover products organized by industry-leading categories</p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-12 pt-8">
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-black text-emerald-400 mb-2">25+</p>
                <p className="text-sm text-slate-400 font-semibold">Categories</p>
              </div>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-black text-amber-400 mb-2">15K+</p>
                <p className="text-sm text-slate-400 font-semibold">Products</p>
              </div>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-black text-cyan-400 mb-2">150+</p>
                <p className="text-sm text-slate-400 font-semibold">Countries</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar with Quick Filters */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 py-10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search categories..." 
                className="w-full bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-2xl px-6 py-5 pl-16 text-base focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-sm"
              />
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            </div>
          </div>
          
          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                    : 'bg-white/70 backdrop-blur-sm text-slate-700 border border-slate-200 hover:bg-white hover:shadow-md'
                } px-7 py-3 rounded-full text-sm font-semibold transform hover:scale-105 transition-all duration-300`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Categories Grid */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Title */}
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Popular Categories</h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">Explore our wide range of product categories</p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.id}
                  to="/products"
                  className={`bg-gradient-to-br ${category.gradient} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer relative overflow-hidden min-h-[280px] flex flex-col justify-between`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  
                  {category.badge && (
                    <div className={`absolute top-3 right-3 ${category.badge.color} backdrop-blur-md px-3 py-1 rounded-full`}>
                      <p className="text-white text-xs font-bold">{category.badge.text}</p>
                    </div>
                  )}
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="text-white" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{category.name}</h3>
                    <p className="text-white/80 text-xs mb-4 leading-relaxed">{category.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-white/80 text-xs font-semibold">{category.productCount.toLocaleString()} Products</span>
                    <ArrowRight className="text-white group-hover:translate-x-2 transition-transform duration-300" size={16} />
                  </div>
                </Link>
              );
            })}

          </div>

          {/* Featured Categories Banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-[30px] p-12 shadow-2xl mt-20 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }}></div>
            </div>
            
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Can't Find What You're Looking For?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Contact our team and we'll help you find the perfect products from our global supplier network
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/contact"
                  className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold text-base hover:bg-slate-50 transition-all shadow-2xl transform hover:scale-105 inline-flex items-center gap-2"
                >
                  <Search size={20} />
                  Request Custom Category
                </Link>
                <Link
                  to="/products"
                  className="bg-white/10 backdrop-blur-md border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-white/20 transition-all inline-flex items-center gap-2 transform hover:scale-105"
                >
                  Browse All Products
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default CategoriesPage;
