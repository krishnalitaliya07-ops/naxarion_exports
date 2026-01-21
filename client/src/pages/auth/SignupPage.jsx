import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Phone, User, Download, Upload, ShoppingBag, CheckCircle, Globe, Shield, Package, TrendingUp, Users, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { register } from '../../store/slices/authSlice';

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: '',
    agreeToTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleGoogleSignup = () => {
    toast.info('Google signup coming soon!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      toast.error('Please select your account type');
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the Terms & Conditions');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await dispatch(register(formData)).unwrap();
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12 px-4">
      
      {/* Contained Card */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex">
      
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-3 mb-16">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
              <Globe className="text-white" size={30} />
            </div>
            <div>
              <h1 className="font-black text-2xl text-white">Nexarion</h1>
              <p className="text-xs text-emerald-50 font-medium uppercase tracking-wide">Global Exports</p>
            </div>
          </Link>

          {/* Main Heading */}
          <div className="mb-12">
            <h1 className="text-5xl font-black text-white mb-6 leading-tight">
              Join Us Today
            </h1>
            <p className="text-lg text-white/90 leading-relaxed max-w-md">
              Connect with verified suppliers and buyers worldwide. Start trading with confidence today.
            </p>
          </div>

          {/* Image with User Stats */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden mb-10 border border-white/20 shadow-2xl">
            <div className="relative h-48 bg-gradient-to-br from-teal-400/30 to-cyan-400/30 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=500&h=300&fit=crop&q=80"
                alt="Shipping containers"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-600/60 to-transparent"></div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-white" size={24} />
                <span className="text-white font-bold text-lg">Join 2,847+ Traders</span>
              </div>
              <div className="flex gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/20">
                  <span className="text-white text-sm font-semibold">Verified Suppliers</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/20">
                  <span className="text-white text-sm font-semibold">Secure Payment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all">
              <Package className="text-white mb-3" size={28} />
              <h3 className="text-white font-bold text-base mb-1">Product Catalog</h3>
              <p className="text-white/80 text-sm">Browse 673+ listings</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all">
              <Truck className="text-white mb-3" size={28} />
              <h3 className="text-white font-bold text-base mb-1">Global Shipping</h3>
              <p className="text-white/80 text-sm">Ship to 47 countries</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all">
              <Shield className="text-white mb-3" size={28} />
              <h3 className="text-white font-bold text-base mb-1">Trade Protection</h3>
              <p className="text-white/80 text-sm">Secure transactions</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all">
              <TrendingUp className="text-white mb-3" size={28} />
              <h3 className="text-white font-bold text-base mb-1">Business Growth</h3>
              <p className="text-white/80 text-sm">$12.6M trade value</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-3 flex items-center gap-3 text-emerald-50 text-xs">
          <CheckCircle size={16} />
          <span>Secure</span>
          <span>•</span>
          <Lock size={16} />
          <span>Encrypted</span>
          <span>•</span>
          <span>© 2026 Nexarion</span>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600 text-sm">Fill in your details to get started</p>
          </div>

          {/* Google Signup */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl border-2 border-gray-200 flex items-center justify-center gap-3 mb-6 transition-all shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-500 font-medium">OR</span>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Account Type */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                I am a <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'importer', iconComponent: Download, label: 'Importer' },
                  { value: 'exporter', iconComponent: Upload, label: 'Exporter' },
                  { value: 'customer', iconComponent: ShoppingBag, label: 'Customer' }
                ].map(({ value, iconComponent: IconComponent, label }) => (
                  <label key={value} className="relative cursor-pointer group">
                    <input
                      type="radio"
                      name="role"
                      value={value}
                      checked={formData.role === value}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <div className="bg-white border-2 border-gray-200 peer-checked:border-teal-500 peer-checked:bg-teal-50 rounded-xl p-3 text-center transition-all hover:border-gray-300 hover:shadow-sm">
                      <IconComponent className="text-teal-600 mx-auto mb-1.5" size={20} />
                      <p className="text-xs font-bold text-gray-800">{label}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  minLength={8}
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:border-teal-500 focus:outline-none transition-all"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">Minimum 8 characters</p>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-teal-600 focus:ring-2 focus:ring-teal-500 cursor-pointer"
              />
              <label className="text-xs text-gray-600 leading-relaxed">
                I agree to the{' '}
                <Link to="/terms" className="text-teal-600 hover:text-teal-700 font-semibold hover:underline">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-teal-600 hover:text-teal-700 font-semibold hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 hover:text-teal-700 font-bold hover:underline">
              Sign In
            </Link>
          </p>

          {/* Terms Footer */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By signing up you agree to our{' '}
            <Link to="/terms" className="text-teal-600 hover:underline">Terms</Link>
            {' & '}
            <Link to="/privacy" className="text-teal-600 hover:underline">Privacy Policy</Link>
          </p>

        </div>
      </div>

      </div>

 

    </div>
  );
};

export default SignupPage;
