import React, { useEffect, useState } from 'react';
import { 
  Package, Plus, Trash2, Loader2, AlertCircle,
  Edit2, CheckCircle2, X, DollarSign, Clock as ClockIcon
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
    price: 0,
    duration: 0,
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
    
    // Final Validation on Submit
    const finalPrice = Math.max(1, formData.price);
    const finalDuration = Math.max(1, formData.duration);

    setIsSubmitting(true);
    try {
      const payload = { ...formData, price: finalPrice, duration: finalDuration };
      if (editingService) {
        await api.put(`/vendor/services/${editingService._id}`, payload);
        toast.success('Service updated');
      } else {
        await api.post('/vendor/services', payload);
        toast.success('Service created');
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
    if (!window.confirm('Delete this service package?')) return;
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
    setFormData({ name: '', description: '', price: 0, duration: 0, category: 'Basic Wash' });
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
    <div className="space-y-4 animate-in fade-in duration-500 w-full font-inter">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">Service Packages</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Manage your wash catalog</p>
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
          <p className="text-xs font-bold text-slate-400">Syncing Services...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {services.map((service) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={service._id} 
                className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                    <Package size={20} />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(service)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={12}/></button>
                    <button onClick={() => handleDelete(service._id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={12}/></button>
                  </div>
                </div>

                <div className="mb-3">
                  <h3 className="text-[14px] font-bold text-slate-900 leading-tight mb-1">{service.name}</h3>
                  <span className="text-[8px] font-bold text-blue-600 uppercase tracking-widest px-1.5 py-0.5 bg-blue-50 rounded-md">
                    {service.category}
                  </span>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                   <div className="flex items-center gap-1.5 text-slate-900">
                      <span className="text-[15px] font-bold">₹{service.price}</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-slate-400">
                      <ClockIcon size={10} />
                      <span className="text-[9px] font-bold uppercase tracking-widest">{service.duration} Min</span>
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {services.length === 0 && (
            <div className="col-span-full py-20 text-center bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200">
              <Package size={48} className="mx-auto mb-4 text-slate-200" />
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Catalog is Empty</p>
              <p className="text-[10px] font-medium text-slate-300 mt-1">Start by adding your first service package</p>
            </div>
          )}
        </div>
      )}

      {/* COMPACT MODAL */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingService ? 'Edit Package' : 'Create Package'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Package Name</label>
              <input
                type="text"
                placeholder="e.g. Premium Shine"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-50 rounded-xl text-[12px] font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
              <textarea
                placeholder="Briefly describe the inclusions..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-50 rounded-xl text-[12px] font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all min-h-[60px] resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price === 0 ? '' : formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value === '' ? 0 : parseInt(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-50 rounded-xl text-[12px] font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Duration (Min)</label>
                <input
                  type="number"
                  placeholder="Mins"
                  value={formData.duration === 0 ? '' : formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value === '' ? 0 : parseInt(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-50 rounded-xl text-[12px] font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-50 rounded-xl text-[12px] font-semibold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
              >
                <option value="Basic Wash">Basic Wash</option>
                <option value="Premium Detail">Premium Detail</option>
                <option value="Interior Cleaning">Interior Cleaning</option>
                <option value="Polishing">Polishing</option>
                <option value="Full Service">Full Service</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-700 text-white rounded-[24px] font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95 mt-2"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              editingService ? 'Update Package' : 'Confirm Package'
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
};
