const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// DASHBOARD ENDPOINTS
export const dashboardEndpoints = {
  GET_OVERVIEW_API: BASE_URL + "/dashboard/overview",
  GET_STATS_API: BASE_URL + "/dashboard/stats",
  GET_ACTIVITY_API: BASE_URL + "/dashboard/activity",
  GET_ORDERS_API: BASE_URL + "/dashboard/orders",
  GET_QUOTES_API: BASE_URL + "/dashboard/quotes",
  GET_SHIPMENTS_API: BASE_URL + "/dashboard/shipments",
  GET_FAVORITES_API: BASE_URL + "/dashboard/favorites",
  ADD_TO_FAVORITES_API: (productId) => BASE_URL + `/dashboard/favorites/${productId}`,
  REMOVE_FROM_FAVORITES_API: (productId) => BASE_URL + `/dashboard/favorites/${productId}`,
  GET_RECENTLY_VIEWED_API: BASE_URL + "/dashboard/recently-viewed",
  ADD_TO_RECENTLY_VIEWED_API: (productId) => BASE_URL + `/dashboard/recently-viewed/${productId}`,
};

// AUTH ENDPOINTS
export const authEndpoints = {
  REGISTER_API: BASE_URL + "/auth/register",
  LOGIN_API: BASE_URL + "/auth/login",
  LOGOUT_API: BASE_URL + "/auth/logout",
  GET_ME_API: BASE_URL + "/auth/me",
  UPDATE_PROFILE_API: BASE_URL + "/auth/updatedetails",
  UPDATE_PASSWORD_API: BASE_URL + "/auth/updatepassword",
  FORGOT_PASSWORD_API: BASE_URL + "/auth/forgotpassword",
  RESET_PASSWORD_API: (token) => BASE_URL + `/auth/resetpassword/${token}`,
  VERIFY_EMAIL_API: BASE_URL + "/auth/verify-email",
  RESEND_CODE_API: BASE_URL + "/auth/resend-code",
  GOOGLE_AUTH_API: BASE_URL + "/auth/google",
  GET_SETTINGS_API: BASE_URL + "/auth/settings",
  UPDATE_SETTINGS_API: BASE_URL + "/auth/settings",
};

// PRODUCT ENDPOINTS
export const productEndpoints = {
  GET_ALL_PRODUCTS_API: BASE_URL + "/products",
  GET_PRODUCT_BY_ID_API: (id) => BASE_URL + `/products/${id}`,
  GET_FEATURED_PRODUCTS_API: BASE_URL + "/products/featured",
  GET_PRODUCTS_BY_CATEGORY_API: (categoryId) => BASE_URL + `/products/category/${categoryId}`,
  GET_PRODUCTS_BY_SUPPLIER_API: (supplierId) => BASE_URL + `/products/supplier/${supplierId}`,
  CREATE_PRODUCT_API: BASE_URL + "/products",
  UPDATE_PRODUCT_API: (id) => BASE_URL + `/products/${id}`,
  DELETE_PRODUCT_API: (id) => BASE_URL + `/products/${id}`,
  UPDATE_STOCK_API: (id) => BASE_URL + `/products/${id}/stock`,
  TOGGLE_FEATURED_API: (id) => BASE_URL + `/products/${id}/toggle-featured`,
};

// CATEGORY ENDPOINTS
export const categoryEndpoints = {
  GET_ALL_CATEGORIES_API: BASE_URL + "/categories",
  GET_CATEGORY_BY_ID_API: (id) => BASE_URL + `/categories/${id}`,
  GET_CATEGORY_STATS_API: BASE_URL + "/categories/stats",
  CREATE_CATEGORY_API: BASE_URL + "/categories",
  UPDATE_CATEGORY_API: (id) => BASE_URL + `/categories/${id}`,
  DELETE_CATEGORY_API: (id) => BASE_URL + `/categories/${id}`,
};

// SUPPLIER ENDPOINTS
export const supplierEndpoints = {
  GET_ALL_SUPPLIERS_API: BASE_URL + "/suppliers",
  GET_SUPPLIER_BY_ID_API: (id) => BASE_URL + `/suppliers/${id}`,
  GET_VERIFIED_SUPPLIERS_API: BASE_URL + "/suppliers/verified",
  GET_SUPPLIER_STATS_API: BASE_URL + "/suppliers/stats",
  CREATE_SUPPLIER_API: BASE_URL + "/suppliers",
  UPDATE_SUPPLIER_API: (id) => BASE_URL + `/suppliers/${id}`,
  DELETE_SUPPLIER_API: (id) => BASE_URL + `/suppliers/${id}`,
  VERIFY_SUPPLIER_API: (id) => BASE_URL + `/suppliers/${id}/verify`,
  TOGGLE_FEATURED_API: (id) => BASE_URL + `/suppliers/${id}/toggle-featured`,
};

// ORDER ENDPOINTS
export const orderEndpoints = {
  GET_ALL_ORDERS_API: BASE_URL + "/orders",
  GET_MY_ORDERS_API: BASE_URL + "/orders/myorders",
  GET_ORDER_BY_ID_API: (id) => BASE_URL + `/orders/${id}`,
  CREATE_ORDER_API: BASE_URL + "/orders",
  UPDATE_ORDER_API: (id) => BASE_URL + `/orders/${id}`,
  CANCEL_ORDER_API: (id) => BASE_URL + `/orders/${id}/cancel`,
  UPDATE_STATUS_API: (id) => BASE_URL + `/orders/${id}/status`,
  GET_ORDER_STATS_API: BASE_URL + "/orders/stats",
};

// QUOTE ENDPOINTS
export const quoteEndpoints = {
  GET_ALL_QUOTES_API: BASE_URL + "/quotes",
  GET_MY_QUOTES_API: BASE_URL + "/quotes/myquotes",
  GET_QUOTE_BY_ID_API: (id) => BASE_URL + `/quotes/${id}`,
  CREATE_QUOTE_API: BASE_URL + "/quotes",
  UPDATE_QUOTE_API: (id) => BASE_URL + `/quotes/${id}`,
  DELETE_QUOTE_API: (id) => BASE_URL + `/quotes/${id}`,
  RESPOND_TO_QUOTE_API: (id) => BASE_URL + `/quotes/${id}/respond`,
  ACCEPT_QUOTE_API: (id) => BASE_URL + `/quotes/${id}/accept`,
  REJECT_QUOTE_API: (id) => BASE_URL + `/quotes/${id}/reject`,
};

// PAYMENT ENDPOINTS
export const paymentEndpoints = {
  GET_ALL_PAYMENTS_API: BASE_URL + "/payments",
  GET_PAYMENT_BY_ID_API: (id) => BASE_URL + `/payments/${id}`,
  CREATE_PAYMENT_API: BASE_URL + "/payments",
  VERIFY_PAYMENT_API: (id) => BASE_URL + `/payments/${id}/verify`,
  REFUND_PAYMENT_API: (id) => BASE_URL + `/payments/${id}/refund`,
  GET_PAYMENT_STATS_API: BASE_URL + "/payments/stats",
};

// SHIPMENT ENDPOINTS
export const shipmentEndpoints = {
  GET_ALL_SHIPMENTS_API: BASE_URL + "/shipments",
  GET_SHIPMENT_BY_ID_API: (id) => BASE_URL + `/shipments/${id}`,
  CREATE_SHIPMENT_API: BASE_URL + "/shipments",
  UPDATE_SHIPMENT_API: (id) => BASE_URL + `/shipments/${id}`,
  TRACK_SHIPMENT_API: (trackingNumber) => BASE_URL + `/shipments/track/${trackingNumber}`,
  UPDATE_LOCATION_API: (id) => BASE_URL + `/shipments/${id}/location`,
  MARK_DELIVERED_API: (id) => BASE_URL + `/shipments/${id}/deliver`,
};

// REVIEW ENDPOINTS
export const reviewEndpoints = {
  GET_ALL_REVIEWS_API: BASE_URL + "/reviews",
  GET_PRODUCT_REVIEWS_API: (productId) => BASE_URL + `/reviews/product/${productId}`,
  GET_SUPPLIER_REVIEWS_API: (supplierId) => BASE_URL + `/reviews/supplier/${supplierId}`,
  CREATE_REVIEW_API: BASE_URL + "/reviews",
  UPDATE_REVIEW_API: (id) => BASE_URL + `/reviews/${id}`,
  DELETE_REVIEW_API: (id) => BASE_URL + `/reviews/${id}`,
  LIKE_REVIEW_API: (id) => BASE_URL + `/reviews/${id}/like`,
  REPORT_REVIEW_API: (id) => BASE_URL + `/reviews/${id}/report`,
};

// CONTACT ENDPOINTS
export const contactEndpoints = {
  SUBMIT_CONTACT_API: BASE_URL + "/contacts",
  GET_ALL_CONTACTS_API: BASE_URL + "/contacts",
  GET_CONTACT_BY_ID_API: (id) => BASE_URL + `/contacts/${id}`,
  GET_CONTACT_STATS_API: BASE_URL + "/contacts/stats",
  UPDATE_CONTACT_STATUS_API: (id) => BASE_URL + `/contacts/${id}/status`,
  RESPOND_TO_CONTACT_API: (id) => BASE_URL + `/contacts/${id}/respond`,
  ASSIGN_CONTACT_API: (id) => BASE_URL + `/contacts/${id}/assign`,
  ADD_NOTE_API: (id) => BASE_URL + `/contacts/${id}/notes`,
  DELETE_CONTACT_API: (id) => BASE_URL + `/contacts/${id}`,
};

// NOTIFICATION ENDPOINTS
export const notificationEndpoints = {
  GET_ALL_NOTIFICATIONS_API: BASE_URL + "/notifications",
  GET_UNREAD_COUNT_API: BASE_URL + "/notifications/unread-count",
  MARK_AS_READ_API: (id) => BASE_URL + `/notifications/${id}/read`,
  MARK_ALL_AS_READ_API: BASE_URL + "/notifications/mark-all-read",
  DELETE_NOTIFICATION_API: (id) => BASE_URL + `/notifications/${id}`,
  DELETE_ALL_NOTIFICATIONS_API: BASE_URL + "/notifications/delete-all",
};

// USER ENDPOINTS
export const userEndpoints = {
  GET_ALL_USERS_API: BASE_URL + "/users",
  GET_USER_BY_ID_API: (id) => BASE_URL + `/users/${id}`,
  UPDATE_USER_API: (id) => BASE_URL + `/users/${id}`,
  DELETE_USER_API: (id) => BASE_URL + `/users/${id}`,
  UPDATE_USER_ROLE_API: (id) => BASE_URL + `/users/${id}/role`,
  BLOCK_USER_API: (id) => BASE_URL + `/users/${id}/block`,
  UNBLOCK_USER_API: (id) => BASE_URL + `/users/${id}/unblock`,
  GET_USER_STATS_API: BASE_URL + "/users/stats",
  UPLOAD_PROFILE_PHOTO_API: BASE_URL + "/users/upload-photo",
};

// SETTINGS ENDPOINTS
export const settingsEndpoints = {
  GET_SETTINGS_API: BASE_URL + "/settings",
  UPDATE_SETTINGS_API: BASE_URL + "/settings",
  GET_SHIPPING_METHODS_API: BASE_URL + "/settings/shipping-methods",
  GET_PAYMENT_METHODS_API: BASE_URL + "/settings/payment-methods",
  UPDATE_SHIPPING_METHOD_API: (id) => BASE_URL + `/settings/shipping-methods/${id}`,
  UPDATE_PAYMENT_METHOD_API: (id) => BASE_URL + `/settings/payment-methods/${id}`,
};

export default BASE_URL;
