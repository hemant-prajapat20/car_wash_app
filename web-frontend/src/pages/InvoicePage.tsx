import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Printer, Download, CheckCircle2, 
  MapPin, Phone, Mail, Waves, ShieldCheck,
  ArrowLeft, Loader2, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/axiosConfig';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const InvoicePage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Intelligent Redirect based on Role
  const getBackPath = () => {
    if (!user) return '/';
    if (user.role === 'vendor') return '/vendor/transactions';
    if (user.role === 'customer') return '/customer/my-bookings';
    return '/';
  };

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await api.get(`/payment/invoice/${bookingId}`);
        if (res.data.success) {
          setData(res.data.data);
        } else {
          setError('Failed to load invoice');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching invoice');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) fetchInvoice();
  }, [bookingId]);

  const numberToWords = (num: number) => {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const translate = (n: number): string => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + ' ' + a[n % 10];
      if (n < 1000) return a[Math.floor(n / 100)] + 'Hundred ' + translate(n % 100);
      return '';
    };

    if (num === 0) return 'Zero';
    let words = '';
    if (num >= 1000) {
      words += translate(Math.floor(num / 1000)) + 'Thousand ';
      num %= 1000;
    }
    words += translate(num);
    return words.toUpperCase() + 'RUPEES ONLY';
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Authenticating Receipt...</p>
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
        <AlertCircle size={32} />
      </div>
      <h1 className="text-xl font-black text-slate-900 mb-2">Invoice Not Found</h1>
      <p className="text-sm text-slate-500 mb-6 max-w-xs">{error || 'The requested invoice could not be retrieved.'}</p>
      <button 
        onClick={() => navigate(getBackPath())}
        className="px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg"
      >
        Go Back
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10 px-4 sm:px-6">
      {/* Navigation & Actions */}
      <div className="max-w-3xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
        <button 
          onClick={() => navigate(getBackPath())}
          className="flex items-center gap-2 text-[9px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100"
        >
          <ArrowLeft size={12} /> Back
        </button>

        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {/* The Invoice */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 print:shadow-none print:border-none print:rounded-none"
      >
        <div ref={invoiceRef} className="p-6 sm:p-10">
          {/* Highlighted Header */}
          <div className="bg-blue-600 -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 mb-8 p-8 sm:p-10 flex flex-col sm:flex-row justify-between items-center gap-6 text-white shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                <Waves size={20} color="white" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter">CHAKAACHAK</h1>
                <p className="text-[8px] font-bold text-white/70 uppercase tracking-[0.3em] mt-0.5">Premium Auto Care</p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-[8px] font-bold text-white/60 uppercase tracking-[0.3em] block mb-1">Tax Invoice</span>
              <h2 className="text-lg font-black tracking-tighter">{data.invoiceNo}</h2>
              <p className="text-[9px] font-medium text-white/80 uppercase tracking-widest mt-1">Dated: {new Date(data.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Billing Info - More Compact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3 pb-1.5 border-b border-slate-200">Customer Details</span>
              <p className="text-base font-black text-slate-900 mb-1">{data.customer?.fullName}</p>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5"><Phone size={12} className="text-blue-400" /> {data.customer?.phone}</p>
                <p className="text-[11px] font-bold text-slate-400 flex items-start gap-1.5 leading-relaxed"><MapPin size={12} className="text-blue-400 mt-0.5" /> {data.customer?.address || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3 pb-1.5 border-b border-slate-200">Provider Information</span>
              <p className="text-base font-black text-slate-900 mb-1">{data.vendor?.companyName}</p>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-slate-500 flex items-start gap-1.5 leading-relaxed"><MapPin size={12} className="text-slate-400 mt-0.5" /> {data.vendor?.businessLocation}</p>
                <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5"><Mail size={12} className="text-slate-400" /> {data.vendor?.email}</p>
              </div>
            </div>
          </div>

          {/* Table - Optimized Height */}
          <div className="mb-10 border border-slate-100 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 uppercase text-[9px] font-black tracking-[0.2em]">
                  <th className="px-6 py-4">Service Description</th>
                  <th className="px-6 py-4 text-center">Qty</th>
                  <th className="px-6 py-4 text-right">Rate</th>
                  <th className="px-6 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <tr>
                  <td className="px-6 py-6">
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{data.service?.name}</p>
                    <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-1">HSN: 9987 - Maintenance Services</p>
                  </td>
                  <td className="px-6 py-6 text-center text-xs font-black text-slate-600">01</td>
                  <td className="px-6 py-6 text-right text-xs font-black text-slate-600">₹{data.taxableAmount}</td>
                  <td className="px-6 py-6 text-right text-sm font-black text-slate-900">₹{data.taxableAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary - Compact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div className="space-y-3">
               <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-1">Payment Method</span>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{data.paymentMode === 'Cash' ? '💵 Cash on Delivery' : '💳 Online / UPI / Card'}</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-1">Amount In Words</span>
                  <p className="text-[9px] font-black text-slate-900 leading-relaxed italic">{numberToWords(data.grandTotal)}</p>
               </div>
               <div className="flex items-center gap-2">
                 <ShieldCheck size={14} className="text-emerald-500" />
                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">E-Invoice Verified • No Signature Required</p>
               </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl space-y-3 text-white shadow-xl shadow-slate-200">
               <div className="flex justify-between items-center text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  <span>Subtotal (Net)</span>
                  <span>₹{data.taxableAmount}</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                  <span>GST Total (18%)</span>
                  <span>₹{(data.cgst + data.sgst).toFixed(2)}</span>
               </div>
               <div className="h-px bg-white/10 my-1" />
               <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Grand Total</span>
                  <span className="text-2xl font-black text-white tracking-tighter">₹{data.grandTotal}</span>
               </div>
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        @media print {
          body { background-color: white !important; }
          .min-h-screen { py-0 !important; }
          @page { margin: 1cm; }
        }
      `}</style>
    </div>
  );
};
