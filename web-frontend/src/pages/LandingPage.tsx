import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../sections/Hero';
import { Features } from '../sections/Features';
import { Statistics } from '../sections/Statistics';
import { 
  Users, Store, ShieldAlert, CheckCircle2, 
  Mail, Phone, MapPin, Twitter, Linkedin, Facebook, Globe,
  Clock, Zap, CreditCard, ShieldCheck
} from 'lucide-react';

const Solutions: React.FC = () => (
  <section id="solutions" className="py-16 bg-white px-6 lg:px-12">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-2">How It Works</h2>
        <p className="text-3xl font-semibold text-slate-900 mb-4 tracking-tight">Solving Modern Car Wash Challenges</p>
        <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            icon: Clock, 
            problem: 'Long Wait Times', 
            solution: 'Instant booking with real-time slot availability sync.' 
          },
          { 
            icon: ShieldCheck, 
            problem: 'Unverified Shops', 
            solution: 'Strict verification process ensures 100% premium service.' 
          },
          { 
            icon: Zap, 
            problem: 'Manual Management', 
            solution: 'Automated staff scheduling and AI-powered reporting.' 
          },
          { 
            icon: CreditCard, 
            problem: 'Payment Friction', 
            solution: 'Secure digital payments and flexible subscription models.' 
          }
        ].map((s, i) => (
          <div key={i} className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
              <s.icon size={20} className="text-blue-600" />
            </div>
            <div className="mb-4">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block mb-1">The Problem</span>
              <h3 className="text-lg font-bold text-slate-900">{s.problem}</h3>
            </div>
            <div className="pt-4 border-t border-slate-200/60">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block mb-1">Our Solution</span>
              <p className="text-[13px] font-medium text-slate-500 leading-relaxed">{s.solution}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const About: React.FC = () => (
  <section id="about" className="py-16 bg-slate-50/50 px-6 lg:px-12 border-y border-slate-100">
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
      <div className="flex-1">
        <h2 className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-3 tracking-widest">Our Mission</h2>
        <h3 className="text-3xl font-semibold text-slate-900 mb-6 leading-tight tracking-tight">Empowering the Future <br /> of Digital Car Care.</h3>
        <p className="text-slate-500 font-medium text-sm mb-6 leading-relaxed">
          Chakachak is a leading SaaS provider dedicated to transforming the car wash industry. Our platform bridges the gap between premium vendors and busy customers through data-driven scheduling and automated business intelligence.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
           {[
             { title: 'Scalable SaaS', desc: 'Enterprise-grade architecture.' },
             { title: 'Customer Trust', desc: 'Secure payments & verified shops.' },
             { title: 'Business Goals', desc: 'Optimize revenue & growth.' },
             { title: 'Verified Shops', desc: 'Highest quality standards.' }
           ].map((item, i) => (
             <div key={i} className="flex items-start gap-3">
               <div className="mt-1"><CheckCircle2 size={16} className="text-emerald-500" /></div>
               <div>
                 <div className="text-sm font-bold text-slate-900 leading-none mb-1">{item.title}</div>
                 <div className="text-[11px] font-medium text-slate-400">{item.desc}</div>
               </div>
             </div>
           ))}
        </div>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-3xl font-bold text-blue-600 mb-1">10+</div>
          <div className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Years Experience</div>
        </div>
        <div className="bg-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-200 mt-6">
          <div className="text-3xl font-bold text-white mb-1">500+</div>
          <div className="text-blue-100 font-bold text-[10px] uppercase tracking-wider">Active Shops</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm -mt-6">
          <div className="text-3xl font-bold text-emerald-600 mb-1">99%</div>
          <div className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Service Uptime</div>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl">
          <Globe className="text-blue-500 mb-2" size={24} />
          <div className="text-white font-bold text-[10px] uppercase tracking-wider">Global Reach</div>
        </div>
      </div>
    </div>
  </section>
);

const Footer: React.FC = () => (
  <footer className="bg-slate-900 pt-16 pb-8 px-6 lg:px-12 text-white">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
               <span className="font-bold text-white text-sm">A</span>
            </div>
            <span className="text-lg font-bold tracking-tight">Chakachak</span>
          </div>
          <p className="text-slate-400 font-medium leading-relaxed text-xs mb-6">
            The intelligent operating system for professional car wash services.
          </p>
          <div className="flex items-center gap-3">
             {[Twitter, Linkedin, Facebook].map((Icon, i) => (
               <button key={i} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                 <Icon size={16} className="text-slate-300" />
               </button>
             ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-bold mb-5 tracking-wider uppercase">Platform</h4>
          <ul className="space-y-3 text-slate-400 font-medium text-xs">
             <li className="hover:text-blue-500 cursor-pointer transition-colors">Dashboard</li>
             <li className="hover:text-blue-500 cursor-pointer transition-colors">Vendor Portal</li>
             <li className="hover:text-blue-500 cursor-pointer transition-colors">Subscription</li>
             <li className="hover:text-blue-500 cursor-pointer transition-colors">API Docs</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold mb-5 tracking-wider uppercase">Company</h4>
          <ul className="space-y-3 text-slate-400 font-medium text-xs">
             <li className="hover:text-blue-500 cursor-pointer transition-colors">About Us</li>
             <li className="hover:text-blue-500 cursor-pointer transition-colors">Careers</li>
             <li className="hover:text-blue-500 cursor-pointer transition-colors">Privacy</li>
             <li className="hover:text-blue-500 cursor-pointer transition-colors">Terms</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold mb-5 tracking-wider uppercase">Contact</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-slate-400 font-medium text-xs">
              <Mail size={14} className="text-blue-500" /> <span>support@aquawash.saas</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-400 font-medium text-xs">
              <Phone size={14} className="text-blue-500" /> <span>+1 (234) 567-890</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-400 font-medium text-xs">
              <MapPin size={14} className="text-blue-500" /> <span>Silicon Valley, CA</span>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-6 border-t border-white/5 text-center text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
        &copy; 2026 Chakachak SaaS. All rights reserved.
      </div>
    </div>
  </footer>
);

export const LandingPage: React.FC = () => {
  return (
    <div className="font-inter bg-white antialiased">
      <Navbar />
      <Hero />
      <Features />
      <Solutions />
      <Statistics />
      <About />
      <Footer />
    </div>
  );
};
