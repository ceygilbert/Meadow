
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  ArrowRight,
  MessageCircle
} from 'lucide-react';

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/Red%20Full%20Logo.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F9FAFB] pt-24 pb-12 border-t border-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-20">
          <div className="col-span-1 lg:col-span-1">
            <Link to="/">
              <img src={LOGO_URL} className="h-16 w-auto mb-8 grayscale opacity-50" alt="Meadow" />
            </Link>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs mb-8">
              Premium hardware distribution and bespoke computational engineering. Built for the elite.
            </p>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-4 text-left">Payment Method</h4>
                <div className="flex flex-wrap gap-2">
                  <img src="https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/fpx.svg" className="h-8 w-auto px-2 py-1 bg-white rounded border border-slate-100 object-contain" alt="FPX" />
                  <img src="https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/master.svg" className="h-8 w-auto px-2 py-1 bg-white rounded border border-slate-100 object-contain" alt="Mastercard" />
                  <img src="https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/visa.svg" className="h-8 w-auto px-2 py-1 bg-white rounded border border-slate-100 object-contain" alt="VISA" />
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-4 text-left">Logistic Services</h4>
                <div className="flex flex-wrap gap-2">
                  <img src="https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/gdex.svg" className="h-8 w-auto px-2 py-1 bg-white rounded border border-slate-100 object-contain" alt="GDEX" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/our-story" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Our Story</Link></li>
              <li><Link to="/our-stores" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Our Store</Link></li>
              <li><Link to="/events" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Events</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8">Shop With Us</h4>
            <ul className="space-y-4">
              <li><Link to="/customised" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">BUILD YOUR OWN PC</Link></li>
              <li><Link to="/products?category=Desktop" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Desktop</Link></li>
              <li><Link to="/products?category=Display" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Display</Link></li>
              <li><Link to="/products/laptop" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Laptop</Link></li>
              <li><Link to="/products/networking" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Networking</Link></li>
              <li><Link to="/products/pc-component" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">PC Component</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/track-order" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Track Your Order</Link></li>
              <li><Link to="/warranty" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Warranty</Link></li>
              <li><Link to="/product-policy" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Terms & Conditions</Link></li>
              <li><Link to="/contact" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8">Newsletter</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Join the Registry for updates.</p>
            <form className="flex gap-2 mb-8">
              <input type="email" placeholder="Email" className="flex-1 bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:border-slate-900 transition-colors" />
              <button className="bg-slate-900 text-white p-3 rounded-xl hover:bg-black transition-colors" type="button"><ArrowRight size={16} /></button>
            </form>
            <div className="flex items-center gap-3">
              <a 
                href="https://www.facebook.com/share/1K7NghHPxP/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-[#1877F2] hover:border-[#1877F2] transition-all shadow-sm group"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://www.instagram.com/meadow.it?igsh=MTBxejNkcmc5ZHJ6cw%3D%3D&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-[#E4405F] hover:border-[#E4405F] transition-all shadow-sm group"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://www.tiktok.com/@meadowit.my?_r=1&_t=ZS-98nOPPqLcFF" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="TikTok"
                className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm group"
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
                className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-[#25D366] hover:border-[#25D366] transition-all shadow-sm group"
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
                className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-[#FE2C55] hover:border-[#FE2C55] transition-all shadow-sm group"
              >
                <img src="https://illuminatelabs.space/assets/xhs_logo.png" className="w-5 h-5 object-contain opacity-50 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" alt="Xiaohongshu" />
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-slate-200/50">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 text-center">© {new Date().getFullYear()} Meadow IT — ALL RIGHTS RESERVED</p>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 italic">Core Operational Status: Nominal</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
