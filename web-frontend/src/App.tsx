import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { AdminAccessPage } from './pages/auth/AdminAccessPage';
import { CustomerRoutes } from './routes/CustomerRoutes';
import { AdminRoutes } from './routes/AdminRoutes';
import { VendorRoutes } from './routes/VendorRoutes';
import { InvoicePage } from './pages/InvoicePage';

import { RoleProtectedRoute } from './components/auth/RoleProtectedRoute';

// Secret path from environment variables
const ADMIN_ACCESS_PATH = '/admin-access';

function App() {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!user;

  // Diagnostic Log for Visibility Debugging
  console.log('[Auth Monitor]', { isAuthenticated, role: user?.role, path: window.location.pathname });

  const getHomeRedirect = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
      case 'superAdmin': return '/admin/dashboard';
      case 'vendor': return '/vendor/dashboard';
      default: return '/customer/search';
    }
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      
      {/* Secret Admin Login Route */}
      <Route path={ADMIN_ACCESS_PATH} element={isAuthenticated ? <Navigate to={getHomeRedirect()} /> : <AdminAccessPage />} />
      
      {/* Shared Invoice Page */}
      <Route path="/invoice/:bookingId" element={isAuthenticated ? <InvoicePage /> : <Navigate to="/login" />} />
      
      {/* SuperAdmin Panel Routes (Nested & Protected) */}
      <Route 
        path="/admin/*" 
        element={
          <RoleProtectedRoute allowedRoles={['admin','superAdmin']}>
            <AdminRoutes />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Vendor Portal Routes (Nested & Protected) */}
      <Route 
        path="/vendor/*" 
        element={
          <RoleProtectedRoute allowedRoles={['vendor']} fallbackPath="/login">
            <VendorRoutes />
          </RoleProtectedRoute>
        } 
      />
      
      {/* Customer Panel Routes (Nested & Protected) */}
      <Route 
        path="/customer/*" 
        element={
          <RoleProtectedRoute allowedRoles={['customer']} fallbackPath="/login">
            <CustomerRoutes />
          </RoleProtectedRoute>
        } 
      />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
