import React, { useEffect, useState } from 'react';
import { CreditCard, History, Calendar, CheckCircle, Car, QrCode, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
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
  const [selectedQRPlan, setSelectedQRPlan] = useState<Plan | null>(null);

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
    return <div className="p-6 text-center text-slate-500 font-semibold">Loading your plans...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl font-inter relative">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="text-blue-600" size={20} />
            My Subscription Plans
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage your active and past vehicle service plans</p>
        </div>
      </div>

      {plans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
            <CreditCard size={28} />
          </div>
          <h3 className="text-sm font-black text-slate-900 mb-2">No Plans Found</h3>
          <p className="text-slate-500 max-w-sm mx-auto text-xs font-semibold leading-relaxed">
            You don't have any subscription plans yet. Browse vendors to find great prepaid deals!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 max-w-xl">
          {plans.map((plan) => (
            <div key={plan._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col justify-between">
              {/* Plan Details */}
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className={`inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded mb-2.5 ${
                      plan.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                      plan.status === 'Completed' ? 'bg-blue-50 text-blue-600' :
                      plan.status === 'Expired' ? 'bg-rose-50 text-rose-600' :
                      'bg-slate-50 text-slate-600'
                    }`}>
                      {plan.status}
                    </span>
                    <h3 className="text-[14px] font-black text-slate-900 tracking-tight leading-tight">{plan.servicePlan?.title || 'Unknown Plan'}</h3>
                    <p className="text-[11px] font-bold text-slate-400 mt-1">{plan.vendor?.companyName || plan.vendor?.fullName}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2.5 text-xs text-slate-600">
                    <Car size={14} className="text-slate-400" />
                    <span className="font-semibold text-slate-700">
                      {plan.vehicle.make} {plan.vehicle.model} 
                      <span className="text-[10px] font-bold text-blue-600 px-1.5 py-0.5 bg-blue-50 rounded ml-1 tracking-wider">{plan.vehicle.plateNumber}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-600">
                    <Calendar size={14} className="text-slate-400" />
                    <span className="font-medium">Expires: <span className="font-bold text-slate-900">{new Date(plan.expiresAt).toLocaleDateString()}</span></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-600">
                    <CheckCircle size={14} className={plan.remainingServices > 0 ? "text-emerald-500" : "text-slate-400"} />
                    <span className="font-medium text-slate-600">
                      <span className="font-black text-slate-900">{plan.remainingServices}</span> of {plan.totalServices} services remaining
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100">
                  <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                    <History size={12} /> Usage History
                  </h4>
                  {plan.serviceHistory.length === 0 ? (
                    <p className="text-[11px] font-semibold text-slate-400 italic">No services used yet.</p>
                  ) : (
                    <ul className="space-y-1">
                      {plan.serviceHistory.map((history, idx) => (
                        <li key={idx} className="flex justify-between items-center text-[11px] border-b border-slate-100 pb-1.5 last:border-0 last:pb-0">
                          <span className="text-slate-500 font-semibold">{new Date(history.usedAt).toLocaleDateString()}</span>
                          <span className="text-slate-700 font-black">Service Consumed</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-5 pb-5 pt-2 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
                {plan.status === 'Active' ? (
                  <button 
                    onClick={() => setSelectedQRPlan(plan)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-md shadow-blue-100 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <QrCode size={14} /> View QR Code
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block py-2.5">
                    QR Code unavailable ({plan.status.toLowerCase()})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Viewer Modal */}
      {selectedQRPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-6 shadow-2xl border border-slate-100 relative">
            <button 
              onClick={() => setSelectedQRPlan(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-5">
              <span className="bg-blue-50 text-blue-600 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Scan to Redeem</span>
              <h3 className="text-base font-black text-slate-900 mt-2 tracking-tight leading-tight">{selectedQRPlan.servicePlan?.title}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{selectedQRPlan.vendor?.companyName || selectedQRPlan.vendor?.fullName}</p>
            </div>

            <div className="flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl p-5 border border-slate-100 mb-5">
              <div className="bg-white p-3.5 rounded-2xl border-4 border-blue-50 shadow-md">
                <QRCodeSVG 
                  value={JSON.stringify({ token: selectedQRPlan.qrToken })} 
                  size={160}
                  level="H"
                  fgColor="#0f172a"
                  bgColor="#ffffff"
                />
              </div>
              
              <div className="mt-4 space-y-1 text-center">
                <p className="text-xs font-semibold text-slate-800">
                  {selectedQRPlan.vehicle.make} {selectedQRPlan.vehicle.model}
                </p>
                <p className="text-[10px] font-bold text-blue-600 tracking-wider uppercase bg-blue-50 px-2 py-0.5 rounded inline-block">
                  {selectedQRPlan.vehicle.plateNumber}
                </p>
              </div>
            </div>

            <p className="text-[11px] font-medium text-slate-400 text-center leading-relaxed px-2">
              Present this QR code to the technician at the service station to redeem a car wash.
            </p>

            <button 
              onClick={() => setSelectedQRPlan(null)}
              className="w-full mt-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
