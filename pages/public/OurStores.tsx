
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowRight,
  MapPin,
  Phone,
  Clock,
  ChevronRight,
  Navigation,
  X,
  Menu,
  ShoppingCart,
  User as UserIcon,
  Search,
  ArrowUpRight,
  Facebook,
  Instagram
} from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
import { supabase } from '../../lib/supabase';
import { Profile, Product } from '../../types';

interface Branch {
  id: string;
  name: string;
  type: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  city: string;
  image: string;
  hours?: string;
}

const BRANCHES: Branch[] = [
  {
    id: '1',
    name: 'MEADOW IT DISTRIBUTION SDN BHD (HQ)',
    type: 'Service Center',
    address: 'No 5, 7 & 9, Jalan Keembong 22, Johor Jaya, 81100 Johor Bahru, Johor.',
    lat: 1.5410,
    lng: 103.7997,
    phone: '+60 7-355 5555',
    city: 'Johor Jaya',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
    hours: '9:00 AM - 6:00 PM'
  },
  {
    id: '2',
    name: 'MEADOW COMPUTER SDN BHD TAMAN U',
    type: 'IT Store',
    address: 'No 8, Jalan Kebudayaan 1, Taman Universiti, 81300 Skudai, Johor.',
    lat: 1.5435,
    lng: 103.6267,
    phone: '+60 7-521 1111',
    city: 'Skudai',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80',
    hours: '10:00 AM - 9:00 PM'
  },
  {
    id: '3',
    name: 'MEADOW COMPUTER SDN BHD PLAZA PELANGI',
    type: 'Mega Store',
    address: 'Lot.3.26, 26A, 27, Level 3, Plaza Pelangi, 80400 Johor Bahru, Johor.',
    lat: 1.4827,
    lng: 103.7635,
    phone: '+60 7-333 3333',
    city: 'Johor Bahru',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80',
    hours: '10:00 AM - 10:00 PM'
  },
  {
    id: '4',
    name: 'ASUS CONCEPT STORE MEADOW COMPUTER',
    type: 'IT Store',
    address: 'Lot.3.16, Level 3, Plaza Pelangi, 80400 Johor Bahru, Johor.',
    lat: 1.4827,
    lng: 103.7635,
    phone: '+60 7-333 4444',
    city: 'Johor Bahru',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80',
    hours: '10:00 AM - 10:00 PM'
  },
  {
    id: '5',
    name: 'HP WORLD MEADOW COMPUTER TOPPEN',
    type: 'IT Store',
    address: 'Level 2, Lot L2.22, Toppen Shopping Centre, 33A, Jln Harmonium, Taman Desa Tebrau, 81100 Johor Bahru, Johor Darul Ta’zim.',
    lat: 1.5484,
    lng: 103.7963,
    phone: '+60 7-364 8888',
    city: 'Johor Bahru',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80',
    hours: '10:00 AM - 10:00 PM'
  },
  {
    id: '6',
    name: 'HUAWEI AUTHORIZED EXPERIENCE STORE',
    type: 'IT Store',
    address: 'K1.01B, Level 1, Plaza Pelangi, 80400 Johor Bahru, Johor.',
    lat: 1.4827,
    lng: 103.7635,
    phone: '+60 7-333 5555',
    city: 'Johor Bahru',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80',
    hours: '10:00 AM - 10:00 PM'
  }
];

interface CartItem extends Product {
  quantity: number;
}

import { useAuth } from '../../lib/AuthContext';

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/Red%20Full%20Logo.png";

const OurStores: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem('meadow_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const filteredBranches = filterType === 'All' 
    ? BRANCHES 
    : BRANCHES.filter(b => b.type === filterType);

  return (
    <div className="min-h-screen bg-[#FFFEFA] text-[#333] font-sans selection:bg-[#333] selection:text-white overflow-x-hidden">
      <PublicNavbar 
        user={user}
        profile={profile}
        cartCount={cart.length}
        onOpenAuth={() => navigate('/')} 
        onOpenCart={() => setIsCartOpen(true)}
        scrolled={scrolled}
      />

      {/* Hero Section - Aesop Style */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <video 
          src="https://illuminatelabs.space/assets/locator_vd.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover grayscale brightness-75"
        />
        <div className="absolute inset-0 bg-neutral-900/20"></div>
        <div className="relative px-6 md:px-16 max-w-[1600px] mx-auto w-full z-10">
          <div className="max-w-3xl">
            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/60 mb-6 animate-in fade-in slide-in-from-bottom duration-700">Presence</h2>
            <h1 className="text-5xl md:text-7xl font-light text-white leading-tight mb-8 animate-in fade-in slide-in-from-bottom duration-1000">
              Our Stores
            </h1>
            <p className="text-lg md:text-xl font-light text-white/80 max-w-xl animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
              Discover Meadow's physical spaces across Johor, where computational excellence meets human-centric service.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-[#FFFEFA] pt-24 pb-12 px-6 md:px-16 max-w-[1600px] mx-auto">
        <div className="flex flex-wrap gap-x-12 gap-y-6 border-b border-neutral-200 pb-8">
          {['All', 'Mega Store', 'Service Center', 'IT Store'].map((type) => (
            <button 
              key={type}
              onClick={() => setFilterType(type)}
              className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all pb-2 relative ${
                filterType === type 
                  ? 'text-[#333]' 
                  : 'text-[#999] hover:text-[#333]'
              }`}
            >
              {type}
              {filterType === type && (
                <motion.div layoutId="activeFilter" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#333]" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Stores List - Alternating Layout */}
      <section className="bg-[#FFFEFA]">
        {filteredBranches.map((branch, idx) => (
          <div 
            key={branch.id} 
            className={`flex flex-col md:flex-row min-h-[600px] border-b border-[#EAEABA] ${
              idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            {/* Text Side */}
            <div className={`w-full md:w-1/2 flex flex-col justify-center p-8 md:p-24 lg:p-32 bg-[#FFFEFA]`}>
              <div className="max-w-md animate-in fade-in slide-in-from-bottom duration-1000">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#666] mb-4 block">Signature store</span>
                <h3 className="text-2xl md:text-3xl font-light text-[#333] mb-6 leading-tight">
                  {branch.name}
                </h3>
                <p className="text-sm text-[#666] leading-relaxed mb-10 font-light">
                  {branch.address}
                </p>
                
                <Link 
                  to={`/stores?id=${branch.id}`}
                  className="inline-flex items-center justify-between px-6 py-4 border border-[#333]/20 hover:border-[#333] group transition-all duration-500 min-w-[200px]"
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#333]">Discover the store</span>
                  <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-2" />
                </Link>
              </div>
            </div>

            {/* Image Side */}
            <div className="w-full md:w-1/2 h-[400px] md:h-auto overflow-hidden bg-[#F6F5E8]">
              <img 
                src={branch.image} 
                alt={branch.name} 
                className="w-full h-full object-cover grayscale opacity-90 transition-all duration-2000 hover:grayscale-0 hover:scale-105"
              />
            </div>
          </div>
        ))}
      </section>

      {/* Editorial Footer */}
      <footer className="bg-[#F9FAFB] pt-24 pb-12 border-t border-slate-100 mt-24">
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

export default OurStores;
