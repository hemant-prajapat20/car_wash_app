import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Mail, ShieldAlert, Loader2, ArrowRight, KeyRound } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { authService } from '../../services/authService';
import { setCredentials } from '../../store/authSlice';

export const AdminLoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    secretKey: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await authService.adminLogin(formData);
      
      if (response.success) {
        const userData = response.data;
        dispatch(setCredentials({ 
          user: userData, 
          token: userData.token 
        }));
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Access Denied. Check credentials and secret key.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout 
      title="System Access" 
      subtitle="SuperAdmin authentication required to access global platform settings."
    >
      <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3">
        <ShieldAlert size={20} className="text-amber-600 shrink-0" />
        <p className="text-[11px] font-medium text-amber-700 leading-relaxed">
          This portal is restricted to authorized personnel only. All access attempts are logged and monitored.
        </p>
      </div>

      <form onSubmit={handleAdminLogin} className="space-y-5">
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-100 rounded-2xl text-[11px] font-semibold text-red-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Admin Email</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
              <Mail size={16} />
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="admin@chakachak.com"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-300 outline-none ring-0 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all focus:bg-white"
              required
            />
          </div>
        </div>

        <PasswordInput 
          label="Administrator Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />

        <div className="space-y-1.5 pt-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">System Secret Key</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
              <KeyRound size={16} />
            </div>
            <input
              type="password"
              value={formData.secretKey}
              onChange={(e) => setFormData({...formData, secretKey: e.target.value})}
              placeholder="••••••••••••"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-300 outline-none ring-0 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all focus:bg-white"
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
              <span>Authorize Access</span>
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
