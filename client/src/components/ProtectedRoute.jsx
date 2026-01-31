import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to appropriate login page based on required role
    const loginPath = requiredRole === 'admin' ? '/admin/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location.pathname }} replace />;
  }

  // Check if user has required role
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect based on actual role
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // If no specific role required, but user is admin accessing regular dashboard, redirect to admin dashboard
  if (!requiredRole && user?.role === 'admin' && location.pathname.startsWith('/dashboard')) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
