
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  RotateCcw
} from 'lucide-react';

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/White%20Full%20Logo.png";

interface StudioNavbarProps {
  showReset?: boolean;
  onReset?: () => void;
}

const StudioNavbar: React.FC<StudioNavbarProps> = ({ showReset, onReset }) => {
  const [scrolled, setScrolled] = useState(false);

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
          <Link to="/prebuilt" className="px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] transition-all text-white/60 hover:text-white hover:bg-white/10">Pre-Built PC</Link>
          <Link to="/track-order" className="px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] transition-all text-white/60 hover:text-white hover:bg-white/10">Track Your Order</Link>
          <Link to="/stores" className="px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] transition-all text-white/60 hover:text-white hover:bg-white/10">Contact Us</Link>
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
