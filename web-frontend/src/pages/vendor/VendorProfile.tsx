import React, { useEffect, useState } from 'react';
import { 
  User, ShieldCheck, MapPin, 
  Settings, Camera, Lock, 
  Mail, Phone, Globe, Edit2,
  ArrowRight, CheckCircle2, Loader2
} from 'lucide-react';
import api from '../../services/axiosConfig';

export const VendorProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/vendor/profile');
        if (res.data.success) setProfile(res.data.data);
      } catch (err) {
        console.error('Fetch profile failed');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (field: string, value: string) => {
    setSaving(true);
    try {
      const updated = { ...profile, [field]: value };
      const res = await api.put('/vendor/profile', updated);
      if (res.data.success) setProfile(res.data.data);
    } catch (err) {
      alert('Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-4xl font-inter">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[15px] font-bold text-slate-900 tracking-tight">Business Profile</h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Account & company settings</p>
        </div>
        <div className="flex items-center gap-2">
           {saving && <Loader2 size={14} className="animate-spin text-blue-600" />}
           <button className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-blue-600 transition-all">
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Identity Small Box */}
        <div className="md:col-span-1 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-center">
          <div className="relative mx-auto w-16 h-16 mb-3">
            <div className="w-full h-full bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 border-2 border-white shadow-sm overflow-hidden">
              {profile?.companyName?.charAt(0) || <Globe size={24} />}
            </div>
          </div>
          <h3 className="text-[13px] font-bold text-slate-900">{profile?.companyName}</h3>
          <div className="flex items-center justify-center gap-1 mt-1">
            <CheckCircle2 size={10} className="text-emerald-500" />
            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Verified Vendor</span>
          </div>
        </div>

        {/* Company Info Box */}
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Business Details</h3>
           </div>
           
           <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'Company', val: profile?.companyName, field: 'companyName' },
                { label: 'Business ID', val: profile?.vendorId, mono: true, readOnly: true },
                { label: 'Email', val: profile?.email, field: 'email' },
                { label: 'Phone', val: profile?.phone, field: 'phone' },
              ].map((item, i) => (
                <div key={i} className="p-2 bg-slate-50 rounded-xl min-w-0 group relative">
                  <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">{item.label}</p>
                  <p className={`text-[11px] font-bold text-slate-700 truncate ${item.mono ? 'font-mono' : ''}`}>{item.val}</p>
                  {!item.readOnly && (
                    <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit2 size={10} className="text-blue-600" />
                    </button>
                  )}
                </div>
              ))}
              <div className="col-span-2 p-2 bg-slate-50 rounded-xl group relative">
                  <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">Location</p>
                  <p className="text-[11px] font-bold text-slate-700 truncate flex items-center gap-1">
                    <MapPin size={10} className="text-rose-500" /> 
                    {profile?.businessLocation}
                  </p>
                  <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit2 size={10} className="text-blue-600" />
                  </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
