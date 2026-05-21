import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShieldCheck, Loader2, ArrowRight, KeyRound } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { authService } from '../../services/authService';
import { setCredentials } from '../../store/authSlice';
import toast from 'react-hot-toast';

export const AdminAccessPage: React.FC = () => {
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAdminAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await authService.adminAccess(secretKey);
      
      if (response.success) {
        toast.success("Identity Verified. Welcome Admin.");
        dispatch(setCredentials({ 
          user: response.data, 
          token: response.data.token 
        }));
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      let msg = 'An unexpected error occurred.';
      
      if (err.response) {
        // The request was made and the server responded with a status code out of the range of 2xx
        msg = err.response.data?.message || 'Invalid Secret Key. Access Denied.';
      } else if (err.request) {
        // The request was made but no response was received (Network error, CORS, or server down)
        msg = 'Network Error: Cannot connect to the server. Please check your backend URL and connection.';
      } else {
        // Something happened in setting up the request
        msg = err.message;
      }

      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout 
      title="Admin Access" 
      subtitle="Enter your system secret key to continue."
    >
      <form onSubmit={handleAdminAccess} className="space-y-6 mt-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[10px] font-bold text-red-600 flex items-center gap-2">
            <span className="w-1 h-1 bg-red-500 rounded-full" />
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Administrator Secret Key</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
              <KeyRound size={16} />
            </div>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-300 outline-none ring-0 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all focus:bg-white"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white py-4 rounded-2xl font-bold shadow-lg shadow-slate-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          {isSubmitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              <span>Unlock Admin Panel</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button 
          onClick={() => navigate('/login')}
          className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
        >
          Return to Staff Portal
        </button>
      </div>
    </AuthLayout>
  );
};
