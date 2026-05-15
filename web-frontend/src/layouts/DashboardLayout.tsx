import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/customer/Sidebar';
import { Search, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { NotificationDropdown } from '../components/shared/NotificationDropdown';
import api from '../services/axiosConfig';

/* ── Reactive breakpoint hook ─────────────────────────── */
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

export const DashboardLayout: React.FC = () => {
  const [isSidebarOpen,      setIsSidebarOpen]      = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user }    = useSelector((state: any) => state.auth);
  const navigate    = useNavigate();
  const isDesktop   = useIsDesktop();

  /* ── Search state ─────────────────────────────────────── */
  const [vendors,     setVendors]     = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await api.get('/customer/search');
        if (res.data.success) setVendors(res.data.data);
      } catch { /* silent */ }
    };
    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter(v =>
    v.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.businessLocation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.activeServices?.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
    v.phone?.includes(searchQuery)
  ).slice(0, 5);

  /* ── Sidebar left-padding: only on desktop ─────────────── */
  const contentPadding = isDesktop
    ? (isSidebarCollapsed ? '4rem' : '15rem')
    : '0';

  return (
    <div className="flex min-h-screen bg-slate-50 font-inter text-slate-900 overflow-x-hidden">
      <Sidebar
        mobileOpen={isSidebarOpen}
        setMobileOpen={setIsSidebarOpen}
        collapsed={isSidebarCollapsed}
        setCollapsed={setIsSidebarCollapsed}
      />

      {/* ── Main content ──────────────────────────────────── */}
      <div
        style={{ paddingLeft: contentPadding }}
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
      >
        {/* ── Sticky header ─────────────────────────────── */}
        <header className="h-14 md:h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[60] flex items-center px-3 sm:px-5 md:px-8 gap-2">

          {/* Mobile: hamburger + brand */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-all"
              aria-label="Open menu"
            >
              {/* Hamburger icon */}
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6"  x2="17" y2="6"  />
                <line x1="3" y1="11" x2="17" y2="11" />
                <line x1="3" y1="16" x2="17" y2="16" />
              </svg>
            </button>
            <span className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">Chakachak</span>
          </div>

          {/* Desktop / tablet: search bar */}
          <div className="hidden md:flex flex-1 max-w-xl relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
              size={15}
            />
            <input
              type="text"
              placeholder="Search vendors, services, locations…"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowResults(e.target.value.length > 0); }}
              onFocus={() => searchQuery.length > 0 && setShowResults(true)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-2 text-[13px] focus:ring-4 focus:ring-blue-600/5 focus:bg-white focus:border-blue-200 transition-all outline-none"
            />

            {/* Autocomplete dropdown */}
            {showResults && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setShowResults(false)} />
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                  <div className="p-2 max-h-[380px] overflow-y-auto custom-scrollbar">
                    {filteredVendors.length > 0 ? (
                      <>
                        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Top Matches</div>
                        {filteredVendors.map(vendor => (
                          <button
                            key={vendor._id}
                            onClick={() => { navigate(`/customer/vendor/${vendor._id}`); setShowResults(false); setSearchQuery(''); }}
                            className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-all text-left group"
                          >
                            <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-slate-200 group-hover:border-blue-200 transition-all">
                              {vendor.avatar
                                ? <img src={vendor.avatar} alt="" className="w-full h-full object-cover" />
                                : <User size={16} className="text-slate-400" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[13px] font-bold text-slate-900 truncate">{vendor.companyName || vendor.fullName}</div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
                                <span className="truncate">{vendor.businessLocation}</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full shrink-0" />
                                <span className="text-blue-600 font-semibold">₹{vendor.startingPrice}</span>
                              </div>
                            </div>
                          </button>
                        ))}
                        <button
                          onClick={() => { navigate('/customer/search', { state: { query: searchQuery } }); setShowResults(false); }}
                          className="w-full p-3 text-[11px] font-bold text-blue-600 hover:bg-blue-50 transition-all text-center border-t border-slate-50"
                        >
                          View all results for "{searchQuery}"
                        </button>
                      </>
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">No vendors found</p>
                        <p className="text-[11px] text-slate-400 mt-1">Try a different city or service</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Spacer on desktop when no search expanded */}
          <div className="hidden md:block flex-1" />

          {/* Mobile: search icon button */}
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

            {/* Profile */}
            <button
              onClick={() => navigate('/customer/profile')}
              className="flex items-center gap-2 group"
              title="My Profile"
            >
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[11px] font-bold text-slate-900 leading-none">{user?.fullName || 'Guest'}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">Customer</span>
              </div>
              <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all overflow-hidden shrink-0">
                {user?.avatar
                  ? <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                  : <User size={16} />}
              </div>
            </button>
          </div>
        </header>

        {/* Mobile expandable search bar */}
        {showMobileSearch && (
          <div className="md:hidden px-3 py-2 bg-white border-b border-slate-100 z-[55]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                autoFocus
                type="text"
                placeholder="Search vendors or services…"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setShowResults(e.target.value.length > 0); }}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-2.5 text-[13px] outline-none focus:border-blue-200"
              />
            </div>
            {/* Mobile search results */}
            {showResults && filteredVendors.length > 0 && (
              <div className="mt-2 bg-white rounded-xl border border-slate-100 shadow-xl overflow-hidden">
                {filteredVendors.map(vendor => (
                  <button
                    key={vendor._id}
                    onClick={() => { navigate(`/customer/vendor/${vendor._id}`); setShowResults(false); setShowMobileSearch(false); setSearchQuery(''); }}
                    className="w-full flex items-center gap-3 px-4 py-3 border-b border-slate-50 last:border-none hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {vendor.avatar ? <img src={vendor.avatar} className="w-full h-full object-cover" /> : <User size={14} className="text-slate-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-slate-900 truncate">{vendor.companyName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{vendor.businessLocation}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Page content ──────────────────────────────── */}
        <main className="flex-1 p-3 sm:p-5 md:p-8 lg:p-10 w-full max-w-screen-2xl mx-auto">
          <Outlet />
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar       { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #e2e8f0; }
      `}</style>
    </div>
  );
};
