
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Cpu, 
  ShieldCheck, 
  MessageCircle,
  Zap, 
  Monitor, 
  ChevronRight, 
  Layers, 
  Diamond, 
  Microchip, 
  Thermometer, 
  Truck, 
  Quote, 
  Star, 
  ShoppingCart,
  ArrowRight,
  Facebook,
  Instagram,
  RefreshCw,
  Wrench,
  Award,
  FileText,
  ClipboardCheck,
  Cable,
  Headphones,
  Settings,
  Download,
  BadgeCheck
} from 'lucide-react';

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/White%20Full%20Logo.png";

const Customised: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonials = [
    {
      name: "Marcus Tan",
      role: "Lead Architect, ArchiTech Studio",
      text: "Meadow's bespoke workstation handled my 4K renders 40% faster than my previous retail unit. The thermal management is a work of art.",
      rating: 5
    },
    {
      name: "Sarah Lim",
      role: "Professional Valorant Competitor",
      text: "Frame stability is everything. My custom build from Meadow has zero micro-stutter. It's the competitive edge I needed.",
      rating: 5
    },
    {
      name: "Dr. David Chen",
      role: "Data Scientist",
      text: "The silence of the liquid cooling system is incredible given the power inside. Technical perfection meets executive aesthetics.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-[#050607] text-slate-100 selection:bg-rose-600 selection:text-white overflow-x-hidden">
      
      {/* Editorial Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#050607]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#1a0a0a_0%,_#050607_80%)]"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] pointer-events-none"></div>
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[1px] bg-rose-600/20 blur-[2px] rotate-12"></div>
        <div className="absolute bottom-[40%] right-[-10%] w-[30%] h-[1px] bg-rose-600/10 blur-[3px] -rotate-6"></div>
      </div>

      {/* Header */}
      <nav className={`fixed top-0 left-0 right-0 h-32 md:h-40 px-8 md:px-16 flex items-center justify-between z-[100] transition-all duration-1000 ${scrolled ? 'bg-[#050607]/95 backdrop-blur-2xl border-b border-white/5 py-4 h-24' : 'bg-transparent py-10'}`}>
        <div className="flex items-center gap-12">
          <Link to="/" className="group flex items-center gap-10">
             <img src={LOGO_URL} className={`w-auto transition-all duration-500 group-hover:opacity-80 ${scrolled ? 'h-12 md:h-20' : 'h-24 md:h-36'}`} alt="Meadow" />
          </Link>
        </div>

        <div className="hidden lg:flex items-center bg-white/10 border border-white/20 rounded-full p-2 gap-2">
            <Link to="/buildpc" className="px-10 py-3.5 rounded-full text-sm font-black uppercase tracking-[0.3em] transition-all text-white/60 hover:text-white hover:bg-white/10">Custom Build PC</Link>
            <Link to="/prebuilt" className="px-10 py-3.5 rounded-full text-sm font-black uppercase tracking-[0.3em] transition-all text-white/60 hover:text-white hover:bg-white/10">Pre-Built PC</Link>
            <Link to="/track-order" className="px-10 py-3.5 rounded-full text-sm font-black uppercase tracking-[0.3em] transition-all text-white/60 hover:text-white hover:bg-white/10">Track Your Order</Link>
            <Link to="/stores" className="px-10 py-3.5 rounded-full text-sm font-black uppercase tracking-[0.3em] transition-all text-white/60 hover:text-white hover:bg-white/10">Contact Us</Link>
        </div>

        <div className="flex items-center gap-10">
           <button className="h-14 w-14 bg-white/10 border border-white/20 rounded-full flex items-center justify-center hover:bg-rose-600 hover:border-rose-600 transition-all duration-500">
              <ShoppingCart size={22} />
           </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 md:pt-48 pb-16 px-8 md:px-20 max-w-[1440px] mx-auto z-10">
        <div className="flex flex-col items-center text-center">
           <div className="flex items-center gap-4 mb-10 animate-in fade-in slide-in-from-top duration-1000">
              <span className="text-[13px] font-black uppercase tracking-[0.6em] text-rose-500">Thoughtfully Crafted</span>
           </div>
           
           <h1 className="font-black text-6xl md:text-[9rem] uppercase tracking-tighter leading-[0.85] text-white mb-12 animate-in fade-in slide-in-from-bottom duration-1000">
              Silicon <br />
              <span className="text-white/50">Sculpture</span>
           </h1>
           
           <div className="max-w-3xl space-y-10 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
              <p className="text-lg md:text-2xl text-slate-300 font-light leading-relaxed">
                Fast • Beautiful • Thoughtfully Crafted. <br />
                Architecting performance for the elite workspace.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                 <Link to="/buildpc" className="h-16 px-12 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.4em] hover:bg-rose-600 hover:text-white transition-all duration-700 shadow-2xl flex items-center gap-4 group">
                    Initialize Build
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                 </Link>
                 <button className="h-16 px-10 bg-white/10 border border-white/20 text-white rounded-full font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white/20 transition-all">
                    The Archive
                 </button>
              </div>
           </div>
        </div>

        <div className="mt-24 w-full h-px bg-gradient-to-r from-transparent via-rose-600/40 to-transparent"></div>
      </section>

      {/* Product Categories Slider */}
      <section className="relative z-10 px-8 md:px-20 max-w-[1800px] mx-auto overflow-hidden">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 md:gap-10 pb-12 scrollbar-hide cursor-grab active:cursor-grabbing">
          {/* Custom Build PC */}
          <div className="relative flex-shrink-0 w-[85vw] md:w-[600px] aspect-video group overflow-hidden rounded-[3rem] shadow-2xl border border-white/5 snap-center">
            <img 
              src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1200&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              alt="Custom PC"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/80"></div>
            <div className="relative h-full flex flex-col items-center justify-center p-8 md:p-12 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">Custom build PC</h2>
                <p className="text-slate-300 text-[10px] md:text-[12px] font-medium uppercase tracking-[0.4em] leading-relaxed max-w-sm mx-auto">
                  Gaming, Work, Media — fully tailored, high-performance, and stylish.
                </p>
              </div>
              <Link to="/buildpc" className="px-10 py-4 bg-rose-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-700 transition-all shadow-xl">
                Build Now
              </Link>
            </div>
          </div>

          {/* Pre-Built PC */}
          <div className="relative flex-shrink-0 w-[85vw] md:w-[600px] aspect-video group overflow-hidden rounded-[3rem] shadow-2xl border border-white/5 snap-center">
            <img 
              src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1200&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              alt="Pre-Built PC"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>
            <div className="relative h-full flex flex-col items-center justify-center p-8 md:p-12 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">Pre-Built PC</h2>
                <p className="text-slate-300 text-[10px] md:text-[12px] font-medium uppercase tracking-[0.4em] leading-relaxed max-w-sm mx-auto">
                  Built around your budget and tailored to your journey.
                </p>
              </div>
              <Link to="/products?category=desktop" className="px-10 py-4 bg-rose-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-700 transition-all shadow-xl">
                View Now
              </Link>
            </div>
          </div>

          {/* Workstation PC */}
          <div className="relative flex-shrink-0 w-[85vw] md:w-[600px] aspect-video group overflow-hidden rounded-[3rem] shadow-2xl border border-white/5 snap-center">
            <img 
              src="https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1200&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              alt="Workstation PC"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>
            <div className="relative h-full flex flex-col items-center justify-center p-8 md:p-12 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">Workstation PC</h2>
                <p className="text-slate-300 text-[10px] md:text-[12px] font-medium uppercase tracking-[0.4em] leading-relaxed max-w-sm mx-auto">
                  Built for work — from paperwork to high-end rendering.
                </p>
              </div>
              <Link to="/products?category=workstation" className="px-10 py-4 bg-rose-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-700 transition-all shadow-xl">
                View Now
              </Link>
            </div>
          </div>

          {/* Laptop */}
          <div className="relative flex-shrink-0 w-[85vw] md:w-[600px] aspect-video group overflow-hidden rounded-[3rem] shadow-2xl border border-white/5 snap-center">
            <img 
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              alt="Laptop"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>
            <div className="relative h-full flex flex-col items-center justify-center p-8 md:p-12 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">Laptop</h2>
                <p className="text-slate-300 text-[10px] md:text-[12px] font-medium uppercase tracking-[0.4em] leading-relaxed max-w-sm mx-auto">
                  Compact design. Powerful results.
                </p>
              </div>
              <Link to="/products?category=laptop" className="px-10 py-4 bg-rose-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-700 transition-all shadow-xl">
                View Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Portfolio Section */}
      <section className="px-8 md:px-20 py-24 max-w-[1600px] mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="font-black text-5xl md:text-7xl lg:text-[8rem] uppercase tracking-tighter text-white leading-[0.9] mb-16">Our Portfolio</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { label: "Years Experience", value: "10+" },
              { label: "PCs Built", value: "5,000+" },
              { label: "5 Star Reviews", value: "1,000+" },
              { label: "Branches", value: "7+" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <p className="text-3xl md:text-5xl font-black text-white">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[400px] md:h-[500px]">
          <div className="relative group overflow-hidden rounded-[2rem] border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              alt="Portfolio 1"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative group overflow-hidden rounded-[2rem] border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=800&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              alt="Portfolio 2"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative group overflow-hidden rounded-[2rem] border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=800&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              alt="Portfolio 3"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* We Care for You Section */}
      <section className="px-8 md:px-20 py-32 max-w-[1600px] mx-auto relative z-10">
        <div className="text-center mb-24">
          <span className="text-[12px] font-black uppercase tracking-[0.6em] text-rose-500 mb-6 block">Our Commitment</span>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-8">We Care for You.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Securing a lifetime of professional after-sale services, ready on-call to ensure your computational performance remains absolute.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-16">
          {[
            { icon: <ShieldCheck size={32} />, label: "Lifetime Free Labor" },
            { icon: <RefreshCw size={32} />, label: "90 Days 1-to-1 Exchange" },
            { icon: <Wrench size={32} />, label: "Free On-Site Support" },
            { icon: <Award size={32} />, label: "Full Warranty Coverage" },
            { icon: <Truck size={32} />, label: "Free Warranty Pick-up" },
            { icon: <ClipboardCheck size={32} />, label: "Professional Stress Test" },
            { icon: <Cable size={32} />, label: "Elite Cable Management" },
            { icon: <Headphones size={32} />, label: "Lifetime Tech Support" },
            { icon: <Settings size={32} />, label: "Free OS Installation" },
            { icon: <Truck size={32} />, label: "Nationwide Delivery" },
            { icon: <Download size={32} />, label: "Latest Driver Updates" },
            { icon: <BadgeCheck size={32} />, label: "Genuine Components" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center space-y-6 group">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-rose-500 group-hover:bg-rose-600 group-hover:text-white transition-all duration-500 shadow-xl">
                {item.icon}
              </div>
              <div className="text-[10px] font-black text-white uppercase tracking-widest leading-tight max-w-[120px]">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Financing */}
      <section className="px-8 md:px-20 py-40 max-w-[1600px] mx-auto z-10">
        <div className="bg-[#0a0b0c] border border-white/10 p-12 md:p-28 overflow-hidden relative group">
           <div className="absolute top-0 right-0 w-[3px] h-full bg-gradient-to-b from-rose-600 via-rose-600/20 to-transparent shadow-[0_0_20px_rgba(225,29,72,0.6)] transition-all duration-1000 group-hover:h-full"></div>
           
           <div className="grid lg:grid-cols-2 gap-40 items-center relative z-10">
              <div className="space-y-20">
                 <div className="space-y-10">
                    <h2 className="font-black text-6xl md:text-8xl uppercase tracking-tighter text-white leading-tight">Elite <br /> Ownership.</h2>
                    <p className="text-slate-300 text-xl md:text-2xl font-light leading-relaxed max-w-xl">
                       Acquire your masterwork through our executive partnership programs. Priority 0% interest terms available for established residents.
                    </p>
                 </div>
                 
                 <div className="space-y-10 border-l border-white/10 pl-14">
                    <div className="flex items-center gap-10 group/item">
                       <Diamond size={32} className="text-rose-500 group-hover/item:scale-110 transition-transform" />
                       <div>
                          <p className="text-sm font-black uppercase tracking-widest text-white">Privilege Club</p>
                          <p className="text-[11px] text-slate-400 uppercase tracking-widest mt-2">Exclusive for MY Premier Residents</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-10 group/item">
                       <ShieldCheck size={32} className="text-rose-500 group-hover/item:scale-110 transition-transform" />
                       <div>
                          <p className="text-sm font-black uppercase tracking-widest text-white">Lifetime Support</p>
                          <p className="text-[11px] text-slate-400 uppercase tracking-widest mt-2">Direct Master Engineer Link</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="relative aspect-square max-w-[500px] mx-auto w-full">
                 <div className="absolute inset-0 bg-rose-600/10 blur-[120px] rounded-full animate-pulse"></div>
                 <div className="w-full h-full border border-white/20 p-8 relative">
                    <div className="w-full h-full bg-[#050607] flex items-center justify-center p-16 overflow-hidden">
                        <Cpu size={160} strokeWidth={0.1} className="text-white/20 animate-spin duration-[40s]" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <Layers size={64} className="text-rose-600 mb-8" />
                           <p className="text-[11px] font-black text-white/70 tracking-[1em] uppercase">Phase_Ready</p>
                        </div>
                    </div>
                    <div className="absolute -top-5 -right-5 h-10 px-6 bg-white text-black text-[10px] font-black flex items-center justify-center uppercase tracking-[0.2em] shadow-xl">
                       0.00% INT
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 md:px-20 py-48 bg-[#050607] border-t border-white/10 relative z-10 overflow-hidden">
         <div className="max-w-[1440px] mx-auto flex flex-col items-center text-center">
            <img src={LOGO_URL} className="h-24 md:h-32 w-auto object-contain opacity-60 mb-40" alt="Meadow" />
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-32 w-full mb-40">
               <div className="text-left space-y-10">
                  <h4 className="text-[12px] font-black uppercase tracking-[0.6em] text-white/50">Protocol</h4>
                  <ul className="space-y-6 text-[12px] font-bold uppercase tracking-widest text-slate-400">
                     <li><a href="#" className="hover:text-rose-500 transition-all">Ownership Guide</a></li>
                     <li><a href="#" className="hover:text-rose-500 transition-all">Privacy Kernel</a></li>
                     <li><a href="#" className="hover:text-rose-500 transition-all">Terms of Access</a></li>
                  </ul>
               </div>
               <div className="text-left space-y-10">
                  <h4 className="text-[12px] font-black uppercase tracking-[0.6em] text-white/50">Branches</h4>
                  <p className="text-[12px] font-bold uppercase tracking-widest text-slate-400 leading-relaxed">
                     Larkin Junction L4 (08 & 12) <br />
                     Johor Bahru, MY <br />
                     Est. MMXX
                  </p>
               </div>
               <div className="text-left space-y-10 col-span-2 md:col-span-1">
                  <h4 className="text-[12px] font-black uppercase tracking-[0.6em] text-white/50">Status</h4>
                  <div className="flex items-center gap-5">
                     <div className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></div>
                     <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/80">Space Age Protocol Active</span>
                  </div>
               </div>
            </div>
            
            <div className="pt-24 border-t border-white/10 w-full">
               <div className="flex items-center justify-center gap-8 mb-16">
                 <a href="#" className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all shadow-2xl group">
                   <Facebook size={24} className="group-hover:scale-110 transition-transform" />
                 </a>
                 <a href="#" className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all shadow-2xl group">
                   <Instagram size={24} className="group-hover:scale-110 transition-transform" />
                 </a>
                 <a href="#" className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all shadow-2xl group">
                   <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" className="group-hover:scale-110 transition-transform">
                     <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47V18.77a6.738 6.738 0 0 1-6.76 6.76 6.738 6.738 0 0 1-6.76-6.76 6.738 6.738 0 0 1 6.76-6.76c.42-.02.84.03 1.25.12v4.03a2.71 2.71 0 0 0-1.25-.12 2.728 2.728 0 0 0-2.72 2.73 2.728 2.728 0 0 0 2.72 2.73 2.728 2.728 0 0 0 2.73-2.73V.02z"/>
                   </svg>
                 </a>
                 <a href="#" className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all shadow-2xl group">
                   <img src="https://illuminatelabs.space/assets/xhs_logo.png" className="w-7 h-7 object-contain brightness-0 invert opacity-40 group-hover:opacity-100 transition-all" referrerPolicy="no-referrer" alt="Xiaohongshu" />
                 </a>
               </div>
               <p className="font-black text-xs text-white/30 uppercase tracking-[0.4em]">
                  — © Space Age Studio & Meadow IT | Confidential & Proprietary —
               </p>
            </div>
         </div>
      </footer>

    </div>
  );
};

export default Customised;
