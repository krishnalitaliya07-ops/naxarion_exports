import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  toggleBrandActive,
  toggleBrandFeatured
} from '../../services/operations/brandAPI';

const AdminBrands = () => {
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, brandId: null });
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
    website: '',
    country: '',
    isActive: true,
    isFeatured: false
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchBrands();
  }, [filters]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await getAllBrands(token, filters);

      if (response.success) {
        setBrands(response.data || []);
        setPagination({
          page: response.page,
          pages: response.pages,
          total: response.total
        });
      }
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingBrand) {
        await updateBrand(editingBrand._id, formData, token);
      } else {
        await createBrand(formData, token);
      }
      
      setShowModal(false);
      resetForm();
      fetchBrands();
    } catch (error) {
      console.error('Failed to save brand:', error);
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || '',
      website: brand.website || '',
      country: brand.country || '',
      isActive: brand.isActive,
      isFeatured: brand.isFeatured
    });
    setShowModal(true);
  };

  const handleDelete = async (brandId) => {
    try {
      await deleteBrand(brandId, token);
      setDeleteModal({ show: false, brandId: null });
      fetchBrands();
    } catch (error) {
      console.error('Failed to delete brand:', error);
    }
  };

  const handleToggleActive = async (brandId) => {
    try {
      await toggleBrandActive(brandId, token);
      fetchBrands();
    } catch (error) {
      console.error('Failed to toggle brand:', error);
    }
  };

  const handleToggleFeatured = async (brandId) => {
    try {
      await toggleBrandFeatured(brandId, token);
      fetchBrands();
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      website: '',
      country: '',
      isActive: true,
      isFeatured: false
    });
    setEditingBrand(null);
  };

  if (loading && brands.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <i className="fas fa-circle-notch fa-spin text-4xl text-orange-500"></i>
          <p className="text-slate-600">Loading brands...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <i className="fas fa-tag text-2xl"></i>
              </div>
              <h2 className="text-3xl font-bold">Brands</h2>
            </div>
            <p className="text-white/90 ml-15">Manage product brands</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-white text-teal-600 px-6 py-3 rounded-xl font-semibold hover:bg-teal-50 transition-all flex items-center gap-2 shadow-lg"
          >
            <i className="fas fa-plus"></i>
            Add Brand
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-500"></i>
          <input
            type="text"
            placeholder="Search brands..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        
        <select
          value={filters.isActive}
          onChange={(e) => setFilters({ ...filters, isActive: e.target.value, page: 1 })}
          className="px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <div className="flex items-center gap-2 px-4 py-3 bg-teal-50 rounded-lg border border-teal-200">
          <i className="fas fa-info-circle text-teal-600"></i>
          <span className="text-teal-700 font-medium">{pagination.total} total brands</span>
        </div>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <div key={brand._id} className="bg-gradient-to-br from-white to-teal-50/30 rounded-xl border border-teal-100 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center mb-3 shadow-md">
                  <i className="fas fa-tag text-white text-xl"></i>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">{brand.name}</h3>
                {brand.country && (
                  <p className="text-sm text-teal-700 flex items-center gap-1">
                    <i className="fas fa-map-marker-alt"></i>
                    {brand.country}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleActive(brand._id)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    brand.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {brand.isActive ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={() => handleToggleFeatured(brand._id)}
                  className={`px-2 py-1 rounded-lg text-xs ${
                    brand.isFeatured
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                  title={brand.isFeatured ? 'Featured' : 'Not Featured'}
                >
                  <i className="fas fa-star"></i>
                </button>
              </div>
            </div>

            {brand.description && (
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{brand.description}</p>
            )}

            {brand.website && (
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 mb-4 block"
              >
                <i className="fas fa-external-link-alt mr-1"></i>
                Visit Website
              </a>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="text-xs text-slate-500">
                {brand.productCount || 0} products
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(brand)}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-semibold hover:bg-blue-600 transition-colors"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => setDeleteModal({ show: true, brandId: brand._id })}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {brands.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <i className="fas fa-copyright text-6xl text-slate-300 mb-4"></i>
          <p className="text-slate-600 font-semibold">No brands found</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                {editingBrand ? 'Edit Brand' : 'Create Brand'}
              </h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-slate-400 hover:text-slate-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., Nike"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Brief brand description..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., USA"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-semibold text-slate-700">Active</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="isFeatured" className="text-sm font-semibold text-slate-700">Featured</label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  {editingBrand ? 'Update' : 'Create'}
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
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Brand</h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this brand? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ show: false, brandId: null })}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.brandId)}
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

export default AdminBrands;
