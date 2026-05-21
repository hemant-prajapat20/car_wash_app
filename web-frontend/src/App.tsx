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
import { VendorDemoLogin } from './pages/auth/VendorDemoLogin';
import { InvoicePage } from './pages/InvoicePage';
import { DesktopOnlyRoute } from './components/auth/DesktopOnlyRoute';

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
      <Route path="/vendor-demo" element={<VendorDemoLogin />} />
      
      {/* Secret Admin Login Route */}
      <Route path={ADMIN_ACCESS_PATH} element={<DesktopOnlyRoute>{isAuthenticated ? <Navigate to={getHomeRedirect()} /> : <AdminAccessPage />}</DesktopOnlyRoute>} />
      
      {/* Shared Invoice Page */}
      <Route path="/invoice/:bookingId" element={isAuthenticated ? <InvoicePage /> : <Navigate to="/login" />} />
      
      {/* Customer Panel Routes (Nested) */}
      <Route 
        path="/customer/*" 
        element={isAuthenticated && user?.role === 'customer' ? <CustomerRoutes /> : <Navigate to="/login" />} 
      />
      
      {/* Vendor Portal Routes (Nested) */}
      <Route 
        path="/vendor/*" 
        element={isAuthenticated && user?.role === 'vendor' ? <VendorRoutes /> : <Navigate to="/login" />} 
      />
      
      {/* SuperAdmin Panel Routes (Nested & Protected) */}
      <Route 
        path="/admin/*" 
        element={<DesktopOnlyRoute>{isAuthenticated && (user?.role === 'admin' || user?.role === 'superAdmin') ? <AdminRoutes /> : <Navigate to={isAuthenticated ? getHomeRedirect() : ADMIN_ACCESS_PATH} />}</DesktopOnlyRoute>} 
      />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
