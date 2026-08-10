
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight,
  ArrowUpRight,
  Facebook,
  Instagram,
  Award,
  ChevronLeft,
  ChevronRight
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
  const [awardSlide, setAwardSlide] = useState(0);

  const awardCardsPages = [
    // Slide 1: 2 Cards
    [
      {
        id: "asus",
        company: "ASUSTeK Computer Inc",
        type: "Computer Hardware Company",
        logo: (
          <svg viewBox="0 0 100 100" className="w-10 h-10">
            <path fill="#00539B" d="M50 15L15 85h18l17-35 17 35h18L50 15zm0 25l10 20H40l10-20z" />
          </svg>
        ),
        awards: [
          "Millions Dollar Award",
          "Top Contribution Award",
          "Top Performance Partner Award"
        ],
        duration: "Consecutively 2015-2023 Award Winner"
      },
      {
        id: "msi",
        company: "Micro-Star International Co. Ltd",
        type: "Computer Hardware Company",
        logo: <span className="text-xl font-black italic tracking-tighter text-black font-sans">msi</span>,
        awards: [
          "Outstanding Award",
          "Top Performance Award",
          "Best Performance Award",
          "Online Best Performance Award"
        ],
        duration: "Consecutively 2013-2024 Award Winner"
      }
    ],
    // Slide 2: 2 Cards
    [
      {
        id: "gigabyte",
        company: "Gigabyte Technology Co., Ltd.",
        type: "Computer Hardware & Components",
        logo: <span className="text-lg font-black tracking-tighter text-[#0066CC] font-sans">GIGABYTE</span>,
        awards: [
          "Excellence in Retail Sales",
          "Outstanding System Integrator Partner",
          "Top Growth Partner Award"
        ],
        duration: "Consecutively 2016-2024 Award Winner"
      },
      {
        id: "hp",
        company: "HP Inc. Malaysia",
        type: "Computing & Printing Technology",
        logo: <span className="text-2xl font-black italic tracking-tighter text-[#0096D6] font-sans">hp</span>,
        awards: [
          "Best Retail Growth Award",
          "Outstanding Concept Store Partner",
          "Top Consumer PC Partner"
        ],
        duration: "Consecutively 2016-2024 Award Winner"
      }
    ]
  ];

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

      {/* Multi-Award Company Section */}
      <section className="bg-[#121212] text-[#FFFEFA] py-28 border-t border-white/10 relative overflow-hidden">
        {/* Subtle background red gradient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-[1600px] mx-auto px-6 md:px-16 lg:px-32 relative z-10">
          
          {/* Main Title & Overview */}
          <div className="max-w-4xl mb-12">
            <h2 className="text-3xl md:text-5xl font-light leading-tight mb-6">
              We're <span className="text-red-600 font-normal">Multi-Award Company.</span>
            </h2>
            <p className="text-sm md:text-lg text-white/70 leading-relaxed font-light mb-10 max-w-3xl">
              We have been honored with awards from multiple international brands and local authorities, recognized for our nationwide distribution capabilities and our best-in-class products and services.
            </p>
            
            {/* Tag Button */}
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-red-600 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] bg-red-600/10 hover:bg-red-600/20 transition-colors">
              <Award size={14} className="text-red-500" />
              Award List
            </div>
          </div>

          {/* Subheading & Slider Nav Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h3 className="text-2xl md:text-3xl font-light text-white tracking-tight">
              Multi-Award.
            </h3>

            {/* Carousel Controls */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold tracking-widest text-white/50 uppercase">
                Page <span className="text-red-500 font-black">{awardSlide + 1}</span> / {awardCardsPages.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAwardSlide(prev => (prev === 0 ? awardCardsPages.length - 1 : prev - 1))}
                  className="w-10 h-10 rounded-full border border-red-600/50 hover:border-red-500 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white transition-all flex items-center justify-center shadow-lg active:scale-95 cursor-pointer"
                  aria-label="Previous Award Slide"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  onClick={() => setAwardSlide(prev => (prev === awardCardsPages.length - 1 ? 0 : prev + 1))}
                  className="w-10 h-10 rounded-full border border-red-600/50 hover:border-red-500 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white transition-all flex items-center justify-center shadow-lg active:scale-95 cursor-pointer"
                  aria-label="Next Award Slide"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* 2 Cards Grid Slider View */}
          <div className="relative min-h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={awardSlide}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
              >
                {awardCardsPages[awardSlide].map((card) => (
                  <div
                    key={card.id}
                    className="rounded-[1.75rem] border border-red-600/60 bg-[#181818] p-8 hover:border-red-500 hover:shadow-red-600/10 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Brand Header */}
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center p-2.5 shrink-0 shadow-md">
                          {card.logo}
                        </div>
                        <div>
                          <h4 className="text-base md:text-lg font-bold text-white tracking-tight group-hover:text-red-500 transition-colors">
                            {card.company}
                          </h4>
                          <p className="text-xs text-white/50 font-medium tracking-wide">
                            {card.type}
                          </p>
                        </div>
                      </div>

                      {/* Awards List */}
                      <ul className="space-y-3 pt-6 border-t border-white/10 text-sm font-medium text-white/90">
                        {card.awards.map((awardText, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 mt-2"></span>
                            <span>{awardText}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/10">
                      <span className="text-xs md:text-sm font-bold text-red-500 block">
                        {card.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide Dots Indicator */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {awardCardsPages.map((_, index) => (
              <button
                key={index}
                onClick={() => setAwardSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  awardSlide === index
                    ? 'w-8 bg-red-600'
                    : 'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
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
