import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { getProductById } from '../../services/operations/productAPI';
import {
  getAdminProductById,
  deleteAdminProduct,
  approveProduct,
  rejectProduct,
  toggleProductActive,
  updateProductSummary
} from '../../services/operations/adminProductAPI';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';
  
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('specifications');
  const [selectedImage, setSelectedImage] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [fullImageModal, setFullImageModal] = useState(false);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [savingSummary, setSavingSummary] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Auto-slide effect for images
  useEffect(() => {
    if (!product?.images || product.images.length <= 1 || !isAutoSliding) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }, 2000); // 2 seconds

    return () => clearInterval(interval);
  }, [product?.images, isAutoSliding]);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && fullImageModal) {
        setFullImageModal(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [fullImageModal]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      // Use admin API if admin, otherwise use regular API
      const response = isAdmin 
        ? await getAdminProductById(id, token)
        : await getProductById(id);
      
      if (response.success) {
        setProduct(response.data);
        setSummaryText(response.data.summary || '');
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Failed to load product details');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  // Admin-only actions
  const handleDelete = async () => {
    if (!isAdmin) return;
    try {
      await deleteAdminProduct(id, token);
      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleApprove = async () => {
    if (!isAdmin) return;
    try {
      await approveProduct(id, token);
      fetchProduct();
    } catch (error) {
      console.error('Failed to approve product:', error);
    }
  };

  const handleReject = async () => {
    if (!isAdmin) return;
    try {
      await rejectProduct(id, token);
      fetchProduct();
    } catch (error) {
      console.error('Failed to reject product:', error);
    }
  };

  const handleToggleActive = async () => {
    if (!isAdmin) return;
    try {
      await toggleProductActive(id, token);
      fetchProduct();
    } catch (error) {
      console.error('Failed to toggle product status:', error);
    }
  };

  const handleContactSupplier = () => {
    // Navigate to contact page or open modal
    toast.success('Contact supplier feature coming soon!');
  };

  const handleRequestQuote = () => {
    // Navigate to quote request page or open modal
    toast.success('Request quote feature coming soon!');
  };

  const handleNextImage = () => {
    if (product?.images) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const handlePrevImage = () => {
    if (product?.images) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  // Summary handlers
  const handleEditSummary = () => {
    if (!isAdmin) return;
    setIsEditingSummary(true);
  };

  const handleCancelEditSummary = () => {
    setSummaryText(product?.summary || '');
    setIsEditingSummary(false);
  };

  const handleSaveSummary = async () => {
    if (!isAdmin || !id) return;
    
    try {
      setSavingSummary(true);
      const response = await updateProductSummary(id, summaryText, token);
      
      if (response.success) {
        setProduct({ ...product, summary: summaryText });
        setIsEditingSummary(false);
      }
    } catch (error) {
      console.error('Failed to update summary:', error);
    } finally {
      setSavingSummary(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/40">
      {/* Breadcrumb */}
      <div className="bg-white/90 backdrop-blur-md shadow-sm py-4 sticky top-0 z-10 border-b border-orange-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm">
            <button 
              onClick={() => navigate('/')}
              className="text-slate-600 hover:text-orange-600 transition-colors font-medium"
            >
              Home
            </button>
            <i className="fas fa-chevron-right text-slate-400 text-xs"></i>
            <button 
              onClick={() => navigate(isAdmin ? '/admin/products' : '/products')}
              className="text-slate-600 hover:text-orange-600 transition-colors font-medium"
            >
              Products
            </button>
            <i className="fas fa-chevron-right text-slate-400 text-xs"></i>
            <span className="text-slate-900 font-semibold">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Action Bar - Only visible to admins */}
        {isAdmin && (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-orange-100/50 p-5 mb-6 transform transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Status Badge */}
                <span className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  product.isApproved === 'approved' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200' :
                  product.isApproved === 'rejected' ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-200' :
                  'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200'
                }`}>
                  <i className={`fas fa-${
                    product.isApproved === 'approved' ? 'check-circle' :
                    product.isApproved === 'rejected' ? 'times-circle' : 'clock'
                  } mr-2`}></i>
                  {product.isApproved === 'approved' ? 'Approved' :
                   product.isApproved === 'rejected' ? 'Rejected' : 'Pending'}
                </span>

                {/* Active Status */}
                {isAdmin && (
                  <button
                    onClick={handleToggleActive}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                      product.isActive 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200' 
                        : 'bg-gradient-to-r from-slate-500 to-slate-700 text-white shadow-lg shadow-slate-200'
                    }`}
                  >
                    <i className={`fas fa-${product.isActive ? 'eye' : 'eye-slash'} mr-2`}></i>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </button>
                )}

                {product.isFeatured && (
                  <span className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-bold shadow-lg shadow-amber-200">
                    <i className="fas fa-star mr-2"></i>Featured
                  </span>
                )}
              </div>

              {isAdmin && (
                <div className="flex gap-3 flex-wrap">
                  {/* Approval Actions */}
                  {product.isApproved === 'pending' && (
                    <>
                      <button
                        onClick={handleApprove}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                      >
                        <i className="fas fa-check"></i>
                        Approve
                      </button>
                      <button
                        onClick={handleReject}
                        className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                      >
                        <i className="fas fa-times"></i>
                        Reject
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => navigate(`/admin/products/edit/${id}`)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                  >
                    <i className="fas fa-edit"></i>
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteModal(true)}
                    className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                  >
                    <i className="fas fa-trash"></i>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* LEFT - Images */}
          <div className="space-y-4">
            {/* Main Image with Fixed Height */}
            <div className="relative group">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-orange-100/50 relative h-[500px] flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <div 
                    className="relative w-full h-full flex items-center justify-center cursor-crosshair"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => {
                      setShowZoom(true);
                      setIsAutoSliding(false);
                    }}
                    onMouseLeave={() => {
                      setShowZoom(false);
                      setIsAutoSliding(true);
                    }}
                  >
                    <img 
                      src={product.images[selectedImage]?.url} 
                      alt={product.name}
                      className="w-full h-full object-contain p-4 transition-all duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                    <i className="fas fa-box text-8xl text-orange-300"></i>
                  </div>
                )}

                {/* Full Image Button */}
                <button
                  onClick={() => setFullImageModal(true)}
                  className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                >
                  <i className="fas fa-expand mr-2"></i>
                  See Full Image
                </button>

                {/* Navigation Arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-orange-500 text-slate-700 hover:text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center opacity-0 group-hover:opacity-100"
                      onMouseEnter={() => setIsAutoSliding(false)}
                      onMouseLeave={() => setIsAutoSliding(true)}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-orange-500 text-slate-700 hover:text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center opacity-0 group-hover:opacity-100"
                      onMouseEnter={() => setIsAutoSliding(false)}
                      onMouseLeave={() => setIsAutoSliding(true)}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold">
                    {selectedImage + 1} / {product.images.length}
                  </div>
                )}
              </div>

              {/* Zoomed Image Overlay - Amazon Style */}
              {showZoom && product.images && product.images.length > 0 && (
                <div className="hidden lg:block absolute top-0 left-full ml-4 w-[450px] h-[500px] bg-white shadow-2xl border-2 border-orange-300 rounded-2xl overflow-hidden z-50">
                  <div 
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url(${product.images[selectedImage]?.url})`,
                      backgroundSize: '200%',
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      <i className="fas fa-search-plus mr-1.5"></i>
                      Zoomed View
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Images - Bottom */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-100">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      setIsAutoSliding(false);
                      setTimeout(() => setIsAutoSliding(true), 5000);
                    }}
                    className={`flex-shrink-0 bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 transform hover:scale-105 w-20 h-20 ${
                      selectedImage === index 
                        ? 'ring-3 ring-orange-500 shadow-xl scale-105' 
                        : 'ring-1 ring-slate-200 hover:ring-orange-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={image.url} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Product Summary Section */}
            <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-2xl p-5 shadow-md border border-purple-100/50 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <i className="fas fa-file-alt text-purple-600"></i>
                  Product Summary
                </h3>
                {isAdmin && !isEditingSummary && (
                  <button
                    onClick={handleEditSummary}
                    className="text-xs font-semibold text-purple-600 hover:text-purple-700 bg-white px-3 py-1.5 rounded-lg border border-purple-200 hover:bg-purple-50 transition-all flex items-center gap-1.5"
                  >
                    <i className="fas fa-edit"></i>
                    Edit
                  </button>
                )}
              </div>

              {isEditingSummary ? (
                <div className="space-y-3">
                  <textarea
                    value={summaryText}
                    onChange={(e) => setSummaryText(e.target.value)}
                    placeholder="Enter detailed product summary..."
                    rows="8"
                    maxLength="3000"
                    className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all text-sm text-slate-700 resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">
                      {summaryText.length} / 3000 characters
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancelEditSummary}
                        disabled={savingSummary}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveSummary}
                        disabled={savingSummary}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {savingSummary ? (
                          <>
                            <i className="fas fa-circle-notch fa-spin"></i>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save"></i>
                            Save Summary
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {product?.summary || (
                    <p className="text-slate-500 italic flex items-center gap-2">
                      <i className="fas fa-info-circle"></i>
                      {isAdmin 
                        ? 'No summary available. Click "Edit" to add a detailed product summary.'
                        : 'No summary available for this product.'
                      }
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - Product Info */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-orange-100/50 transform transition-all duration-300 hover:shadow-2xl h-fit">
            {/* Product Title */}
            <h1 className="text-3xl font-black text-slate-900 mb-4 leading-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text">{product.name}</h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <i 
                    key={i}
                    className={`fas fa-star transition-all duration-300 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-slate-300'}`}
                  ></i>
                ))}
                <span className="text-sm font-bold text-slate-900 ml-2">{product.rating?.toFixed(1) || '0.0'}</span>
              </div>
              <span className="text-sm text-slate-600">({product.totalReviews || 0} Reviews)</span>
              {product.stock > 0 ? (
                <span className="px-3 py-1 bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-xs font-bold rounded-full shadow-md animate-pulse">
                  <i className="fas fa-check-circle mr-1"></i>
                  In Stock
                </span>
              ) : (
                <span className="px-3 py-1 bg-gradient-to-r from-red-400 to-pink-500 text-white text-xs font-bold rounded-full shadow-md">
                  <i className="fas fa-times-circle mr-1"></i>
                  Out of Stock
                </span>
              )}
            </div>

            {/* Price */}
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 rounded-2xl p-6 mb-6 border-2 border-emerald-200/50 shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                  ${product.price?.min || 0}
                </span>
                {product.price?.max && product.price.max !== product.price.min && (
                  <>
                    <span className="text-2xl text-slate-600">-</span>
                    <span className="text-4xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                      ${product.price.max}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-600 flex items-center gap-2">
                <i className="fas fa-check-circle text-emerald-500"></i>
                Inclusive of all taxes • Free shipping
              </p>
              <p className="text-sm font-semibold text-slate-700 mt-2 flex items-center gap-2">
                <i className="fas fa-boxes text-emerald-500"></i>
                Min. Order: {product.moq || 1} {product.unit || 'units'}
              </p>
            </div>

            {/* Key Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-2">
                  <i className="fas fa-sparkles text-orange-500"></i>
                  Key Features
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {product.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm bg-gradient-to-r from-orange-50/50 to-amber-50/50 p-3 rounded-lg transition-all duration-200 hover:from-orange-50 hover:to-amber-50 hover:shadow-md transform hover:-translate-y-0.5">
                      <i className="fas fa-check-circle text-orange-500 flex-shrink-0"></i>
                      <span className="text-slate-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.color && product.color.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <i className="fas fa-palette text-orange-500"></i>
                  Available Colors
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.color.map((color, index) => (
                    <span key={index} className="bg-gradient-to-r from-orange-100 to-amber-100 text-slate-700 px-4 py-2 rounded-full text-sm font-semibold border border-orange-200 transition-all duration-200 hover:shadow-md hover:scale-105 transform cursor-pointer hover:from-orange-200 hover:to-amber-200">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity - Only for non-admin users */}
            {!isAdmin && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <i className="fas fa-calculator text-orange-500"></i>
                  Quantity
                </h3>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setQuantity(Math.max(product.moq || 1, quantity - 1))}
                    className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 hover:from-orange-200 hover:to-amber-200 rounded-xl flex items-center justify-center font-bold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <i className="fas fa-minus text-orange-600"></i>
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    min={product.moq || 1}
                    onChange={(e) => setQuantity(Math.max(product.moq || 1, parseInt(e.target.value) || 1))}
                    className="w-20 h-12 bg-white border-2 border-orange-200 rounded-xl text-center font-bold focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all shadow-sm"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 hover:from-orange-200 hover:to-amber-200 rounded-xl flex items-center justify-center font-bold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <i className="fas fa-plus text-orange-600"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons - Different for admin vs user */}
            {!isAdmin && (
              <div className="flex gap-3 mb-6">
                <button 
                  onClick={handleContactSupplier}
                  className="flex-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-phone-alt"></i>
                  Contact Supplier
                </button>
                <button 
                  onClick={handleRequestQuote}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-file-invoice"></i>
                  Request Quote
                </button>
              </div>
            )}

            {/* Supplier Info */}
            {product.supplier && (
              <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-2xl p-5 border-2 border-orange-200/50 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <i className="fas fa-store text-white text-xl"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-900">{product.supplier.companyName}</h4>
                    <p className="text-xs text-slate-600 flex items-center gap-1">
                      <i className="fas fa-check-circle text-emerald-600"></i>
                      Verified Supplier • {product.supplier.country}
                    </p>
                  </div>
                  {!isAdmin && (
                    <button className="text-orange-600 text-sm font-bold hover:text-orange-700 transition-colors px-3 py-2 rounded-lg hover:bg-orange-100">
                      View Profile <i className="fas fa-arrow-right ml-1"></i>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Stats - Only for admin */}
            {isAdmin && (
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
            )}
          </div>
        </div>

        {/* Tabbed Content */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-orange-100/50 overflow-hidden">
          {/* Tabs */}
          <div className="flex gap-0 border-b border-orange-200 bg-gradient-to-r from-orange-50/50 via-amber-50/50 to-yellow-50/50">
            <button
              onClick={() => setActiveTab('specifications')}
              className={`px-8 py-4 font-bold text-sm transition-all duration-300 relative ${
                activeTab === 'specifications'
                  ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white shadow-lg transform scale-105'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              <i className="fas fa-cog mr-2"></i>
              Specifications
              {activeTab === 'specifications' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('description')}
              className={`px-8 py-4 font-bold text-sm transition-all duration-300 relative ${
                activeTab === 'description'
                  ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white shadow-lg transform scale-105'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              <i className="fas fa-align-left mr-2"></i>
              Description
              {activeTab === 'description' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-8 py-4 font-bold text-sm transition-all duration-300 relative ${
                activeTab === 'reviews'
                  ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white shadow-lg transform scale-105'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              <i className="fas fa-star mr-2"></i>
              Reviews ({product.totalReviews || 0})
              {activeTab === 'reviews' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full"></div>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div className="animate-fadeIn">
                <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <i className="fas fa-cog text-orange-500"></i>
                  Technical Specifications
                </h3>
                {product.specifications && product.specifications.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50/50 to-amber-50/50 rounded-xl border border-orange-200 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                        <span className="text-sm font-bold text-slate-600 flex items-center gap-2">
                          <i className="fas fa-circle text-orange-500 text-xs"></i>
                          {spec.key}
                        </span>
                        <span className="text-sm text-slate-900 font-semibold">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <i className="fas fa-clipboard-list text-6xl text-slate-300 mb-4"></i>
                    <p className="text-slate-600">No specifications available</p>
                  </div>
                )}

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                  {product.material && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                      <p className="text-xs font-semibold text-blue-600 mb-0.5 flex items-center gap-2">
                        <i className="fas fa-cube"></i>
                        Material
                      </p>
                      <p className="font-bold text-slate-900">{product.material}</p>
                    </div>
                  )}
                  {product.weight && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                      <p className="text-xs font-semibold text-purple-600 mb-0.5 flex items-center gap-2">
                        <i className="fas fa-weight"></i>
                        Weight
                      </p>
                      <p className="font-bold text-slate-900">{product.weight.value} {product.weight.unit}</p>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                      <p className="text-xs font-semibold text-orange-600 mb-0.5 flex items-center gap-2">
                        <i className="fas fa-ruler-combined"></i>
                        Dimensions
                      </p>
                      <p className="font-bold text-slate-900">
                        {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} {product.dimensions.unit}
                      </p>
                    </div>
                  )}
                  {product.leadTime && (
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                      <p className="text-xs font-semibold text-emerald-600 mb-0.5 flex items-center gap-2">
                        <i className="fas fa-clock"></i>
                        Lead Time
                      </p>
                      <p className="font-bold text-slate-900">
                        {product.leadTime.min}-{product.leadTime.max} {product.leadTime.unit}
                      </p>
                    </div>
                  )}
                </div>
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
                    <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 hover:shadow-md transition-all duration-200">
                      <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <i className="fas fa-info-circle text-orange-600"></i>
                        Summary
                      </h4>
                      <p className="text-slate-700">{product.shortDescription}</p>
                    </div>
                  )}

                  {/* Package Contents */}
                  {product.packaging && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200 hover:shadow-md transition-all duration-200">
                      <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <i className="fas fa-box text-slate-600"></i>
                        Packaging
                      </h4>
                      <p className="text-slate-700">{product.packaging}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">Customer Reviews</h3>
                <div className="text-center py-12">
                  <i className="fas fa-star text-6xl text-amber-300 mb-4"></i>
                  <p className="text-slate-600">Reviews content coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Image Modal */}
      {fullImageModal && product.images && product.images.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-8 animate-fadeIn">
          {/* Blurry Background Overlay */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={() => setFullImageModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative z-10 max-w-6xl w-full my-8">
            {/* Close Button */}
            <button
              onClick={() => setFullImageModal(false)}
              className="absolute -top-2 -right-2 w-12 h-12 bg-white/90 hover:bg-white backdrop-blur-sm text-slate-700 hover:text-orange-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-90 shadow-lg z-20"
            >
              <i className="fas fa-times text-lg"></i>
            </button>

            {/* Image Container */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-white/20">
              <div className="relative h-[70vh] flex items-center justify-center p-6">
                <img 
                  src={product.images[selectedImage]?.url} 
                  alt={product.name}
                  className="max-w-full max-h-full object-contain transition-all duration-500"
                />

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 text-slate-700 hover:text-white rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
                    >
                      <i className="fas fa-chevron-left text-xl"></i>
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 text-slate-700 hover:text-white rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
                    >
                      <i className="fas fa-chevron-right text-xl"></i>
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white px-6 py-3 rounded-full font-bold shadow-2xl">
                  {selectedImage + 1} / {product.images.length}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {product.images.length > 1 && (
                <div className="bg-black/30 backdrop-blur-sm p-4">
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-white/10">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-110 w-20 h-20 ${
                          selectedImage === index 
                            ? 'ring-4 ring-orange-500 scale-110' 
                            : 'ring-2 ring-white/30 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img 
                          src={image.url} 
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Image Info */}
            <div className="mt-4 text-center">
              <p className="text-white font-bold text-lg drop-shadow-lg">{product.name}</p>
              <p className="text-white/70 text-sm mt-1">Click outside or press ESC to close</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal - Only for admin */}
      {isAdmin && deleteModal && (
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

export default ProductDetail;
