const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // General Settings
  siteName: {
    type: String,
    default: 'Nexarion Global Exports'
  },
  siteDescription: {
    type: String,
    default: 'Premium Import Export Solutions'
  },
  siteEmail: {
    type: String,
    required: true
  },
  sitePhone: {
    type: String
  },
  logo: {
    public_id: String,
    url: String
  },
  favicon: {
    public_id: String,
    url: String
  },
  
  // Social Media Links
  socialMedia: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String,
    youtube: String
  },
  
  // Email Settings
  emailSettings: {
    smtpHost: String,
    smtpPort: Number,
    smtpUser: String,
    smtpPassword: String,
    fromEmail: String,
    fromName: String
  },
  
  // Payment Settings
  paymentSettings: {
    stripeEnabled: {
      type: Boolean,
      default: false
    },
    stripePublishableKey: String,
    stripeSecretKey: String,
    paypalEnabled: {
      type: Boolean,
      default: false
    },
    paypalClientId: String,
    paypalClientSecret: String,
    currency: {
      type: String,
      default: 'USD'
    },
    taxRate: {
      type: Number,
      default: 0
    }
  },
  
  // Shipping Settings
  shippingSettings: {
    freeShippingThreshold: {
      type: Number,
      default: 0
    },
    standardShippingCost: {
      type: Number,
      default: 0
    },
    expressShippingCost: {
      type: Number,
      default: 0
    },
    shippingCalculationMethod: {
      type: String,
      enum: ['flat', 'weight', 'price'],
      default: 'flat'
    }
  },
  
  // Business Settings
  businessSettings: {
    minimumOrderValue: {
      type: Number,
      default: 0
    },
    commission: {
      type: Number,
      default: 0
    },
    defaultMOQ: {
      type: Number,
      default: 1
    },
    autoApproveProducts: {
      type: Boolean,
      default: false
    },
    autoApproveSuppliers: {
      type: Boolean,
      default: false
    }
  },
  
  // Notification Settings
  notificationSettings: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    orderNotifications: {
      type: Boolean,
      default: true
    },
    paymentNotifications: {
      type: Boolean,
      default: true
    },
    quoteNotifications: {
      type: Boolean,
      default: true
    }
  },
  
  // SEO Settings
  seoSettings: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    googleAnalyticsId: String,
    facebookPixelId: String
  },
  
  // Maintenance Mode
  maintenanceMode: {
    enabled: {
      type: Boolean,
      default: false
    },
    message: String,
    allowedIPs: [String]
  },
  
  // Terms and Policies
  legal: {
    termsAndConditions: String,
    privacyPolicy: String,
    refundPolicy: String,
    shippingPolicy: String
  },
  
  // API Keys
  apiKeys: {
    cloudinaryCloudName: String,
    cloudinaryApiKey: String,
    cloudinaryApiSecret: String,
    dhlApiKey: String,
    fedexApiKey: String,
    upsApiKey: String
  },
  
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Singleton pattern - only one settings document
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      siteEmail: process.env.FROM_EMAIL || 'admin@nexarion.com'
    });
  }
  return settings;
};

// Update settings
settingsSchema.statics.updateSettings = async function(data, userId) {
  let settings = await this.getSettings();
  Object.assign(settings, data);
  settings.updatedBy = userId;
  await settings.save();
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
