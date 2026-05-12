import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';

// Modular Admin Page Shells
const AdminDashboard = () => (
  <div className="animate-in fade-in duration-500 space-y-6">
    <div className="flex flex-col gap-1">
      <h1 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">Platform Overview</h1>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Global Statistics & Performance</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-28 animate-pulse" />
      ))}
    </div>
  </div>
);

const RegisterVendor = () => (
  <div className="animate-in fade-in duration-500">
    <h1 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">Register New Vendor</h1>
    <div className="mt-6 bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-2xl border-dashed border-2 flex items-center justify-center text-slate-400 h-96">
      Registration Form UI Coming Soon
    </div>
  </div>
);

const VendorsProfile = () => (
  <div className="animate-in fade-in duration-500">
    <h1 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">Vendor Management</h1>
    <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm h-[500px] flex items-center justify-center text-slate-400 border-dashed border-2">
      Vendor Directory Table Coming Soon
    </div>
  </div>
);

export const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="register-vendor" element={<RegisterVendor />} />
        <Route path="vendors" element={<VendorsProfile />} />
        <Route path="notifications" element={<div className="p-10">Notifications Content</div>} />
        <Route path="profile" element={<div className="p-10">Profile Content</div>} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
};
