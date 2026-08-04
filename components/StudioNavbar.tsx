
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  RotateCcw,
  ChevronDown,
  PackageCheck,
  ShieldCheck,
  Briefcase,
  Building,
  Wrench,
  Truck,
  FileText,
  HelpCircle,
  Headphones,
  MapPin,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/White%20Full%20Logo.png";

interface StudioNavbarProps {
  showReset?: boolean;
  onReset?: () => void;
}

const StudioNavbar: React.FC<StudioNavbarProps> = ({ showReset, onReset }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isPrebuiltOpen, setIsPrebuiltOpen] = useState(false);
  const [isWorkstationOpen, setIsWorkstationOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-1000 ${scrolled ? 'bg-[#050607]/95 backdrop-blur-2xl border-b border-white/5 h-20' : 'bg-transparent h-24 md:h-28 py-6'}`}>
      <div className="max-w-[1800px] mx-auto px-8 md:px-16 flex items-center justify-between h-full">
        <div className="flex items-center gap-12">
          <Link to="/" className="group flex items-center gap-10">
            <img 
              src={LOGO_URL} 
              className={`w-auto transition-all duration-500 group-hover:opacity-80 ${scrolled ? 'h-10 md:h-16' : 'h-16 md:h-24'}`} 
              alt="Meadow" 
            />
          </Link>
        </div>

        <div className="hidden lg:flex items-center bg-white/10 border border-white/20 rounded-full p-1.5 gap-1">
          <Link to="/buildpc" className="px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] transition-all text-white/60 hover:text-white hover:bg-white/10">Custom Build PC</Link>
          
          {/* Pre-Built PC Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsPrebuiltOpen(true)}
            onMouseLeave={() => setIsPrebuiltOpen(false)}
          >
            <button
              onClick={() => setIsPrebuiltOpen(!isPrebuiltOpen)}
              className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-2 ${
                isPrebuiltOpen 
                  ? 'text-white bg-white/10' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>Pre-Built PC</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${isPrebuiltOpen ? 'rotate-180 text-red-500' : 'text-white/40'}`} />
            </button>

            <AnimatePresence>
              {isPrebuiltOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 bg-[#0a0b0c]/95 border border-white/15 backdrop-blur-2xl rounded-2xl p-2.5 shadow-2xl shadow-black/80 z-[120]"
                >
                  <Link
                    to="/prebuilt?type=ready-to-ship"
                    onClick={() => setIsPrebuiltOpen(false)}
                    className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-white/10 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:bg-red-600 group-hover:text-white transition-all shrink-0 mt-0.5">
                      <PackageCheck size={18} />
                    </div>
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-wider text-white group-hover:text-red-400 transition-colors">
                        Ready-to-Ship PCs
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium leading-snug mt-0.5">
                        Pre-assembled & tested systems in stock for immediate dispatch
                      </div>
                    </div>
                  </Link>

                  <div className="h-px bg-white/10 my-1" />

                  <Link
                    to="/prebuilt?type=powered-by-brand"
                    onClick={() => setIsPrebuiltOpen(false)}
                    className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-white/10 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0 mt-0.5">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-wider text-white group-hover:text-blue-400 transition-colors">
                        Powered by Brand
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium leading-snug mt-0.5">
                        Official brand partner custom builds (Gigabyte, ASUS, Zotac)
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Workstation PC Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsWorkstationOpen(true)}
            onMouseLeave={() => setIsWorkstationOpen(false)}
          >
            <button
              onClick={() => setIsWorkstationOpen(!isWorkstationOpen)}
              className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-2 ${
                isWorkstationOpen 
                  ? 'text-white bg-white/10' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>Workstation PC</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${isWorkstationOpen ? 'rotate-180 text-rose-500' : 'text-white/40'}`} />
            </button>

            <AnimatePresence>
              {isWorkstationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 bg-[#0a0b0c]/95 border border-white/15 backdrop-blur-2xl rounded-2xl p-2.5 shadow-2xl shadow-black/80 z-[120]"
                >
                  <Link
                    to="/workstation?type=professional"
                    onClick={() => setIsWorkstationOpen(false)}
                    className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-white/10 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all shrink-0 mt-0.5">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-wider text-white group-hover:text-purple-400 transition-colors">
                        Professional Workstations
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium leading-snug mt-0.5">
                        High-performance systems for 3D, CAD, AI & heavy video rendering
                      </div>
                    </div>
                  </Link>

                  <div className="h-px bg-white/10 my-1" />

                  <Link
                    to="/workstation?type=office"
                    onClick={() => setIsWorkstationOpen(false)}
                    className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-white/10 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0 mt-0.5">
                      <Building size={18} />
                    </div>
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-wider text-white group-hover:text-emerald-400 transition-colors">
                        Office PCs
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium leading-snug mt-0.5">
                        Reliable, silent & power-efficient desktop PCs for corporate & office setup
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Where to Buy */}
          <Link to="/stores" className="px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] transition-all text-white/60 hover:text-white hover:bg-white/10">Where to Buy</Link>

          {/* Support Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsSupportOpen(true)}
            onMouseLeave={() => setIsSupportOpen(false)}
          >
            <button
              onClick={() => setIsSupportOpen(!isSupportOpen)}
              className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-2 ${
                isSupportOpen 
                  ? 'text-white bg-white/10' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>Support</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${isSupportOpen ? 'rotate-180 text-rose-500' : 'text-white/40'}`} />
            </button>

            <AnimatePresence>
              {isSupportOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-3 w-80 bg-[#0a0b0c]/95 border border-white/15 backdrop-blur-2xl rounded-2xl p-2.5 shadow-2xl shadow-black/80 z-[120]"
                >
                  <Link
                    to="/contact"
                    onClick={() => setIsSupportOpen(false)}
                    className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-white/10 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-all shrink-0">
                      <Wrench size={16} />
                    </div>
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-wider text-white group-hover:text-amber-400 transition-colors">
                        Our Services
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium leading-tight">
                        Custom PC assembly, maintenance & repairs
                      </div>
                    </div>
                  </Link>

                  <div className="h-px bg-white/10 my-1" />

                  <Link
                    to="/track-order"
                    onClick={() => setIsSupportOpen(false)}
                    className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-white/10 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                      <Truck size={16} />
                    </div>
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-wider text-white group-hover:text-blue-400 transition-colors">
                        Track Your Order
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium leading-tight">
                        Check real-time status of your order
                      </div>
                    </div>
                  </Link>

                  <div className="h-px bg-white/10 my-1" />

                  <Link
                    to="/product-policy"
                    onClick={() => setIsSupportOpen(false)}
                    className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-white/10 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0">
                      <ShieldAlert size={16} />
                    </div>
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-wider text-white group-hover:text-emerald-400 transition-colors">
                        Warranty & Returns
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium leading-tight">
                        Warranty registration & return policies
                      </div>
                    </div>
                  </Link>

                  <div className="h-px bg-white/10 my-1" />

                  <Link
                    to="/terms"
                    onClick={() => setIsSupportOpen(false)}
                    className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-white/10 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all shrink-0">
                      <FileText size={16} />
                    </div>
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-wider text-white group-hover:text-purple-400 transition-colors">
                        Terms & Conditions
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium leading-tight">
                        Service terms & user agreement
                      </div>
                    </div>
                  </Link>

                  <div className="h-px bg-white/10 my-1" />

                  <Link
                    to="/contact"
                    onClick={() => setIsSupportOpen(false)}
                    className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-white/10 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-all shrink-0">
                      <HelpCircle size={16} />
                    </div>
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-wider text-white group-hover:text-cyan-400 transition-colors">
                        FAQ
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium leading-tight">
                        Frequently asked questions
                      </div>
                    </div>
                  </Link>

                  <div className="h-px bg-white/10 my-1" />

                  <Link
                    to="/contact"
                    onClick={() => setIsSupportOpen(false)}
                    className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-white/10 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:bg-red-600 group-hover:text-white transition-all shrink-0">
                      <Headphones size={16} />
                    </div>
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-wider text-white group-hover:text-red-400 transition-colors">
                        Contact Us
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium leading-tight">
                        Get in touch with our support team
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {showReset && onReset && (
            <button 
              onClick={onReset} 
              className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-rose-500 transition-all"
              title="Reset Build"
            >
              <RotateCcw size={20} />
            </button>
          )}
          <button className="h-12 w-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center hover:bg-rose-600 hover:border-rose-600 transition-all duration-500">
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default StudioNavbar;
