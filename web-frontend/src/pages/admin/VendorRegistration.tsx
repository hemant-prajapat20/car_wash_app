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
  CheckCircle2,
  Lock,
  ArrowRight,
  Plus
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
      <div className="h-[70vh] flex flex-col items-center justify-center text-center max-w-lg mx-auto p-6 animate-in zoom-in duration-500">
        <div className="relative mb-10">
          <div className="w-24 h-24 bg-emerald-50 rounded-[32px] flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-100">
            <CheckCircle2 size={48} className="animate-in fade-in slide-in-from-bottom-4 duration-700" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-4 border-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shadow-lg">
            <Plus size={16} strokeWidth={3} />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Onboarding Complete!</h3>
        <p className="text-base font-medium text-slate-500 leading-relaxed mb-10 max-w-sm">
          The vendor account has been successfully initialized. They can now access their dedicated panel using the credentials you provided.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full px-4">
          <button 
            onClick={() => setSuccess(false)}
            className="w-full py-4 bg-slate-900 text-white rounded-[24px] font-bold text-sm shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Register Another Vendor
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Onboard New Vendor</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Configure security and identity for a new Car Wash partner.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl text-slate-400 text-[10px] font-bold uppercase tracking-widest border border-slate-100">
          <ShieldCheck size={14} />
          Secure Onboarding Protocol
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden" autoComplete="off">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Identity Section */}
          <div className="p-6 lg:p-8 space-y-8 border-b lg:border-b-0 lg:border-r border-slate-50">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">Administrative Identity</h4>
              <p className="text-[10px] font-medium text-slate-400 leading-relaxed">Core credentials for the primary account holder.</p>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Identity Name</label>
                <div className="relative group">
                  <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    autoComplete="off"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-50 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">System Access Email</label>
                <div className="relative group">
                  <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    autoComplete="off"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="vendor@chakachak.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-50 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Direct Phone</label>
                  <div className="relative group">
                    <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="tel"
                      maxLength={10}
                      autoComplete="off"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                      placeholder="9876543210"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-50 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Initial Password</label>
                  <div className="relative group">
                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-50 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Section */}
          <div className="p-6 lg:p-8 space-y-8 bg-slate-50/30">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900">Business Configuration</h4>
              <p className="text-[10px] font-medium text-slate-400 leading-relaxed">Establish the physical presence of the Car Wash partner.</p>
            </div>

            <div className="space-y-5">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Commercial Name</label>
                <div className="relative group">
                  <Building2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    autoComplete="off"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    placeholder="e.g. Crystal Clean Detailers"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-500 transition-all placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Physical Location</label>
                <div className="relative group">
                  <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    autoComplete="off"
                    value={formData.businessLocation}
                    onChange={(e) => setFormData({...formData, businessLocation: e.target.value})}
                    placeholder="Building, Street Name, Floor"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-500 transition-all placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Service Area</label>
                <div className="relative group">
                  <Navigation size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    autoComplete="off"
                    value={formData.serviceArea}
                    onChange={(e) => setFormData({...formData, serviceArea: e.target.value})}
                    placeholder="e.g. South Bengaluru Cluster"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-500 transition-all placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="pt-1">
                <button type="button" className="w-full flex items-center justify-center gap-2 p-3 bg-white border border-dashed border-slate-200 rounded-xl text-slate-300 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all text-[10px] font-bold uppercase tracking-widest">
                  <ImageIcon size={16} />
                  Upload Logo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 lg:px-8 py-6 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white tracking-tight uppercase mb-0.5">Isolated Onboarding</p>
              <p className="text-[9px] font-medium text-slate-400 leading-tight max-w-[240px]">
                A unique vendorId will be assigned for strict data management.
              </p>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto min-w-[200px] py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-xl font-bold text-[11px] shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 transition-all active:scale-95 group"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <span>Complete Onboarding</span>
                <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
