import React from 'react';
import { ArrowRight, LayoutDashboard, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="home" className="pt-24 pb-12 px-6 lg:px-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full mb-4">
            <Zap size={12} className="text-blue-600 fill-blue-600" />
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Next-Gen SaaS Platform</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-semibold text-slate-900 leading-[1.1] mb-5 tracking-tight">
            Scale Your Car Wash <br className="hidden lg:block" />
            <span className="text-blue-600">Operations Automatically.</span>
          </h1>
          
          <p className="text-md lg:text-lg font-medium text-slate-500 mb-8 max-w-xl leading-relaxed">
            The intelligent operating system for modern car wash businesses. Manage bookings, staff, and revenue growth in one centralized dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
            <button 
              onClick={() => navigate('/signup')}
              className="px-6 py-3.5 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 group text-sm"
            >
              Get Started Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-6 py-3.5 bg-slate-50 text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-all border border-slate-200 text-sm"
            >
              Access Portal
            </button>
          </div>

          <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 opacity-50">
             <div className="flex items-center gap-2">
               <ShieldCheck size={18} />
               <span className="font-bold text-xs uppercase tracking-wider">ISO Certified</span>
             </div>
             <div className="flex items-center gap-2">
               <LayoutDashboard size={18} />
               <span className="font-bold text-xs uppercase tracking-wider">99% Uptime</span>
             </div>
          </div>
        </div>

        <div className="flex-1 relative w-full">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px]" />
          
          <div className="relative max-w-sm mx-auto lg:ml-auto overflow-hidden">
            <img 
              src="/car_wash_saas_mockup_1778486441671.png" 
              alt="Chakachak Dashboard Mockup" 
              className="w-full h-auto object-cover rounded-2xl shadow-2xl shadow-slate-200/50"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
