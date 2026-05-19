import React, { useEffect, useState } from 'react';
import { 
  Receipt, Download, CheckCircle2, 
  ArrowUpRight, ArrowDownLeft, Loader2, AlertCircle
} from 'lucide-react';
import api from '../../services/axiosConfig';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const VendorTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { notifications } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/vendor/transactions');
        if (response.data.success) {
          setTransactions(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch transactions', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [notifications]);

  if (loading) {
    return (
      <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading Finances...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500 w-full font-inter">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[15px] font-bold text-slate-900 tracking-tight">Finances</h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Comprehensive payment logs</p>
        </div>
        <button className="bg-slate-900 text-white p-2 rounded-lg hover:bg-blue-600 transition-all shadow-lg shadow-slate-100">
           <Download size={16} />
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="py-24 bg-white border border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center text-slate-400">
          <Receipt size={48} className="mb-4 opacity-20" />
          <p className="text-sm font-bold tracking-tight">No Transactions Yet</p>
          <p className="text-[10px] mt-1 uppercase tracking-widest">When customers pay, history will appear here.</p>
        </div>
      ) : (
        <>
          {/* Header for Desktop */}
          <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-2 bg-slate-50 rounded-xl text-[9px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100/50">
            <div className="col-span-1">Trans. ID</div>
            <div className="col-span-1">Customer</div>
            <div className="col-span-2">Date & Time</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-right">Amount</div>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-white border border-slate-100 rounded-2xl p-4 md:px-6 md:py-4 flex flex-col md:grid md:grid-cols-6 items-center gap-3 md:gap-4 hover:shadow-md hover:border-blue-100 transition-all group">
                 {/* Transaction ID */}
                <div className="w-full md:w-auto flex items-center justify-between md:block col-span-1">
                   <span className="md:hidden text-[9px] font-bold text-slate-300 uppercase tracking-widest">ID</span>
                   <button 
                     onClick={() => window.open(`/invoice/${tx.bookingId}`, '_blank')}
                     className="text-[10px] font-bold text-blue-600 font-mono tracking-tighter uppercase px-2 py-1 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all cursor-pointer border border-blue-100/50 active:scale-95"
                   >
                     {tx.id}
                   </button>
                </div>

                {/* Customer Name */}
                <div className="w-full md:w-auto flex items-center justify-between md:block col-span-1">
                   <span className="md:hidden text-[9px] font-bold text-slate-300 uppercase tracking-widest">Customer</span>
                   <p className="text-[12px] font-bold text-slate-900 truncate">{tx.cust}</p>
                </div>

                {/* Date & Time */}
                <div className="w-full md:w-auto flex items-center justify-between md:block col-span-2">
                   <span className="md:hidden text-[9px] font-bold text-slate-300 uppercase tracking-widest">Date & Time</span>
                   <div className="flex items-center gap-2">
                     <p className="text-[11px] font-bold text-slate-500">{tx.date}</p>
                     <span className="w-1 h-1 bg-slate-200 rounded-full hidden md:block" />
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{tx.time}</p>
                   </div>
                </div>

                {/* Status */}
                <div className="w-full md:w-auto flex items-center justify-between md:block col-span-1">
                   <span className="md:hidden text-[9px] font-bold text-slate-300 uppercase tracking-widest">Status</span>
                   <span className={cn(
                     "text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg",
                     tx.status === 'Success' ? "bg-emerald-50 text-emerald-600" : 
                     tx.status === 'Failed' ? "bg-rose-50 text-rose-600" : 
                     tx.status === 'Refund' ? "bg-amber-50 text-amber-600" : 
                     "bg-slate-50 text-slate-600"
                   )}>{tx.status}</span>
                </div>

                {/* Amount */}
                <div className="w-full md:w-auto flex items-center justify-between md:block col-span-1 md:text-right">
                   <span className="md:hidden text-[9px] font-bold text-slate-300 uppercase tracking-widest">Amount</span>
                   <p className={cn(
                     "text-[14px] font-bold",
                     tx.amt.startsWith('+') ? "text-emerald-600" : "text-rose-600"
                   )}>{tx.amt}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
