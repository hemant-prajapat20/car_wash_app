import React, { useState } from 'react';
import { 
  User, 
  Key, 
  Lock, 
  Mail, 
  Save, 
  ShieldCheck,
  Smartphone,
  Shield,
  CreditCard
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import toast from 'react-hot-toast';

const AdminProfile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Security credentials updated successfully.");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Profile</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Global system configuration and identity management.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600 text-[10px] font-bold uppercase tracking-widest">
          <ShieldCheck size={14} />
          Verified SuperAdmin
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & System Secret */}
        <div className="space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 text-center">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-slate-900 rounded-[32px] flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-slate-200">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-xl border-4 border-white flex items-center justify-center text-white">
                <Shield size={14} />
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{user?.fullName}</h3>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{user?.role}</p>
            
            <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <span className="text-xs font-bold text-emerald-500">Active</span>
              </div>
              <div className="w-[1px] h-8 bg-slate-100" />
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Level</p>
                <span className="text-xs font-bold text-slate-900">Root Access</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Key size={18} className="text-blue-400" />
                </div>
                <h4 className="text-sm font-bold tracking-tight">System Secret Info</h4>
              </div>
              <p className="text-[11px] font-medium text-slate-400 leading-relaxed mb-6">
                Direct access is protected by your private environment variable.
              </p>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <code className="text-xs font-mono text-blue-300">ADMIN_SECRET_KEY</code>
                <div className="mt-2 h-1 w-full bg-blue-500/20 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-blue-500 animate-pulse" />
                </div>
              </div>
            </div>
            {/* Background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl -mr-16 -mt-16" />
          </div>
        </div>

        {/* Right Column: Account Details & Security */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Info Card */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 lg:p-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <User size={18} className="text-slate-900" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Administrative Identity</h4>
              </div>
              <button className="text-[11px] font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all">Edit Details</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input type="text" readOnly value={user?.fullName} className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 outline-none cursor-default" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email System</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input type="text" readOnly value={user?.email} className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 outline-none cursor-default" />
                </div>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-slate-50 rounded-xl">
                <Lock size={18} className="text-slate-900" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Security Credentials</h4>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Update Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 focus:border-blue-500 focus:bg-white transition-all outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Update</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-900 focus:border-blue-500 focus:bg-white transition-all outline-none" />
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Smartphone size={16} className="text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last changed: 3 days ago</span>
                </div>
                <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-xs shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">
                  <Save size={14} />
                  Update Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
