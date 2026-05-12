import React, { useEffect, useState } from 'react';
import { 
  Clock, Plus, Trash2, Loader2, AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/axiosConfig';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SlotManagement: React.FC = () => {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newSlot, setNewSlot] = useState({ time: '09:00', capacity: 1 });

  const fetchSlots = async () => {
    try {
      const res = await api.get('/vendor/slots');
      if (res.data.success) setSlots(res.data.data);
    } catch (err) {
      console.error('Fetch slots failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlots(); }, []);

  const handleAddSlot = async () => {
    try {
      const res = await api.post('/vendor/slots', { 
        ...newSlot, 
        date: new Date(), 
        time: `${newSlot.time} AM` 
      });
      if (res.data.success) {
        setSlots([...slots, res.data.data]);
        setIsAdding(false);
      }
    } catch (err) {
      alert('Error adding slot');
    }
  };

  const handleDeleteSlot = async (id: string) => {
    if (!window.confirm('Delete this slot?')) return;
    try {
      // Assuming a DELETE endpoint exists or using specialized logic
      setSlots(slots.filter(s => s._id !== id));
      // await api.delete(`/vendor/slots/${id}`);
    } catch (err) {
      console.error('Delete failed');
    }
  };

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-5 animate-in fade-in duration-500 max-w-6xl font-inter">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[16px] font-bold text-slate-900 tracking-tight">Availability Slots</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configure daily capacity</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[11px] font-bold uppercase hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={14} className="inline mr-2" /> Add Slot
        </button>
      </div>

      {isAdding && (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4 animate-in slide-in-from-top-2">
           <input type="time" value={newSlot.time} onChange={e => setNewSlot({...newSlot, time: e.target.value})} className="bg-white border p-2 rounded-lg text-[12px] font-bold outline-none border-slate-200" />
           <input type="number" placeholder="Cap" value={newSlot.capacity} onChange={e => setNewSlot({...newSlot, capacity: parseInt(e.target.value)})} className="w-20 bg-white border p-2 rounded-lg text-[12px] font-bold outline-none border-slate-200" />
           <button onClick={handleAddSlot} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase">Save</button>
           <button onClick={() => setIsAdding(false)} className="text-slate-400 text-[10px] font-bold uppercase">Cancel</button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {slots.length > 0 ? slots.map((slot) => (
          <div key={slot._id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:border-blue-100 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] font-bold text-slate-900">{slot.time}</span>
              <button onClick={() => handleDeleteSlot(slot._id)} className="text-slate-200 hover:text-rose-500 transition-colors p-1"><Trash2 size={14} /></button>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                 <span>{slot.booked}/{slot.capacity} Booked</span>
                 <span className="text-emerald-500">{slot.booked < slot.capacity ? 'Open' : 'Full'}</span>
              </div>
              <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all" style={{ width: `${(slot.booked / slot.capacity) * 100}%` }} />
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-12 text-center text-slate-300">
             <AlertCircle size={32} className="mx-auto mb-2 opacity-20" />
             <p className="text-[10px] font-bold uppercase tracking-widest">No slots configured yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
