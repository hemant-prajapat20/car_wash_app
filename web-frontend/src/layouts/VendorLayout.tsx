import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { VendorSidebar } from '../components/vendor/VendorSidebar';
import { Search, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { NotificationDropdown } from '../components/shared/NotificationDropdown';
import api from '../services/axiosConfig';

/* ── Reactive breakpoint hook ─────────────────────── */
function useIsDesktop(breakpoint = 1024) {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= breakpoint
  );
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`);
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);
  return isDesktop;
}

export const VendorLayout: React.FC = () => {
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [collapsed,   setCollapsed]   = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { user }  = useSelector((state: any) => state.auth);
  const navigate  = useNavigate();
  const isDesktop = useIsDesktop();

  /* Sidebar padding — only on desktop */
  const contentPadding = isDesktop
    ? (collapsed ? '4rem' : '15rem')
    : '0';

  return (
    <div className="flex min-h-screen bg-slate-50 font-inter text-slate-900 overflow-x-hidden">
      <VendorSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* ── Main content ──────────────────────────────── */}
      <div
        style={{ paddingLeft: contentPadding }}
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
      >
        {/* ── Sticky header ─────────────────────────── */}
        <header className="h-14 md:h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[60] flex items-center px-3 sm:px-5 md:px-8 gap-2">

          {/* Mobile: hamburger + brand */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-all"
              aria-label="Open menu"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6"  x2="17" y2="6"  />
                <line x1="3" y1="11" x2="17" y2="11" />
                <line x1="3" y1="16" x2="17" y2="16" />
              </svg>
            </button>
            <span className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">Vendor Portal</span>
          </div>

          {/* Desktop search bar */}
          <div className="hidden md:flex flex-1 max-w-md relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
              size={15}
            />
            <input
              type="text"
              placeholder="Search bookings, customers…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-2 text-[13px] focus:ring-4 focus:ring-blue-600/5 focus:bg-white focus:border-blue-200 transition-all outline-none"
            />
          </div>

          <div className="hidden md:block flex-1" />

          {/* Mobile search icon */}
          <button
            className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-all ml-auto"
            onClick={() => setShowMobileSearch(v => !v)}
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <NotificationDropdown />

            <div className="h-5 w-px bg-slate-100 hidden sm:block" />

            {/* Vendor profile */}
            <button
              onClick={() => navigate('/vendor/profile')}
              className="flex items-center gap-2 group"
              title="Vendor Profile"
            >
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[11px] font-bold text-slate-900 leading-none">{user?.fullName || 'Vendor'}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">Vendor Portal</span>
              </div>
              <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all overflow-hidden shrink-0">
                {user?.avatar
                  ? <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  : <User size={16} />}
              </div>
            </button>
          </div>
        </header>

        {/* Mobile expandable search */}
        {showMobileSearch && (
          <div className="md:hidden px-3 py-2 bg-white border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                autoFocus
                type="text"
                placeholder="Search bookings, customers…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-2.5 text-[13px] outline-none focus:border-blue-200"
              />
            </div>
          </div>
        )}

        {/* ── Page content ──────────────────────────────── */}
        <main className="flex-1 p-3 sm:p-5 md:p-6 lg:p-8 w-full max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
