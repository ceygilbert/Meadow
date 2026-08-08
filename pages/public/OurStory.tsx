
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowRight,
  ArrowUpRight,
  Facebook,
  Instagram
} from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
import { supabase } from '../../lib/supabase';
import { Profile } from '../../types';

interface CartItem {
  id: string;
  quantity: number;
}

import { useAuth } from '../../lib/AuthContext';

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/Red%20Full%20Logo.png";

const OurStory: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem('meadow_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFEFA] text-[#333] font-sans selection:bg-[#333] selection:text-white overflow-x-hidden">
      <PublicNavbar 
        user={user}
        profile={profile}
        cartCount={cart.length}
        onOpenAuth={() => navigate('/')} 
        onOpenCart={() => {}}
        scrolled={scrolled}
      />

      {/* Hero Session */}
      <section className="relative h-screen flex items-center bg-[#FFFEFA]">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full">
           <div className="flex flex-col justify-center px-6 md:px-16 lg:px-24 xl:px-32 py-32">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="max-w-xl"
              >
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#666] mb-8 block">Our Story</span>
                 <h1 className="text-4xl md:text-6xl font-light text-[#333] leading-tight mb-12">
                    30 Years as Johor Leading Retailers and Distributors                 </h1>
                 <p className="text-md md:text-lg text-[#666] leading-relaxed font-light mb-6">
                   Founded in 1995, Meadow has been serving customers across Johor for more than 30 years through IT distribution, wholesale and multi-brand retail. Over the years, we have grown alongside the industry while building trusted relationships with leading technology brands and the customers we serve.
                 </p>
                 <p className="text-md md:text-lg text-[#666] leading-relaxed font-light mb-8">
                   Today, that foundation continues to shape our growth as we expand our retail presence, strengthen our customer support services, and make technology products more accessible, reliable and easier to shop with confidence for our customers.
                 </p>
              </motion.div>
           </div>
           <div className="relative overflow-hidden bg-[#F6F5E8]">
              <motion.img 
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5 }}
                src="https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&q=80" 
                alt="Architecture" 
                className="w-full h-full object-cover grayscale brightness-90"
              />
           </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-6 md:px-16 lg:px-32 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
           <div className="lg:col-span-2">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#666] mb-12">Foundations</h2>
              <h3 className="text-3xl md:text-4xl font-light text-[#333] leading-snug mb-16 max-w-3xl">
                We help every customer choose the right products with genuine advice and the right value for their needs.
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                 <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-6 italic text-[#333]">Official Brand Partnership</h4>
                    <p className="text-sm text-[#666] leading-relaxed font-light">
                      As one of the largest distributors in Johor, we work with leading brands across laptops, printers, monitors, PC components and everyday IT products, giving customers more choice from brands they trust in one place.
                    </p>
                 </div>
                 <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-6 italic text-[#333]">Workshop Backed Support</h4>
                    <p className="text-sm text-[#666] leading-relaxed font-light">
                      Our in-store workshop supports customers with problem diagnosis, formatting, dust cleaning, warranty coordination and technical follow-up after purchase.
                    </p>
                 </div>
              </div>
           </div>
           <div className="flex items-end">
              <div className="aspect-[3/4] w-full bg-[#F6F5E8] overflow-hidden">
                 <img 
                   src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80" 
                   alt="Details" 
                   className="w-full h-full object-cover grayscale opacity-80"
                 />
              </div>
           </div>
        </div>
      </section>

      {/* Heritage Section (Alternating) */}
      <section className="bg-[#252525] text-[#FFFEFA] py-32">
        <div className="max-w-[1600px] mx-auto px-6 md:px-16 lg:px-32">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="order-2 lg:order-1">
                 <img 
                   src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" 
                   alt="Space" 
                   className="w-full aspect-video object-cover grayscale opacity-70"
                 />
              </div>
              <div className="order-1 lg:order-2 max-w-xl">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-8 block">Distribution</span>
                 <h2 className="text-3xl md:text-5xl font-light mb-12 leading-tight">
                   Our Locations
                 </h2>
                 <p className="text-sm md:text-lg text-white/60 leading-relaxed font-light mb-12">
                   Across Meadow signature stores and official HP and ASUS concept stores, customers can browse, compare, and get practical advice in person. From laptops and printers to PC components and custom builds, our team is here to help you choose with greater clarity and confidence.
                 </p>
                 <Link 
                    to="/our-stores"
                    className="inline-flex items-center justify-between px-8 py-4 border border-white/20 hover:border-white group transition-all duration-500 w-full md:w-auto md:min-w-[280px]"
                 >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Explore our locations</span>
                    <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-2" />
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 px-6 md:px-16 lg:px-32 max-w-[1600px] mx-auto border-b border-[#EAEABA]">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#666] mb-12">Our Commitment</h2>
            <p className="text-xl md:text-2xl font-light text-[#333] leading-relaxed mb-24 italic">
              "We serve those who define the future. To provide anything less than perfection would be to fail the vision of our clients."
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
               <div>
                  <h4 className="border-t border-[#333]/10 pt-6 text-[10px] font-black uppercase tracking-[0.4em] text-[#333] mb-4">Integrity</h4>
                  <p className="text-xs text-[#666] font-light leading-relaxed">Honest consultation, transparent pricing, and genuine components from verified global supply chains.</p>
               </div>
               <div>
                  <h4 className="border-t border-[#333]/10 pt-6 text-[10px] font-black uppercase tracking-[0.4em] text-[#333] mb-4">Mastery</h4>
                  <p className="text-xs text-[#666] font-light leading-relaxed">Continuous research into emerging hardware architectures and thermal optimization techniques.</p>
               </div>
               <div>
                  <h4 className="border-t border-[#333]/10 pt-6 text-[10px] font-black uppercase tracking-[0.4em] text-[#333] mb-4">Support</h4>
                  <p className="text-xs text-[#666] font-light leading-relaxed">A lifecycle-long commitment to the machines we build, ensuring they evolve with your ambitions.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Editorial Footer */}
      <footer className="bg-[#F9FAFB] pt-24 pb-12 border-t border-slate-100">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-1 lg:col-span-1">
              <img src={LOGO_URL} className="h-16 w-auto mb-8 grayscale opacity-50" alt="Meadow" />
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
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8">Shop With Us</h4>
              <ul className="space-y-4">
                <li><Link to="/buildpc" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">BUILD YOUR OWN PC</Link></li>
                <li><Link to="/products?category=Desktop" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Desktop</Link></li>
                <li><Link to="/products?category=Display" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Display</Link></li>
                <li><Link to="/products?category=Home+%26+Office" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Home & Office</Link></li>
                <li><Link to="/products?category=Laptop" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Laptop</Link></li>
                <li><Link to="/products?category=Networking" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Networking</Link></li>
                <li><Link to="/products?category=PC+Components" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">PC Component</Link></li>
                <li><Link to="/products?category=Peripherals" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Peripherals</Link></li>
                <li><Link to="/products?category=Smart+Home" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Smart Home</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8">Support</h4>
              <ul className="space-y-4">
                <li><Link to="/track-order" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Track Your Order</Link></li>
                <li><Link to="/warranty" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Warranty</Link></li>
                <li><Link to="/product-policy" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Terms & Conditions</Link></li>
                <li><Link to="/" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8">Newsletter</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Join the Registry for updates.</p>
              <form className="flex gap-2 mb-8">
                <input type="email" placeholder="Email" className="flex-1 bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:border-slate-900 transition-colors" />
                <button className="bg-slate-900 text-white p-3 rounded-xl hover:bg-black transition-colors"><ArrowRight size={16} /></button>
              </form>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47V18.77a6.738 6.738 0 0 1-6.76 6.76 6.738 6.738 0 0 1-6.76-6.76 6.738 6.738 0 0 1 6.76-6.76c.42-.02.84.03 1.25.12v4.03a2.71 2.71 0 0 0-1.25-.12 2.728 2.728 0 0 0-2.72 2.73 2.728 2.728 0 0 0 2.72 2.73 2.728 2.728 0 0 0 2.73-2.73V.02z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                  <img src="https://illuminatelabs.space/assets/xhs_logo.png" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" alt="Xiaohongshu" />
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-slate-200/50">
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 text-center">© {new Date().getFullYear()} Meadow SDN BHD — ALL RIGHTS RESERVED</p>
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 italic">Core Operational Status: Nominal</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OurStory;
