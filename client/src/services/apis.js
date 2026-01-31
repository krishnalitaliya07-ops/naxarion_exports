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
  UPDATE_PRODUCT_SUMMARY_API: (id) => BASE_URL + `/products/${id}/summary`,
};

// CATEGORY ENDPOINTS
export const categoryEndpoints = {
  GET_ALL_CATEGORIES_API: BASE_URL + "/categories",
  GET_CATEGORY_BY_ID_API: (id) => BASE_URL + `/categories/${id}`,
  GET_CATEGORY_STATS_API: BASE_URL + "/categories/stats",
  GET_ADMIN_CATEGORIES_API: BASE_URL + "/categories/admin/all",
  CREATE_CATEGORY_API: BASE_URL + "/categories",
  UPDATE_CATEGORY_API: (id) => BASE_URL + `/categories/${id}`,
  DELETE_CATEGORY_API: (id) => BASE_URL + `/categories/${id}`,
  TOGGLE_CATEGORY_ACTIVE_API: (id) => BASE_URL + `/categories/${id}/toggle-active`,
};

// BRAND ENDPOINTS
export const brandEndpoints = {
  GET_ALL_BRANDS_API: BASE_URL + "/admin/brands",
  GET_BRAND_STATS_API: BASE_URL + "/admin/brands/stats",
  GET_BRAND_BY_ID_API: (id) => BASE_URL + `/admin/brands/${id}`,
  CREATE_BRAND_API: BASE_URL + "/admin/brands",
  UPDATE_BRAND_API: (id) => BASE_URL + `/admin/brands/${id}`,
  DELETE_BRAND_API: (id) => BASE_URL + `/admin/brands/${id}`,
  TOGGLE_BRAND_ACTIVE_API: (id) => BASE_URL + `/admin/brands/${id}/toggle-active`,
  TOGGLE_BRAND_FEATURED_API: (id) => BASE_URL + `/admin/brands/${id}/toggle-featured`,
  UPLOAD_BRAND_LOGO_API: BASE_URL + "/admin/brands/upload-logo",
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
  UPDATE_PAYMENT_STATUS_API: (id) => BASE_URL + `/payments/${id}/status`,
  GET_PAYMENT_STATS_API: BASE_URL + "/payments/stats",
  GET_MY_PAYMENTS_API: BASE_URL + "/payments/my/payments",
  PROCESS_PAYOUT_API: (id) => BASE_URL + `/payments/${id}/payout`,
  GET_COMMISSION_BREAKDOWN_API: BASE_URL + "/payments/commission-breakdown",
  GET_PAYMENT_METHODS_DISTRIBUTION_API: BASE_URL + "/payments/methods-distribution",
  EXPORT_PAYMENTS_REPORT_API: BASE_URL + "/payments/export",
};

// SHIPMENT ENDPOINTS
export const shipmentEndpoints = {
  GET_ALL_SHIPMENTS_API: BASE_URL + "/shipments",
  GET_SHIPMENT_BY_ID_API: (id) => BASE_URL + `/shipments/${id}`,
  CREATE_SHIPMENT_API: BASE_URL + "/shipments",
  UPDATE_SHIPMENT_API: (id) => BASE_URL + `/shipments/${id}`,
  DELETE_SHIPMENT_API: (id) => BASE_URL + `/shipments/${id}`,
  TRACK_SHIPMENT_API: (trackingNumber) => BASE_URL + `/shipments/track/${trackingNumber}`,
  UPDATE_SHIPMENT_STATUS_API: (id) => BASE_URL + `/shipments/${id}/status`,
  ADD_TRACKING_UPDATE_API: (id) => BASE_URL + `/shipments/${id}/tracking`,
  GET_SHIPMENT_STATS_API: BASE_URL + "/shipments/stats",
  NOTIFY_CUSTOMER_API: (id) => BASE_URL + `/shipments/${id}/notify`,
  DOWNLOAD_LABEL_API: (id) => BASE_URL + `/shipments/${id}/label`,
  EXPORT_SHIPMENTS_REPORT_API: BASE_URL + "/shipments/export",
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
  UPDATE_GENERAL_SETTINGS_API: BASE_URL + "/settings/general",
  UPDATE_PAYMENT_SETTINGS_API: BASE_URL + "/settings/payment",
  UPDATE_SHIPPING_SETTINGS_API: BASE_URL + "/settings/shipping",
  UPDATE_EMAIL_SETTINGS_API: BASE_URL + "/settings/email",
  UPDATE_BUSINESS_SETTINGS_API: BASE_URL + "/settings/business",
  UPDATE_NOTIFICATION_SETTINGS_API: BASE_URL + "/settings/notifications",
  UPDATE_SEO_SETTINGS_API: BASE_URL + "/settings/seo",
  UPDATE_SECURITY_SETTINGS_API: BASE_URL + "/settings/security",
  TOGGLE_MAINTENANCE_MODE_API: BASE_URL + "/settings/maintenance",
  UPDATE_LEGAL_DOCUMENTS_API: BASE_URL + "/settings/legal",
  UPLOAD_LOGO_API: BASE_URL + "/settings/upload-logo",
  UPLOAD_FAVICON_API: BASE_URL + "/settings/upload-favicon",
  RESET_TO_DEFAULT_API: BASE_URL + "/settings/reset",
  GET_SYSTEM_INFO_API: BASE_URL + "/settings/system-info",
  TEST_EMAIL_CONFIG_API: BASE_URL + "/settings/test-email",
  TEST_PAYMENT_CONFIG_API: BASE_URL + "/settings/test-payment",
};

// REPORTS ENDPOINTS
export const reportEndpoints = {
  // Overview Reports
  GET_REPORT_OVERVIEW_API: BASE_URL + "/reports/overview",
  GET_WEEKLY_REPORT_API: BASE_URL + "/reports/weekly",
  GET_MONTHLY_REPORT_API: BASE_URL + "/reports/monthly",
  GET_QUARTERLY_REPORT_API: BASE_URL + "/reports/quarterly",
  GET_YEARLY_REPORT_API: BASE_URL + "/reports/yearly",
  GET_CUSTOM_REPORT_API: BASE_URL + "/reports/custom",
  
  // Revenue & Sales Reports
  GET_REVENUE_REPORT_API: BASE_URL + "/reports/revenue",
  GET_REVENUE_TREND_API: BASE_URL + "/reports/revenue/trend",
  GET_SALES_BY_CATEGORY_API: BASE_URL + "/reports/sales/by-category",
  GET_SALES_BY_REGION_API: BASE_URL + "/reports/sales/by-region",
  GET_TOP_SELLING_PRODUCTS_API: BASE_URL + "/reports/products/top-selling",
  
  // User Reports
  GET_USER_ACTIVITY_REPORT_API: BASE_URL + "/reports/users/activity",
  GET_NEW_REGISTRATIONS_API: BASE_URL + "/reports/users/registrations",
  GET_USER_DEMOGRAPHICS_API: BASE_URL + "/reports/users/demographics",
  
  // Performance Reports
  GET_KPI_METRICS_API: BASE_URL + "/reports/kpi",
  GET_ORDER_SUCCESS_RATE_API: BASE_URL + "/reports/orders/success-rate",
  GET_AVG_ORDER_VALUE_API: BASE_URL + "/reports/orders/avg-value",
  GET_CUSTOMER_RETENTION_API: BASE_URL + "/reports/customers/retention",
  GET_CUSTOMER_SATISFACTION_API: BASE_URL + "/reports/customers/satisfaction",
  
  // Export Reports
  EXPORT_REPORT_PDF_API: BASE_URL + "/reports/export/pdf",
  EXPORT_REPORT_CSV_API: BASE_URL + "/reports/export/csv",
  EXPORT_REPORT_EXCEL_API: BASE_URL + "/reports/export/excel",
  
  // Scheduled Reports
  GET_SCHEDULED_REPORTS_API: BASE_URL + "/reports/scheduled",
  CREATE_SCHEDULED_REPORT_API: BASE_URL + "/reports/scheduled",
  UPDATE_SCHEDULED_REPORT_API: (id) => BASE_URL + `/reports/scheduled/${id}`,
  DELETE_SCHEDULED_REPORT_API: (id) => BASE_URL + `/reports/scheduled/${id}`,
};

// ADMIN ENDPOINTS
export const adminEndpoints = {
  // Dashboard
  GET_ADMIN_DASHBOARD_API: BASE_URL + "/admin/dashboard/overview",
  GET_ADMIN_STATS_API: BASE_URL + "/admin/stats",
  
  // User Management
  GET_ALL_USERS_API: BASE_URL + "/admin/users",
  CREATE_ADMIN_USER_API: BASE_URL + "/admin/users",
  GET_USER_BY_ID_API: (id) => BASE_URL + `/admin/users/${id}`,
  UPDATE_USER_API: (id) => BASE_URL + `/admin/users/${id}`,
  DELETE_USER_API: (id) => BASE_URL + `/admin/users/${id}`,
  TOGGLE_USER_ACTIVE_API: (id) => BASE_URL + `/admin/users/${id}/toggle-active`,
  
  // Supplier Management
  GET_ALL_SUPPLIERS_API: BASE_URL + "/admin/suppliers",
  GET_SUPPLIER_DETAILS_API: (id) => BASE_URL + `/admin/suppliers/${id}`,
  CREATE_SUPPLIER_API: BASE_URL + "/admin/suppliers",
  APPROVE_SUPPLIER_API: (id) => BASE_URL + `/admin/suppliers/${id}/approve`,
  REJECT_SUPPLIER_API: (id) => BASE_URL + `/admin/suppliers/${id}/reject`,
  
  // Product Management
  GET_ALL_PRODUCTS_API: BASE_URL + "/admin/products",
  GET_PRODUCT_STATS_API: BASE_URL + "/admin/products/stats",
  GET_PRODUCT_BY_ID_API: (id) => BASE_URL + `/admin/products/${id}`,
  CREATE_PRODUCT_API: BASE_URL + "/admin/products",
  UPLOAD_PRODUCT_IMAGE_API: BASE_URL + "/admin/products/upload-image",
  UPDATE_PRODUCT_API: (id) => BASE_URL + `/admin/products/${id}`,
  DELETE_PRODUCT_API: (id) => BASE_URL + `/admin/products/${id}`,
  APPROVE_PRODUCT_API: (id) => BASE_URL + `/admin/products/${id}/approve`,
  REJECT_PRODUCT_API: (id) => BASE_URL + `/admin/products/${id}/reject`,
  TOGGLE_PRODUCT_ACTIVE_API: (id) => BASE_URL + `/admin/products/${id}/toggle-active`,
  TOGGLE_PRODUCT_FEATURED_API: (id) => BASE_URL + `/admin/products/${id}/toggle-featured`,
  
  // Order Management
  GET_ALL_ORDERS_API: BASE_URL + "/admin/orders",
  GET_ORDER_STATS_API: BASE_URL + "/admin/orders/stats",
  GET_ORDER_BY_ID_API: (id) => BASE_URL + `/admin/orders/${id}`,
  CREATE_ORDER_API: BASE_URL + "/admin/orders",
  UPDATE_ORDER_STATUS_API: (id) => BASE_URL + `/admin/orders/${id}/status`,
  DELETE_ORDER_API: (id) => BASE_URL + `/admin/orders/${id}`,
  
  // Payment Management
  GET_ALL_PAYMENTS_API: BASE_URL + "/payments",
  GET_PAYMENT_BY_ID_API: (id) => BASE_URL + `/payments/${id}`,
  GET_PAYMENT_STATS_API: BASE_URL + "/payments/stats",
  UPDATE_PAYMENT_STATUS_API: (id) => BASE_URL + `/payments/${id}/status`,
  PROCESS_REFUND_API: (id) => BASE_URL + `/payments/${id}/refund`,
  PROCESS_PAYOUT_API: (id) => BASE_URL + `/payments/${id}/payout`,
  GET_COMMISSION_BREAKDOWN_API: BASE_URL + "/payments/commission-breakdown",
  GET_PAYMENT_METHODS_DISTRIBUTION_API: BASE_URL + "/payments/methods-distribution",
  
  // Quote Management
  GET_ALL_QUOTES_API: BASE_URL + "/admin/quotes",
  GET_QUOTE_STATS_API: BASE_URL + "/admin/quotes/stats",
  GET_QUOTE_BY_ID_API: (id) => BASE_URL + `/admin/quotes/${id}`,
  UPDATE_QUOTE_STATUS_API: (id) => BASE_URL + `/admin/quotes/${id}/status`,
  SEND_QUOTE_RESPONSE_API: (id) => BASE_URL + `/admin/quotes/${id}/respond`,
  ASSIGN_QUOTE_API: (id) => BASE_URL + `/admin/quotes/${id}/assign`,
  DELETE_QUOTE_API: (id) => BASE_URL + `/admin/quotes/${id}`,
  
  // Shipment Management
  GET_ALL_SHIPMENTS_API: BASE_URL + "/shipments",
  GET_SHIPMENT_BY_ID_API: (id) => BASE_URL + `/shipments/${id}`,
  CREATE_SHIPMENT_API: BASE_URL + "/shipments",
  UPDATE_SHIPMENT_API: (id) => BASE_URL + `/shipments/${id}`,
  DELETE_SHIPMENT_API: (id) => BASE_URL + `/shipments/${id}`,
  UPDATE_SHIPMENT_STATUS_API: (id) => BASE_URL + `/shipments/${id}/status`,
  ADD_TRACKING_UPDATE_API: (id) => BASE_URL + `/shipments/${id}/tracking`,
  GET_SHIPMENT_STATS_API: BASE_URL + "/shipments/stats",
  NOTIFY_CUSTOMER_API: (id) => BASE_URL + `/shipments/${id}/notify`,
  
  // Contact Management
  GET_ALL_CONTACTS_API: BASE_URL + "/admin/contacts",
};

export default BASE_URL;
