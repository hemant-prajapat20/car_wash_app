import React, { useEffect, useState } from 'react';
import { 
  Search, MapPin, Star, Filter, 
  ChevronRight, Car, ShieldCheck, Waves,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../services/axiosConfig';

export const SearchVendors: React.FC = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredVendors = vendors.filter(v => 
    v.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.businessLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl font-inter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div>
          <h1 className="text-[16px] font-bold text-slate-900 tracking-tight">Explore Centers</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Discover top-rated car wash vendors</p>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={14} />
          <input 
            type="text" 
            placeholder="Search city or center..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-medium outline-none focus:ring-2 focus:ring-blue-600/5 focus:border-blue-600 transition-all w-full sm:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredVendors.map((vendor, i) => (
          <motion.div 
            key={vendor._id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border border-slate-100 rounded-[2rem] p-4 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all group cursor-pointer"
            onClick={() => navigate(`/customer/book?vendor=${vendor._id}`)}
          >
            <div className="aspect-[4/3] bg-slate-50 rounded-[1.5rem] mb-4 overflow-hidden relative">
               <div className="absolute inset-0 flex items-center justify-center text-slate-200">
                  <Waves size={40} />
               </div>
               <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                 <Star size={10} className="fill-amber-400 text-amber-400" />
                 <span className="text-[10px] font-bold text-slate-700">4.8</span>
               </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-[13px] font-bold text-slate-900 truncate pr-4">{vendor.companyName}</h3>
              <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1 truncate">
                <MapPin size={10} /> {vendor.businessLocation}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
               <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-200" />
                  ))}
                  <div className="w-5 h-5 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-[7px] font-bold text-blue-600">+12</div>
               </div>
               <div className="p-1.5 bg-slate-50 rounded-lg text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                 <ChevronRight size={14} />
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
