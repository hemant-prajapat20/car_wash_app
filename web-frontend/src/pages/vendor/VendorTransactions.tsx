import React from 'react';
import { 
  Receipt, Download, CheckCircle2, 
  ArrowUpRight, ArrowDownLeft 
} from 'lucide-react';

const TRANSACTIONS = [
  { id: 'TX-7K9W2M4P1L', cust: 'John Doe', amt: '+₹85', date: 'May 12, 2026', time: '10:30 AM', status: 'Success' },
  { id: 'TX-3B8V5N9Q0X', cust: 'Sarah Smith', amt: '+₹35', date: 'May 11, 2026', time: '02:15 PM', status: 'Success' },
  { id: 'TX-1M4L7P2D8G', cust: 'Mike Ross', amt: '-₹15', date: 'May 10, 2026', time: '09:00 AM', status: 'Refund' },
  { id: 'TX-9R3T6Y1H5J', cust: 'Harvey Specter', amt: '+₹120', date: 'May 09, 2026', time: '11:45 AM', status: 'Success' },
];

export const VendorTransactions: React.FC = () => {
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

      {/* Header for Desktop */}
      <div className="hidden md:grid grid-cols-6 gap-4 px-6 py-2 bg-slate-50 rounded-xl text-[9px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100/50">
        <div className="col-span-1">Trans. ID</div>
        <div className="col-span-1">Customer</div>
        <div className="col-span-2">Date & Time</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1 text-right">Amount</div>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {TRANSACTIONS.map((tx) => (
          <div key={tx.id} className="bg-white border border-slate-100 rounded-2xl p-4 md:px-6 md:py-4 flex flex-col md:grid md:grid-cols-6 items-center gap-3 md:gap-4 hover:shadow-md hover:border-blue-100 transition-all group">
            {/* Transaction ID */}
            <div className="w-full md:w-auto flex items-center justify-between md:block col-span-1">
               <span className="md:hidden text-[9px] font-bold text-slate-300 uppercase tracking-widest">ID</span>
               <p className="text-[10px] font-bold text-blue-600 font-mono tracking-tighter uppercase px-2 py-1 bg-blue-50 rounded-lg">{tx.id}</p>
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
                 tx.status === 'Success' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
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
    </div>
  );
};

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
