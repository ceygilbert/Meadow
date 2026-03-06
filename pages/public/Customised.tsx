
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  ArrowRight
} from 'lucide-react';

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/White%20Full%20Logo.png";

const Customised: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const serviceBlueprint = [
    {
      title: "Strategic Consultation",
      desc: "Our master engineers analyze your specific computational needs, from multi-threaded workflows to low-latency gaming profiles.",
      icon: <MessageCircle size={36} strokeWidth={1} />,
      metric: "PHASE 01"
    },
    {
      title: "Precision Integration",
      desc: "Every component is verified for electrical harmony. Cables are routed with surgical precision to maximize thermal efficiency.",
      icon: <Microchip size={36} strokeWidth={1} />,
      metric: "PHASE 02"
    },
    {
      title: "Thermal Validation",
      desc: "72-hour stress testing under extreme thermal loads ensures your rig remains stable under the most demanding tasks.",
      icon: <Thermometer size={36} strokeWidth={1} />,
      metric: "PHASE 03"
    },
    {
      title: "Concierge Deployment",
      desc: "Hand-delivered within Johor Bahru and Skudai regions. Our team performs on-site optimization for your workspace.",
      icon: <Truck size={36} strokeWidth={1} />,
      metric: "PHASE 04"
    }
  ];

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
             <div className="hidden lg:flex flex-col border-l border-white/20 pl-10">
                <span className="text-[13px] font-black tracking-[0.5em] text-white/70 uppercase">Bespoke Division</span>
                <span className="text-[11px] font-bold tracking-[0.3em] text-rose-500 uppercase mt-1">Registry Active</span>
             </div>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-12">
            {['Methodology', 'Registry', 'Financing'].map((item) => (
               <button key={item} className="text-sm font-black uppercase tracking-[0.4em] text-white/60 hover:text-rose-500 transition-all">
                  {item}
               </button>
            ))}
            <div className="w-px h-6 bg-white/10 mx-4"></div>
            <Link to="/categories" className="text-sm font-black uppercase tracking-[0.4em] text-white/60 hover:text-rose-500 transition-all">Products</Link>
        </div>

        <div className="flex items-center gap-10">
           <button className="h-14 w-14 bg-white/10 border border-white/20 rounded-full flex items-center justify-center hover:bg-rose-600 hover:border-rose-600 transition-all duration-500">
              <ShoppingCart size={22} />
           </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-64 md:pt-80 pb-32 px-8 md:px-20 max-w-[1440px] mx-auto z-10">
        <div className="flex flex-col items-center text-center">
           <div className="flex items-center gap-4 mb-14 animate-in fade-in slide-in-from-top duration-1000">
              <span className="text-[13px] font-black uppercase tracking-[0.6em] text-rose-500">Thoughtfully Crafted</span>
           </div>
           
           <h1 className="font-black text-7xl md:text-[11rem] uppercase tracking-tighter leading-[0.85] text-white mb-20 animate-in fade-in slide-in-from-bottom duration-1000">
              Silicon <br />
              <span className="text-white/50">Sculpture</span>
           </h1>
           
           <div className="max-w-3xl space-y-14 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
              <p className="text-xl md:text-3xl text-slate-300 font-light leading-relaxed">
                Fast • Beautiful • Thoughtfully Crafted. <br />
                Architecting performance for the elite workspace.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                 <Link to="/buildpc" className="h-20 px-16 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-[0.4em] hover:bg-rose-600 hover:text-white transition-all duration-700 shadow-2xl flex items-center gap-6 group">
                    Initialize Build
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                 </Link>
                 <button className="h-20 px-14 bg-white/10 border border-white/20 text-white rounded-full font-black text-[11px] uppercase tracking-[0.4em] hover:bg-white/20 transition-all">
                    The Archive
                 </button>
              </div>
           </div>
        </div>

        <div className="mt-48 w-full h-px bg-gradient-to-r from-transparent via-rose-600/40 to-transparent"></div>
      </section>

      {/* Product Categories Grid */}
      <section className="relative z-10 px-8 md:px-20 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Custom Build PC */}
          <div className="relative aspect-square group overflow-hidden rounded-[3rem] shadow-2xl border border-white/5">
            <img 
              src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1200&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              alt="Custom PC"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>
            <div className="relative h-full flex flex-col items-center justify-center p-12 md:p-16 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">Custom build PC</h2>
                <p className="text-slate-300 text-[10px] md:text-xs font-medium uppercase tracking-[0.3em] leading-relaxed max-w-xs mx-auto">
                  Gaming, Work, Media — fully tailored, high-performance, and stylish.
                </p>
              </div>
              <Link to="/buildpc" className="px-10 py-4 bg-rose-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-700 transition-all shadow-xl">
                Build Now
              </Link>
            </div>
          </div>

          {/* Pre-Built PC */}
          <div className="relative aspect-square group overflow-hidden rounded-[3rem] shadow-2xl border border-white/5">
            <img 
              src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1200&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              alt="Pre-Built PC"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>
            <div className="relative h-full flex flex-col items-center justify-center p-12 md:p-16 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">Pre-Built PC</h2>
                <p className="text-slate-300 text-[10px] md:text-xs font-medium uppercase tracking-[0.3em] leading-relaxed max-w-xs mx-auto">
                  Built around your budget and tailored to your journey.
                </p>
              </div>
              <Link to="/products?category=desktop" className="px-10 py-4 bg-rose-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-700 transition-all shadow-xl">
                View Now
              </Link>
            </div>
          </div>

          {/* Workstation PC */}
          <div className="relative aspect-square group overflow-hidden rounded-[3rem] shadow-2xl border border-white/5">
            <img 
              src="https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1200&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              alt="Workstation PC"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>
            <div className="relative h-full flex flex-col items-center justify-center p-12 md:p-16 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">Workstation PC</h2>
                <p className="text-slate-300 text-[10px] md:text-xs font-medium uppercase tracking-[0.3em] leading-relaxed max-w-xs mx-auto">
                  Built for work — from paperwork to high-end rendering.
                </p>
              </div>
              <Link to="/products?category=workstation" className="px-10 py-4 bg-rose-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-700 transition-all shadow-xl">
                View Now
              </Link>
            </div>
          </div>

          {/* Laptop */}
          <div className="relative aspect-square group overflow-hidden rounded-[3rem] shadow-2xl border border-white/5">
            <img 
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              alt="Laptop"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>
            <div className="relative h-full flex flex-col items-center justify-center p-12 md:p-16 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">Laptop</h2>
                <p className="text-slate-300 text-[10px] md:text-xs font-medium uppercase tracking-[0.3em] leading-relaxed max-w-xs mx-auto">
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

      {/* The Methodology */}
      <section className="px-8 md:px-20 py-40 max-w-[1600px] mx-auto z-10">
        <div className="flex flex-col items-center mb-40 text-center">
           <h2 className="font-black text-6xl md:text-9xl uppercase tracking-tighter text-white mb-8">The Methodology</h2>
           <p className="text-[12px] font-black uppercase tracking-[0.5em] text-rose-500">Spatial Engineering Protocol</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-1">
           {serviceBlueprint.map((step, i) => (
             <div 
              key={i} 
              onMouseEnter={() => setActiveStep(i)}
              className={`p-14 border transition-all duration-1000 flex flex-col justify-between group h-[600px] relative overflow-hidden ${
                activeStep === i 
                  ? 'bg-white/[0.06] border-white/30' 
                  : 'bg-transparent border-white/10 opacity-60 hover:opacity-100'
              }`}
             >
                {activeStep === i && (
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-rose-600 shadow-[0_0_20px_rgba(225,29,72,0.9)]"></div>
                )}
                
                <div className="space-y-14">
                   <div className={`transition-all duration-1000 ${activeStep === i ? 'text-rose-600 scale-110' : 'text-white/40'}`}>
                      {step.icon}
                   </div>
                   <div className="space-y-8">
                      <h4 className="font-black text-4xl uppercase tracking-tighter text-white transition-all">{step.title}</h4>
                      <p className="text-base text-slate-300 font-medium leading-loose group-hover:text-white transition-colors">{step.desc}</p>
                   </div>
                </div>
                
                <div className="pt-10 border-t border-white/10 flex items-end justify-between">
                   <div className="flex flex-col">
                      <span className="text-[11px] font-black text-rose-500 tracking-[0.3em] uppercase mb-2">{step.metric}</span>
                      <span className="text-[12px] font-bold text-white/50 uppercase tracking-widest">Protocol Sync</span>
                   </div>
                   <div className={`w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all ${activeStep === i ? 'bg-white text-black' : 'text-white/40'}`}>
                      <ChevronRight size={22} />
                   </div>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* The Registry */}
      <section className="px-8 md:px-20 py-40 relative z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-40 gap-16">
             <div className="space-y-6">
                <span className="text-[12px] font-black uppercase tracking-[0.6em] text-rose-500">Client Feedback</span>
                <h2 className="font-black text-7xl md:text-[8rem] uppercase tracking-tighter text-white leading-none">The Registry.</h2>
             </div>
             <p className="text-slate-300 text-lg max-w-sm font-medium leading-relaxed italic border-l border-rose-600/50 pl-10">
                "We feel what you imagine." — Creating the absolute standard for professional computational hardware.
             </p>
          </div>

          <div className="grid md:grid-cols-3 gap-1px bg-white/10 p-px">
             {testimonials.map((t, i) => (
               <div key={i} className="bg-[#0a0b0c] p-20 relative group hover:bg-[#111213] transition-all duration-700">
                  <Quote className="text-white/10 absolute top-14 right-14" size={72} strokeWidth={1} />
                  <div className="flex gap-1.5 mb-14 opacity-70 group-hover:opacity-100 transition-opacity">
                     {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} className="text-rose-500 fill-rose-500" />)}
                  </div>
                  <p className="font-bold text-2xl text-slate-200 uppercase tracking-tight mb-20 leading-relaxed group-hover:text-white transition-colors">
                    "{t.text}"
                  </p>
                  <div className="flex flex-col gap-3">
                    <p className="text-base font-bold text-white tracking-tight">{t.name}</p>
                    <p className="text-[12px] font-black text-rose-500 uppercase tracking-[0.3em]">{t.role}</p>
                  </div>
               </div>
             ))}
          </div>
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
