import React, { useEffect, useState } from 'react';
import { 
  Search, MapPin, Star,
  ChevronRight, Car, ShieldCheck, Waves,
  Loader2, Clock, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axiosConfig';

export const SearchVendors: React.FC = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await api.get('/customer/search');
        if (response.data.success) {
          setVendors(response.data.data);
        }
      } catch (err) {
        console.error('Error searching vendors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter(v => {
    const q = searchQuery.toLowerCase();
    return (
      v.companyName?.toLowerCase().includes(q) ||
      v.businessLocation?.toLowerCase().includes(q) ||
      v.fullName?.toLowerCase().includes(q) ||
      v.phone?.includes(q) ||
      v.startingPrice?.toString().includes(q) ||
      (v.activeServices && v.activeServices.some((s: string) => s.toLowerCase().includes(q)))
    );
  });

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto font-inter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Explore Verified Centers</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Discover top-rated car wash vendors in your area</p>
        </div>
        
        <div className="relative group z-50">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search by name or location..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all w-full sm:w-80 shadow-sm relative z-10"
          />
          
          <AnimatePresence>
            {showSuggestions && searchQuery.trim().length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute top-[110%] left-0 right-0 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden z-50"
              >
                {filteredVendors.length > 0 ? (
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                    {filteredVendors.slice(0, 5).map((v) => (
                      <div 
                        key={v._id}
                        onClick={() => navigate(`/customer/vendor/${v._id}`)}
                        className="px-4 py-3 border-b border-slate-50 last:border-none hover:bg-blue-50/50 cursor-pointer transition-colors group/item flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden">
                          {v.avatar ? <img src={v.avatar} className="w-full h-full object-cover" /> : <Waves size={14} className="text-blue-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-slate-900 truncate group-hover/item:text-blue-600 transition-colors">{v.companyName}</p>
                          <p className="text-[10px] font-medium text-slate-500 flex items-center gap-1 truncate"><MapPin size={10} /> {v.businessLocation}</p>
                        </div>
                        <ChevronRight size={14} className="text-slate-300 group-hover/item:text-blue-600 shrink-0" />
                      </div>
                    ))}
                    {filteredVendors.length > 5 && (
                      <div className="px-4 py-2 bg-slate-50 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">+ {filteredVendors.length - 5} more results available</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm font-bold text-slate-900 mb-1">No vendors found</p>
                    <p className="text-[11px] font-medium text-slate-400">Try adjusting your search terms</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {filteredVendors.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-[2rem]">
          <Waves className="mx-auto text-slate-200 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-900">No vendors found</h3>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor, i) => (
            <motion.div 
              key={vendor._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group flex flex-col h-full"
            >
              {/* Header: Image & Ratings */}
              <div className="flex items-start gap-4 mb-5">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden">
                  {vendor.avatar ? (
                    <img src={vendor.avatar} alt={vendor.companyName} className="w-full h-full object-cover" />
                  ) : (
                    <Waves className="text-blue-600" size={24} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-bold text-slate-900 truncate pr-2">{vendor.companyName}</h3>
                    <div className="bg-amber-50 px-2 py-1 rounded-lg flex items-center gap-1 shrink-0 border border-amber-100">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="text-[11px] font-bold text-amber-700">4.8</span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mb-1 truncate">{vendor.fullName}</p>
                  <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1 truncate">
                    <MapPin size={12} /> {vendor.businessLocation}
                  </p>
                </div>
              </div>

              {/* Badges / Metrics */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Starting at</span>
                  <span className="text-sm font-bold text-emerald-600">${vendor.startingPrice || 15}</span>
                </div>
                <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/50">
                  <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block mb-1">Availability</span>
                  <span className="text-sm font-bold text-blue-600 flex items-center gap-1">
                    <Clock size={14} /> {vendor.availableSlotsCount || 0} Slots
                  </span>
                </div>
              </div>

              {/* Services List */}
              <div className="mb-6 flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Available Services</p>
                {vendor.activeServices && vendor.activeServices.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {vendor.activeServices.map((srv: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-lg">
                        {srv}
                      </span>
                    ))}
                    {vendor.activeServices.length >= 3 && <span className="px-2.5 py-1 text-slate-400 text-[11px] font-bold">+{vendor.activeServices.length - 2} more</span>}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No services listed yet.</p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 mt-auto">
                <button 
                  onClick={() => navigate(`/customer/vendor/${vendor._id}`)}
                  className="py-3 text-[12px] font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                >
                  View Profile
                </button>
                <button 
                  onClick={() => navigate(`/customer/book?vendor=${vendor._id}`)}
                  className="py-3 text-[12px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>Book Now</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
