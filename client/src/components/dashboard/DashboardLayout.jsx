import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FileText, 
  Truck, 
  Heart, 
  User, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', section: 'MAIN' },
    { icon: Package, label: 'Products', path: '/dashboard/products', section: 'MAIN' },
    { icon: ShoppingCart, label: 'Orders', path: '/dashboard/orders', section: 'MANAGE' },
    { icon: FileText, label: 'Quotes', path: '/dashboard/quotes', section: 'MANAGE' },
    { icon: Truck, label: 'Shipments', path: '/dashboard/shipments', section: 'MANAGE' },
    { icon: Heart, label: 'Favorites', path: '/dashboard/favorites', section: 'MANAGE' },
    { icon: User, label: 'Profile', path: '/dashboard/profile', section: 'ACCOUNT' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings', section: 'ACCOUNT' },
  ];

  const sections = ['MAIN', 'MANAGE', 'ACCOUNT'];

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 overflow-hidden">
      
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-r border-slate-700/50 transition-all duration-300 ease-in-out hidden lg:flex flex-col shadow-2xl`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Package className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="font-black text-lg text-white">Nexarion</h1>
                  <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wide">Dashboard</p>
                </div>
              </Link>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </div>

        {/* User Info */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-slate-700/50 animate-[fadeInUp_0.6s_ease-out]">
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/30">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <p className="text-xs text-emerald-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto scrollbar-hide">
          {sections.map((section, idx) => (
            <div key={section} className={idx > 0 ? 'mt-6' : ''}>
              {!sidebarCollapsed && (
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-3 mb-2">
                  {section}
                </p>
              )}
              {menuItems
                .filter(item => item.section === section)
                .map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200
                        ${active 
                          ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/30' 
                          : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                        }
                        ${sidebarCollapsed ? 'justify-center' : ''}
                      `}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <Icon size={20} className={active ? 'text-white' : ''} />
                      {!sidebarCollapsed && (
                        <span className="font-semibold text-sm">{item.label}</span>
                      )}
                    </Link>
                  );
                })}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-700/50">
          <button
            onClick={handleLogoutClick}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl w-full
              text-red-400 hover:text-white hover:bg-red-500/20 transition-all
              ${sidebarCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut size={20} />
            {!sidebarCollapsed && <span className="font-semibold text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          mobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileSidebarOpen(false)}
      >
        <aside
          className={`w-64 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 h-full transform transition-transform duration-300 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Same content as desktop sidebar */}
          <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="text-white" size={24} />
              </div>
              <div>
                <h1 className="font-black text-lg text-white">Nexarion</h1>
                <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wide">Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/30">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <p className="text-xs text-emerald-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-6 overflow-y-auto scrollbar-hide">
            {sections.map((section, idx) => (
              <div key={section} className={idx > 0 ? 'mt-6' : ''}>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-3 mb-2">
                  {section}
                </p>
                {menuItems
                  .filter(item => item.section === section)
                  .map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all
                          ${active 
                            ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/30' 
                            : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                          }
                        `}
                      >
                        <Icon size={20} />
                        <span className="font-semibold text-sm">{item.label}</span>
                      </Link>
                    );
                  })}
              </div>
            ))}
          </nav>

          <div className="p-3 border-t border-slate-700/50">
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-red-400 hover:text-white hover:bg-red-500/20 transition-all"
            >
              <LogOut size={20} />
              <span className="font-semibold text-sm">Logout</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={24} className="text-gray-700" />
              </button>

              {/* Search Bar */}
              <div className="hidden md:flex items-center flex-1 max-w-lg mx-4">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search products, orders..."
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-3">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell size={22} className="text-gray-700" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Menu (Desktop) */}
                <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-gray-200">
                  <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogoutClick}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-rose-700 transition-all shadow-md hover:shadow-lg"
                  title="Logout"
                >
                  <LogOut size={18} />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-scaleIn">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <LogOut className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-gray-900 text-center mb-2">Confirm Logout</h2>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to logout? You'll need to sign in again to access your dashboard.
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
    </div>
  );
};

export default DashboardLayout;
