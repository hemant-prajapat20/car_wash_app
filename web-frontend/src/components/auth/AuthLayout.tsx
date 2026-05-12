import React from 'react';
import { Link } from 'react-router-dom';
import { Waves, ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-12 pb-24 px-6 font-inter relative overflow-hidden">
      {/* Static Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[360px] relative z-10">
        {/* Static Header (Branding only, no redirect) */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/10">
              <Waves size={16} color="#fff" />
            </div>
            <span className="text-sm font-bold text-slate-900 tracking-tight">Chakachak</span>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white p-6 rounded-[2rem] shadow-2xl shadow-slate-200/40 border border-white relative overflow-hidden">
          <div className="flex justify-end mb-4">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors shrink-0"
            >
              <ArrowLeft size={10} />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1.5">{title}</h1>
            <p className="text-[13px] font-medium text-slate-500 leading-relaxed">{subtitle}</p>
          </div>

          <div className="space-y-5">
            {children}
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] leading-relaxed opacity-70">
          &copy; 2026 Chakachak SaaS <br />
          Enterprise Grade Security
        </p>
      </div>
    </div>
  );
};
