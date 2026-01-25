import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { Globe, Shield, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const Header = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
        setIsRotating(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setIsRotating(!isRotating);
  };

  const handleLogoutClick = () => {
    setShowProfileDropdown(false);
    setIsRotating(false);
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    // Clear localStorage first
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Then dispatch logout
    dispatch(logout());
    setShowLogoutModal(false);
    // Hard navigate to home to ensure clean state
    window.location.href = '/';
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  // Format account type
  const getAccountType = () => {
    if (!user || !user.role) return 'USER';
    return user.role.toUpperCase();
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 shadow-lg border-b border-emerald-400/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[60px]">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Globe className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white">Nexarion</h1>
              <p className="text-[10px] text-emerald-400 font-semibold">Global Exports</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative text-sm text-slate-200 font-semibold hover:text-emerald-400 transition-colors py-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[3px] after:bg-gradient-to-r after:from-emerald-400 after:to-yellow-400 after:rounded-full hover:after:w-full after:transition-all"
              >
                {link.name}
              </Link>
            ))}          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Avatar Button */}
                <button
                  onClick={handleProfileClick}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-emerald-400/40 rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  <div
                    className={`w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md transition-transform duration-500 ${
                      isRotating ? 'rotate-[360deg]' : 'rotate-0'
                    }`}
                  >
                    {getUserInitials()}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-xs leading-tight">{user?.name || 'User'}</p>
                    <p className="text-emerald-400 text-[10px] font-medium leading-tight">{getAccountType()}</p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700 animate-fadeIn z-50">
                    {/* Notification Badge */}
                    <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-slate-800"></div>
                    
                    {/* User Info Header */}
                    <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 p-3 border-b border-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {getUserInitials()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold text-sm truncate">{user?.name || 'User'}</p>
                          <p className="text-emerald-400 text-[10px] font-semibold">{getAccountType()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-1.5">
                      <Link
                        to="/dashboard"
                        onClick={() => {
                          setShowProfileDropdown(false);
                          setIsRotating(false);
                        }}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-all group"
                      >
                        <div className="w-7 h-7 bg-slate-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <LayoutDashboard className="text-emerald-400" size={16} />
                        </div>
                        <span className="text-white font-semibold text-xs">Dashboard</span>
                      </Link>

                      <button
                        onClick={handleLogoutClick}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-700/50 transition-all group"
                      >
                        <div className="w-7 h-7 bg-slate-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <LogOut className="text-red-400" size={16} />
                        </div>
                        <span className="text-white font-semibold text-xs">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2.5 bg-white/10 backdrop-blur-sm border-2 border-white/40 text-white rounded-xl hover:bg-white hover:text-slate-900 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-2xl transform hover:scale-105"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:shadow-2xl transform hover:scale-105 transition-all flex items-center gap-2"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-700">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-200 hover:text-emerald-400 font-semibold transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-6 py-2.5 bg-white/10 border-2 border-white/40 text-white rounded-xl font-bold"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogoutClick();
                      setMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2.5 rounded-xl font-bold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-6 py-2.5 bg-white/10 border-2 border-white/40 text-white rounded-xl font-bold"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-center"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>

    {/* Logout Confirmation Modal */}
    {showLogoutModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-scaleIn">
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-gray-900 text-center mb-2">Confirm Logout</h2>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to logout? You'll need to sign in again to access your account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleLogoutCancel}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-red-200 hover:shadow-xl"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default Header;
