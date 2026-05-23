import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, 
  MoreVertical, Star, ChevronRight, 
  Trash2, User, Phone, Mail, 
  History, X, Loader2, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/axiosConfig';

export const VendorCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showOptions, setShowOptions] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vendor/customers');
      if (res.data.success) {
        setCustomers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this customer from your directory?')) {
      setCustomers(prev => prev.filter(c => c._id !== id));
      setShowOptions(null);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[calc(100vh-200px)] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-6xl font-inter relative">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[15px] font-bold text-slate-900 tracking-tight">Client Directory</h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Management of your customers</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative group sm:block">
             <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
             <input 
              type="text" 
              placeholder="Search customers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] outline-none w-32 sm:w-48 focus:sm:w-64 transition-all focus:border-blue-300" 
             />
           </div>
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="py-24 bg-white border border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center text-slate-400">
          <Users size={48} className="mb-4 opacity-20" />
          <p className="text-sm font-bold tracking-tight">No customers found</p>
          <p className="text-[10px] mt-1 uppercase tracking-widest">Try adjusting your search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCustomers.map((cust) => (
            <motion.div 
              layout
              key={cust._id} 
              className="bg-white border border-slate-100 rounded-[24px] p-4 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group flex flex-col justify-between h-44 relative"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div 
                    onClick={() => setSelectedCustomer(cust)}
                    className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0 cursor-pointer overflow-hidden border border-slate-50"
                  >
                    {cust.avatar ? <img src={cust.avatar} className="w-full h-full object-cover" alt="" /> : <User size={20} />}
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setShowOptions(showOptions === cust._id ? null : cust._id)}
                      className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                    >
                      <MoreVertical size={16} />
                    </button>
                    
                    <AnimatePresence>
                      {showOptions === cust._id && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 top-full mt-1 w-32 bg-white border border-slate-100 shadow-xl rounded-xl z-10 py-1 overflow-hidden"
                        >
                          <button 
                            onClick={() => { setSelectedCustomer(cust); setShowOptions(null); }}
                            className="w-full px-3 py-2 text-left text-[11px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <User size={12} /> View Profile
                          </button>
                          <button 
                            onClick={() => handleDelete(cust._id)}
                            className="w-full px-3 py-2 text-left text-[11px] font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <h3 
                  onClick={() => setSelectedCustomer(cust)}
                  className="text-[13px] font-bold text-slate-900 truncate leading-tight mb-0.5 cursor-pointer hover:text-blue-600 transition-colors"
                >
                  {cust.name}
                </h3>
                <p className="text-[10px] font-medium text-slate-400 truncate tracking-tight">{cust.email}</p>
              </div>

              <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                 <div className="min-w-0">
                   <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Total Bookings</p>
                   <p className="text-[13px] font-black text-slate-800">{cust.bookingsCount}</p>
                 </div>
                 <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded-lg h-fit border border-amber-100">
                   <Star size={10} className="fill-amber-400 text-amber-400" />
                   <span className="text-[10px] font-bold text-amber-700">{cust.avgRating.toFixed(1)}</span>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Customer Profile Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomer(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative z-10"
            >
              <div className="h-20 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="px-8 pb-8 relative">
                <div className="flex justify-center -mt-12 mb-4">
                  <div className="w-20 h-20 bg-white rounded-[2rem] p-1.5 shadow-xl">
                    <div className="w-full h-full bg-slate-50 rounded-[1.6rem] overflow-hidden flex items-center justify-center text-slate-300">
                      {selectedCustomer.avatar ? <img src={selectedCustomer.avatar} className="w-full h-full object-cover" alt="" /> : <User size={40} />}
                    </div>
                  </div>
                </div>
                
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">{selectedCustomer.name}</h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">{selectedCustomer.email}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Bookings</p>
                    <p className="text-lg font-black text-slate-900">{selectedCustomer.bookingsCount}</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Avg Rating</p>
                    <p className="text-lg font-black text-amber-700">{selectedCustomer.avgRating.toFixed(1)} <Star size={16} className="inline mb-1 fill-amber-400 text-amber-400" /></p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</p>
                      <p className="text-sm font-bold text-slate-700">{selectedCustomer.phone || 'Not Provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                      <History size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer ID</p>
                      <p className="text-sm font-bold text-slate-700 truncate">#{selectedCustomer._id.toUpperCase()}</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
