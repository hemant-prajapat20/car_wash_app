import React, { useState, useEffect } from 'react';
import { 
  Car, Clock, ChevronRight, ArrowLeft, CheckCircle2, 
  Loader2, Plus, X, Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/axiosConfig';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STEPS = ['Vehicle', 'Package', 'Schedule', 'Confirm'];

interface BookingData { vehicle: any; service: any; slot: any; }

/* ─── Step Indicator ─────────────────────────────────── */
const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => (
  <div className="flex items-center w-full px-2 mb-6">
    {STEPS.map((step, i) => (
      <React.Fragment key={step}>
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black border-2 transition-all',
            currentStep > i + 1  ? 'bg-emerald-500 border-emerald-500 text-white' :
            currentStep === i + 1 ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' :
            'bg-white border-slate-200 text-slate-300'
          )}>
            {currentStep > i + 1 ? <CheckCircle2 size={14} /> : i + 1}
          </div>
          <span className={cn(
            'text-[9px] font-bold uppercase tracking-widest',
            currentStep === i + 1 ? 'text-blue-600' : 'text-slate-300'
          )}>{step}</span>
        </div>
        {i < STEPS.length - 1 && (
          <div className={cn(
            'flex-1 h-0.5 mx-2 rounded-full mb-4 transition-colors',
            currentStep > i + 1 ? 'bg-emerald-400' : 'bg-slate-100'
          )} />
        )}
      </React.Fragment>
    ))}
  </div>
);

/* ─── Main Component ─────────────────────────────────── */
export const BookService: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate        = useNavigate();
  const vendorId        = searchParams.get('vendor');

  const [currentStep, setCurrentStep] = useState(1);
  const [loading,     setLoading]     = useState(false);
  const [fetching,    setFetching]    = useState(true);

  const [vendor,   setVendor]   = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [slots,    setSlots]    = useState<any[]>([]);

  // Customer's active premium plan for this vendor (if any)
  const [customerPlan, setCustomerPlan] = useState<any>(null);
  const [packageMode, setPackageMode] = useState<'premium' | 'normal'>('normal');

  const [bookingData, setBookingData] = useState<BookingData>({
    vehicle: null, service: null, slot: null,
  });

  const [vehicles,       setVehicles]       = useState<any[]>([]);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle,     setNewVehicle]     = useState({ make: '', model: '', plateNumber: '' });

  const [addresses, setAddresses] = useState<any[]>([]);

  // Invoice State
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  // Home Service & Cash Payment States
  const [serviceType, setServiceType] = useState<'Shop' | 'Home'>('Shop');
  const [homeAddress, setHomeAddress] = useState({ address: '', city: '' });
  const [paymentMode, setPaymentMode] = useState<'Online' | 'Cash'>('Online');

  // Dynamic Booking Calendar Date Selection
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  /* ── Fetch ────────────────────────────────────────── */
  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    setBookingData(prev => ({ ...prev, slot: null }));
  }, [selectedDate]);

  useEffect(() => {
    if (!vendorId) { toast.error('Invalid vendor'); navigate('/customer/search'); return; }
    (async () => {
      try {
        const res = await api.get(`/customer/vendors/${vendorId}?date=${selectedDate}`);
        if (res.data.success) {
          setVendor(res.data.data.vendor);
          setServices(res.data.data.services);
          setSlots(res.data.data.slots);
        }
      } catch { toast.error('Failed to load vendor schedule.'); }
      finally { setFetching(false); }
    })();
  }, [vendorId, navigate, selectedDate]);

  // Fetch customer's active plan for this vendor
  useEffect(() => {
    if (!vendorId) return;
    (async () => {
      try {
        const res = await api.get(`/plans/customer/vendor/${vendorId}`);
        if (res.data.success && res.data.data.length > 0) {
          const active = res.data.data.find((p: any) => p.status === 'Active');
          if (active) { setCustomerPlan(active); setPackageMode('premium'); }
        }
      } catch { /* silent */ }
    })();
  }, [vendorId]);

  const fetchData = async () => {
    try {
      const [vehRes, addrRes] = await Promise.all([
        api.get('/customer/vehicles'),
        api.get('/customer/addresses')
      ]);
      if (vehRes.data.success) setVehicles(vehRes.data.data);
      if (addrRes.data.success) setAddresses(addrRes.data.data);
    } catch { /* silent */ }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/customer/vehicles', newVehicle);
      if (res.data.success) {
        setVehicles(res.data.data);
        setShowAddVehicle(false);
        setNewVehicle({ make: '', model: '', plateNumber: '' });
        toast.success('Vehicle added!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add vehicle');
    } finally { setLoading(false); }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleFinalBooking = async () => {
    setLoading(true);
    try {
      // 1. Create Booking first (Status: Pending or Confirmed based on paymentMode)
      const bookingRes = await api.post('/customer/bookings', {
        vendorId,
        vehicle: bookingData.vehicle,
        service: bookingData.service,
        slot: { date: new Date(selectedDate), time: bookingData.slot.startTime },
        paymentMode,
        serviceType,
        homeAddress: serviceType === 'Home' ? homeAddress : undefined
      });

      if (!bookingRes.data.success) {
        throw new Error('Failed to create booking');
      }

      const booking = bookingRes.data.data;

      // 2. Bypass Razorpay payment flow if Cash is selected
      if (paymentMode === 'Cash') {
        setInvoiceId(booking._id);
        setCurrentStep(4);
        toast.success('Booking confirmed successfully! Pay cash after service.');
        setLoading(false);
        return;
      }

      // 3. Load Razorpay script for Online payment
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setLoading(false);
        return;
      }

      // 4. Create Order on Backend
      const orderRes = await api.post('/payment/create-order', {
        amount: bookingData.service.price,
      });

      if (!orderRes.data.success) {
        throw new Error('Failed to create payment order');
      }

      const order = orderRes.data.data;

      // 5. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: order.amount,
        currency: order.currency,
        name: 'Chakaachak Wash',
        description: `Booking for ${bookingData.service.name}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // 6. Verify Payment on Backend
            const verifyRes = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id,
            });

            if (verifyRes.data.success) {
              setInvoiceId(booking._id);
              setCurrentStep(4);
              toast.success('Payment successful! Booking confirmed.');
            } else {
              toast.error('Payment verification failed');
            }
          } catch (err) {
            toast.error('Error verifying payment');
          }
        },
        prefill: {
          name: 'Customer', // Can populate from user profile
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#2563eb', // Tailwind blue-600
        },
        modal: {
          ondismiss: function () {
            toast.error('Payment cancelled');
            setLoading(false);
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp1.open();

    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to process booking.');
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !bookingData.vehicle) return toast.error('Please select a vehicle');
    if (currentStep === 2 && !bookingData.service) return toast.error('Please select a service');
    if (currentStep === 3) {
      if (!bookingData.slot) return toast.error('Please select a time slot');
      if (serviceType === 'Home') {
        if (!homeAddress.address.trim()) return toast.error('Please enter a street address for home service');
        if (!homeAddress.city.trim()) return toast.error('Please enter a city for home service');
      }
      handleFinalBooking();
    }
    else setCurrentStep(p => p + 1);
  };

  if (fetching) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Loader2 className="animate-spin text-blue-600" size={36} />
    </div>
  );

  return (
    <div className="w-full font-inter animate-in fade-in duration-300">

      {/* ── Page header ──────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-800 uppercase tracking-widest border border-slate-200 bg-white px-3 py-2 rounded-xl shadow-sm transition-all"
        >
          <ArrowLeft size={13} /> Back
        </button>
        <div className="text-right">
          <h1 className="text-xl font-black text-slate-900">Book Appointment</h1>
          <div className="flex items-center justify-end gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{vendor?.companyName}</span>
          </div>
        </div>
      </div>

      {/* ── Step Indicator ───────────────────────────── */}
      <StepIndicator currentStep={currentStep} />

      {/* ── Main Card ────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Blue accent top bar */}
        <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-500" />

        <div className="p-5 sm:p-8">

          {/* ── STEP 1: Vehicle ──────────────────────── */}
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Select Vehicle</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Choose a car from your garage</p>
                </div>
                <button
                  onClick={() => setShowAddVehicle(true)}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl transition-all"
                >
                  <Plus size={13} /> Add New
                </button>
              </div>

              {vehicles.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                  <Car size={40} className="text-slate-200 mb-3" />
                  <p className="text-sm font-bold text-slate-400">No vehicles found</p>
                  <button
                    onClick={() => setShowAddVehicle(true)}
                    className="mt-3 text-xs text-blue-600 font-bold hover:underline"
                  >
                    Add your first car →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehicles.map(v => {
                    const selected = bookingData.vehicle?._id === v._id;
                    return (
                      <button
                        key={v._id}
                        onClick={() => setBookingData({ ...bookingData, vehicle: v })}
                        className={cn(
                          'p-4 border-2 rounded-xl flex items-center gap-3 text-left transition-all duration-200',
                          selected
                            ? 'border-blue-600 bg-blue-50 shadow-md shadow-blue-100'
                            : 'border-slate-100 bg-slate-50 hover:border-blue-200 hover:bg-white'
                        )}
                      >
                        <div className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                          selected ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border border-slate-200'
                        )}>
                          <Car size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{v.make} {v.model}</p>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide bg-slate-100 px-1.5 py-0.5 rounded mt-1 inline-block">{v.plateNumber}</span>
                        </div>
                        {selected && <CheckCircle2 size={16} className="text-blue-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ── STEP 2: Package ──────────────────────── */}
          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900">Select Service Package</h2>
                <p className="text-xs text-slate-400 mt-0.5">Pick the service that suits your car</p>
              </div>

              {/* Package Mode Toggle — only shown if customer has an active premium plan */}
              {customerPlan && (
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => { setPackageMode('premium'); setBookingData({ ...bookingData, service: null }); }}
                    className={cn(
                      'flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                      packageMode === 'premium' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'
                    )}
                  >
                    ⭐ Premium Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPackageMode('normal'); setBookingData({ ...bookingData, service: null }); }}
                    className={cn(
                      'flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all',
                      packageMode === 'normal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'
                    )}
                  >
                    Normal Services
                  </button>
                </div>
              )}

              {/* Premium Plan Info Card */}
              {customerPlan && packageMode === 'premium' && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-2xl space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Active Plan</p>
                      <h3 className="text-sm font-black text-slate-900 mt-0.5">{customerPlan.servicePlan?.title}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{customerPlan.servicePlan?.description}</p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Remaining</p>
                      <p className="text-xl font-black text-slate-900">{customerPlan.remainingServices}<span className="text-xs font-bold text-slate-400">/{customerPlan.totalServices}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car size={12} className="text-slate-400" />
                    <p className="text-[11px] font-bold text-slate-500">{customerPlan.vehicle?.make} {customerPlan.vehicle?.model} — {customerPlan.vehicle?.plateNumber}</p>
                  </div>
                  {customerPlan.remainingServices > 0 ? (
                    <button
                      type="button"
                      onClick={() => setBookingData({ ...bookingData, service: { _id: 'plan_use', name: customerPlan.servicePlan?.title, price: 0, isPlanService: true, planId: customerPlan._id } })}
                      className={cn(
                        'w-full py-3 rounded-xl border-2 text-xs font-black uppercase tracking-widest transition-all',
                        bookingData.service?._id === 'plan_use'
                          ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-100'
                          : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                      )}
                    >
                      {bookingData.service?._id === 'plan_use' ? '✓ Plan Service Selected' : 'Use This Plan for Booking'}
                    </button>
                  ) : (
                    <p className="text-[11px] font-bold text-rose-500 text-center py-2">No services remaining in this plan.</p>
                  )}
                </div>
              )}

              {/* Normal Services List */}
              {(!customerPlan || packageMode === 'normal') && (
                services.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                    No services available from this vendor.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {services.map((s: any) => {
                      const selected = bookingData.service?._id === s._id;
                      return (
                        <button
                          key={s._id}
                          onClick={() => setBookingData({ ...bookingData, service: s })}
                          className={cn(
                            'w-full p-4 border-2 rounded-xl flex items-center justify-between gap-4 text-left transition-all',
                            selected ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                          )}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-bold text-slate-900">{s.name}</span>
                              <span className="text-[9px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{s.category}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-1">{s.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-base font-black text-emerald-600">₹{s.price}</span>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1 justify-end mt-0.5">
                              <Clock size={10} /> {s.duration} min
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )
              )}
            </motion.div>
          )}

          {/* ── STEP 3: Slot ─────────────────────────── */}
          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              
              {/* Home Service Selector if vendor allows it */}
              {vendor?.isHomeServiceAvailable && (
                <div className="space-y-3 pb-3 border-b border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Service Location</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { type: 'Shop', title: 'At Shop', desc: 'Bring your vehicle to our service shop' },
                      { type: 'Home', title: 'At Home', desc: 'Convenient mobile wash at your doorstep' },
                    ].map(loc => {
                      const active = serviceType === loc.type;
                      return (
                        <button
                          key={loc.type}
                          type="button"
                          onClick={() => setServiceType(loc.type as any)}
                          className={cn(
                            'p-3 border-2 rounded-xl text-left transition-all',
                            active ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-50' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
                          )}
                        >
                          <p className="text-xs font-black text-slate-800">{loc.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{loc.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Home address form fields & Saved Addresses */}
              {serviceType === 'Home' && (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                  {addresses.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Select Saved Address</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                        {addresses.map(addr => {
                          const isSelected = homeAddress.address === addr.address && homeAddress.city === addr.city;
                          return (
                            <button
                              key={addr._id}
                              type="button"
                              onClick={() => setHomeAddress({ address: addr.address, city: addr.city })}
                              className={cn(
                                'w-full p-3 border-2 rounded-xl flex items-center justify-between text-left transition-all',
                                isSelected ? 'border-emerald-600 bg-emerald-50/50 shadow-md shadow-emerald-50' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
                              )}
                            >
                              <div>
                                <p className="text-xs font-black text-slate-800">{addr.label}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{addr.address}, {addr.city}</p>
                              </div>
                              <button
                                type="button"
                                onClick={e => { e.stopPropagation(); deleteAddress(addr._id); }}
                                className="p-1 text-slate-400 hover:text-slate-600"
                                title="Delete address"
                              >
                                <X size={14} />
                              </button>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-slate-50/80 border border-slate-100 rounded-xl space-y-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {addresses.length > 0 ? "Or Enter Custom Address" : "Home Service Address"}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Street Address</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Flat 101, Green Meadows"
                          value={homeAddress.address}
                          onChange={e => setHomeAddress({ ...homeAddress, address: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-400 transition-all font-semibold text-slate-700"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">City</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Pune"
                          value={homeAddress.city}
                          onChange={e => setHomeAddress({ ...homeAddress, city: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-400 transition-all font-semibold text-slate-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Service Date Picker Panel */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Select Service Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-blue-400 transition-all font-semibold text-slate-700 shadow-sm"
                />
              </div>

              <div className="pb-2">
                <h2 className="text-base font-bold text-slate-900">Select Time Slot</h2>
                <p className="text-xs text-slate-400 mt-0.5">Choose an available appointment time</p>
              </div>

              {slots.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                  No slots available from this vendor.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {slots.map((t: any) => {
                    const isSelected = bookingData.slot?._id === t._id;
                    const isFull     = t.currentBookings >= t.maxBookings;

                    // Calculate if slot time or date is in the past
                    const localToday = new Date();
                    const year = localToday.getFullYear();
                    const month = String(localToday.getMonth() + 1).padStart(2, '0');
                    const day = String(localToday.getDate()).padStart(2, '0');
                    const todayStr = `${year}-${month}-${day}`;

                    let isPassed = false;
                    if (selectedDate < todayStr) {
                      isPassed = true;
                    } else if (selectedDate === todayStr) {
                      const currentHours = localToday.getHours().toString().padStart(2, '0');
                      const currentMinutes = localToday.getMinutes().toString().padStart(2, '0');
                      const currentTimeString = `${currentHours}:${currentMinutes}`;
                      isPassed = t.startTime < currentTimeString;
                    }

                    const isDisabled = isFull || isPassed;

                    return (
                      <button
                        key={t._id}
                        disabled={isDisabled}
                        onClick={() => setBookingData({ ...bookingData, slot: t })}
                        className={cn(
                          'py-3.5 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1',
                          isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-md' :
                          isDisabled ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' :
                          'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                        )}
                      >
                        <span>{t.startTime}</span>
                        <span className="text-[9px] opacity-70">— {t.endTime}</span>
                        {isFull && <span className="text-[8px] text-red-400 font-black uppercase">Full</span>}
                        {isPassed && <span className="text-[8px] text-slate-400 font-black uppercase">Passed</span>}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Booking summary */}
              {bookingData.slot && (
                <div className="mt-2 p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-2">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">Booking Summary</p>
                  {[
                    ['Service',  bookingData.service?.name,  `₹${bookingData.service?.price}`],
                    ['Location',  serviceType === 'Home' ? 'Doorstep Service' : 'Shop Visit', null],
                    ['Date',      selectedDate, null],
                    ['Time',     bookingData.slot?.startTime, null],
                    ['Vehicle',  `${bookingData.vehicle?.make} ${bookingData.vehicle?.model}`, null],
                  ].map(([label, left, right]) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium">{label}: <span className="text-slate-900 font-bold">{left}</span></span>
                      {right && <span className="font-black text-emerald-600">{right}</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Payment Method Selector */}
              {bookingData.slot && (
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Payment Option</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { mode: 'Online', title: 'Pay Online', desc: 'Secure digital checkout via Razorpay' },
                      { mode: 'Cash', title: 'Pay via Cash', desc: 'Pay cash to our worker after service' },
                    ].map(pay => {
                      const active = paymentMode === pay.mode;
                      return (
                        <button
                          key={pay.mode}
                          type="button"
                          onClick={() => setPaymentMode(pay.mode as any)}
                          className={cn(
                            'p-3 border-2 rounded-xl text-left transition-all',
                            active ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-50' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
                          )}
                        >
                          <p className="text-xs font-black text-slate-800">{pay.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{pay.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </motion.div>
          )}

          {/* ── STEP 4: Confirmation ─────────────────── */}
          {currentStep === 4 && (
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-10 text-center space-y-5">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={44} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">Booking Confirmed!</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Your appointment with <span className="font-bold text-slate-900">{vendor?.companyName}</span> is all set.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 max-w-sm mx-auto">
                <button
                  onClick={() => navigate('/customer/bookings')}
                  className="flex-1 py-3.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
                >
                  View Bookings
                </button>
                <button
                  onClick={() => navigate('/customer/search')}
                  className="flex-1 py-3.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Back to Search
                </button>
              </div>

              {invoiceId && (
                <button
                  onClick={() => window.open(`/invoice/${invoiceId}`, '_blank')}
                  className="mt-6 flex items-center gap-2 mx-auto text-blue-600 font-black text-[10px] uppercase tracking-widest bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                >
                  <Printer size={14} /> View Professional Receipt
                </button>
              )}
            </motion.div>
          )}

          {/* ── Navigation buttons ───────────────────── */}
          {currentStep < 4 && (
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(p => p - 1)}
                disabled={currentStep === 1}
                className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-700 transition-colors disabled:opacity-0 px-2 py-1"
              >
                ← Back
              </button>
              <button
                onClick={nextStep}
                disabled={loading}
                className="flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading
                  ? <Loader2 size={14} className="animate-spin" />
                  : currentStep === 3
                    ? (paymentMode === 'Cash' ? 'Confirm & Book' : 'Confirm & Pay')
                    : 'Continue'
                }
                {!loading && <ChevronRight size={14} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Add Vehicle Modal ─────────────────────────── */}
      <AnimatePresence>
        {showAddVehicle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">Add New Vehicle</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Register your car to continue</p>
                </div>
                <button
                  onClick={() => setShowAddVehicle(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddVehicle} className="p-6 space-y-4">
                {/* Delete address handler */}
                <script>
                {`
                  const deleteAddress = async (addressId: string) => {
                    try {
                      await api.delete(\`/customer/addresses/\${addressId}\`);
                      toast.success('Address deleted');
                      fetchData();
                    } catch (err: any) {
                      toast.error(err.response?.data?.message || 'Failed to delete address');
                    }
                  };
                `}
                </script>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Make',  key: 'make',  placeholder: 'e.g. Toyota' },
                    { label: 'Model', key: 'model', placeholder: 'e.g. Corolla' },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key} className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
                      <input
                        required
                        type="text"
                        placeholder={placeholder}
                        value={(newVehicle as any)[key]}
                        onChange={e => setNewVehicle({ ...newVehicle, [key]: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white transition-all"
                      />
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plate Number</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. MH-12-AB-1234"
                    value={newVehicle.plateNumber}
                    onChange={e => setNewVehicle({ ...newVehicle, plateNumber: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold tracking-wider outline-none focus:border-blue-400 focus:bg-white transition-all"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddVehicle(false)}
                    className="flex-1 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-700 transition-colors border border-slate-200 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] py-3 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading ? 'Saving…' : 'Save Vehicle'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
