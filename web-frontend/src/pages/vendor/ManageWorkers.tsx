import React from 'react';
import { 
  Users2, Star, Plus, MoreVertical, 
  Mail, Phone, Clock 
} from 'lucide-react';
import { motion } from 'framer-motion';

const WORKERS = [
  { id: 'W1', name: 'Robert Fox', role: 'Lead Tech', rating: 4.9, status: 'On Duty' },
  { id: 'W2', name: 'Jane Cooper', role: 'Detailer', rating: 4.8, status: 'Break' },
  { id: 'W3', name: 'Cody Fisher Specialist Tech', role: 'Asst', rating: 4.5, status: 'Off' },
];

export const ManageWorkers: React.FC = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-5xl font-inter">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[15px] font-bold text-slate-900 tracking-tight">Staff Management</h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Personnel directory</p>
        </div>
        <button className="bg-slate-900 text-white p-2 rounded-lg hover:bg-blue-600 transition-all shadow-lg shadow-slate-100">
           <Plus size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {WORKERS.map((worker, i) => (
          <div key={worker.id} className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                <Users2 size={16} />
              </div>
              <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={14} /></button>
            </div>

            <div className="min-w-0">
              <h3 className="text-[12px] font-bold text-slate-900 truncate leading-tight">{worker.name}</h3>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">{worker.role}</p>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
               <div className="flex items-center gap-1 bg-amber-50 px-1 rounded">
                 <Star size={8} className="fill-amber-400 text-amber-400" />
                 <span className="text-[10px] font-bold text-amber-700">{worker.rating}</span>
               </div>
               <span className={`text-[8px] font-bold uppercase tracking-widest ${
                 worker.status === 'On Duty' ? 'text-emerald-600' : 'text-slate-400'
               }`}>
                 {worker.status}
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
