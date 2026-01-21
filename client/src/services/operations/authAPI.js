import { toast } from "react-hot-toast";
import { apiconnector } from "../apiconnector";
import { authEndpoints } from "../apis";

const {
  REGISTER_API,
  LOGIN_API,
  LOGOUT_API,
  GET_ME_API,
  UPDATE_PROFILE_API,
  UPDATE_PASSWORD_API,
  FORGOT_PASSWORD_API,
  RESET_PASSWORD_API,
  VERIFY_EMAIL_API,
} = authEndpoints;

// Register new user
export const register = async (userData) => {
  const toastId = toast.loading("Creating your account...");
  try {
    const response = await apiconnector("POST", REGISTER_API, userData);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Account created successfully!");
    
    // Store token and user data
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    console.error("REGISTER API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to create account");
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
};

// Login user
export const login = async (credentials) => {
  const toastId = toast.loading("Logging in...");
  try {
    const response = await apiconnector("POST", LOGIN_API, credentials);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Login successful!");
    
    // Store token and user data
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    console.error("LOGIN API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to login");
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
};

// Logout user
export const logout = async () => {
  try {
    await apiconnector("POST", LOGOUT_API);
    
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    toast.success("Logged out successfully!");
  } catch (error) {
    console.error("LOGOUT API ERROR:", error);
    toast.error("Logout failed");
  }
};

// Get current user
export const getCurrentUser = async (token) => {
  try {
    const response = await apiconnector("GET", GET_ME_API, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    // Update stored user data
    localStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    console.error("GET ME API ERROR:", error);
    throw error;
  }
};

// Update profile
export const updateProfile = async (userData, token) => {
  const toastId = toast.loading("Updating profile...");
  try {
    const response = await apiconnector("PUT", UPDATE_PROFILE_API, userData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Profile updated successfully!");
    
    // Update stored user data
    localStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    console.error("UPDATE PROFILE API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to update profile");
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
};

// Update password
export const updatePassword = async (passwordData, token) => {
  const toastId = toast.loading("Updating password...");
  try {
    const response = await apiconnector("PUT", UPDATE_PASSWORD_API, passwordData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Password updated successfully!");
    
    // Update token if new one is returned
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error("UPDATE PASSWORD API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to update password");
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  const toastId = toast.loading("Sending reset email...");
  try {
    const response = await apiconnector("POST", FORGOT_PASSWORD_API, { email });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Password reset email sent!");
    return response.data;
  } catch (error) {
    console.error("FORGOT PASSWORD API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to send reset email");
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
};

// Reset password
export const resetPassword = async (token, password) => {
  const toastId = toast.loading("Resetting password...");
  try {
    const response = await apiconnector("PUT", RESET_PASSWORD_API(token), { password });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Password reset successful!");
    return response.data;
  } catch (error) {
    console.error("RESET PASSWORD API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to reset password");
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
};

// Verify email
export const verifyEmail = async (token) => {
  const toastId = toast.loading("Verifying email...");
  try {
    const response = await apiconnector("GET", VERIFY_EMAIL_API(token));

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Email verified successfully!");
    return response.data;
  } catch (error) {
    console.error("VERIFY EMAIL API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to verify email");
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Get stored user
export const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Get stored token
export const getToken = () => {
  return localStorage.getItem("token");
};
