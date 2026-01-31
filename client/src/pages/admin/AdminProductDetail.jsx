import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  getAdminProductById,
  deleteAdminProduct,
  approveProduct,
  rejectProduct,
  toggleProductActive
} from '../../services/operations/adminProductAPI';

const AdminProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('specifications');
  const [selectedImage, setSelectedImage] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getAdminProductById(id, token);
      if (response.success) {
        setProduct(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Failed to load product details');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAdminProduct(id, token);
      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleApprove = async () => {
    try {
      await approveProduct(id, token);
      fetchProduct();
    } catch (error) {
      console.error('Failed to approve product:', error);
    }
  };

  const handleReject = async () => {
    try {
      await rejectProduct(id, token);
      fetchProduct();
    } catch (error) {
      console.error('Failed to reject product:', error);
    }
  };

  const handleToggleActive = async () => {
    try {
      await toggleProductActive(id, token);
      fetchProduct();
    } catch (error) {
      console.error('Failed to toggle product status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <i className="fas fa-circle-notch fa-spin text-4xl text-orange-500"></i>
          <p className="text-slate-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <i className="fas fa-box-open text-6xl text-slate-300"></i>
        <p className="text-slate-600">Product not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm">
          <button 
            onClick={() => navigate('/admin/products')}
            className="text-slate-600 hover:text-orange-600 transition-colors"
          >
            Products
          </button>
          <i className="fas fa-chevron-right text-slate-400 text-xs"></i>
          <span className="text-slate-900 font-semibold">{product.name}</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Status Badge */}
            <span className={`px-4 py-2 rounded-xl text-sm font-bold ${
              product.isApproved === 'approved' ? 'bg-emerald-100 text-emerald-700' :
              product.isApproved === 'rejected' ? 'bg-red-100 text-red-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {product.isApproved === 'approved' ? '✓ Approved' :
               product.isApproved === 'rejected' ? '✗ Rejected' : '⏳ Pending'}
            </span>

            {/* Active Status */}
            <button
              onClick={handleToggleActive}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                product.isActive 
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <i className={`fas fa-${product.isActive ? 'eye' : 'eye-slash'} mr-2`}></i>
              {product.isActive ? 'Active' : 'Inactive'}
            </button>

            {product.isFeatured && (
              <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-sm font-bold">
                <i className="fas fa-star mr-2"></i>Featured
              </span>
            )}
          </div>

          <div className="flex gap-3">
            {/* Approval Actions */}
            {product.isApproved === 'pending' && (
              <>
                <button
                  onClick={handleApprove}
                  className="bg-green-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-600 transition-all flex items-center gap-2"
                >
                  <i className="fas fa-check"></i>
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  className="bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-600 transition-all flex items-center gap-2"
                >
                  <i className="fas fa-times"></i>
                  Reject
                </button>
              </>
            )}

            <button
              onClick={() => navigate(`/admin/products/edit/${id}`)}
              className="bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all flex items-center gap-2"
            >
              <i className="fas fa-edit"></i>
              Edit
            </button>
            <button
              onClick={() => setDeleteModal(true)}
              className="bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-600 transition-all flex items-center gap-2"
            >
              <i className="fas fa-trash"></i>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Main Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* LEFT - Images */}
        <div>
          {/* Main Image */}
          <div className="bg-white rounded-3xl overflow-hidden mb-4 border-2 border-slate-200 shadow-lg">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[selectedImage]?.url} 
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
            ) : (
              <div className="w-full h-[500px] bg-slate-100 flex items-center justify-center">
                <i className="fas fa-box text-8xl text-slate-300"></i>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`bg-slate-100 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-orange-500' 
                      : 'border-slate-200 hover:border-orange-300'
                  }`}
                >
                  <img 
                    src={image.url} 
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT - Product Info */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-slate-200">
          {/* Product Title */}
          <h1 className="text-3xl font-black text-slate-900 mb-4">{product.name}</h1>

          {/* SKU */}
          <p className="text-sm text-slate-600 mb-4">SKU: <span className="font-semibold">{product.sku}</span></p>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <i 
                  key={i}
                  className={`fas fa-star ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-300'}`}
                ></i>
              ))}
              <span className="text-sm font-bold text-slate-900 ml-2">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-slate-600">({product.totalReviews} Reviews)</span>
            {product.stock > 0 ? (
              <span className="text-sm text-emerald-600 font-semibold">✓ In Stock ({product.stock})</span>
            ) : (
              <span className="text-sm text-red-600 font-semibold">✗ Out of Stock</span>
            )}
          </div>

          {/* Price */}
          <div className="bg-slate-50 rounded-2xl p-5 mb-6 border-2 border-slate-200">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-black text-orange-600">
                ${product.price.min} - ${product.price.max}
              </span>
              <span className="text-sm text-slate-600">{product.price.currency}</span>
            </div>
            <p className="text-sm text-slate-600">MOQ: {product.moq} {product.unit}</p>
          </div>

          {/* Category & Supplier */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
              <p className="text-xs text-slate-600 mb-1">Category</p>
              <p className="font-bold text-slate-900">{product.category?.name || 'N/A'}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
              <p className="text-xs text-slate-600 mb-1">Sub Category</p>
              <p className="font-bold text-slate-900">{product.subCategory || 'N/A'}</p>
            </div>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-black text-slate-900 mb-3">Key Features</h3>
              <div className="grid grid-cols-1 gap-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <i className="fas fa-check-circle text-emerald-500"></i>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Supplier Info */}
          {product.supplier && (
            <div className="bg-slate-50 rounded-2xl p-5 border-2 border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
                  <i className="fas fa-store text-white text-xl"></i>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900">{product.supplier.companyName}</h4>
                  <p className="text-xs text-slate-600">
                    {product.supplier.country} • {product.supplier.rating ? `Rating: ${product.supplier.rating}` : 'New Supplier'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-blue-600">{product.views || 0}</p>
              <p className="text-xs text-blue-700">Views</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-emerald-600">{product.totalOrders || 0}</p>
              <p className="text-xs text-emerald-700">Orders</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-amber-600">{product.inquiries || 0}</p>
              <p className="text-xs text-amber-700">Inquiries</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <div className="bg-white rounded-3xl shadow-lg border-2 border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex gap-0 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('specifications')}
            className={`px-8 py-4 font-bold text-sm transition-all ${
              activeTab === 'specifications'
                ? 'bg-orange-500 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('description')}
            className={`px-8 py-4 font-bold text-sm transition-all ${
              activeTab === 'description'
                ? 'bg-orange-500 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-8 py-4 font-bold text-sm transition-all ${
              activeTab === 'details'
                ? 'bg-orange-500 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Additional Details
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {/* Specifications Tab */}
          {activeTab === 'specifications' && (
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-6">Technical Specifications</h3>
              {product.specifications && product.specifications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-slate-100">
                      <span className="text-sm font-semibold text-slate-600">{spec.key}</span>
                      <span className="text-sm text-slate-900 font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600">No specifications available</p>
              )}
            </div>
          )}

          {/* Description Tab */}
          {activeTab === 'description' && (
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-6">Product Description</h3>
              <div className="prose max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
                {product.shortDescription && (
                  <div className="mt-6 p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-2">Summary</h4>
                    <p className="text-slate-700">{product.shortDescription}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Details Tab */}
          {activeTab === 'details' && (
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-6">Additional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Material */}
                {product.material && (
                  <div className="bg-slate-50 rounded-xl p-5">
                    <p className="text-xs text-slate-600 mb-1">Material</p>
                    <p className="font-bold text-slate-900">{product.material}</p>
                  </div>
                )}

                {/* Weight */}
                {product.weight && (
                  <div className="bg-slate-50 rounded-xl p-5">
                    <p className="text-xs text-slate-600 mb-1">Weight</p>
                    <p className="font-bold text-slate-900">{product.weight.value} {product.weight.unit}</p>
                  </div>
                )}

                {/* Dimensions */}
                {product.dimensions && (
                  <div className="bg-slate-50 rounded-xl p-5">
                    <p className="text-xs text-slate-600 mb-1">Dimensions</p>
                    <p className="font-bold text-slate-900">
                      {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} {product.dimensions.unit}
                    </p>
                  </div>
                )}

                {/* Lead Time */}
                {product.leadTime && (
                  <div className="bg-slate-50 rounded-xl p-5">
                    <p className="text-xs text-slate-600 mb-1">Lead Time</p>
                    <p className="font-bold text-slate-900">
                      {product.leadTime.min}-{product.leadTime.max} {product.leadTime.unit}
                    </p>
                  </div>
                )}

                {/* Packaging */}
                {product.packaging && (
                  <div className="bg-slate-50 rounded-xl p-5 md:col-span-2">
                    <p className="text-xs text-slate-600 mb-1">Packaging</p>
                    <p className="font-bold text-slate-900">{product.packaging}</p>
                  </div>
                )}

                {/* Colors */}
                {product.color && product.color.length > 0 && (
                  <div className="bg-slate-50 rounded-xl p-5">
                    <p className="text-xs text-slate-600 mb-2">Available Colors</p>
                    <div className="flex flex-wrap gap-2">
                      {product.color.map((color, index) => (
                        <span key={index} className="bg-white px-3 py-1 rounded-lg text-sm font-semibold text-slate-700 border-2 border-slate-200">
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {product.size && product.size.length > 0 && (
                  <div className="bg-slate-50 rounded-xl p-5">
                    <p className="text-xs text-slate-600 mb-2">Available Sizes</p>
                    <div className="flex flex-wrap gap-2">
                      {product.size.map((size, index) => (
                        <span key={index} className="bg-white px-3 py-1 rounded-lg text-sm font-semibold text-slate-700 border-2 border-slate-200">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="bg-slate-50 rounded-xl p-5 md:col-span-2">
                    <p className="text-xs text-slate-600 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span key={index} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-sm font-semibold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Badges */}
                {product.badges && product.badges.length > 0 && (
                  <div className="bg-slate-50 rounded-xl p-5 md:col-span-2">
                    <p className="text-xs text-slate-600 mb-2">Badges</p>
                    <div className="flex flex-wrap gap-2">
                      {product.badges.map((badge, index) => (
                        <span key={index} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-sm font-bold">
                          <i className="fas fa-certificate mr-1"></i>
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-trash text-red-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Delete Product?</h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete "{product.name}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(false)}
                  className="flex-1 bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-all"
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

export default AdminProductDetail;
