import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle2, Info, AlertTriangle, XCircle, Trash2, Check, Loader2, FileText } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchNotifications, markRead, markAllRead, removeNotification } from '../../store/notificationSlice';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import api from '../../services/axiosConfig';
import { InvoiceModal } from './InvoiceModal';
import toast from 'react-hot-toast';

interface NotificationPageProps {
  title: string;
  subtitle: string;
}

export const NotificationPage: React.FC<NotificationPageProps> = ({ title, subtitle }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, loading, pagination } = useSelector((state: RootState) => state.notifications);

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
    dispatch(fetchNotifications(1));
  }, [dispatch]);

  const getIcon = (status: string) => {
    switch (status) {
      case 'success': return <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm"><CheckCircle2 size={20} /></div>;
      case 'warning': return <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shadow-sm"><AlertTriangle size={20} /></div>;
      case 'error': return <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shadow-sm"><XCircle size={20} /></div>;
      default: return <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm"><Info size={20} /></div>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-inter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => dispatch(markAllRead())}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <Check size={14} /> Mark all read
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading && notifications.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center bg-white border border-slate-100 rounded-[2rem] shadow-sm">
            <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Fetching your alerts...</p>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((n, i) => (
            <motion.div 
              key={n._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => !n.isRead && dispatch(markRead(n._id))}
              className={`bg-white border p-5 rounded-[2rem] flex flex-col sm:flex-row gap-5 items-start sm:items-center transition-all hover:shadow-xl hover:shadow-slate-200/40 relative group cursor-pointer ${!n.isRead ? 'border-blue-200 bg-blue-50/20 shadow-lg shadow-blue-100/20 border-l-8' : 'border-slate-100'}`}
            >
              <div className="shrink-0">
                {getIcon(n.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`text-sm truncate ${!n.isRead ? 'font-black text-slate-950' : 'font-semibold text-slate-600'}`}>{n.title}</h3>
                  {!n.isRead && <span className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0 animate-pulse" />}
                </div>
                <p className={`text-[12px] leading-relaxed ${!n.isRead ? 'font-bold text-slate-800' : 'font-medium text-slate-400'}`}>{n.message}</p>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 block">
                  {format(new Date(n.createdAt), 'MMM dd, yyyy • hh:mm a')}
                </span>

                {n.bookingId && (
                  <button 
                    onClick={(e) => handleViewInvoice(e, n.bookingId!)}
                    disabled={fetchingInvoice === n.bookingId}
                    className="mt-3 text-[9px] font-black text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 border border-blue-100 rounded-lg px-2.5 py-1.5 transition-all flex items-center gap-1.5 self-start uppercase tracking-wider disabled:opacity-50"
                  >
                    {fetchingInvoice === n.bookingId ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : (
                      <FileText size={10} />
                    )}
                    View Invoice
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity self-end sm:self-center">
                {!n.isRead && (
                  <button 
                    onClick={() => dispatch(markRead(n._id))}
                    className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    title="Mark as read"
                  >
                    <Check size={16} />
                  </button>
                )}
                <button 
                  onClick={() => dispatch(removeNotification(n._id))}
                  className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="h-96 flex flex-col items-center justify-center bg-white border border-slate-100 border-dashed rounded-[3rem]">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Bell size={32} className="text-slate-200" />
            </div>
            <h3 className="text-lg font-bold text-slate-400">All caught up!</h3>
            <p className="text-sm text-slate-400 mt-1">No notifications found in your account.</p>
          </div>
        )}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2 pt-6">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => dispatch(fetchNotifications(page))}
              className={`w-10 h-10 rounded-xl text-[11px] font-bold transition-all ${
                pagination.page === page 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      <InvoiceModal 
        isOpen={invoiceOpen} 
        onClose={() => setInvoiceOpen(false)} 
        data={invoiceData} 
      />
    </div>
  );
};
