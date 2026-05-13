import React, { useEffect, useState } from 'react';
import { 
  Clock, Plus, Trash2, Loader2, AlertCircle,
  Edit2, Calendar, CheckCircle2, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/axiosConfig';
import toast from 'react-hot-toast';
import { Modal } from '../../components/shared/Modal';

interface Slot {
  _id: string;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  maxBookings: number;
  currentBookings: number;
  isAvailable: boolean;
}

export const SlotManagement: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);

  const [formData, setFormData] = useState({
    startTime: '09:00',
    endTime: '10:00',
    dayOfWeek: 'All',
    maxBookings: 1
  });

  const fetchSlots = async () => {
    try {
      const res = await api.get('/vendor/slots');
      if (res.data.success) setSlots(res.data.data);
    } catch (err) {
      toast.error('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlots(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.maxBookings < 1) {
      return toast.error('Max bookings must be at least 1');
    }

    setIsSubmitting(true);
    try {
      if (editingSlot) {
        await api.put(`/vendor/slots/${editingSlot._id}`, formData);
        toast.success('Slot updated successfully');
      } else {
        await api.post('/vendor/slots', formData);
        toast.success('Slot added successfully');
      }
      setIsModalOpen(false);
      fetchSlots();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this availability slot?')) return;
    try {
      await api.delete(`/vendor/slots/${id}`);
      toast.success('Slot removed');
      fetchSlots();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const openAddModal = () => {
    setEditingSlot(null);
    setFormData({ startTime: '09:00', endTime: '10:00', dayOfWeek: 'All', maxBookings: 1 });
    setIsModalOpen(true);
  };

  const openEditModal = (slot: Slot) => {
    setEditingSlot(slot);
    setFormData({
      startTime: slot.startTime,
      endTime: slot.endTime,
      dayOfWeek: slot.dayOfWeek,
      maxBookings: slot.maxBookings
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full font-inter">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">Availability Slots</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Configure daily operational capacity</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-slate-900 text-white flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 group active:scale-95"
        >
           <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
           <span className="text-[11px] font-bold uppercase tracking-widest">Add Slot</span>
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <p className="text-xs font-bold text-slate-400 animate-pulse">Syncing Availability...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {slots.map((slot) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={slot._id} 
                className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                    <Clock size={24} />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(slot)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={14}/></button>
                    <button onClick={() => handleDelete(slot._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={14}/></button>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-[16px] font-bold text-slate-900 leading-none mb-2">{slot.startTime} - {slot.endTime}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest px-2 py-1 bg-blue-50 rounded-lg">
                      {slot.dayOfWeek}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <span>Capacity Utilization</span>
                     <span className={slot.currentBookings < slot.maxBookings ? 'text-emerald-500' : 'text-rose-500'}>
                        {slot.currentBookings}/{slot.maxBookings} Filled
                     </span>
                  </div>
                  <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(slot.currentBookings / slot.maxBookings) * 100}%` }}
                      className="h-full bg-blue-600 transition-all" 
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {slots.length === 0 && (
            <div className="col-span-full py-20 text-center bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200">
              <Calendar size={48} className="mx-auto mb-4 text-slate-200" />
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">No Operational Slots Configured</p>
              <p className="text-[10px] font-medium text-slate-300 mt-1">Click the + icon to initialize your first booking window</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingSlot ? 'Edit Availability Slot' : 'Create New Booking Window'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-50 rounded-2xl text-[12px] font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-50 rounded-2xl text-[12px] font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Active Days</label>
              <select
                value={formData.dayOfWeek}
                onChange={(e) => setFormData({...formData, dayOfWeek: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-50 rounded-2xl text-[12px] font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
              >
                <option value="All">All Days</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Max Bookings</label>
              <input
                type="number"
                min="1"
                value={formData.maxBookings}
                onChange={(e) => setFormData({...formData, maxBookings: Math.max(1, parseInt(e.target.value) || 0)})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-50 rounded-2xl text-[12px] font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-700 text-white rounded-[24px] font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95 mt-4"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              editingSlot ? 'Update Window' : 'Initialize Slot'
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
};
