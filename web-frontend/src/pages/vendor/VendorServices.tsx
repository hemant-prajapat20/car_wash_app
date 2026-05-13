import React, { useEffect, useState } from 'react';
import { 
  Plus, Package, Clock, Tag, 
  MoreVertical, Edit2, Trash2, Loader2, Save, X,
  Layers, CheckCircle2, DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/axiosConfig';
import toast from 'react-hot-toast';
import { Modal } from '../../components/shared/Modal';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  isActive: boolean;
}

export const VendorServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 1,
    duration: 30,
    category: 'Basic Wash'
  });

  const fetchServices = async () => {
    try {
      const res = await api.get('/vendor/services');
      if (res.data.success) setServices(res.data.data);
    } catch (err) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: No negative numbers
    if (formData.price < 1 || formData.duration < 1) {
      return toast.error('Price and Duration must be greater than 0');
    }

    setIsSubmitting(true);
    try {
      if (editingService) {
        await api.put(`/vendor/services/${editingService._id}`, formData);
        toast.success('Service updated successfully');
      } else {
        await api.post('/vendor/services', formData);
        toast.success('Service added successfully');
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this service?')) return;
    try {
      await api.delete(`/vendor/services/${id}`);
      toast.success('Service removed');
      fetchServices();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const openAddModal = () => {
    setEditingService(null);
    setFormData({ name: '', description: '', price: 1, duration: 30, category: 'Basic Wash' });
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full font-inter">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">Service Catalog</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Manage your packages & pricing</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-slate-900 text-white flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 group active:scale-95"
        >
           <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
           <span className="text-[11px] font-bold uppercase tracking-widest">Add Package</span>
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <p className="text-xs font-bold text-slate-400 animate-pulse">Syncing Catalog Data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {services.map((pkg) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={pkg._id} 
                className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                    <Package size={24} />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(pkg)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={14}/></button>
                    <button onClick={() => handleDelete(pkg._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={14}/></button>
                  </div>
                </div>

                <div className="relative z-10">
                  <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest px-2 py-1 bg-blue-50 rounded-lg mb-2 inline-block">
                    {pkg.category}
                  </span>
                  <h3 className="text-[15px] font-bold text-slate-900 leading-tight mb-2">{pkg.name}</h3>
                  <p className="text-[11px] font-medium text-slate-500 line-clamp-2 min-h-[32px]">{pkg.description}</p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={14} className="text-slate-300" />
                    <span className="text-[12px] font-bold">{pkg.duration} mins</span>
                  </div>
                  <span className="text-[18px] font-bold text-slate-900">${pkg.price}</span>
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
        title={editingService ? 'Edit Service Package' : 'Create New Service Package'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Package Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Premium Exterior Polish"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-50 rounded-2xl text-[12px] font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Service Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Briefly describe the inclusions..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-50 rounded-2xl text-[12px] font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300 resize-none h-24"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Price ($)</label>
              <input
                type="number"
                min="1"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Math.max(1, parseInt(e.target.value) || 0)})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-50 rounded-2xl text-[12px] font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Duration (min)</label>
              <input
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: Math.max(1, parseInt(e.target.value) || 0)})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-50 rounded-2xl text-[12px] font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-50 rounded-2xl text-[12px] font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
            >
              <option value="Basic Wash">Basic Wash</option>
              <option value="Premium Detail">Premium Detail</option>
              <option value="Interior Cleaning">Interior Cleaning</option>
              <option value="Polishing">Polishing</option>
              <option value="Full Service">Full Service</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-700 text-white rounded-[24px] font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95 mt-4"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              editingService ? 'Update Service' : 'Confirm Package'
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
};
