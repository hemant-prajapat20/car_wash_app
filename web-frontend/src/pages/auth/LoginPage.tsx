import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Mail, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { authService } from '../../services/authService';
import { setCredentials } from '@shared/store/authSlice';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrorField(null);
    setIsSubmitting(true);

    try {
      const response = await authService.login({ email, password });
      
      if (response.success) {
        const userData = response.data;
        toast.success(`Welcome back, ${userData.fullName || 'User'}!`);
        
        dispatch(setCredentials({ 
          user: userData, 
          token: userData.token 
        }));

        const role = userData.role;
        if (role === 'admin' || role === 'superAdmin') navigate('/admin/dashboard');
        else if (role === 'vendor') navigate('/vendor/dashboard');
        else navigate('/customer/dashboard');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid credentials.';
      const field = err.response?.data?.field || null;
      setError(msg);
      setErrorField(field);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Sign in to your professional dashboard."
    >
      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[10px] font-bold text-red-600 flex items-center gap-2">
            <span className="w-1 h-1 bg-red-500 rounded-full" />
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
          <div className="relative group">
            <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${errorField === 'email' ? 'text-red-500' : 'text-slate-400 group-focus-within:text-blue-600'}`}>
              <Mail size={14} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorField === 'email') setErrorField(null);
              }}
              placeholder="name@company.com"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-300 outline-none ring-0 transition-all focus:bg-white ${errorField === 'email' ? 'border-red-500 bg-red-50/30' : 'border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}`}
              required
            />
          </div>
        </div>

        <PasswordInput 
          value={password} 
          onChange={(e) => {
            setPassword(e.target.value);
            if (errorField === 'password') setErrorField(null);
          }} 
          error={errorField === 'password'}
          compact
        />

        <div className="flex items-center justify-end">
          <Link to="/forgot-password" className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all text-sm"
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-50">
        <p className="text-center text-slate-500 text-[11px] font-medium">
          Don't have an account? {' '}
          <Link to="/signup" className="text-blue-600 font-bold hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
