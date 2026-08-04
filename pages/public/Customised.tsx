
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeRangeTab, setActiveRangeTab] = useState('originals');
  const [activeStoreIndex, setActiveStoreIndex] = useState(0);
  const [selectedPortfolio, setSelectedPortfolio] = useState<{
    title: string;
    subtitle: string;
    description: string;
    image: string;
  } | null>(null);

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

  const portfolioItems = [
    {
      title: "Mod-3 PC",
      subtitle: "Alien-inspired",
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1200&auto=format&fit=crop",
      description: "This case is an impressively ornate piece of computing equipment for consumers seeking out a decidedly otherworldly option for their setup. The case boasts a custom-made GPU that's crafted to absorb light, while the refractions on the CPU create an RGB backlighting effect to give the unit the appearance of being quite out of this world. The angular design with sharp angles to boot helps to further enhance the ethereal nature of the alienist computer setup. This case was built on the request of a customer and features a cable-free appearance thanks to the use of an open loop system. The system thus appears quite complex, but hides its various internals in a decidedly stylish way for onlookers to admire."
    },
    {
      title: "Cyberpunk Edition",
      subtitle: "Neon-Infused Water Loop",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1200&auto=format&fit=crop",
      description: "Designed for high-load Ray Tracing and futuristic aesthetics, this custom rig features dual distro plates with custom nickel-plated brass tubing. The neon-infused coolant flows seamlessly through high-grade acrylic blocks, delivering exceptional thermal performance while maintaining a strikingly vibrant cyberpunk ambiance. Hand-sleeved modular cables and precision-machined aluminum accents complete this bespoke masterpiece created for an enthusiast client."
    },
    {
      title: "Zeal-M Masterpiece",
      subtitle: "Bespoke Glass Showcase",
      image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=1200&auto=format&fit=crop",
      description: "A minimalist yet extreme custom workstation engineered for silent 3D rendering and computational physics. Featuring a dual 360mm copper radiator arrangement and ultra-quiet MagLev fans, this build operates with zero thermal throttling under full synthetic load. The panoramic tempered glass enclosure highlights the mirror-finish water blocks and clean geometric layout, demonstrating absolute precision craftsmanship."
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
      <section className="px-8 md:px-20 py-16 max-w-[1600px] mx-auto relative z-10">
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
          {portfolioItems.map((item, index) => (
            <div 
              key={index} 
              onClick={() => setSelectedPortfolio(item)}
              className="relative group overflow-hidden rounded-[2rem] border border-white/10 cursor-pointer shadow-2xl"
            >
              <img 
                src={item.image} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                alt={item.title}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-8">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white tracking-tight">{item.title}</h3>
                    <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-rose-600 text-white flex items-center justify-center transition-all">
                      <Maximize2 size={14} />
                    </div>
                  </div>
                  <p className="text-xs text-rose-400 font-bold uppercase tracking-wider mt-1">{item.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Item Popup Modal */}
      <AnimatePresence>
        {selectedPortfolio && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPortfolio(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-5xl bg-[#0a0b0c] border border-white/15 rounded-3xl overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2 max-h-[90vh] my-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPortfolio(null)}
                className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
              >
                <X size={20} />
              </button>

              {/* Left Column - Image */}
              <div className="relative min-h-[280px] md:min-h-[480px] w-full bg-black overflow-hidden flex items-center justify-center">
                <img
                  src={selectedPortfolio.image}
                  alt={selectedPortfolio.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Right Column - Information */}
              <div className="p-8 md:p-12 flex flex-col justify-center overflow-y-auto space-y-6 bg-[#0a0b0c] text-left">
                <div>
                  <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-none mb-3">
                    {selectedPortfolio.title}
                  </h3>
                  <h4 className="text-base md:text-lg font-bold text-slate-300">
                    {selectedPortfolio.subtitle}
                  </h4>
                </div>

                <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-normal">
                  {selectedPortfolio.description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

      {/* We Care for You Section */}
      <section className="px-8 md:px-20 pt-20 pb-24 max-w-[1600px] mx-auto relative z-10 border-t border-white/5">
        <div className="text-center mb-16 pt-2">
          <span className="text-[12px] font-black uppercase tracking-[0.6em] text-rose-500 mb-2 block">Our Commitment</span>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-2">We Care for You.</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Securing a lifetime of professional after-sale services, ready on-call to ensure your computational performance remains absolute.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12 mb-2">
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

      {/* Signature Stores - Build Your Own PC Services */}
      <section className="px-8 md:px-20 pt-16 pb-20 max-w-[1600px] mx-auto relative z-10 border-t border-white/5">
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
