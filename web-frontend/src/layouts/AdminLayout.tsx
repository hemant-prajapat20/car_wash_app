import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { Bell, Search, ShieldCheck, Menu } from 'lucide-react';
import { useSelector } from 'react-redux';
import { NotificationDropdown } from '../components/shared/NotificationDropdown';
import api from '../services/axiosConfig';

export const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { user } = useSelector((state: any) => state.auth);

  return (
    <div className="flex min-h-screen bg-slate-50 font-inter text-slate-900 overflow-x-hidden">
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:pl-[260px]">
        {/* Admin Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <button 
            className="p-2 -ml-2 text-slate-400 lg:hidden hover:bg-slate-50 rounded-xl transition-all"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-4 flex-1 max-w-xl mx-4">
            <div className="relative w-full group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search vendors or system logs..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2 text-[13px] focus:ring-2 focus:ring-blue-600/10 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <NotificationDropdown />
            
            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />
            
            <div className="flex items-center gap-2 md:gap-3 group cursor-pointer">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-[11px] font-semibold text-slate-900 leading-none mb-1">{user?.fullName || 'Super Admin'}</span>
                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest leading-none">System Controller</span>
              </div>
              <div className="w-8 h-8 md:w-9 md:h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-900/10 shrink-0">
                <ShieldCheck size={18} />
              </div>
            </div>
          </div>
        </header>

        {/* Admin Content Container */}
        <main className="p-4 md:p-8 lg:p-10 w-full max-w-screen-2xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
