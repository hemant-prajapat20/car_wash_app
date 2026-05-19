import React from 'react';
import { 
  ShoppingBag, Users, Store, Heart, 
  TrendingUp, RefreshCw, BarChart3, AppWindow 
} from 'lucide-react';

const stats = [
  { icon: ShoppingBag, value: '50k+', label: 'Total Bookings', color: 'text-blue-600' },
  { icon: Users, value: '12k+', label: 'Active Users', color: 'text-emerald-600' },
  { icon: Store, value: '250+', label: 'Active Vendors', color: 'text-purple-600' },
  { icon: Heart, value: '98%', label: 'Satisfaction', color: 'text-rose-600' },
  { icon: TrendingUp, value: '+45%', label: 'Revenue Growth', color: 'text-amber-600' },
  { icon: RefreshCw, value: '72%', label: 'Repeat Bookings', color: 'text-indigo-600' },
  { icon: BarChart3, value: '₹250k', label: 'Monthly Rev', color: 'text-blue-500' },
  { icon: AppWindow, value: '8.5k', label: 'Engagement', color: 'text-slate-600' },
];

export const Statistics: React.FC = () => {
  return (
    <section id="statistics" className="py-16 bg-blue-50/30 px-6 lg:px-12 relative overflow-hidden border-y border-blue-100/50">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] -mr-32 -mt-32" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-2">Platform Performance</h2>
          <p className="text-2xl font-semibold text-slate-900 mb-3 tracking-tight">Real-time Global Operations</p>
          <p className="text-slate-500 text-xs font-medium max-w-xl mx-auto leading-relaxed">
            Our intelligent ecosystem processes thousands of data points daily, ensuring seamless coordination between vendors and customers while maintaining 99.9% uptime.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-center group">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <s.icon size={20} className={s.color} />
              </div>
              <div className="text-xl font-semibold text-slate-900 mb-0.5 tracking-tight">{s.value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
