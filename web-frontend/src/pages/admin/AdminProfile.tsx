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

      {/* Strict Grid Layout for Systematic Row/Column Adjustment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* Row 1: Avatar & Status */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 lg:p-8 text-center h-full flex flex-col">
          <div className="relative inline-block mb-4 mx-auto">
            <div className="w-20 h-20 bg-slate-900 rounded-[24px] flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-slate-200">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-lg border-4 border-white flex items-center justify-center text-white shadow-lg">
              <ShieldCheck size={12} />
            </div>
          </div>
          <h3 className="text-base font-bold text-slate-900">{user?.fullName}</h3>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">SuperAdmin Access</p>
          
          <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
              <span className="text-[11px] font-bold text-emerald-500">Active</span>
            </div>
            <div className="w-[1px] h-6 bg-slate-100" />
            <div className="text-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Protocol</p>
              <span className="text-[11px] font-bold text-slate-900">L3 Root</span>
            </div>
          </div>
        </div>

        {/* Row 1: Identity Management */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 lg:p-8 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-slate-50 rounded-lg">
                <User size={16} className="text-slate-900" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">Identity Management</h4>
            </div>
            <button className="text-[10px] font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all">Edit Identity</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <User size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input type="text" readOnly value={user?.fullName} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-50 rounded-xl text-[11px] font-bold text-slate-600 outline-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">System Email</label>
              <div className="relative">
                <Mail size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input type="text" readOnly value={user?.email} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-50 rounded-xl text-[11px] font-bold text-slate-600 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Access Secret */}
        <div className="bg-slate-900 rounded-[2.5rem] p-6 lg:p-8 text-white relative overflow-hidden h-full flex flex-col">
          <div className="relative z-10 flex flex-col flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <Key size={16} className="text-blue-400" />
              </div>
              <h4 className="text-sm font-bold tracking-tight">Access Secret</h4>
            </div>
            <p className="text-[11px] font-medium text-slate-400 leading-relaxed mb-6 flex-1">
              Platform access is restricted via your private environment secret. Keep this secure.
            </p>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl mt-auto">
              <code className="text-xs font-mono text-blue-300">ADMIN_SECRET_KEY</code>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl -mr-12 -mt-12" />
        </div>

        {/* Row 2: Security Credentials */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 lg:p-8 h-full flex flex-col">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-1.5 bg-slate-50 rounded-lg">
              <Lock size={16} className="text-slate-900" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">Security Credentials</h4>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-5 flex flex-col flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-50 rounded-xl text-[11px] font-bold text-slate-900 focus:border-blue-500 focus:bg-white transition-all outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Update</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-50 rounded-xl text-[11px] font-bold text-slate-900 focus:border-blue-500 focus:bg-white transition-all outline-none" />
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
              <div className="flex items-center gap-2">
                <Smartphone size={14} className="text-slate-400" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Last changed: 3 days ago</span>
              </div>
              <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-[11px] shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">
                <Save size={12} />
                Update Credentials
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AdminProfile;
