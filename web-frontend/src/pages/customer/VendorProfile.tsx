import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Star, Clock, Info, Loader2, ChevronRight, CheckCircle2, ShieldCheck, ArrowLeft,
  Mail, Phone, CreditCard, Calendar, X, Image as ImageIcon
} from 'lucide-react';
import api from '../../services/axiosConfig';

export const VendorProfile: React.FC = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [buyLoading, setBuyLoading] = useState(false);
  const [buyError, setBuyError] = useState('');
  const [vehicle, setVehicle] = useState({ make: '', model: '', plateNumber: '' });
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submitReviewLoading, setSubmitReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await api.get(`/customer/vendors/${vendorId}`);
        if (response.data.success) setData(response.data.data);
      } catch (err) {
        console.error('Failed to fetch vendor details:', err);
      } finally {
        setLoading(false);
      }
    };
    const fetchPlans = async () => {
      try {
        const res = await api.get(`/plans/customer/vendor/${vendorId}`);
        if (res.data.success) setPlans(res.data.data);
      } catch {}
    };
    if (vendorId) {
      fetchVendorDetails();
      fetchPlans();
    }
  }, [vendorId]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (!data?.vendor) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-900">Vendor Not Found</h2>
        <button onClick={() => navigate('/customer/search')} className="text-blue-600 font-bold mt-4">Back to Search</button>
      </div>
    );
  }

  const { vendor, services, slots, reviews } = data;
  const startingPrice = services.length > 0 ? Math.min(...services.map((s: any) => s.price)) : 0;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewRating) {
      setReviewError('Please select a rating');
      return;
    }
    setSubmitReviewLoading(true);
    setReviewError('');
    try {
      const res = await api.post('/customer/reviews', {
        vendorId,
        rating: reviewRating,
        comment: reviewComment
      });
      if (res.data.success) {
        setData({
          ...data,
          reviews: [res.data.data, ...data.reviews]
        });
        setReviewRating(0);
        setReviewComment('');
      }
    } catch (err: any) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitReviewLoading(false);
    }
  };

  const handleBuyPlan = async () => {
    if (!vehicle.make || !vehicle.model || !vehicle.plateNumber) {
      setBuyError('Please fill all vehicle details.');
      return;
    }
    setBuyLoading(true);
    setBuyError('');
    try {
      const createRes = await api.post('/plans/customer/purchase', { planId: selectedPlan._id, vehicle });
      const customerPlanId = createRes.data.data._id;
      const orderRes = await api.post('/payment/create-order', { amount: selectedPlan.price, receipt: 'plan_' + customerPlanId });
      const order = orderRes.data.data;
      const options: any = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Chakachak',
        description: selectedPlan.title,
        order_id: order.id,
        handler: async (response: any) => {
          await api.post('/payment/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            planId: customerPlanId
          });
          setSelectedPlan(null);
          navigate('/customer/my-plans');
        },
        prefill: {},
        theme: { color: '#2563eb' }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error('[Buy Plan Error]', err);
      setBuyError(err.response?.data?.message || 'Payment failed. Try again.');
    } finally {
      setBuyLoading(false);
    }
  };

  return (
    <>
      {/* ── Main Page Content ─────────────────────────────── */}
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 font-inter pb-20">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> Back
        </button>

        {/* Hero Header */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-50 rounded-3xl border-4 border-white shadow-lg overflow-hidden shrink-0">
            {vendor.avatar ? (
              <img src={vendor.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 text-3xl font-bold">
                {vendor.companyName?.charAt(0) || 'V'}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{vendor.companyName}</h1>
              <ShieldCheck className="text-emerald-500" size={20} />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-4">{vendor.fullName}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                <MapPin size={14} className="text-slate-400" /> {vendor.businessLocation}
              </span>
              <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-xl border border-amber-100">
                <Star size={14} className="fill-amber-400 text-amber-400" /> 4.8 Rating
              </span>
              <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl border border-blue-100">
                <Clock size={14} className="text-blue-500" /> {slots.length} Slots Available
              </span>
              {vendor.availability && vendor.availability.isAvailable === false && (
                <span className="flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-1.5 rounded-xl border border-rose-100">
                  <Info size={14} className="text-rose-500" /> {vendor.availability.reason || 'Temporarily Closed'}
                </span>
              )}
            </div>
          </div>

          <div className="w-full sm:w-auto mt-4 sm:mt-0 flex flex-col gap-3">
            <button
              onClick={() => !(vendor.availability?.isAvailable === false) && navigate('/customer/book?vendor=' + vendor._id)}
              disabled={vendor.availability?.isAvailable === false}
              className={`w-full sm:w-auto px-8 py-3.5 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                vendor.availability?.isAvailable === false
                  ? 'bg-slate-300 shadow-none cursor-not-allowed'
                  : 'bg-blue-600 shadow-blue-200 hover:bg-blue-700 active:scale-95'
              }`}
            >
              <span>{vendor.availability?.isAvailable === false ? 'Unavailable' : 'Book Appointment'}</span>
              {!(vendor.availability?.isAvailable === false) && <ChevronRight size={16} />}
            </button>
            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Services from &#8377;{startingPrice}
            </p>
          </div>
        </div>

        {/* Services + Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Service Packages */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                Service Packages <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs">{services.length}</span>
              </h2>
              {services.length === 0 ? (
                <p className="text-slate-400 italic text-sm">No services configured by this vendor.</p>
              ) : (
                <div className="space-y-4">
                  {services.map((service: any) => (
                    <div key={service._id} className="p-5 border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all group">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{service.name}</h3>
                          <p className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block mt-1">{service.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-emerald-600">&#8377;{service.price}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-end gap-1 mt-1">
                            <Clock size={10} /> {service.duration} Mins
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 mb-4">{service.description}</p>
                      {service.features && service.features.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-50">
                          {service.features.map((f: string, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                              <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Contact + Reviews */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                    <Mail size={14} className="text-slate-400" />
                  </div>
                  <span className="truncate">{vendor.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                    <Phone size={14} className="text-slate-400" />
                  </div>
                  <span>{vendor.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                    <Info size={14} className="text-slate-400" />
                  </div>
                  <span>Active Operating Status</span>
                </div>
              </div>
            </div>


          </div>
        </div>

        {/* Vendor Gallery Section */}
        {vendor.gallery && vendor.gallery.length > 0 && (
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <ImageIcon size={20} className="text-blue-500" /> Image Gallery
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs">{vendor.gallery.length}</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {vendor.gallery.map((img: any) => (
                <div key={img.publicId} className="relative group rounded-2xl overflow-hidden aspect-square border border-slate-100 shadow-sm cursor-pointer">
                  <img src={img.url} alt="Gallery" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/30 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscription Plans — full width below grid */}
        {plans.length > 0 && (
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <CreditCard size={20} className="text-blue-600" />
                Subscription Plans
                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-semibold">{plans.length}</span>
              </h2>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">Prepaid service packs — buy once, use multiple times</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {plans.map((plan: any) => (
                <div
                  key={plan._id}
                  className="relative flex flex-col rounded-2xl border border-slate-100 bg-gradient-to-br from-white via-slate-50/40 to-blue-50/30 hover:border-blue-200 hover:shadow-xl transition-all duration-200 overflow-hidden group"
                >
                  <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="inline-block bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-[11px] font-semibold mb-2">
                          {plan.tenure.value} {plan.tenure.unit}
                        </span>
                        <h3 className="text-[17px] font-semibold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{plan.title}</h3>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-2xl font-bold text-slate-900">&#8377;{plan.price}</p>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">one-time</p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-500 leading-relaxed mb-4">{plan.description}</p>

                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 mb-4">
                      <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                      <span className="text-sm font-semibold text-emerald-700">{plan.servicesIncluded} Services Included</span>
                    </div>

                    {plan.features && plan.features.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {plan.features.map((f: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                            <span className="font-semibold">{f}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {plan.supportedVehicles && plan.supportedVehicles.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {plan.supportedVehicles.map((v: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-lg">{v}</span>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => { setSelectedPlan(plan); setBuyError(''); setVehicle({ make: '', model: '', plateNumber: '' }); }}
                      className="mt-auto w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <CreditCard size={15} />
                      Buy This Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section — full width below plans */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest flex items-center justify-between">
                Write a Review
              </h3>
              <form onSubmit={handleSubmitReview} className="space-y-3">
                <div>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          size={20}
                          className={`${
                            star <= reviewRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[80px]"
                    maxLength={300}
                  />
                </div>
                {reviewError && <p className="text-xs text-rose-600 font-semibold">{reviewError}</p>}
                <button
                  type="submit"
                  disabled={submitReviewLoading}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitReviewLoading ? <Loader2 size={14} className="animate-spin" /> : 'Submit Review'}
                </button>
              </form>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest flex items-center justify-between">
                Recent Reviews
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md">{reviews.length}</span>
              </h3>
              {reviews.length === 0 ? (
                <p className="text-slate-400 italic text-xs text-center py-4">No reviews yet.</p>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {reviews.map((r: any) => (
                    <div key={r._id} className="pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">{r.customer?.fullName || 'Customer'}</span>
                        <div className="flex items-center gap-0.5">
                          <Star size={10} className="fill-amber-400 text-amber-400" />
                          <span className="text-[10px] font-bold text-slate-600">{r.rating}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
      {/* ── End Main Content ────────────────────────────────── */}

      {/* Buy Plan Modal */}
      {selectedPlan && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" onClick={() => setSelectedPlan(null)} />
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
            <div className="w-full max-w-md bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] pointer-events-auto">
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Buy Plan</h2>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">{selectedPlan.title} &bull; &#8377;{selectedPlan.price}</p>
                </div>
                <button onClick={() => setSelectedPlan(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto space-y-5 flex-1">
                <div className="bg-blue-50 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700">Plan Summary</span>
                    <span className="text-lg font-bold text-slate-900">&#8377;{selectedPlan.price}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-500" /> {selectedPlan.servicesIncluded} Services</span>
                    <span className="flex items-center gap-1"><Calendar size={12} className="text-blue-500" /> {selectedPlan.tenure.value} {selectedPlan.tenure.unit}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Your Vehicle Details</p>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Make</label>
                        <input
                          type="text"
                          placeholder="e.g. Maruti"
                          value={vehicle.make}
                          onChange={e => setVehicle(v => ({ ...v, make: e.target.value }))}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Model</label>
                        <input
                          type="text"
                          placeholder="e.g. Swift"
                          value={vehicle.model}
                          onChange={e => setVehicle(v => ({ ...v, model: e.target.value }))}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">License Plate Number</label>
                      <input
                        type="text"
                        placeholder="e.g. MH12AB1234"
                        value={vehicle.plateNumber}
                        onChange={e => setVehicle(v => ({ ...v, plateNumber: e.target.value.toUpperCase() }))}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all uppercase"
                      />
                    </div>
                  </div>
                </div>

                {buyError && (
                  <p className="text-sm font-semibold text-rose-600 bg-rose-50 px-4 py-3 rounded-xl">{buyError}</p>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-slate-100">
                <button
                  onClick={handleBuyPlan}
                  disabled={buyLoading}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {buyLoading ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
                  {buyLoading ? 'Processing...' : 'Pay &#8377;' + selectedPlan.price + ' via Razorpay'}
                </button>
                <p className="text-center text-[11px] font-semibold text-slate-400 mt-3">Secured by Razorpay &bull; Online Payment Only</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
