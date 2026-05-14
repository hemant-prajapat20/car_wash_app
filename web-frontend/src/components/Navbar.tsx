import React, { useState, useEffect } from 'react';
import { Waves, Menu, X, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useActiveSection } from '../hooks/useActiveSection';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'statistics', label: 'Statistics' },
  { id: 'about', label: 'About' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { token, user } = useSelector((state: any) => state.auth);
  const isAuthenticated = !!token;
  const activeSection = useActiveSection(NAV_ITEMS.map(i => i.id));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 60;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
    setIsOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'superAdmin': return '/admin/dashboard';
      case 'vendor': return '/vendor/dashboard';
      default: return '/customer/dashboard';
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-inter ${scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-4' : 'bg-transparent py-6'
      }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        <div
          onClick={() => scrollToSection('home')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <Waves size={24} color="#fff" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">Chakachak</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${activeSection === item.id
                  ? 'bg-white text-blue-600 shadow-sm shadow-slate-200'
                  : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => navigate(getDashboardPath())}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold shadow-lg shadow-slate-200 flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95"
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 text-slate-600 font-semibold hover:text-slate-900 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden p-2 text-slate-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 p-6 shadow-xl animate-in slide-in-from-top-4">
          <div className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-left px-4 py-3 rounded-xl font-semibold ${activeSection === item.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600'
                  }`}
              >
                {item.label}
              </button>
            ))}
            <div className="h-px bg-slate-100 my-2" />

            {isAuthenticated ? (
              <button
                onClick={() => {
                  navigate(getDashboardPath());
                  setIsOpen(false);
                }}
                className="py-3 bg-slate-900 text-white font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <LayoutDashboard size={18} />
                <span>Go to Dashboard</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => navigate('/login')} className="py-3 text-slate-600 font-semibold border border-slate-200 rounded-xl">Login</button>
                <button onClick={() => navigate('/signup')} className="py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-200">Register</button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
