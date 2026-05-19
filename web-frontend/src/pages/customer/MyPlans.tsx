import React, { useEffect, useState } from 'react';
import { PlanQRCode } from '../../components/customer/PlanQRCode';
import { CreditCard, History, Calendar, CheckCircle, Car } from 'lucide-react';
import api from '../../services/axiosConfig';

interface Plan {
  _id: string;
  servicePlan: {
    title: string;
    description: string;
  };
  vendor: {
    fullName: string;
    companyName: string;
  };
  vehicle: {
    make: string;
    model: string;
    plateNumber: string;
  };
  totalServices: number;
  remainingServices: number;
  status: string;
  purchasedAt: string;
  expiresAt: string;
  qrToken: string;
  serviceHistory: Array<{
    usedAt: string;
    notes: string;
  }>;
}

export const MyPlans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data } = await api.get('/plans/customer/my-plans');
      setPlans(data.data);
    } catch (error) {
      console.error('Failed to fetch plans', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-slate-500">Loading your plans...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <CreditCard className="text-blue-600" />
          My Subscription Plans
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage your active and past vehicle service plans.</p>
      </div>

      {plans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
            <CreditCard size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Plans Found</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            You don't have any subscription plans yet. Browse vendors to find great prepaid deals!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div key={plan._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
              {/* Plan Details */}
              <div className="p-6 flex-1 border-b md:border-b-0 md:border-r border-slate-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg mb-2 ${
                      plan.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                      plan.status === 'Completed' ? 'bg-blue-50 text-blue-600' :
                      plan.status === 'Expired' ? 'bg-rose-50 text-rose-600' :
                      'bg-slate-50 text-slate-600'
                    }`}>
                      {plan.status}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900">{plan.servicePlan?.title || 'Unknown Plan'}</h3>
                    <p className="text-sm text-slate-500">{plan.vendor?.companyName || plan.vendor?.fullName}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Car size={16} className="text-slate-400" />
                    <span className="font-medium">{plan.vehicle.make} {plan.vehicle.model} ({plan.vehicle.plateNumber})</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Calendar size={16} className="text-slate-400" />
                    <span>Expires: <span className="font-medium text-slate-900">{new Date(plan.expiresAt).toLocaleDateString()}</span></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle size={16} className={plan.remainingServices > 0 ? "text-emerald-500" : "text-slate-400"} />
                    <span>
                      <span className="font-bold text-slate-900">{plan.remainingServices}</span> of {plan.totalServices} services remaining
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <History size={14} /> Usage History
                  </h4>
                  {plan.serviceHistory.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">No services used yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {plan.serviceHistory.map((history, idx) => (
                        <li key={idx} className="flex justify-between items-center text-sm border-b border-slate-200 pb-2 last:border-0 last:pb-0">
                          <span className="text-slate-600">{new Date(history.usedAt).toLocaleDateString()}</span>
                          <span className="text-slate-900 font-medium">Service Consumed</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* QR Code Section */}
              <div className="p-6 md:w-64 flex flex-col items-center justify-center bg-slate-50">
                {plan.status === 'Active' ? (
                  <PlanQRCode token={plan.qrToken} />
                ) : (
                  <div className="text-center p-4">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CreditCard size={24} className="text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-900">QR Code Unavailable</p>
                    <p className="text-xs text-slate-500 mt-1">
                      This plan is {plan.status.toLowerCase()}.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
