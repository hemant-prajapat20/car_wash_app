import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { SearchVendors } from '../pages/customer/SearchVendors';
import { VendorProfile } from '../pages/customer/VendorProfile';
import { MyBookings } from '../pages/customer/MyBookings';
import { CustomerProfile } from '../pages/customer/CustomerProfile';
import { BookService } from '../pages/customer/BookService';
import CustomerNotifications from '../pages/customer/CustomerNotifications';
import { MyPlans } from '../pages/customer/MyPlans';

export const CustomerRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Navigate to="/customer/search" replace />} />
        <Route path="search" element={<SearchVendors />} />
        <Route path="vendor/:vendorId" element={<VendorProfile />} />
        <Route path="book" element={<BookService />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="my-plans" element={<MyPlans />} />
        <Route path="notifications" element={<CustomerNotifications />} />
        <Route path="profile" element={<CustomerProfile />} />
        <Route path="*" element={<Navigate to="/customer/search" replace />} />
      </Route>
    </Routes>
  );
};
