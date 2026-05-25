import React, { useEffect, useState, useRef } from 'react';
import { 
  User, Mail, Phone, MapPin, 
  Car, Plus, ShieldCheck, Camera,
  Loader2, Trash2, Edit2, X
} from 'lucide-react';
import api from '../../services/axiosConfig';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export const CustomerProfile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ make: '', model: '', plateNumber: '' });
  
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', address: '', city: '' });
  
  const [actionLoading, setActionLoading] = useState(false);

  // Profile image state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar || null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const [vehRes, addrRes] = await Promise.all([
        api.get('/customer/vehicles'),
        api.get('/customer/addresses')
      ]);
      if (vehRes.data.success) setVehicles(vehRes.data.data);
      if (addrRes.data.success) setAddresses(addrRes.data.data);
    } catch (err) {
      console.error('Fetch data failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle profile image upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append('image', file);

    setAvatarUploading(true);
    try {
      const res = await api.post('/customer/profile-image', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setAvatarUrl(res.data.data);
        // Update user in localStorage so avatar persists across page refreshes
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            parsed.avatar = res.data.data;
            localStorage.setItem('user', JSON.stringify(parsed));
          } catch {}
        }
        toast.success('Profile image updated!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setAvatarUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await api.post('/customer/vehicles', newVehicle);
      if (res.data.success) {
        setVehicles(res.data.data);
        setShowAddVehicle(false);
        setNewVehicle({ make: '', model: '', plateNumber: '' });
        toast.success("Vehicle added!");
      }
    } catch (err) {
      toast.error("Failed to add vehicle");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this vehicle?")) return;
    try {
      const res = await api.delete(`/customer/vehicles/${id}`);
      if (res.data.success) {
        setVehicles(res.data.data);
        toast.success("Vehicle removed");
      }
    } catch (err) {
      toast.error("Failed to remove vehicle");
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await api.post('/customer/addresses', newAddress);
      if (res.data.success) {
        setAddresses(res.data.data);
        setShowAddAddress(false);
        setNewAddress({ label: '', address: '', city: '' });
        toast.success("Address added!");
      }
    } catch (err) {
      toast.error("Failed to add address");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this address?")) return;
    try {
      const res = await api.delete(`/customer/addresses/${id}`);
      if (res.data.success) {
        setAddresses(res.data.data);
        toast.success("Address removed");
      }
    } catch (err) {
      toast.error("Failed to remove address");
    }
  };

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl font-inter">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Your Profile</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage your account and vehicles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        
        {/* Profile Card */}
        <div className="md:col-span-1 bg-white border border-slate-100 rounded-[2.5rem] p-8 text-center shadow-sm h-full flex flex-col">
          <div className="relative mx-auto w-24 h-24 mb-4 group">
            <div className="w-full h-full bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 border-4 border-white shadow-inner overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <User size={40} />
              )}
            </div>
            {/* Upload overlay on hover */}
            <label className="absolute inset-0 bg-slate-900/40 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer gap-1">
              {avatarUploading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Camera size={18} />
                  <span className="text-[8px] font-bold uppercase tracking-widest">
                    {avatarUrl ? 'Change' : 'Upload'}
                  </span>
                </>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarUpload} 
                disabled={avatarUploading} 
              />
            </label>
            {/* Camera badge button */}
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="absolute -bottom-1 -right-1 p-2.5 bg-blue-600 text-white rounded-2xl shadow-xl hover:bg-blue-700 transition-all border-4 border-white active:scale-90 disabled:opacity-50"
            >
              {avatarUploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
            </button>
          </div>
          <h3 className="text-[16px] font-black text-slate-900">{user?.fullName}</h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1 mb-6">Customer Account</p>
          
          <div className="mt-auto pt-6 border-t border-slate-50 space-y-3">
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400"><Mail size={14}/></div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Email</p>
                <p className="text-[12px] font-bold text-slate-900 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400"><Phone size={14}/></div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Phone</p>
                <p className="text-[12px] font-bold text-slate-900">{user?.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Garage */}
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest">My Garage</h3>
            <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">{vehicles.length} Vehicles</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {vehicles.map((v: any) => (
              <div key={v._id} className="p-5 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-between gap-3 group hover:border-blue-200 hover:bg-white transition-all shadow-sm hover:shadow-xl hover:shadow-blue-500/5 duration-300">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-11 h-11 shrink-0 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
                    <Car size={20} />
                  </div>
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-[14px] font-black text-slate-900 leading-tight">{v.make} {v.model}</p>
                    <p className="text-[10px] font-black text-blue-600 tracking-wider uppercase mt-1 px-1.5 py-0.5 bg-blue-50 rounded inline-block truncate">{v.plateNumber}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteVehicle(v._id)}
                  className="w-8 h-8 shrink-0 flex items-center justify-center text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <Trash2 size={16}/>
                </button>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => setShowAddVehicle(true)}
            className="mt-4 w-full p-4 border-2 border-dashed border-slate-100 rounded-3xl flex items-center justify-center gap-2 text-slate-400 hover:border-blue-200 hover:bg-blue-50/30 hover:text-blue-600 transition-all duration-300 group"
          >
            <div className="w-8 h-8 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center group-hover:border-blue-300 transition-colors">
              <Plus size={16} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest">Add New Vehicle</span>
          </button>
        </div>

        {/* Addresses Section */}
        <div className="md:col-span-3 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Saved Addresses</h3>
            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">{addresses.length} Addresses</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
            {addresses.map((a: any) => (
              <div key={a._id} className="p-5 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-between gap-3 group hover:border-emerald-200 hover:bg-white transition-all shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 duration-300">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-11 h-11 shrink-0 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-300">
                    <MapPin size={20} />
                  </div>
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-[14px] font-black text-slate-900 leading-tight">{a.label}</p>
                    <p className="text-[10px] font-black text-slate-500 tracking-wider uppercase mt-1 leading-relaxed">{a.address}, {a.city}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteAddress(a._id)}
                  className="w-8 h-8 shrink-0 flex items-center justify-center text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <Trash2 size={16}/>
                </button>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => setShowAddAddress(true)}
            className="mt-4 w-full p-4 border-2 border-dashed border-slate-100 rounded-3xl flex items-center justify-center gap-2 text-slate-400 hover:border-emerald-200 hover:bg-emerald-50/30 hover:text-emerald-600 transition-all duration-300 group"
          >
            <div className="w-8 h-8 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center group-hover:border-emerald-300 transition-colors">
              <Plus size={16} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest">Add New Address</span>
          </button>
        </div>

      </div>

      {/* Add Vehicle Modal */}
      {showAddVehicle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl border border-slate-100 relative">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-black text-slate-900">Add New Vehicle</h3>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Join the Chakachak Garage</p>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Make</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Tesla" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all outline-none font-semibold text-slate-700"
                    value={newVehicle.make}
                    onChange={e => setNewVehicle({...newVehicle, make: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Model</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Model 3" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all outline-none font-semibold text-slate-700"
                    value={newVehicle.model}
                    onChange={e => setNewVehicle({...newVehicle, model: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Plate Number</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. XYZ-1234" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold tracking-wider focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all outline-none font-semibold text-slate-700"
                  value={newVehicle.plateNumber}
                  onChange={e => setNewVehicle({...newVehicle, plateNumber: e.target.value.toUpperCase()})}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddVehicle(false)} className="flex-1 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Cancel</button>
                <button type="submit" disabled={actionLoading} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50">
                  {actionLoading ? "Adding..." : "Save Vehicle"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Address Modal */}
      {showAddAddress && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl border border-slate-100 relative">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-black text-slate-900">Add New Address</h3>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Save location for Home Service</p>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Label</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. Home, Office" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all outline-none font-semibold text-slate-700"
                  value={newAddress.label}
                  onChange={e => setNewAddress({...newAddress, label: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Address</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. Flat 101, Green Meadows" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all outline-none font-semibold text-slate-700"
                  value={newAddress.address}
                  onChange={e => setNewAddress({...newAddress, address: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. Pune" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all outline-none font-semibold text-slate-700"
                  value={newAddress.city}
                  onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddAddress(false)} className="flex-1 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Cancel</button>
                <button type="submit" disabled={actionLoading} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50">
                  {actionLoading ? "Adding..." : "Save Address"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
