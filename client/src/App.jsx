import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import DashboardLayout from './components/dashboard/DashboardLayout';
import AdminDashboardLayout from './components/dashboard/AdminDashboardLayout';
import SupplierDashboardLayout from './components/dashboard/SupplierDashboardLayout';
import SplashScreen from './components/SplashScreen';
import ScrollToTop from './components/ScrollToTop';
import SessionTimeout from './components/SessionTimeout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/home/HomePage';
import ProductsPage from './pages/products/ProductsPage';
import ProductDetail from './pages/products/ProductDetail';
import CategoriesPage from './pages/categories/CategoriesPage';
import AboutPage from './pages/about/AboutPage';
import ServicesPage from './pages/services/ServicesPage';
import ContactPage from './pages/contact/ContactPage';
import SignupPage from './pages/auth/SignupPage';
import LoginPage from './pages/auth/LoginPage';
import AdminLogin from './pages/auth/AdminLogin';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import GoogleCallbackPage from './pages/auth/GoogleCallbackPage';
import DashboardOverview from './components/dashboard/DashboardOverview';
import DashboardProducts from './components/dashboard/DashboardProducts';
import DashboardOrders from './components/dashboard/DashboardOrders';
import DashboardQuotes from './components/dashboard/DashboardQuotes';
import DashboardShipments from './components/dashboard/DashboardShipments';
import DashboardFavorites from './components/dashboard/DashboardFavorites';
import DashboardProfile from './components/dashboard/DashboardProfile';
import DashboardSettings from './components/dashboard/DashboardSettings';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSuppliers from './pages/admin/AdminSuppliers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminShipments from './pages/admin/AdminShipments';
import AdminPayments from './pages/admin/AdminPayments';
import AdminQuotes from './pages/admin/AdminQuotes';
import AdminContacts from './pages/admin/AdminContacts';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBrands from './pages/admin/AdminBrands';
import SupplierDashboard from './pages/supplier/SupplierDashboard';
import SupplierProducts from './pages/supplier/SupplierProducts';
import SupplierProductForm from './pages/supplier/SupplierProductForm';

function App() {
  return (
    <>
      <SplashScreen />
      <SessionTimeout />
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          top: 20,
          zIndex: 9999,
        }}
        toastOptions={{
          duration: 4000,
          className: '',
          style: {
            background: '#ffffff',
            color: '#1f2937',
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
            fontWeight: '500',
            fontSize: '14px',
            maxWidth: '500px',
            minWidth: '300px',
          },
          success: {
            duration: 4000,
            style: {
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
              color: '#065f46',
              border: '1px solid #10b981',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
              color: '#991b1b',
              border: '1px solid #ef4444',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
          loading: {
            style: {
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
              color: '#1e3a8a',
              border: '1px solid #3b82f6',
            },
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
        
        {/* Auth routes without layout */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Dashboard routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardOverview />} />
          <Route path="products" element={<DashboardProducts />} />
          <Route path="orders" element={<DashboardOrders />} />
          <Route path="quotes" element={<DashboardQuotes />} />
          <Route path="shipments" element={<DashboardShipments />} />
          <Route path="favorites" element={<DashboardFavorites />} />
          <Route path="profile" element={<DashboardProfile />} />
          <Route path="settings" element={<DashboardSettings />} />
        </Route>

        {/* Admin Dashboard routes */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="suppliers" element={<AdminSuppliers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/create" element={<AdminProductForm />} />
          <Route path="products/edit/:id" element={<AdminProductForm />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="brands" element={<AdminBrands />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="shipments" element={<AdminShipments />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="quotes" element={<AdminQuotes />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Supplier Dashboard routes */}
        <Route path="/supplier" element={
          <ProtectedRoute>
            <SupplierDashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<SupplierDashboard />} />
          <Route path="dashboard" element={<SupplierDashboard />} />
          <Route path="products" element={<SupplierProducts />} />
          <Route path="products/create" element={<SupplierProductForm />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

