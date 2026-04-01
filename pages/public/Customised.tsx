
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
import StudioNavbar from '../../components/StudioNavbar';
import WaveGradient from '../../components/WaveGradient';

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/White%20Full%20Logo.png";

const Customised: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeRangeTab, setActiveRangeTab] = useState('originals');

  const rangeCategories = [
    { id: 'originals', label: 'AFTERSHOCK ORIGINALS' },
    { id: 'showcase', label: 'SHOWCASE' },
    { id: 'artisan', label: 'ARTISAN' },
    { id: 'airflow', label: 'AIRFLOW' },
    { id: 'compact', label: 'COMPACT' },
    { id: 'workstations', label: 'WORKSTATIONS' },
    { id: 'laptops', label: 'LAPTOPS' },
  ];

  const rangeProducts: Record<string, any[]> = {
    originals: [
      { name: 'RAPID', subtitle: 'The E-Sport Battlestation', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop' },
      { name: 'RAPID', subtitle: 'The E-Sport Battlestation', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=800&auto=format&fit=crop' },
      { name: 'ZEAL-M', subtitle: 'Showcase Chassis', image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=800&auto=format&fit=crop' },
    ],
    showcase: [
      { name: 'BUBBLEGUM', subtitle: 'Full Pink PC', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop' },
      { name: 'NIMBUS', subtitle: 'Curved Glass Showcase', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=800&auto=format&fit=crop' },
      { name: 'EVOLVE', subtitle: 'Explore New Horizons', image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=800&auto=format&fit=crop' },
    ],
    workstations: [
      { name: 'FOCUS', subtitle: 'Productivity Optimised PC', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop' },
      { name: 'FOCUS PRIME', subtitle: 'High Performance Workstation', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=800&auto=format&fit=crop' },
      { name: 'HYPERFOCUS', subtitle: 'High Performance Tower', image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=800&auto=format&fit=crop' },
    ],
    artisan: [
       { name: 'ARTISAN I', subtitle: 'Hand-Crafted Masterpiece', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop' },
       { name: 'ARTISAN II', subtitle: 'Bespoke Engineering', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=800&auto=format&fit=crop' },
       { name: 'ARTISAN III', subtitle: 'The Ultimate Craft', image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=800&auto=format&fit=crop' },
    ],
    airflow: [
       { name: 'WIND', subtitle: 'Maximum Cooling', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop' },
       { name: 'GALE', subtitle: 'High Airflow Chassis', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=800&auto=format&fit=crop' },
       { name: 'STORM', subtitle: 'Thermal Dominance', image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=800&auto=format&fit=crop' },
    ],
    compact: [
       { name: 'NANO', subtitle: 'Small Form Factor', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop' },
       { name: 'PICO', subtitle: 'Ultra Compact PC', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=800&auto=format&fit=crop' },
       { name: 'ATOM', subtitle: 'Miniature Powerhouse', image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=800&auto=format&fit=crop' },
    ],
    laptops: [
       { name: 'FORGE', subtitle: 'Portable Performance', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop' },
       { name: 'BLADE', subtitle: 'Thin & Light Gaming', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop' },
       { name: 'TITAN', subtitle: 'Desktop Replacement', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop' },
    ]
  };

  const heroSlides = [
    {
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-of-a-computer-close-up-34863-large.mp4',
      description: 'Fast • Beautiful • Thoughtfully Crafted. Architecting performance for the elite workspace.'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1920&auto=format&fit=crop',
      description: 'Every component hand-picked for maximum sustained performance and reliability.'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1920&auto=format&fit=crop',
      description: 'Where high-end computational power meets executive-grade design and cable management.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(timer);
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
      <StudioNavbar />

      {/* Hero Section Slider */}
      <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0"
          >
            {heroSlides[currentSlide].type === 'video' ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-40 scale-105"
              >
                <source src={heroSlides[currentSlide].url} type="video/mp4" />
              </video>
            ) : (
              <img
                src={heroSlides[currentSlide].url}
                className="w-full h-full object-cover opacity-40 scale-105"
                alt="Hero Background"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050607] via-transparent to-[#050607]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050607] via-transparent to-[#050607]" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 max-w-[1440px] mx-auto px-8 md:px-20 w-full">
          <div className="flex flex-col items-center text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center"
              >
                <div className="max-w-3xl space-y-10">
                  <p className="text-lg md:text-2xl text-slate-300 font-light leading-relaxed">
                    {heroSlides[currentSlide].description}
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
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slider Navigation Dots */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-20">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-12 h-1 transition-all duration-500 rounded-full ${
                currentSlide === i ? 'bg-rose-600 w-20' : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-rose-600/40 to-transparent"></div>
      </section>

      {/* Product Categories Grid */}
      <section className="relative z-10 px-8 md:px-20 max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 pb-12">
          {/* Custom Build PC */}
          <div className="relative w-full aspect-video group overflow-hidden rounded-[3rem] shadow-2xl border border-white/5">
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
          <div className="relative w-full aspect-video group overflow-hidden rounded-[3rem] shadow-2xl border border-white/5">
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
              <Link to="/prebuilt" className="px-10 py-4 bg-rose-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-700 transition-all shadow-xl">
                View Now
              </Link>
            </div>
          </div>

          {/* Workstation PC */}
          <div className="relative w-full aspect-video group overflow-hidden rounded-[3rem] shadow-2xl border border-white/5">
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
              <Link to="/workstation" className="px-10 py-4 bg-rose-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] hover:bg-rose-700 transition-all shadow-xl">
                View Now
              </Link>
            </div>
          </div>

          {/* Laptop */}
          <div className="relative w-full aspect-video group overflow-hidden rounded-[3rem] shadow-2xl border border-white/5">
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
      <section className="px-8 md:px-20 py-24 max-w-[1600px] mx-auto relative z-10">

      {/* Cinematic Video Section */}
        <div className="relative w-full aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group">
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-700 z-10 pointer-events-none flex flex-col items-center justify-center">
             <div className="w-24 h-24 rounded-full bg-rose-600/80 backdrop-blur-md flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2"></div>
             </div>
             <p className="mt-8 text-[12px] font-black uppercase tracking-[0.6em] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">Watch Our Craft</p>
          </div>
          <iframe 
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/PXaLc9AYIcg?autoplay=1&mute=1&loop=1&playlist=PXaLc9AYIcg&controls=0&showinfo=0&rel=0&modestbranding=1" 
            title="PC Build Craftsmanship"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Explore Our Range Section */}
        <div className="mt-40 mb-40">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Explore <br /> Our Range</h2>
            
            <div className="flex flex-wrap gap-x-8 gap-y-4 border-b border-white/5 pb-4">
              {rangeCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveRangeTab(cat.id)}
                  className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative pb-2 ${
                    activeRangeTab === cat.id ? 'text-rose-600' : 'text-white/40 hover:text-white'
                  }`}
                >
                  {cat.label}
                  {activeRangeTab === cat.id && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-rose-600"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {rangeProducts[activeRangeTab]?.map((product, idx) => (
                <motion.div
                  key={`${activeRangeTab}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group"
                >
                  <div className="bg-[#0a0b0c] border border-white/10 rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-rose-600/30 hover:shadow-[0_20px_80px_rgba(225,29,72,0.1)]">
                    <div className="p-8 text-center bg-gradient-to-b from-white/[0.03] to-transparent">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">{product.name}</h3>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{product.subtitle}</p>
                    </div>
                    <div className="relative aspect-square overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="text-center mb-24 pt-12">
          <span className="text-[12px] font-black uppercase tracking-[0.6em] text-rose-500 mb-6 block">Our Commitment</span>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-8">We Care for You.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Securing a lifetime of professional after-sale services, ready on-call to ensure your computational performance remains absolute.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-16 mb-32">
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

      <WaveGradient />

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
                     <li><Link to="/terms" className="hover:text-rose-500 transition-all">Terms of Access</Link></li>
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
