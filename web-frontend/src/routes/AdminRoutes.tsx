import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { VendorRegistration } from '../pages/admin/VendorRegistration';
import { VendorManagement } from '../pages/admin/VendorManagement';

// Default import for the AdminProfile component
import AdminProfile from '../pages/admin/AdminProfile';

export const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        {/* Default redirect to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
        
        {/* Management Routes */}
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="register-vendor" element={<VendorRegistration />} />
        <Route path="vendors" element={<VendorManagement />} />
        
        {/* Admin Specific Routes */}
        <Route path="notifications" element={<div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Notification Center • Coming Soon</div>} />
        <Route path="profile" element={<AdminProfile />} />

        {/* Fallback for admin routes */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};
