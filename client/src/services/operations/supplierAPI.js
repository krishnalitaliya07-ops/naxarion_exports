import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { supplierEndpoints } from "../apis";

const {
  GET_ALL_SUPPLIERS_API,
  GET_SUPPLIER_BY_ID_API,
} = supplierEndpoints;

// Get all suppliers
export const getAllSuppliers = async () => {
  try {
    const response = await apiConnector("GET", GET_ALL_SUPPLIERS_API);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    console.error("GET ALL SUPPLIERS API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to fetch suppliers");
    throw error;
  }
};

// Get supplier by ID
export const getSupplierById = async (id) => {
  try {
    const response = await apiConnector("GET", GET_SUPPLIER_BY_ID_API(id));

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    console.error("GET SUPPLIER BY ID API ERROR:", error);
    toast.error(error.response?.data?.message || "Failed to fetch supplier");
    throw error;
  }
};
