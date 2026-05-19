import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { ScanLine, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/axiosConfig';

export const ScanPlanQR: React.FC = () => {
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Initialize Scanner
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 }, supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA] },
      false
    );
    scannerRef.current = scanner;

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ScanLine className="text-blue-600" />
          Scan Customer Plan
        </h1>
        <p className="text-sm text-slate-500 mt-1">Scan a customer's subscription QR code to consume a service.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div id="qr-reader" className="w-full"></div>
        </div>

        <div className="space-y-6">
          {loading && (
            <div className="bg-blue-50 text-blue-600 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-semibold">Processing scan...</p>
            </div>
          )}

          {error && !loading && (
            <div className="bg-rose-50 text-rose-600 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <AlertCircle size={48} className="mb-4 text-rose-500" />
              <p className="font-bold text-lg mb-1">Scan Failed</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {scanResult && !loading && (
            <div className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <CheckCircle2 size={48} className="mb-4 text-emerald-500" />
              <p className="font-bold text-lg mb-1">Service Consumed!</p>
              <p className="text-sm font-medium">Plan Status: {scanResult.status}</p>
              <p className="text-sm font-medium mt-1">Remaining Services: <span className="font-bold text-lg">{scanResult.remainingServices}</span></p>
            </div>
          )}

          {!loading && !error && !scanResult && (
            <div className="bg-slate-50 text-slate-500 p-6 rounded-2xl flex flex-col items-center justify-center text-center h-48 border border-slate-100">
              <ScanLine size={48} className="mb-4 opacity-50" />
              <p className="font-medium">Waiting for QR scan...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
