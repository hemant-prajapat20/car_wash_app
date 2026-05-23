import React, { useEffect, useState } from 'react';
import { 
  Users, 
  UserCheck, 
  CalendarCheck, 
  Banknote, 
  UserPlus, 
  Clock,
  TrendingUp,
  ArrowUpRight,
  MoreVertical,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import axiosInstance from '../../services/axiosConfig';
import toast from 'react-hot-toast';

import { NotificationDropdown } from '../../components/shared/NotificationDropdown';

import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface Stats {
  totalVendors: number;
  activeVendors: number;
  totalBookings: number;
  totalCustomers: number;
  totalRevenue: number;
  todayRegistrations?: number;
  pendingRequests?: number;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const lastNotifRef = React.useRef<string>('');

  useEffect(() => {
    // Failsafe timeout
    const failsafe = setTimeout(() => {
      if (loading) {
        setLoading(false);
        if (!stats) setStats({ totalVendors: 0, activeVendors: 0, totalBookings: 0, totalCustomers: 0, totalRevenue: 0, todayRegistrations: 0, pendingRequests: 0 });
      }
    }, 3000);

    const fetchStats = async (isPolling = false) => {
      try {
        const response = await axiosInstance.get('/admin/stats');
        if (response.data && response.data.success) {
          setStats(response.data.data.stats);
          
          const rawNotifs = response.data.data.recentNotifications || [];
          
          if (rawNotifs.length > 0) {
            const latestNotifId = rawNotifs[0]._id;
            
            // If polling and we see a new notification, play sound
            if (isPolling && lastNotifRef.current && lastNotifRef.current !== latestNotifId) {
              const audio = new Audio('/sounds/notification.mp3');
              audio.play().catch(e => console.error('Audio play failed:', e));
              toast.success('New System Activity Detected');
            }
            
            lastNotifRef.current = latestNotifId;
          }

          // Map notifications to activity feed
          const activities = rawNotifs.map((n: any) => {
            let icon = ShieldCheck;
            if (n.type === 'vendor_registration') icon = UserPlus;
            if (n.status === 'warning') icon = MoreVertical;
            
            return {
              type: n.title,
              desc: n.message,
              time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              date: new Date(n.createdAt).toLocaleDateString(),
              status: n.status === 'success' ? 'Success' : n.status === 'warning' ? 'Warning' : 'Info',
              icon
            };
          });
          
          // Add a system audit log if no recent notifications
          if (activities.length === 0) {
            activities.push({
              type: 'System Audit',
              desc: 'Platform health check completed successfully',
              time: 'Just now',
              date: new Date().toLocaleDateString(),
              status: 'Stable',
              icon: ShieldCheck
            });
          }
          
          setRecentActivity(activities);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        if (!isPolling) setLoading(false);
        clearTimeout(failsafe);
      }
    };
    
    // Initial fetch
    fetchStats();
    
    // Poll every 15 seconds
    const intervalId = setInterval(() => fetchStats(true), 15000);
    
    return () => {
      clearTimeout(failsafe);
      clearInterval(intervalId);
    };
  }, []);

  if (loading && !stats) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
        <p className="text-sm font-bold text-slate-400 animate-pulse">Initializing Dashboard Visibility...</p>
      </div>
    );
  }

  const statCards = [
    { name: 'Total Vendors', value: stats?.totalVendors || 0, icon: Users, color: 'blue', trend: 'Vendors' },
    { name: 'Active Vendors', value: stats?.activeVendors || 0, icon: UserCheck, color: 'emerald', trend: 'Active' },
    { name: 'Total Bookings', value: stats?.totalBookings || 0, icon: CalendarCheck, color: 'indigo', trend: 'Bookings' },
    { name: 'Total Customers', value: stats?.totalCustomers || 0, icon: Users, color: 'blue', trend: 'Customers' },
    { name: 'Total Revenue', value: `₹${stats?.totalRevenue || 0}`, icon: Banknote, color: 'emerald', trend: 'Revenue' },
    { name: 'Today Reg.', value: stats?.todayRegistrations || 0, icon: UserPlus, color: 'amber', trend: 'Today' },
    { name: 'Pending Requests', value: stats?.pendingRequests || 0, icon: Clock, color: 'rose', trend: 'Pending' },
  ];

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h2>
        <p className="text-sm font-medium text-slate-500 mt-1">Platform-wide operations and vendor management metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div key={card.name} className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-2xl bg-${card.color}-50 text-${card.color}-600 group-hover:scale-110 transition-transform`}>
                <card.icon size={20} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg bg-${card.color === 'rose' || card.color === 'indigo' ? 'slate' : 'emerald'}-50 text-${card.color === 'rose' || card.color === 'indigo' ? 'slate' : 'emerald'}-600`}>
                {card.trend}
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">{card.name}</p>
            <h3 className="text-xl font-bold text-slate-900">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Operation History */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock size={18} className="text-blue-600" />
              Recent Operations History
            </h4>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Logs</span>
            </div>
          </div>
          
          <div className="space-y-6">
            {recentActivity.map((op, i) => (
              <div key={i} className="flex items-start justify-between group">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <op.icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 mb-1">{op.type}</p>
                    <p className="text-[11px] font-medium text-slate-500">{op.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 mb-1">{op.time}</p>
                  <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">{op.status}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-10 py-3 bg-slate-50 hover:bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors">
            Download Global Operations Log
          </button>
        </div>

      </div>
    </div>
  );
};
