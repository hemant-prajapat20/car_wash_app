import React from 'react';
import { 
  Clock, Plus, Trash2 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SLOTS = [
  { id: '1', time: '09:00 AM', capacity: 3, booked: 3, status: 'Full' },
  { id: '2', time: '10:00 AM', capacity: 3, booked: 1, status: 'Available' },
  { id: '3', time: '11:00 AM', capacity: 2, booked: 0, status: 'Available' },
  { id: '4', time: '12:00 PM', capacity: 2, booked: 2, status: 'Full' },
  { id: '5', time: '02:00 PM', capacity: 3, booked: 1, status: 'Available' },
  { id: '6', time: '03:00 PM', capacity: 3, booked: 0, status: 'Available' },
  { id: '7', time: '04:00 PM', capacity: 3, booked: 0, status: 'Available' },
  { id: '8', time: '05:00 PM', capacity: 3, booked: 0, status: 'Available' },
];

export const SlotManagement: React.FC = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-5xl font-inter">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[15px] font-bold text-slate-900 tracking-tight">Daily Slots</h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Availability configuration</p>
        </div>
        <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
           <Plus size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
        {SLOTS.map((slot) => (
          <div key={slot.id} className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm hover:border-blue-100 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-900">{slot.time}</span>
              <button className="text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={12} /></button>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tight">Cap: {slot.booked}/{slot.capacity}</span>
                <span className={cn(
                  "text-[8px] font-bold uppercase px-1 rounded",
                  slot.status === 'Full' ? "text-rose-500 bg-rose-50" : "text-emerald-500 bg-emerald-50"
                )}>{slot.status}</span>
              </div>
              <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-500", slot.status === 'Full' ? "bg-rose-500" : "bg-emerald-500")}
                  style={{ width: `${(slot.booked / slot.capacity) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
