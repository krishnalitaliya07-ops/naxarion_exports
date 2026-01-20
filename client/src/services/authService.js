import api from './api';

export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  // Update user details
  updateDetails: async (data) => {
    const response = await api.put('/auth/updatedetails', data);
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  // Update password
  updatePassword: async (data) => {
    return await api.put('/auth/updatepassword', data);
  },

  // Forgot password
  forgotPassword: async (email) => {
    return await api.post('/auth/forgotpassword', { email });
  },

  // Reset password
  resetPassword: async (resetToken, password) => {
    return await api.put(`/auth/resetpassword/${resetToken}`, { password });
  },
};

export default authService;
