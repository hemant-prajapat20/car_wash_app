import React, { useRef } from 'react';
import { 
  X, Printer, Download, CheckCircle2, 
  MapPin, Phone, Mail, Waves, ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, data }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !data) return null;

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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Action Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-200">
                <Waves size={20} color="white" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Tax Invoice</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{data.invoiceNo}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrint}
                className="p-2.5 bg-slate-50 text-slate-600 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition-all border border-slate-200 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest"
              >
                <Printer size={16} /> <span className="hidden sm:inline">Print</span>
              </button>
              <button 
                onClick={onClose}
                className="p-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-all shadow-lg shadow-slate-200"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Invoice Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-50 print:bg-white print:p-0">
            <div 
              ref={invoiceRef}
              className="bg-white rounded-[2.5rem] shadow-sm p-8 sm:p-12 mx-auto max-w-3xl print:shadow-none print:p-0 print:max-w-none"
            >
              {/* Top Banner: Status & Date */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-12">
                <div className="flex flex-col gap-4">
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5 uppercase tracking-widest">
                        <CheckCircle2 size={10} /> Paid
                      </span>
                   </div>
                   <div>
                      <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Chakaachak</h1>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Professional Car Care Solutions</p>
                   </div>
                </div>
                <div className="text-right flex flex-col items-end">
                   <div className="bg-slate-900 px-6 py-4 rounded-[2rem] shadow-xl text-right min-w-[200px]">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Total Payable</span>
                      <span className="text-2xl font-black text-white">₹{data.grandTotal}</span>
                   </div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-4">Date: {new Date(data.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>

              {/* Addresses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-sky-50/30 p-6 rounded-[2.5rem] border border-sky-100/50">
                  <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest block mb-4">Bill To</span>
                  <p className="text-lg font-black text-slate-900 mb-1">{data.customer?.fullName}</p>
                  <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-2"><Phone size={12} /> {data.customer?.phone}</p>
                  <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 leading-relaxed max-w-[200px]"><MapPin size={12} /> {data.customer?.address || 'Customer Location Not Specified'}</p>
                </div>

                <div className="p-6 rounded-[2.5rem] border-2 border-slate-50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Provider</span>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-lg font-black text-slate-900">{data.vendor?.companyName}</p>
                    <ShieldCheck size={16} className="text-emerald-500" />
                  </div>
                  <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-2"><MapPin size={12} /> {data.vendor?.businessLocation}</p>
                  <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 leading-relaxed"><Mail size={12} /> {data.vendor?.email}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-12 overflow-hidden rounded-[2rem] border border-slate-100">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-widest">
                      <th className="px-6 py-4">Item Description</th>
                      <th className="px-6 py-4 text-center">Qty</th>
                      <th className="px-6 py-4 text-right">Rate</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <tr>
                      <td className="px-6 py-8">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{data.service?.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">HSN: 9987 / Car Wash Services</p>
                      </td>
                      <td className="px-6 py-8 text-center text-sm font-bold text-slate-600">01</td>
                      <td className="px-6 py-8 text-right text-sm font-bold text-slate-600">₹{data.taxableAmount}</td>
                      <td className="px-6 py-8 text-right text-sm font-black text-slate-900">₹{data.taxableAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tax & Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                   <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2 text-center">Rupees in Words</span>
                      <p className="text-[10px] font-black text-slate-900 text-center leading-relaxed italic">{numberToWords(data.grandTotal)}</p>
                   </div>
                   <div className="p-6 border-2 border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center h-24">
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">Manual Stamp Node</span>
                   </div>
                </div>

                <div className="bg-white border-2 border-slate-50 p-8 rounded-[2.5rem] space-y-4 shadow-sm">
                   <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase">
                      <span>Taxable Amount</span>
                      <span className="text-slate-900 font-black">₹{data.taxableAmount}</span>
                   </div>
                   <div className="flex justify-between items-center text-[11px] font-bold text-sky-600/80 uppercase">
                      <span>CGST (9.0%)</span>
                      <span className="font-black">₹{data.cgst}</span>
                   </div>
                   <div className="flex justify-between items-center text-[11px] font-bold text-sky-600/80 uppercase">
                      <span>SGST (9.0%)</span>
                      <span className="font-black">₹{data.sgst}</span>
                   </div>
                   <div className="h-px bg-slate-100 my-4" />
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">Grand Total</span>
                      <span className="text-2xl font-black text-blue-600">₹{data.grandTotal}</span>
                   </div>
                </div>
              </div>

              <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                 <p className="text-[10px] font-bold text-slate-400 italic">This is a computer generated invoice and does not require a physical signature.</p>
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center">
                       <ShieldCheck size={16} className="text-sky-600" />
                    </div>
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Verified Payment Gateway</span>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-content, .print-content * { visibility: visible; }
          .print-content { position: absolute; left: 0; top: 0; width: 100%; }
          .fixed, .sticky { display: none !important; }
        }
      `}</style>
    </AnimatePresence>
  );
};
