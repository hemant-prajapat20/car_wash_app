import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Navigation, 
  User, 
  ShieldCheck, 
  Loader2, 
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { PasswordInput } from '../../components/auth/PasswordInput';
import axiosInstance from '../../services/axiosConfig';
import toast from 'react-hot-toast';

export const VendorRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    companyName: '',
    businessLocation: '',
    serviceArea: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axiosInstance.post('/admin/register-vendor', formData);
      if (response.data.success) {
        toast.success("Vendor Registered Successfully!");
        setSuccess(true);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          password: '',
          companyName: '',
          businessLocation: '',
          serviceArea: '',
        });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to register vendor");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Registration Successful</h3>
        <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">
          The vendor account has been created with a unique ID. They can now log in to their dashboard using the provided credentials.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 transition-transform active:scale-95"
        >
          Register Another Vendor
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Onboard New Vendor</h2>
        <p className="text-sm font-medium text-slate-500 mt-1">Create a secure, isolated profile for a new car wash partner.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 lg:p-12 rounded-[40px] border border-slate-100 shadow-sm">
        {/* Personal Details */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <User size={16} className="text-blue-600" />
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personal Details</h4>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Vendor Full Name</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <User size={16} />
              </div>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Mail size={16} />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="vendor@company.com"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Phone size={16} />
              </div>
              <input
                type="tel"
                maxLength={10}
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                placeholder="10-digit number"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <PasswordInput 
            label="System Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>

        {/* Business Details */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Building2 size={16} className="text-blue-600" />
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business Details</h4>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Building2 size={16} />
              </div>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                placeholder="Aqua Shine Services"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Business Location</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <MapPin size={16} />
              </div>
              <input
                type="text"
                value={formData.businessLocation}
                onChange={(e) => setFormData({...formData, businessLocation: e.target.value})}
                placeholder="Street Address, Area"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Service Area / City</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <Navigation size={16} />
              </div>
              <input
                type="text"
                value={formData.serviceArea}
                onChange={(e) => setFormData({...formData, serviceArea: e.target.value})}
                placeholder="Bengaluru Central, Indiranagar"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button className="w-full flex items-center justify-center gap-2 p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all text-[11px] font-bold">
              <ImageIcon size={18} />
              Upload Company Logo
            </button>
          </div>
        </div>

        {/* Footer Action */}
        <div className="md:col-span-2 pt-6 border-t border-slate-50 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <ShieldCheck size={20} />
            </div>
            <p className="text-[10px] font-medium text-slate-500 leading-tight max-w-[240px]">
              By creating this account, the vendor will be assigned a unique ID for isolated data management.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 md:flex-none px-12 py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <span>Complete Onboarding</span>
                <CheckCircle2 size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
