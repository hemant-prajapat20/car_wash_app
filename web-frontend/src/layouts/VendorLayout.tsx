import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { VendorSidebar } from '../components/vendor/VendorSidebar';
import { Search, User, Inbox, Users2, Package, ChevronRight, Loader2, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { NotificationDropdown } from '../components/shared/NotificationDropdown';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/axiosConfig';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

/* ── Search Results Dropdown ──────────────────────── */
const SearchResults: React.FC<{ 
  results: any; 
  loading: boolean; 
  onClose: () => void; 
}> = ({ results, loading, onClose }) => {
  const navigate = useNavigate();
  
  if (!results && !loading) return null;

  const hasResults = results && (results.bookings?.length > 0 || results.workers?.length > 0 || results.services?.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100] max-h-[480px] flex flex-col"
    >
      <div className="p-3 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Search Results</span>
        <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-lg transition-colors">
          <X size={14} className="text-slate-400" />
        </button>
      </div>

      <div className="overflow-y-auto p-2 space-y-4">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="animate-spin" size={24} />
            <span className="text-xs font-bold tracking-tight">Searching your dashboard...</span>
          </div>
        ) : !hasResults ? (
          <div className="py-12 text-center">
            <p className="text-sm font-bold text-slate-400 tracking-tight">No results found matching your query.</p>
          </div>
        ) : (
          <>
            {/* Bookings Section */}
            {results.bookings?.length > 0 && (
              <div>
                <div className="px-3 py-1 flex items-center gap-2 text-blue-600 mb-1">
                  <Inbox size={12} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Bookings</span>
                </div>
                {results.bookings.map((b: any) => (
                  <button
                    key={b._id}
                    onClick={() => { navigate(`/vendor/bookings?id=${b._id}`); onClose(); }}
                    className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-all group flex items-center justify-between"
                  >
                    <div>
                      <p className="text-[13px] font-bold text-slate-900">{(b.customer as any)?.fullName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-medium">#{b._id.slice(-6).toUpperCase()}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{b.status}</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </button>
                ))}
              </div>
            )}

            {/* Workers Section */}
            {results.workers?.length > 0 && (
              <div>
                <div className="px-3 py-1 flex items-center gap-2 text-emerald-600 mb-1">
                  <Users2 size={12} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Workers</span>
                </div>
                {results.workers.map((w: any) => (
                  <button
                    key={w._id}
                    onClick={() => { navigate(`/vendor/workers`); onClose(); }}
                    className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-all group flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <User size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-bold text-slate-900">{w.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{w.expertise}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-600 transition-colors" />
                  </button>
                ))}
              </div>
            )}

            {/* Services Section */}
            {results.services?.length > 0 && (
              <div>
                <div className="px-3 py-1 flex items-center gap-2 text-orange-600 mb-1">
                  <Package size={12} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Services</span>
                </div>
                {results.services.map((s: any) => (
                  <button
                    key={s._id}
                    onClick={() => { navigate(`/vendor/services`); onClose(); }}
                    className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-all group flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                      <Package size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-bold text-slate-900">{s.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium tracking-tight">${s.price} • {s.duration} min</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-orange-600 transition-colors" />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End of results</p>
      </div>
    </motion.div>
  );
};

/* ── Main Layout ──────────────────────────────────── */
export const VendorLayout: React.FC = () => {
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [collapsed,   setCollapsed]   = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const { user }  = useSelector((state: any) => state.auth);
  const navigate  = useNavigate();
  const isDesktop = useIsDesktop();

  /* ── Search logic ────────────────────────────────── */
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setSearchLoading(true);
        try {
          const res = await api.get(`/vendor/search?query=${searchQuery}`);
          if (res.data.success) {
            setSearchResults(res.data.data);
          }
        } catch (err) {
          console.error('Search failed', err);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSearchResults(null);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  /* Close search on click outside */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults(null);
        setShowMobileSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-md relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
              size={15}
            />
            <input
              type="text"
              placeholder="Search bookings, workers, services…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-2 text-[13px] focus:ring-4 focus:ring-blue-600/5 focus:bg-white focus:border-blue-200 transition-all outline-none"
            />
            
            <AnimatePresence>
              {searchResults && (
                <SearchResults 
                  results={searchResults} 
                  loading={searchLoading} 
                  onClose={() => setSearchResults(null)} 
                />
              )}
            </AnimatePresence>
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
        <AnimatePresence>
          {showMobileSearch && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden px-3 py-2 bg-white border-b border-slate-100 overflow-hidden"
            >
              <div ref={searchRef} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search bookings, workers…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-2.5 text-[13px] outline-none focus:border-blue-200"
                />
                
                {searchResults && (
                  <div className="relative mt-2">
                    <SearchResults 
                      results={searchResults} 
                      loading={searchLoading} 
                      onClose={() => { setSearchResults(null); setShowMobileSearch(false); }} 
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Page content ──────────────────────────────── */}
        <main className="flex-1 p-3 sm:p-5 md:p-6 lg:p-8 w-full max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
