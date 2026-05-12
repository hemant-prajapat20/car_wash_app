import React from 'react';
import { 
  Calendar, Clock, Star, 
  ChevronRight, MessageSquare 
} from 'lucide-react';
import { motion } from 'framer-motion';

const BOOKINGS = [
  {
    id: 'BK-7701', vendor: 'Elite Auto Spa Luxury Center', service: 'Premium Detail',
    date: 'May 14', time: '10:30', status: 'Confirmed', 
    price: '$85', vehicle: 'Tesla Model 3'
  },
  {
    id: 'BK-7685', vendor: 'QuickWash Express', service: 'Ext Wash',
    date: 'May 10', time: '02:15', status: 'Completed', 
    price: '$25', vehicle: 'BMW X5', reviewed: false
  },
  {
    id: 'BK-7640', vendor: 'Platinum Care Hub', service: 'Int Clean',
    date: 'May 05', time: '11:00', status: 'Cancelled', 
    price: '$45', vehicle: 'Tesla Model 3'
  }
];

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'Pending': 'text-slate-400 bg-slate-50',
    'Confirmed': 'text-blue-600 bg-blue-50',
    'Completed': 'text-emerald-600 bg-emerald-50',
    'Cancelled': 'text-rose-500 bg-rose-50',
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${styles[status]}`}>
      {status}
    </span>
  );
};

export const MyBookings: React.FC = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-4xl font-inter">
      <div className="px-1">
        <h1 className="text-[15px] font-bold text-slate-900 tracking-tight">Booking History</h1>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Your past and upcoming services</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BOOKINGS.map((booking, i) => (
          <motion.div 
            key={booking.id}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                  <Calendar size={16} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[12px] font-bold text-slate-900 truncate leading-tight">{booking.vendor}</h3>
                  <p className="text-[10px] font-medium text-slate-400 truncate">{booking.service}</p>
                </div>
              </div>
              <StatusBadge status={booking.status} />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock size={10} />
                  <span className="text-[10px] font-bold">{booking.date} • {booking.time}</span>
                </div>
                <span className="text-[10px] font-bold text-blue-600">{booking.price}</span>
              </div>
              <div className="flex items-center gap-2">
                 {booking.status === 'Completed' && !booking.reviewed && (
                   <button className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
                     <Star size={10} className="fill-white" />
                   </button>
                 )}
                 <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
