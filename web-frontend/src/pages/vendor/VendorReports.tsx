import React, { useEffect, useState } from 'react';
import { 
  BarChart3, TrendingUp, Download, PieChart, Activity, 
  Users, CreditCard, Sparkles, AlertCircle, ShoppingBag, 
  CheckCircle2, DollarSign, ArrowUpRight, Scale, Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ResponsiveContainer as ResponsiveContainerComponent,
  AreaChart as AreaChartComponent,
  Area as AreaComponent,
  XAxis as XAxisComponent,
  YAxis as YAxisComponent,
  CartesianGrid as CartesianGridComponent,
  Tooltip as TooltipComponent,
  Legend as LegendComponent,
  BarChart as BarChartComponent,
  Bar as BarComponent,
  PieChart as RePieChartComponent,
  Pie as PieComponent,
  Cell as CellComponent
} from 'recharts';
import api from '../../services/axiosConfig';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const ResponsiveContainer = ResponsiveContainerComponent as any;
const AreaChart = AreaChartComponent as any;
const Area = AreaComponent as any;
const XAxis = XAxisComponent as any;
const YAxis = YAxisComponent as any;
const CartesianGrid = CartesianGridComponent as any;
const Tooltip = TooltipComponent as any;
const Legend = LegendComponent as any;
const BarChart = BarChartComponent as any;
const Bar = BarComponent as any;
const RePieChart = RePieChartComponent as any;
const Pie = PieComponent as any;
const Cell = CellComponent as any;

export const VendorReports: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { notifications } = useSelector((state: RootState) => state.notifications);
  const [activeTab, setActiveTab] = useState<'all' | 'revenue' | 'gst' | 'packages' | 'customers' | 'subscriptions'>('all');

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const response = await api.get('/vendor/reports');
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching vendor reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReportsData();
  }, [notifications]);

  const handleExportPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center gap-4 font-inter">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-100 border-t-amber-500 rounded-full animate-spin" />
          <BarChart3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500" size={24} />
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Compiling Business Reports...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 m-6 font-inter">
        <AlertCircle size={40} className="mx-auto text-slate-300 mb-3" />
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reports Unavailable</h3>
        <p className="text-[10px] text-slate-400 mt-1">Failed to aggregate vendor statistics. Please check back shortly.</p>
      </div>
    );
  }

  const { summary, monthlyTrend, topServices, topCustomers, planDetails, recentTxns, paymentModeBreakdown, serviceTypeBreakdown } = data;

  // Calculate cash vs online/UPI totals for payment mode display
  const cashData = paymentModeBreakdown.find((pm: any) => pm._id.toLowerCase() === 'cash') || { _id: 'Cash', count: 0, revenue: 0, uniqueCustomers: 0 };
  const onlineData = paymentModeBreakdown.filter((pm: any) => pm._id.toLowerCase() !== 'cash').reduce((acc: any, pm: any) => {
    acc.count += pm.count || 0;
    acc.revenue += pm.revenue || 0;
    acc.uniqueCustomers += pm.uniqueCustomers || 0;
    return acc;
  }, { _id: 'Online', count: 0, revenue: 0, uniqueCustomers: 0 });

  const pieData = cashData.revenue === 0 && onlineData.revenue === 0
    ? [{ name: 'No Data', value: 1, fill: '#f1f5f9' }]
    : [
        { name: 'Online', value: onlineData.revenue, fill: '#3b82f6' },
        { name: 'Cash', value: cashData.revenue, fill: '#f59e0b' }
      ].filter(d => d.value > 0);

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#3b82f6'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1400px] mx-auto px-2 font-inter text-slate-900 pb-12">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-1 no-print">
        <div>
          <h1 className="text-[18px] font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="text-amber-500" size={20} />
            Analytics & Reports
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Scrutinize business revenue, plan transactions & GST compliance</p>
        </div>
        <button 
          onClick={handleExportPDF}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-amber-500 transition-all shadow-md active:scale-95 shrink-0"
        >
          <Download size={14} />
          <span>Export & Print</span>
        </button>
      </div>

      {/* Tabs Menu - Responsive */}
      <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl no-print max-w-fit">
        {[
          { id: 'all', label: 'Overview' },
          { id: 'revenue', label: 'Revenue Trends' },
          { id: 'gst', label: 'GST Compliance' },
          { id: 'packages', label: 'Packages & Services' },
          { id: 'customers', label: 'Customers' },
          { id: 'subscriptions', label: 'Subscriptions' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {[
          { label: 'Total Revenue', value: `₹${summary.totalRevenue.toLocaleString()}`, sub: 'All wash channels', icon: DollarSign, color: 'text-emerald-600 border-emerald-100 bg-emerald-50/10' },
          { label: 'Booking Revenue', value: `₹${summary.bookingRevenue.toLocaleString()}`, sub: 'Standard Washes', icon: ShoppingBag, color: 'text-blue-600 border-blue-100 bg-blue-50/10' },
          { label: 'Plan Revenue', value: `₹${summary.planRevenue.toLocaleString()}`, sub: 'Subscriptions sold', icon: Crown, color: 'text-amber-600 border-amber-100 bg-amber-50/10' },
          { label: 'Washes Completed', value: summary.completedBookings, sub: `Of ${summary.totalBookings} requests`, icon: CheckCircle2, color: 'text-indigo-600 border-indigo-100 bg-indigo-50/10' },
          { label: 'GST Liability', value: `₹${summary.totalGst.toLocaleString()}`, sub: 'Base 18% Aggregated', icon: Scale, color: 'text-rose-600 border-rose-100 bg-rose-50/10' },
          { label: 'Total Customers', value: summary.totalCustomers, sub: 'Unique patrons', icon: Users, color: 'text-teal-600 border-teal-100 bg-teal-50/10' }
        ].map((kpi, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={i}
            className={`bg-white border rounded-2xl p-4 shadow-sm relative overflow-hidden transition-all flex flex-col justify-between min-h-[100px] ${kpi.color}`}
          >
            <div className="flex justify-between items-start gap-2">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-tight">{kpi.label}</span>
              <kpi.icon size={16} className="opacity-80 shrink-0" />
            </div>
            <div className="mt-2">
              <h3 className="text-[16px] font-bold tracking-tight text-slate-900 leading-none">{kpi.value}</h3>
              <p className="text-[8px] font-medium text-slate-400 mt-1 uppercase tracking-wide truncate">{kpi.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Aggregations - Conditional Render based on Tab selection */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Columns - Revenue and Graphics */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Revenue Chart Section */}
          {(activeTab === 'all' || activeTab === 'revenue') && (
            <motion.div 
              layout 
              className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-center px-1">
                <div>
                  <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">Revenue Stream Growth</h3>
                  <p className="text-[9px] font-medium text-slate-400">Monthly breakdown: Standard Bookings vs Subscription Plans</p>
                </div>
                <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded" /> Bookings</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-500 rounded" /> Plans</span>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorBooking" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPlan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="label" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '10px' }}
                      labelStyle={{ fontWeight: 'bold', color: '#f8fafc', marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="bookingRevenue" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBooking)" name="Booking Revenue" />
                    <Area type="monotone" dataKey="planRevenue" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPlan)" name="Plan Revenue" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* Revenue Monthly Trend Details Table */}
          {(activeTab === 'all' || activeTab === 'revenue') && (
            <motion.div layout className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">Monthly Financial Growth Ledger</h3>
                <p className="text-[9px] font-medium text-slate-400">Complete transaction statistics & combined performance indicators</p>
              </div>
              <div className="overflow-x-auto max-w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-2.5 px-3">Month</th>
                      <th className="py-2.5 px-3 text-right">Booking Count</th>
                      <th className="py-2.5 px-3 text-right">Booking Earnings</th>
                      <th className="py-2.5 px-3 text-right">Subscriptions Sold</th>
                      <th className="py-2.5 px-3 text-right">Subscription Earnings</th>
                      <th className="py-2.5 px-3 text-right">Gross Total</th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px] font-semibold text-slate-700 divide-y divide-slate-50">
                    {monthlyTrend.map((row: any, idx: number) => {
                      const totalRowRevenue = row.bookingRevenue + row.planRevenue;
                      return (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-slate-900">{row.label}</td>
                          <td className="py-2.5 px-3 text-right">{row.bookings} Washes</td>
                          <td className="py-2.5 px-3 text-right text-blue-600">₹{row.bookingRevenue.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right">{row.plans} Plans</td>
                          <td className="py-2.5 px-3 text-right text-amber-600">₹{row.planRevenue.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-950">₹{totalRowRevenue.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* GST compliance detailed breakdown */}
          {(activeTab === 'all' || activeTab === 'gst') && (
            <motion.div layout className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">GST Compliance Log (18% inclusive)</h3>
                  <p className="text-[9px] font-medium text-slate-400">Aggregated CGST (9%) and SGST (9%) calculation ledger</p>
                </div>
                <Scale size={20} className="text-rose-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Bookings Base & GST</span>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-sm font-bold text-slate-900">₹{summary.gstOnBookings.toLocaleString()}</h4>
                    <span className="text-[8px] font-bold text-slate-400">On ₹{summary.bookingRevenue.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Subscriptions Base & GST</span>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-sm font-bold text-slate-900">₹{summary.gstOnPlans.toLocaleString()}</h4>
                    <span className="text-[8px] font-bold text-slate-400">On ₹{summary.planRevenue.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Accumulated Tax Liability</span>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-sm font-bold text-amber-400">₹{summary.totalGst.toLocaleString()}</h4>
                    <span className="text-[8px] font-bold text-slate-400">Net Tax</span>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto max-w-full">
                <table className="w-full text-left border-collapse mt-2">
                  <thead>
                    <tr className="border-b border-slate-100 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-2.5 px-3">Revenue Class</th>
                      <th className="py-2.5 px-3 text-right">Gross Turnout</th>
                      <th className="py-2.5 px-3 text-right">Taxable Net Val</th>
                      <th className="py-2.5 px-3 text-right">CGST (9%)</th>
                      <th className="py-2.5 px-3 text-right">SGST (9%)</th>
                      <th className="py-2.5 px-3 text-right">GST Total (18%)</th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px] font-semibold text-slate-700 divide-y divide-slate-50">
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900">Single Services (Washes)</td>
                      <td className="py-2.5 px-3 text-right">₹{summary.bookingRevenue.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right">₹{(summary.bookingRevenue - summary.gstOnBookings).toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right text-rose-500">₹{(summary.gstOnBookings / 2).toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right text-rose-500">₹{(summary.gstOnBookings / 2).toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">₹{summary.gstOnBookings.toLocaleString()}</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900">Prepaid Subscriptions (Plans)</td>
                      <td className="py-2.5 px-3 text-right">₹{summary.planRevenue.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right">₹{(summary.planRevenue - summary.gstOnPlans).toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right text-rose-500">₹{(summary.gstOnPlans / 2).toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right text-rose-500">₹{(summary.gstOnPlans / 2).toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">₹{summary.gstOnPlans.toLocaleString()}</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold text-slate-950">
                      <td className="py-2.5 px-3 uppercase tracking-wider text-[9px]">Consolidated Totals</td>
                      <td className="py-2.5 px-3 text-right">₹{summary.totalRevenue.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right">₹{(summary.totalRevenue - summary.totalGst).toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right text-rose-600">₹{summary.cgst.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right text-rose-600">₹{summary.sgst.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-black text-rose-700">₹{summary.totalGst.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Subscription plan details list */}
          {(activeTab === 'all' || activeTab === 'subscriptions') && (
            <motion.div layout className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">Active Plan & Subscription Ledger</h3>
                <p className="text-[9px] font-medium text-slate-400">Detailed overview of purchased customer plans and validation parameters</p>
              </div>
              <div className="overflow-x-auto max-w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Plan Title</th>
                      <th className="py-2.5 px-3">Vehicle</th>
                      <th className="py-2.5 px-3 text-right">Services Remaining</th>
                      <th className="py-2.5 px-3">Sold On</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px] font-semibold text-slate-700 divide-y divide-slate-50">
                    {planDetails && planDetails.length > 0 ? (
                      planDetails.map((plan: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2.5 px-3">
                            <p className="font-bold text-slate-900">{plan.customer?.fullName || 'Active User'}</p>
                            <p className="text-[9px] text-slate-400 font-medium">{plan.customer?.email}</p>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-800">{plan.servicePlan?.title || 'Standard Plan'}</td>
                          <td className="py-2.5 px-3 text-slate-500 uppercase tracking-wider text-[9px]">
                            {plan.vehicle?.make} {plan.vehicle?.model} • {plan.vehicle?.plateNumber}
                          </td>
                          <td className="py-2.5 px-3 text-right font-black text-amber-700">{plan.remainingServices} / {plan.totalServices} Left</td>
                          <td className="py-2.5 px-3 text-slate-500">{new Date(plan.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                              plan.status === 'Active' 
                                ? 'bg-emerald-50 text-emerald-600' 
                                : plan.status === 'Completed' 
                                  ? 'bg-blue-50 text-blue-600' 
                                  : 'bg-slate-100 text-slate-500'
                            }`}>
                              {plan.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">No plans sold yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Transactions Summary log */}
          {activeTab === 'all' && (
            <motion.div layout className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center px-1">
                <div>
                  <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">Recent Financial Activity</h3>
                  <p className="text-[9px] font-medium text-slate-400">Log of the last 15 billing and service transaction events</p>
                </div>
                <div className="text-right bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">
                  <p className="text-[9px] font-bold uppercase tracking-wider">Recent Total</p>
                  <p className="text-[14px] font-black">₹{recentTxns?.reduce((sum: number, tx: any) => sum + (tx.totalAmount || 0), 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="overflow-x-auto max-w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-2.5 px-3">Transaction ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Fulfillment</th>
                      <th className="py-2.5 px-3 text-right">Value</th>
                      <th className="py-2.5 px-3">Date & Time</th>
                      <th className="py-2.5 px-3 text-center">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px] font-semibold text-slate-700 divide-y divide-slate-50">
                    {recentTxns && recentTxns.length > 0 ? (
                      recentTxns.map((tx: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-[9px] text-slate-500">{tx.transactionId || `TXN-${tx._id.slice(-8).toUpperCase()}`}</td>
                          <td className="py-2.5 px-3 text-slate-900">{tx.customer?.fullName || 'Walk-in'}</td>
                          <td className="py-2.5 px-3 text-slate-600 truncate max-w-[150px]">{tx.service?.name}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-950">₹{tx.totalAmount}</td>
                          <td className="py-2.5 px-3 text-slate-400 text-[10px]">
                            {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                              tx.paymentStatus === 'Success' 
                                ? 'bg-emerald-50 text-emerald-600' 
                                : tx.paymentStatus === 'Failed' 
                                  ? 'bg-rose-50 text-rose-600' 
                                  : 'bg-amber-50 text-amber-600'
                            }`}>
                              {tx.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">No recent transactions logged</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        </div>

        {/* Right Side Column - Charts and Breakdowns */}
        <div className="space-y-6">
          
          {/* Service breakdown distribution */}
          {(activeTab === 'all' || activeTab === 'packages') && (
            <motion.div layout className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">Package Popularity & Revenue</h3>
                <p className="text-[9px] font-medium text-slate-400">Total volume & revenue per wash package</p>
              </div>
              
              <div className="h-56 w-full flex items-center justify-center">
                {topServices && topServices.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={topServices}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="count"
                        nameKey="_id"
                      >
                        {topServices.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                    </RePieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-slate-300 text-[10px] uppercase font-bold tracking-wider">No service data</div>
                )}
              </div>

              {/* Package Legend Table */}
              <div className="space-y-2">
                {topServices && topServices.map((service: any, index: number) => (
                  <div key={index} className="flex justify-between items-center text-[11px] font-semibold text-slate-700">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="truncate">{service._id}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-slate-400">{service.count} sales</span>
                      <span className="font-bold text-slate-950">₹{service.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* High-Value Customer Leaderboard */}
          {(activeTab === 'all' || activeTab === 'customers') && (
            <motion.div layout className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">Top Patron Leaderboard</h3>
                <p className="text-[9px] font-medium text-slate-400">Top paying high-value customer accounts Scoped to your business</p>
              </div>

              <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto custom-scrollbar">
                {topCustomers && topCustomers.length > 0 ? (
                  topCustomers.map((cust: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-[11px] shrink-0">
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-[11px] truncate">{cust.name || 'Anonymous'}</p>
                          <p className="text-[9px] font-medium text-slate-400 truncate">{cust.email}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-black text-slate-950 text-[11px]">₹{cust.spent.toLocaleString()}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{cust.count} Visits</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-6 text-slate-400 text-[10px] font-bold uppercase tracking-wider">Leaderboard is empty</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Payment breakdown */}
          {activeTab === 'all' && (
            <motion.div layout className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">Payment Modes</h3>
                <p className="text-[9px] font-medium text-slate-400">Cash vs Online/UPI breakdown</p>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <RePieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {pieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ fontSize: '10px', borderRadius: '8px' }} 
                    formatter={(value: any, name: string) => name === 'No Data' ? ['No Transactions', ''] : [`₹${value.toLocaleString()}`, name]} 
                  />
                </RePieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-3 text-sm">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-slate-800 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Cash</span>
                    <span className="font-black text-slate-900">₹{cashData.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>{cashData.count} Transactions</span>
                    <span>{cashData.uniqueCustomers} Customers</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-slate-800 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Online/UPI</span>
                    <span className="font-black text-slate-900">₹{onlineData.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>{onlineData.count} Transactions</span>
                    <span>{onlineData.uniqueCustomers} Customers</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Service delivery mode */}
          {activeTab === 'all' && (
            <motion.div layout className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">Service Mode Distribution</h3>
                <p className="text-[9px] font-medium text-slate-400">Total volume: Shop vs Home Service bookings</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {serviceTypeBreakdown && serviceTypeBreakdown.map((st: any, index: number) => (
                  <div key={index} className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{st._id} Delivery</span>
                    <h4 className="text-[16px] font-black text-slate-900 mt-2">{st.count} Washes</h4>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
};
