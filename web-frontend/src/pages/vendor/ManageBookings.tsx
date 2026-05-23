import React, { useEffect, useState } from 'react';
import { 
  Calendar, Clock, Filter, 
  Search, MoreVertical, CheckCircle2, 
  XCircle, PlayCircle, Loader2, Home, MapPin, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/axiosConfig';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import toast from 'react-hot-toast';

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
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const { notifications } = useSelector((state: RootState) => state.notifications);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/vendor/dashboard');
      if (res.data.success) {
        setBookings(res.data.data.rawBookings || []);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [notifications]);

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    setActionLoading(bookingId);
    try {
      const response = await api.patch(`/vendor/bookings/${bookingId}/status`, { status: newStatus });
      if (response.data.success) {
        setBookings(prev => prev.map(bk => bk._id === bookingId ? { ...bk, status: newStatus } : bk));
        toast.success(`Booking status updated to ${newStatus}`);
      }
    } catch (err: any) {
      console.error('Status update failed:', err);
      toast.error(err.response?.data?.message || 'Status update failed');
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
          .map((booking) => {
            const isPlan = booking.isPlanPurchase;
            return (
              <motion.div 
                key={booking._id}
                layout
                className={cn(
                  "border rounded-[20px] p-5 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden",
                  isPlan 
                    ? "bg-gradient-to-br from-amber-50/50 to-white border-amber-200 hover:border-amber-400 shadow-amber-100/20" 
                    : "bg-gradient-to-br from-slate-50 to-white border-slate-200 hover:border-blue-400 hover:shadow-blue-100/40"
                )}
                onClick={() => setSelectedBooking(booking)}
              >
                {isPlan && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full translate-x-12 -translate-y-12 pointer-events-none" />
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="min-w-0">
                    <h3 className="text-[12px] font-bold text-slate-900 truncate leading-tight flex items-center gap-2">
                      {booking.customer?.fullName}
                      {isPlan ? (
                        <span className="bg-amber-100 text-amber-800 text-[8px] px-1.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-widest font-black shrink-0">
                          👑 Plan
                        </span>
                      ) : booking.totalAmount === 0 && booking.service?.name?.includes('Wash #') ? (
                        <span className="bg-amber-50 text-amber-700 text-[8px] px-1.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-widest font-bold shrink-0">
                          👑 Plan Wash
                        </span>
                      ) : booking.serviceType === 'Home' ? (
                        <span className="bg-purple-100 text-purple-700 text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-widest font-bold">
                          <Home size={10} /> Home
                        </span>
                      ) : null}
                    </h3>
                    <p className="text-[10px] font-medium text-slate-400 truncate tracking-tight">{booking.service?.name}</p>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    {isPlan ? (
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest",
                        booking.remainingServices === 0 ? "text-slate-500 bg-slate-100" : "text-amber-700 bg-amber-50"
                      )}>
                        {booking.remainingServices === 0 ? 'Completed' : 'Active'}
                      </span>
                    ) : (
                      <StatusBadge status={booking.status} />
                    )}
                    <span className="text-[11px] font-bold text-slate-900 mt-1">₹{booking.totalAmount || booking.service?.price}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4 pt-3 border-t border-slate-50 text-[10px]">
                  {isPlan ? (
                    <>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar size={12} className="shrink-0 text-amber-500" />
                        <span className="font-bold text-amber-700">
                          Prepaid Active Plan
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock size={12} className="shrink-0 text-amber-500" />
                        <span className="font-bold">
                          Washes: {booking.remainingServices} / {booking.totalServices} Services Left
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                  <div className="flex items-center gap-2 text-slate-600">
                    <CheckCircle2 size={12} className={cn("shrink-0", isPlan ? "text-amber-500" : "text-emerald-500")} />
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
                  {isPlan ? (
                    <div className="w-full py-2 bg-amber-50 border border-amber-200/50 text-amber-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-center">
                      Subscription Active
                    </div>
                  ) : booking.status === 'Pending' && (
                    <>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(booking._id, 'Confirmed'); }}
                        disabled={!!actionLoading}
                        className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        {actionLoading === booking._id ? <Loader2 size={10} className="animate-spin" /> : <PlayCircle size={12}/>}
                        Accept
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(booking._id, 'Cancelled'); }}
                        disabled={!!actionLoading}
                        className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all"
                      >
                        <XCircle size={14}/>
                      </button>
                    </>
                  )}

                  {!isPlan && booking.status === 'Confirmed' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleStatusUpdate(booking._id, 'In Progress'); }}
                      className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                    >
                      Start Service
                    </button>
                  )}

                  {!isPlan && booking.status === 'In Progress' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleStatusUpdate(booking._id, 'Completed'); }}
                      className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                    >
                      Mark as Completed
                    </button>
                  )}

                  {!isPlan && booking.status === 'Completed' && (
                    <div className="w-full py-2 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-bold uppercase tracking-widest text-center">
                      Closed Request
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
      </div>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={cn(
                  "w-full max-w-lg bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] pointer-events-auto border",
                  selectedBooking.isPlanPurchase ? "border-amber-200" : "border-slate-100"
                )}
              >
                <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      {selectedBooking.isPlanPurchase 
                        ? "Subscription Plan Details" 
                        : selectedBooking.totalAmount === 0 && selectedBooking.service?.name?.includes('Wash #')
                          ? "Plan Wash Details"
                          : "Booking Details"}
                      {selectedBooking.isPlanPurchase ? (
                        <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-widest font-black">
                          👑 Plan
                        </span>
                      ) : selectedBooking.totalAmount === 0 && selectedBooking.service?.name?.includes('Wash #') ? (
                        <span className="bg-amber-50 text-amber-700 text-[10px] px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-widest font-bold shrink-0">
                          👑 Plan Wash
                        </span>
                      ) : selectedBooking.serviceType === 'Home' ? (
                        <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-1 rounded-md flex items-center gap-1 uppercase tracking-widest font-bold">
                          <Home size={12} /> Home Service
                        </span>
                      ) : null}
                    </h2>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5 tracking-wide">ID: {selectedBooking.bookingId || selectedBooking._id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                  {/* Status & Amount */}
                  <div className={cn(
                    "flex items-center justify-between p-4 rounded-2xl",
                    selectedBooking.isPlanPurchase ? "bg-amber-50/30 border border-amber-100" : "bg-slate-50"
                  )}>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Current Status</p>
                      {selectedBooking.isPlanPurchase ? (
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider",
                          selectedBooking.remainingServices === 0 ? "bg-slate-100 text-slate-500" : "bg-amber-100 text-amber-800"
                        )}>
                          {selectedBooking.remainingServices === 0 ? 'Exhausted' : 'Active Subscription'}
                        </span>
                      ) : (
                        <StatusBadge status={selectedBooking.status} />
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Total Paid</p>
                      <p className="text-lg font-black text-slate-900">₹{selectedBooking.totalAmount || selectedBooking.service?.price}</p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-100 pb-2">Customer Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-medium text-slate-500">Name</p>
                        <p className="text-sm font-bold text-slate-900">{selectedBooking.customer?.fullName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-slate-500">Phone</p>
                        <p className="text-sm font-bold text-slate-900">{selectedBooking.customer?.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Service/Plan Details */}
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-100 pb-2">
                      {selectedBooking.isPlanPurchase ? "Plan Details" : "Service Details"}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600">{selectedBooking.service?.name}</span>
                        <span className="text-sm font-bold text-slate-900">₹{selectedBooking.service?.price}</span>
                      </div>
                      
                      {selectedBooking.isPlanPurchase ? (
                        <div className="bg-amber-50/20 border border-amber-100/50 rounded-xl p-3 space-y-2">
                          <p className="text-xs font-bold text-amber-800 flex justify-between">
                            <span>Services Included:</span>
                            <span>{selectedBooking.totalServices} Services</span>
                          </p>
                          <p className="text-xs font-black text-amber-900 flex justify-between">
                            <span>Services Remaining:</span>
                            <span>{selectedBooking.remainingServices} Services Left</span>
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar size={14} className="text-blue-500" />
                            <span className="font-bold">Date:</span> {new Date(selectedBooking.slot?.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock size={14} className="text-indigo-500" />
                            <span className="font-bold">Time:</span> {selectedBooking.slot?.time}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-100 pb-2">Vehicle Information</h3>
                    <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                        <CheckCircle2 size={18} className={cn(selectedBooking.isPlanPurchase ? "text-amber-500" : "text-emerald-500")} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{selectedBooking.vehicle?.make} {selectedBooking.vehicle?.model}</p>
                        <p className="text-[11px] font-bold text-slate-500 tracking-widest uppercase">{selectedBooking.vehicle?.plateNumber}</p>
                      </div>
                    </div>
                  </div>

                  {/* Address (If Home Service) */}
                  {!selectedBooking.isPlanPurchase && selectedBooking.serviceType === 'Home' && selectedBooking.homeAddress && (
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-100 pb-2 flex items-center gap-2">
                        <MapPin size={12} /> Service Address
                      </h3>
                      <div className="bg-purple-50 p-3 rounded-xl">
                        <p className="text-sm font-medium text-slate-800">{selectedBooking.homeAddress.address}</p>
                        <p className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-widest">{selectedBooking.homeAddress.city}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
