import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Star, Clock, Info, Loader2, ChevronRight, CheckCircle2, ShieldCheck, ArrowLeft,
  Mail, Phone
} from 'lucide-react';
import api from '../../services/axiosConfig';

export const VendorProfile: React.FC = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await api.get(`/customer/vendors/${vendorId}`);
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch vendor details:', err);
      } finally {
        setLoading(false);
      }
    };
    if (vendorId) fetchVendorDetails();
  }, [vendorId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (!data?.vendor) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-900">Vendor Not Found</h2>
        <button onClick={() => navigate('/customer/search')} className="text-blue-600 font-bold mt-4">Back to Search</button>
      </div>
    );
  }

  const { vendor, services, slots, reviews } = data;
  const startingPrice = services.length > 0 ? Math.min(...services.map((s: any) => s.price)) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 font-inter pb-20">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
      >
        <ArrowLeft size={14} /> Back
      </button>

      {/* Hero Header */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-50 rounded-3xl border-4 border-white shadow-lg overflow-hidden shrink-0">
          {vendor.avatar ? (
            <img src={vendor.avatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 text-3xl font-bold">
              {vendor.companyName?.charAt(0) || 'V'}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{vendor.companyName}</h1>
            <ShieldCheck className="text-emerald-500" size={20} />
          </div>
          <p className="text-sm font-medium text-slate-500 mb-4">{vendor.fullName}</p>
          
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <MapPin size={14} className="text-slate-400" /> {vendor.businessLocation}
            </span>
            <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-xl border border-amber-100">
              <Star size={14} className="fill-amber-400 text-amber-400" /> 4.8 Rating
            </span>
            <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl border border-blue-100">
              <Clock size={14} className="text-blue-500" /> {slots.length} Slots Available
            </span>
          </div>
        </div>

        <div className="w-full sm:w-auto mt-4 sm:mt-0 flex flex-col gap-3">
          <button 
            onClick={() => navigate(`/customer/book?vendor=${vendor._id}`)}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Book Appointment</span>
            <ChevronRight size={16} />
          </button>
          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Services from ${startingPrice}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Services & Packages */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              Service Packages <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs">{services.length}</span>
            </h2>
            
            {services.length === 0 ? (
              <p className="text-slate-400 italic text-sm">No services configured by this vendor.</p>
            ) : (
              <div className="space-y-4">
                {services.map((service: any) => (
                  <div key={service._id} className="p-5 border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{service.name}</h3>
                        <p className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block mt-1">{service.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-600">${service.price}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-end gap-1 mt-1">
                          <Clock size={10} /> {service.duration} Mins
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">{service.description}</p>
                    
                    {service.features && service.features.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-50">
                        {service.features.map((f: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                            <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Info & Reviews */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-slate-400" />
                </div>
                <span className="truncate">{vendor.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                  <Phone size={14} className="text-slate-400" />
                </div>
                <span>{vendor.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                  <Info size={14} className="text-slate-400" />
                </div>
                <span>Active Operating Status</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest flex items-center justify-between">
              Recent Reviews
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md">{reviews.length}</span>
            </h3>
            
            {reviews.length === 0 ? (
              <p className="text-slate-400 italic text-xs text-center py-4">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r: any) => (
                  <div key={r._id} className="pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{r.customer?.fullName || 'Customer'}</span>
                      <div className="flex items-center gap-0.5">
                        <Star size={10} className="fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-bold text-slate-600">{r.rating}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
