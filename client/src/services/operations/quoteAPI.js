import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { adminEndpoints } from "../apis";

const {
  GET_ALL_QUOTES_API,
  GET_QUOTE_STATS_API,
  GET_QUOTE_BY_ID_API,
  UPDATE_QUOTE_STATUS_API,
  SEND_QUOTE_RESPONSE_API,
  ASSIGN_QUOTE_API,
  DELETE_QUOTE_API,
} = adminEndpoints;

// Get all quotes with filters
export const getAllQuotes = async (token, params = {}) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_QUOTES_API,
      null,
      { Authorization: `Bearer ${token}` },
      params
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    console.error("GET ALL QUOTES API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to fetch quotes");
    throw error;
  }
};

// Get quote statistics
export const getQuoteStats = async (token) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_QUOTE_STATS_API,
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    console.error("GET QUOTE STATS API ERROR:", error);
    throw error;
  }
};

// Get single quote by ID
export const getQuoteById = async (quoteId, token) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_QUOTE_BY_ID_API(quoteId),
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    console.error("GET QUOTE BY ID API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to fetch quote");
    throw error;
  }
};

// Update quote status
export const updateQuoteStatus = async (quoteId, status, token) => {
  const toastId = toast.loading("Updating status...");
  try {
    const response = await apiConnector(
      "PATCH",
      UPDATE_QUOTE_STATUS_API(quoteId),
      { status },
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Status updated successfully");
    return response.data;
  } catch (error) {
    console.error("UPDATE QUOTE STATUS API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to update status");
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
};

// Send quote response to customer
export const sendQuoteResponse = async (quoteId, responseData, token) => {
  const toastId = toast.loading("Sending quote response...");
  try {
    const response = await apiConnector(
      "POST",
      SEND_QUOTE_RESPONSE_API(quoteId),
      responseData,
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Quote response sent successfully");
    return response.data;
  } catch (error) {
    console.error("SEND QUOTE RESPONSE API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to send response");
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
};

// Assign quote to admin/user
export const assignQuote = async (quoteId, userId, token) => {
  const toastId = toast.loading("Assigning quote...");
  try {
    const response = await apiConnector(
      "PATCH",
      ASSIGN_QUOTE_API(quoteId),
      { assignedTo: userId },
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Quote assigned successfully");
    return response.data;
  } catch (error) {
    console.error("ASSIGN QUOTE API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to assign quote");
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
};

// Delete quote
export const deleteQuote = async (quoteId, token) => {
  const toastId = toast.loading("Deleting quote...");
  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_QUOTE_API(quoteId),
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Quote deleted successfully");
    return response.data;
  } catch (error) {
    console.error("DELETE QUOTE API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to delete quote");
    throw error;
  } finally {
    toast.dismiss(toastId);
  }
};
