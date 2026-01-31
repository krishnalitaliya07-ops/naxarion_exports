import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
  getSettings,
  updateGeneralSettings,
  updatePaymentSettings,
  updateEmailSettings,
  updateNotificationSettings,
  updateSecuritySettings,
  toggleMaintenanceMode,
  uploadLogo,
  uploadFavicon,
  resetToDefault,
  getSystemInfo,
  testEmailConfig,
  testPaymentConfig,
  saveAllSettings
} from '../../services/operations/settingsAPI';

// Tab configuration
const settingsTabs = [
  { id: 'general', label: 'General', icon: 'fa-sliders-h' },
  { id: 'users', label: 'Users & Roles', icon: 'fa-users-cog' },
  { id: 'payment', label: 'Payment Gateway', icon: 'fa-credit-card' },
  { id: 'email', label: 'Email & SMS', icon: 'fa-envelope' },
  { id: 'security', label: 'Security', icon: 'fa-shield-alt' },
  { id: 'integrations', label: 'Integrations', icon: 'fa-plug' }
];

const AdminSettings = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [systemInfo, setSystemInfo] = useState({});
  
  // Settings state
  const [settings, setSettings] = useState({
    // General Settings
    general: {
      siteName: '',
      siteDescription: '',
      siteUrl: '',
      contactEmail: '',
      supportPhone: '',
      currency: 'USD',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY'
    },
    // Branding
    branding: {
      logo: null,
      favicon: null,
      primaryColor: '#6366F1',
      secondaryColor: '#8B5CF6'
    },
    // Business Config
    business: {
      companyName: '',
      companyAddress: '',
      registrationNumber: '',
      taxId: '',
      businessType: 'export'
    },
    // Payment Settings
    payment: {
      stripeEnabled: true,
      stripePublicKey: '',
      stripeSecretKey: '',
      paypalEnabled: false,
      paypalClientId: '',
      paypalSecret: '',
      razorpayEnabled: false,
      razorpayKeyId: '',
      razorpaySecretKey: '',
      defaultGateway: 'stripe'
    },
    // Email Settings
    email: {
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      smtpSecure: 'tls',
      fromName: '',
      fromEmail: '',
      smsEnabled: false,
      smsProvider: 'twilio',
      twilioSid: '',
      twilioToken: '',
      twilioPhone: ''
    },
    // Notification Settings
    notifications: {
      emailNotifications: true,
      orderNotifications: true,
      paymentNotifications: true,
      marketingEmails: false,
      smsNotifications: false,
      pushNotifications: true
    },
    // Security Settings
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordPolicy: 'strong',
      maxLoginAttempts: 5,
      ipWhitelist: '',
      forceSSL: true
    },
    // System Settings
    system: {
      maintenanceMode: false,
      maintenanceMessage: 'We are currently performing maintenance. Please check back soon.',
      debugMode: false,
      cacheEnabled: true
    }
  });

  // Fetch settings
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const [settingsRes, systemRes] = await Promise.all([
        getSettings().catch(() => ({ data: {} })),
        getSystemInfo().catch(() => ({ data: {} }))
      ]);

      if (settingsRes.data) {
        setSettings(prev => ({
          ...prev,
          general: { ...prev.general, ...settingsRes.data.general },
          branding: { ...prev.branding, ...settingsRes.data.branding },
          business: { ...prev.business, ...settingsRes.data.business },
          payment: { ...prev.payment, ...settingsRes.data.payment },
          email: { ...prev.email, ...settingsRes.data.email },
          notifications: { ...prev.notifications, ...settingsRes.data.notifications },
          security: { ...prev.security, ...settingsRes.data.security },
          system: { ...prev.system, ...settingsRes.data.system }
        }));
      }

      setSystemInfo(systemRes.data || {});
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Update settings handlers
  const updateField = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Save settings
  const handleSave = async () => {
    try {
      setSaving(true);
      await saveAllSettings(settings);
      toast.success('Settings saved successfully!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Save specific section
  const handleSaveSection = async (section) => {
    try {
      setSaving(true);
      switch (section) {
        case 'general':
          await updateGeneralSettings(settings.general);
          break;
        case 'payment':
          await updatePaymentSettings(settings.payment);
          break;
        case 'email':
          await updateEmailSettings(settings.email);
          break;
        case 'notifications':
          await updateNotificationSettings(settings.notifications);
          break;
        case 'security':
          await updateSecuritySettings(settings.security);
          break;
        default:
          await saveAllSettings(settings);
      }
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved!`);
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Toggle maintenance mode
  const handleToggleMaintenance = async () => {
    try {
      const newValue = !settings.system.maintenanceMode;
      await toggleMaintenanceMode(newValue);
      updateField('system', 'maintenanceMode', newValue);
      toast.success(newValue ? 'Maintenance mode enabled' : 'Maintenance mode disabled');
    } catch {
      toast.error('Failed to toggle maintenance mode');
    }
  };

  // Handle logo upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('logo', file);
        const res = await uploadLogo(formData);
        updateField('branding', 'logo', res.data?.url || URL.createObjectURL(file));
        toast.success('Logo uploaded successfully!');
      } catch {
        // Fallback to local preview
        updateField('branding', 'logo', URL.createObjectURL(file));
        toast.success('Logo updated locally');
      }
    }
  };

  // Handle favicon upload
  const handleFaviconUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('favicon', file);
        const res = await uploadFavicon(formData);
        updateField('branding', 'favicon', res.data?.url || URL.createObjectURL(file));
        toast.success('Favicon uploaded successfully!');
      } catch {
        // Fallback to local preview
        updateField('branding', 'favicon', URL.createObjectURL(file));
        toast.success('Favicon updated locally');
      }
    }
  };

  // Test email configuration
  const handleTestEmail = async () => {
    try {
      await testEmailConfig();
      toast.success('Test email sent successfully!');
    } catch {
      toast.error('Failed to send test email');
    }
  };

  // Test payment configuration
  const handleTestPayment = async () => {
    try {
      await testPaymentConfig();
      toast.success('Payment gateway connected successfully!');
    } catch {
      toast.error('Failed to connect payment gateway');
    }
  };

  // Reset to default
  const handleResetToDefault = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      try {
        await resetToDefault();
        await fetchSettings();
        toast.success('Settings reset to default!');
      } catch {
        toast.error('Failed to reset settings');
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <i className="fas fa-circle-notch fa-spin text-4xl text-indigo-500"></i>
          <p className="text-slate-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettingsTab settings={settings} updateField={updateField} handleLogoUpload={handleLogoUpload} handleFaviconUpload={handleFaviconUpload} onSave={() => handleSaveSection('general')} saving={saving} />;
      case 'users':
        return <UsersRolesTab />;
      case 'payment':
        return <PaymentSettingsTab settings={settings} updateField={updateField} handleTestPayment={handleTestPayment} onSave={() => handleSaveSection('payment')} saving={saving} />;
      case 'email':
        return <EmailSettingsTab settings={settings} updateField={updateField} handleTestEmail={handleTestEmail} onSave={() => handleSaveSection('email')} saving={saving} />;
      case 'security':
        return <SecuritySettingsTab settings={settings} updateField={updateField} onSave={() => handleSaveSection('security')} saving={saving} />;
      case 'integrations':
        return <IntegrationsTab systemInfo={systemInfo} settings={settings} handleToggleMaintenance={handleToggleMaintenance} handleResetToDefault={handleResetToDefault} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-slate-500 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-cog text-white text-lg lg:text-xl"></i>
              </div>
              Platform Settings
            </h1>
            <p className="text-sm text-slate-600">Configure system settings, integrations, and preferences</p>
          </div>
          <div className="flex flex-wrap gap-2 lg:gap-3">
            <button 
              onClick={handleResetToDefault}
              className="bg-white border-2 border-slate-200 text-slate-700 px-3 lg:px-5 py-2 lg:py-2.5 rounded-xl font-bold text-xs lg:text-sm hover:border-red-500 hover:text-red-600 transition-all flex items-center gap-2"
            >
              <i className="fas fa-undo"></i>
              <span className="hidden sm:inline">Reset to Default</span>
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 lg:px-5 py-2 lg:py-2.5 rounded-xl font-bold text-xs lg:text-sm hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
              <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save All Settings'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border-2 border-slate-200 mb-6">
        <div className="flex overflow-x-auto scrollbar-hide">
          {settingsTabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] px-3 lg:px-6 py-3 lg:py-4 font-semibold text-xs lg:text-sm border-b-4 whitespace-nowrap transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id 
                  ? 'border-indigo-500 text-indigo-600 bg-indigo-50 font-bold' 
                  : 'border-transparent text-slate-600 hover:bg-slate-50'
              }`}
            >
              <i className={`fas ${tab.icon}`}></i>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

// ==================== Tab Components ====================

// General Settings Tab
const GeneralSettingsTab = ({ settings, updateField, handleLogoUpload, handleFaviconUpload, onSave, saving }) => (
  <div className="space-y-6">
    {/* Platform Information */}
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
      <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
        <i className="fas fa-globe text-indigo-600"></i>
        Platform Information
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Platform Name *</label>
          <input
            type="text"
            value={settings.general.siteName}
            onChange={(e) => updateField('general', 'siteName', e.target.value)}
            placeholder="Enter platform name"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Site URL *</label>
          <input
            type="url"
            value={settings.general.siteUrl}
            onChange={(e) => updateField('general', 'siteUrl', e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Contact Email *</label>
          <input
            type="email"
            value={settings.general.contactEmail}
            onChange={(e) => updateField('general', 'contactEmail', e.target.value)}
            placeholder="contact@example.com"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Support Phone</label>
          <input
            type="tel"
            value={settings.general.supportPhone}
            onChange={(e) => updateField('general', 'supportPhone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          />
        </div>
        <div className="lg:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2">Site Description</label>
          <textarea
            value={settings.general.siteDescription}
            onChange={(e) => updateField('general', 'siteDescription', e.target.value)}
            placeholder="Brief description of your platform"
            rows={3}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm resize-none"
          />
        </div>
      </div>
    </div>

    {/* Logo & Branding */}
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
      <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
        <i className="fas fa-palette text-pink-600"></i>
        Logo & Branding
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logo Upload */}
        <div className="text-center p-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-indigo-500 transition-all">
          {settings.branding.logo ? (
            <div className="mb-4">
              <img src={settings.branding.logo} alt="Logo" className="h-20 mx-auto object-contain" />
            </div>
          ) : (
            <div className="mb-4">
              <div className="w-20 h-20 mx-auto bg-slate-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-image text-3xl text-slate-400"></i>
              </div>
            </div>
          )}
          <p className="text-sm font-bold text-slate-700 mb-2">Platform Logo</p>
          <p className="text-xs text-slate-500 mb-3">PNG, JPG or SVG (max 2MB)</p>
          <label className="inline-block px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg font-bold text-sm cursor-pointer hover:bg-indigo-200 transition-all">
            <i className="fas fa-upload mr-2"></i>
            Upload Logo
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          </label>
        </div>

        {/* Favicon Upload */}
        <div className="text-center p-6 border-2 border-dashed border-slate-300 rounded-xl hover:border-indigo-500 transition-all">
          {settings.branding.favicon ? (
            <div className="mb-4">
              <img src={settings.branding.favicon} alt="Favicon" className="w-16 h-16 mx-auto object-contain" />
            </div>
          ) : (
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-slate-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-star text-2xl text-slate-400"></i>
              </div>
            </div>
          )}
          <p className="text-sm font-bold text-slate-700 mb-2">Favicon</p>
          <p className="text-xs text-slate-500 mb-3">ICO, PNG (32x32 recommended)</p>
          <label className="inline-block px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg font-bold text-sm cursor-pointer hover:bg-indigo-200 transition-all">
            <i className="fas fa-upload mr-2"></i>
            Upload Favicon
            <input type="file" accept="image/*,.ico" onChange={handleFaviconUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Brand Colors */}
      <div className="mt-6">
        <h4 className="text-sm font-bold text-slate-700 mb-4">Brand Colors</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-600">Primary:</label>
            <input
              type="color"
              value={settings.branding.primaryColor}
              onChange={(e) => updateField('branding', 'primaryColor', e.target.value)}
              className="w-10 h-10 rounded-lg border-2 border-slate-200 cursor-pointer"
            />
            <span className="text-sm font-mono text-slate-500">{settings.branding.primaryColor}</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-600">Secondary:</label>
            <input
              type="color"
              value={settings.branding.secondaryColor}
              onChange={(e) => updateField('branding', 'secondaryColor', e.target.value)}
              className="w-10 h-10 rounded-lg border-2 border-slate-200 cursor-pointer"
            />
            <span className="text-sm font-mono text-slate-500">{settings.branding.secondaryColor}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Regional Settings */}
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
      <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
        <i className="fas fa-map-marker-alt text-green-600"></i>
        Regional Settings
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Currency</label>
          <select
            value={settings.general.currency}
            onChange={(e) => updateField('general', 'currency', e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="INR">INR (₹)</option>
            <option value="AUD">AUD ($)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Language</label>
          <select
            value={settings.general.language}
            onChange={(e) => updateField('general', 'language', e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="zh">Chinese</option>
            <option value="ja">Japanese</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Timezone</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => updateField('general', 'timezone', e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="Europe/London">GMT/BST</option>
            <option value="Europe/Paris">Central European Time</option>
            <option value="Asia/Tokyo">Japan Standard Time</option>
            <option value="Asia/Shanghai">China Standard Time</option>
            <option value="Asia/Kolkata">India Standard Time</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Date Format</label>
          <select
            value={settings.general.dateFormat}
            onChange={(e) => updateField('general', 'dateFormat', e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>
    </div>

    {/* Business Configuration */}
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
      <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
        <i className="fas fa-building text-purple-600"></i>
        Business Configuration
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
          <input
            type="text"
            value={settings.business.companyName}
            onChange={(e) => updateField('business', 'companyName', e.target.value)}
            placeholder="Your company name"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Business Type</label>
          <select
            value={settings.business.businessType}
            onChange={(e) => updateField('business', 'businessType', e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          >
            <option value="export">Export Only</option>
            <option value="import">Import Only</option>
            <option value="both">Import & Export</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Registration Number</label>
          <input
            type="text"
            value={settings.business.registrationNumber}
            onChange={(e) => updateField('business', 'registrationNumber', e.target.value)}
            placeholder="Business registration number"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Tax ID / VAT Number</label>
          <input
            type="text"
            value={settings.business.taxId}
            onChange={(e) => updateField('business', 'taxId', e.target.value)}
            placeholder="Tax identification number"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          />
        </div>
        <div className="lg:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2">Company Address</label>
          <textarea
            value={settings.business.companyAddress}
            onChange={(e) => updateField('business', 'companyAddress', e.target.value)}
            placeholder="Full business address"
            rows={2}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm resize-none"
          />
        </div>
      </div>
    </div>

    {/* Save Button */}
    <div className="flex justify-end">
      <button
        onClick={onSave}
        disabled={saving}
        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-sm hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
      >
        <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
        Save General Settings
      </button>
    </div>
  </div>
);

// Users & Roles Tab
const UsersRolesTab = () => {
  const roles = [
    { id: 1, name: 'Super Admin', users: 1, permissions: 'Full Access', color: 'bg-red-500' },
    { id: 2, name: 'Admin', users: 3, permissions: 'Manage Users, Products, Orders', color: 'bg-indigo-500' },
    { id: 3, name: 'Manager', users: 5, permissions: 'View Reports, Manage Orders', color: 'bg-green-500' },
    { id: 4, name: 'Support', users: 8, permissions: 'Customer Support, View Orders', color: 'bg-amber-500' },
    { id: 5, name: 'User', users: 156, permissions: 'Basic Access', color: 'bg-slate-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Roles Overview */}
      <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base lg:text-lg font-black text-slate-900 flex items-center gap-2">
            <i className="fas fa-user-tag text-indigo-600"></i>
            User Roles
          </h3>
          <button className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg font-bold text-sm hover:bg-indigo-200 transition-all">
            <i className="fas fa-plus mr-2"></i>
            Add Role
          </button>
        </div>
        <div className="space-y-3">
          {roles.map(role => (
            <div key={role.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${role.color} rounded-lg flex items-center justify-center`}>
                  <i className="fas fa-user-shield text-white"></i>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{role.name}</p>
                  <p className="text-xs text-slate-500">{role.permissions}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600 bg-slate-200 px-3 py-1 rounded-lg">
                  {role.users} users
                </span>
                <button className="text-indigo-600 hover:text-indigo-800">
                  <i className="fas fa-edit"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
        <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
          <i className="fas fa-key text-amber-600"></i>
          Permissions Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="text-left py-3 px-4 font-bold text-slate-600">Permission</th>
                <th className="text-center py-3 px-2 font-bold text-slate-600">Super Admin</th>
                <th className="text-center py-3 px-2 font-bold text-slate-600">Admin</th>
                <th className="text-center py-3 px-2 font-bold text-slate-600">Manager</th>
                <th className="text-center py-3 px-2 font-bold text-slate-600">Support</th>
              </tr>
            </thead>
            <tbody>
              {[
                'Manage Users', 'Manage Products', 'Manage Orders', 'View Reports', 
                'Manage Settings', 'Handle Payments', 'Customer Support'
              ].map((permission, index) => (
                <tr key={index} className="border-b border-slate-100">
                  <td className="py-3 px-4 font-medium text-slate-700">{permission}</td>
                  <td className="text-center py-3 px-2"><i className="fas fa-check text-green-500"></i></td>
                  <td className="text-center py-3 px-2"><i className={`fas ${index < 5 ? 'fa-check text-green-500' : 'fa-times text-red-400'}`}></i></td>
                  <td className="text-center py-3 px-2"><i className={`fas ${index > 1 && index < 5 ? 'fa-check text-green-500' : 'fa-times text-red-400'}`}></i></td>
                  <td className="text-center py-3 px-2"><i className={`fas ${index > 4 ? 'fa-check text-green-500' : 'fa-times text-red-400'}`}></i></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Payment Settings Tab
const PaymentSettingsTab = ({ settings, updateField, handleTestPayment, onSave, saving }) => (
  <div className="space-y-6">
    {/* Payment Gateways */}
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
      <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
        <i className="fas fa-credit-card text-indigo-600"></i>
        Payment Gateways
      </h3>
      
      {/* Gateway Cards */}
      <div className="space-y-4">
        {/* Stripe */}
        <div className={`p-4 lg:p-6 rounded-xl border-2 transition-all ${settings.payment.stripeEnabled ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <i className="fab fa-stripe text-purple-600 text-2xl"></i>
              </div>
              <div>
                <p className="font-bold text-slate-900">Stripe</p>
                <p className="text-xs text-slate-500">Accept cards, wallets and more</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.payment.stripeEnabled}
                onChange={(e) => updateField('payment', 'stripeEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
            </label>
          </div>
          {settings.payment.stripeEnabled && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t border-indigo-200">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Publishable Key</label>
                <input
                  type="text"
                  value={settings.payment.stripePublicKey}
                  onChange={(e) => updateField('payment', 'stripePublicKey', e.target.value)}
                  placeholder="pk_live_..."
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Secret Key</label>
                <input
                  type="password"
                  value={settings.payment.stripeSecretKey}
                  onChange={(e) => updateField('payment', 'stripeSecretKey', e.target.value)}
                  placeholder="sk_live_..."
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* PayPal */}
        <div className={`p-4 lg:p-6 rounded-xl border-2 transition-all ${settings.payment.paypalEnabled ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <i className="fab fa-paypal text-blue-600 text-2xl"></i>
              </div>
              <div>
                <p className="font-bold text-slate-900">PayPal</p>
                <p className="text-xs text-slate-500">PayPal checkout integration</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.payment.paypalEnabled}
                onChange={(e) => updateField('payment', 'paypalEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
          {settings.payment.paypalEnabled && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t border-blue-200">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Client ID</label>
                <input
                  type="text"
                  value={settings.payment.paypalClientId}
                  onChange={(e) => updateField('payment', 'paypalClientId', e.target.value)}
                  placeholder="Your PayPal Client ID"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Secret</label>
                <input
                  type="password"
                  value={settings.payment.paypalSecret}
                  onChange={(e) => updateField('payment', 'paypalSecret', e.target.value)}
                  placeholder="Your PayPal Secret"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Razorpay */}
        <div className={`p-4 lg:p-6 rounded-xl border-2 transition-all ${settings.payment.razorpayEnabled ? 'border-sky-500 bg-sky-50' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-rupee-sign text-sky-600 text-xl"></i>
              </div>
              <div>
                <p className="font-bold text-slate-900">Razorpay</p>
                <p className="text-xs text-slate-500">Indian payment gateway</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.payment.razorpayEnabled}
                onChange={(e) => updateField('payment', 'razorpayEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
            </label>
          </div>
          {settings.payment.razorpayEnabled && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t border-sky-200">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Key ID</label>
                <input
                  type="text"
                  value={settings.payment.razorpayKeyId}
                  onChange={(e) => updateField('payment', 'razorpayKeyId', e.target.value)}
                  placeholder="rzp_live_..."
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Secret Key</label>
                <input
                  type="password"
                  value={settings.payment.razorpaySecretKey}
                  onChange={(e) => updateField('payment', 'razorpaySecretKey', e.target.value)}
                  placeholder="Your Razorpay Secret"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm font-mono"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Default Gateway */}
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
      <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
        <i className="fas fa-star text-amber-600"></i>
        Default Payment Gateway
      </h3>
      <select
        value={settings.payment.defaultGateway}
        onChange={(e) => updateField('payment', 'defaultGateway', e.target.value)}
        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
      >
        <option value="stripe">Stripe</option>
        <option value="paypal">PayPal</option>
        <option value="razorpay">Razorpay</option>
      </select>
    </div>

    {/* Actions */}
    <div className="flex flex-wrap gap-3 justify-end">
      <button
        onClick={handleTestPayment}
        className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:border-green-500 hover:text-green-600 transition-all flex items-center gap-2"
      >
        <i className="fas fa-plug"></i>
        Test Connection
      </button>
      <button
        onClick={onSave}
        disabled={saving}
        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-sm hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
      >
        <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
        Save Payment Settings
      </button>
    </div>
  </div>
);

// Email Settings Tab
const EmailSettingsTab = ({ settings, updateField, handleTestEmail, onSave, saving }) => (
  <div className="space-y-6">
    {/* SMTP Configuration */}
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
      <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
        <i className="fas fa-server text-indigo-600"></i>
        SMTP Configuration
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">SMTP Host</label>
          <input
            type="text"
            value={settings.email.smtpHost}
            onChange={(e) => updateField('email', 'smtpHost', e.target.value)}
            placeholder="smtp.gmail.com"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">SMTP Port</label>
          <input
            type="number"
            value={settings.email.smtpPort}
            onChange={(e) => updateField('email', 'smtpPort', parseInt(e.target.value))}
            placeholder="587"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">SMTP Username</label>
          <input
            type="text"
            value={settings.email.smtpUser}
            onChange={(e) => updateField('email', 'smtpUser', e.target.value)}
            placeholder="your-email@gmail.com"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">SMTP Password</label>
          <input
            type="password"
            value={settings.email.smtpPassword}
            onChange={(e) => updateField('email', 'smtpPassword', e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Encryption</label>
          <select
            value={settings.email.smtpSecure}
            onChange={(e) => updateField('email', 'smtpSecure', e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          >
            <option value="tls">TLS</option>
            <option value="ssl">SSL</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>
    </div>

    {/* Email Sender Info */}
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
      <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
        <i className="fas fa-envelope text-green-600"></i>
        Sender Information
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">From Name</label>
          <input
            type="text"
            value={settings.email.fromName}
            onChange={(e) => updateField('email', 'fromName', e.target.value)}
            placeholder="Nexarion Global Exports"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">From Email</label>
          <input
            type="email"
            value={settings.email.fromEmail}
            onChange={(e) => updateField('email', 'fromEmail', e.target.value)}
            placeholder="noreply@nexarion.com"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          />
        </div>
      </div>
    </div>

    {/* SMS Configuration */}
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base lg:text-lg font-black text-slate-900 flex items-center gap-2">
          <i className="fas fa-sms text-purple-600"></i>
          SMS Configuration
        </h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.email.smsEnabled}
            onChange={(e) => updateField('email', 'smsEnabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
        </label>
      </div>
      {settings.email.smsEnabled && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">SMS Provider</label>
            <select
              value={settings.email.smsProvider}
              onChange={(e) => updateField('email', 'smsProvider', e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
            >
              <option value="twilio">Twilio</option>
              <option value="nexmo">Nexmo/Vonage</option>
              <option value="sns">AWS SNS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Account SID</label>
            <input
              type="text"
              value={settings.email.twilioSid}
              onChange={(e) => updateField('email', 'twilioSid', e.target.value)}
              placeholder="Your Twilio SID"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Auth Token</label>
            <input
              type="password"
              value={settings.email.twilioToken}
              onChange={(e) => updateField('email', 'twilioToken', e.target.value)}
              placeholder="Your Auth Token"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={settings.email.twilioPhone}
              onChange={(e) => updateField('email', 'twilioPhone', e.target.value)}
              placeholder="+1234567890"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
            />
          </div>
        </div>
      )}
    </div>

    {/* Notification Preferences */}
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
      <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
        <i className="fas fa-bell text-amber-600"></i>
        Notification Preferences
      </h3>
      <div className="space-y-3">
        {[
          { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email', icon: 'fa-envelope' },
          { key: 'orderNotifications', label: 'Order Notifications', desc: 'Get notified on new orders', icon: 'fa-shopping-cart' },
          { key: 'paymentNotifications', label: 'Payment Notifications', desc: 'Get notified on payments', icon: 'fa-credit-card' },
          { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive promotional emails', icon: 'fa-bullhorn' },
          { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive SMS alerts', icon: 'fa-sms' },
          { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications', icon: 'fa-bell' }
        ].map(item => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <i className={`fas ${item.icon} text-indigo-600`}></i>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications[item.key]}
                onChange={(e) => updateField('notifications', item.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
            </label>
          </div>
        ))}
      </div>
    </div>

    {/* Actions */}
    <div className="flex flex-wrap gap-3 justify-end">
      <button
        onClick={handleTestEmail}
        className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:border-green-500 hover:text-green-600 transition-all flex items-center gap-2"
      >
        <i className="fas fa-paper-plane"></i>
        Send Test Email
      </button>
      <button
        onClick={onSave}
        disabled={saving}
        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-sm hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
      >
        <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
        Save Email Settings
      </button>
    </div>
  </div>
);

// Security Settings Tab
const SecuritySettingsTab = ({ settings, updateField, onSave, saving }) => (
  <div className="space-y-6">
    {/* Authentication */}
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
      <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
        <i className="fas fa-lock text-indigo-600"></i>
        Authentication Settings
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-mobile-alt text-green-600"></i>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Two-Factor Authentication</p>
              <p className="text-xs text-slate-500">Require 2FA for admin accounts</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.twoFactorAuth}
              onChange={(e) => updateField('security', 'twoFactorAuth', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-shield-alt text-amber-600"></i>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Force SSL/HTTPS</p>
              <p className="text-xs text-slate-500">Redirect all traffic to HTTPS</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.security.forceSSL}
              onChange={(e) => updateField('security', 'forceSSL', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
          </label>
        </div>
      </div>
    </div>

    {/* Session & Login */}
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
      <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
        <i className="fas fa-clock text-purple-600"></i>
        Session & Login Settings
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => updateField('security', 'sessionTimeout', parseInt(e.target.value))}
            min="5"
            max="1440"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          />
          <p className="text-xs text-slate-500 mt-1">Auto logout after inactivity (5-1440 mins)</p>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Max Login Attempts</label>
          <input
            type="number"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => updateField('security', 'maxLoginAttempts', parseInt(e.target.value))}
            min="3"
            max="10"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          />
          <p className="text-xs text-slate-500 mt-1">Lock account after failed attempts</p>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Password Policy</label>
          <select
            value={settings.security.passwordPolicy}
            onChange={(e) => updateField('security', 'passwordPolicy', e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          >
            <option value="basic">Basic (min 6 characters)</option>
            <option value="medium">Medium (min 8 chars + numbers)</option>
            <option value="strong">Strong (min 12 chars + special)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">IP Whitelist</label>
          <input
            type="text"
            value={settings.security.ipWhitelist}
            onChange={(e) => updateField('security', 'ipWhitelist', e.target.value)}
            placeholder="192.168.1.1, 10.0.0.0/8"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
          />
          <p className="text-xs text-slate-500 mt-1">Comma-separated IPs/CIDRs (optional)</p>
        </div>
      </div>
    </div>

    {/* Security Status */}
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
      <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
        <i className="fas fa-check-circle text-green-600"></i>
        Security Status
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'SSL Certificate', status: 'Valid', icon: 'fa-lock', color: 'text-green-600 bg-green-100' },
          { label: 'Firewall', status: 'Active', icon: 'fa-fire', color: 'text-green-600 bg-green-100' },
          { label: 'DDoS Protection', status: 'Enabled', icon: 'fa-shield-alt', color: 'text-green-600 bg-green-100' },
          { label: 'Last Security Scan', status: '2 days ago', icon: 'fa-search', color: 'text-amber-600 bg-amber-100' }
        ].map((item, index) => (
          <div key={index} className="p-4 bg-slate-50 rounded-xl text-center">
            <div className={`w-12 h-12 mx-auto mb-2 ${item.color} rounded-xl flex items-center justify-center`}>
              <i className={`fas ${item.icon}`}></i>
            </div>
            <p className="text-sm font-bold text-slate-900">{item.label}</p>
            <p className="text-xs text-slate-500">{item.status}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Save Button */}
    <div className="flex justify-end">
      <button
        onClick={onSave}
        disabled={saving}
        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-sm hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
      >
        <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`}></i>
        Save Security Settings
      </button>
    </div>
  </div>
);

// Integrations Tab
const IntegrationsTab = ({ systemInfo = {}, settings = {}, handleToggleMaintenance, handleResetToDefault }) => {
  // Ensure settings.system exists
  const systemSettings = settings.system || { maintenanceMode: false };
  
  // Format memory usage - handle both string and object formats
  const formatMemoryUsage = (mem) => {
    if (!mem) return 'N/A';
    if (typeof mem === 'string') return mem;
    if (typeof mem === 'object' && mem.heapUsed) {
      const heapUsedMB = (mem.heapUsed / 1024 / 1024).toFixed(2);
      return `${heapUsedMB} MB`;
    }
    return 'N/A';
  };

  // Format uptime - handle both string and number formats
  const formatUptime = (uptime) => {
    if (!uptime) return 'N/A';
    if (typeof uptime === 'string') return uptime;
    if (typeof uptime === 'number') {
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
    return 'N/A';
  };
  
  return (
  <div className="space-y-6">
    {/* System Information */}
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
      <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
        <i className="fas fa-server text-indigo-600"></i>
        System Information
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Node Version', value: systemInfo.nodeVersion || 'N/A', icon: 'fab fa-node-js', color: 'bg-green-100 text-green-600' },
          { label: 'Platform', value: systemInfo.platform || 'N/A', icon: 'fas fa-desktop', color: 'bg-blue-100 text-blue-600' },
          { label: 'Uptime', value: formatUptime(systemInfo.uptime), icon: 'fas fa-clock', color: 'bg-purple-100 text-purple-600' },
          { label: 'Memory Usage', value: formatMemoryUsage(systemInfo.memoryUsage), icon: 'fas fa-memory', color: 'bg-amber-100 text-amber-600' }
        ].map((item, index) => (
          <div key={index} className="p-4 bg-slate-50 rounded-xl">
            <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center mb-2`}>
              <i className={item.icon}></i>
            </div>
            <p className="text-xs font-bold text-slate-600">{item.label}</p>
            <p className="text-sm font-black text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Third-Party Integrations */}
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
      <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
        <i className="fas fa-plug text-purple-600"></i>
        Third-Party Integrations
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: 'Google Analytics', icon: 'fab fa-google', status: 'Connected', color: 'bg-red-100 text-red-600', connected: true },
          { name: 'Mailchimp', icon: 'fab fa-mailchimp', status: 'Not Connected', color: 'bg-amber-100 text-amber-600', connected: false },
          { name: 'Slack', icon: 'fab fa-slack', status: 'Connected', color: 'bg-purple-100 text-purple-600', connected: true },
          { name: 'Zapier', icon: 'fas fa-bolt', status: 'Not Connected', color: 'bg-orange-100 text-orange-600', connected: false },
          { name: 'AWS S3', icon: 'fab fa-aws', status: 'Connected', color: 'bg-yellow-100 text-yellow-600', connected: true },
          { name: 'Cloudinary', icon: 'fas fa-cloud', status: 'Connected', color: 'bg-blue-100 text-blue-600', connected: true }
        ].map((integration, index) => (
          <div key={index} className={`p-4 rounded-xl border-2 ${integration.connected ? 'border-green-200 bg-green-50' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${integration.color} rounded-lg flex items-center justify-center`}>
                  <i className={`${integration.icon}`}></i>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{integration.name}</p>
                  <p className={`text-xs font-medium ${integration.connected ? 'text-green-600' : 'text-slate-500'}`}>
                    {integration.status}
                  </p>
                </div>
              </div>
              <button className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                integration.connected 
                  ? 'bg-slate-200 text-slate-700 hover:bg-red-100 hover:text-red-600' 
                  : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
              } transition-all`}>
                {integration.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Maintenance Mode */}
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
      <h3 className="text-base lg:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
        <i className="fas fa-tools text-amber-600"></i>
        System Maintenance
      </h3>
      <div className="space-y-4">
        <div className={`flex items-center justify-between p-4 rounded-xl ${systemSettings.maintenanceMode ? 'bg-red-50 border-2 border-red-200' : 'bg-slate-50'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${systemSettings.maintenanceMode ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600'} rounded-lg flex items-center justify-center`}>
              <i className="fas fa-hard-hat"></i>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Maintenance Mode</p>
              <p className="text-xs text-slate-500">
                {systemSettings.maintenanceMode ? 'Site is currently in maintenance mode' : 'Site is live and accessible'}
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleMaintenance}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              systemSettings.maintenanceMode 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {systemSettings.maintenanceMode ? 'Disable' : 'Enable'}
          </button>
        </div>

        {/* System Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 border-2 border-transparent transition-all text-left">
            <i className="fas fa-sync text-indigo-600 text-xl mb-2"></i>
            <p className="text-sm font-bold text-slate-900">Clear Cache</p>
            <p className="text-xs text-slate-500">Clear all system cache</p>
          </button>
          <button className="p-4 bg-slate-50 rounded-xl hover:bg-green-50 hover:border-green-300 border-2 border-transparent transition-all text-left">
            <i className="fas fa-database text-green-600 text-xl mb-2"></i>
            <p className="text-sm font-bold text-slate-900">Backup Now</p>
            <p className="text-xs text-slate-500">Create database backup</p>
          </button>
          <button className="p-4 bg-slate-50 rounded-xl hover:bg-amber-50 hover:border-amber-300 border-2 border-transparent transition-all text-left">
            <i className="fas fa-history text-amber-600 text-xl mb-2"></i>
            <p className="text-sm font-bold text-slate-900">View Logs</p>
            <p className="text-xs text-slate-500">Check system logs</p>
          </button>
          <button 
            onClick={handleResetToDefault}
            className="p-4 bg-slate-50 rounded-xl hover:bg-red-50 hover:border-red-300 border-2 border-transparent transition-all text-left"
          >
            <i className="fas fa-undo text-red-600 text-xl mb-2"></i>
            <p className="text-sm font-bold text-slate-900">Reset Settings</p>
            <p className="text-xs text-slate-500">Restore defaults</p>
          </button>
        </div>
      </div>
    </div>

    {/* API Keys */}
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-lg border-2 border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base lg:text-lg font-black text-slate-900 flex items-center gap-2">
          <i className="fas fa-key text-green-600"></i>
          API Keys
        </h3>
        <button className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg font-bold text-sm hover:bg-indigo-200 transition-all">
          <i className="fas fa-plus mr-2"></i>
          Generate Key
        </button>
      </div>
      <div className="space-y-3">
        {[
          { name: 'Production API Key', key: 'pk_live_*****************************abc', created: 'Jan 15, 2024', status: 'Active' },
          { name: 'Development API Key', key: 'pk_test_*****************************xyz', created: 'Jan 10, 2024', status: 'Active' }
        ].map((apiKey, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="text-sm font-bold text-slate-900">{apiKey.name}</p>
              <p className="text-xs font-mono text-slate-500">{apiKey.key}</p>
              <p className="text-xs text-slate-400">Created: {apiKey.created}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg">{apiKey.status}</span>
              <button className="text-slate-400 hover:text-indigo-600">
                <i className="fas fa-copy"></i>
              </button>
              <button className="text-slate-400 hover:text-red-600">
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default AdminSettings;
