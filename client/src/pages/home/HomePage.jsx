import { Link } from 'react-router-dom';
import { Search, FileText, Box, Shield, Truck, CheckCircle, Globe, Lock, Headphones, UserPlus, Handshake, Phone, Rocket } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 py-12 lg:py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_20%_30%,rgba(52,211,153,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(251,191,36,0.08)_0%,transparent_50%)]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-white animate-fadeInUp">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
                <div className="flex -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-white"></div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 border-2 border-white"></div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white"></div>
                </div>
                <p className="text-xs font-semibold">Serving 2,847 Businesses Since 2021</p>
                <CheckCircle size={14} className="text-emerald-400" />
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-black mb-6 leading-tight">
                Connect Global
                <span className="block bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
                  Trade Partners
                </span>
                Instantly
              </h1>
              
              <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-xl">
                Your trusted platform for international import-export business. Connect with verified suppliers, secure transactions, and grow your global trade network with confidence.
              </p>
              
              {/* Feature Badges */}
              <div className="flex flex-wrap gap-3 mb-10">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 hover:bg-white/15 transition-all cursor-pointer">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                    <Box className="text-amber-300" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-xs">673 Listings</p>
                    <p className="text-[10px] text-slate-400">Quality Verified</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 hover:bg-white/15 transition-all cursor-pointer">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Shield className="text-emerald-300" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-xs">189 Suppliers</p>
                    <p className="text-[10px] text-slate-400">ID Verified</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 hover:bg-white/15 transition-all cursor-pointer">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                    <Truck className="text-cyan-300" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-xs">Worldwide</p>
                    <p className="text-[10px] text-slate-400">47 Countries</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  to="/products"
                  className="bg-white text-slate-900 px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all shadow-xl transform hover:scale-105 flex items-center gap-2"
                >
                  <Search size={18} />
                  Explore Products
                </Link>
                <Link
                  to="/contact"
                  className="bg-white/10 backdrop-blur-md border-2 border-white/30 px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <FileText size={18} />
                  Request Quote
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <p className="text-4xl font-black text-amber-400 mb-1.5">2.8K+</p>
                  <p className="text-xs text-slate-300 font-medium uppercase tracking-wide">Registered Users</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black text-emerald-400 mb-1.5">47</p>
                  <p className="text-xs text-slate-300 font-medium uppercase tracking-wide">Countries</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black text-cyan-400 mb-1.5">$12.6M</p>
                  <p className="text-xs text-slate-300 font-medium uppercase tracking-wide">Est. Trade Value</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative animate-fadeInUp lg:animate-slideInRight">
              <div className="relative">
                {/* Main Image */}
                <div className="relative h-[450px] rounded-[35px] overflow-hidden shadow-2xl border-4 border-white/15">
                  <img
                    src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=600&fit=crop&q=80"
                    alt="Global Trade"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                  
                  {/* Floating Stats Card */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border-2 border-white/25 rounded-[25px] p-5 shadow-2xl">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-2xl font-black text-amber-400">673</p>
                        <p className="text-[10px] text-white font-semibold">Active Listings</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black text-emerald-400">189</p>
                        <p className="text-[10px] text-white font-semibold">Suppliers</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black text-cyan-400">98.4%</p>
                        <p className="text-[10px] text-white font-semibold">Success Rate</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Small Feature Cards */}
                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div className="bg-white/10 backdrop-blur-md border-2 border-white/15 p-5 rounded-[25px] hover:transform hover:-translate-y-2 transition-all group">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <CheckCircle className="text-white" size={24} />
                    </div>
                    <p className="font-bold text-white text-xs mb-0.5">ISO Certified</p>
                    <p className="text-[10px] text-white/70">Quality Assured</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border-2 border-white/15 p-5 rounded-[25px] hover:transform hover:-translate-y-2 transition-all group">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Lock className="text-white" size={24} />
                    </div>
                    <p className="font-bold text-white text-xs mb-0.5">Secure Payments</p>
                    <p className="text-[10px] text-white/70">100% Protected</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-10 lg:py-14 bg-gradient-to-br from-slate-50 via-teal-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-fadeInUp">
            <div className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full px-5 py-2 mb-4">
              <p className="font-bold text-xs uppercase tracking-wide">Why Choose Us</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
              Everything You Need for <span className="bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">Global Trade</span>
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make international trading simple, secure, and successful
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-5 lg:p-6 rounded-[25px] shadow-xl hover:shadow-2xl transition-all duration-500 ease-in-out hover:transform hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 ease-in-out shadow-lg">
                  <Globe className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Global Network</h3>
                <p className="text-emerald-50 leading-relaxed mb-3 text-sm">
                  Connect with verified suppliers and buyers across 47 countries. Growing partnerships in Asia, Europe, and the Americas.
                </p>
                <Link to="/services" className="flex items-center gap-2 text-white text-sm font-semibold hover:gap-3 transition-all">
                  <span>Learn More</span>
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-5 lg:p-6 rounded-[25px] shadow-xl hover:shadow-2xl transition-all duration-500 ease-in-out hover:transform hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 ease-in-out shadow-lg">
                  <Shield className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Verified Suppliers</h3>
                <p className="text-orange-50 leading-relaxed mb-3 text-sm">
                  All suppliers thoroughly verified with certifications, quality checks, and complete business verification process.
                </p>
                <Link to="/services" className="flex items-center gap-2 text-white text-sm font-semibold hover:gap-3 transition-all">
                  <span>Learn More</span>
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-5 lg:p-6 rounded-[25px] shadow-xl hover:shadow-2xl transition-all duration-500 ease-in-out hover:transform hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 ease-in-out shadow-lg">
                  <Lock className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Secure Trading</h3>
                <p className="text-blue-50 leading-relaxed mb-3 text-sm">
                  Protected transactions with escrow services, buyer protection guarantee, and secure payment gateway integration.
                </p>
                <Link to="/services" className="flex items-center gap-2 text-white text-sm font-semibold hover:gap-3 transition-all">
                  <span>Learn More</span>
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </Link>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-5 lg:p-6 rounded-[25px] shadow-xl hover:shadow-2xl transition-all duration-500 ease-in-out hover:transform hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 ease-in-out shadow-lg">
                  <Headphones className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">24/7 Support</h3>
                <p className="text-purple-50 leading-relaxed mb-3 text-sm">
                  Round-the-clock customer support team ready to assist with your trade inquiries and resolve any issues instantly.
                </p>
                <Link to="/contact" className="flex items-center gap-2 text-white text-sm font-semibold hover:gap-3 transition-all">
                  <span>Learn More</span>
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full px-5 py-2 mb-4">
              <p className="font-bold text-xs uppercase tracking-wide">Process</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              How It <span className="bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-base text-slate-300 max-w-2xl mx-auto">Start your global trading journey in 4 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-md border-2 border-emerald-500/30 hover:border-emerald-500 p-8 rounded-[30px] transition-all duration-500 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl group h-full">
                {/* Step Number */}
                <div className="absolute -top-5 -right-5 w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-2xl font-black text-white">1</span>
                </div>
                
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <UserPlus className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Sign Up Free</h3>
                <p className="text-slate-300 text-sm leading-relaxed">Create your account in minutes. No credit card required to get started.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-md border-2 border-amber-500/30 hover:border-amber-500 p-8 rounded-[30px] transition-all duration-500 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl group h-full">
                {/* Step Number */}
                <div className="absolute -top-5 -right-5 w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-2xl font-black text-white">2</span>
                </div>
                
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Search className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Browse Products</h3>
                <p className="text-slate-300 text-sm leading-relaxed">Explore 673 active listings from verified suppliers in various categories.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-md border-2 border-cyan-500/30 hover:border-cyan-500 p-8 rounded-[30px] transition-all duration-500 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl group h-full">
                {/* Step Number */}
                <div className="absolute -top-5 -right-5 w-14 h-14 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-2xl font-black text-white">3</span>
                </div>
                
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-3xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Handshake className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Connect & Negotiate</h3>
                <p className="text-slate-300 text-sm leading-relaxed">Request quotes and negotiate directly with verified suppliers.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-md border-2 border-purple-500/30 hover:border-purple-500 p-8 rounded-[30px] transition-all duration-500 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl group h-full">
                {/* Step Number */}
                <div className="absolute -top-5 -right-5 w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-2xl font-black text-white">4</span>
                </div>
                
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Truck className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Ship Globally</h3>
                <p className="text-slate-300 text-sm leading-relaxed">Secure payment and worldwide shipping arranged for you.</p>
              </div>
            </div>

          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Link
              to="/register"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-10 py-4 rounded-xl font-bold text-base hover:from-emerald-600 hover:to-teal-700 transition-all shadow-2xl transform hover:scale-105 inline-flex items-center gap-2"
            >
              <Rocket size={20} />
              Start Your Journey Today
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-br from-slate-100 via-emerald-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Growing <span className="bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">Trade Community</span>
            </h2>
            <p className="text-base text-gray-600">Live platform statistics - Updated January 2026</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Stat 1 - Emerald */}
            <div className="group text-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50 p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden animate-fadeInUp">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)' }}></div>
              </div>
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-emerald-500/0 group-hover:border-emerald-500/20 transition-all duration-500"></div>
              <div className="relative">
                <div className="text-5xl font-black bg-gradient-to-br from-emerald-500 to-emerald-700 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">2,847</div>
                <p className="text-gray-600 font-semibold text-sm group-hover:text-emerald-600 transition-colors">Registered Users</p>
              </div>
            </div>

            {/* Stat 2 - Amber */}
            <div className="group text-center bg-gradient-to-br from-amber-50 via-white to-orange-50 p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(245, 158, 11, 0.3) 0%, transparent 50%)' }}></div>
              </div>
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-amber-500/0 group-hover:border-amber-500/20 transition-all duration-500"></div>
              <div className="relative">
                <div className="text-5xl font-black bg-gradient-to-br from-amber-500 to-orange-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">673</div>
                <p className="text-gray-600 font-semibold text-sm group-hover:text-amber-600 transition-colors">Active Listings</p>
              </div>
            </div>

            {/* Stat 3 - Cyan */}
            <div className="group text-center bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)' }}></div>
              </div>
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-cyan-500/0 group-hover:border-cyan-500/20 transition-all duration-500"></div>
              <div className="relative">
                <div className="text-5xl font-black bg-gradient-to-br from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">$12.6M</div>
                <p className="text-gray-600 font-semibold text-sm group-hover:text-cyan-600 transition-colors">Est. Trade Value</p>
              </div>
            </div>

            {/* Stat 4 - Purple */}
            <div className="group text-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)' }}></div>
              </div>
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/0 group-hover:border-purple-500/20 transition-all duration-500"></div>
              <div className="relative">
                <div className="text-5xl font-black bg-gradient-to-br from-purple-500 to-indigo-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">189</div>
                <p className="text-gray-600 font-semibold text-sm group-hover:text-purple-600 transition-colors">Verified Suppliers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight">
            Ready to Expand Your <span className="text-amber-300">Global Trade?</span>
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join our growing community of importers and exporters. Start connecting with verified partners today.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link
              to="/register"
              className="bg-white text-slate-900 px-10 py-4 rounded-xl font-black text-base hover:bg-amber-400 hover:text-white transition-all duration-300 shadow-2xl transform hover:scale-105 hover:shadow-amber-400/50 inline-flex items-center gap-2"
            >
              <Rocket size={20} />
              Get Started Free
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-base hover:bg-white/20 transition-all duration-300 backdrop-blur-md inline-flex items-center gap-2 transform hover:scale-105"
            >
              <Phone size={20} />
              Contact Sales
            </Link>
          </div>
          <p className="mt-6 text-sm font-semibold flex flex-wrap justify-center gap-4 animate-fadeInUp">
            <span className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full border-2 border-emerald-400 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105">
              <span className="text-emerald-500 text-base font-bold animate-pulse">✓</span>
              <span className="text-slate-900 font-semibold">No credit card required</span>
            </span>
            <span className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full border-2 border-cyan-400 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105">
              <span className="text-cyan-500 text-base font-bold animate-pulse">✓</span>
              <span className="text-slate-900 font-semibold">Free forever plan</span>
            </span>
            <span className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full border-2 border-amber-400 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 transform hover:scale-105">
              <span className="text-amber-500 text-base font-bold animate-pulse">✓</span>
              <span className="text-slate-900 font-semibold">Cancel anytime</span>
            </span>
          </p>
        </div>
      </div>

    </div>
  );
};

export default HomePage;
