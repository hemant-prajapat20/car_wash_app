import React from 'react';
import { 
  Receipt, Download, CheckCircle2, 
  ArrowUpRight, ArrowDownLeft 
} from 'lucide-react';

const TRANSACTIONS = [
  { id: 'TX-4401', cust: 'John Doe', amt: '+$85', date: 'May 12', status: 'Success' },
  { id: 'TX-4400', cust: 'Sarah Smith', amt: '+$35', date: 'May 11', status: 'Success' },
  { id: 'TX-4399', cust: 'Mike Ross', amt: '-$15', date: 'May 10', status: 'Refund' },
  { id: 'TX-4398', cust: 'Harvey Specter', amt: '+$120', date: 'May 09', status: 'Success' },
];

export const VendorTransactions: React.FC = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-4xl font-inter">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[15px] font-bold text-slate-900 tracking-tight">Finances</h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Payment logs</p>
        </div>
        <button className="bg-slate-900 text-white p-2 rounded-lg hover:bg-blue-600 transition-all shadow-lg shadow-slate-100">
           <Download size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {TRANSACTIONS.map((tx) => (
          <div key={tx.id} className="bg-white border border-slate-100 rounded-xl p-3 flex items-center justify-between hover:bg-slate-50 transition-all group">
            <div className="flex items-center gap-3 min-w-0">
               <div className={cn(
                 "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                 tx.status === 'Success' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
               )}>
                 {tx.amt.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
               </div>
               <div className="min-w-0">
                 <p className="text-[12px] font-bold text-slate-900 truncate">{tx.cust}</p>
                 <p className="text-[9px] font-bold text-blue-600 font-mono tracking-tighter uppercase">{tx.id} • {tx.date}</p>
               </div>
            </div>
            <div className="text-right shrink-0 ml-4">
               <p className={cn(
                 "text-[13px] font-bold",
                 tx.amt.startsWith('+') ? "text-emerald-600" : "text-rose-600"
               )}>{tx.amt}</p>
               <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{tx.status}</span>
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
