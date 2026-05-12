import React, { useState } from 'react';
import { 
  Search, Filter, Star, MapPin, 
  Clock, Tag, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const VENDORS = [
  { 
    id: '1', name: 'Elite Auto Spa', rating: 4.8, reviews: 124, 
    distance: '1.2 mi', price: '$25-$85', slots: '5 Left', 
    services: ['Ext', 'Det', 'Ceramic'], offer: '15% Off',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&h=250&fit=crop'
  },
  { 
    id: '2', name: 'QuickWash Express', rating: 4.5, reviews: 89, 
    distance: '2.4 mi', price: '$15-$45', slots: '2 Left', 
    services: ['Basic', 'Exp'], offer: 'New Deal',
    image: 'https://images.unsplash.com/photo-1552930294-6b595f4c2974?w=400&h=250&fit=crop'
  },
  { 
    id: '3', name: 'Platinum Care Hub Premium Luxury Service', rating: 4.9, reviews: 210, 
    distance: '0.8 mi', price: '$40-$120', slots: 'Full', 
    services: ['Lux', 'Pro'], offer: 'None',
    image: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?w=400&h=250&fit=crop'
  },
];

export const SearchVendors: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-4 animate-in fade-in duration-500 max-w-6xl font-inter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <h1 className="text-[15px] font-bold text-slate-900 tracking-tight">Discovery</h1>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Top-rated professional vendors</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-[11px] font-medium w-40 focus:w-56 focus:ring-2 focus:ring-blue-600/5 transition-all"
            />
          </div>
          <button className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 shadow-sm transition-all">
             <Filter size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {VENDORS.map((vendor, i) => (
          <motion.div 
            key={vendor.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all overflow-hidden group cursor-pointer flex flex-col"
          >
            <div className="relative h-24 shrink-0">
              <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {vendor.offer !== 'None' && (
                <div className="absolute top-1.5 left-1.5 bg-blue-600 text-white px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-tighter shadow-lg">
                  {vendor.offer}
                </div>
              )}
            </div>

            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-1">
                  <h3 className="text-[12px] font-bold text-slate-900 truncate leading-tight flex-1">{vendor.name}</h3>
                  <div className="flex items-center gap-0.5 bg-amber-50 px-1 rounded">
                    <Star size={8} className="fill-amber-400 text-amber-400" />
                    <span className="text-[9px] font-bold text-amber-700">{vendor.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin size={9} className="text-slate-400" />
                  <span className="text-[9px] font-medium text-slate-400 truncate">{vendor.distance}</span>
                </div>
              </div>

              <div className="mt-2.5 pt-2.5 border-t border-slate-50 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Pricing</p>
                  <p className="text-[11px] font-bold text-slate-800 truncate">{vendor.price}</p>
                </div>
                <div className="text-right">
                   <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Slots</p>
                   <p className={cn(
                     "text-[9px] font-bold truncate",
                     vendor.slots === 'Full' ? "text-rose-500" : "text-emerald-600"
                   )}>{vendor.slots}</p>
                </div>
              </div>

              <button className="w-full bg-slate-900 text-white py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest mt-2 group-hover:bg-blue-600 transition-all">
                Book
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
