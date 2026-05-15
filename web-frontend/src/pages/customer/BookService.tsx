import React, { useState, useEffect } from 'react';
import { 
  Car, Package, Clock, ShieldCheck, 
  ChevronRight, ArrowLeft, CheckCircle2, 
  Loader2, Waves, Calendar, Tag
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/axiosConfig';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import toast from 'react-hot-toast';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STEPS = ['Vehicle', 'Package', 'Schedule', 'Confirm'];

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
  const [fetching, setFetching] = useState(true);
  
  const [vendor, setVendor] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  
  const [bookingData, setBookingData] = useState<BookingData>({
    vehicle: null,
    service: null,
    slot: null,
  });

  // Mock vehicles - in a full app these would come from Customer's saved vehicles
  const savedVehicles = [
    { id: 1, make: 'Tesla', model: 'Model 3', plateNumber: 'XYZ-1234' },
    { id: 2, make: 'BMW', model: 'X5', plateNumber: 'ABC-9876' }
  ];

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const res = await api.get(`/customer/vendors/${vendorId}`);
        if (res.data.success) {
          setVendor(res.data.data.vendor);
          setServices(res.data.data.services);
          setSlots(res.data.data.slots);
        }
      } catch (err) {
        console.error('Failed to fetch vendor data', err);
        toast.error("Failed to load vendor schedule.");
      } finally {
        setFetching(false);
      }
    };
    if (vendorId) fetchVendorData();
    else {
      toast.error("Invalid vendor selected");
      navigate('/customer/search');
    }
  }, [vendorId, navigate]);

  const handleFinalBooking = async () => {
    setLoading(true);
    try {
      const payload = {
        vendorId,
        vehicle: bookingData.vehicle,
        service: bookingData.service,
        slot: {
          date: new Date(), 
          time: bookingData.slot.startTime
        }
      };
      
      const response = await api.post('/customer/bookings', payload);
      
      if (response.data.success) {
        setCurrentStep(4);
        toast.success("Booking Confirmed!");
      }
    } catch (err: any) {
      console.error('Booking failed', err);
      toast.error(err.response?.data?.message || 'Failed to create booking.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !bookingData.vehicle) return toast.error("Please select a vehicle");
    if (currentStep === 2 && !bookingData.service) return toast.error("Please select a service package");
    if (currentStep === 3 && !bookingData.slot) return toast.error("Please select a time slot");
    
    if (currentStep === 3) handleFinalBooking();
    else setCurrentStep(prev => prev + 1);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between max-w-3xl mx-auto mb-10 px-4">
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
          {i < STEPS.length - 1 && <div className={cn("h-px flex-1 mx-2 transition-colors", currentStep > i + 1 ? "bg-emerald-500" : "bg-slate-200")} />}
        </React.Fragment>
      ))}
    </div>
  );

  if (fetching) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4 animate-in fade-in duration-500 font-inter pb-20">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest mb-6"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Book Appointment</h1>
        <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mt-2">{vendor?.companyName}</p>
      </div>

      <StepIndicator />

      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 sm:p-10 shadow-xl shadow-slate-200/40 min-h-[400px] flex flex-col justify-between">
        <div className="flex-1">
          
          {/* STEP 1: VEHICLE */}
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl mx-auto">
               <div className="flex items-center justify-between">
                 <h3 className="text-base font-bold text-slate-900">Select Vehicle</h3>
                 <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg">+ Add New</button>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {savedVehicles.map(v => (
                   <div 
                     key={v.id} 
                     onClick={() => setBookingData({...bookingData, vehicle: v})} 
                     className={cn(
                       "p-5 border rounded-2xl cursor-pointer flex items-center gap-4 transition-all", 
                       bookingData.vehicle?.id === v.id ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-100/50" : "border-slate-100 hover:border-blue-200"
                     )}
                   >
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", bookingData.vehicle?.id === v.id ? "bg-blue-100 text-blue-600" : "bg-slate-50 text-slate-400")}>
                        <Car size={20} />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">{v.make} {v.model}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">{v.plateNumber}</span>
                      </div>
                   </div>
                 ))}
               </div>
            </motion.div>
          )}

          {/* STEP 2: SERVICE PACKAGE */}
          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl mx-auto">
               <h3 className="text-base font-bold text-slate-900">Select Service Package</h3>
               
               {services.length === 0 ? (
                 <p className="text-slate-400 italic text-sm text-center py-10 border border-dashed rounded-2xl">No services available from this vendor.</p>
               ) : (
                 <div className="grid grid-cols-1 gap-4">
                   {services.map((s: any) => (
                     <div 
                       key={s._id} 
                       onClick={() => setBookingData({...bookingData, service: s})} 
                       className={cn(
                         "p-5 border rounded-2xl cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4", 
                         bookingData.service?._id === s._id ? "border-blue-600 bg-blue-50/50 shadow-md shadow-blue-100/50" : "border-slate-100 hover:border-blue-200"
                       )}
                     >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-bold text-slate-900">{s.name}</h4>
                            <span className="bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md">{s.category}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-2 pr-4">{s.description}</p>
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                          <span className="text-lg font-bold text-emerald-600 block">${s.price}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-start sm:justify-end gap-1 mt-1">
                            <Clock size={10} /> {s.duration} Mins
                          </span>
                        </div>
                     </div>
                   ))}
                 </div>
               )}
            </motion.div>
          )}

          {/* STEP 3: TIME SLOT */}
          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl mx-auto">
               <h3 className="text-base font-bold text-slate-900">Select Time Slot</h3>
               
               {slots.length === 0 ? (
                 <p className="text-slate-400 italic text-sm text-center py-10 border border-dashed rounded-2xl">No available slots for this vendor.</p>
               ) : (
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                   {slots.map((t: any) => {
                     const isSelected = bookingData.slot?._id === t._id;
                     const isFull = t.currentBookings >= t.maxBookings;
                     return (
                       <button 
                         key={t._id} 
                         disabled={isFull}
                         onClick={() => setBookingData({...bookingData, slot: t})} 
                         className={cn(
                           "py-4 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1", 
                           isSelected ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200" : 
                           isFull ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed" :
                           "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
                         )}
                       >
                         <span>{t.startTime} - {t.endTime}</span>
                         {isFull && <span className="text-[9px] uppercase tracking-widest text-red-400">Full</span>}
                       </button>
                     );
                   })}
                 </div>
               )}
               
               {/* Booking Summary Pre-flight */}
               {bookingData.slot && (
                 <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                   <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-200 pb-2">Booking Summary</h4>
                   <div className="flex justify-between items-center text-sm">
                     <span className="font-semibold text-slate-600">Service: {bookingData.service?.name}</span>
                     <span className="font-bold text-slate-900">${bookingData.service?.price}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                     <span className="font-semibold text-slate-600">Time:</span>
                     <span className="font-bold text-blue-600">{bookingData.slot?.startTime}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                     <span className="font-semibold text-slate-600">Vehicle:</span>
                     <span className="font-bold text-slate-900">{bookingData.vehicle?.make} {bookingData.vehicle?.model}</span>
                   </div>
                 </div>
               )}
            </motion.div>
          )}

          {/* STEP 4: CONFIRMATION */}
          {currentStep === 4 && (
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6 pt-10">
               <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-100/50">
                 <CheckCircle2 size={40} />
               </div>
               <div>
                 <h2 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h2>
                 <p className="text-sm font-medium text-slate-500 mt-2">Your appointment with <span className="text-slate-900 font-bold">{vendor?.companyName}</span> is locked in.</p>
               </div>
               
               <div className="max-w-xs mx-auto space-y-3 pt-6">
                 <button onClick={() => navigate('/customer/bookings')} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">
                   View My Bookings
                 </button>
                 <button onClick={() => navigate('/customer/search')} className="w-full py-4 text-slate-500 hover:text-slate-900 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-colors">
                   Return to Search
                 </button>
               </div>
            </motion.div>
          )}
        </div>

        {/* BOTTOM NAVIGATION ACTIONS */}
        {currentStep < 4 && (
          <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between max-w-2xl mx-auto w-full">
            <button 
              onClick={() => setCurrentStep(prev => prev - 1)} 
              disabled={currentStep === 1} 
              className="text-slate-400 text-[11px] font-bold uppercase disabled:opacity-0 hover:text-slate-600 transition-colors px-4 py-2"
            >
              Back
            </button>
            <button 
              onClick={nextStep} 
              disabled={loading} 
              className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-slate-200 transition-all active:scale-95 disabled:opacity-50"
            >
               {loading ? <Loader2 size={14} className="animate-spin" /> : currentStep === 3 ? 'Confirm & Pay' : 'Continue'}
               {!loading && <ChevronRight size={14} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
