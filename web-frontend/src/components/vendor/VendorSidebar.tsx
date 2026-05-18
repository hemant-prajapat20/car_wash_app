import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Inbox, Clock, Package,
  Users, Bell, UserCircle, LogOut,
  BarChart3, Users2, Receipt,
  Waves, ChevronLeft, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { logout } from '@shared/store/authSlice';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const VENDOR_MENU_ITEMS = [
  { id: 'dashboard',     label: 'Dashboard',        icon: LayoutDashboard, path: '/vendor/dashboard' },
  { id: 'bookings',      label: 'Manage Bookings',  icon: Inbox,           path: '/vendor/bookings' },
  { id: 'slots',         label: 'Slot Management',  icon: Clock,           path: '/vendor/slots' },
  { id: 'services',      label: 'Services & Packages', icon: Package,      path: '/vendor/services' },
  { id: 'workers',       label: 'Manage Workers',   icon: Users2,          path: '/vendor/workers' },
  { id: 'customers',     label: 'Customers',        icon: Users,           path: '/vendor/customers' },
  { id: 'transactions',  label: 'Transactions',     icon: Receipt,         path: '/vendor/transactions' },
  { id: 'reports',       label: 'Reports',          icon: BarChart3,       path: '/vendor/reports' },
  { id: 'notifications', label: 'Notifications',    icon: Bell,            path: '/vendor/notifications' },
  { id: 'profile',       label: 'Vendor Profile',   icon: UserCircle,      path: '/vendor/profile' },
];

interface VendorSidebarProps {
  /** Mobile drawer — controlled by VendorLayout */
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  /** Desktop collapse — controlled by VendorLayout */
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export const VendorSidebar: React.FC<VendorSidebarProps> = ({
  mobileOpen,
  setMobileOpen,
  collapsed,
  setCollapsed,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  /* ── Shared nav items ─────────────────────────────── */
  const NavItems = ({ closeMobile = false }: { closeMobile?: boolean }) => (
    <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto custom-scrollbar">
      {VENDOR_MENU_ITEMS.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          onClick={() => closeMobile && setMobileOpen(false)}
          className={({ isActive }: { isActive: boolean }) => cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative',
            isActive
              ? 'bg-blue-50 text-blue-600 font-semibold'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium',
            collapsed && !closeMobile ? 'justify-center px-0' : ''
          )}
        >
          <item.icon size={17} className="shrink-0" />

          {(!collapsed || closeMobile) && (
            <span className="text-[12.5px] tracking-tight whitespace-nowrap">{item.label}</span>
          )}

          {/* Tooltip when desktop-collapsed */}
          {collapsed && !closeMobile && (
            <span className="
              absolute left-full ml-3 px-2.5 py-1.5
              bg-slate-900 text-white text-[10px] font-semibold rounded-lg
              opacity-0 group-hover:opacity-100 pointer-events-none
              transition-opacity whitespace-nowrap shadow-xl z-[200]
            ">
              {item.label}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );

  /* ── Brand / header strip ─────────────────────────── */
  const Brand = ({ showClose = false }: { showClose?: boolean }) => (
    <div className={cn(
      'h-14 md:h-16 flex items-center px-3 shrink-0 border-b border-slate-100',
      collapsed && !showClose ? 'justify-center' : 'justify-between'
    )}>
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
          <Waves size={16} color="#fff" />
        </div>
        {(!collapsed || showClose) && (
          <span className="text-[13px] font-bold text-slate-900 tracking-tight uppercase whitespace-nowrap">
            Chakachak Vendor
          </span>
        )}
      </div>

      {/* Desktop collapse toggle — inside header, never overlaps navbar */}
      {!showClose && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
        >
          <ChevronLeft
            size={15}
            className={cn('transition-transform duration-300', collapsed && 'rotate-180')}
          />
        </button>
      )}

      {showClose && (
        <button
          onClick={() => setMobileOpen(false)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );

  /* ── Logout button ────────────────────────────────── */
  const LogoutBtn = ({ showLabel = true }: { showLabel?: boolean }) => (
    <div className="p-2 border-t border-slate-50 shrink-0">
      <button
        onClick={handleLogout}
        className={cn(
          'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl',
          'text-rose-500 hover:bg-rose-50 transition-all font-semibold group relative',
          !showLabel ? 'justify-center px-0' : ''
        )}
      >
        <LogOut size={17} />
        {showLabel && <span className="text-[12.5px] tracking-tight">Logout</span>}
        {!showLabel && (
          <span className="
            absolute left-full ml-3 px-2.5 py-1.5
            bg-slate-900 text-white text-[10px] font-semibold rounded-lg
            opacity-0 group-hover:opacity-100 pointer-events-none
            transition-opacity whitespace-nowrap shadow-xl z-[200]
          ">
            Logout
          </span>
        )}
      </button>
    </div>
  );

  return (
    <>
      {/* ─── DESKTOP SIDEBAR ──────────────────────────── */}
      <aside
        style={{ width: collapsed ? '4rem' : '15rem' }}
        className="hidden lg:flex flex-col h-screen fixed top-0 left-0 z-40 bg-white border-r border-slate-100 transition-all duration-300 overflow-visible"
      >
        <Brand />
        <NavItems />
        <LogoutBtn showLabel={!collapsed} />
      </aside>

      {/* ─── MOBILE HAMBURGER ─────────────────────────── */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-[50] p-1.5 bg-white rounded-lg shadow-md border border-slate-100 text-slate-600 hover:bg-slate-50 transition-all"
        >
          <Menu size={20} />
        </button>
      )}

      {/* ─── MOBILE DRAWER ────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="vendor-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
            />
            <motion.aside
              key="vendor-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-64 z-[70] bg-white border-r border-slate-100 flex flex-col"
            >
              <Brand showClose />
              <NavItems closeMobile />
              <LogoutBtn />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar       { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #e2e8f0; }
      `}</style>
    </>
  );
};
