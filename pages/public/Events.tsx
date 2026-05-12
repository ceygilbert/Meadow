
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Calendar, 
  MapPin, 
  ArrowUpRight,
  ExternalLink,
  Info
} from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
import Footer from '../../components/Footer';
import FloatingWhatsApp from '../../components/FloatingWhatsApp';

interface EventGallery {
  url: string;
  alt: string;
}

interface EventData {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  date: string;
  description: string;
  logo: string;
  gallery: EventGallery[];
  category: string;
}

const EVENTS: EventData[] = [
  {
    id: 'corefusion',
    title: 'MEADOW FUSION 2024',
    subtitle: 'Meadow IT x GIGABYTE',
    location: 'Johor Bahru, Johor',
    date: 'October 2024',
    description: 'An event held in the Johor Bahru branch of Meadow IT, unveils the next generation of motherboards from AMD & Intel. We are glad to host the event that is proudly sponsored by Gigabyte in which we had live AI demos, refreshments and giveaways for the guests who attended.',
    logo: 'https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/COREFUSION_LOGO.png',
    category: 'Hardware Innovations',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80', alt: 'Event Photo 1' },
      { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80', alt: 'Event Photo 2' },
      { url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80', alt: 'Event Photo 3' },
      { url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80', alt: 'Event Photo 4' },
      { url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80', alt: 'Event Photo 5' }
    ]
  },
  {
    id: 'animangaki-2024',
    title: 'AniManGaki 2024',
    subtitle: 'Meadow Community Event',
    location: 'MIECC, Selangor',
    date: 'August 2024',
    description: 'AniManGaki 2024, the anime event that many anticipated, runs for 3 days in MIECC. Meadow IT booth was set up with displays of package PCs, custom water-cool builds and demo rigs for test playing sponsored by MSI, Intel and Antec. Lastly, we also partnered up with Yushirocos for fan interactions and lucky draws.',
    logo: 'https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/ANIMANGAKI_LOGO.png',
    category: 'Community & Gaming',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1566833995204-743ec9528d79?auto=format&fit=crop&q=80', alt: 'Event Photo 1' },
      { url: 'https://images.unsplash.com/photo-1607627060467-31749027ef83?auto=format&fit=crop&q=80', alt: 'Event Photo 2' },
      { url: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80', alt: 'Event Photo 3' },
      { url: 'https://images.unsplash.com/photo-1624391696207-68b2fd467660?auto=format&fit=crop&q=80', alt: 'Event Photo 4' },
      { url: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80', alt: 'Event Photo 5' }
    ]
  }
];

const GallerySection = ({ event }: { event: EventData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % event.gallery.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + event.gallery.length) % event.gallery.length);
  };

  return (
    <div className="relative group">
      <div className="flex gap-4 md:gap-6 overflow-hidden snap-x snap-mandatory scrollbar-hide py-4 px-4 overflow-x-auto">
        {event.gallery.map((img, idx) => (
          <motion.div 
            key={idx}
            className="w-[80%] md:w-[50%] lg:w-[35%] rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0 snap-center shadow-lg aspect-[16/10]"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <img src={img.url} alt={img.alt} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>
        ))}
      </div>
      
      <div className="flex justify-center gap-2 mt-4">
        {event.gallery.map((_, idx) => (
          <div 
            key={idx} 
            className={`w-1 h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'bg-blue-600 w-3' : 'bg-slate-200'}`} 
          />
        ))}
      </div>
    </div>
  );
};

const Events: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-500 selection:text-white font-sans">
      <PublicNavbar />

      {/* Hero Section - Redesigned */}
      <section className="relative pt-32 pb-16 px-4 md:px-10 overflow-hidden bg-slate-50/30">
        <div className="max-w-[1440px] mx-auto relative">
          
          <div className="mb-8">
            <h1 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 mb-4">Innovation & Community</h1>
            <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase text-slate-900">Meadow IT Events</h2>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                  <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter leading-[0.85] mb-8 text-slate-900">
                    REDEFINING THE<br />
                    <span className="text-blue-600">FUTURE</span> OF TECH
                  </h3>
                  <p className="text-slate-600 text-xs md:text-sm font-bold leading-relaxed max-w-md">
                    Join <span className="text-slate-900 font-black italic">Meadow IT</span> as we showcase the latest in high-performance computing, AI-driven workflows, and premium hardware innovations.
                  </p>
                </motion.div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-4 shadow-xl shadow-blue-600/20 group"
                  >
                    View Schedule
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-all">
                      <ArrowUpRight size={18} />
                    </div>
                  </motion.button>
                  
                  <div className="flex items-center gap-4 text-slate-400 group cursor-default">
                    <div className="w-12 h-[1px] bg-slate-200 group-hover:w-16 transition-all" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Est. 2024</span>
                  </div>
                </div>
              </div>

              <div className="relative max-w-xs mx-auto lg:mr-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-[1.25rem] overflow-hidden shadow-2xl relative z-10 border-4 border-white bg-slate-50"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&q=80" 
                    alt="Meadow IT Gaming Setup" 
                    className="w-full h-auto object-contain max-h-[320px]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent pointer-events-none" />
                </motion.div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-3 -right-3 w-full h-full border-2 border-slate-100 rounded-[1.25rem] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="px-4 md:px-10 pb-32">
        <div className="max-w-[1440px] mx-auto space-y-32">
          {EVENTS.map((event, index) => (
            <div key={event.id} className="relative">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-7 space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                        {event.category}
                      </span>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">{event.subtitle}</p>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase text-slate-900">{event.title}</h2>
                    <div className="flex flex-wrap items-center gap-6 text-slate-500">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-blue-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 border-l border-slate-200 pl-6">
                        <Calendar size={14} className="text-blue-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{event.date}</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-slate-500 text-sm leading-relaxed max-w-2xl font-medium"
                  >
                    {event.description}
                  </motion.p>
                </div>

                <div className="lg:col-span-5 flex justify-end">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm relative group transition-all hover:shadow-xl hover:-translate-y-1"
                  >
                    {/* Event logo or placeholder */}
                    <div className="w-32 h-32 md:w-48 md:h-48 flex items-center justify-center p-4">
                      {event.logo ? (
                        <img 
                          src={event.logo} 
                          alt={event.title} 
                          className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-500" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="text-blue-600 font-black text-4xl mb-2 opacity-50">
                            {event.title.charAt(0)}
                          </div>
                          <div className="text-[9px] uppercase font-black tracking-widest text-slate-400">Logo Placeholder</div>
                        </div>
                      )}
                    </div>
                    <div className="absolute top-4 right-4 text-slate-300">
                      <ExternalLink size={24} />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Gallery for this event */}
              <div className="mt-16">
                <GallerySection event={event} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Events;
