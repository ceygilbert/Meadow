
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  ShieldCheck, 
  MessageCircle,
  Zap, 
  Monitor, 
  ChevronRight, 
  ChevronLeft,
  MapPin,
  Building2,
  Sparkles,
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
  BadgeCheck,
  X,
  Maximize2
} from 'lucide-react';
import StudioNavbar from '../../components/StudioNavbar';
import WaveGradient from '../../components/WaveGradient';

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/White%20Full%20Logo.png";

const Customised: React.FC = () => {
  const location = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeRangeTab, setActiveRangeTab] = useState('originals');
  const [activeStoreIndex, setActiveStoreIndex] = useState(0);

  useEffect(() => {
    if (location.hash === '#signature-stores' || location.hash === '#signature-store') {
      setTimeout(() => {
        const el = document.getElementById('signature-stores') || document.getElementById('signature-store');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  }, [location.hash]);

  const signatureStores = [
    {
      name: "Larkin Junction Store",
      shortName: "Larkin Junction",
      title: "Over 200 Dedicated PC Enthusiasts",
      subtitle: "Exclusive Custom Build Bay & Testing Hub",
      address: "Larkin Junction, Jalan Larkin, 80350 Johor Bahru, Johor, Malaysia",
      phone: "+60 12-789 3321",
      hours: "10:00 AM - 10:00 PM Daily",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1400&auto=format&fit=crop",
      description: "Visit our BRAND NEW Experiential Centre at Larkin Junction for the ULTIMATE custom PC experience. Our experience centre features the unique ability to get a hands-on experience with games, creator applications and AI software on a wide range of hardware, allowing you to learn about and decide on your perfect PC configuration for your needs. Our aim at the experience centre is to take the guesswork out of choosing your ideal components for your PC, by allowing you to try - so you know exactly what to expect from the hardware you select. From testing stations for different graphics cards to processors and even gaming gear, our experience centre is a PC heaven like no other."
    },
    {
      name: "Pelangi Plaza Store",
      shortName: "Pelangi Plaza",
      title: "Flagship Custom PC Experience Hub",
      subtitle: "Precision Assembly Bay & Component Showcase",
      address: "Plaza Pelangi, Jalan Pelangi, Taman Pelangi, 80400 Johor Bahru, Johor, Malaysia",
      phone: "+60 12-789 3322",
      hours: "10:00 AM - 10:00 PM Daily",
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1400&auto=format&fit=crop",
      description: "Visit our flagship Experiential Centre at Pelangi Plaza for a comprehensive custom PC building lounge. Featuring live stress-testing bays, custom liquid loop displays, and direct 1-on-1 consultations with our senior hardware technicians. Test processors, graphics cards, and high-refresh monitors on-site to build your personalized gaming or workstation system with absolute confidence."
    }
  ];

  const rangeCategories = [
    { id: 'originals', label: 'Meadow original' },
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
      type: 'image',
      url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1920&auto=format&fit=crop',
      description: 'Fast • Beautiful • Thoughtfully Crafted. Architecting performance for the elite workspace.'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1920&auto=format&fit=crop',
      description: 'Every component hand-picked for maximum sustained performance and reliability.'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920&auto=format&fit=crop',
      description: 'Where high-end computational power meets executive-grade design and cable management.'
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=1920&auto=format&fit=crop',
      description: 'Precision engineered custom gaming rigs built to dominate.'
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
        <Link to="/buildpc" className="absolute inset-0 block cursor-pointer group z-0">
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
                  className="w-full h-full object-cover opacity-80 scale-105 group-hover:scale-110 transition-transform duration-1000"
                >
                  <source src={heroSlides[currentSlide].url} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={heroSlides[currentSlide].url}
                  className="w-full h-full object-cover opacity-85 scale-105 group-hover:scale-110 transition-transform duration-1000"
                  alt="Hero Background"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-[#050607]/60 via-transparent to-[#050607]/80" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050607]/40 via-transparent to-[#050607]/40" />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 max-w-[1440px] mx-auto px-8 md:px-20 w-full h-full flex items-center justify-center">
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
                  <div className="max-w-3xl space-y-6">
                    <p className="text-lg md:text-2xl text-slate-200 font-light leading-relaxed drop-shadow-md">
                      {heroSlides[currentSlide].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Link>

        {/* Slider Navigation Dots */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-20 pointer-events-auto">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(i);
              }}
              className={`w-12 h-1 transition-all duration-500 rounded-full ${
                currentSlide === i ? 'bg-rose-600 w-20' : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-rose-600/40 to-transparent pointer-events-none"></div>
      </section>

      {/* Product Categories Grid */}
      <section className="relative z-10 px-8 md:px-20 max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 pb-12">
          {/* Custom Build PC */}
          <div className="relative w-full aspect-square group overflow-hidden rounded-[3rem] shadow-2xl border border-white/5">
            <img 
              src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1200&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              alt="Custom PC"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black/70"></div>
            <div className="relative h-full flex flex-col items-center justify-start p-8 md:p-12 text-center space-y-6 md:space-y-8 pt-10 md:pt-14">
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
          <div className="relative w-full aspect-square group overflow-hidden rounded-[3rem] shadow-2xl border border-white/5">
            <img 
              src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1200&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              alt="Pre-Built PC"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black/70"></div>
            <div className="relative h-full flex flex-col items-center justify-start p-8 md:p-12 text-center space-y-6 md:space-y-8 pt-10 md:pt-14">
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
          <div className="relative w-full aspect-square group overflow-hidden rounded-[3rem] shadow-2xl border border-white/5">
            <img 
              src="https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1200&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              alt="Workstation PC"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black/70"></div>
            <div className="relative h-full flex flex-col items-center justify-start p-8 md:p-12 text-center space-y-6 md:space-y-8 pt-10 md:pt-14">
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
          <div className="relative w-full aspect-square group overflow-hidden rounded-[3rem] shadow-2xl border border-white/5">
            <img 
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              alt="Laptop"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black/70"></div>
            <div className="relative h-full flex flex-col items-center justify-start p-8 md:p-12 text-center space-y-6 md:space-y-8 pt-10 md:pt-14">
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

      {/* Cinematic Video Section */}
      <section className="px-8 md:px-20 py-4 max-w-[1600px] mx-auto relative z-10">
        <div className="relative w-full aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group">
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-700 z-10 pointer-events-none flex flex-col items-center justify-center">
             <div className="w-24 h-24 rounded-full bg-rose-600/80 backdrop-blur-md flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2"></div>
             </div>
             <p className="mt-8 text-[12px] font-black uppercase tracking-[0.6em] text-white/60 transition-opacity duration-500">Watch Our Craft</p>
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
      </section>

      {/* Explore Our Range Section */}
      <section className="px-8 md:px-20 pt-20 pb-12 max-w-[1600px] mx-auto relative z-10 border-t border-white/5">
        <div className="mt-4 mb-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4">
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
                        className="w-full h-full object-cover"
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
      </section>

      {/* Why Choose Meadow to build a Gaming PC Section */}
      <section className="px-6 sm:px-8 md:px-20 pt-20 pb-24 max-w-[1600px] mx-auto relative z-10 border-t border-white/5">
        <div className="text-center mb-14 pt-2">
          <span className="text-[12px] font-black uppercase tracking-[0.6em] text-rose-500 mb-3 block">
            The Meadow Standard
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase">
            Why Choose Meadow to build a Gaming PC?
          </h2>
        </div>

        {/* Top Row: 2 Split Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Card 1: Meadow Reward Points */}
          <div className="bg-[#090a0c] border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col sm:flex-row hover:border-white/20 transition-all duration-300 group shadow-xl">
            <div className="sm:w-1/2 relative min-h-[190px] sm:min-h-[220px] bg-gradient-to-br from-blue-950 via-slate-900 to-black overflow-hidden flex items-center justify-center p-6">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>
              {/* Visual Rewards Badge */}
              <div className="relative text-center z-10 flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-400/40 flex items-center justify-center text-blue-400 mb-3 shadow-[0_0_30px_rgba(59,130,246,0.4)] group-hover:scale-110 transition-transform duration-500">
                  <Star size={26} className="fill-blue-400 text-blue-400" />
                </div>
                <span className="text-base sm:text-lg font-black uppercase tracking-[0.2em] text-white">Reward Points</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-300/80 mt-0.5">Member Exclusive</span>
              </div>
            </div>
            <div className="sm:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
                Meadow Reward Points
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed mb-6">
                Earn Meadow Reward Points with every purchase, redeemable across our entire range on Meadow!
              </p>
              <Link 
                to="/products"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 transition-colors mt-auto group/link"
              >
                <span>Learn More</span>
                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 2: Our Support */}
          <div className="bg-[#090a0c] border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col sm:flex-row hover:border-white/20 transition-all duration-300 group shadow-xl">
            <div className="sm:w-1/2 relative min-h-[190px] sm:min-h-[220px] bg-black overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop" 
                alt="Our Support" 
                className="w-full h-full object-cover grayscale contrast-125 opacity-80 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-transparent via-black/20 to-[#090a0c]"></div>
            </div>
            <div className="sm:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
                Our Support
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed mb-6">
                We're here for you, always striving to exceed expectations and deliver exceptional service.
              </p>
              <Link 
                to="/our-stores"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400 hover:text-rose-300 transition-colors mt-auto group/link"
              >
                <span>Learn More</span>
                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Row: 3 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Free Shipping */}
          <div className="bg-[#090a0c] border border-white/10 rounded-2xl sm:rounded-3xl p-8 sm:p-10 flex flex-col items-center text-center hover:border-white/20 transition-all duration-300 group shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white mb-6 group-hover:border-rose-500/50 group-hover:text-rose-400 transition-all duration-300">
              <Truck size={30} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Free Shipping
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed mb-8 flex-1">
              All Meadow gaming PCs come with free shipping!
            </p>
            <Link
              to="/product-policy"
              className="w-full sm:w-auto min-w-[160px] py-2.5 px-6 border border-rose-600/70 hover:border-rose-500 text-white hover:bg-rose-600 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-300 text-center"
            >
              LEARN MORE
            </Link>
          </div>

          {/* Card 2: Professionally Assembled */}
          <div className="bg-[#090a0c] border border-white/10 rounded-2xl sm:rounded-3xl p-8 sm:p-10 flex flex-col items-center text-center hover:border-white/20 transition-all duration-300 group shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white mb-6 group-hover:border-rose-500/50 group-hover:text-rose-400 transition-all duration-300">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="2.5" />
                <path d="M12 2v4" />
                <path d="M12 18v4" />
                <path d="M2 12h4" />
                <path d="M18 12h4" />
                <path d="m4.93 4.93 2.83 2.83" />
                <path d="m16.24 16.24 2.83 2.83" />
                <path d="m4.93 19.07 2.83-2.83" />
                <path d="m16.24 7.76 2.83-2.83" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Professionally Assembled
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed mb-8 flex-1">
              Every Meadow gaming PC and laptop that goes through our assembly line is professionally assembled.
            </p>
            <Link
              to="/our-story"
              className="w-full sm:w-auto min-w-[160px] py-2.5 px-6 border border-rose-600/70 hover:border-rose-500 text-white hover:bg-rose-600 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-300 text-center"
            >
              LEARN MORE
            </Link>
          </div>

          {/* Card 3: Industry-Leading Warranty */}
          <div className="bg-[#090a0c] border border-white/10 rounded-2xl sm:rounded-3xl p-8 sm:p-10 flex flex-col items-center text-center hover:border-white/20 transition-all duration-300 group shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white mb-6 group-hover:border-rose-500/50 group-hover:text-rose-400 transition-all duration-300">
              <ShieldCheck size={30} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Industry-Leading Warranty
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed mb-8 flex-1">
              Meadow desktops comes with our industry leading 3-year parts warranty, 3-year labor service, and life-time technical support from our in-house technicians.
            </p>
            <Link
              to="/product-policy"
              className="w-full sm:w-auto min-w-[160px] py-2.5 px-6 border border-rose-600/70 hover:border-rose-500 text-white hover:bg-rose-600 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-300 text-center"
            >
              LEARN MORE
            </Link>
          </div>
        </div>
      </section>

      {/* Signature Stores - Build Your Own PC Services */}
      <section id="signature-stores" className="px-8 md:px-20 pt-16 pb-20 max-w-[1600px] mx-auto relative z-10 border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-600/10 border border-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-[0.25em] mb-4">
              <Sparkles size={14} className="text-rose-500" />
              <span>Exclusive Retail Services</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
              Signature Stores
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mt-3 font-normal leading-relaxed">
              Only our <span className="text-white font-bold">Larkin Junction Store</span> and <span className="text-white font-bold">Pelangi Plaza</span> retail outlets provide full <span className="text-rose-400 font-bold">Build Your Own PC</span> services and live testing bays.
            </p>
          </div>

          {/* Slider Controls / Store Selector Tabs */}
          <div className="flex items-center gap-3">
            {signatureStores.map((store, index) => (
              <button
                key={index}
                onClick={() => setActiveStoreIndex(index)}
                className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 border cursor-pointer ${
                  activeStoreIndex === index
                    ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Building2 size={14} />
                <span>{store.shortName}</span>
              </button>
            ))}

            <div className="flex items-center gap-2 border-l border-white/10 pl-3 ml-1">
              <button
                onClick={() => setActiveStoreIndex((prev) => (prev === 0 ? signatureStores.length - 1 : prev - 1))}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-white flex items-center justify-center transition-all cursor-pointer"
                title="Previous Store"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setActiveStoreIndex((prev) => (prev === signatureStores.length - 1 ? 0 : prev + 1))}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-white flex items-center justify-center transition-all cursor-pointer"
                title="Next Store"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Store Display Box (Matching Reference Layout) */}
        <div className="bg-[#090a0c] border border-white/15 rounded-[2.5rem] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
          {/* Left Side: Store Image */}
          <div className="lg:col-span-6 relative min-h-[350px] lg:min-h-[500px] bg-black overflow-hidden group">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeStoreIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                src={signatureStores[activeStoreIndex].image}
                alt={signatureStores[activeStoreIndex].name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>

            {/* Image Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            <div className="absolute top-6 left-6 z-10 flex flex-wrap gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-rose-600/90 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider">
                Build Your Own PC Hub
              </span>
            </div>

            {/* Quick Slider Indicator over Image */}
            <div className="absolute bottom-6 left-6 right-6 z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {signatureStores.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStoreIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeStoreIndex === idx ? 'w-8 bg-rose-500' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                {activeStoreIndex + 1} of {signatureStores.length} Stores
              </span>
            </div>
          </div>

          {/* Right Side: Text & Details (Direct match to reference image) */}
          <div className="lg:col-span-6 p-8 md:p-12 lg:p-14 flex flex-col justify-between space-y-6 bg-[#0a0b0d] text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStoreIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Red Small Header */}
                  <div className="text-rose-500 font-black text-xs md:text-sm uppercase tracking-[0.3em]">
                    OUR GROWING PRESENCE
                  </div>

                  {/* Main Title */}
                  <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                    {signatureStores[activeStoreIndex].title}
                  </h3>

                  {/* Location Name */}
                  <div className="pt-1">
                    <h4 className="text-xl md:text-2xl font-black text-white tracking-tight">
                      {signatureStores[activeStoreIndex].name}
                    </h4>
                  </div>

                  {/* Detailed Description */}
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-normal pt-2">
                    {signatureStores[activeStoreIndex].description}
                  </p>
                </div>

                {/* Footer Address & Details */}
                <div className="pt-6 border-t border-white/10 space-y-2">
                  <p className="text-xs md:text-sm text-slate-200 font-medium leading-normal">
                    <span className="font-bold text-white">Experiential Centre:</span>{' '}
                    <span className="text-slate-300">{signatureStores[activeStoreIndex].address}</span>
                  </p>
                  <p className="text-xs text-slate-400 font-medium flex flex-wrap gap-4 pt-1">
                    <span>🕒 {signatureStores[activeStoreIndex].hours}</span>
                    <span>📞 {signatureStores[activeStoreIndex].phone}</span>
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="px-8 md:px-20 pt-4 pb-16 max-w-[1600px] mx-auto z-10">
        <div className="text-center mb-4">
          <span className="text-[12px] font-black uppercase tracking-[0.6em] text-rose-500 mb-6 block">Elite Feedback</span>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-8">What Our Clients Say.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               {
                 productName: "RAPID Battlestation",
                 productImage: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop",
                 customerName: "Alex Johnson",
                 rating: 5,
                 feedback: "The performance is absolutely mind-blowing. Best investment for my gaming setup."
               },
               {
                 productName: "ZEAL-M Showcase",
                 productImage: "https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=800&auto=format&fit=crop",
                 customerName: "Sarah Wong",
                 rating: 5,
                 feedback: "Stunning aesthetics and incredibly quiet. The cable management is perfection."
               },
               {
                 productName: "FOCUS Workstation",
                 productImage: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=800&auto=format&fit=crop",
                 customerName: "Michael Chen",
                 rating: 5,
                 feedback: "A workstation that actually keeps up with my workflow. Handled 4K video editing like a breeze."
               }
             ].map((review, i) => (
               <div key={i} className="bg-[#111214] border border-white/10 rounded-[2.5rem] overflow-hidden group transition-all duration-500 hover:border-rose-600/30 flex flex-col min-h-[450px]">
                  <div className="w-full aspect-video relative overflow-hidden bg-slate-900 flex-shrink-0">
                     <img 
                       src={review.productImage} 
                       alt={review.productName} 
                       className="absolute inset-0 w-full h-full object-cover z-20" 
                       loading="eager"
                       referrerPolicy="no-referrer"
                     />
                  </div>
                  <div className="p-10 flex flex-col flex-1 space-y-6">
                   <div className="flex justify-between items-start">
                      <div>
                         <h4 className="text-white font-black text-sm uppercase tracking-widest mb-1">{review.productName}</h4>
                         <p className="text-slate-400 text-[10px] uppercase tracking-widest">Verified Proprietor: {review.customerName}</p>
                      </div>
                      <div className="flex gap-1">
                         {[...Array(review.rating)].map((_, idx) => (
                            <Star key={idx} size={12} className="fill-rose-600 text-rose-600" />
                         ))}
                      </div>
                   </div>
                   <div className="relative">
                      <Quote size={24} className="text-rose-600/20 absolute -top-2 -left-2" />
                      <p className="text-slate-300 text-sm font-light leading-relaxed italic pl-6">
                        {review.feedback}
                      </p>
                   </div>
                </div>
             </div>
           ))}
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
