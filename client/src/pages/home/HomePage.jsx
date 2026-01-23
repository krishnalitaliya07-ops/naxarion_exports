import { Link } from 'react-router-dom';
import { Search, FileText, Box, Shield, Truck, CheckCircle, Globe, Lock, Headphones, UserPlus, Handshake, Phone, Rocket, Zap } from 'lucide-react';
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
            <AnimatedSection variants={slideInLeft} className="text-white">
              {/* Trust Badge */}
              <motion.div 
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6"
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-white"></div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 border-2 border-white"></div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white"></div>
                </div>
                <p className="text-xs font-semibold">Serving 2,847 Businesses Since 2021</p>
                <CheckCircle size={14} className="text-emerald-400" />
              </motion.div>
              
              <h1 className="text-4xl lg:text-6xl font-black mb-6 leading-tight">
                Connect Global
                <span className="block bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
                  Trade Partners
                </span>
                Instantly
              </h1>
          
              
              {/* Feature Badges */}
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  { icon: Box, label: '673 Listings', sublabel: 'Quality Verified', iconColor: 'text-amber-400', bgColor: 'bg-amber-500/20' },
                  { icon: Shield, label: '189 Suppliers', sublabel: 'ID Verified', iconColor: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
                  { icon: Truck, label: 'Worldwide', sublabel: '47 Countries', iconColor: 'text-cyan-400', bgColor: 'bg-cyan-500/20' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 hover:bg-white/15 transition-all cursor-pointer"
                  >
                    <div className={`w-10 h-10 ${item.bgColor} rounded-xl flex items-center justify-center`}>
                      <item.icon className={item.iconColor} size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-xs">{item.label}</p>
                      <p className="text-[10px] text-slate-400">{item.sublabel}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-wrap gap-4 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
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
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="grid grid-cols-3 gap-4 pt-6 max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <motion.div 
                  className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm border-2 border-amber-400/30 rounded-2xl p-4 text-center shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 hover:border-amber-400/50 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  <p className="text-3xl lg:text-4xl font-black text-amber-400 mb-1 drop-shadow-lg">2.8K+</p>
                  <p className="text-[10px] text-amber-100 font-bold uppercase tracking-wider leading-tight">Registered Users</p>
                </motion.div>
                <motion.div 
                  className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border-2 border-emerald-400/30 rounded-2xl p-4 text-center shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <p className="text-3xl lg:text-4xl font-black text-emerald-400 mb-1 drop-shadow-lg">47</p>
                  <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider leading-tight">Countries</p>
                </motion.div>
                <motion.div 
                  className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border-2 border-cyan-400/30 rounded-2xl p-4 text-center shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.3 }}
                >
                  <p className="text-3xl lg:text-4xl font-black text-cyan-400 mb-1 drop-shadow-lg">$12.6M</p>
                  <p className="text-[10px] text-cyan-100 font-bold uppercase tracking-wider leading-tight">Est. Trade Value</p>
                </motion.div>
              </motion.div>
            </AnimatedSection>

            {/* Right Image */}
            <AnimatedSection variants={slideInRight} className="relative">
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
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {[
                    { icon: CheckCircle, title: 'ISO Certified', subtitle: 'Quality Assured', gradient: 'from-amber-400 to-amber-600' },
                    { icon: Lock, title: 'Secure Payments', subtitle: '100% Protected', gradient: 'from-emerald-400 to-emerald-600' },
                    { icon: Zap, title: 'Faster Delivery', subtitle: 'Express Shipping', gradient: 'from-cyan-400 to-blue-600' }
                  ].map((card, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                      className="bg-white/10 backdrop-blur-md border-2 border-white/15 p-4 rounded-2xl hover:transform hover:-translate-y-1 transition-all group"
                    >
                      <div className={`w-10 h-10 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                        <card.icon className="text-white" size={20} />
                      </div>
                      <p className="font-bold text-white text-[11px] mb-0.5 leading-tight">{card.title}</p>
                      <p className="text-[9px] text-white/70 leading-tight">{card.subtitle}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-10 lg:py-14 bg-gradient-to-br from-slate-50 via-teal-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full px-5 py-2 mb-4">
              <p className="font-bold text-xs uppercase tracking-wide">Why Choose Us</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
              Everything You Need for <span className="bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">Global Trade</span>
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make international trading simple, secure, and successful
            </p>
          </AnimatedSection>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            
            {[
              { gradient: 'from-emerald-500 to-teal-600', icon: Globe, title: 'Global Network', desc: 'Connect with verified suppliers and buyers across 47 countries. Growing partnerships in Asia, Europe, and the Americas.', link: '/services', delay: 0.1 },
              { gradient: 'from-amber-500 to-orange-600', icon: Shield, title: 'Verified Suppliers', desc: 'All suppliers thoroughly verified with certifications, quality checks, and complete business verification process.', link: '/services', delay: 0.2 },
              { gradient: 'from-cyan-500 to-blue-600', icon: Lock, title: 'Secure Trading', desc: 'Protected transactions with escrow services, buyer protection guarantee, and secure payment gateway integration.', link: '/services', delay: 0.3 },
              { gradient: 'from-purple-500 to-indigo-600', icon: Headphones, title: '24/7 Support', desc: 'Round-the-clock customer support team ready to assist with your trade inquiries and resolve any issues instantly.', link: '/contact', delay: 0.4 }
            ].map((feature, index) => (
              <AnimatedSection key={index} variants={scaleIn} delay={feature.delay}>
                <div className={`bg-gradient-to-br ${feature.gradient} p-5 lg:p-6 rounded-[25px] shadow-xl hover:shadow-2xl transition-all duration-500 ease-in-out hover:transform hover:-translate-y-2 group relative overflow-hidden h-full`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 ease-in-out shadow-lg">
                      <feature.icon className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/90 leading-relaxed mb-3 text-sm">{feature.desc}</p>
                    <Link to={feature.link} className="flex items-center gap-2 text-white text-sm font-semibold hover:gap-3 transition-all">
                      <span>Learn More</span>
                      <span className="group-hover:translate-x-2 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}

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
          <AnimatedSection className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full px-5 py-2 mb-4">
              <p className="font-bold text-xs uppercase tracking-wide">Process</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              How It <span className="bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-base text-slate-300 max-w-2xl mx-auto">Start your global trading journey in 4 simple steps</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {[
              { num: 1, icon: UserPlus, title: 'Sign Up Free', desc: 'Create your account in minutes. No credit card required to get started.', color: 'emerald', borderColor: 'border-emerald-500/30 hover:border-emerald-500', bgGradient: 'from-emerald-400 to-emerald-600', iconGradient: 'from-emerald-500 to-emerald-600', delay: 0.1 },
              { num: 2, icon: Search, title: 'Browse Products', desc: 'Explore 673 active listings from verified suppliers in various categories.', color: 'amber', borderColor: 'border-amber-500/30 hover:border-amber-500', bgGradient: 'from-amber-400 to-amber-600', iconGradient: 'from-amber-500 to-amber-600', delay: 0.2 },
              { num: 3, icon: Handshake, title: 'Connect & Negotiate', desc: 'Request quotes and negotiate directly with verified suppliers.', color: 'cyan', borderColor: 'border-cyan-500/30 hover:border-cyan-500', bgGradient: 'from-cyan-400 to-cyan-600', iconGradient: 'from-cyan-500 to-cyan-600', delay: 0.3 },
              { num: 4, icon: Truck, title: 'Ship Globally', desc: 'Secure payment and worldwide shipping arranged for you.', color: 'purple', borderColor: 'border-purple-500/30 hover:border-purple-500', bgGradient: 'from-purple-400 to-purple-600', iconGradient: 'from-purple-500 to-purple-600', delay: 0.4 }
            ].map((step, index) => (
              <AnimatedSection key={index} variants={fadeInUp} delay={step.delay}>
                <div className="relative h-full">
                  <div className={`bg-white/10 backdrop-blur-md border-2 ${step.borderColor} p-8 rounded-[30px] transition-all duration-500 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl group flex flex-col h-full min-h-[280px]`}>
                    {/* Step Number */}
                    <div className={`absolute -top-5 -right-5 w-14 h-14 bg-gradient-to-br ${step.bgGradient} rounded-full flex items-center justify-center shadow-xl`}>
                      <span className="text-2xl font-black text-white">{step.num}</span>
                    </div>
                    
                    <div className={`w-16 h-16 bg-gradient-to-br ${step.iconGradient} rounded-3xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <step.icon className="text-white" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed flex-grow">{step.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}

          </div>

          {/* CTA Button */}
          <AnimatedSection className="text-center mt-12" delay={0.5}>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-10 py-4 rounded-xl font-bold text-base hover:from-emerald-600 hover:to-teal-700 transition-all shadow-2xl transform hover:scale-105 inline-flex items-center gap-2"
            >
              <Rocket size={20} />
              Start Your Journey Today
            </Link>
          </AnimatedSection>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-br from-slate-100 via-emerald-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Growing <span className="bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">Trade Community</span>
            </h2>
            <p className="text-base text-gray-600">Live platform statistics - Updated January 2026</p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '2,847', label: 'Registered Users', gradient: 'from-emerald-500 to-emerald-700', bg: 'from-emerald-50 via-white to-emerald-50', delay: 0.1 },
              { value: '673', label: 'Active Listings', gradient: 'from-amber-500 to-orange-600', bg: 'from-amber-50 via-white to-orange-50', delay: 0.2 },
              { value: '$12.6M', label: 'Est. Trade Value', gradient: 'from-cyan-500 to-blue-600', bg: 'from-cyan-50 via-white to-blue-50', delay: 0.3 },
              { value: '189', label: 'Verified Suppliers', gradient: 'from-purple-500 to-indigo-600', bg: 'from-purple-50 via-white to-indigo-50', delay: 0.4 }
            ].map((stat, index) => (
              <AnimatedSection key={index} variants={scaleIn} delay={stat.delay}>
                <div className={`group text-center bg-gradient-to-br ${stat.bg} p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 20% 50%, currentColor 0%, transparent 50%)` }}></div>
                  </div>
                  <div className="relative">
                    <div className={`text-5xl font-black bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300`}>{stat.value}</div>
                    <p className="text-gray-600 font-semibold text-sm transition-colors">{stat.label}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight">
              Ready to Expand Your <span className="text-amber-300">Global Trade?</span>
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join our growing community of importers and exporters. Start connecting with verified partners today.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Link
                to="/signup"
                className="bg-white text-slate-900 px-10 py-4 rounded-xl font-black text-base hover:bg-amber-400 hover:text-white transition-all duration-300 shadow-2xl transform hover:scale-105 hover:shadow-amber-400/50 inline-flex items-center gap-2"
              >
                <Rocket size={20} />
                Get Started
              </Link>
              <Link
                to="/contact"
                className="bg-gradient-to-r from-amber-500 to-orange-500 border-2 border-amber-400 text-white px-10 py-4 rounded-xl font-bold text-base hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-xl inline-flex items-center gap-2 transform hover:scale-105"
              >
                <Phone size={20} />
                Contact Sales
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <p className="mt-6 text-sm font-semibold flex flex-wrap justify-center gap-4">
              {[
                { text: 'No credit card required', color: 'emerald' },
                { text: 'Free forever plan', color: 'cyan' },
                { text: 'Cancel anytime', color: 'amber' }
              ].map((badge, index) => (
                <span key={index} className={`flex items-center gap-2 bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full border-2 border-${badge.color}-400 shadow-lg shadow-${badge.color}-500/30 hover:shadow-${badge.color}-500/50 transition-all duration-300 transform hover:scale-105`}>
                  <span className={`text-${badge.color}-500 text-base font-bold animate-pulse`}>✓</span>
                  <span className="text-slate-900 font-semibold">{badge.text}</span>
                </span>
              ))}
            </p>
          </AnimatedSection>
        </div>
      </div>

    </div>
  );
};

export default HomePage;
