import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, Users, BarChart3, TrendingUp, 
  Clock, CheckCircle2, ChevronRight, AlertCircle,
  Crown, Star, UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/axiosConfig';

export const VendorDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/vendor/dashboard');
        if (response.data.success) {
          setStats(response.data.data.stats);
          setRecentBookings(response.data.data.recentBookings);
          setTopCustomers(response.data.data.topCustomers);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
        <BarChart3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Analyzing Performance...</p>
    </div>
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-500 w-full font-inter">
      <div className="px-1 flex items-center justify-between">
        <div>
          <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">Performance Overview</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Real-time business intelligence</p>
        </div>
        <div className="bg-white border border-slate-100 px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-2">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">System Live</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {[
          { label: 'Revenue', val: `₹${stats?.revenue || 0}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Orders', val: stats?.totalBookings || 0, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Completed', val: stats?.completedBookings || 0, icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Staff', val: stats?.totalWorkers || 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Popular Slot', val: stats?.popularSlot || 'N/A', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Pending', val: stats?.pendingBookings || 0, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={i} 
            className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group overflow-hidden active:scale-95 cursor-default"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className={`${stat.bg} ${stat.color} p-2 rounded-xl shrink-0 transition-transform group-hover:rotate-12`}>
                 <stat.icon size={16} />
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{stat.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-[16px] font-bold text-slate-900 truncate pr-1">{stat.val}</h3>
              <div className="flex items-center gap-0.5 text-emerald-600">
                <TrendingUp size={10} />
                <span className="text-[9px] font-bold">12%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 px-1">
            <div>
              <h3 className="text-[14px] font-bold text-slate-900 leading-none">Recent Activity</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Latest service fulfillment</p>
            </div>
            <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">Full Report</button>
          </div>
          
          <div className="space-y-2">
            {recentBookings.length > 0 ? (
              [...recentBookings]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((bk, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer group border border-transparent hover:border-slate-100"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                      <UserCheck size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-slate-900 truncate leading-tight">{bk.customer?.fullName || 'Walk-in Customer'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{bk.service?.name || 'Standard Wash'}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">{bk.slot?.time || '09:00 AM'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[12px] font-bold text-slate-900 mb-1">₹{bk.totalAmount}</p>
                    <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
                      bk.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {bk.status}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                <AlertCircle size={32} className="mx-auto text-slate-200 mb-3" />
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No Recent Bookings Found</p>
                <p className="text-[9px] text-slate-300 mt-1">Activity will appear here as customers book slots</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Customers Leaderboard */}
        <div className="bg-slate-900 rounded-[32px] p-6 shadow-xl shadow-slate-200 text-white flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-amber-400/10 text-amber-400 rounded-xl flex items-center justify-center">
              <Crown size={20} />
            </div>
            <div>
              <h3 className="text-[14px] font-bold tracking-tight">Top Customers</h3>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">High-Value Leaders</p>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            {topCustomers.length > 0 ? topCustomers.map((customer, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center text-[11px] font-bold text-slate-400 group-hover:bg-amber-400 group-hover:text-slate-900 transition-all shrink-0">
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-white truncate leading-tight group-hover:text-amber-400 transition-colors">
                      {customer.customerDetails?.fullName}
                    </p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                      {customer.bookingsCount} Visits
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold text-amber-400">₹{customer.totalSpent}</p>
                </div>
              </div>
            )) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-40">
                <Star size={32} className="mb-3 text-slate-600" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Initializing Leaderboard</p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between">
               <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Monthly Growth</p>
                  <p className="text-[14px] font-bold text-emerald-400">+24.5%</p>
               </div>
               <div className="w-8 h-8 bg-emerald-500/20 text-emerald-500 rounded-lg flex items-center justify-center">
                  <TrendingUp size={16} />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
