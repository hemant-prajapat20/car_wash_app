import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Search, CalendarCheck, History, 
  User, LogOut, Waves, ChevronLeft, Menu, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { logout } from '@shared/store/authSlice';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MENU_ITEMS = [
  { id: 'search', label: 'Search Vendors', icon: Search, path: '/customer/search' },
  { id: 'book', label: 'Book Service', icon: CalendarCheck, path: '/customer/book' },
  { id: 'bookings', label: 'My Bookings', icon: History, path: '/customer/bookings' },
  { id: 'profile', label: 'Profile Settings', icon: User, path: '/customer/profile' },
];

interface SidebarProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobileOpen = isOpen || false;
  const setIsMobileOpen = setIsOpen || (() => {});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const SidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-100 font-inter overflow-hidden">
      {/* Branding */}
      <div className={cn(
        "p-5 flex items-center gap-3 transition-all duration-300 shrink-0",
        isCollapsed ? "justify-center" : "justify-start"
      )}>
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
          <Waves size={16} color="#fff" />
        </div>
        {!isCollapsed && (
          <span className="text-[14px] font-semibold text-slate-900 tracking-tight whitespace-nowrap uppercase">
            Chakachak
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-1.5 space-y-0.5">
        {MENU_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all group relative",
              isActive 
                ? "bg-blue-50 text-blue-600 font-semibold" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium"
            )}
            onClick={() => setIsMobileOpen(false)}
          >
            <item.icon size={17} className={cn(
              "shrink-0 transition-colors",
              isCollapsed ? "mx-auto" : ""
            )} />
            {!isCollapsed && <span className="text-[12.5px] tracking-tight">{item.label}</span>}
            
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100] shadow-xl font-semibold">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-50 shrink-0">
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-all font-semibold group relative",
            isCollapsed ? "justify-center" : ""
          )}
        >
          <LogOut size={17} />
          {!isCollapsed && <span className="text-[12.5px] tracking-tight">Logout</span>}
        </button>
      </div>

      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-2.5 top-14 w-5 h-5 bg-white border border-slate-200 rounded-full items-center justify-center shadow-sm hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-600 z-50"
      >
        <ChevronLeft size={12} className={cn("transition-transform duration-300", isCollapsed && "rotate-180")} />
      </button>
    </div>
  );

  return (
    <>
      <aside className={cn(
        "hidden lg:block h-screen fixed top-0 left-0 z-40 transition-all duration-300",
        isCollapsed ? "w-16" : "w-60"
      )}>
        {SidebarContent}
      </aside>

      {!isMobileOpen && (
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden fixed top-3 left-4 z-40 p-1.5 bg-white rounded-lg shadow-md border border-slate-100 text-slate-600"
        >
          <Menu size={18} />
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
              className="lg:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[60]"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-64 z-[70]"
            >
              <div className="absolute top-3 right-3 z-[80]">
                <button onClick={() => setIsMobileOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                  <X size={20} />
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
