import React from 'react';
import { 
  User, ShieldCheck, MapPin, 
  Settings, Camera, Lock, 
  Mail, Phone, Globe, Edit2,
  ArrowRight
} from 'lucide-react';

export const VendorProfile: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div>
        <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Business Profile</h1>
        <p className="text-[11px] font-medium text-slate-500 mt-0.5 uppercase tracking-wider">Manage company and account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Identity Card */}
          <div className="bg-white border border-slate-100 rounded-[1.5rem] p-6 shadow-sm text-center">
            <div className="relative group mx-auto w-24 h-24 mb-4">
              <div className="w-full h-full bg-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-400 overflow-hidden border-2 border-white shadow-md">
                <Globe size={40} />
              </div>
              <button className="absolute -bottom-1 -right-1 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all">
                <Camera size={14} />
              </button>
            </div>
            <h3 className="text-md font-semibold text-slate-900">Elite Auto Spa</h3>
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Verified Vendor</p>
            
            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-around">
               <div className="text-center">
                 <p className="text-[14px] font-bold text-slate-900">4.8</p>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Rating</p>
               </div>
               <div className="w-px h-8 bg-slate-100" />
               <div className="text-center">
                 <p className="text-[14px] font-bold text-slate-900">1.2k</p>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Orders</p>
               </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-[1.5rem] p-5 shadow-xl shadow-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck size={18} className="text-emerald-400" />
              <h4 className="text-[13px] font-bold">Platform Status</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Your account is in good standing. All premium features are unlocked.</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-[1.5rem] p-6 shadow-sm">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-[14px] font-semibold text-slate-900">Company Information</h3>
               <button className="text-[11px] font-bold text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                 <Edit2 size={12} /> Edit Details
               </button>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Company Name</p>
                  <p className="text-[12.5px] font-semibold text-slate-700">Elite Auto Spa Services Ltd.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Business ID</p>
                  <p className="text-[12.5px] font-semibold text-slate-700 font-mono">AW-VND-2024-882</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                  <p className="text-[12.5px] font-semibold text-slate-700">contact@eliteautospa.com</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                  <p className="text-[12.5px] font-semibold text-slate-700">+1 (555) 123-4567</p>
                </div>
                <div className="sm:col-span-2 p-3 bg-slate-50 rounded-xl">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Service Location</p>
                  <p className="text-[12.5px] font-semibold text-slate-700 flex items-center gap-1">
                    <MapPin size={14} className="text-rose-500" />
                    123 Automotive Plaza, Suite 400, Los Angeles, CA
                  </p>
                </div>
             </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[1.5rem] p-6 shadow-sm">
             <h3 className="text-[14px] font-semibold text-slate-900 mb-6">Security Settings</h3>
             <div className="space-y-3">
               <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group">
                 <div className="flex items-center gap-3">
                   <Lock size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                   <span className="text-[12.5px] font-semibold text-slate-700">Update Access Password</span>
                 </div>
                 <ArrowRight size={14} className="text-slate-300" />
               </button>
               <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group">
                 <div className="flex items-center gap-3">
                   <ShieldCheck size={16} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
                   <span className="text-[12.5px] font-semibold text-slate-700">Two-Factor Authentication</span>
                 </div>
                 <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase rounded">Enabled</div>
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
