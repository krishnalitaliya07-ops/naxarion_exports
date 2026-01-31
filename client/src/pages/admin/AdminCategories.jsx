import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryActive
} from '../../services/operations/categoryAPI';

const AdminCategories = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, categoryId: null });
  const [filters, setFilters] = useState({
    search: '',
    isActive: '',
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'fas fa-box',
    isActive: true
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCategories();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getAdminCategories(token, filters);

      if (response.success) {
        setCategories(response.data || []);
        setPagination({
          page: response.page,
          pages: response.pages,
          total: response.total
        });
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, formData, token);
      } else {
        await createCategory(formData, token);
      }
      
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || 'fas fa-box',
      isActive: category.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    try {
      await deleteCategory(categoryId, token);
      setDeleteModal({ show: false, categoryId: null });
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const handleToggleActive = async (categoryId) => {
    try {
      await toggleCategoryActive(categoryId, token);
      fetchCategories();
    } catch (error) {
      console.error('Failed to toggle category:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: 'fas fa-box',
      isActive: true
    });
    setEditingCategory(null);
  };

  const iconOptions = [
    'fas fa-box',
    'fas fa-tshirt',
    'fas fa-laptop',
    'fas fa-mobile-alt',
    'fas fa-home',
    'fas fa-couch',
    'fas fa-utensils',
    'fas fa-car',
    'fas fa-book',
    'fas fa-heartbeat',
    'fas fa-dumbbell',
    'fas fa-gamepad',
    'fas fa-music',
    'fas fa-paint-brush',
    'fas fa-tools',
    'fas fa-leaf',
    'fas fa-baby'
  ];

  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <i className="fas fa-circle-notch fa-spin text-4xl text-orange-500"></i>
          <p className="text-slate-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <i className="fas fa-layer-group text-2xl"></i>
              </div>
              <h2 className="text-3xl font-bold">Categories</h2>
            </div>
            <p className="text-white/90 ml-15">Manage product categories</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-lg"
          >
            <i className="fas fa-plus"></i>
            Add Category
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-500"></i>
          <input
            type="text"
            placeholder="Search categories..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <select
          value={filters.isActive}
          onChange={(e) => setFilters({ ...filters, isActive: e.target.value, page: 1 })}
          className="px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <div className="flex items-center gap-2 px-4 py-3 bg-indigo-50 rounded-lg border border-indigo-200">
          <i className="fas fa-info-circle text-indigo-600"></i>
          <span className="text-indigo-700 font-medium">{pagination.total} total categories</span>
        </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-indigo-900 uppercase">Icon</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-indigo-900 uppercase">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-indigo-900 uppercase">Description</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-indigo-900 uppercase">Products</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-indigo-900 uppercase">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-indigo-900 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-indigo-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
                      <i className={`${category.icon} text-white`}></i>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{category.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 line-clamp-2">{category.description || 'No description'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                      {category.productCount || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(category._id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        category.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {category.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-semibold hover:bg-blue-600 transition-colors"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => setDeleteModal({ show: true, categoryId: category._id })}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors"
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-tags text-6xl text-slate-300 mb-4"></i>
              <p className="text-slate-600 font-semibold">No categories found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-slate-200">
            <button
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              disabled={filters.page === 1}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            <span className="px-4 py-2 text-sm font-semibold text-slate-700">
              Page {pagination.page} of {pagination.pages}
            </span>
            
            <button
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={filters.page === pagination.pages}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., Electronics"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Brief category description..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <i className={`${formData.icon} text-orange-600`}></i>
                  </div>
                  <span>Preview</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-slate-700">
                  Active
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-exclamation-triangle text-3xl text-red-600"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Category</h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this category? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ show: false, categoryId: null })}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.categoryId)}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
