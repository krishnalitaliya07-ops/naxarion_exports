import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Globe, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { apiconnector } from '../../services/apiconnector';
import { authEndpoints } from '../../services/apis';
import { auth } from '../../config/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Send to backend
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/google`, {
        email: result.user.email,
        name: result.user.displayName,
        photoURL: result.user.photoURL
      });

      console.log('Google login response:', response.data);

      // Store token and user
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Update Redux store
      dispatch(setCredentials({
        user: response.data.user,
        token: response.data.token
      }));
      
      toast.success('Google sign-in successful!');
      
      // Redirect based on role
      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error(error.response?.data?.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await apiconnector('POST', authEndpoints.LOGIN_API, formData);

      if (response.data.success) {
        // Store in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Update Redux store
        dispatch(setCredentials({
          user: response.data.user,
          token: response.data.token
        }));
        
        toast.success('Login successful!');
        navigate('/');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      console.error('Login error:', error);
      
      // Handle different error types with helpful messages
      if (errorMsg.includes('verify your email') || errorMsg.includes('verify')) {
        toast.error(errorMsg);
        setTimeout(() => {
          if (window.confirm('Would you like to go to the verification page?')) {
            navigate('/verify-email', { state: { email: formData.email } });
          }
        }, 1000);
      } else if (errorMsg.includes('Invalid email or password') || errorMsg.includes('Invalid credentials')) {
        toast.error('Incorrect email or password');
        setTimeout(() => {
          toast('Forgot your password?', {
            icon: '🔑',
            duration: 4000,
            action: {
              label: 'Reset',
              onClick: () => navigate('/forgot-password')
            }
          });
        }, 1500);
      } else if (errorMsg.includes('Google')) {
        toast.error(errorMsg);
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-violet-100 p-3 overflow-hidden">
      
      {/* Contained Card */}
      <div className="w-full max-w-5xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex">
      
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 flex-col justify-between relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-2 mb-4 animate-[fadeInUp_0.6s_ease-out]">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="text-white" size={24} />
              </div>
              <div>
                <h1 className="font-black text-xl text-white">Nexarion</h1>
                <p className="text-[10px] text-blue-50 font-medium uppercase tracking-wide">Global Exports</p>
              </div>
            </Link>

            {/* Main Heading */}
            <div className="mb-4 animate-[fadeInUp_0.8s_ease-out]">
              <h1 className="text-3xl font-black text-white mb-2 leading-tight">
                Welcome Back
              </h1>
              <p className="text-sm text-white/90 leading-snug max-w-md">
                Sign in to continue your global trading journey with verified partners worldwide.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 animate-[scaleIn_1s_ease-out]">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-2.5 border border-white/20">
                <p className="text-xl font-black text-white mb-0.5">2,847+</p>
                <p className="text-white/80 text-xs">Active Traders</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-2.5 border border-white/20">
                <p className="text-xl font-black text-white mb-0.5">47</p>
                <p className="text-white/80 text-xs">Countries</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-2.5 border border-white/20">
                <p className="text-xl font-black text-white mb-0.5">5,000+</p>
                <p className="text-white/80 text-xs">Products</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-2.5 border border-white/20">
                <p className="text-xl font-black text-white mb-0.5">15+</p>
                <p className="text-white/80 text-sm">Years Experience</p>
              </div>
            </div>

            {/* Additional Features */}
            <div className="mt-3 bg-white/10 backdrop-blur-md rounded-lg p-2.5 border border-white/20 animate-[fadeInUp_1.2s_ease-out]">
              <h3 className="text-white font-bold text-sm mb-2">Why Choose Us?</h3>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2 text-white/90 text-xs">
                  <CheckCircle size={14} className="text-white" />
                  <span>Verified Global Suppliers</span>
                </li>
                <li className="flex items-center gap-2 text-white/90 text-xs">
                  <CheckCircle size={14} className="text-white" />
                  <span>Secure Payment Processing</span>
                </li>
                <li className="flex items-center gap-2 text-white/90 text-xs">
                  <CheckCircle size={14} className="text-white" />
                  <span>24/7 Customer Support</span>
                </li>
                <li className="flex items-center gap-2 text-white/90 text-xs">
                  <CheckCircle size={14} className="text-white" />
                  <span>Fast & Easy Trading</span>
                </li>
              </ul>
            </div>

            {/* Testimonial */}
            <div className="mt-3 bg-white/10 backdrop-blur-md rounded-lg p-2.5 border border-white/20 animate-[fadeInUp_1.4s_ease-out]">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-black text-[10px]">⭐</span>
                </div>
                <div>
                  <p className="text-white/90 text-[10px] italic leading-snug">
                    "Nexarion transformed our import business. Connected with suppliers from 20+ countries!"
                  </p>
                  <p className="text-white/70 text-[9px] mt-1 font-semibold">— Sarah Mitchell</p>
                </div>
              </div>
            </div>

            {/* Success Metrics */}
            <div className="mt-3 grid grid-cols-2 gap-2 animate-[scaleIn_1.6s_ease-out]">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20 text-center">
                <p className="text-white font-black text-base">$2.5M+</p>
                <p className="text-white/80 text-[9px]">Monthly Trade</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20 text-center">
                <p className="text-white font-black text-base">98%</p>
                <p className="text-white/80 text-[9px]">Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 mt-auto flex items-center justify-center gap-3 text-white/90 text-[10px]">
            <div className="flex items-center gap-1">
              <CheckCircle size={12} />
              <span>Secure</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Lock size={12} />
              <span>Encrypted</span>
            </div>
            <span>•</span>
            <span>© 2026 Nexarion</span>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 p-4 flex flex-col justify-center bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-teal-100/40 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-100/40 rounded-full blur-xl"></div>
          
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden inline-flex items-center gap-3 mb-8 relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Globe className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-black text-xl text-gray-800">Nexarion</h1>
              <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Global Exports</p>
            </div>
          </Link>

          <h2 className="text-xl font-black text-gray-800 mb-1 relative z-10">Sign In</h2>
          <p className="text-gray-600 text-xs mb-4 relative z-10">Enter your credentials to access your account</p>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-teal-300 text-gray-700 font-semibold py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2 mb-3 hover:bg-white hover:shadow-lg relative z-10"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-3 z-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-50 text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative z-10">
            {/* Email */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full pl-4 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none transition-colors bg-white/80 backdrop-blur-sm focus:bg-white"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-4 pr-12 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none transition-colors bg-white/80 backdrop-blur-sm focus:bg-white"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mb-3">
              <Link to="/forgot-password" className="text-xs text-teal-600 hover:text-teal-700 font-semibold hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-xs text-gray-600 mt-3">
            Don't have an account?{' '}
            <Link to="/signup" className="text-teal-600 hover:text-teal-700 font-bold hover:underline">
              Sign Up
            </Link>
          </p>

          {/* Security & Trust Section */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-2 text-center border border-teal-100">
                <div className="w-8 h-8 mx-auto mb-1 bg-teal-100 rounded-full flex items-center justify-center">
                  <Lock className="text-teal-600" size={14} />
                </div>
                <p className="text-[9px] font-bold text-gray-700">SSL Secured</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-2 text-center border border-blue-100">
                <div className="w-8 h-8 mx-auto mb-1 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-blue-600" size={14} />
                </div>
                <p className="text-[9px] font-bold text-gray-700">Verified</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-2 text-center border border-purple-100">
                <div className="w-8 h-8 mx-auto mb-1 bg-purple-100 rounded-full flex items-center justify-center">
                  <Globe className="text-purple-600" size={14} />
                </div>
                <p className="text-[9px] font-bold text-gray-700">Global</p>
              </div>
            </div>
            <p className="text-center text-[10px] text-gray-500">Your data is protected with bank-level encryption</p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default LoginPage;
