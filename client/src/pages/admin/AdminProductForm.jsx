import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createAdminProduct, uploadProductImage, getAdminProductById, updateAdminProduct } from '../../services/operations/adminProductAPI';
import { getAllCategories } from '../../services/operations/categoryAPI';
import { getAllSuppliers } from '../../services/operations/supplierAPI';

const AdminProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [uploadingImages, setUploadingImages] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    sku: '',
    category: '',
    subCategory: '',
    supplier: '',
    priceMin: '',
    priceMax: '',
    moq: '',
    unit: 'pieces',
    stock: '',
    images: [],
    specifications: [{ key: '', value: '' }],
    features: [''],
    tags: '',
    material: '',
    color: '',
    size: '',
    weight: '',
    dimensionsLength: '',
    dimensionsWidth: '',
    dimensionsHeight: '',
    packagingType: '',
    shippingMethods: '',
    leadTime: '',
    warranty: '',
    isFeatured: false
  });

  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
    if (isEditMode) {
      fetchProductData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProductData = async () => {
    try {
      setInitialLoading(true);
      const response = await getAdminProductById(id, token);
      if (response.success) {
        const product = response.data;
        setFormData({
          name: product.name || '',
          description: product.description || '',
          shortDescription: product.shortDescription || '',
          sku: product.sku || '',
          category: product.category?._id || product.category || '',
          subCategory: product.subCategory || '',
          supplier: product.supplier?._id || product.supplier || '',
          priceMin: product.price?.min || '',
          priceMax: product.price?.max || '',
          moq: product.moq || '',
          unit: product.unit || 'pieces',
          stock: product.stock || '',
          images: product.images || [],
          specifications: product.specifications?.length > 0 ? product.specifications : [{ key: '', value: '' }],
          features: product.features?.length > 0 ? product.features : [''],
          tags: product.tags?.join(', ') || '',
          material: product.material || '',
          color: Array.isArray(product.color) ? product.color.join(', ') : product.color || '',
          size: Array.isArray(product.size) ? product.size.join(', ') : product.size || '',
          weight: product.weight?.value || product.weight || '',
          dimensionsLength: product.dimensions?.length || '',
          dimensionsWidth: product.dimensions?.width || '',
          dimensionsHeight: product.dimensions?.height || '',
          packagingType: product.packaging?.type || product.packagingType || '',
          shippingMethods: Array.isArray(product.shippingMethods) ? product.shippingMethods.join(', ') : product.shippingMethods || '',
          leadTime: product.leadTime?.min || product.leadTime || '',
          warranty: product.warranty || '',
          isFeatured: product.isFeatured || false
        });
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Failed to load product data');
      navigate('/admin/products');
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await getAllSuppliers();
      if (response.success) {
        setSuppliers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      // Add to uploading state
      const tempId = Date.now() + Math.random();
      setUploadingImages(prev => [...prev, { id: tempId, name: file.name, progress: 0 }]);

      try {
        // Upload immediately to Cloudinary
        const result = await uploadProductImage(file, token);
        
        // Add to form images
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, result]
        }));

        // Remove from uploading state
        setUploadingImages(prev => prev.filter(img => img.id !== tempId));
        
        toast.success(`${file.name} uploaded successfully!`);
      } catch (error) {
        setUploadingImages(prev => prev.filter(img => img.id !== tempId));
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData({ ...formData, specifications: newSpecs });
  };

  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { key: '', value: '' }]
    });
  };

  const removeSpecification = (index) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.filter((_, i) => i !== index)
    });
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    if (uploadingImages.length > 0) {
      toast.error('Please wait for all images to finish uploading');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription,
        sku: formData.sku,
        category: formData.category,
        subCategory: formData.subCategory || undefined,
        supplier: formData.supplier || undefined,
        priceMin: parseFloat(formData.priceMin),
        priceMax: parseFloat(formData.priceMax),
        moq: parseInt(formData.moq),
        unit: formData.unit,
        stock: parseInt(formData.stock) || 0,
        images: formData.images,
        specifications: formData.specifications.filter(spec => spec.key && spec.value),
        features: formData.features.filter(f => f.trim()),
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        material: formData.material || undefined,
        color: formData.color ? formData.color.split(',').map(c => c.trim()).filter(c => c) : [],
        size: formData.size ? formData.size.split(',').map(s => s.trim()).filter(s => s) : [],
        weight: formData.weight || undefined,
        dimensions: formData.dimensionsLength && formData.dimensionsWidth && formData.dimensionsHeight ? {
          length: parseFloat(formData.dimensionsLength),
          width: parseFloat(formData.dimensionsWidth),
          height: parseFloat(formData.dimensionsHeight),
          unit: 'cm'
        } : undefined,
        packagingType: formData.packagingType || undefined,
        shippingMethods: formData.shippingMethods ? formData.shippingMethods.split(',').map(m => m.trim()).filter(m => m) : [],
        leadTime: formData.leadTime || undefined,
        warranty: formData.warranty || undefined,
        isFeatured: formData.isFeatured
      };

      if (isEditMode) {
        await updateAdminProduct(id, productData, token);
      } else {
        await createAdminProduct(productData, token);
      }
      navigate('/admin/products');
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} product:`, error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <i className="fas fa-circle-notch fa-spin text-4xl text-orange-500"></i>
            <p className="text-slate-600">Loading product data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate('/admin/products')}
            className="text-slate-600 hover:text-slate-900"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 className="text-3xl font-black text-slate-900">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>
        <p className="text-sm text-slate-500">
          {isEditMode ? 'Update product information' : 'Create a new product listing'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    placeholder="e.g., PROD-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Short Description
                  </label>
                  <input
                    type="text"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    maxLength="500"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    placeholder="Brief product description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    maxLength="2000"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    placeholder="Detailed product description"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {formData.description.length}/2000 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Pricing & Stock</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Min Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="priceMin"
                    value={formData.priceMin}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Max Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="priceMax"
                    value={formData.priceMax}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    MOQ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="moq"
                    value={formData.moq}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none bg-white"
                  >
                    <option value="pieces">Pieces</option>
                    <option value="kg">Kilograms</option>
                    <option value="lbs">Pounds</option>
                    <option value="meters">Meters</option>
                    <option value="sets">Sets</option>
                    <option value="boxes">Boxes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Product Images</h2>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <i className="fas fa-cloud-upload-alt text-4xl text-slate-400"></i>
                    <p className="text-sm font-semibold text-slate-700">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-500">
                      Images will upload immediately (Max 5MB per image)
                    </p>
                  </label>
                </div>

                {/* Uploading Images */}
                {uploadingImages.length > 0 && (
                  <div className="space-y-2">
                    {uploadingImages.map((img) => (
                      <div key={img.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <i className="fas fa-spinner fa-spin text-orange-500"></i>
                        <span className="text-sm text-slate-700">Uploading {img.name}...</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Uploaded Images */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <i className="fas fa-times text-xs"></i>
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Specifications</h2>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="text-orange-500 hover:text-orange-600 text-sm font-semibold"
                >
                  <i className="fas fa-plus mr-1"></i>
                  Add Specification
                </button>
              </div>

              <div className="space-y-3">
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                      placeholder="Key (e.g., Material)"
                      className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                      placeholder="Value (e.g., Stainless Steel)"
                      className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Features</h2>
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-orange-500 hover:text-orange-600 text-sm font-semibold"
                >
                  <i className="fas fa-plus mr-1"></i>
                  Add Feature
                </button>
              </div>

              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder="Enter product feature"
                      className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Additional Details</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Material
                    </label>
                    <input
                      type="text"
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                      placeholder="e.g., Plastic, Metal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Colors (comma separated)
                    </label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                      placeholder="Red, Blue, Green"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Sizes (comma separated)
                    </label>
                    <input
                      type="text"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                      placeholder="S, M, L, XL"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                      placeholder="e.g., 2.5kg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Dimensions (cm)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="number"
                      name="dimensionsLength"
                      value={formData.dimensionsLength}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      placeholder="Length"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                    <input
                      type="number"
                      name="dimensionsWidth"
                      value={formData.dimensionsWidth}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      placeholder="Width"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                    <input
                      type="number"
                      name="dimensionsHeight"
                      value={formData.dimensionsHeight}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      placeholder="Height"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Packaging Type
                    </label>
                    <input
                      type="text"
                      name="packagingType"
                      value={formData.packagingType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                      placeholder="e.g., Box, Carton"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Lead Time
                    </label>
                    <input
                      type="text"
                      name="leadTime"
                      value={formData.leadTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                      placeholder="e.g., 15-20 days"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Warranty
                    </label>
                    <input
                      type="text"
                      name="warranty"
                      value={formData.warranty}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                      placeholder="e.g., 1 year"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Shipping Methods (comma separated)
                    </label>
                    <input
                      type="text"
                      name="shippingMethods"
                      value={formData.shippingMethods}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                      placeholder="Sea, Air, Express"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    placeholder="electronics, gadget, bestseller"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category & Supplier */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Category & Supplier</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none bg-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Sub Category
                  </label>
                  <input
                    type="text"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
                    placeholder="Enter sub category"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Supplier <span className="text-xs text-slate-500">(Optional)</span>
                  </label>
                  <select
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none bg-white"
                  >
                    <option value="">Select Supplier (Optional)</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier._id} value={supplier._id}>
                        {supplier.companyName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Product Settings */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Product Settings</h2>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-orange-500 border-slate-300 rounded focus:ring-orange-500"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Featured Product</p>
                    <p className="text-xs text-slate-500">Show on homepage</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-3">
              <button
                type="submit"
                disabled={loading || uploadingImages.length > 0}
                className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    {isEditMode ? 'Updating Product...' : 'Creating Product...'}
                  </>
                ) : (
                  <>
                    <i className={`fas fa-${isEditMode ? 'save' : 'check'} mr-2`}></i>
                    {isEditMode ? 'Update Product' : 'Create Product'}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="w-full bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-300 transition-all"
              >
                Cancel
              </button>
            </div>

            {/* Tips & Best Practices */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <i className="fas fa-lightbulb text-white text-sm"></i>
                </div>
                <h2 className="text-lg font-bold text-slate-900">Pro Tips</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex gap-3">
                  <i className="fas fa-check-circle text-blue-500 mt-1 text-sm"></i>
                  <p className="text-sm text-slate-700">
                    <strong>High-quality images</strong> increase product visibility by 70%
                  </p>
                </div>
                <div className="flex gap-3">
                  <i className="fas fa-check-circle text-blue-500 mt-1 text-sm"></i>
                  <p className="text-sm text-slate-700">
                    <strong>Detailed descriptions</strong> reduce customer inquiries
                  </p>
                </div>
                <div className="flex gap-3">
                  <i className="fas fa-check-circle text-blue-500 mt-1 text-sm"></i>
                  <p className="text-sm text-slate-700">
                    <strong>Add specifications</strong> to improve search ranking
                  </p>
                </div>
                <div className="flex gap-3">
                  <i className="fas fa-check-circle text-blue-500 mt-1 text-sm"></i>
                  <p className="text-sm text-slate-700">
                    <strong>Use relevant tags</strong> for better discoverability
                  </p>
                </div>
                <div className="flex gap-3">
                  <i className="fas fa-check-circle text-blue-500 mt-1 text-sm"></i>
                  <p className="text-sm text-slate-700">
                    <strong>Competitive pricing</strong> attracts more buyers
                  </p>
                </div>
              </div>
            </div>

            {/* Common Materials */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <i className="fas fa-cubes text-white text-sm"></i>
                </div>
                <h3 className="text-sm font-bold text-slate-900">Common Materials</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-slate-700 border border-purple-200">Plastic</span>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-slate-700 border border-purple-200">Metal</span>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-slate-700 border border-purple-200">Wood</span>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-slate-700 border border-purple-200">Glass</span>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-slate-700 border border-purple-200">Fabric</span>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-slate-700 border border-purple-200">Leather</span>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-slate-700 border border-purple-200">Steel</span>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-slate-700 border border-purple-200">Aluminum</span>
              </div>
            </div>

            {/* Size Chart Reference */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <i className="fas fa-ruler-combined text-white text-sm"></i>
                </div>
                <h3 className="text-sm font-bold text-slate-900">Size Standards</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span className="text-xs font-semibold text-slate-700">Clothing</span>
                  <span className="text-xs text-slate-600">S, M, L, XL, XXL</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span className="text-xs font-semibold text-slate-700">Shoes (US)</span>
                  <span className="text-xs text-slate-600">6, 7, 8, 9, 10, 11</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <span className="text-xs font-semibold text-slate-700">Dimensions</span>
                  <span className="text-xs text-slate-600">L × W × H (cm)</span>
                </div>
              </div>
            </div>

            {/* Shipping Methods */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                  <i className="fas fa-shipping-fast text-white text-sm"></i>
                </div>
                <h3 className="text-sm font-bold text-slate-900">Shipping Options</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-2 bg-white rounded-lg">
                  <i className="fas fa-ship text-cyan-500 text-sm mt-1"></i>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">Sea Freight</p>
                    <p className="text-[10px] text-slate-500">Cost-effective, 20-45 days</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 bg-white rounded-lg">
                  <i className="fas fa-plane text-cyan-500 text-sm mt-1"></i>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">Air Freight</p>
                    <p className="text-[10px] text-slate-500">Fast delivery, 5-10 days</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 bg-white rounded-lg">
                  <i className="fas fa-truck text-cyan-500 text-sm mt-1"></i>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">Express</p>
                    <p className="text-[10px] text-slate-500">Premium, 2-5 days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Product Guidelines</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Images</span>
                  <span className="text-xs font-bold text-slate-900">Min. 1, Max 10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Description</span>
                  <span className="text-xs font-bold text-slate-900">2000 chars</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Image Size</span>
                  <span className="text-xs font-bold text-slate-900">Max 5MB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Upload Speed</span>
                  <span className="text-xs font-bold text-orange-600">Real-time</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 -mx-6 mt-6 shadow-lg">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="text-sm text-slate-600">
              <i className="fas fa-info-circle mr-2"></i>
              All required fields must be filled before submission
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-all"
              >
                <i className="fas fa-times mr-2"></i>
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploadingImages.length > 0}
                className="px-8 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    {isEditMode ? 'Updating Product...' : 'Creating Product...'}
                  </>
                ) : (
                  <>
                    <i className={`fas fa-${isEditMode ? 'save' : 'check'} mr-2`}></i>
                    {isEditMode ? 'Update Product' : 'Create Product'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
