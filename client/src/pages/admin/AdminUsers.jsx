import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { apiConnector } from '../../services/apiconnector';
import { adminEndpoints } from '../../services/apis';

const { GET_ALL_USERS_API, DELETE_USER_API, UPDATE_USER_API, GET_USER_BY_ID_API, CREATE_ADMIN_USER_API, TOGGLE_USER_ACTIVE_API } = adminEndpoints;

const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    importers: 0,
    exporters: 0,
    pending: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    userType: '',
    status: '',
    country: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    company: '',
    country: '',
    role: 'admin',
    adminRole: 'manager'
  });

  useEffect(() => {
    fetchUsers();
  }, [filters, currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(filters.search && { search: filters.search }),
        ...(filters.userType && { role: filters.userType }),
        ...(filters.status && { status: filters.status }),
        ...(filters.country && { country: filters.country })
      });

      const response = await apiConnector(
        'GET',
        `${GET_ALL_USERS_API}?${queryParams}`,
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (response.data.success) {
        setUsers(response.data.data.users || []);
        setStats(response.data.data.stats || {
          totalUsers: 0,
          importers: 0,
          exporters: 0,
          pending: 0
        });
        setTotalPages(response.data.data.pages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      search: '',
      userType: '',
      status: '',
      country: ''
    });
    setCurrentPage(1);
  };

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      company: user.company || '',
      country: user.country || '',
      role: user.role || 'customer',
      isActive: user.isActive
    });
    setEditModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiConnector(
        'DELETE',
        DELETE_USER_API(selectedUser._id),
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (response.data.success) {
        toast.success('User deleted successfully');
        setDeleteModalOpen(false);
        setSelectedUser(null);
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await apiConnector(
        'PUT',
        UPDATE_USER_API(selectedUser._id),
        editFormData,
        { Authorization: `Bearer ${token}` }
      );

      if (response.data.success) {
        toast.success('User updated successfully');
        setEditModalOpen(false);
        setSelectedUser(null);
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error(error?.response?.data?.message || 'Failed to update user');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await apiConnector(
        'POST',
        CREATE_ADMIN_USER_API,
        newUserData,
        { Authorization: `Bearer ${token}` }
      );

      if (response.data.success) {
        toast.success('Admin user created successfully');
        setAddUserModalOpen(false);
        setNewUserData({
          name: '',
          email: '',
          password: '',
          phone: '',
          company: '',
          country: '',
          role: 'admin',
          adminRole: 'manager'
        });
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to create user:', error);
      toast.error(error?.response?.data?.message || 'Failed to create user');
    }
  };

  const handleToggleSuspend = async (user) => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiConnector(
        'PATCH',
        TOGGLE_USER_ACTIVE_API(user._id),
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (response.data.success) {
        toast.success(`User ${user.isActive ? 'suspended' : 'activated'} successfully`);
        fetchUsers(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      toast.error(error?.response?.data?.message || 'Failed to update user status');
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (index) => {
    const colors = [
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-pink-600',
      'from-cyan-500 to-blue-600',
      'from-orange-500 to-red-600',
      'from-emerald-500 to-teal-600'
    ];
    return colors[index % colors.length];
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <i className="fas fa-circle-notch fa-spin text-4xl text-blue-500"></i>
          <p className="text-slate-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-users text-white text-xl"></i>
              </div>
              Users Management
            </h1>
            <p className="text-sm text-slate-600">Manage all importers, exporters, and customers</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white border-2 border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:border-blue-500 hover:text-blue-600 transition-all flex items-center gap-2">
              <i className="fas fa-download"></i>
              Export CSV
            </button>
            <button 
              onClick={() => setAddUserModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-xl transition-all flex items-center gap-2"
            >
              <i className="fas fa-user-plus"></i>
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200 hover:border-blue-500 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-users text-blue-600 text-xl"></i>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg">
              <i className="fas fa-arrow-up text-xs"></i> 8.3%
            </span>
          </div>
          <p className="text-sm font-bold text-slate-600 mb-1">Total Users</p>
          <p className="text-3xl font-black text-slate-900">{stats.totalUsers?.toLocaleString() || 0}</p>
        </div>

        {/* Importers */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200 hover:border-emerald-500 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-arrow-down text-emerald-600 text-xl"></i>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">58%</span>
          </div>
          <p className="text-sm font-bold text-slate-600 mb-1">Importers</p>
          <p className="text-3xl font-black text-slate-900">{stats.importers?.toLocaleString() || 0}</p>
        </div>

        {/* Exporters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200 hover:border-purple-500 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-arrow-up text-purple-600 text-xl"></i>
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-lg">42%</span>
          </div>
          <p className="text-sm font-bold text-slate-600 mb-1">Exporters</p>
          <p className="text-3xl font-black text-slate-900">{stats.exporters?.toLocaleString() || 0}</p>
        </div>

        {/* Pending Verifications */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200 hover:border-amber-500 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-clock text-amber-600 text-xl"></i>
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-lg">Urgent</span>
          </div>
          <p className="text-sm font-bold text-slate-600 mb-1">Pending</p>
          <p className="text-3xl font-black text-slate-900">{stats.pending?.toLocaleString() || 0}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                placeholder="Search by name, email, company..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* User Type Filter */}
          <select
            value={filters.userType}
            onChange={(e) => setFilters({ ...filters, userType: e.target.value })}
            className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:border-blue-500 focus:outline-none transition-all"
          >
            <option value="">All Users</option>
            <option value="importer">Importers</option>
            <option value="exporter">Exporters</option>
            <option value="customer">Customers</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:border-blue-500 focus:outline-none transition-all"
          >
            <option value="">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* Country Filter */}
          <select
            value={filters.country}
            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
            className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:border-blue-500 focus:outline-none transition-all"
          >
            <option value="">All Countries</option>
            <option value="United States">United States</option>
            <option value="China">China</option>
            <option value="India">India</option>
            <option value="Germany">Germany</option>
          </select>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all"
          >
            <i className="fas fa-redo text-xs"></i> Reset
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">
              All Users ({stats.totalUsers?.toLocaleString() || 0})
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-600">
                Showing <strong>{(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, stats.totalUsers)}</strong> of <strong>{stats.totalUsers}</strong>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 bg-white border border-slate-300 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-all disabled:opacity-50"
                >
                  <i className="fas fa-chevron-left text-slate-600 text-xs"></i>
                </button>
                {[...Array(Math.min(3, totalPages))].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                      currentPage === i + 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 bg-white border border-slate-300 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-all disabled:opacity-50"
                >
                  <i className="fas fa-chevron-right text-slate-600 text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-black text-slate-700 uppercase">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                </th>
                <th className="text-left px-6 py-4 text-xs font-black text-slate-700 uppercase">User</th>
                <th className="text-left px-6 py-4 text-xs font-black text-slate-700 uppercase">Company</th>
                <th className="text-left px-6 py-4 text-xs font-black text-slate-700 uppercase">Type</th>
                <th className="text-left px-6 py-4 text-xs font-black text-slate-700 uppercase">Country</th>
                <th className="text-left px-6 py-4 text-xs font-black text-slate-700 uppercase">Status</th>
                <th className="text-left px-6 py-4 text-xs font-black text-slate-700 uppercase">Joined</th>
                <th className="text-left px-6 py-4 text-xs font-black text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-all">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${getAvatarColor(index)} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white font-bold text-sm">{getInitials(user.name)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{user.name || 'N/A'}</p>
                          <p className="text-xs text-slate-600">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900">{user.company || 'N/A'}</p>
                      <p className="text-xs text-slate-600">{user.industry || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                          user.role === 'importer' ? 'bg-emerald-100 text-emerald-700' :
                          user.role === 'exporter' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {user.role === 'importer' && <i className="fas fa-arrow-down"></i>}
                          {user.role === 'exporter' && <i className="fas fa-arrow-up"></i>}
                          {user.role === 'admin' && <i className="fas fa-shield-alt"></i>}
                          <span className="whitespace-nowrap capitalize">{user.role || 'customer'}</span>
                        </span>
                        {user.role === 'admin' && user.adminRole && (
                          <span className="block mt-1 text-xs text-slate-600 font-semibold capitalize">
                            <i className="fas fa-chevron-right text-xs mr-1"></i>
                            {user.adminRole.replace('-', ' ')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{user.countryFlag || '🌍'}</span>
                        <span className="text-sm font-semibold text-slate-700">{user.country || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 w-fit ${
                        user.isActive ? 'bg-green-100 text-green-700' :
                        user.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {user.isActive ? (
                          <><i className="fas fa-check-circle"></i> Verified</>
                        ) : user.status === 'pending' ? (
                          <><i className="fas fa-clock"></i> Pending</>
                        ) : (
                          <><i className="fas fa-ban"></i> Suspended</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleViewUser(user)}
                          className="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg flex items-center justify-center transition-all" 
                          title="View Details"
                        >
                          <i className="fas fa-eye text-xs"></i>
                        </button>
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="w-8 h-8 bg-emerald-100 hover:bg-emerald-200 text-emerald-600 rounded-lg flex items-center justify-center transition-all" 
                          title="Edit"
                        >
                          <i className="fas fa-edit text-xs"></i>
                        </button>
                        <button 
                          onClick={() => handleToggleSuspend(user)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            user.isActive 
                              ? 'bg-amber-100 hover:bg-amber-200 text-amber-600' 
                              : 'bg-green-100 hover:bg-green-200 text-green-600'
                          }`}
                          title={user.isActive ? 'Suspend User' : 'Activate User'}
                        >
                          <i className={`fas ${user.isActive ? 'fa-user-slash' : 'fa-user-check'} text-xs`}></i>
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user)}
                          className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center transition-all" 
                          title="Delete"
                        >
                          <i className="fas fa-trash text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <i className="fas fa-users text-6xl text-slate-300"></i>
                      <p className="text-slate-600">No users found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View User Modal */}
      {viewModalOpen && selectedUser && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setViewModalOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">User Details</h3>
                <button onClick={() => setViewModalOpen(false)} className="text-white/80 hover:text-white">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">{getInitials(selectedUser.name)}</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{selectedUser.name}</h4>
                  <p className="text-slate-600">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Phone</label>
                  <p className="text-sm font-semibold text-slate-900 mt-1">{selectedUser.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Company</label>
                  <p className="text-sm font-semibold text-slate-900 mt-1">{selectedUser.company || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Country</label>
                  <p className="text-sm font-semibold text-slate-900 mt-1">{selectedUser.country || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">User Type</label>
                  <p className="text-sm font-semibold text-slate-900 mt-1 capitalize">{selectedUser.role || 'customer'}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                  <p className={`text-sm font-bold mt-1 ${selectedUser.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Joined Date</label>
                  <p className="text-sm font-semibold text-slate-900 mt-1">
                    {new Date(selectedUser.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editModalOpen && selectedUser && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setEditModalOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Edit User</h3>
                <button onClick={() => setEditModalOpen(false)} className="text-white/80 hover:text-white">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone</label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={editFormData.company}
                    onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={editFormData.country}
                    onChange={(e) => setEditFormData({ ...editFormData, country: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">User Type</label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="customer">Customer</option>
                    <option value="importer">Importer</option>
                    <option value="exporter">Exporter</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editFormData.isActive}
                  onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300"
                />
                <label htmlFor="isActive" className="text-sm font-bold text-slate-700">Active User</label>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  <i className="fas fa-save mr-2"></i>
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedUser && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setDeleteModalOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 text-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                <i className="fas fa-exclamation-triangle text-3xl"></i>
                <h3 className="text-2xl font-bold">Delete User</h3>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-slate-700 mb-2">
                Are you sure you want to delete <strong>{selectedUser.name}</strong>?
              </p>
              <p className="text-sm text-slate-600 mb-6">
                This action cannot be undone. The user will be permanently removed from the database and logged out from all sessions.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  <i className="fas fa-trash mr-2"></i>
                  Delete User
                </button>
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {addUserModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setAddUserModalOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Add New Admin User</h3>
                <button onClick={() => setAddUserModalOpen(false)} className="text-white/80 hover:text-white">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <p className="text-sm text-white/80 mt-2">Create admin user with specific role and permissions</p>
            </div>
            
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newUserData.name}
                    onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="Min. 6 characters"
                  minLength={6}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={newUserData.phone}
                    onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={newUserData.company}
                    onChange={(e) => setNewUserData({ ...newUserData, company: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="Company Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Country</label>
                <input
                  type="text"
                  value={newUserData.country}
                  onChange={(e) => setNewUserData({ ...newUserData, country: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="United States"
                />
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <i className="fas fa-shield-alt text-blue-600"></i>
                  Role & Permissions
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">User Type</label>
                    <select
                      value={newUserData.role}
                      onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    >
                      <option value="admin">Admin</option>
                      <option value="customer">Customer</option>
                      <option value="importer">Importer</option>
                      <option value="exporter">Exporter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Admin Role</label>
                    <select
                      value={newUserData.adminRole}
                      onChange={(e) => setNewUserData({ ...newUserData, adminRole: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none"
                      disabled={newUserData.role !== 'admin'}
                    >
                      <option value="manager">Manager</option>
                      <option value="super-admin">Super Admin</option>
                      <option value="cto">CTO</option>
                      <option value="hr">HR</option>
                      <option value="sales">Sales</option>
                      <option value="support">Support</option>
                      <option value="accountant">Accountant</option>
                      <option value="labour">Labour</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <i className="fas fa-info-circle text-blue-500 mr-1"></i>
                    Admin users will have access to the admin dashboard with permissions based on their role. 
                    Super Admin has full access, while other roles have restricted permissions.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  <i className="fas fa-user-plus mr-2"></i>
                  Create Admin User
                </button>
                <button
                  type="button"
                  onClick={() => setAddUserModalOpen(false)}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
