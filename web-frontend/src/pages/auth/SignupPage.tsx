import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Mail, User, Loader2, ArrowRight, ShieldCheck, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { authService } from '../../services/authService';
import { setCredentials } from '@shared/store/authSlice';

export const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      const msg = "Passwords do not match.";
      setError(msg);
      toast.error(msg);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authService.signup({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password
      });
      
      if (response.success) {
        toast.success("Account created successfully!");
        dispatch(setCredentials({ 
          user: response.data.user, 
          token: response.data.token 
        }));
        navigate('/customer/dashboard');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Check your details.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join the premium car wash network."
    >
      <form onSubmit={handleSignup} className="space-y-3.5">
        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
          <div className="relative group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
              <User size={14} />
            </div>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              placeholder="John Doe"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-300 outline-none ring-0 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all focus:bg-white"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
          <div className="relative group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
              <Mail size={14} />
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="name@company.com"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-300 outline-none ring-0 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all focus:bg-white"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
          <div className="relative group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
              <Phone size={14} />
            </div>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              placeholder="+1 (234) 567-890"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-300 outline-none ring-0 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all focus:bg-white"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <PasswordInput 
            label="Password"
            value={formData.password} 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            compact
          />
          <PasswordInput 
            label="Confirm"
            value={formData.confirmPassword} 
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
            compact
          />
        </div>

        <div className="flex items-start gap-2 py-1">
          <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
          <p className="text-[9px] text-slate-400 leading-tight font-medium">
            By signing up, you agree to our <span className="text-blue-600 font-bold">Terms</span> and <span className="text-blue-600 font-bold">Privacy Policy</span>.
          </p>
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
              <span>Create Account</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="mt-5 pt-5 border-t border-slate-50">
        <p className="text-center text-slate-500 text-[11px] font-medium">
          Already have an account? {' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
