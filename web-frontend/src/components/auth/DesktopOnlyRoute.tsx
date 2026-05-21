import React, { useEffect, useState } from 'react';
import { Monitor } from 'lucide-react';

export const DesktopOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mb-6">
          <Monitor size={32} className="text-blue-500" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Desktop Restricted</h1>
        <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
          The SuperAdmin control panel requires a larger screen for security and optimal usability. Please access this page from a desktop or laptop computer.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
