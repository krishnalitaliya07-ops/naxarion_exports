import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import HomePage from './pages/home/HomePage';
import ProductsPage from './pages/products/ProductsPage';
import CategoriesPage from './pages/categories/CategoriesPage';
import AboutPage from './pages/about/AboutPage';
import ServicesPage from './pages/services/ServicesPage';
import ContactPage from './pages/contact/ContactPage';
import SignupPage from './pages/auth/SignupPage';
import LoginPage from './pages/auth/LoginPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import GoogleCallbackPage from './pages/auth/GoogleCallbackPage';

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          top: 80,
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
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
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
      </Routes>
    </>
  );
}

export default App;

