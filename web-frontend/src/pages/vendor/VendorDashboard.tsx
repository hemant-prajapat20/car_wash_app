import React, { useEffect, useState } from 'react';
import { 
  Bell, CheckCircle2, Info, AlertTriangle, XCircle, MoreVertical, Check, Trash2, Loader2, ArrowRight, X, FileText, ShoppingBag, Users, BarChart3, TrendingUp, Clock, AlertCircle, Crown, Star, UserCheck, Home 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../services/axiosConfig';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export const VendorDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { notifications } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashboardRes = await api.get('/vendor/dashboard');
        if (dashboardRes.data.success) {
          setStats(dashboardRes.data.data.stats);
          setRecentActivities(dashboardRes.data.data.recentBookings);
          setTopCustomers(dashboardRes.data.data.topCustomers);
        }
        const transactionsRes = await api.get('/vendor/transactions');
        if (transactionsRes.data.success) {
          setTransactions(transactionsRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [notifications]);

  if (loading) return (
    <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
        <BarChart3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={24} />
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Analyzing Performance...</p>
    </div>
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-500 w-full font-inter">
      <div className="px-1 flex items-center justify-between">
        <div>
          <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">Performance Overview</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Real-time business intelligence</p>
        </div>
        <div className="bg-white border border-slate-100 px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-2">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">System Live</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {[
          { label: 'Revenue', val: `₹${stats?.revenue || 0}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Orders', val: stats?.totalBookings || 0, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Completed', val: stats?.completedBookings || 0, icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Staff', val: stats?.totalWorkers || 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Popular Slot', val: stats?.popularSlot || 'N/A', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Pending', val: stats?.pendingBookings || 0, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={i} 
            className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group overflow-hidden active:scale-95 cursor-default"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className={`${stat.bg} ${stat.color} p-2 rounded-xl shrink-0 transition-transform group-hover:rotate-12`}>
                 <stat.icon size={16} />
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{stat.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-[16px] font-bold text-slate-900 truncate pr-1">{stat.val}</h3>
              <div className="flex items-center gap-0.5 text-emerald-600">
                <TrendingUp size={10} />
                <span className="text-[9px] font-bold">12%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Recent Transactions Section */}
    <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-[14px] font-bold text-slate-900">Recent Transactions</h3>
        <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
          Full Report
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center p-4"><Loader2 size={24} className="animate-spin text-blue-600" /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-2 text-[10px] font-medium text-slate-600">Invoice ID</th>
                <th className="p-2 text-[10px] font-medium text-slate-600">Customer</th>
                <th className="p-2 text-[10px] font-medium text-slate-600">Amount</th>
                <th className="p-2 text-[10px] font-medium text-slate-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map((tx, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-2 text-[11px] font-medium text-slate-900">
                    <Link to={`/invoice/${tx.bookingId || tx.id}`} className="text-blue-600 hover:underline">
                      {tx.id}
                    </Link>
                  </td>
                  <td className="p-2 text-[11px] text-slate-800">{tx.cust}</td>
                  <td className="p-2 text-[11px] font-bold text-emerald-600">{tx.amt}</td>
                  <td className="p-2 text-[11px] text-slate-600">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

    {/* Recent Activity Section */}
    <div className="lg:col-span-1 bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-[14px] font-bold text-slate-900">Recent Activity</h3>
        <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
          Full Report
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center p-4"><Loader2 size={20} className="animate-spin text-blue-600" /></div>
      ) : (
        <ul className="space-y-2 max-h-48 overflow-y-auto">
          {recentActivities.slice(0,5).map((act, idx) => (
            <li key={idx} className="flex items-center text-[11px] text-slate-700">
              <span className="mr-2 font-medium">{act.activityType}</span>
              <span>{JSON.stringify(act).slice(0, 40)}...</span>
              <span className="ml-auto text-xs text-slate-500">{new Date(act.createdAt || act.timestamp).toLocaleString()}</span>
            </li>
          ))}
          {recentActivities.length === 0 && <li className="text-slate-500">No recent activity.</li>}
        </ul>
      )}
    </div>
  </div>

      {/* Top Customers Leaderboard (enhanced) */}
      <div className="bg-slate-900 rounded-[32px] p-6 shadow-xl shadow-slate-200 text-white flex flex-col mt-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-amber-400/10 text-amber-400 rounded-xl flex items-center justify-center">
            <Crown size={20} />
          </div>
          <div>
            <h3 className="text-[14px] font-bold tracking-tight">Top Customers</h3>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">High-Value Leaders</p>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          {topCustomers.length > 0 ? topCustomers.map((customer, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center text-[11px] font-bold text-slate-400 group-hover:bg-amber-400 group-hover:text-slate-900 transition-all shrink-0">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-white truncate leading-tight group-hover:text-amber-400 transition-colors">
                    {customer.customerDetails?.fullName}
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    {customer.bookingsCount} Visits
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-amber-400">₹{customer.totalSpent}</p>
              </div>
            </div>
          )) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-40">
              <Star size={32} className="mb-3 text-slate-600" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Initializing Leaderboard</p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5">
          <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Monthly Growth</p>
              <p className="text-[14px] font-bold text-emerald-400">+24.5%</p>
            </div>
            <div className="w-8 h-8 bg-emerald-500/20 text-emerald-500 rounded-lg flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
