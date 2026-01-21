import { 
  BookOpen, 
  MapPin, 
  Lightbulb, 
  TrendingUp, 
  Globe, 
  Award, 
  Shield, 
  Headphones, 
  Truck, 
  Lock, 
  Brain, 
  Target, 
  Rocket, 
  Users, 
  Leaf, 
  UserCircle, 
  Linkedin, 
  Twitter,
  ShieldCheck,
  MessageCircle,
  LineChart,
  Handshake
} from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { value: '7+', label: 'Years Experience', gradient: 'from-emerald-600 to-teal-600', bg: 'from-emerald-50 to-teal-100/70', border: 'border-emerald-200 group-hover:border-emerald-400' },
    { value: '12K+', label: 'Verified Suppliers', gradient: 'from-amber-600 to-orange-600', bg: 'from-amber-50 to-orange-100/70', border: 'border-amber-200 group-hover:border-amber-400' },
    { value: '85+', label: 'Countries Served', gradient: 'from-cyan-600 to-blue-600', bg: 'from-cyan-50 to-blue-100/70', border: 'border-cyan-200 group-hover:border-cyan-400' },
    { value: '$50M+', label: 'Monthly Trade Value', gradient: 'from-purple-600 to-pink-600', bg: 'from-purple-50 to-pink-100/70', border: 'border-purple-200 group-hover:border-purple-400' }
  ];

  const storyPoints = [
    {
      icon: MapPin,
      text: 'Founded in 2018 in Singapore, Nexarion emerged from a simple observation: small and medium businesses struggled to find reliable international trade partners.',
      gradient: 'from-indigo-500 to-purple-600',
      highlight: 'Founded in 2018',
      color: 'indigo'
    },
    {
      icon: Lightbulb,
      text: 'Our founders, experienced exporters themselves, built a platform that prioritizes trust, transparency, and efficiency in every transaction.',
      gradient: 'from-purple-500 to-pink-600',
      highlight: 'experienced exporters themselves',
      color: 'purple'
    },
    {
      icon: TrendingUp,
      text: 'Today, we connect over 12,000 verified suppliers with buyers across 85 countries, facilitating over $50 million in trade monthly.',
      gradient: 'from-cyan-500 to-blue-600',
      highlight: '12,000 verified suppliers',
      color: 'blue'
    },
    {
      icon: Globe,
      text: 'From our headquarters in Singapore and regional offices in Dubai, Hong Kong, and São Paulo, we continue to expand globally.',
      gradient: 'from-amber-500 to-orange-600',
      highlight: 'Singapore',
      color: 'amber'
    }
  ];

  const certifications = [
    { title: 'ISO 9001 Certified Platform', subtitle: 'International quality management standards', icon: Award, gradient: 'from-indigo-500 via-purple-500 to-purple-600' },
    { title: 'PCI DSS Compliant Payments', subtitle: 'Bank-level security for all transactions', icon: Shield, gradient: 'from-purple-500 via-pink-500 to-rose-600' },
    { title: '24/7 Support in 12 Languages', subtitle: 'Global team ready to assist you anytime', icon: Headphones, gradient: 'from-cyan-500 via-blue-500 to-indigo-600' },
    { title: 'Partnership with DHL & FedEx', subtitle: 'Exclusive shipping rates & priority service', icon: Truck, gradient: 'from-amber-500 via-orange-500 to-red-600' },
    { title: 'Escrow Payment Protection', subtitle: '$10M insurance coverage on transactions', icon: Lock, gradient: 'from-emerald-500 via-teal-500 to-cyan-600' },
    { title: 'AI-Powered Smart Matching', subtitle: 'Find perfect suppliers in seconds', icon: Brain, gradient: 'from-violet-500 via-fuchsia-500 to-pink-600' }
  ];

  const missionPoints = [
    { icon: Target, text: 'Enterprise-level tools for SMEs', gradient: 'from-blue-500 to-indigo-600' },
    { icon: Shield, text: 'Eliminate fraud & trade barriers', gradient: 'from-indigo-500 to-purple-600' },
    { icon: Handshake, text: 'Transparent & secure marketplace', gradient: 'from-purple-500 to-pink-600' }
  ];

  const visionPoints = [
    { icon: Globe, text: '100K+ suppliers by 2030', gradient: 'from-orange-500 to-amber-600' },
    { icon: Brain, text: 'AI-powered matching technology', gradient: 'from-amber-500 to-yellow-600' },
    { icon: Leaf, text: 'Blockchain & sustainability focus', gradient: 'from-yellow-500 to-orange-600' }
  ];

  const values = [
    { title: 'Trust & Integrity', description: 'Every supplier verified through 5-step authentication process', icon: Award, gradient: 'from-emerald-500 to-teal-600', bg: 'from-emerald-50 to-teal-100/60', border: 'border-emerald-200 hover:border-emerald-400' },
    { title: 'Innovation', description: 'AI-powered matching & real-time market intelligence', icon: Lightbulb, gradient: 'from-amber-500 to-orange-600', bg: 'from-amber-50 to-orange-100/60', border: 'border-amber-200 hover:border-amber-400' },
    { title: 'Customer Success', description: '4.8/5 average satisfaction rating from 25,000+ users', icon: Users, gradient: 'from-cyan-500 to-blue-600', bg: 'from-cyan-50 to-blue-100/60', border: 'border-cyan-200 hover:border-cyan-400' },
    { title: 'Sustainability', description: 'Carbon-neutral shipping options & eco-certified suppliers', icon: Leaf, gradient: 'from-purple-500 to-pink-600', bg: 'from-purple-50 to-pink-100/60', border: 'border-purple-200 hover:border-purple-400' }
  ];

  const team = [
    { name: 'David Chen', role: 'CEO & Co-Founder', bio: 'Ex-Alibaba, 15 years in B2B', gradient: 'from-emerald-500 to-teal-600', bg: 'from-emerald-50 to-teal-100/60', border: 'border-emerald-200 hover:border-emerald-400', roleColor: 'text-emerald-600', hoverColor: 'hover:bg-emerald-500' },
    { name: 'Priya Sharma', role: 'COO', bio: 'Ex-Amazon, Supply Chain Expert', gradient: 'from-amber-500 to-orange-600', bg: 'from-amber-50 to-orange-100/60', border: 'border-amber-200 hover:border-amber-400', roleColor: 'text-amber-600', hoverColor: 'hover:bg-amber-500' },
    { name: 'Marcus Weber', role: 'CTO', bio: 'Ex-Shopify, Tech Innovator', gradient: 'from-cyan-500 to-blue-600', bg: 'from-cyan-50 to-blue-100/60', border: 'border-cyan-200 hover:border-cyan-400', roleColor: 'text-cyan-600', hoverColor: 'hover:bg-cyan-500' },
    { name: 'Sofia Martinez', role: 'CMO', bio: 'Ex-Google, Growth Strategist', gradient: 'from-purple-500 to-pink-600', bg: 'from-purple-50 to-pink-100/60', border: 'border-purple-200 hover:border-purple-400', roleColor: 'text-purple-600', hoverColor: 'hover:bg-purple-500' }
  ];

  const features = [
    { title: '5-Step Verification', description: 'Business license, factory audit, product samples, financial check, and reference verification for every supplier', icon: ShieldCheck, gradient: 'from-emerald-500 to-teal-600', bg: 'from-emerald-50 to-teal-100/60', border: 'border-emerald-200' },
    { title: 'Escrow Protection', description: 'Your payment held securely until order confirmation. $10M insurance coverage on all transactions', icon: Lock, gradient: 'from-amber-500 to-orange-600', bg: 'from-amber-50 to-orange-100/60', border: 'border-amber-200' },
    { title: 'Multilingual Support', description: '24/7 support in English, Spanish, Chinese, Arabic, French, German, Portuguese, Hindi, Russian, Japanese, Korean, Turkish', icon: MessageCircle, gradient: 'from-cyan-500 to-blue-600', bg: 'from-cyan-50 to-blue-100/60', border: 'border-cyan-200' },
    { title: 'Smart Analytics', description: 'Real-time market trends, price comparison tools, competitor analysis, and demand forecasting powered by AI', icon: LineChart, gradient: 'from-purple-500 to-pink-600', bg: 'from-purple-50 to-pink-100/60', border: 'border-purple-200' },
    { title: 'Integrated Logistics', description: '30% discounted rates with DHL, FedEx, Maersk. Real-time tracking and customs clearance assistance', icon: Truck, gradient: 'from-pink-500 to-rose-600', bg: 'from-pink-50 to-rose-100/60', border: 'border-pink-200' },
    { title: 'Trade Assurance', description: '100% money-back guarantee if product quality or delivery doesn\'t match agreement terms', icon: Handshake, gradient: 'from-indigo-500 to-blue-600', bg: 'from-indigo-50 to-blue-100/60', border: 'border-indigo-200' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br mt-[20px] from-slate-800 via-slate-900 to-slate-800 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-fadeInUp">
            <div className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full px-5 py-2 mb-5">
              <p className="font-bold text-xs uppercase tracking-wide">About Nexarion</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Connecting Global <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Trade Partners</span>
            </h1>
            <p className="text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Your trusted B2B marketplace connecting manufacturers, wholesalers, and retailers worldwide since 2018. Making international trade simple, secure, and profitable.
            </p>
          </div>
        </div>
      </div>

      {/* Company Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                <div className={`bg-gradient-to-br ${stat.bg} backdrop-blur-sm rounded-xl p-5 shadow-md hover:shadow-lg transition-all border-2 ${stat.border}`}>
                  <div className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                    {stat.value}
                  </div>
                  <p className="text-xs font-bold text-slate-600">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full px-5 py-2 mb-4 shadow-lg">
              <p className="font-bold text-xs uppercase tracking-wide">Our Journey</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">The Nexarion Story</h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">From a simple idea to a global B2B marketplace</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left Side - Story Content */}
            <div className="relative group">
              {/* Decorative Background */}
              <div className="absolute -top-4 -left-4 w-28 h-28 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity"></div>
              
              <div className="relative bg-gradient-to-br from-white/90 via-indigo-50/40 to-purple-50/30 backdrop-blur-sm rounded-[30px] p-8 border-2 border-indigo-200/60 shadow-2xl hover:shadow-3xl transition-all">
                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all flex-shrink-0">
                    <BookOpen className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-1">Our Story</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                      <p className="text-xs text-indigo-600 font-bold">Since 2018</p>
                    </div>
                  </div>
                </div>
                
                {/* Story Content */}
                <div className="space-y-4">
                  {storyPoints.map((point, index) => {
                    const IconComponent = point.icon;
                    return (
                      <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-indigo-100 hover:border-indigo-300 transition-all">
                        <div className="flex items-start gap-3">
                          <div className={`w-6 h-6 bg-gradient-to-br ${point.gradient} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <IconComponent className="text-white" size={14} />
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {point.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-indigo-200">
                  <div className="text-center">
                    <div className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">7+</div>
                    <p className="text-xs text-slate-600 font-semibold">Years</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">12K+</div>
                    <p className="text-xs text-slate-600 font-semibold">Suppliers</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">85+</div>
                    <p className="text-xs text-slate-600 font-semibold">Countries</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Certifications */}
            <div className="grid grid-cols-1 gap-4">
              {certifications.map((cert, index) => {
                const IconComponent = cert.icon;
                return (
                  <div key={index} className={`group relative overflow-hidden bg-gradient-to-br ${cert.gradient} rounded-[25px] p-6 shadow-xl hover:shadow-2xl transition-all`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                    
                    <div className="relative flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <IconComponent className="text-white" size={28} />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white mb-1">{cert.title}</h3>
                        <p className="text-xs text-white/90">{cert.subtitle}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Mission & Vision</h2>
            <p className="text-sm text-slate-600">Our purpose and future direction</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="relative group">
              <div className="absolute -top-3 -left-3 w-24 h-24 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity"></div>
              <div className="absolute -bottom-3 -right-3 w-28 h-28 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity"></div>
              
              <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50/50 rounded-[30px] p-8 shadow-xl border-2 border-blue-200/60 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-40"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all flex-shrink-0">
                      <Target className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-1">Our Mission</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                        <p className="text-xs text-indigo-600 font-bold">What drives us</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-700 leading-relaxed mb-6">
                    To democratize global trade by providing SMEs with enterprise-level tools, verified supplier networks, and seamless logistics solutions. We aim to reduce trade barriers, eliminate fraud, and create a transparent marketplace where businesses can grow confidently across borders.
                  </p>
                  
                  <div className="space-y-3">
                    {missionPoints.map((point, index) => {
                      const IconComponent = point.icon;
                      return (
                        <div key={index} className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-blue-200/50 hover:border-blue-400 transition-all group/item">
                          <div className={`w-8 h-8 bg-gradient-to-br ${point.gradient} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md group-hover/item:scale-110 transition-transform`}>
                            <IconComponent className="text-white" size={14} />
                          </div>
                          <span className="text-xs font-bold text-slate-700">{point.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="relative group">
              <div className="absolute -top-3 -right-3 w-24 h-24 bg-gradient-to-br from-orange-300 to-amber-300 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity"></div>
              <div className="absolute -bottom-3 -left-3 w-28 h-28 bg-gradient-to-br from-amber-300 to-yellow-300 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity"></div>
              
              <div className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50/50 rounded-[30px] p-8 shadow-xl border-2 border-orange-200/60 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full opacity-40"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all flex-shrink-0">
                      <Rocket className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-1">Our Vision</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                        <p className="text-xs text-amber-600 font-bold">Where we're heading</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-700 leading-relaxed mb-6">
                    To become the world's most trusted B2B marketplace by 2030, connecting 100,000+ suppliers across 150 countries. We envision a future where any business can trade internationally with confidence, supported by AI-powered matching, blockchain verification, and sustainable logistics.
                  </p>
                  
                  <div className="space-y-3">
                    {visionPoints.map((point, index) => {
                      const IconComponent = point.icon;
                      return (
                        <div key={index} className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-orange-200/50 hover:border-orange-400 transition-all group/item">
                          <div className={`w-8 h-8 bg-gradient-to-br ${point.gradient} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md group-hover/item:scale-110 transition-transform`}>
                            <IconComponent className="text-white" size={14} />
                          </div>
                          <span className="text-xs font-bold text-slate-700">{point.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-16 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-blue-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">The principles that guide every decision we make</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className={`bg-gradient-to-br ${value.bg} backdrop-blur-sm rounded-[20px] p-6 shadow-lg border-2 ${value.border} hover:shadow-xl hover:scale-105 transition-all group text-center`}>
                  <div className="relative inline-block mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-xl flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform`}>
                      <IconComponent className="text-white" size={28} />
                    </div>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leadership Team */}
      <div className="py-16 bg-gradient-to-r from-slate-50 to-emerald-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Leadership Team</h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">Experienced professionals from top tech and trade companies</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className={`bg-gradient-to-br ${member.bg} backdrop-blur-sm rounded-[20px] p-5 shadow-lg border-2 ${member.border} hover:shadow-xl hover:scale-105 transition-all group text-center`}>
                <div className={`w-24 h-24 bg-gradient-to-br ${member.gradient} rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <UserCircle className="text-white" size={48} />
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1">{member.name}</h3>
                <p className={`text-xs font-bold ${member.roleColor} mb-2`}>{member.role}</p>
                <p className="text-xs text-slate-600 mb-3">{member.bio}</p>
                <div className="flex justify-center gap-2">
                  <a href="#" className={`w-7 h-7 bg-white/70 backdrop-blur-sm rounded-lg flex items-center justify-center ${member.hoverColor} hover:text-white transition-all text-xs border ${member.border}`}>
                    <Linkedin size={14} />
                  </a>
                  <a href="#" className={`w-7 h-7 bg-white/70 backdrop-blur-sm rounded-lg flex items-center justify-center ${member.hoverColor} hover:text-white transition-all text-xs border ${member.border}`}>
                    <Twitter size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-16 bg-gradient-to-br from-blue-50/50 via-emerald-50/40 to-purple-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Why Choose Nexarion</h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">Real advantages backed by real numbers</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className={`bg-gradient-to-br ${feature.bg} rounded-[20px] p-6 border-2 ${feature.border} hover:shadow-xl hover:scale-105 transition-all group`}>
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                    <IconComponent className="text-white" size={24} />
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
