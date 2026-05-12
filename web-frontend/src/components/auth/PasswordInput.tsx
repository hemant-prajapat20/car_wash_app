import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string | boolean;
  placeholder?: string;
  compact?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ 
  value, 
  onChange, 
  label = "Password", 
  error, 
  placeholder = "••••••••",
  compact = false
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className={`space-y-${compact ? '1.5' : '2'}`}>
      <label className={`${compact ? 'text-[9px]' : 'text-[10px]'} font-bold text-slate-400 uppercase tracking-widest ${compact ? 'ml-1' : ''}`}>
        {label}
      </label>
      <div className="relative group">
        <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-red-500' : 'text-slate-400 group-focus-within:text-blue-600'}`}>
          <Lock size={compact ? 14 : 16} />
        </div>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-12 py-${compact ? '2.5' : '3.5'} bg-slate-50 border rounded-xl text-${compact ? 'xs' : 'sm'} font-medium text-slate-900 placeholder:text-slate-300 outline-none transition-all focus:bg-white ${error ? 'border-red-500 bg-red-50/30' : 'border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {show ? <EyeOff size={compact ? 16 : 20} /> : <Eye size={compact ? 16 : 20} />}
        </button>
      </div>
      {error && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{error}</p>}
    </div>
  );
};
