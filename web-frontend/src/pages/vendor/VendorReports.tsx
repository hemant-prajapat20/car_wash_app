import React from 'react';
import { 
  BarChart3, TrendingUp, Download, 
  ArrowUpRight, PieChart, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

const REVENUE_STATS = [
  { day: 'Mon', value: 450 }, { day: 'Tue', value: 520 }, { day: 'Wed', value: 380 },
  { day: 'Thu', value: 650 }, { day: 'Fri', value: 890 }, { day: 'Sat', value: 1200 },
  { day: 'Sun', value: 950 },
];

export const VendorReports: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl font-inter">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">Business Analytics</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Growth performance & metrics</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95">
          <Download size={14} />
          <span>Export PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Revenue Chart Box - Increased Size */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-slate-900 uppercase tracking-tight">Weekly Revenue</h3>
                <p className="text-[10px] font-medium text-slate-400">Total earnings this week</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-lg">
              <TrendingUp size={14} className="text-emerald-600" />
              <span className="text-[11px] font-bold text-emerald-600">+12.5%</span>
            </div>
          </div>
          
          <div className="h-48 flex items-end justify-between gap-2 px-2">
             {REVENUE_STATS.map((stat, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                 <div 
                   className="w-full bg-slate-100 rounded-lg group-hover:bg-blue-600 transition-all duration-500 relative"
                   style={{ height: `${(stat.value / 1200) * 100}%` }}
                 >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white px-2 py-0.5 rounded shadow-xl whitespace-nowrap z-20">
                      ${stat.value}
                    </div>
                 </div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.day}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Analytic Cards - Increased Size */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
           {[
             { label: 'Popular Package', value: 'Express Wash', sub: '42% Volume', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
             { label: 'Avg. Rating', value: '4.8 / 5.0', sub: '210 Reviews', icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50' },
             { label: 'Retention', value: '68%', sub: 'Returning', icon: PieChart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           ].map((insight, i) => (
             <motion.div 
               key={i} 
               whileHover={{ y: -2 }}
               className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group"
             >
               <div className="flex items-center gap-3 mb-3">
                 <div className={`${insight.bg} ${insight.color} w-8 h-8 rounded-lg flex items-center justify-center`}>
                    <insight.icon size={16} />
                 </div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{insight.label}</p>
               </div>
               <h4 className="text-[16px] font-bold text-slate-900 tracking-tight">{insight.value}</h4>
               <p className="text-[10px] font-medium text-slate-500 mt-0.5">{insight.sub}</p>
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
};
