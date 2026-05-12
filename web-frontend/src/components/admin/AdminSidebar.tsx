import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, UserPlus, Users, 
  BellRing, UserCheck, LogOut, 
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

const ADMIN_MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { id: 'register', label: 'Register Vendor', icon: UserPlus, path: '/admin/register-vendor' },
  { id: 'vendors', label: 'Vendors Profile', icon: Users, path: '/admin/vendors' },
  { id: 'notifications', label: 'Notification Center', icon: BellRing, path: '/admin/notifications' },
  { id: 'profile', label: 'Admin Profile', icon: UserCheck, path: '/admin/profile' },
];

export const AdminSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const SidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 font-inter overflow-hidden">
      {/* Branding */}
      <div className={cn(
        "p-6 flex items-center gap-3 transition-all duration-300 shrink-0",
        isCollapsed ? "justify-center" : "justify-start"
      )}>
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
          <Waves size={18} color="#fff" />
        </div>
        {!isCollapsed && (
          <span className="text-sm font-semibold text-white tracking-tight whitespace-nowrap">
            Chakachak Admin
          </span>
        )}
      </div>

      {/* Admin Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {ADMIN_MENU_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
              isActive 
                ? "bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
            onClick={() => setIsMobileOpen(false)}
          >
            <item.icon size={18} className="shrink-0" />
            {!isCollapsed && <span className="text-[13px] tracking-tight">{item.label}</span>}
            
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-white text-slate-900 text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100] shadow-xl font-bold">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout - Always Fixed */}
      <div className="p-3 border-t border-slate-800 shrink-0">
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all font-semibold group relative",
            isCollapsed ? "justify-center" : ""
          )}
        >
          <LogOut size={18} />
          {!isCollapsed && <span className="text-[13px] tracking-tight">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-3 top-10 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full items-center justify-center shadow-sm hover:bg-slate-700 transition-all text-slate-400 hover:text-white z-50"
      >
        <ChevronLeft size={14} className={cn("transition-transform duration-300", isCollapsed && "rotate-180")} />
      </button>
    </div>
  );

  return (
    <>
      <aside className={cn(
        "hidden lg:block h-screen fixed top-0 left-0 z-40 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}>
        {SidebarContent}
      </aside>

      {!isMobileOpen && (
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden fixed top-3.5 left-4 z-40 p-2 bg-slate-900 rounded-xl shadow-lg border border-slate-800 text-slate-400"
        >
          <Menu size={20} />
        </button>
      )}

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60]"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-72 z-[70]"
            >
              <div className="absolute top-4 right-4 z-[80]">
                <button onClick={() => setIsMobileOpen(false)} className="p-2 text-slate-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
