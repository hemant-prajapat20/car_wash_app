import React from 'react';
import { 
  Plus, Package, Clock, Tag, 
  MoreVertical, Edit2, Trash2 
} from 'lucide-react';

const packages = [
  { id: '1', name: 'Express Exterior Wash', price: '$25', duration: '30m', discount: '5% Off', status: 'Active' },
  { id: '2', name: 'Premium Full Detailing', price: '$85', duration: '2h', discount: '10% Off', status: 'Active' },
  { id: '3', name: 'Interior Deep Clean', price: '$55', duration: '1h', discount: 'None', status: 'Active' },
  { id: '4', name: 'Nano Ceramic Coating', price: '$250', duration: '5h', discount: '15% Off', status: 'Inactive' },
];

export const VendorServices: React.FC = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-6xl font-inter">
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-[15px] font-bold text-slate-900 tracking-tight">Service Catalog</h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Packages & pricing</p>
        </div>
        <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
           <Plus size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group flex flex-col justify-between min-h-[140px]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                  <Package size={16} />
                </div>
                <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={14} /></button>
              </div>
              <h3 className="text-[12px] font-bold text-slate-900 truncate leading-tight pr-1">{pkg.name}</h3>
              <span className={`text-[8px] font-bold uppercase tracking-tight px-1.5 py-0.5 rounded-full inline-block mt-1 ${
                pkg.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
              }`}>
                {pkg.status}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-50 space-y-1.5">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock size={10} />
                    <span className="text-[10px] font-medium">{pkg.duration}</span>
                  </div>
                  <span className="text-[13px] font-bold text-slate-900">{pkg.price}</span>
               </div>
               {pkg.discount !== 'None' && (
                 <div className="flex items-center gap-1 text-blue-600">
                    <Tag size={9} />
                    <span className="text-[9px] font-bold uppercase tracking-tighter">{pkg.discount}</span>
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
