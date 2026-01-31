import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { logout } from '../../store/slices/authSlice';
import nexarionLogo from '../../assets/nexarion_logo.png';

const AdminDashboardLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Dispatch logout
    dispatch(logout());
    toast.success('Logged out successfully');
    // Hard navigate to ensure clean state
    window.location.href = '/admin/login';
  };

  const navItems = [
    {
      section: 'Overview',
      items: [
        { path: '/admin/dashboard', icon: 'fa-chart-line', label: 'Dashboard', gradient: 'from-emerald-500 to-teal-600', bgLight: 'bg-emerald-50', iconColor: 'text-emerald-500' }
      ]
    },
    {
      section: 'Management',
      items: [
        { path: '/admin/users', icon: 'fa-users', label: 'Users', gradient: 'from-blue-500 to-indigo-600', bgLight: 'bg-blue-50', iconColor: 'text-blue-500' },
        { path: '/admin/suppliers', icon: 'fa-building', label: 'Suppliers', gradient: 'from-purple-500 to-violet-600', bgLight: 'bg-purple-50', iconColor: 'text-purple-500' },
        { path: '/admin/products', icon: 'fa-box', label: 'Products', gradient: 'from-orange-500 to-amber-600', bgLight: 'bg-orange-50', iconColor: 'text-orange-500' },
        { path: '/admin/orders', icon: 'fa-shopping-cart', label: 'Orders', gradient: 'from-pink-500 to-rose-600', bgLight: 'bg-pink-50', iconColor: 'text-pink-500' }
      ]
    },
    {
      section: 'Operations',
      items: [
        { path: '/admin/shipments', icon: 'fa-shipping-fast', label: 'Shipping', gradient: 'from-cyan-500 to-teal-600', bgLight: 'bg-cyan-50', iconColor: 'text-cyan-500' },
        { path: '/admin/payments', icon: 'fa-dollar-sign', label: 'Payments', gradient: 'from-green-500 to-emerald-600', bgLight: 'bg-green-50', iconColor: 'text-green-500' },
        { path: '/admin/quotes', icon: 'fa-file-invoice', label: 'Quote Requests', gradient: 'from-violet-500 to-purple-600', bgLight: 'bg-violet-50', iconColor: 'text-violet-500' }
      ]
    },
    {
      section: 'Inventory',
      items: [
        { path: '/admin/categories', icon: 'fa-tags', label: 'Categories', gradient: 'from-amber-500 to-yellow-600', bgLight: 'bg-amber-50', iconColor: 'text-amber-500' },
        { path: '/admin/brands', icon: 'fa-copyright', label: 'Brands', gradient: 'from-rose-500 to-red-600', bgLight: 'bg-rose-50', iconColor: 'text-rose-500' }
      ]
    },
    {
      section: 'System',
      items: [
        { path: '/admin/contacts', icon: 'fa-envelope', label: 'Contact Messages', gradient: 'from-indigo-500 to-blue-600', bgLight: 'bg-indigo-50', iconColor: 'text-indigo-500' },
        { path: '/admin/reports', icon: 'fa-chart-bar', label: 'Reports', gradient: 'from-sky-500 to-blue-600', bgLight: 'bg-sky-50', iconColor: 'text-sky-500' },
        { path: '/admin/settings', icon: 'fa-cog', label: 'Settings', gradient: 'from-slate-500 to-gray-600', bgLight: 'bg-slate-100', iconColor: 'text-slate-500' }
      ]
    }
  ];

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      
      {/* LEFT SIDEBAR - Fixed/Sticky */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl flex flex-col transition-all duration-300 h-screen sticky top-0 flex-shrink-0`}>
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-700/50">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 overflow-hidden">
                <img src={nexarionLogo} alt="Nexarion" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-white">Nexarion</h1>
                <p className="text-[10px] text-emerald-400 font-semibold">Admin Panel</p>
              </div>
            </div>
          ) : (
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 mx-auto overflow-hidden">
              <img src={nexarionLogo} alt="Nexarion" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Sidebar Navigation - Scrollable without visible scrollbar */}
        <nav className="flex-1 p-4 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="space-y-1">
            {navItems.map((section, idx) => (
              <div key={idx} className={idx > 0 ? 'pt-5' : ''}>
                {isSidebarOpen && (
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 mb-3">
                    {section.section}
                  </p>
                )}
                
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all mb-1 ${
                        isActive
                          ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-${item.gradient.split('-')[1]}-500/30`
                          : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                      } ${!isSidebarOpen ? 'justify-center' : ''}`
                    }
                    title={!isSidebarOpen ? item.label : ''}
                  >
                    {({ isActive }) => (
                      <>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-white/20' : `${item.bgLight}`}`}>
                          <i className={`fas ${item.icon} text-sm ${isActive ? 'text-white' : item.iconColor}`}></i>
                        </div>
                        {isSidebarOpen && <span>{item.label}</span>}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        </nav>

        {/* Sidebar Toggle */}
        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-bold text-sm transition-all mb-2"
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <i className={`fas fa-${isSidebarOpen ? 'angle-left' : 'angle-right'}`}></i>
            {isSidebarOpen && <span>Collapse</span>}
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/30"
          >
            <i className="fas fa-arrow-left"></i>
            {isSidebarOpen && <span>Back to Site</span>}
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto h-screen">
        
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm">
                <NavLink to="/" className="text-slate-600 hover:text-emerald-600 transition">
                  Home
                </NavLink>
                <i className="fas fa-chevron-right text-slate-400 text-xs"></i>
                <span className="text-slate-900 font-semibold">Admin Panel</span>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-3">
                <div className="text-sm text-slate-700">
                  Welcome, <strong className="text-slate-900">{user?.name || 'Nexarion Admin'}</strong>
                </div>
                <button className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-all relative">
                  <i className="fas fa-bell text-slate-600 text-sm"></i>
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                    3
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold text-sm transition-all"
                  title="Logout"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Outlet for nested routes */}
        <div className="p-8">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardLayout;
