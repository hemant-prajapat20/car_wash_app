import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { VendorLayout } from '../layouts/VendorLayout';
import { VendorDashboard } from '../pages/vendor/VendorDashboard';
import { VendorServices } from '../pages/vendor/VendorServices';
import { ManageBookings } from '../pages/vendor/ManageBookings';
import { SlotManagement } from '../pages/vendor/SlotManagement';
import { ManageWorkers } from '../pages/vendor/ManageWorkers';
import { VendorCustomers } from '../pages/vendor/VendorCustomers';
import { VendorTransactions } from '../pages/vendor/VendorTransactions';
import { VendorReports } from '../pages/vendor/VendorReports';
import { NotificationCenter } from '../pages/vendor/NotificationCenter';
import { VendorProfile } from '../pages/vendor/VendorProfile';

export const VendorRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<VendorLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<VendorDashboard />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route path="slots" element={<SlotManagement />} />
        <Route path="services" element={<VendorServices />} />
        <Route path="workers" element={<ManageWorkers />} />
        <Route path="customers" element={<VendorCustomers />} />
        <Route path="transactions" element={<VendorTransactions />} />
        <Route path="reports" element={<VendorReports />} />
        <Route path="notifications" element={<NotificationCenter />} />
        <Route path="profile" element={<VendorProfile />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};
