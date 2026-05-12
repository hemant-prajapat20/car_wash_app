import React from 'react';
import { 
  BarChart3, TrendingUp, Download, 
  ArrowUpRight 
} from 'lucide-react';

const REVENUE_STATS = [
  { day: 'M', value: 450 }, { day: 'T', value: 520 }, { day: 'W', value: 380 },
  { day: 'T', value: 650 }, { day: 'F', value: 890 }, { day: 'S', value: 1200 },
  { day: 'S', value: 950 },
];

export const VendorReports: React.FC = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-5xl font-inter">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[15px] font-bold text-slate-900 tracking-tight">Analytics</h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Growth & metrics</p>
        </div>
        <button className="bg-slate-900 text-white p-2 rounded-lg hover:bg-blue-600 transition-all">
          <Download size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[12px] font-bold text-slate-900 uppercase tracking-tight">Revenue</h3>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+12%</span>
          </div>
          
          <div className="h-28 flex items-end justify-between gap-1 px-1">
             {REVENUE_STATS.map((stat, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                 <div 
                   className="w-full bg-slate-100 rounded-sm group-hover:bg-blue-600 transition-all duration-300 relative"
                   style={{ height: `${(stat.value / 1200) * 100}%` }}
                 >
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white px-1 rounded">${stat.value}</div>
                 </div>
                 <span className="text-[8px] font-bold text-slate-300">{stat.day}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
           {[
             { label: 'Popular', value: 'Express', color: 'text-blue-600' },
             { label: 'Rating', value: '4.8/5', color: 'text-amber-600' },
             { label: 'Retention', value: '68%', color: 'text-emerald-600' },
             { label: 'Growth', value: '+15%', color: 'text-indigo-600' },
           ].map((insight, i) => (
             <div key={i} className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 truncate">{insight.label}</p>
               <h4 className={`text-[13px] font-bold ${insight.color}`}>{insight.value}</h4>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
