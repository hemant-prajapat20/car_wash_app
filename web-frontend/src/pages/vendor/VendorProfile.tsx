import React, { useEffect, useState } from 'react';
import { 
  User, ShieldCheck, MapPin, 
  Settings, Camera, Lock, 
  Mail, Phone, Globe, Edit2,
  ArrowRight, CheckCircle2, Loader2,
  Image as ImageIcon, Trash2, Upload, Calendar, FileText
} from 'lucide-react';
import api from '../../services/axiosConfig';
import toast from 'react-hot-toast';

export const VendorProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [availabilityForm, setAvailabilityForm] = useState({
    isAvailable: true,
    reason: '',
    unavailableUntil: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/vendor/profile');
        if (res.data.success) {
          setProfile(res.data.data);
          setFormData({
            companyName: res.data.data.companyName || '',
            email: res.data.data.email || '',
            phone: res.data.data.phone || '',
            businessLocation: res.data.data.businessLocation || ''
          });
          if (res.data.data.availability) {
            setAvailabilityForm({
              isAvailable: res.data.data.availability.isAvailable,
              reason: res.data.data.availability.reason || '',
              unavailableUntil: res.data.data.availability.unavailableUntil ? new Date(res.data.data.availability.unavailableUntil).toISOString().split('T')[0] : ''
            });
          }
        }
      } catch (err) {
        console.error('Fetch profile failed');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleAvailabilityUpdate = async () => {
    setSaving(true);
    try {
      const res = await api.patch('/vendor/availability', availabilityForm);
      if (res.data.success) {
        setProfile((prev: any) => ({ ...prev, availability: res.data.data }));
        toast.success('Availability settings updated');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update availability');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const formDataObj = new FormData();
    formDataObj.append('image', e.target.files[0]);

    setAvatarUploading(true);
    try {
      const res = await api.post('/vendor/profile-image', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setProfile((prev: any) => ({ ...prev, avatar: res.data.data }));
        toast.success('Profile image updated');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload profile image');
    } finally {
      setAvatarUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await api.put('/vendor/profile', formData);
      if (res.data.success) {
        setProfile(res.data.data);
        setEditMode(false);
        toast.success('Profile details updated');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const formData = new FormData();
    Array.from(e.target.files).forEach(file => {
      formData.append('images', file);
    });

    setUploading(true);
    try {
      const res = await api.post('/vendor/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setProfile((prev: any) => ({ ...prev, gallery: res.data.data }));
        toast.success('Images uploaded successfully');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleImageDelete = async (publicId: string) => {
    setSaving(true);
    try {
      const res = await api.delete('/vendor/gallery', { data: { publicId } });
      if (res.data.success) {
        setProfile((prev: any) => ({ ...prev, gallery: res.data.data }));
        toast.success('Image deleted');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete image');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (field: string, value: any) => {
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
    <div className="space-y-4 animate-in fade-in duration-500 w-full font-inter">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[15px] font-bold text-slate-900 tracking-tight">Business Profile</h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Account & company settings</p>
        </div>
        <div className="flex items-center gap-2">
           {saving && <Loader2 size={14} className="animate-spin text-blue-600" />}
           <button 
             onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
             className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-blue-600 transition-all"
           >
            {editMode ? 'Save Details' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column Wrapper */}
        <div className="md:col-span-1 flex flex-col gap-4">
          {/* Profile Identity Small Box */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-center h-fit">
          <div className="relative mx-auto w-16 h-16 mb-3 group">
            <div className="w-full h-full bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 border-2 border-white shadow-sm overflow-hidden">
              {profile?.avatar ? (
                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                profile?.companyName?.charAt(0) || <Globe size={24} />
              )}
            </div>
            <label className="absolute inset-0 bg-slate-900/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center cursor-pointer">
              {avatarUploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={avatarUploading} />
            </label>
          </div>
          <h3 className="text-[13px] font-bold text-slate-900">{profile?.companyName}</h3>
          <div className="flex items-center justify-center gap-1 mt-1">
            <CheckCircle2 size={10} className="text-emerald-500" />
            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Verified Vendor</span>
          </div>
          </div>

          {/* Vendor Availability Settings */}
          <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-4 h-fit">
            <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-3">
              <div>
                <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={12} className={availabilityForm.isAvailable ? 'text-emerald-500' : 'text-rose-500'} /> 
                  Business Availability
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Temporarily disable new bookings</p>
              </div>
              <button
                type="button"
                onClick={() => setAvailabilityForm(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex items-center ${
                  availabilityForm.isAvailable ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
                    availabilityForm.isAvailable ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {!availabilityForm.isAvailable && (
              <div className="space-y-3 mt-3 bg-rose-50/30 p-3 rounded-lg border border-rose-100/50">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Unavailable Reason</label>
                  <input 
                    type="text" 
                    value={availabilityForm.reason}
                    onChange={(e) => setAvailabilityForm(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="e.g., Holiday break, Shop closed"
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Unavailable Until (Optional)</label>
                  <input 
                    type="date" 
                    value={availabilityForm.unavailableUntil}
                    onChange={(e) => setAvailabilityForm(prev => ({ ...prev, unavailableUntil: e.target.value }))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>
              </div>
            )}
            
            <div className="mt-3 flex justify-end">
              <button 
                onClick={handleAvailabilityUpdate}
                className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                {saving && <Loader2 size={10} className="animate-spin" />} Update Availability
              </button>
            </div>
          </div>
        </div>

        {/* Company Info Box */}
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Business Details</h3>
             <button 
               onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
               className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 flex items-center gap-1"
             >
               {saving ? <Loader2 size={10} className="animate-spin" /> : editMode ? <CheckCircle2 size={10} /> : <Edit2 size={10} />}
               {editMode ? 'Save' : 'Edit'}
             </button>
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
                  {editMode && !item.readOnly ? (
                    <input 
                      type="text" 
                      value={formData[item.field!]} 
                      onChange={(e) => setFormData({...formData, [item.field!]: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded p-1 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-500"
                    />
                  ) : (
                    <p className={`text-[11px] font-bold text-slate-700 truncate ${item.mono ? 'font-mono' : ''}`}>{item.val}</p>
                  )}
                </div>
              ))}
              <div className="col-span-2 p-2 bg-slate-50 rounded-xl group relative">
                  <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">Location</p>
                  {editMode ? (
                    <input 
                      type="text" 
                      value={formData.businessLocation} 
                      onChange={(e) => setFormData({...formData, businessLocation: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded p-1 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-[11px] font-bold text-slate-700 truncate flex items-center gap-1">
                      <MapPin size={10} className="text-rose-500" /> 
                      {profile?.businessLocation}
                    </p>
                  )}
              </div>

              {/* Home Service Toggle Support */}
              <div className="col-span-2 p-3 bg-blue-50/40 border border-blue-100/50 rounded-xl flex items-center justify-between mt-1">
                <div>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Home Service Support</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Offer convenient mobile washing at customer locations</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleUpdate('isHomeServiceAvailable', !profile?.isHomeServiceAvailable)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex items-center ${
                    profile?.isHomeServiceAvailable ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
                      profile?.isHomeServiceAvailable ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

           </div>
        </div>

        {/* Gallery Section */}
        <div className="md:col-span-3 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm mt-4">
          <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
            <div>
              <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon size={14} className="text-blue-500" /> Image Gallery
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Showcase your best car washes and services to attract more customers.</p>
            </div>
            <div>
              <label className="cursor-pointer bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-[10px] font-bold uppercase hover:bg-blue-100 transition-all flex items-center gap-2">
                {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                {uploading ? 'Uploading...' : 'Upload Photos'}
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {profile?.gallery?.length > 0 ? (
              profile.gallery.map((img: any) => (
                <div key={img.publicId} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-100 bg-slate-50 shadow-sm">
                  <img src={img.url} alt="Gallery" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => handleImageDelete(img.publicId)}
                      className="bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition-colors transform hover:scale-110"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <ImageIcon size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-[10px] uppercase font-bold tracking-widest">No images uploaded yet</p>
                <p className="text-xs mt-1">Upload images to build your public portfolio</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
