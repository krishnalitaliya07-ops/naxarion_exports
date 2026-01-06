const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  quoteId: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  productName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide quantity'],
    min: 1
  },
  unit: {
    type: String,
    default: 'pieces'
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
    maxlength: 1000
  },
  specifications: {
    type: String,
    maxlength: 1000
  },
  targetPrice: {
    type: Number
  },
  budget: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  deliveryLocation: {
    city: String,
    state: String,
    country: {
      type: String,
      required: true
    }
  },
  expectedDeliveryDate: {
    type: Date
  },
  urgency: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  attachments: [{
    fileName: String,
    public_id: String,
    url: String
  }],
  customerInfo: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    company: String
  },
  supplierResponse: {
    quotedPrice: Number,
    moq: Number,
    leadTime: {
      value: Number,
      unit: String
    },
    paymentTerms: String,
    shippingTerms: String,
    validUntil: Date,
    notes: String,
    attachments: [{
      fileName: String,
      public_id: String,
      url: String
    }],
    respondedAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'in-review', 'quoted', 'negotiating', 'accepted', 'rejected', 'expired'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  tags: [{
    type: String
  }],
  internalNotes: {
    type: String,
    maxlength: 500
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Generate unique quote ID before saving
quoteSchema.pre('save', async function(next) {
  if (!this.quoteId) {
    const count = await mongoose.model('Quote').countDocuments();
    this.quoteId = `QTE-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
  }
  
  // Set expiry date if not set (default 30 days)
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  
  next();
});

module.exports = mongoose.model('Quote', quoteSchema);
