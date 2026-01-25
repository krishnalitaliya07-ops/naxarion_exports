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
        { path: '/admin/dashboard', icon: 'fa-chart-line', label: 'Dashboard', gradient: 'from-emerald-500 to-teal-600' }
      ]
    },
    {
      section: 'Management',
      items: [
        { path: '/admin/users', icon: 'fa-users', label: 'Users', color: 'blue-500' },
        { path: '/admin/suppliers', icon: 'fa-building', label: 'Suppliers', color: 'purple-500' },
        { path: '/admin/products', icon: 'fa-box', label: 'Products', color: 'orange-500' },
        { path: '/admin/orders', icon: 'fa-shopping-cart', label: 'Orders', color: 'pink-500' }
      ]
    },
    {
      section: 'Operations',
      items: [
        { path: '/admin/shipments', icon: 'fa-shipping-fast', label: 'Shipping', color: 'cyan-500' },
        { path: '/admin/payments', icon: 'fa-dollar-sign', label: 'Payments', color: 'green-500' },
        { path: '/admin/quotes', icon: 'fa-file-invoice', label: 'Quote Requests', color: 'violet-500' }
      ]
    },
    {
      section: 'System',
      items: [
        { path: '/admin/contacts', icon: 'fa-envelope', label: 'Contact Messages', color: 'indigo-500' },
        { path: '/admin/reports', icon: 'fa-chart-bar', label: 'Reports', color: 'indigo-500' },
        { path: '/admin/settings', icon: 'fa-cog', label: 'Settings', color: 'slate-500' }
      ]
    }
  ];

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50">
      
      {/* LEFT SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 shadow-lg flex flex-col transition-all duration-300`}>
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-200">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                <img src={nexarionLogo} alt="Nexarion" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-slate-900">Nexarion</h1>
                <p className="text-[10px] text-emerald-600 font-semibold">Admin Panel</p>
              </div>
            </div>
          ) : (
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg mx-auto overflow-hidden">
              <img src={nexarionLogo} alt="Nexarion" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((section, idx) => (
              <div key={idx} className={idx > 0 ? 'pt-4' : ''}>
                {isSidebarOpen && (
                  <p className="text-xs font-bold text-slate-400 uppercase px-4 mb-2">
                    {section.section}
                  </p>
                )}
                
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                        isActive
                          ? item.gradient
                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                            : `bg-${item.color}/10 text-${item.color}`
                          : 'text-slate-700 hover:bg-slate-100'
                      } ${!isSidebarOpen ? 'justify-center' : ''}`
                    }
                    title={!isSidebarOpen ? item.label : ''}
                  >
                    <i className={`fas ${item.icon} ${item.color && !item.gradient ? `text-${item.color}` : ''}`}></i>
                    {isSidebarOpen && <span>{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        </nav>

        {/* Sidebar Toggle */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all mb-2"
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <i className={`fas fa-${isSidebarOpen ? 'angle-left' : 'angle-right'}`}></i>
            {isSidebarOpen && <span>Collapse</span>}
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all"
          >
            <i className="fas fa-arrow-left"></i>
            {isSidebarOpen && <span>Back to Site</span>}
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto">
        
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
