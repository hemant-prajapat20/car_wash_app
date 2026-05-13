import React, { useState, useEffect } from 'react';
import { 
  Users2, Star, Plus, MoreVertical, 
  Mail, Phone, Clock, Loader2,
  UserPlus, Edit2, Trash2, ShieldCheck,
  UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/axiosConfig';
import toast from 'react-hot-toast';
import { Modal } from '../../components/shared/Modal';

interface Worker {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

export const ManageWorkers: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Washer',
    status: 'Active'
  });

  const fetchWorkers = async () => {
    try {
      const res = await api.get('/vendor/workers');
      if (res.data.success) setWorkers(res.data.data);
    } catch (err) {
      toast.error('Failed to load workers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: Only numbers for phone, min length
    if (!/^\d{10}$/.test(formData.phone)) {
      return toast.error('Phone must be exactly 10 digits');
    }

    setIsSubmitting(true);
    try {
      if (editingWorker) {
        const res = await api.put(`/vendor/workers/${editingWorker._id}`, formData);
        if (res.data.success) {
          toast.success('Worker updated successfully');
          setIsModalOpen(false);
          fetchWorkers();
        }
      } else {
        const res = await api.post('/vendor/workers', formData);
        if (res.data.success) {
          toast.success('Worker added successfully');
          setIsModalOpen(false);
          fetchWorkers();
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this worker?')) return;
    try {
      const res = await api.delete(`/vendor/workers/${id}`);
      if (res.data.success) {
        toast.success('Worker removed');
        fetchWorkers();
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const openAddModal = () => {
    setEditingWorker(null);
    setFormData({ name: '', email: '', phone: '', role: 'Washer', status: 'Active' });
    setIsModalOpen(true);
  };

  const openEditModal = (worker: Worker) => {
    setEditingWorker(worker);
    setFormData({
      name: worker.name,
      email: worker.email,
      phone: worker.phone,
      role: worker.role,
      status: worker.status
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full font-inter">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">Staff Management</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Personnel & Team directory</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-slate-900 text-white flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 group active:scale-95"
        >
           <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
           <span className="text-[11px] font-bold uppercase tracking-widest">Add Worker</span>
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <p className="text-xs font-bold text-slate-400 animate-pulse">Syncing Personnel Data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {workers.map((worker) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={worker._id} 
                className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                    <UserCircle size={24} />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openEditModal(worker)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(worker._id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="min-w-0">
                  <h3 className="text-[14px] font-bold text-slate-900 truncate leading-none mb-1.5">{worker.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{worker.role}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${
                      worker.status === 'Active' ? 'text-emerald-500' : 'text-slate-400'
                    }`}>{worker.status}</span>
                  </div>
                </div>

                <div className="mt-5 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-slate-500">
                    <Mail size={12} className="text-slate-300" />
                    <span className="text-[10px] font-semibold truncate">{worker.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-500">
                    <Phone size={12} className="text-slate-300" />
                    <span className="text-[10px] font-semibold">{worker.phone}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingWorker ? 'Edit Personnel Details' : 'Add New Team Member'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Identity Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-50 rounded-2xl text-[12px] font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="staff@chakachak.com"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-50 rounded-2xl text-[12px] font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
              <input
                type="tel"
                maxLength={10}
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                placeholder="10 digit number"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-50 rounded-2xl text-[12px] font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Operational Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-50 rounded-2xl text-[12px] font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
              >
                <option value="Washer">Washer</option>
                <option value="Detailer">Detailer</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Specialist">Specialist</option>
              </select>
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
              editingWorker ? 'Update Personnel' : 'Initialize Member'
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
};
