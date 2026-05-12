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
  Settings2
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredVendors.map((vendor) => (
          <div key={vendor._id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
            {/* Card Header */}
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-slate-200">
                  {vendor.companyName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-none mb-1.5">{vendor.companyName}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-50 text-slate-400 rounded-lg uppercase tracking-widest">{vendor.vendorId}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${vendor.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleToggleStatus(vendor._id)}
                  className={`p-2.5 rounded-xl transition-all ${vendor.isActive ? 'text-rose-500 hover:bg-rose-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                  title={vendor.isActive ? 'Deactivate Vendor' : 'Activate Vendor'}
                >
                  {vendor.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                </button>
                <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                  <Settings2 size={18} />
                </button>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-500">
                  <User size={14} className="text-slate-400" />
                  <span className="text-[11px] font-bold tracking-wide">{vendor.fullName}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Mail size={14} className="text-slate-400" />
                  <span className="text-[11px] font-bold tracking-wide">{vendor.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Phone size={14} className="text-slate-400" />
                  <span className="text-[11px] font-bold tracking-wide">{vendor.phone}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-slate-500">
                  <MapPin size={14} className="text-slate-400 mt-0.5" />
                  <span className="text-[11px] font-bold tracking-wide line-clamp-2 leading-relaxed">{vendor.businessLocation}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Calendar size={14} className="text-slate-400" />
                  <span className="text-[11px] font-bold tracking-wide">Joined {new Date(vendor.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-6 py-4 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-400 tracking-widest">ACTIVE SERVICES: 12</span>
              </div>
              <button className="flex items-center gap-2 text-blue-600 font-bold text-[11px] hover:translate-x-1 transition-transform uppercase tracking-widest">
                View Isolated Panel
                <ExternalLink size={14} />
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
