import React, { useEffect, useState } from 'react';
import { 
  Calendar, Clock, Star, 
  ChevronRight, Loader2, AlertCircle, FileText, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/axiosConfig';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const StatusBadge = ({ status, isExpired }: { status: string, isExpired?: boolean }) => {
  if (isExpired) {
    return (
      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100">
        Expired
      </span>
    );
  }
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
  const navigate = useNavigate();

  // Review states
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

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

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForReview) return;
    if (!reviewComment.trim()) return toast.error('Please enter your feedback review.');

    try {
      setSubmittingReview(true);
      const res = await api.post('/customer/reviews', {
        bookingId: selectedBookingForReview._id,
        rating: reviewRating,
        comment: reviewComment
      });
      if (res.data.success) {
        toast.success('Thank you! Your feedback has been sent to the vendor.');
        setSelectedBookingForReview(null);
        setReviewRating(5);
        setReviewComment('');
        // Refresh bookings list to update UI if needed
        fetchMyBookings();
      } else {
        toast.error('Failed to submit review');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-4xl font-inter">
      <div className="px-1">
        <h1 className="text-[15px] font-bold text-slate-900 tracking-tight">Booking History</h1>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Track your service status</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {bookings.length > 0 ? [...bookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((booking, i) => {
          const nowIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
          const currentISTDateStr = nowIST.getFullYear() + '-' + String(nowIST.getMonth() + 1).padStart(2, '0') + '-' + String(nowIST.getDate()).padStart(2, '0');
          const bookingDateStr = booking.slot?.date ? new Date(booking.slot.date).toISOString().split('T')[0] : '';
          const isExpired = !!(!booking.isPlanPurchase && bookingDateStr && bookingDateStr < currentISTDateStr && ['Pending', 'Confirmed'].includes(booking.status));

          return (
          <motion.div 
            key={booking._id}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "bg-white border rounded-2xl p-3 shadow-sm hover:shadow-md transition-all group",
              isExpired ? "border-slate-100 opacity-70" : "border-slate-100"
            )}
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
              <StatusBadge status={booking.status} isExpired={isExpired} />
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
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       setSelectedBookingForReview(booking);
                     }}
                     className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                     title="Rate & Feedback"
                   >
                     <Star size={10} className="fill-white" />
                   </button>
                 )}
                 {booking.status !== 'Pending' && booking.status !== 'Cancelled' && (
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       navigate(`/invoice/${booking._id}`);
                     }}
                     className="p-1.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center"
                     title="View Invoice"
                   >
                     <FileText size={10} />
                   </button>
                 )}
                 <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600" />
              </div>
             </div>
          </motion.div>
        )}) : (
          <div className="col-span-full py-16 text-center text-slate-300">
            <AlertCircle size={32} className="mx-auto mb-2 opacity-20" />
            <p className="text-[10px] font-bold uppercase tracking-widest">No bookings found</p>
          </div>
        )}
      </div>

      {/* ── Rate & Review Modal ─────────────────────── */}
      <AnimatePresence>
        {selectedBookingForReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">Rate & Review</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Share your wash experience with {selectedBookingForReview.vendor?.companyName}</p>
                </div>
                <button
                  onClick={() => setSelectedBookingForReview(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="p-6 space-y-5">
                {/* Star Rating Select Area */}
                <div className="space-y-2 text-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Select Rating Stars</label>
                  <div className="flex justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star 
                          size={32} 
                          className={star <= reviewRating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Textarea */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Write Review Feedback</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your service quality, speed, and worker behavior..."
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-blue-400 focus:bg-white transition-all font-semibold text-slate-700 resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBookingForReview(null)}
                    className="flex-1 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-700 transition-colors border border-slate-200 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex-[2] py-3 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submittingReview ? (
                      <>
                        <Loader2 size={12} className="animate-spin" /> Submitting...
                      </>
                    ) : 'Submit Review'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
