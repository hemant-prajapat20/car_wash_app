import React from 'react';
import { 
  Inbox, Clock, CheckCircle2, User, 
  Car, Calendar, MoreVertical, Zap 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BOOKINGS = [
  { id: 'BK-9921', cust: 'John Doe', car: 'Tesla Model 3', svc: 'Premium Detailing', time: '10:30 AM', status: 'In Progress', price: '$85' },
  { id: 'BK-9920', cust: 'Sarah Smith', car: 'BMW X5', svc: 'Exterior Wash', time: '11:45 AM', status: 'Confirmed', price: '$35' },
  { id: 'BK-9919', cust: 'Mike Ross', car: 'Honda Civic', svc: 'Interior Clean', time: '01:30 PM', status: 'Pending', price: '$55' },
  { id: 'BK-9918', cust: 'Rachel Zane', car: 'Audi A4', svc: 'Full Detailing', time: '03:00 PM', status: 'Completed', price: '$120' },
];

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'Pending': 'bg-slate-100 text-slate-500',
    'Confirmed': 'bg-blue-50 text-blue-600',
    'In Progress': 'bg-amber-50 text-amber-600',
    'Completed': 'bg-emerald-50 text-emerald-600',
  };
  return (
    <span className={cn("text-[8px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded", styles[status])}>
      {status}
    </span>
  );
};

export const ManageBookings: React.FC = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-4xl font-inter">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[15px] font-bold text-slate-900 tracking-tight">Booking Queue</h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Live Operational Status</p>
        </div>
        <button className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95">
          New Booking
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BOOKINGS.map((bk, i) => (
          <motion.div 
            key={bk.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group relative"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <User size={16} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[12.5px] font-bold text-slate-900 truncate">{bk.cust}</h3>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Car size={10} />
                    <span className="text-[10px] font-medium truncate">{bk.car}</span>
                  </div>
                </div>
              </div>
              <button className="text-slate-300 hover:text-slate-600 transition-colors">
                <MoreVertical size={14} />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between py-1.5 px-2 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap size={12} className="text-blue-500" />
                  <span className="text-[11px] font-semibold text-slate-700 truncate">{bk.svc}</span>
                </div>
                <span className="text-[11px] font-bold text-blue-600">{bk.price}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <Clock size={11} className="text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-500">{bk.time}</span>
                </div>
                <StatusBadge status={bk.status} />
              </div>

              <div className="flex gap-2 pt-2 mt-1">
                {bk.status === 'Pending' && (
                  <button className="flex-1 bg-blue-600 text-white py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all">
                    Accept
                  </button>
                )}
                {bk.status === 'In Progress' && (
                  <button className="flex-1 bg-emerald-500 text-white py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all">
                    Complete
                  </button>
                )}
                <button className="px-3 bg-slate-50 text-slate-500 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all">
                  Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
