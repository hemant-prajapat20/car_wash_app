import React, { useState } from 'react';
import { 
  Car, Package, Clock, ShieldCheck, 
  ChevronRight, ArrowLeft, CheckCircle2, 
  CreditCard, Tag, Waves
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STEPS = ['Vehicle', 'Service', 'Time Slot', 'Confirmation'];

export const BookService: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    vehicle: null,
    package: null,
    slot: null,
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const StepIndicator = () => (
    <div className="flex items-center justify-between max-w-2xl mx-auto mb-10 px-4">
      {STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center gap-2 group">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-all border-2",
              currentStep > i + 1 ? "bg-emerald-500 border-emerald-500 text-white" :
              currentStep === i + 1 ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-110" :
              "bg-white border-slate-200 text-slate-400"
            )}>
              {currentStep > i + 1 ? <CheckCircle2 size={16} /> : i + 1}
            </div>
            <span className={cn(
              "text-[9px] font-bold uppercase tracking-widest transition-colors",
              currentStep === i + 1 ? "text-blue-600" : "text-slate-400"
            )}>
              {step}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={cn(
              "h-px flex-1 mx-2 transition-colors",
              currentStep > i + 1 ? "bg-emerald-500" : "bg-slate-200"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const StepContent = () => {
    switch (currentStep) {
      case 1: // Vehicle Selection
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[14px] font-semibold text-slate-900">Select Your Vehicle</h3>
              <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">+ Add New</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Tesla Model 3', 'BMW X5'].map((v) => (
                <div 
                  key={v} 
                  onClick={() => setBookingData({...bookingData, vehicle: v})}
                  className={cn(
                    "p-4 border rounded-2xl cursor-pointer transition-all flex items-center gap-4 group",
                    bookingData.vehicle === v ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/5" : "border-slate-100 bg-white hover:border-blue-200"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    bookingData.vehicle === v ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-400 group-hover:text-blue-600"
                  )}>
                    <Car size={20} />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-900">{v}</p>
                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">ABC-1234</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 2: // Package Selection
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="text-[14px] font-semibold text-slate-900 mb-2">Choose Service Package</h3>
            <div className="space-y-3">
              {[
                { name: 'Express Wash', price: '$25', time: '30m', desc: 'Exterior wash & dry' },
                { name: 'Premium Detail', price: '$85', time: '2h', desc: 'Full deep clean & wax' }
              ].map((p) => (
                <div 
                  key={p.name}
                  onClick={() => setBookingData({...bookingData, package: p})}
                  className={cn(
                    "p-4 border rounded-2xl cursor-pointer transition-all flex items-center justify-between group",
                    bookingData.package?.name === p.name ? "border-blue-600 bg-blue-50/50" : "border-slate-100 bg-white hover:border-blue-200"
                  )}
                >
                  <div className="flex gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      bookingData.package?.name === p.name ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-400"
                    )}>
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-slate-900">{p.name}</p>
                      <p className="text-[10px] font-medium text-slate-500">{p.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-bold text-slate-900">{p.price}</p>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{p.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 3: // Time Slot
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="text-[14px] font-semibold text-slate-900 mb-2">Select Availability</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'].map(t => (
                <button
                  key={t}
                  onClick={() => setBookingData({...bookingData, slot: t})}
                  className={cn(
                    "py-3 rounded-xl text-[12px] font-bold transition-all border",
                    bookingData.slot === t ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-100 text-slate-600 hover:border-blue-200"
                  )}
                >
                  {t} AM
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 4: // Confirmation
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -ml-16 -mt-16" />
               <div className="relative z-10">
                 <CheckCircle2 size={40} className="text-emerald-400 mx-auto mb-4" />
                 <h3 className="text-lg font-semibold mb-1">Booking Confirmed!</h3>
                 <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Booking ID: CHK-77421</p>
               </div>
            </div>
            
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 space-y-4 shadow-sm">
              <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Service Date</span>
                <span className="text-[13px] font-semibold text-slate-900">May 14, 2026</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Time Slot</span>
                <span className="text-[13px] font-semibold text-slate-900">{bookingData.slot} AM</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Paid</span>
                <span className="text-[18px] font-bold text-blue-600">$85.00</span>
              </div>
            </div>
            
            <button 
              onClick={() => setCurrentStep(1)}
              className="w-full py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-600 uppercase tracking-[0.1em] hover:bg-slate-100 transition-all"
            >
              Back to Dashboard
            </button>
          </motion.div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-lg font-semibold text-slate-900 tracking-tight text-center">Service Booking</h1>
        <p className="text-[11px] font-medium text-slate-500 mt-1 uppercase tracking-wider text-center">Follow the simple steps to confirm your wash</p>
      </div>

      <StepIndicator />

      <div className="bg-white/50 backdrop-blur-sm border border-slate-100 rounded-[2.5rem] p-6 sm:p-8 shadow-sm min-h-[400px] flex flex-col">
        <div className="flex-1">
          <StepContent />
        </div>

        {currentStep < 4 && (
          <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
            <button 
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-4 py-2 text-slate-400 font-bold text-[11px] uppercase tracking-widest hover:text-slate-900 transition-colors disabled:opacity-0"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button 
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 active:scale-95"
            >
              {currentStep === 3 ? 'Pay & Confirm' : 'Continue'}
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
