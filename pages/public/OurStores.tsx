
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight,
  MapPin,
  Phone,
  Clock,
  Navigation,
  X,
  LayoutList,
  Map as MapIcon,
  ExternalLink,
  Check,
  Building2,
  ShieldCheck,
  Wrench,
  Laptop
} from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
import Footer from '../../components/Footer';
import { Product } from '../../types';
import { useAuth } from '../../lib/AuthContext';

interface StoreItem {
  id: string;
  name: string;
  badge: string;
  badgeType: 'meadow' | 'asus' | 'hp' | 'hq';
  category: 'Meadow Computer' | 'ASUS' | 'HP' | 'Distribution HQ';
  address: string;
  tags: string[];
  image: string;
  phone: string;
  hours: string;
  googleMapsUrl: string;
  embedMapUrl: string;
  description: string;
  features: string[];
}

const STORE_LIST: StoreItem[] = [
  {
    id: 'pelangi-meadow',
    name: 'Pelangi Plaza',
    badge: 'MEADOW STORE',
    badgeType: 'meadow',
    category: 'Meadow Computer',
    address: 'Lot 3.26, 26A, 27, Level 3, Plaza Pelangi, Taman Pelangi, 80400 Johor Bahru, Johor',
    tags: ['PC Build', 'Laptops', 'Components', 'Support'],
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200',
    phone: '+60 7-333 3333',
    hours: '10:00 AM - 10:00 PM (Daily)',
    googleMapsUrl: 'https://maps.google.com/?q=Lot+3.26+Plaza+Pelangi+Johor+Bahru',
    embedMapUrl: 'https://www.google.com/maps?q=Lot+3.26+Plaza+Pelangi+Johor+Bahru&output=embed',
    description: 'Our flagship retail experience featuring an extensive showroom of custom gaming rigs, workstation architectures, and enthusiast component displays.',
    features: ['Custom PC Assembly & Diagnostic Lab', 'Dedicated Component Consultation Desk', 'Comprehensive Peripheral Testing Zone', 'Immediate Warranty & RMA Drop-off']
  },
  {
    id: 'larkin-junction',
    name: 'Larkin Junction',
    badge: 'MEADOW STORE',
    badgeType: 'meadow',
    category: 'Meadow Computer',
    address: 'Lot 4.12, Jalan Dewata, Taman Larkin Perdana, 80350 Johor Bahru, Johor Darul Ta\'zim',
    tags: ['PC Build', 'Laptops', 'Peripherals', 'Support'],
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=1200',
    phone: '+60 7-221 2222',
    hours: '10:00 AM - 10:00 PM (Daily)',
    googleMapsUrl: 'https://maps.google.com/?q=Larkin+Junction+Johor+Bahru',
    embedMapUrl: 'https://www.google.com/maps?q=Lot+4.12+Jalan+Dewata+Taman+Larkin+Perdana+Johor+Bahru&output=embed',
    description: 'Conveniently situated in Larkin, offering prompt technical assistance, prebuilt desktop configurations, and everyday workspace peripherals.',
    features: ['Instant Hardware Upgrade Station', 'Business Fleet & Student Solutions', 'Official Genuine Components Guarantee', 'Same-Day Pickup for Online Orders']
  },
  {
    id: 'taman-universiti',
    name: 'Taman Universiti',
    badge: 'MEADOW STORE',
    badgeType: 'meadow',
    category: 'Meadow Computer',
    address: '8, Jalan Kebudayaan 1, Taman Universiti, 81300 Skudai',
    tags: ['PC Build', 'Components', 'Peripherals', 'Support'],
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1200',
    phone: '+60 7-521 1111',
    hours: '10:00 AM - 9:00 PM (Daily)',
    googleMapsUrl: 'https://maps.google.com/?q=8+Jalan+Kebudayaan+1+Taman+Universiti+81300+Skudai',
    embedMapUrl: 'https://www.google.com/maps?q=8+Jalan+Kebudayaan+1+Taman+Universiti+81300+Skudai&output=embed',
    description: 'The core student and enthusiast hub in Skudai, providing accessible custom PC builds, laptop optimization, and hardware upgrades.',
    features: ['Student Discount Verification & Bundles', 'Rapid Thermal Paste & Cleaning Service', 'Comprehensive Graphic Card Stock', 'Mechanical Keyboards & Audio Gear Demo']
  },
  {
    id: 'pelangi-asus',
    name: 'Pelangi Plaza',
    badge: 'ASUS CONCEPT STORE',
    badgeType: 'asus',
    category: 'ASUS',
    address: 'LOT 3.16 & 3.17, Level 3, Plaza Pelangi, Jalan Kuning, Taman Pelangi, 80400 Johor Bahru, Johor Darul Ta\'zim',
    tags: ['ASUS Products', 'Laptops', 'Accessories', 'Support'],
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200',
    phone: '+60 7-333 4444',
    hours: '10:00 AM - 10:00 PM (Daily)',
    googleMapsUrl: 'https://maps.google.com/?q=ASUS+Plaza+Pelangi+Johor+Bahru',
    embedMapUrl: 'https://www.google.com/maps?q=Plaza+Pelangi+ASUS+Concept+Store+Johor+Bahru&output=embed',
    description: 'Authorized ASUS concept store showcasing the complete Republic of Gamers (ROG), TUF Gaming, ZenBook, and ProArt ecosystem.',
    features: ['Complete ROG & TUF Gaming Battle Stations', 'ZenBook Ultraportable Touch Experience', 'ProArt Color-Calibrated Displays', 'Official ASUS Authorized Warranty Service']
  },
  {
    id: 'toppen-hp',
    name: 'Toppen',
    badge: 'HP CONCEPT STORE',
    badgeType: 'hp',
    category: 'HP',
    address: 'No 33A, Lot L2/22, Level 2, Toppen Shopping Centre, Jln Harmonium, Taman Desa Tebrau, 81100 Johor Bahru, Johor Darul Ta\'zim',
    tags: ['HP Products', 'Laptops', 'Printers', 'Support'],
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=1200',
    phone: '+60 7-364 8888',
    hours: '10:00 AM - 10:00 PM (Daily)',
    googleMapsUrl: 'https://maps.google.com/?q=Toppen+Shopping+Centre+Johor+Bahru',
    embedMapUrl: 'https://www.google.com/maps?q=Toppen+Shopping+Centre+HP+Store+Johor+Bahru&output=embed',
    description: 'Dedicated HP Brand Experience Store showcasing OMEN gaming rigs, Spectre luxury convertibles, ENVY creative laptops, and smart printing solutions.',
    features: ['OMEN High-FPS Gaming Playground', 'Spectre & ENVY Creator Experience', 'Smart Tank Printer & Ink Supply Hub', 'Certified HP Customer Support Desk']
  },
  {
    id: 'distribution-hq',
    name: 'Meadow IT Distribution',
    badge: 'DISTRIBUTION HQ',
    badgeType: 'hq',
    category: 'Distribution HQ',
    address: '7 & 9, Jalan Keembong 22, Taman Johor Jaya, 81100 Johor Bahru, Johor Darul Ta\'zim',
    tags: ['Distribution', 'Warehouse', 'Business', 'HQ'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    phone: '+60 7-355 5555',
    hours: '9:00 AM - 6:00 PM (Mon - Fri)',
    googleMapsUrl: 'https://maps.google.com/?q=7+Jalan+Keembong+22+Johor+Jaya+Johor+Bahru',
    embedMapUrl: 'https://www.google.com/maps?q=7+Jalan+Keembong+22+Johor+Jaya+Johor+Bahru&output=embed',
    description: 'The central hub for wholesale hardware distribution, enterprise computing procurement, and corporate IT infrastructure deployment in Southern Malaysia.',
    features: ['B2B Corporate Procurement Department', 'Large-Scale Warehousing & Logistics Fulfillment', 'Enterprise Server & Networking Testing Area', 'Wholesale Partner Helpdesk']
  }
];

interface CartItem extends Product {
  quantity: number;
}

const CATEGORY_FILTERS = [
  'All Stores',
  'Meadow Computer',
  'ASUS',
  'HP',
  'Distribution HQ'
] as const;

type FilterCategory = typeof CATEGORY_FILTERS[number];

const OurStores: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('All Stores');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedModalStore, setSelectedModalStore] = useState<StoreItem | null>(null);
  const [selectedMapStore, setSelectedMapStore] = useState<StoreItem>(STORE_LIST[0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem('meadow_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const filteredStores = activeCategory === 'All Stores'
    ? STORE_LIST
    : STORE_LIST.filter(s => s.category === activeCategory);

  const getBadgeStyle = (type: StoreItem['badgeType']) => {
    switch (type) {
      case 'meadow':
        return 'bg-[#FFF1F2] text-[#E11D48] border border-[#FFE4E6]';
      case 'asus':
      case 'hp':
        return 'bg-[#F0F9FF] text-[#0284C7] border border-[#E0F2FE]';
      case 'hq':
        return 'bg-[#FAF5FF] text-[#9333EA] border border-[#F3E8FF]';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-800 font-sans selection:bg-slate-900 selection:text-white overflow-x-hidden">
      <PublicNavbar 
        user={user}
        profile={profile}
        cartCount={cart.length}
        onOpenAuth={() => navigate('/')} 
        onOpenCart={() => setIsCartOpen(true)}
        scrolled={scrolled}
      />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[480px] flex items-center overflow-hidden">
        <video 
          src="https://illuminatelabs.space/assets/locator_vd.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover grayscale brightness-75"
        />
        <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[1px]"></div>
        <div className="relative px-6 md:px-16 max-w-[1440px] mx-auto w-full z-10">
          <div className="max-w-3xl">
            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/70 mb-5 animate-in fade-in slide-in-from-bottom duration-700">Presence</h2>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight mb-6 animate-in fade-in slide-in-from-bottom duration-1000">
              Find a Meadow Store Near You
            </h1>
            <p className="text-lg md:text-xl font-light italic text-white/90 max-w-xl animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
              Discover Meadow's physical spaces across Johor
            </p>
          </div>
        </div>
      </section>

      {/* Main Body Section */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 py-12 md:py-16">
        
        {/* Controls Bar: Category Filters & View Toggle */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 mb-10">
          
          {/* Left Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {CATEGORY_FILTERS.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#0B1329] text-white shadow-sm hover:bg-black'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Right View Toggle Pill */}
          <div className="inline-flex items-center bg-white border border-slate-200 rounded-full p-1 shadow-sm shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-slate-100 text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutList size={15} />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                viewMode === 'map'
                  ? 'bg-slate-100 text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <MapIcon size={15} />
              <span>Map View</span>
            </button>
          </div>
        </div>

        {/* View Mode: List View Grid (Matching Screenshot) */}
        {viewMode === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredStores.map((store) => (
              <div 
                key={store.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Store Image */}
                <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-100">
                  <img 
                    src={store.image} 
                    alt={store.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Store Content */}
                <div className="p-6 flex flex-col flex-1">
                  
                  {/* Store Badge */}
                  <div className="mb-3">
                    <span className={`inline-block text-[10px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full ${getBadgeStyle(store.badgeType)}`}>
                      {store.badge}
                    </span>
                  </div>

                  {/* Store Name */}
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 leading-tight">
                    {store.name}
                  </h3>

                  {/* Store Address */}
                  <div className="flex items-start gap-2 text-xs text-slate-500 font-medium leading-relaxed mb-5 min-h-[36px]">
                    <MapPin size={15} className="shrink-0 text-slate-400 mt-0.5" />
                    <span>{store.address}</span>
                  </div>

                  {/* Store Service Tags */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
                    {store.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-[11px] font-medium border border-slate-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 mt-auto pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedModalStore(store)}
                      className="bg-[#0F172A] hover:bg-black text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-200 shadow-xs active:scale-95 cursor-pointer"
                    >
                      View Store
                    </button>
                    <a
                      href={store.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-200 flex items-center gap-1.5 active:scale-95"
                    >
                      <span>Directions</span>
                      <ArrowRight size={13} />
                    </a>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Mode: Map View */}
        {viewMode === 'map' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col lg:flex-row h-[750px]">
            {/* Store Selection List */}
            <div className="w-full lg:w-[420px] border-r border-slate-100 flex flex-col bg-slate-50/40">
              <div className="p-5 border-b border-slate-100 bg-white">
                <h3 className="font-bold text-slate-900 text-sm">Select a Meadow Location</h3>
                <p className="text-xs text-slate-500 mt-0.5">Showing {filteredStores.length} spaces in Johor</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredStores.map((store) => {
                  const isSelected = selectedMapStore.id === store.id;
                  return (
                    <div
                      key={store.id}
                      onClick={() => setSelectedMapStore(store)}
                      className={`p-4 rounded-xl cursor-pointer transition-all border ${
                        isSelected 
                          ? 'bg-white border-slate-900 shadow-sm' 
                          : 'bg-white border-slate-200/70 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getBadgeStyle(store.badgeType)}`}>
                          {store.badge}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">{store.hours.split('(')[0]}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base mb-1">{store.name}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{store.address}</p>
                      
                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedModalStore(store);
                            }}
                            className="text-xs font-bold text-slate-900 hover:underline"
                          >
                            Details & Hours
                          </button>
                          <a
                            href={store.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            Directions <ArrowRight size={12} />
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="flex-1 bg-slate-100 relative h-full">
              <iframe
                title="Store Map"
                src={selectedMapStore.embedMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-96 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-xl flex items-center justify-between gap-4">
                <div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getBadgeStyle(selectedMapStore.badgeType)}`}>
                    {selectedMapStore.badge}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{selectedMapStore.name}</h4>
                  <p className="text-[11px] text-slate-500 truncate max-w-[200px]">{selectedMapStore.address}</p>
                </div>
                <a
                  href={selectedMapStore.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0F172A] text-white text-xs font-semibold px-4 py-2.5 rounded-full shrink-0 flex items-center gap-1 hover:bg-black transition-colors"
                >
                  Navigate <Navigation size={12} />
                </a>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Store Detail Modal */}
      <AnimatePresence>
        {selectedModalStore && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedModalStore(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header Image */}
              <div className="relative h-60 sm:h-72 w-full bg-slate-100 overflow-hidden shrink-0">
                <img 
                  src={selectedModalStore.image} 
                  alt={selectedModalStore.name} 
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedModalStore(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white text-slate-800 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className={`text-[10px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full shadow-xs ${getBadgeStyle(selectedModalStore.badgeType)}`}>
                    {selectedModalStore.badge}
                  </span>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {selectedModalStore.name}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {selectedModalStore.description}
                  </p>
                </div>

                {/* Key Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <MapPin className="text-slate-600 shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Address</p>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5 leading-relaxed">{selectedModalStore.address}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <Clock className="text-slate-600 shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Operating Hours</p>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5">{selectedModalStore.hours}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <Phone className="text-slate-600 shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Direct Contact</p>
                      <a href={`tel:${selectedModalStore.phone}`} className="text-xs font-semibold text-blue-600 hover:underline mt-0.5 block">{selectedModalStore.phone}</a>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <ShieldCheck className="text-slate-600 shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Services Available</p>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5">{selectedModalStore.tags.join(', ')}</p>
                    </div>
                  </div>
                </div>

                {/* Features Checklist */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-3">Highlights & Store Capabilities</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedModalStore.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <Check size={14} className="text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100">
                  <a
                    href={selectedModalStore.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3.5 bg-[#0F172A] hover:bg-black text-white text-xs font-bold rounded-full text-center flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Navigation size={14} /> Open in Google Maps
                  </a>
                  <a
                    href="https://wa.me/message/SWV2JDRGAAHHK1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full text-center flex items-center justify-center gap-2 transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default OurStores;

