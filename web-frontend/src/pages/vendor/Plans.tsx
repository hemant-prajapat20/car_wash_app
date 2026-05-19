import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Power, PowerOff, Package, CreditCard } from 'lucide-react';
import api from '../../services/axiosConfig';

interface Plan {
  _id: string;
  title: string;
  description: string;
  price: number;
  servicesIncluded: number;
  tenure: {
    value: number;
    unit: string;
  };
  isActive: boolean;
  createdAt: string;
}

export const Plans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data } = await api.get('/plans/vendor');
      setPlans(data.data);
    } catch (error) {
      console.error('Failed to fetch plans', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      await api.patch(`/plans/vendor/${id}/toggle`);
      fetchPlans();
    } catch (error) {
      console.error('Failed to toggle status', error);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-slate-500 font-semibold font-inter">Loading plans...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl font-inter">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="text-blue-600" size={20} />
            Subscription Plans
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage prepaid vehicle packages for customers</p>
        </div>
        <button
          onClick={() => navigate('/vendor/plans/create')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-blue-100 active:scale-95"
        >
          <Plus size={14} /> Create Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Package size={28} />
          </div>
          <h3 className="text-sm font-black text-slate-900 mb-2">No Plans Found</h3>
          <p className="text-slate-500 mb-6 max-w-xs mx-auto text-xs font-semibold leading-relaxed">
            You haven't created any subscription plans yet. Create one to offer prepaid services to your customers.
          </p>
          <button
            onClick={() => navigate('/vendor/plans/create')}
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors"
          >
            Create Your First Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <div 
              key={plan._id} 
              className={`bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-all flex flex-col justify-between hover:shadow-md ${
                !plan.isActive ? 'opacity-70 grayscale-[0.3]' : ''
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                    {plan.tenure.value} {plan.tenure.unit}
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => navigate(`/vendor/plans/edit/${plan._id}`, { state: { plan } })}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => toggleStatus(plan._id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        plan.isActive ? 'text-rose-500 hover:bg-rose-50' : 'text-emerald-500 hover:bg-emerald-50'
                      }`}
                      title={plan.isActive ? "Deactivate Plan" : "Activate Plan"}
                    >
                      {plan.isActive ? <PowerOff size={13} /> : <Power size={13} />}
                    </button>
                  </div>
                </div>
                
                <h3 className="text-[14px] font-black text-slate-900 tracking-tight leading-tight mb-1.5">{plan.title}</h3>
                <p className="text-[11px] font-semibold text-slate-400 leading-relaxed mb-4 line-clamp-2">{plan.description}</p>
              </div>
              
              <div className="pt-4 border-t border-slate-50 flex justify-between items-center bg-slate-50/20 -mx-5 -mb-5 px-5 pb-5 rounded-b-2xl">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Price</span>
                  <span className="text-[16px] font-black text-slate-900 leading-none">₹{plan.price}</span>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider inline-block ${
                    plan.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-600 block mt-1">
                    {plan.servicesIncluded} Services Included
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
