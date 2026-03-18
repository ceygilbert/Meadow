
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Zap, 
  Shield, 
  Headphones, 
  Video, 
  Box, 
  Brain, 
  Settings, 
  ArrowRight,
  ChevronRight,
  Monitor,
  Database
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StudioNavbar from '../../components/StudioNavbar';

const Workstation: React.FC = () => {
  const components = [
    {
      title: "Processor (CPU)",
      description: "The CPU is important for all creative work. A mid-range CPU can handle basic 2D tasks, while a high-range CPU is required to aid higher demanding 2D task such as 4K Video Rendering.",
      image: "https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=1200&auto=format&fit=crop",
      reverse: false
    },
    {
      title: "Graphic Card (GPU)",
      description: "The GPU mostly contribute to 3D Rendering and aid the process of machine learning. For 2D creative work, a basic GPU is sufficient, but high-range GPU is required for complex 3D projects & Machine Learning.",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1200&auto=format&fit=crop",
      reverse: true
    },
    {
      title: "Random Access Memory (RAM)",
      description: "RAM holds data that your PC is actively working on. For most, 16GB of RAM is recommended, but complex projects may require 32GB or more, especially for video editing and 3D rendering.",
      image: "https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=1200&auto=format&fit=crop",
      reverse: false
    },
    {
      title: "Solid State Drive (SSD)",
      description: "An SSD can improve file loading and saving times. Using an SSD as your primary storage drive is recommended, especially for video editing and audio creative work where real-time effects processing is important.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
      reverse: false
    }
  ];

  const features = [
    {
      title: "Enterprise Reliability",
      icon: <Shield size={24} />,
      text: "ECC Memory and Platinum-rated power supplies ensure 24/7 uptime for critical tasks."
    },
    {
      title: "Extreme Performance",
      icon: <Zap size={24} />,
      text: "Hand-picked components and optimized BIOS for maximum sustained clock speeds."
    },
    {
      title: "Expert Support",
      icon: <Headphones size={24} />,
      text: "Direct access to our senior engineers who understand your professional software."
    }
  ];

  const workstations = [
    {
      name: "The 2D Artist",
      description: "Optimized for graphic design, illustration, and photo editing.",
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop",
      specs: {
        cpu: "Low to Mid Range to get the full 2D graphic performance.",
        ram: "Bigger sized projects require higher RAM size. 8GB is a good start.",
        gpu: "Any range, depends on software requirements."
      },
      software: [
        "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg",
        "https://upload.wikimedia.org/wikipedia/commons/f/fb/Adobe_Illustrator_CC_icon.svg",
        "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg"
      ]
    },
    {
      name: "The 4K Enjoyer",
      description: "Perfect for high-resolution video editing and motion graphics.",
      image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=800&auto=format&fit=crop",
      specs: {
        cpu: "High Range to get the full 2D video rendering processes.",
        ram: "Bigger sized projects require higher RAM size. 16GB is a good start.",
        gpu: "Any range, depends on software requirements."
      },
      software: [
        "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg",
        "https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg"
      ]
    },
    {
      name: "The 3D Maniac",
      description: "Engineered for complex 3D modeling, rendering, and simulation.",
      image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=800&auto=format&fit=crop",
      specs: {
        cpu: "Mid to High Range in order to support GPU processes.",
        ram: "Bigger sized projects require higher RAM size. 16GB is a good start.",
        gpu: "High Range GPU is required for complex 3D projects & Machine Learning."
      },
      software: [
        "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050607] text-white">
      <StudioNavbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1920&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30"
            alt="Workstation Background"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050607] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050607] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-rose-500 font-black uppercase tracking-[0.5em] text-sm mb-6">Professional Grade</p>
            <h1 className="text-7xl md:text-9xl font-black leading-none mb-8 tracking-tighter">
              POWERING<br />YOUR VISION
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mb-12 font-medium leading-relaxed">
              Engineered for creators, researchers, and engineers. Our workstations are built to handle the most demanding professional workloads with absolute stability.
            </p>
            <div className="flex gap-6">
              <button className="px-10 py-5 bg-rose-600 rounded-full font-black uppercase tracking-widest text-sm hover:bg-rose-700 transition-all flex items-center gap-3 group">
                Build Your Own <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-full font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                View Catalog
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-20 right-20 hidden lg:flex gap-12">
          <div className="text-right">
            <p className="text-4xl font-black text-white">99.9%</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Uptime Guaranteed</p>
          </div>
          <div className="text-right border-l border-white/10 pl-12">
            <p className="text-4xl font-black text-white">24HR</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Burn-in Testing</p>
          </div>
        </div>
      </section>

      {/* Anatomy of Performance */}
      <section className="py-32 px-8 bg-[#0a0b0c]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <p className="text-rose-500 font-black uppercase tracking-widest text-xs mb-4">Anatomy</p>
              <h2 className="text-5xl font-black tracking-tight uppercase">Optimized for Performance</h2>
            </div>
            <p className="text-slate-500 max-w-md text-left md:text-right">
              Every component in our workstations is selected for its ability to handle sustained professional workloads without compromise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {components.map((comp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#050607] rounded-[2.5rem] p-10 border border-white/5 flex flex-col h-full relative overflow-hidden group"
              >
                <div className={comp.reverse ? "order-2 mt-8" : "order-1 mb-8"}>
                  <h3 className="text-2xl font-black mb-4">{comp.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{comp.description}</p>
                </div>
                
                <div className={`relative rounded-3xl overflow-hidden flex-grow min-h-[350px] ${comp.reverse ? "order-1" : "order-2"}`}>
                  <img 
                    src={comp.image} 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                    alt={comp.title}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Pillars */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-600/10 border border-rose-600/20 rounded-2xl flex items-center justify-center text-rose-500 mb-8">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black mb-4 uppercase tracking-wider">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Models - Redesigned as Slider */}
      <section className="py-32 px-8 bg-[#050607] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black tracking-tight mb-6"
            >
              Tailored for your <span className="text-blue-500">Workflow</span>.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed"
            >
              We have pre-selected PC builds according to your needs so you have a clear starting point. From there, feel free to upgrade or keep the current specs.
            </motion.p>
          </div>

          <div className="relative group">
            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -left-4 -right-4 -translate-y-1/2 flex justify-between z-20 pointer-events-none">
              <button 
                onClick={() => {
                  const el = document.getElementById('workstation-slider');
                  if (el) el.scrollBy({ left: -400, behavior: 'smooth' });
                }}
                className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-blue-600 hover:border-blue-600 transition-all pointer-events-auto backdrop-blur-md"
              >
                <ChevronRight className="rotate-180" size={24} />
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('workstation-slider');
                  if (el) el.scrollBy({ left: 400, behavior: 'smooth' });
                }}
                className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-blue-600 hover:border-blue-600 transition-all pointer-events-auto backdrop-blur-md"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div 
              id="workstation-slider"
              className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {workstations.map((ws, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex-shrink-0 w-[85vw] md:w-[600px] snap-center"
                >
                  <div className="bg-[#0a0b0c] rounded-[3rem] p-8 md:p-12 border border-white/5 h-full flex flex-col group/card hover:border-blue-500/30 transition-all duration-500">
                    <div className="relative aspect-video mb-10 overflow-hidden rounded-[2rem]">
                      <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 z-10" />
                      <img 
                        src={ws.image} 
                        className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                        alt={ws.name}
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-grow space-y-8">
                      <h3 className="text-3xl md:text-4xl font-black tracking-tight">{ws.name}</h3>
                      
                      <div className="space-y-6">
                        <div className="flex gap-4">
                          <Cpu className="text-blue-500 flex-shrink-0" size={20} />
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Processor</p>
                            <p className="text-xs text-slate-400 leading-relaxed">{ws.specs.cpu}</p>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <Monitor className="text-blue-500 flex-shrink-0" size={20} />
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">RAM</p>
                            <p className="text-xs text-slate-400 leading-relaxed">{ws.specs.ram}</p>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <Zap className="text-blue-500 flex-shrink-0" size={20} />
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">GPU</p>
                            <p className="text-xs text-slate-400 leading-relaxed">{ws.specs.gpu}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-10 mt-10 border-t border-white/5">
                      <div className="flex gap-3">
                        {ws.software.map((icon, i) => (
                          <img 
                            key={i}
                            src={icon} 
                            className="w-8 h-8 object-contain opacity-60 hover:opacity-100 transition-opacity" 
                            alt="Software"
                            referrerPolicy="no-referrer"
                          />
                        ))}
                      </div>
                      <Link to="/buildpc" className="flex items-center gap-2 text-blue-500 hover:text-white transition-colors font-black uppercase tracking-widest text-[10px] group/link">
                        Configure <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Consultation CTA */}
      <section className="py-32 px-8">
        <div className="max-w-5xl mx-auto bg-rose-600 rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">NEED A CUSTOM<br />SOLUTION?</h2>
            <p className="text-rose-100 text-lg mb-12 max-w-xl mx-auto">
              Our specialists are ready to help you design the perfect workstation for your specific professional requirements.
            </p>
            <button className="px-12 py-6 bg-white text-rose-600 rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-2xl shadow-black/20">
              Book a Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="py-20 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <Monitor size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest">Meadow Workstations</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">© 2026 MEADOW IT SOLUTIONS</p>
            </div>
          </div>
          <div className="flex gap-12">
            <div className="flex items-center gap-3">
              <Database size={18} className="text-rose-500" />
              <span className="text-xs font-bold text-slate-400">ISV Certified</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-rose-500" />
              <span className="text-xs font-bold text-slate-400">3-Year Warranty</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Workstation;
