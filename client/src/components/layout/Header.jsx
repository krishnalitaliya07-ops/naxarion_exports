import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { Globe, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
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
            ))}

            {/* Admin Button */}
            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/admin"
                className="text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-all px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                <Shield size={16} />
                Admin
              </Link>
            )}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-6 py-2.5 bg-white/10 backdrop-blur-sm border-2 border-white/40 text-white rounded-xl hover:bg-white hover:text-slate-900 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-2xl transform hover:scale-105"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:shadow-2xl transform hover:scale-105 transition-all"
                >
                  Logout
                </button>
              </>
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
                      handleLogout();
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
  );
};

export default Header;
