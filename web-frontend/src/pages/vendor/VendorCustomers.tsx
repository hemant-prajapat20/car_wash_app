import React from 'react';
import { 
  Users, Search, Filter, 
  MoreVertical, Star, ChevronRight 
} from 'lucide-react';

const CUSTOMERS = [
  { id: 'C1', name: 'John Jonathan Doe Senior', email: 'john@example.com', bookings: 12, rating: 4.8 },
  { id: 'C2', name: 'Sarah Smith', email: 'sarah@test.com', bookings: 5, rating: 5.0 },
  { id: 'C3', name: 'Mike Ross', email: 'mike.r@legal.com', bookings: 24, rating: 4.2 },
  { id: 'C4', name: 'Rachel Zane', email: 'rachel@zane.com', bookings: 8, rating: 4.9 },
];

export const VendorCustomers: React.FC = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-6xl font-inter">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[15px] font-bold text-slate-900 tracking-tight">Client Directory</h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Management of your customers</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative group hidden sm:block">
             <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
             <input type="text" placeholder="Search..." className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] outline-none w-32 focus:w-48 transition-all" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CUSTOMERS.map((cust) => (
          <div key={cust.id} className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group flex flex-col justify-between h-36">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                  <Users size={16} />
                </div>
                <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={14} /></button>
              </div>
              <h3 className="text-[12px] font-bold text-slate-900 truncate leading-tight mb-0.5">{cust.name}</h3>
              <p className="text-[9px] font-medium text-slate-400 truncate tracking-tight">{cust.email}</p>
            </div>

            <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
               <div className="min-w-0">
                 <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Bookings</p>
                 <p className="text-[11px] font-bold text-slate-700">{cust.bookings}</p>
               </div>
               <div className="flex items-center gap-1 bg-amber-50 px-1 rounded h-fit">
                 <Star size={8} className="fill-amber-400 text-amber-400" />
                 <span className="text-[9px] font-bold text-amber-700">{cust.rating}</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
