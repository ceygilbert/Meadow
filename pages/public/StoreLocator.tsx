
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Monitor, 
  Settings, 
  ShoppingBag,
  ArrowLeft,
  Cpu,
  Loader2,
  Crosshair,
  ShoppingCart,
  Menu,
  X,
  User as UserIcon,
  Trash2,
  Minus,
  Plus,
  Heart,
  ArrowUpRight,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Product, Profile, Brand } from '../../types';
import PublicNavbar from '../../components/PublicNavbar';

interface ITStore {
  id: string;
  name: string;
  type: 'Mega Store' | 'Service Center' | 'IT Store';
  address: string;
  lat: number;
  lng: number;
  phone: string;
}

interface CartItem extends Product {
  quantity: number;
}

type MenuMode = 'all' | 'story' | 'contact' | 'products';

const STORES: ITStore[] = [
  {
    id: '1',
    name: 'MEADOW IT DISTRIBUTION SDN BHD (HQ)',
    type: 'Service Center',
    address: 'No 5, 7 & 9, Jalan Keembong 22, Johor Jaya, 81100 Johor Bahru, Johor.',
    lat: 1.5410,
    lng: 103.7997,
    phone: '+60 7-355 5555'
  },
  {
    id: '2',
    name: 'MEADOW COMPUTER SDN BHD TAMAN U',
    type: 'IT Store',
    address: 'No 8, Jalan Kebudayaan 1, Taman Universiti, 81300 Skudai, Johor.',
    lat: 1.5435,
    lng: 103.6267,
    phone: '+60 7-521 1111'
  },
  {
    id: '3',
    name: 'MEADOW COMPUTER SDN BHD PLAZA PELANGI',
    type: 'Mega Store',
    address: 'Lot.3.26, 26A, 27, Level 3, Plaza Pelangi, 80400 Johor Bahru, Johor.',
    lat: 1.4827,
    lng: 103.7635,
    phone: '+60 7-333 3333'
  },
  {
    id: '4',
    name: 'ASUS CONCEPT STORE MEADOW COMPUTER',
    type: 'IT Store',
    address: 'Lot.3.16, Level 3, Plaza Pelangi, 80400 Johor Bahru, Johor.',
    lat: 1.4827,
    lng: 103.7635,
    phone: '+60 7-333 4444'
  },
  {
    id: '5',
    name: 'HP WORLD MEADOW COMPUTER TOPPEN',
    type: 'IT Store',
    address: 'Level 2, Lot L2.22, Toppen Shopping Centre, 33A, Jln Harmonium, Taman Desa Tebrau, 81100 Johor Bahru, Johor Darul Ta’zim.',
    lat: 1.5484,
    lng: 103.7963,
    phone: '+60 7-364 8888'
  },
  {
    id: '6',
    name: 'HUAWEI AUTHORIZED EXPERIENCE STORE',
    type: 'IT Store',
    address: 'K1.01B, Level 1, Plaza Pelangi, 80400 Johor Bahru, Johor.',
    lat: 1.4827,
    lng: 103.7635,
    phone: '+60 7-333 5555'
  }
];

const StoreLocator: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStore, setSelectedStore] = useState<ITStore>(STORES[0]);
  const [isLocating, setIsLocating] = useState(false);

  // Global UI States (Synced from Home)
  const [isFullMenuOpen, setIsFullMenuOpen] = useState(false);
  const [menuMode, setMenuMode] = useState<MenuMode>('all');
  const [headerSearch, setHeaderSearch] = useState('');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    checkUser();
    const savedCart = localStorage.getItem('meadow_cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('meadow_cart', JSON.stringify(cart));
  }, [cart]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
    if (session?.user) fetchProfile(session.user.id);
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setProfile(data);
  };

  const openMenu = (mode: MenuMode) => {
    setMenuMode(mode);
    setIsFullMenuOpen(true);
  };

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(headerSearch.trim())}`);
    }
  };

  const handleUseLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        alert(`Location found: ${position.coords.latitude}, ${position.coords.longitude}. Searching for nearby Johor branches...`);
      },
      (error) => {
        setIsLocating(false);
        alert('Could not access your location. Please check your browser permissions.');
      }
    );
  };

  // Filter stores based on search term and selected type
  const filteredStores = STORES.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         store.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All Types' || store.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Full-Screen Navigation Menu Overlay (Synced with Home) */}
      <div className={`fixed inset-0 z-[500] bg-white transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${isFullMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="h-full flex flex-col">
          {/* Menu Header */}
          <div className="h-32 md:h-48 px-6 md:px-12 flex items-center justify-between shrink-0">
             <Link to="/" onClick={() => setIsFullMenuOpen(false)} className="flex items-center group">
                <img src="https://illuminatelabs.space/assets/meadow_logo.png" className="h-24 md:h-36 w-auto object-contain transition-transform group-hover:scale-105" alt="Meadow" />
             </Link>
             <button 
                onClick={() => setIsFullMenuOpen(false)}
                className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
             >
                <X size={28} />
             </button>
          </div>

          <div className="flex-1 flex flex-col md:flex-row px-6 md:px-24 py-12 gap-12 overflow-y-auto overflow-x-hidden">
             <div className="flex-1">
                <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 mb-12">Navigation Protocol</p>
                <nav className="flex flex-col gap-12 md:gap-16">
                   
                   {/* Story Mode */}
                   {(menuMode === 'all' || menuMode === 'story') && (
                     <div className="flex flex-col gap-6 group animate-in slide-in-from-left duration-500">
                        <div className="flex items-center gap-6">
                          <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-slate-900">Brand Story</span>
                        </div>
                        <div className="flex flex-col items-start gap-3 pl-2 md:pl-4 border-l-2 border-slate-100">
                           <a href="#" onClick={() => setIsFullMenuOpen(false)} className="text-sm md:text-xl font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2">
                              Brand Story <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100" />
                           </a>
                           <a href="#" onClick={() => setIsFullMenuOpen(false)} className="text-sm md:text-xl font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2">
                              Join Our Team <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100" />
                           </a>
                        </div>
                     </div>
                   )}

                   {/* Products Mode */}
                   {(menuMode === 'all' || menuMode === 'products') && (
                     <Link to="/categories" onClick={() => setIsFullMenuOpen(false)} className="group flex items-center gap-6 animate-in slide-in-from-left duration-500">
                        <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-slate-900 transition-all group-hover:italic group-hover:translate-x-4">Category</span>
                        <ArrowUpRight className="text-slate-200 group-hover:text-slate-900 transition-colors" size={32} />
                     </Link>
                   )}

                   {/* Contact Mode */}
                   {(menuMode === 'all' || menuMode === 'contact') && (
                     <div className="flex flex-col gap-6 group animate-in slide-in-from-left duration-500">
                        <div className="flex items-center gap-6">
                          <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-slate-900">Contact Us</span>
                        </div>
                        <div className="flex flex-col items-start gap-3 pl-2 md:pl-4 border-l-2 border-slate-100">
                           <a href="#" onClick={() => setIsFullMenuOpen(false)} className="text-sm md:text-xl font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2">
                              Inquiry Form <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100" />
                           </a>
                           <Link to="/stores" onClick={() => setIsFullMenuOpen(false)} className="text-sm md:text-xl font-bold text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-2">
                              Store Locator <ArrowUpRight size={16} />
                           </Link>
                        </div>
                     </div>
                   )}
                   
                   {menuMode !== 'all' && (
                     <button 
                        onClick={() => setMenuMode('all')}
                        className="text-xs font-black uppercase tracking-widest text-slate-300 hover:text-slate-900 transition-colors flex items-center gap-2 mt-8"
                     >
                        <ArrowLeft size={14} /> Back to Full Menu
                     </button>
                   )}
                </nav>
             </div>

             <div className="hidden lg:flex w-[400px] flex-col justify-end pb-20 gap-8">
                <div className="aspect-[4/5] bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 p-8 flex flex-col justify-between group">
                   <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Branch Spotlight</span>
                      <MapPin className="text-blue-600" />
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-2xl font-black uppercase tracking-tighter leading-none">Johor Jaya <br /> Headquarters</h4>
                      <p className="text-xs text-slate-400 font-medium">The heart of our technical distribution and high-performance rig calibration.</p>
                      <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 border-b-2 border-blue-600 pb-1">Get Directions &rarr;</button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <PublicNavbar 
        user={user}
        profile={profile}
        cartCount={cart.length}
        onOpenAuth={() => navigate('/')} 
        onOpenCart={() => setIsCartOpen(true)}
        scrolled={scrolled}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden pt-24 md:pt-36">
        {/* Sidebar */}
        <div className="w-full md:w-[400px] border-r border-slate-100 flex flex-col bg-slate-50/30 overflow-hidden shadow-xl z-10 relative">
          <div className="p-6 space-y-4 shrink-0 bg-white shadow-sm border-b border-slate-100">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Search branches..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 bg-slate-100 border-none rounded-xl outline-none font-bold text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <button className="px-5 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all">
                Search
              </button>
            </div>

            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none font-bold text-sm text-slate-900 appearance-none cursor-pointer"
            >
              <option>All Types</option>
              <option>Mega Store</option>
              <option>Service Center</option>
              <option>IT Store</option>
            </select>

            <button 
              onClick={handleUseLocation}
              disabled={isLocating}
              className="w-full py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-900 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            >
              {isLocating ? <Loader2 size={16} className="animate-spin" /> : <Crosshair size={16} className="text-blue-600" />}
              Use My Location
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
            {filteredStores.map((store) => (
              <div 
                key={store.id}
                onClick={() => setSelectedStore(store)}
                className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                  selectedStore.id === store.id 
                    ? 'bg-white border-blue-500 shadow-lg shadow-blue-500/10 scale-[1.02]' 
                    : 'bg-white border-transparent hover:border-slate-200 hover:bg-white shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-black text-sm leading-snug ${selectedStore.id === store.id ? 'text-blue-600' : 'text-slate-900'}`}>
                    {store.name}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                    store.type === 'Mega Store' ? 'bg-blue-100 text-blue-600' : 
                    store.type === 'Service Center' ? 'bg-slate-100 text-slate-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {store.type === 'Mega Store' ? <ShoppingBag size={10} /> : 
                     store.type === 'Service Center' ? <Settings size={10} /> : <Monitor size={10} />}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{store.type}</span>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-slate-300 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{store.address}</p>
                </div>

                {selectedStore.id === store.id && (
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase text-blue-600">{store.phone}</span>
                     <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       Navigate <Navigation size={12} className="text-blue-500" />
                     </div>
                  </div>
                )}
              </div>
            ))}

            {filteredStores.length === 0 && (
              <div className="py-20 text-center">
                <MapPin className="mx-auto text-slate-200 mb-4" size={48} strokeWidth={1} />
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No stores found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 bg-slate-100 relative">
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            style={{ border: 0 }}
            src={`https://www.google.com/maps?q=${encodeURIComponent(selectedStore.address)}&output=embed`}
            allowFullScreen
            title="Store Location"
          ></iframe>

          {/* Map Overlay Controls (Decorative) */}
          <div className="absolute top-6 right-6 flex flex-col gap-2 pointer-events-auto">
             <div className="w-10 h-20 bg-white rounded-xl shadow-2xl border border-slate-100 flex flex-col">
                <button className="flex-1 border-b border-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900">+</button>
                <button className="flex-1 flex items-center justify-center text-slate-400 hover:text-slate-900">-</button>
             </div>
             <button className="w-10 h-10 bg-white rounded-xl shadow-2xl border border-slate-100 flex items-center justify-center text-blue-600">
                <Navigation size={18} />
             </button>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom duration-700 pointer-events-auto">
             <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-50">Focused Branch</span>
                <span className="text-xs font-bold truncate max-w-[200px]">{selectedStore.name}</span>
             </div>
             <div className="w-px h-6 bg-white/20"></div>
             <button className="text-[10px] font-black uppercase tracking-widest hover:text-blue-400 transition-colors">Get Directions</button>
          </div>
        </div>
      </div>

      {/* Cart Slider */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-md" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-700 flex flex-col p-10 md:p-14">
            <div className="flex items-center justify-between mb-16">
               <div className="flex flex-col">
                 <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Your Selection</h2>
                 <p className="text-xs text-slate-300 font-black uppercase tracking-[0.3em] mt-3">Active Buffer</p>
               </div>
               <button onClick={() => setIsCartOpen(false)} className="w-12 h-12 md:w-14 md:h-14 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full flex items-center justify-center transition-all shadow-sm"><X size={30} /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-12 scrollbar-hide">
               {cart.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <div className="w-28 h-28 bg-slate-50 rounded-[3rem] flex items-center justify-center text-slate-300 mb-10"><ShoppingCart size={48} /></div>
                    <p className="text-xs font-black uppercase tracking-[0.3em]">No items in buffer.</p>
                 </div>
               ) : (
                 cart.map(item => (
                   <div key={item.id} className="group relative">
                      <div className="flex gap-10">
                         <div className="w-32 h-32 rounded-[2.5rem] bg-[#F9FAFB] overflow-hidden shrink-0 border border-slate-50 p-5 transition-all group-hover:scale-105">
                           <img src={item.image_url} className="w-full h-full object-contain" />
                         </div>
                         <div className="flex-1 py-3">
                           <div className="flex justify-between items-start gap-4 mb-5">
                             <h4 className="font-black text-slate-900 text-base uppercase tracking-tight leading-none truncate max-w-[150px]">{item.name}</h4>
                             <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-slate-200 hover:text-rose-500 transition-colors"><X size={18} /></button>
                           </div>
                           <div className="flex items-center justify-between mt-auto">
                              <span className="font-black text-sm">Qty: {item.quantity}</span>
                              <span className="font-black text-slate-900 text-base">RM{(item.price * item.quantity).toLocaleString()}</span>
                           </div>
                         </div>
                      </div>
                   </div>
                 ))
               )}
            </div>
            {cart.length > 0 && (
              <div className="mt-auto pt-14 border-t border-slate-50">
                 <button onClick={() => navigate('/checkout')} className="w-full py-7 bg-slate-900 text-white font-black rounded-3xl hover:bg-black transition-all shadow-2xl uppercase tracking-[0.3em] text-xs">Initialize Purchase</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreLocator;
