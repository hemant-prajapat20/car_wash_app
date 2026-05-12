import React from 'react';
import { 
  User, Car, MapPin, Shield, 
  Plus, Edit2, Trash2, Camera,
  Mail, Phone, Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

const SAVED_VEHICLES = [
  { id: 'v1', brand: 'Tesla', model: 'Model 3', plate: 'ABC-1234', color: 'Midnight Silver' },
  { id: 'v2', brand: 'BMW', model: 'X5', plate: 'XYZ-7890', color: 'Alpine White' },
];

const SAVED_ADDRESSES = [
  { id: 'a1', label: 'Home', address: '123 Main St, Downtown, New York' },
  { id: 'a2', label: 'Office', address: '456 Tech Park, Suite 200, Brookly' },
];

export const CustomerProfile: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5 uppercase tracking-wider">Manage your profile, vehicles and addresses</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-100 active:scale-95">
          <Trash2 size={14} />
          Delete Account
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-100 rounded-[1.5rem] p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="relative group mb-4">
                <div className="w-20 h-20 bg-slate-100 rounded-[1.25rem] flex items-center justify-center text-slate-400 overflow-hidden border-2 border-white shadow-md">
                  <User size={40} />
                </div>
                <button className="absolute -bottom-1 -right-1 p-1.5 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all active:scale-90">
                  <Camera size={12} />
                </button>
              </div>
              <h3 className="text-md font-semibold text-slate-900">Johnathan Doe</h3>
              <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mt-1">Premium Member</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Mail size={14} className="text-slate-400" />
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                  <p className="text-[12px] font-medium text-slate-700 truncate">john.doe@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Phone size={14} className="text-slate-400" />
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</p>
                  <p className="text-[12px] font-medium text-slate-700">+1 (555) 000-0000</p>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl text-[11px] font-semibold hover:bg-slate-800 transition-all">
                <Edit2 size={14} />
                Edit Profile
              </button>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-[1.5rem] p-5">
            <div className="flex items-center gap-3 mb-2">
              <Shield size={18} className="text-emerald-600" />
              <h4 className="text-[13px] font-bold text-emerald-900">Security Check</h4>
            </div>
            <p className="text-[11px] text-emerald-700 leading-relaxed font-medium">
              Your account is protected by 256-bit encryption. Enable 2FA for extra safety.
            </p>
            <button className="mt-3 text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
              Configure Security <Edit2 size={10} />
            </button>
          </div>
        </div>

        {/* Vehicles & Addresses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Saved Vehicles */}
          <div className="bg-white border border-slate-100 rounded-[1.5rem] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <Car size={18} />
                </div>
                <h3 className="text-[14px] font-semibold text-slate-900">My Vehicles</h3>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
                <Plus size={14} />
                Add Vehicle
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SAVED_VEHICLES.map((vehicle) => (
                <div key={vehicle.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-blue-200 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="bg-white p-2 rounded-lg text-slate-400 group-hover:text-blue-600 transition-colors">
                      <Car size={20} />
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1.5 text-slate-300 hover:text-blue-600 hover:bg-white rounded-md transition-all"><Edit2 size={14} /></button>
                      <button className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-white rounded-md transition-all"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <h4 className="text-[13px] font-semibold text-slate-900">{vehicle.brand} {vehicle.model}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">{vehicle.color}</span>
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-700 font-mono">
                      {vehicle.plate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="bg-white border border-slate-100 rounded-[1.5rem] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                  <MapPin size={18} />
                </div>
                <h3 className="text-[14px] font-semibold text-slate-900">Saved Addresses</h3>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all">
                <Plus size={14} />
                Add New
              </button>
            </div>

            <div className="space-y-3">
              {SAVED_ADDRESSES.map((addr) => (
                <div key={addr.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-white hover:border-blue-100 transition-all">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-amber-600 transition-colors">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-slate-900">{addr.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{addr.address}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 text-slate-300 hover:text-blue-600 transition-all"><Edit2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
