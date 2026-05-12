import React, { useEffect, useState } from 'react';
import { 
  Plus, Package, Clock, Tag, 
  MoreVertical, Edit2, Trash2, Loader2, Save, X
} from 'lucide-react';
import api from '../../services/axiosConfig';

export const VendorServices: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const fetchServices = async () => {
    try {
      const res = await api.get('/vendor/profile'); // Services are stored in Vendor User object
      if (res.data.success) {
        setServices(res.data.data.services || []);
      }
    } catch (err) {
      console.error('Fetch services failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleUpdateServices = async (updatedList: any[]) => {
    try {
      const res = await api.put('/vendor/profile', { services: updatedList });
      if (res.data.success) {
        setServices(updatedList);
        setIsEditing(null);
      }
    } catch (err) {
      alert('Failed to update services');
    }
  };

  const deleteService = (name: string) => {
    const updated = services.filter(s => s.name !== name);
    handleUpdateServices(updated);
  };

  if (loading) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-6xl font-inter">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[15px] font-bold text-slate-900 tracking-tight">Service Catalog</h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Manage your packages & pricing</p>
        </div>
        <button 
          onClick={() => {
            const newS = { name: 'New Service', price: 0, duration: '1h', description: '' };
            setServices([...services, newS]);
            setIsEditing('New Service');
            setEditForm(newS);
          }}
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all shadow-lg"
        >
           <Plus size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {services.map((pkg, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between min-h-[150px]">
            {isEditing === pkg.name ? (
              <div className="space-y-2">
                <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full text-[11px] font-bold border rounded p-1 outline-none focus:border-blue-600" />
                <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className="w-full text-[11px] border rounded p-1 outline-none" />
                <div className="flex gap-1">
                  <button onClick={() => {
                    const newList = [...services];
                    newList[i] = editForm;
                    handleUpdateServices(newList);
                  }} className="bg-blue-600 text-white p-1 rounded flex-1 flex justify-center"><Save size={12}/></button>
                  <button onClick={() => setIsEditing(null)} className="bg-slate-100 text-slate-400 p-1 rounded"><X size={12}/></button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                      <Package size={16} />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setIsEditing(pkg.name); setEditForm(pkg); }} className="text-slate-300 hover:text-blue-600"><Edit2 size={12}/></button>
                      <button onClick={() => deleteService(pkg.name)} className="text-slate-300 hover:text-rose-500"><Trash2 size={12}/></button>
                    </div>
                  </div>
                  <h3 className="text-[12px] font-bold text-slate-900 truncate pr-1">{pkg.name}</h3>
                  <p className="text-[9px] font-medium text-slate-400 mt-0.5 truncate">{pkg.description || 'Professional wash'}</p>
                </div>

                <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock size={10} />
                    <span className="text-[10px] font-medium">{pkg.duration}</span>
                  </div>
                  <span className="text-[13px] font-bold text-slate-900">${pkg.price}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
