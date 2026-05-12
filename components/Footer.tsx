
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
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                <img src="https://illuminatelabs.space/assets/xhs_logo.png" className="w-5 h-5 object-contain opacity-50 hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" alt="Xiaohongshu" />
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
