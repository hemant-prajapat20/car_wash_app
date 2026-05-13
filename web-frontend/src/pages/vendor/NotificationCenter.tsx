import React from 'react';
import { 
  Bell, Inbox, AlertCircle, 
  Trash2, CreditCard 
} from 'lucide-react';

const NOTIFICATIONS = [
  { id: '1', title: 'New Booking Request', message: 'John Doe booked Premium Wash at 10:30 AM tomorrow.', time: '5m', type: 'booking', read: false },
  { id: '2', title: 'Payout Confirmed', message: 'Your payout of $1,250.00 is being processed.', time: '1h', type: 'payment', read: false },
  { id: '3', title: 'Urgent Alert', message: 'Slot availability is low for the weekend.', time: '3h', type: 'alert', read: true },
];

export const NotificationCenter: React.FC = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500 w-full font-inter">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[15px] font-bold text-slate-900 tracking-tight">Activity Alerts</h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Stay updated</p>
        </div>
        <button className="text-[9px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Clear All</button>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {NOTIFICATIONS.map((notif) => (
          <div key={notif.id} className={`p-3 border rounded-xl flex items-center gap-3 group transition-all cursor-pointer ${
            notif.read ? 'bg-white border-slate-100' : 'bg-blue-50/20 border-blue-100'
          }`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              notif.type === 'booking' ? 'bg-blue-100 text-blue-600' :
              notif.type === 'payment' ? 'bg-emerald-100 text-emerald-600' :
              'bg-rose-100 text-rose-600'
            }`}>
               {notif.type === 'booking' ? <Inbox size={14} /> :
                notif.type === 'payment' ? <CreditCard size={14} /> :
                <AlertCircle size={14} />}
            </div>

            <div className="flex-1 min-w-0">
               <div className="flex items-center justify-between mb-0.5">
                 <h4 className="text-[11.5px] font-bold text-slate-900 truncate">{notif.title}</h4>
                 <span className="text-[9px] font-medium text-slate-400">{notif.time} ago</span>
               </div>
               <p className="text-[10px] text-slate-500 truncate pr-4">{notif.message}</p>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="p-1 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
