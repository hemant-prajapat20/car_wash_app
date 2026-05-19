import React, { useEffect, useState } from 'react';
import { 
  Calendar, Clock, Star, 
  ChevronRight, Loader2, AlertCircle, FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/axiosConfig';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { InvoiceModal } from '../../components/shared/InvoiceModal';
import toast from 'react-hot-toast';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'Pending': 'text-slate-400 bg-slate-50',
    'Confirmed': 'text-blue-600 bg-blue-50',
    'In Progress': 'text-indigo-600 bg-indigo-50',
    'Completed': 'text-emerald-600 bg-emerald-50',
    'Cancelled': 'text-rose-500 bg-rose-50',
  };
  return (
    <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest", styles[status])}>
      {status}
    </span>
  );
};

export const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [invoiceOpen, setInvoiceOpen] = useState<boolean>(false);
  const [fetchingInvoice, setFetchingInvoice] = useState<string | null>(null);

  const handleViewInvoice = async (e: React.MouseEvent, bookingId: string) => {
    e.stopPropagation();
    try {
      setFetchingInvoice(bookingId);
      const response = await api.get(`/payment/invoice/${bookingId}`);
      if (response.data.success) {
        setInvoiceData(response.data.data);
        setInvoiceOpen(true);
      } else {
        toast.error("Failed to fetch invoice details");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load invoice");
    } finally {
      setFetchingInvoice(null);
    }
  };

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const res = await api.get('/customer/my-bookings');
        if (res.data.success) setBookings(res.data.data);
      } catch (err) {
        console.error('Failed to fetch my bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, []);

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-4xl font-inter">
      <div className="px-1">
        <h1 className="text-[15px] font-bold text-slate-900 tracking-tight">Booking History</h1>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Track your service status</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {bookings.length > 0 ? bookings.map((booking, i) => (
          <motion.div 
            key={booking._id}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                  <Calendar size={16} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[12px] font-bold text-slate-900 truncate leading-tight">{booking.vendor?.companyName}</h3>
                  <p className="text-[10px] font-medium text-slate-400 truncate">{booking.service?.name}</p>
                </div>
              </div>
              <StatusBadge status={booking.status} />
            </div>

             <div className="flex items-center justify-between pt-3 border-t border-slate-50">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock size={10} />
                  <span className="text-[10px] font-bold">{new Date(booking.slot?.date).toLocaleDateString()} • {booking.slot?.time}</span>
                </div>
                <span className="text-[10px] font-bold text-blue-600">₹{booking.totalAmount}</span>
              </div>
              <div className="flex items-center gap-2">
                 {booking.status === 'Completed' && (
                   <button className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
                     <Star size={10} className="fill-white" />
                   </button>
                 )}
                 {booking.status !== 'Pending' && booking.status !== 'Cancelled' && (
                   <button 
                     onClick={(e) => handleViewInvoice(e, booking._id)}
                     disabled={fetchingInvoice === booking._id}
                     className="p-1.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center disabled:opacity-50"
                     title="View Invoice"
                   >
                     {fetchingInvoice === booking._id ? (
                       <Loader2 size={10} className="animate-spin" />
                     ) : (
                       <FileText size={10} />
                     )}
                   </button>
                 )}
                 <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600" />
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-16 text-center text-slate-300">
            <AlertCircle size={32} className="mx-auto mb-2 opacity-20" />
            <p className="text-[10px] font-bold uppercase tracking-widest">No bookings found</p>
          </div>
        )}
      </div>

      <InvoiceModal 
        isOpen={invoiceOpen} 
        onClose={() => setInvoiceOpen(false)} 
        data={invoiceData} 
      />
    </div>
  );
};
