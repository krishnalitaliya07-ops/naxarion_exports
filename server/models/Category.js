const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide category name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  icon: {
    type: String,
    default: 'fas fa-box'
  },
  image: {
    public_id: String,
    url: String
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  subCategories: [{
    type: String,
    trim: true
  }],
  productCount: {
    type: Number,
    default: 0
  },
  gradient: {
    from: {
      type: String,
      default: 'blue-500'
    },
    to: {
      type: String,
      default: 'blue-700'
    }
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  metadata: {
    keywords: [String],
    metaTitle: String,
    metaDescription: String
  }
}, {
  timestamps: true
});

// Generate slug before saving
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
