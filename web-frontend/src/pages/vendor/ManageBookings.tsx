import React, { useEffect, useState } from 'react';
import { 
  Calendar, Clock, Filter, 
  Search, MoreVertical, CheckCircle2, 
  XCircle, PlayCircle, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/axiosConfig';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'Pending': 'text-amber-600 bg-amber-50',
    'Confirmed': 'text-blue-600 bg-blue-50',
    'In Progress': 'text-indigo-600 bg-indigo-50',
    'Completed': 'text-emerald-600 bg-emerald-50',
    'Cancelled': 'text-rose-600 bg-rose-50',
  };
  return (
    <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest", styles[status])}>
      {status}
    </span>
  );
};

export const ManageBookings: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/vendor/dashboard');
      if (res.data.success) {
        setBookings(res.data.data.recentBookings);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    setActionLoading(bookingId);
    try {
      const response = await api.patch(`/vendor/bookings/${bookingId}/status`, { status: newStatus });
      if (response.data.success) {
        setBookings(prev => prev.map(bk => bk._id === bookingId ? { ...bk, status: newStatus } : bk));
      }
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="h-64 flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-6xl font-inter">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[15px] font-bold text-slate-900 tracking-tight">Booking Queue</h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Manage live service requests</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...bookings]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((booking) => (
            <motion.div 
              key={booking._id}
              layout
              className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="min-w-0">
                  <h3 className="text-[12px] font-bold text-slate-900 truncate leading-tight">{booking.customer?.fullName}</h3>
                  <p className="text-[10px] font-medium text-slate-400 truncate tracking-tight">{booking.service?.name}</p>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <StatusBadge status={booking.status} />
                  <span className="text-[11px] font-bold text-slate-900 mt-1">₹{booking.totalAmount}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4 pt-3 border-t border-slate-50 text-[10px]">
                 <div className="flex items-center gap-2 text-slate-500">
                   <Calendar size={12} className="shrink-0 text-blue-500" />
                   <span className="font-bold truncate">
                     Scheduled: {new Date(booking.slot?.date).toLocaleDateString()} at {booking.slot?.time}
                   </span>
                 </div>
                 <div className="flex items-center gap-2 text-slate-500">
                   <Clock size={12} className="shrink-0 text-indigo-500" />
                   <span className="font-bold truncate">
                     Placed: {new Date(booking.createdAt).toLocaleString()}
                   </span>
                 </div>
                 <div className="flex items-center gap-2 text-slate-600">
                   <CheckCircle2 size={12} className="shrink-0 text-emerald-500" />
                   <span className="font-bold truncate">
                     {booking.vehicle?.make} {booking.vehicle?.model} • {booking.vehicle?.plateNumber}
                   </span>
                 </div>
                 <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dashed border-slate-100 text-[9px] font-bold text-slate-400">
                   <div>
                     <span className="uppercase tracking-widest block text-[8px] text-slate-300">Payment Mode</span>
                     <span className="text-slate-700 font-black">{booking.paymentMode || 'Online'}</span>
                   </div>
                   <div>
                     <span className="uppercase tracking-widest block text-[8px] text-slate-300">Customer ID</span>
                     <span className="font-mono text-slate-600 block truncate">{booking.customer?._id || booking.customer}</span>
                   </div>
                 </div>
              </div>

              <div className="flex items-center gap-2">
                 {booking.status === 'Pending' && (
                   <>
                     <button 
                      onClick={() => handleStatusUpdate(booking._id, 'Confirmed')}
                      disabled={!!actionLoading}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                     >
                       {actionLoading === booking._id ? <Loader2 size={10} className="animate-spin" /> : <PlayCircle size={12}/>}
                       Accept
                     </button>
                     <button 
                      onClick={() => handleStatusUpdate(booking._id, 'Cancelled')}
                      disabled={!!actionLoading}
                      className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all"
                     >
                       <XCircle size={14}/>
                     </button>
                   </>
                 )}

                 {booking.status === 'Confirmed' && (
                   <button 
                    onClick={() => handleStatusUpdate(booking._id, 'In Progress')}
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all"
                   >
                     Start Service
                   </button>
                 )}

                 {booking.status === 'In Progress' && (
                   <button 
                    onClick={() => handleStatusUpdate(booking._id, 'Completed')}
                    className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all"
                   >
                     Mark as Completed
                   </button>
                 )}

                 {booking.status === 'Completed' && (
                   <div className="w-full py-2 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-bold uppercase tracking-widest text-center">
                     Closed Request
                   </div>
                 )}
              </div>
            </motion.div>
        ))}
      </div>
    </div>
  );
};
