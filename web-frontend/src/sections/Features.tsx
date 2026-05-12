import React from 'react';
import { 
  Calendar, Users, Clock, CreditCard, 
  Bell, BarChart3, Star, UserCheck, TrendingUp 
} from 'lucide-react';

const features = [
  { icon: Calendar, title: 'Smart Bookings', desc: 'Automated slot management with real-time sync.' },
  { icon: Users, title: 'Vendor Portal', desc: 'Powerful tools to manage shops and staff.' },
  { icon: Clock, title: 'Real-time Slots', desc: 'Live status and booking in seconds.' },
  { icon: CreditCard, title: 'Subscriptions', desc: 'Flexible recurring revenue models.' },
  { icon: Bell, title: 'Notifications', desc: 'Instant SMS and Email alerts.' },
  { icon: BarChart3, title: 'Rich Analytics', desc: 'Data-driven insights for operations.' },
  { icon: Star, title: 'Rewards System', desc: 'Integrated loyalty programs.' },
  { icon: UserCheck, title: 'Customer Tracking', desc: 'Complete history and preferences.' },
  { icon: TrendingUp, title: 'Revenue Insights', desc: 'Track your growth with reporting.' },
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-16 bg-slate-50/50 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-2">Core Platform</h2>
          <p className="text-3xl font-semibold text-slate-900 mb-4">Engineered for Excellence</p>
          <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                <f.icon size={20} className="text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
