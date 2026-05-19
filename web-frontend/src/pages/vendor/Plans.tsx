import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Power, PowerOff, Package } from 'lucide-react';
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
    return <div className="p-6 text-center text-slate-500">Loading plans...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Subscription Plans</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your prepaid vehicle service plans</p>
        </div>
        <button
          onClick={() => navigate('/vendor/plans/create')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} />
          Create Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Package size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Plans Found</h3>
          <p className="text-slate-500 mb-6 max-w-sm mx-auto">
            You haven't created any subscription plans yet. Create one to offer prepaid services to your customers.
          </p>
          <button
            onClick={() => navigate('/vendor/plans/create')}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            Create Your First Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan._id} className={`bg-white rounded-2xl border border-slate-100 p-6 shadow-sm transition-all ${!plan.isActive ? 'opacity-75 grayscale-[0.5]' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                  {plan.tenure.value} {plan.tenure.unit}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/vendor/plans/edit/${plan._id}`, { state: { plan } })}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => toggleStatus(plan._id)}
                    className={`p-2 rounded-lg transition-colors ${plan.isActive ? 'text-rose-500 hover:bg-rose-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                    title={plan.isActive ? "Deactivate Plan" : "Activate Plan"}
                  >
                    {plan.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.title}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{plan.description}</p>
              
              <div className="flex items-end gap-2 mb-6">
                <span className="text-3xl font-bold text-slate-900">₹{plan.price}</span>
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">
                  {plan.servicesIncluded} Services Included
                </span>
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${plan.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                  {plan.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
