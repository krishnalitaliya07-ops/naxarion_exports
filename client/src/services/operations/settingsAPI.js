import axios from 'axios';
import { toast } from 'react-hot-toast';
import { settingsEndpoints } from '../apis';

const {
  GET_SETTINGS_API,
  UPDATE_SETTINGS_API,
  UPDATE_GENERAL_SETTINGS_API,
  UPDATE_PAYMENT_SETTINGS_API,
  UPDATE_SHIPPING_SETTINGS_API,
  UPDATE_EMAIL_SETTINGS_API,
  UPDATE_BUSINESS_SETTINGS_API,
  UPDATE_NOTIFICATION_SETTINGS_API,
  UPDATE_SEO_SETTINGS_API,
  UPDATE_SECURITY_SETTINGS_API,
  TOGGLE_MAINTENANCE_MODE_API,
  UPDATE_LEGAL_DOCUMENTS_API,
  UPLOAD_LOGO_API,
  UPLOAD_FAVICON_API,
  RESET_TO_DEFAULT_API,
  GET_SYSTEM_INFO_API,
  TEST_EMAIL_CONFIG_API,
  TEST_PAYMENT_CONFIG_API
} = settingsEndpoints;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Helper function to get multipart headers for file uploads
const getMultipartHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  };
};

// Get All Settings
export const getSettings = async () => {
  try {
    const response = await axios.get(GET_SETTINGS_API, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    toast.error(error.response?.data?.message || 'Failed to fetch settings');
    throw error;
  }
};

// Update All Settings
export const updateSettings = async (data) => {
  try {
    const response = await axios.put(UPDATE_SETTINGS_API, data, {
      headers: getAuthHeaders()
    });
    toast.success('Settings updated successfully');
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    toast.error(error.response?.data?.message || 'Failed to update settings');
    throw error;
  }
};

// Update General Settings
export const updateGeneralSettings = async (data) => {
  try {
    const response = await axios.put(UPDATE_GENERAL_SETTINGS_API, data, {
      headers: getAuthHeaders()
    });
    toast.success('General settings updated successfully');
    return response.data;
  } catch (error) {
    console.error('Error updating general settings:', error);
    toast.error(error.response?.data?.message || 'Failed to update general settings');
    throw error;
  }
};

// Update Payment Settings
export const updatePaymentSettings = async (data) => {
  try {
    const response = await axios.put(UPDATE_PAYMENT_SETTINGS_API, data, {
      headers: getAuthHeaders()
    });
    toast.success('Payment settings updated successfully');
    return response.data;
  } catch (error) {
    console.error('Error updating payment settings:', error);
    toast.error(error.response?.data?.message || 'Failed to update payment settings');
    throw error;
  }
};

// Update Shipping Settings
export const updateShippingSettings = async (data) => {
  try {
    const response = await axios.put(UPDATE_SHIPPING_SETTINGS_API, data, {
      headers: getAuthHeaders()
    });
    toast.success('Shipping settings updated successfully');
    return response.data;
  } catch (error) {
    console.error('Error updating shipping settings:', error);
    toast.error(error.response?.data?.message || 'Failed to update shipping settings');
    throw error;
  }
};

// Update Email Settings
export const updateEmailSettings = async (data) => {
  try {
    const response = await axios.put(UPDATE_EMAIL_SETTINGS_API, data, {
      headers: getAuthHeaders()
    });
    toast.success('Email settings updated successfully');
    return response.data;
  } catch (error) {
    console.error('Error updating email settings:', error);
    toast.error(error.response?.data?.message || 'Failed to update email settings');
    throw error;
  }
};

// Update Business Settings
export const updateBusinessSettings = async (data) => {
  try {
    const response = await axios.put(UPDATE_BUSINESS_SETTINGS_API, data, {
      headers: getAuthHeaders()
    });
    toast.success('Business settings updated successfully');
    return response.data;
  } catch (error) {
    console.error('Error updating business settings:', error);
    toast.error(error.response?.data?.message || 'Failed to update business settings');
    throw error;
  }
};

// Update Notification Settings
export const updateNotificationSettings = async (data) => {
  try {
    const response = await axios.put(UPDATE_NOTIFICATION_SETTINGS_API, data, {
      headers: getAuthHeaders()
    });
    toast.success('Notification settings updated successfully');
    return response.data;
  } catch (error) {
    console.error('Error updating notification settings:', error);
    toast.error(error.response?.data?.message || 'Failed to update notification settings');
    throw error;
  }
};

// Update SEO Settings
export const updateSEOSettings = async (data) => {
  try {
    const response = await axios.put(UPDATE_SEO_SETTINGS_API, data, {
      headers: getAuthHeaders()
    });
    toast.success('SEO settings updated successfully');
    return response.data;
  } catch (error) {
    console.error('Error updating SEO settings:', error);
    toast.error(error.response?.data?.message || 'Failed to update SEO settings');
    throw error;
  }
};

// Update Security Settings
export const updateSecuritySettings = async (data) => {
  try {
    const response = await axios.put(UPDATE_SECURITY_SETTINGS_API, data, {
      headers: getAuthHeaders()
    });
    toast.success('Security settings updated successfully');
    return response.data;
  } catch (error) {
    console.error('Error updating security settings:', error);
    toast.error(error.response?.data?.message || 'Failed to update security settings');
    throw error;
  }
};

// Toggle Maintenance Mode
export const toggleMaintenanceMode = async (enabled, message = '') => {
  try {
    const response = await axios.put(TOGGLE_MAINTENANCE_MODE_API, {
      enabled,
      message
    }, {
      headers: getAuthHeaders()
    });
    toast.success(enabled ? 'Maintenance mode enabled' : 'Maintenance mode disabled');
    return response.data;
  } catch (error) {
    console.error('Error toggling maintenance mode:', error);
    toast.error(error.response?.data?.message || 'Failed to toggle maintenance mode');
    throw error;
  }
};

// Update Legal Documents
export const updateLegalDocuments = async (data) => {
  try {
    const response = await axios.put(UPDATE_LEGAL_DOCUMENTS_API, data, {
      headers: getAuthHeaders()
    });
    toast.success('Legal documents updated successfully');
    return response.data;
  } catch (error) {
    console.error('Error updating legal documents:', error);
    toast.error(error.response?.data?.message || 'Failed to update legal documents');
    throw error;
  }
};

// Upload Logo
export const uploadLogo = async (file, logoType = 'main') => {
  try {
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('logoType', logoType);
    
    const response = await axios.post(UPLOAD_LOGO_API, formData, {
      headers: getMultipartHeaders()
    });
    toast.success('Logo uploaded successfully');
    return response.data;
  } catch (error) {
    console.error('Error uploading logo:', error);
    toast.error(error.response?.data?.message || 'Failed to upload logo');
    throw error;
  }
};

// Upload Favicon
export const uploadFavicon = async (file) => {
  try {
    const formData = new FormData();
    formData.append('favicon', file);
    
    const response = await axios.post(UPLOAD_FAVICON_API, formData, {
      headers: getMultipartHeaders()
    });
    toast.success('Favicon uploaded successfully');
    return response.data;
  } catch (error) {
    console.error('Error uploading favicon:', error);
    toast.error(error.response?.data?.message || 'Failed to upload favicon');
    throw error;
  }
};

// Reset Settings to Default
export const resetToDefault = async (section = 'all') => {
  try {
    const response = await axios.put(RESET_TO_DEFAULT_API, { section }, {
      headers: getAuthHeaders()
    });
    toast.success('Settings reset to default successfully');
    return response.data;
  } catch (error) {
    console.error('Error resetting settings:', error);
    toast.error(error.response?.data?.message || 'Failed to reset settings');
    throw error;
  }
};

// Get System Info
export const getSystemInfo = async () => {
  try {
    const response = await axios.get(GET_SYSTEM_INFO_API, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching system info:', error);
    toast.error(error.response?.data?.message || 'Failed to fetch system info');
    throw error;
  }
};

// Test Email Configuration
export const testEmailConfig = async (testEmail) => {
  try {
    const response = await axios.post(TEST_EMAIL_CONFIG_API, { testEmail }, {
      headers: getAuthHeaders()
    });
    toast.success('Test email sent successfully');
    return response.data;
  } catch (error) {
    console.error('Error testing email config:', error);
    toast.error(error.response?.data?.message || 'Failed to test email configuration');
    throw error;
  }
};

// Test Payment Configuration
export const testPaymentConfig = async (provider) => {
  try {
    const response = await axios.post(TEST_PAYMENT_CONFIG_API, { provider }, {
      headers: getAuthHeaders()
    });
    toast.success('Payment configuration test successful');
    return response.data;
  } catch (error) {
    console.error('Error testing payment config:', error);
    toast.error(error.response?.data?.message || 'Failed to test payment configuration');
    throw error;
  }
};

// Save all settings at once (convenience function)
export const saveAllSettings = async (settings) => {
  const loadingToast = toast.loading('Saving all settings...');
  try {
    const response = await axios.put(UPDATE_SETTINGS_API, settings, {
      headers: getAuthHeaders()
    });
    toast.dismiss(loadingToast);
    toast.success('All settings saved successfully');
    return response.data;
  } catch (error) {
    toast.dismiss(loadingToast);
    console.error('Error saving all settings:', error);
    toast.error(error.response?.data?.message || 'Failed to save settings');
    throw error;
  }
};
