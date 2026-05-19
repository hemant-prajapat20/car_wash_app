import React from 'react';
import { 
  Calendar, Clock, Star, TrendingUp, 
  MapPin, Plus, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Active', value: '2', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Completed', value: '14', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Points', value: '1,250', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
  { label: 'Savings', value: '₹84', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
];

const recentBookings = [
  { id: '1', vendor: 'Elite Car Spa', service: 'Premium Detail', date: 'Yesterday', status: 'Completed', price: '₹45' },
  { id: '2', vendor: 'QuickWash Hub', service: 'Exterior Wash', date: '2 days ago', status: 'Completed', price: '₹20' },
];

export const CustomerDashboard: React.FC = () => {
  return (
    <div className="space-y-5 md:space-y-6 animate-in fade-in duration-500 max-w-full overflow-hidden">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight truncate">Dashboard Overview</h1>
          <p className="text-[11px] md:text-xs font-medium text-slate-500 mt-0.5 truncate uppercase tracking-wider">Welcome back, Alex!</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 md:px-4 py-2 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 text-[12px] shrink-0">
          <Plus size={14} />
          <span>New Booking</span>
        </button>
      </div>

      {/* Stats Grid - Ultra Compact */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-3 md:p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className={`${stat.bg} ${stat.color} w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shrink-0`}>
                <stat.icon size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{stat.label}</p>
                <h3 className="text-md md:text-lg font-semibold text-slate-900 tracking-tight">{stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5 md:gap-6">
        {/* Main Section */}
        <div className="lg:col-span-2 space-y-5 md:space-y-6 min-w-0">
          {/* Active Booking Card - Compact */}
          <div className="bg-slate-900 rounded-[1.25rem] p-4 md:p-6 text-white relative overflow-hidden shadow-lg border border-slate-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-[40px] -mr-16 -mt-16" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-blue-300">Tracking Active Service</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-md md:text-lg font-semibold mb-1 truncate">Elite Auto Spa - Main St.</h3>
                  <div className="flex flex-wrap items-center gap-3 text-slate-400 text-[11px]">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Clock size={12} />
                      <span>~45 mins remaining</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <MapPin size={12} />
                      <span>2.4 mi</span>
                    </div>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-[11px] hover:bg-blue-700 transition-colors whitespace-nowrap w-full md:w-auto">
                  Track Service
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity Table - Compact */}
          <div className="min-w-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm md:text-md font-semibold text-slate-900 tracking-tight">Recent Activity</h2>
              <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest flex items-center gap-1">
                <span>View All</span>
                <ArrowRight size={10} />
              </button>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto custom-scrollbar">
              <table className="w-full text-left min-w-[450px]">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Service</th>
                    <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                      <td className="px-5 py-3">
                        <p className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{booking.vendor}</p>
                        <p className="text-[10px] font-medium text-slate-500">{booking.service}</p>
                      </td>
                      <td className="px-5 py-3 text-[11px] font-medium text-slate-600">{booking.date}</td>
                      <td className="px-5 py-3 text-right">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded-full uppercase tracking-wider">
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets - Compact */}
        <div className="space-y-5 min-w-0">
          <div className="bg-white rounded-xl p-4 md:p-5 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-3">
                <ShieldCheck size={16} />
              </div>
              <h3 className="text-sm font-semibold mb-0.5 text-slate-900">Loyalty Status</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Platinum Tier</p>
              <div className="space-y-1.5 mt-4">
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  <span>Progress</span>
                  <span className="text-blue-600">75%</span>
                </div>
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-[75%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-5 border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Shortcuts</h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-all text-center group">
                <MapPin size={14} className="text-slate-400 group-hover:text-blue-600 mx-auto mb-1 transition-colors" />
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Saved</span>
              </button>
              <button className="p-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-all text-center group">
                <Star size={14} className="text-slate-400 group-hover:text-blue-600 mx-auto mb-1 transition-colors" />
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Favs</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
