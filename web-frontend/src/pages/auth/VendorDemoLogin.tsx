import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@shared/store/authSlice';
import { Loader2 } from 'lucide-react';

export const VendorDemoLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Simulate a successful vendor login
    const timer = setTimeout(() => {
      dispatch(setCredentials({
        user: {
          id: 'DEMO_VENDOR_ID',
          fullName: 'Elite Auto Spa (Demo)',
          email: 'vendor@demo.com',
          role: 'vendor',
          isActive: true,
        },
        token: 'demo-vendor-jwt-token'
      }));
      navigate('/vendor/dashboard');
    }, 1000);

    return () => clearTimeout(timer);
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-inter">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200 border border-slate-100 flex flex-col items-center text-center max-w-sm">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 animate-bounce">
          <Loader2 size={32} className="animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Initializing Demo Portal</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          Setting up your demo vendor environment. Please wait a moment...
        </p>
      </div>
    </div>
  );
};
