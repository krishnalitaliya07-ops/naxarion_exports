import { Link } from 'react-router-dom';
import { Search, FileText, Box, Shield, Truck, CheckCircle, Globe, Lock, Headphones } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 py-16 lg:py-24 overflow-hidden">
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
                <p className="text-xs font-semibold">Trusted by 10,000+ Businesses</p>
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
                    <p className="font-bold text-xs">500+ Products</p>
                    <p className="text-[10px] text-slate-400">Quality Verified</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 hover:bg-white/15 transition-all cursor-pointer">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Shield className="text-emerald-300" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-xs">100% Verified</p>
                    <p className="text-[10px] text-slate-400">Trusted Suppliers</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 hover:bg-white/15 transition-all cursor-pointer">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                    <Truck className="text-cyan-300" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-xs">Fast Shipping</p>
                    <p className="text-[10px] text-slate-400">150+ Countries</p>
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
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/20">
                <div className="text-center">
                  <p className="text-3xl font-black text-amber-400 mb-1">10K+</p>
                  <p className="text-xs text-slate-400 font-medium">Active Traders</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-emerald-400 mb-1">150+</p>
                  <p className="text-xs text-slate-400 font-medium">Countries</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-cyan-400 mb-1">$100M+</p>
                  <p className="text-xs text-slate-400 font-medium">Trade Volume</p>
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
                        <p className="text-2xl font-black text-amber-400">150+</p>
                        <p className="text-[10px] text-white font-semibold">Countries</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black text-emerald-400">5000+</p>
                        <p className="text-[10px] text-white font-semibold">Suppliers</p>
                      </div>
                      <div>
                        <p className="text-2xl font-black text-cyan-400">24/7</p>
                        <p className="text-[10px] text-white font-semibold">Support</p>
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
      <div className="py-20 bg-gradient-to-br from-slate-50 via-teal-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeInUp">
            <div className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full px-5 py-2 mb-4">
              <p className="font-bold text-xs uppercase tracking-wide">Why Choose Us</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Everything You Need for <span className="bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">Global Trade</span>
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make international trading simple, secure, and successful
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-[30px] shadow-2xl hover:shadow-3xl transition-all hover:transform hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                  <Globe className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Global Network</h3>
                <p className="text-emerald-50 leading-relaxed mb-4">
                  Connect with verified suppliers and buyers from over 150 countries worldwide. Access to premium trade partners.
                </p>
                <Link to="/services" className="flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all">
                  <span>Learn More</span>
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-[30px] shadow-2xl hover:shadow-3xl transition-all hover:transform hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                  <Shield className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Verified Suppliers</h3>
                <p className="text-orange-50 leading-relaxed mb-4">
                  All suppliers thoroughly verified with certifications, quality checks, and complete business verification process.
                </p>
                <Link to="/services" className="flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all">
                  <span>Learn More</span>
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </Link>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-8 rounded-[30px] shadow-2xl hover:shadow-3xl transition-all hover:transform hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                  <Lock className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Secure Trading</h3>
                <p className="text-blue-50 leading-relaxed mb-4">
                  Protected transactions with escrow services, buyer protection guarantee, and secure payment gateway integration.
                </p>
                <Link to="/services" className="flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all">
                  <span>Learn More</span>
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </Link>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-8 rounded-[30px] shadow-2xl hover:shadow-3xl transition-all hover:transform hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                  <Headphones className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">24/7 Support</h3>
                <p className="text-purple-50 leading-relaxed mb-4">
                  Round-the-clock customer support team ready to assist with your trade inquiries and resolve any issues instantly.
                </p>
                <Link to="/contact" className="flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all">
                  <span>Learn More</span>
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;
