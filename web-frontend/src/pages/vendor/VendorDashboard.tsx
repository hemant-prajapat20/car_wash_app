import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, Users, BarChart3, TrendingUp, 
  Clock, CheckCircle2, ChevronRight, AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/axiosConfig';

export const VendorDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/vendor/dashboard');
        if (response.data.success) {
          setStats(response.data.data.stats);
          setRecentBookings(response.data.data.recentBookings);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="h-full flex items-center justify-center"><BarChart3 className="animate-pulse text-blue-600" size={48} /></div>;

  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-6xl font-inter">
      <div className="px-1">
        <h1 className="text-[15px] font-bold text-slate-900 tracking-tight">Performance Overview</h1>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Real-time business metrics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {[
          { label: 'Revenue', val: `$${stats?.totalRevenue || 0}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Orders', val: stats?.totalBookings || 0, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Completed', val: stats?.completedBookings || 0, icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Pending', val: stats?.pendingBookings || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all group overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <div className={`${stat.bg} ${stat.color} p-1.5 rounded-lg shrink-0`}>
                 <stat.icon size={14} />
              </div>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate">{stat.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-[14px] font-bold text-slate-900 truncate pr-1">{stat.val}</h3>
              <span className="text-[8px] font-bold text-emerald-600">+12%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-100 rounded-[2rem] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Recent Activity</h3>
            <button className="text-[9px] font-bold text-blue-600 hover:underline uppercase tracking-widest">View All</button>
          </div>
          <div className="space-y-1.5">
            {recentBookings.length > 0 ? recentBookings.map((bk, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                    <Clock size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-900 truncate leading-tight">{bk.customer?.fullName || 'Walk-in Customer'}</p>
                    <p className="text-[9px] font-medium text-slate-400 truncate">{bk.service?.name}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-bold text-slate-900">{bk.totalAmount}</p>
                  <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">{bk.status}</span>
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <AlertCircle size={24} className="mx-auto text-slate-200 mb-2" />
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No recent bookings</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
