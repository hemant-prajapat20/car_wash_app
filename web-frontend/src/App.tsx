import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';
import { CustomerRoutes } from './routes/CustomerRoutes';
import { AdminRoutes } from './routes/AdminRoutes';
import { VendorRoutes } from './routes/VendorRoutes';
import { VendorDemoLogin } from './pages/auth/VendorDemoLogin';

// Secret path from environment variables
const ADMIN_SECRET_PATH = import.meta.env.VITE_ADMIN_SECRET_PATH || '/admin-portal-login';

function App() {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!user;

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
      <Route path="/login" element={isAuthenticated ? <Navigate to={getHomeRedirect()} /> : <LoginPage />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to={getHomeRedirect()} /> : <SignupPage />} />
      <Route path="/vendor-demo" element={<VendorDemoLogin />} />
      
      {/* Secret Admin Login Route */}
      <Route path={ADMIN_SECRET_PATH} element={isAuthenticated ? <Navigate to="/admin/dashboard" /> : <AdminLoginPage />} />
      
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
        element={isAuthenticated && (user?.role === 'admin' || user?.role === 'superAdmin') ? <AdminRoutes /> : <Navigate to={ADMIN_SECRET_PATH} />} 
      />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
