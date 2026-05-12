import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  Bell, 
  UserCircle, 
  LogOut, 
  ShieldCheck,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { logout } from '../../store/authSlice';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const AdminSidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Register Vendor', icon: UserPlus, path: '/admin/register-vendor' },
    { name: 'Vendors Profile', icon: Users, path: '/admin/vendors' },
    { name: 'Notifications', icon: Bell, path: '/admin/notifications' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 z-50
        w-[260px] bg-white border-r border-slate-100
        transition-transform duration-300 ease-in-out
        flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200">
              <ShieldCheck className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 tracking-tight">Chakachak</h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">SuperAdmin</p>
            </div>
          </div>
          <button className="lg:hidden ml-auto text-slate-400" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} className={isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-600'} />
                  <span className="text-xs font-bold tracking-wide">{item.name}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto text-slate-400" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 mt-auto border-t border-slate-50 space-y-1">
          <NavLink
            to="/admin/profile"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group
              ${isActive 
                ? 'bg-slate-100 text-slate-900' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
            `}
          >
            <UserCircle size={18} className="text-slate-400 group-hover:text-slate-600" />
            <span className="text-xs font-bold tracking-wide">Admin Profile</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all group"
          >
            <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
            <span className="text-xs font-bold tracking-wide">Logout Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};
