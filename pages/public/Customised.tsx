
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Cpu, 
  ArrowLeft, 
  ShieldCheck, 
  MessageCircle,
  Zap, 
  Monitor, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  Diamond, 
  Microchip, 
  Thermometer, 
  Truck, 
  Quote, 
  Star, 
  ShoppingCart
} from 'lucide-react';

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/White%20Full%20Logo.png";

const Customised: React.FC = () => {
  const navigate = useNavigate();
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
      icon: <MessageCircle size={36} />,
      metric: "01 / ARCHITECT"
    },
    {
      title: "Precision Integration",
      desc: "Every component is verified for electrical harmony. Cables are routed with surgical precision to maximize thermal efficiency.",
      icon: <Microchip size={36} />,
      metric: "02 / INTEGRATE"
    },
    {
      title: "Thermal Validation",
      desc: "72-hour stress testing under extreme thermal loads ensures your rig remains silent and stable under the most demanding tasks.",
      icon: <Thermometer size={36} />,
      metric: "03 / CALIBRATE"
    },
    {
      title: "Concierge Deployment",
      desc: "Hand-delivered within Johor Bahru and Skudai regions. Our team performs on-site optimization for your workspace.",
      icon: <Truck size={36} />,
      metric: "04 / DEPLOY"
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

  const financingPartners = [
    { name: 'HSBC Premium', logo: 'https://cdn.worldvectorlogo.com/logos/hsbc-1.svg' },
    { name: 'UOB Privilege', logo: 'https://cdn.worldvectorlogo.com/logos/uob-2.svg' },
    { name: 'OCBC Premier', logo: 'https://cdn.worldvectorlogo.com/logos/ocbc-bank.svg' },
    { name: 'Standard Chartered', logo: 'https://cdn.worldvectorlogo.com/logos/standard-chartered.svg' },
  ];

  return (
    <div className="min-h-screen bg-[#050607] font-sans text-slate-100 selection:bg-cyan-500 selection:text-white overflow-x-hidden">
      
      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#0a1018_0%,_#050607_100%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.05] pointer-events-none"></div>
        
        {/* Animated Orbs */}
        <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full animate-pulse duration-[8s]"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse duration-[10s]"></div>
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 z-[200] transition-all duration-300" style={{ width: `${(scrolled ? 100 : 0)}%` }}></div>

      {/* Luxury Navigation */}
      <nav className={`fixed top-0 left-0 right-0 h-24 px-8 md:px-20 flex items-center justify-between z-[100] transition-all duration-700 ${scrolled ? 'bg-[#050607]/90 backdrop-blur-3xl border-b border-white/5 py-4' : 'bg-transparent py-8'}`}>
        <div className="flex items-center gap-16">
          <Link to="/" className="group flex items-center">
             <img src={LOGO_URL} className="h-10 md:h-16 w-auto object-contain transition-all group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" alt="Meadow" />
             <div className="ml-6 flex flex-col items-start border-l border-white/10 pl-6">
                <span className="text-xs font-black tracking-[0.4em] text-white">BESPOKE</span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-500">DIVISION</span>
             </div>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
             {['Engineering', 'The Blueprint', 'Registry', 'Concierge'].map((item) => (
               <button key={item} className="text-sm font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all relative group/link">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cyan-400 transition-all duration-300 group-hover/link:w-full shadow-[0_0_8px_cyan]"></span>
               </button>
             ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
           <button className="hidden md:flex flex-col items-end group">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-cyan-500 transition-colors">Session Status</span>
              <span className="text-sm font-bold text-white/60">STANDBY / 0.00</span>
           </button>
           <div className="w-px h-8 bg-white/5 hidden md:block"></div>
           <button className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <ShoppingCart size={22} />
           </button>
        </div>
      </nav>

      {/* Cinematic Hero */}
      <section className="relative pt-48 md:pt-72 pb-32 px-8 md:px-20 max-w-[1600px] mx-auto z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
             <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left duration-700">
                <span className="h-[2px] w-16 bg-gradient-to-r from-cyan-500 to-transparent"></span>
                <span className="text-sm font-black uppercase tracking-[0.5em] text-cyan-400">Meadow Engineering Protocol</span>
             </div>
             
             <h1 className="text-6xl md:text-[9rem] font-black tracking-[-0.07em] leading-[0.85] uppercase animate-in fade-in slide-in-from-bottom duration-1000">
                Silicon <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/30 italic">Sculpture.</span>
             </h1>
             
             <div className="flex flex-col gap-8 max-w-xl animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
                <p className="text-base md:text-2xl text-white/50 font-medium tracking-tight leading-relaxed">
                  We don't just assemble computers. We architect performance experiences for those who demand the absolute peak of computational power.
                </p>
                
                <div className="flex flex-wrap gap-4">
                   <Link to="/buildpc" className="h-20 px-12 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-cyan-500 hover:text-white transition-all duration-500 shadow-2xl flex items-center gap-4 group">
                      Build It!
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                   </Link>
                   <button className="h-20 px-10 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center gap-3">
                      View Masterwork
                   </button>
                </div>
             </div>
          </div>

          <div className="relative hidden lg:flex justify-center items-center">
             <div className="absolute inset-0 bg-cyan-500/5 blur-[120px] animate-pulse"></div>
             <div className="relative w-full aspect-square max-w-[550px] border border-white/5 rounded-[4rem] p-4 group rotate-6 hover:rotate-0 transition-transform duration-1000">
                <div className="absolute -top-10 -right-10 w-40 h-40 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-[3rem]"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 border-b-2 border-l-2 border-white/10 rounded-bl-[3rem]"></div>
                <div className="w-full h-full bg-[#0a0b0c] rounded-[3rem] overflow-hidden relative border border-white/10">
                   <img 
                    src="https://images.unsplash.com/photo-1587202377405-836165b1040a?auto=format&fit=crop&q=80" 
                    className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                    alt="Internal Hardware" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                   <div className="absolute bottom-10 left-10">
                      <p className="text-xs font-black text-cyan-500 uppercase tracking-widest mb-1">UNIT REF: X-900</p>
                      <p className="text-2xl font-bold text-white uppercase tracking-tighter">Thermal Grid Active</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* The Meadow Blueprint - Service Section */}
      <section className="px-8 md:px-20 py-40 max-w-[1600px] mx-auto z-10 relative">
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
           <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-[0.5em] text-cyan-500">Methodology</span>
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter">The Blueprint.</h2>
           </div>
           <p className="text-white/40 text-sm font-bold uppercase tracking-[0.2em] max-w-sm text-right hidden md:block leading-relaxed">
              A four-stage protocol to ensure every Meadow rig is a masterpiece of technical integration.
           </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
           {serviceBlueprint.map((step, i) => (
             <div 
              key={i} 
              onMouseEnter={() => setActiveStep(i)}
              className={`p-12 rounded-[3.5rem] border transition-all duration-700 flex flex-col justify-between group h-[500px] ${
                activeStep === i 
                  ? 'bg-white/5 border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.1)]' 
                  : 'bg-transparent border-white/5 grayscale opacity-40 hover:opacity-100 hover:grayscale-0'
              }`}
             >
                <div className="space-y-10">
                   <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 ${activeStep === i ? 'bg-cyan-500 text-black' : 'bg-white/5 text-white/30'}`}>
                      {step.icon}
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-2xl font-black uppercase tracking-tight">{step.title}</h4>
                      <p className="text-sm text-white/50 font-medium leading-relaxed">{step.desc}</p>
                   </div>
                </div>
                <div className="flex items-center justify-between pt-8 border-t border-white/5">
                   <span className="text-xs font-black text-cyan-500 tracking-[0.2em]">{step.metric}</span>
                   <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-all">
                      <ChevronRight size={18} />
                   </div>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* The Elite Registry - Feedback Section */}
      <section className="px-8 md:px-20 py-40 bg-white/[0.01] border-y border-white/5 relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,_#0e141b_0%,_transparent_50%)]"></div>
        
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col items-center text-center mb-32 space-y-6">
             <div className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full flex items-center gap-3">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Verified Performance</span>
             </div>
             <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter">The Registry.</h2>
             <p className="text-white/40 text-lg max-w-xl font-medium leading-relaxed">
                Trusted by industry leaders, creative professionals, and high-performance competitive athletes across Malaysia.
             </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
             {testimonials.map((t, i) => (
               <div key={i} className="bg-[#0a0b0c] p-14 rounded-[4rem] border border-white/5 relative group hover:border-cyan-500/30 transition-all duration-700">
                  <Quote className="text-cyan-500/20 absolute top-10 right-10" size={80} strokeWidth={1} />
                  <div className="flex gap-1.5 mb-10">
                     {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} className="text-cyan-400 fill-cyan-400" />)}
                  </div>
                  <p className="text-lg md:text-xl text-white/70 font-medium italic mb-14 leading-relaxed">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-6">
                     <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1.5px]">
                        <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center font-black text-base">
                           {t.name[0]}
                        </div>
                     </div>
                     <div>
                        <p className="font-bold text-white text-base">{t.name}</p>
                        <p className="text-xs font-black text-cyan-500 uppercase tracking-widest mt-1">{t.role}</p>
                     </div>
                  </div>
               </div>
             ))}
          </div>

          <div className="mt-32 flex flex-col md:flex-row items-center justify-center gap-20 md:gap-40 grayscale opacity-30 hover:grayscale-0 transition-all duration-1000">
             {financingPartners.map((bank, i) => (
               <img key={i} src={bank.logo} className="h-8 md:h-12 w-auto object-contain" alt={bank.name} />
             ))}
          </div>
        </div>
      </section>

      {/* Featured Tier Section (Re-styled) */}
      <section className="px-8 md:px-20 py-40 max-w-[1600px] mx-auto z-10">
        <div className="bg-[#0a0b0c] rounded-[5rem] border border-white/5 p-16 md:p-32 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-cyan-500/5 blur-[180px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
           
           <div className="grid lg:grid-cols-2 gap-24 items-center relative z-10">
              <div className="space-y-16">
                 <div className="space-y-8">
                    <span className="inline-block px-6 py-2 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-full">Elite Program</span>
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight">Zero Interest <br /> Masterpiece.</h2>
                    <p className="text-white/50 text-base md:text-xl font-medium leading-relaxed max-w-lg">
                       Own the ultimate rig with our executive financing programs. Up to 24 months of 0% interest ownership for HSBC and UOB cardholders.
                    </p>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="p-10 bg-white/[0.03] rounded-[2.5rem] border border-white/5 hover:border-cyan-500/20 transition-all group">
                       <Diamond size={32} className="text-cyan-500 mb-6 group-hover:scale-110 transition-transform" />
                       <p className="text-xs font-black uppercase tracking-widest text-white mb-2">Privilege Club</p>
                       <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Exclusive for MY Residents</p>
                    </div>
                    <div className="p-10 bg-white/[0.03] rounded-[2.5rem] border border-white/5 hover:border-cyan-500/20 transition-all group">
                       <ShieldCheck size={32} className="text-cyan-500 mb-6 group-hover:scale-110 transition-transform" />
                       <p className="text-xs font-black uppercase tracking-widest text-white mb-2">Lifetime Support</p>
                       <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Master Engineer Concierge</p>
                    </div>
                 </div>
              </div>

              <div className="relative">
                 <div className="aspect-square bg-white/[0.02] border border-white/10 rounded-[4rem] p-6 relative group">
                    <div className="w-full h-full bg-[#050607] rounded-[3.5rem] overflow-hidden flex items-center justify-center p-16">
                       <Cpu size={160} strokeWidth={0.3} className="text-cyan-500/20 animate-spin duration-[25s]" />
                       <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                          <Layers size={64} className="text-cyan-500" />
                          <p className="text-xs font-black uppercase tracking-[0.6em] text-white">X-CORE ARCHITECTURE</p>
                       </div>
                    </div>
                    {/* Floating Tech Labels */}
                    <div className="absolute top-12 left-12 px-6 py-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl text-[10px] font-black text-cyan-400">LIQUID_COOLED</div>
                    <div className="absolute bottom-12 right-12 px-6 py-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl text-[10px] font-black text-cyan-400">SILICON_SYNC</div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Luxury Footer */}
      <footer className="px-8 md:px-20 py-40 bg-black/80 border-t border-white/5 relative z-10">
         <div className="max-w-[1600px] mx-auto flex flex-col items-center text-center space-y-24">
            <img src={LOGO_URL} className="h-20 md:h-28 w-auto object-contain opacity-50" alt="Meadow" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16 md:gap-32 w-full">
               <div className="space-y-8 flex flex-col items-center md:items-start">
                  <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">Protocol</h4>
                  <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-white/30">
                     <li><a href="#" className="hover:text-cyan-500 transition-colors">Integration Guide</a></li>
                     <li><a href="#" className="hover:text-cyan-500 transition-colors">Privacy Protocol</a></li>
                     <li><a href="#" className="hover:text-cyan-500 transition-colors">Ownership Terms</a></li>
                  </ul>
               </div>
               <div className="space-y-8 flex flex-col items-center md:items-start">
                  <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">Connect</h4>
                  <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-white/30">
                     <li><a href="#" className="hover:text-cyan-500 transition-colors">Engineering Blog</a></li>
                     <li><a href="#" className="hover:text-cyan-500 transition-colors">Tech Showcase</a></li>
                     <li><a href="#" className="hover:text-cyan-500 transition-colors">Consultation</a></li>
                  </ul>
               </div>
               <div className="col-span-2 space-y-10 flex flex-col items-center md:items-end md:text-right">
                  <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">Headquarters</h4>
                  <p className="text-xs font-black uppercase tracking-widest text-white/30 leading-loose">
                     Meadow Bespoke Division <br />
                     Johor Bahru, MY <br />
                     Established MMXX
                  </p>
                  <div className="flex items-center gap-3">
                     <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></div>
                     <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500/50">SYSTEM_OPERATIONAL_NOMINAL</span>
                  </div>
               </div>
            </div>
            
            <div className="pt-24 border-t border-white/5 w-full">
               <span className="text-[11px] font-black uppercase tracking-[0.6em] text-white/20 italic">
                  © {new Date().getFullYear()} Meadow IT — Precision Handcrafted Silicon.
               </span>
            </div>
         </div>
      </footer>

    </div>
  );
};

export default Customised;
