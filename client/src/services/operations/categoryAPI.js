import { toast } from "react-hot-toast";
import { apiconnector } from "../apiconnector";
import { categoryEndpoints } from "../apis";

const {
  GET_ALL_CATEGORIES_API,
  GET_CATEGORY_BY_ID_API,
  GET_CATEGORY_STATS_API,
  CREATE_CATEGORY_API,
  UPDATE_CATEGORY_API,
  DELETE_CATEGORY_API,
} = categoryEndpoints;

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await apiconnector("GET", GET_ALL_CATEGORIES_API);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    console.error("GET ALL CATEGORIES API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to fetch categories");
    throw error;
  }
};

// Get single category
export const getCategoryById = async (id) => {
  try {
    const response = await apiconnector("GET", GET_CATEGORY_BY_ID_API(id));

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    console.error("GET CATEGORY BY ID API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to fetch category");
    throw error;
  }
};

// Get category stats
export const getCategoryStats = async () => {
  try {
    const response = await apiconnector("GET", GET_CATEGORY_STATS_API);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    console.error("GET CATEGORY STATS API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to fetch category stats");
    throw error;
  }
};

// Create category (admin only)
export const createCategory = async (categoryData, token) => {
  const toastId = toast.loading("Creating category...");
  try {
    const response = await apiconnector("POST", CREATE_CATEGORY_API, categoryData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Category created successfully!");
    return response.data;
  } catch (error) {
    console.error("CREATE CATEGORY API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to create category");
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
};

// Update category (admin only)
export const updateCategory = async (id, categoryData, token) => {
  const toastId = toast.loading("Updating category...");
  try {
    const response = await apiconnector("PUT", UPDATE_CATEGORY_API(id), categoryData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Category updated successfully!");
    return response.data;
  } catch (error) {
    console.error("UPDATE CATEGORY API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to update category");
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
};

// Delete category (admin only)
export const deleteCategory = async (id, token) => {
  const toastId = toast.loading("Deleting category...");
  try {
    const response = await apiconnector("DELETE", DELETE_CATEGORY_API(id), null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Category deleted successfully!");
    return response.data;
  } catch (error) {
    console.error("DELETE CATEGORY API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to delete category");
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
};
