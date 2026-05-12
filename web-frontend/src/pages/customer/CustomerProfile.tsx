import React, { useEffect, useState } from 'react';
import { 
  User, Mail, Phone, MapPin, 
  Car, Plus, ShieldCheck, Camera,
  Loader2, Trash2, Edit2
} from 'lucide-react';
import api from '../../services/axiosConfig';

export const CustomerProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/customer/search'); // Placeholder for get profile
        setProfile({
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '+1 234 567 890',
          vehicles: [
            { make: 'Tesla', model: 'Model 3', plate: 'ABC-123' },
            { make: 'BMW', model: 'X5', plate: 'XYZ-789' }
          ],
          addresses: [
            { label: 'Home', val: '123 Main St, LA' }
          ]
        });
      } catch (err) {
        console.error('Fetch profile failed');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl font-inter">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[16px] font-bold text-slate-900 tracking-tight">Your Profile</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage your account and vehicles</p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[11px] font-bold uppercase hover:bg-blue-600 transition-all shadow-lg">Save Changes</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
           <div className="bg-white border border-slate-100 rounded-[2rem] p-6 text-center shadow-sm">
             <div className="relative mx-auto w-20 h-20 mb-4">
               <div className="w-full h-full bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-300 border-2 border-white shadow-sm">
                 <User size={32} />
               </div>
               <button className="absolute -bottom-1 -right-1 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all">
                 <Camera size={14} />
               </button>
             </div>
             <h3 className="text-[15px] font-bold text-slate-900">{profile.fullName}</h3>
             <p className="text-[11px] font-medium text-slate-400">{profile.email}</p>
           </div>
        </div>

        <div className="md:col-span-2 space-y-4">
           <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
             <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-4">Saved Vehicles</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.vehicles.map((v: any, i: number) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                        <Car size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-bold text-slate-900 truncate">{v.make} {v.model}</p>
                        <p className="text-[10px] font-bold text-blue-600 tracking-tight uppercase">{v.plate}</p>
                      </div>
                    </div>
                    <button className="text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={14}/></button>
                  </div>
                ))}
                <button className="p-4 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:border-blue-200 hover:text-blue-600 transition-all">
                  <Plus size={16} />
                  <span className="text-[11px] font-bold uppercase tracking-widest">Add New</span>
                </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
