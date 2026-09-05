import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  ArrowRight,
  MessageCircle
} from 'lucide-react';

const RED_LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/Red%20Full%20Logo.png";
const WHITE_LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/White%20Full%20Logo.png";

interface FooterProps {
  theme?: 'light' | 'dark';
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ theme = 'light', className = '' }) => {
  const isDark = theme === 'dark';

  return (
    <footer className={`pt-24 pb-16 border-t font-sans transition-colors relative z-20 ${
      isDark 
        ? 'bg-[#050607] border-white/10 text-white' 
        : 'bg-[#F9FAFB] border-slate-100 text-slate-900'
    } ${className}`}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-16">
          {/* Logo & Description & Payments */}
          <div className="col-span-1 lg:col-span-1">
            <Link to="/">
              <img 
                src={isDark ? WHITE_LOGO_URL : RED_LOGO_URL} 
                className={`h-16 w-auto mb-6 ${isDark ? 'opacity-90 hover:opacity-100 transition-opacity' : 'grayscale opacity-75'}`} 
                alt="Meadow" 
              />
            </Link>
            <p className={`text-xs font-medium leading-relaxed max-w-xs mb-8 ${isDark ? 'text-white/80' : 'text-slate-500'}`}>
              Premium hardware distribution and bespoke computational engineering. Built for the elite.
            </p>
            
            <div className="space-y-6">
              <div>
                <h4 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-3 text-left ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Payment Method
                </h4>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-white px-2.5 py-1.5 rounded-lg shadow-sm border border-slate-200 flex items-center justify-center">
                    <img src="https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/fpx.svg" className="h-5 w-auto object-contain" alt="FPX" />
                  </div>
                  <div className="bg-white px-2.5 py-1.5 rounded-lg shadow-sm border border-slate-200 flex items-center justify-center">
                    <img src="https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/master.svg" className="h-5 w-auto object-contain" alt="Mastercard" />
                  </div>
                  <div className="bg-white px-2.5 py-1.5 rounded-lg shadow-sm border border-slate-200 flex items-center justify-center">
                    <img src="https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/visa.svg" className="h-5 w-auto object-contain" alt="VISA" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-3 text-left ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Logistic Services
                </h4>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-white px-2.5 py-1.5 rounded-lg shadow-sm border border-slate-200 flex items-center justify-center">
                    <img src="https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/gdex.svg" className="h-5 w-auto object-contain" alt="GDEX" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Company
            </h4>
            <ul className="space-y-3.5">
              <li>
                <Link to="/our-story" className={`text-xs uppercase tracking-widest font-semibold transition-colors block ${isDark ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/our-stores" className={`text-xs uppercase tracking-widest font-semibold transition-colors block ${isDark ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                  Our Store
                </Link>
              </li>
              <li>
                <Link to="/events" className={`text-xs uppercase tracking-widest font-semibold transition-colors block ${isDark ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                  Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop With Us */}
          <div>
            <h4 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Shop With Us
            </h4>
            <ul className="space-y-3.5">
              <li>
                <Link to="/customised" className={`text-xs uppercase tracking-widest font-semibold transition-colors block ${isDark ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                  BUILD YOUR OWN PC
                </Link>
              </li>
              <li>
                <Link to="/products?category=Desktop" className={`text-xs uppercase tracking-widest font-semibold transition-colors block ${isDark ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                  Desktop
                </Link>
              </li>
              <li>
                <Link to="/products?category=Display" className={`text-xs uppercase tracking-widest font-semibold transition-colors block ${isDark ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                  Display
                </Link>
              </li>
              <li>
                <Link to="/products/laptop" className={`text-xs uppercase tracking-widest font-semibold transition-colors block ${isDark ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                  Laptop
                </Link>
              </li>
              <li>
                <Link to="/products/networking" className={`text-xs uppercase tracking-widest font-semibold transition-colors block ${isDark ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                  Networking
                </Link>
              </li>
              <li>
                <Link to="/products/pc-component" className={`text-xs uppercase tracking-widest font-semibold transition-colors block ${isDark ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                  PC Component
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Support
            </h4>
            <ul className="space-y-3.5">
              <li>
                <Link to="/track-order" className={`text-xs uppercase tracking-widest font-semibold transition-colors block ${isDark ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/warranty" className={`text-xs uppercase tracking-widest font-semibold transition-colors block ${isDark ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                  Warranty
                </Link>
              </li>
              <li>
                <Link to="/product-policy" className={`text-xs uppercase tracking-widest font-semibold transition-colors block ${isDark ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/contact" className={`text-xs uppercase tracking-widest font-semibold transition-colors block ${isDark ? 'text-white/80 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Socials */}
          <div>
            <h4 className={`text-[11px] font-black uppercase tracking-[0.3em] mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Newsletter
            </h4>
            <p className={`text-xs font-medium mb-4 ${isDark ? 'text-white/80' : 'text-slate-500'}`}>
              Join the Registry for updates.
            </p>
            <form className="flex gap-2 mb-8">
              <input 
                type="email" 
                placeholder="Email address" 
                className={`flex-1 rounded-xl px-4 py-3 text-xs outline-none transition-colors ${
                  isDark 
                    ? 'bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-white focus:bg-white/15' 
                    : 'bg-white border border-slate-200 text-slate-900 focus:border-slate-900'
                }`} 
              />
              <button 
                className={`p-3 rounded-xl transition-all ${
                  isDark 
                    ? 'bg-white text-black hover:bg-slate-100 shadow-md font-bold' 
                    : 'bg-slate-900 text-white hover:bg-black'
                }`} 
                type="button"
                aria-label="Subscribe"
              >
                <ArrowRight size={16} />
              </button>
            </form>
            <div className="flex items-center gap-3">
              <a 
                href="https://www.facebook.com/share/1K7NghHPxP/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm group border ${
                  isDark 
                    ? 'bg-white/10 border-white/20 text-white hover:text-[#1877F2] hover:bg-white/20 hover:border-[#1877F2]' 
                    : 'bg-white border-slate-200 text-slate-600 hover:text-[#1877F2] hover:border-[#1877F2]'
                }`}
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://www.instagram.com/meadow.it?igsh=MTBxejNkcmc5ZHJ6cw%3D%3D&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm group border ${
                  isDark 
                    ? 'bg-white/10 border-white/20 text-white hover:text-[#E4405F] hover:bg-white/20 hover:border-[#E4405F]' 
                    : 'bg-white border-slate-200 text-slate-600 hover:text-[#E4405F] hover:border-[#E4405F]'
                }`}
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://www.tiktok.com/@meadowit.my?_r=1&_t=ZS-98nOPPqLcFF" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="TikTok"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm group border ${
                  isDark 
                    ? 'bg-white/10 border-white/20 text-white hover:text-white hover:bg-white/20 hover:border-white/50' 
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-900'
                }`}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                </svg>
              </a>
              <a 
                href="https://wa.me/message/SWV2JDRGAAHHK1" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="WhatsApp"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm group border ${
                  isDark 
                    ? 'bg-white/10 border-white/20 text-white hover:text-[#25D366] hover:bg-white/20 hover:border-[#25D366]' 
                    : 'bg-white border-slate-200 text-slate-600 hover:text-[#25D366] hover:border-[#25D366]'
                }`}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
              <a 
                href="https://xhslink.cn/m/1CKc6WkV0ZJ" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Xiaohongshu"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm group border ${
                  isDark 
                    ? 'bg-white/10 border-white/20 text-white hover:text-[#FE2C55] hover:bg-white/20 hover:border-[#FE2C55]' 
                    : 'bg-white border-slate-200 text-slate-600 hover:text-[#FE2C55] hover:border-[#FE2C55]'
                }`}
              >
                <img 
                  src="https://illuminatelabs.space/assets/xhs_logo.png" 
                  className={`w-5 h-5 object-contain transition-opacity ${
                    isDark 
                      ? 'brightness-0 invert opacity-80 group-hover:opacity-100' 
                      : 'opacity-60 group-hover:opacity-100'
                  }`} 
                  referrerPolicy="no-referrer" 
                  alt="Xiaohongshu" 
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`flex flex-col items-center justify-center pt-10 border-t ${
          isDark ? 'border-white/15' : 'border-slate-200'
        }`}>
           <p className={`text-[11px] font-bold uppercase tracking-[0.35em] text-center ${
             isDark ? 'text-white/70' : 'text-slate-500'
           }`}>
             © {new Date().getFullYear()} Meadow IT — ALL RIGHTS RESERVED
           </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
