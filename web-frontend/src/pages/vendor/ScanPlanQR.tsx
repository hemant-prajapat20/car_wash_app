import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { ScanLine, CheckCircle2, AlertCircle, Sparkles, QrCode } from 'lucide-react';
import api from '../../services/axiosConfig';

export const ScanPlanQR: React.FC = () => {
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    const timer = setTimeout(() => {
      // Clear container to prevent duplicate scanner UI
      const container = document.getElementById("qr-reader");
      if (container) {
        container.innerHTML = "";
      }

      // Initialize Scanner
      scanner = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 }, 
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA] 
        },
        false
      );
      scannerRef.current = scanner;
      scanner.render(onScanSuccess, onScanFailure);
    }, 200);

    return () => {
      clearTimeout(timer);
      if (scanner) {
        scanner.clear().catch(console.error);
      }
    };
  }, []);

  const onScanSuccess = async (decodedText: string) => {
    if (loading) return; // Prevent multiple requests

    try {
      const data = JSON.parse(decodedText);
      if (!data.token) throw new Error("Invalid QR code format");

      if (scannerRef.current) {
        scannerRef.current.pause(true); // Pause scanning
      }
      
      setLoading(true);
      setError('');
      setScanResult(null);

      const response = await api.post('/plans/vendor/scan', { token: data.token });
      setScanResult(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to scan QR code');
    } finally {
      setLoading(false);
      setTimeout(() => {
        if (scannerRef.current) {
          scannerRef.current.resume();
        }
      }, 3000); // Resume scanning after 3 seconds
    }
  };

  const onScanFailure = (error: any) => {
    // Suppress spammy log
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl font-inter">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ScanLine className="text-blue-600" size={20} />
            Scan Subscription Plan
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Scan customer QR codes to redeem washes instantly</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Side: Scanner */}
        <div className="bg-white rounded-3xl border border-slate-100/80 p-5 shadow-sm overflow-hidden">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <QrCode size={12} className="text-blue-500" /> Active Scanner Camera
            </span>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          </div>
          <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
            <div id="qr-reader" className="w-full"></div>
          </div>
        </div>

        {/* Right Side: Scan Results & Instructions */}
        <div className="space-y-4">
          {loading && (
            <div className="bg-blue-50/50 border border-blue-100 text-blue-600 p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-xs font-black uppercase tracking-wider">Verifying Subscription QR</p>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Checking with network...</p>
            </div>
          )}

          {error && !loading && (
            <div className="bg-rose-50/50 border border-rose-100 text-rose-600 p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mb-4 text-rose-500">
                <AlertCircle size={24} />
              </div>
              <p className="text-xs font-black uppercase tracking-wider">Redeem Failed</p>
              <p className="text-xs font-bold text-slate-600 mt-2">{error}</p>
              <p className="text-[9px] font-bold text-rose-400 uppercase tracking-widest mt-4">Scanner will resume in 3s</p>
            </div>
          )}

          {scanResult && !loading && (
            <div className="bg-emerald-50/50 border border-emerald-100 text-emerald-700 p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full translate-x-8 -translate-y-8" />
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 text-emerald-600">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-xs font-black uppercase tracking-wider">Service Redeemed Successfully!</p>
              
              <div className="mt-4 space-y-2.5 w-full">
                <div className="bg-white border border-emerald-100/50 rounded-2xl p-4 flex justify-between items-center shadow-sm">
                  <div className="text-left">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Remaining Services</span>
                    <span className="text-xl font-black text-slate-900 leading-none">{scanResult.remainingServices} Services</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded ${
                    scanResult.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {scanResult.status}
                  </span>
                </div>
              </div>
              
              <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-6">Next scan available in 3s</p>
            </div>
          )}

          {!loading && !error && !scanResult && (
            <div className="bg-white rounded-3xl border border-slate-100/80 p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-14 h-14 bg-slate-50 border border-slate-100/50 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
                <ScanLine size={24} />
              </div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">Waiting for QR Code</h3>
              <p className="text-[11px] font-semibold text-slate-400 leading-relaxed max-w-[240px] mt-1.5">
                Align the customer's subscription QR code inside the camera preview area to scan.
              </p>
              
              <div className="mt-6 border-t border-slate-50 pt-5 w-full space-y-2.5 text-left">
                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles size={12} className="text-blue-500" /> Redemption Guidelines
                </h4>
                <ul className="space-y-1.5 text-[11px] font-semibold text-slate-500">
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-blue-500 rounded-full" />
                    Washes decrement by 1 per successful scan.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-blue-500 rounded-full" />
                    Expired or exhausted plans will fail validation.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
