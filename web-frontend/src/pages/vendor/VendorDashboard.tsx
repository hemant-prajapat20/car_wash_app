import React from 'react';
import { 
  Inbox, Clock, CheckCircle2, TrendingUp, 
  DollarSign, Users, ArrowUpRight, Calendar,
  Activity, Zap, Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const stats = [
  { label: 'Revenue', value: '$4,250', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+18%' },
  { label: 'Bookings', value: '128', icon: Inbox, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+12%' },
  { label: 'Today', value: '12', icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+4' },
  { label: 'Pending', value: '05', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', trend: '-2' },
];

export const VendorDashboard: React.FC = () => {
  return (
    <div className="space-y-5 animate-in fade-in duration-500 max-w-full overflow-hidden font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight leading-none">Dashboard Overview</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-1.5">Real-time business performance</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live System</span>
        </div>
      </div>

      {/* Ultra-Compact Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn(stat.bg, stat.color, "w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform")}>
                <stat.icon size={15} />
              </div>
              <span className={cn(
                "text-[9px] font-bold px-1.5 py-0.5 rounded-md",
                stat.trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                {stat.trend}
              </span>
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</p>
            <h3 className="text-[16px] font-bold text-slate-900 tracking-tight truncate">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity Small Box */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">Recent Orders</h2>
            <button className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-widest">View All</button>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-50">
              {[
                { id: '9921', cust: 'John Doe', svc: 'Premium Detailing', status: 'In Progress', time: '10:30' },
                { id: '9920', cust: 'Sarah Smith', svc: 'Exterior Wash', status: 'Confirmed', time: '11:45' },
                { id: '9919', cust: 'Mike Ross', svc: 'Interior Clean', status: 'Completed', time: '09:00' },
              ].map((order) => (
                <div key={order.id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Zap size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-slate-900 truncate">{order.cust}</p>
                      <p className="text-[10px] font-medium text-slate-400 truncate">{order.svc}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] font-bold text-slate-900">{order.time} AM</p>
                    <span className={cn(
                      "text-[8px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded",
                      order.status === 'In Progress' ? "text-amber-600" : 
                      order.status === 'Completed' ? "text-emerald-600" : "text-blue-600"
                    )}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Mini Insights */}
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="relative z-10">
               <div className="flex items-center gap-2 mb-4">
                 <Target size={14} className="text-emerald-400" />
                 <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Daily Target</span>
               </div>
               <div className="flex items-end justify-between mb-2">
                 <h4 className="text-xl font-bold">$850<span className="text-[10px] text-slate-500 ml-1">/$1.2k</span></h4>
                 <span className="text-[10px] font-bold text-emerald-400">70%</span>
               </div>
               <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 rounded-full w-[70%]" />
               </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
             <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Management</h3>
             <div className="grid grid-cols-2 gap-2">
                <button className="p-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-all text-center">
                  <Activity size={14} className="mx-auto mb-1.5 text-slate-400" />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600">Slots</span>
                </button>
                <button className="p-3 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-all text-center">
                  <Users size={14} className="mx-auto mb-1.5 text-slate-400" />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600">Staff</span>
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
