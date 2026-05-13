import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  ExternalLink,
  UserX,
  UserCheck,
  Building2,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Settings2,
  User,
  Navigation,
  ShieldCheck
} from 'lucide-react';
import axiosInstance from '../../services/axiosConfig';
import toast from 'react-hot-toast';

interface Vendor {
  _id: string;
  vendorId: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  businessLocation: string;
  isActive: boolean;
  createdAt: string;
}

export const VendorManagement: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchVendors = async () => {
    try {
      const response = await axiosInstance.get('/admin/vendors');
      if (response.data.success) {
        setVendors(response.data.data);
      }
    } catch (err) {
      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await axiosInstance.patch(`/admin/vendors/${id}/toggle`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchVendors();
      }
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const filteredVendors = vendors.filter(v =>
    v.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.vendorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="h-full flex items-center justify-center"><p className="text-sm font-bold text-slate-400 text-center">Fetching global vendor database...</p></div>;

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Vendor Management</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Review and manage isolated vendor profiles across the platform.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-2xl w-full md:w-[320px] shadow-sm focus-within:border-blue-500 transition-all">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, Name or Company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] font-bold text-slate-600 placeholder:text-slate-300 w-full"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
        {filteredVendors.map((vendor) => (
          <div key={vendor._id} className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
            {/* Card Header */}
            <div className="p-4 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-slate-200 shrink-0">
                  {vendor.companyName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-900 leading-none mb-1 truncate">{vendor.companyName}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-bold px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded-lg uppercase tracking-widest truncate">{vendor.vendorId}</span>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${vendor.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button 
                  onClick={() => handleToggleStatus(vendor._id)}
                  className={`p-2 rounded-lg transition-all ${vendor.isActive ? 'text-rose-500 hover:bg-rose-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                >
                  {vendor.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                </button>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-slate-500">
                  <User size={12} className="text-slate-400 shrink-0" />
                  <span className="text-[10px] font-bold tracking-wide truncate">{vendor.fullName}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <Mail size={12} className="text-slate-400 shrink-0" />
                  <span className="text-[10px] font-bold tracking-wide truncate">{vendor.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <Phone size={12} className="text-slate-400 shrink-0" />
                  <span className="text-[10px] font-bold tracking-wide">{vendor.phone}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 text-slate-500">
                  <MapPin size={12} className="text-slate-400 mt-0.5 shrink-0" />
                  <span className="text-[10px] font-bold tracking-wide line-clamp-1 leading-relaxed">{vendor.businessLocation}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-500">
                  <Calendar size={12} className="text-slate-400 shrink-0" />
                  <span className="text-[10px] font-bold tracking-wide">{new Date(vendor.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-4 py-3 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <div className="flex -space-x-1.5">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-200" />
                  ))}
                </div>
                <span className="text-[8px] font-bold text-slate-400 tracking-widest uppercase">12 Services</span>
              </div>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 text-blue-600 font-bold text-[9px] hover:translate-x-1 transition-transform uppercase tracking-widest">
                Manage
                <ExternalLink size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <div className="py-20 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Users size={40} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No vendors found</h3>
          <p className="text-sm font-medium text-slate-500">Try adjusting your search or onboarding a new vendor.</p>
        </div>
      )}
    </div>
  );
};
