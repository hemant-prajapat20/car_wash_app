import React, { useState, useEffect } from 'react';
import { 
  Car, Package, Clock, ShieldCheck, 
  ChevronRight, ArrowLeft, CheckCircle2, 
  Loader2, Waves
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/axiosConfig';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STEPS = ['Vehicle', 'Service', 'Time Slot', 'Confirmation'];

interface BookingData {
  vehicle: any;
  service: any;
  slot: any;
}

export const BookService: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const vendorId = searchParams.get('vendor');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [vendorData, setVendorData] = useState<any>(null);
  const [bookingData, setBookingData] = useState<BookingData>({
    vehicle: null,
    service: null,
    slot: null,
  });

  useEffect(() => {
    // Fetch vendor details (services, etc.)
    const fetchVendor = async () => {
      try {
        const res = await api.get(`/customer/search`); // In a real app, use getVendorById
        const vendor = res.data.data.find((v: any) => v._id === vendorId);
        setVendorData(vendor);
      } catch (err) {
        console.error('Failed to fetch vendor', err);
      }
    };
    if (vendorId) fetchVendor();
  }, [vendorId]);

  const handleFinalBooking = async () => {
    setLoading(true);
    try {
      const payload = {
        vendorId,
        vehicle: bookingData.vehicle,
        service: bookingData.service,
        slot: {
          date: new Date(), // Simplified for demo
          time: bookingData.slot
        }
      };
      const response = await api.post('/customer/bookings', payload);
      if (response.data.success) {
        setCurrentStep(4);
      }
    } catch (err) {
      console.error('Booking failed', err);
      alert('Failed to create booking. Please check slot availability.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 3) handleFinalBooking();
    else setCurrentStep(prev => prev + 1);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between max-w-2xl mx-auto mb-10 px-4">
      {STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-all border-2",
              currentStep > i + 1 ? "bg-emerald-500 border-emerald-500 text-white" :
              currentStep === i + 1 ? "bg-blue-600 border-blue-600 text-white shadow-lg" :
              "bg-white border-slate-200 text-slate-400"
            )}>
              {currentStep > i + 1 ? <CheckCircle2 size={16} /> : i + 1}
            </div>
            <span className={cn("text-[9px] font-bold uppercase", currentStep === i + 1 ? "text-blue-600" : "text-slate-400")}>{step}</span>
          </div>
          {i < STEPS.length - 1 && <div className={cn("h-px flex-1 mx-2", currentStep > i + 1 ? "bg-emerald-500" : "bg-slate-200")} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-4 animate-in fade-in duration-500 font-inter">
      <div className="mb-8 text-center">
        <h1 className="text-lg font-bold text-slate-900">Book at {vendorData?.companyName || 'Center'}</h1>
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Select your preferences below</p>
      </div>

      <StepIndicator />

      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm min-h-[400px] flex flex-col justify-between">
        <div className="flex-1">
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
               <h3 className="text-[14px] font-bold text-slate-900">Your Vehicles</h3>
               {['Tesla Model 3', 'BMW X5'].map(v => (
                 <div key={v} onClick={() => setBookingData({...bookingData, vehicle: { make: v.split(' ')[0], model: v.split(' ')[1], plateNumber: 'ABC-123' }})} className={cn("p-4 border rounded-2xl cursor-pointer flex items-center gap-4", bookingData.vehicle?.make === v.split(' ')[0] ? "border-blue-600 bg-blue-50/50" : "border-slate-100")}>
                    <Car className="text-slate-400" />
                    <span className="text-[12px] font-bold">{v}</span>
                 </div>
               ))}
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
               <h3 className="text-[14px] font-bold text-slate-900">Select Service</h3>
               {vendorData?.services?.map((s: any) => (
                 <div key={s.name} onClick={() => setBookingData({...bookingData, service: s})} className={cn("p-4 border rounded-2xl cursor-pointer flex justify-between items-center", bookingData.service?.name === s.name ? "border-blue-600 bg-blue-50/50" : "border-slate-100")}>
                    <div>
                      <p className="text-[12px] font-bold">{s.name}</p>
                      <p className="text-[10px] text-slate-400">{s.duration}</p>
                    </div>
                    <span className="text-[14px] font-bold text-blue-600">${s.price}</span>
                 </div>
               ))}
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-2">
               {['09:00', '10:00', '11:00', '14:00', '15:00'].map(t => (
                 <button key={t} onClick={() => setBookingData({...bookingData, slot: t})} className={cn("py-3 rounded-xl text-[11px] font-bold border", bookingData.slot === t ? "bg-blue-600 text-white" : "bg-white")}>{t} AM</button>
               ))}
            </motion.div>
          )}

          {currentStep === 4 && (
            <div className="text-center space-y-6 pt-10">
               <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                 <CheckCircle2 size={32} />
               </div>
               <h2 className="text-xl font-bold">Booking Successful!</h2>
               <button onClick={() => navigate('/customer/my-bookings')} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest">View My Bookings</button>
            </div>
          )}
        </div>

        {currentStep < 4 && (
          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
            <button onClick={() => setCurrentStep(prev => prev - 1)} disabled={currentStep === 1} className="text-slate-400 text-[11px] font-bold uppercase disabled:opacity-0">Back</button>
            <button onClick={nextStep} disabled={loading} className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
               {loading ? <Loader2 size={14} className="animate-spin" /> : currentStep === 3 ? 'Confirm' : 'Continue'}
               <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
