import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface PlanQRCodeProps {
  token: string;
}

export const PlanQRCode: React.FC<PlanQRCodeProps> = ({ token }) => {
  const payload = JSON.stringify({ token });

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="bg-white p-4 rounded-xl border-4 border-blue-50 shadow-md">
        <QRCodeSVG 
          value={payload} 
          size={200}
          level="H"
          fgColor="#0f172a" // slate-900
          bgColor="#ffffff"
        />
      </div>
      <p className="text-sm font-medium text-slate-500 mt-6 text-center max-w-[250px]">
        Show this QR code to the vendor at the shop to consume your service.
      </p>
    </div>
  );
};
