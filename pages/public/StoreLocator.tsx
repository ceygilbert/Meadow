
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
  ChevronRight
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Product, Profile, Brand } from '../../types';

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
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, Math.min(item.quantity + delta, item.stock));
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const calculateDiscountedPrice = (price: number, type: string, value: number) => {
    if (type === 'percentage') return price * (1 - value / 100);
    if (type === 'fixed') return Math.max(0, price - value);
    return price;
  };

  const cartTotal = cart.reduce((acc, item) => {
    const price = calculateDiscountedPrice(item.price, item.discount_type, item.discount_value);
    return acc + (price * item.quantity);
  }, 0);

  const filteredStores = STORES.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          store.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All Types' || store.type === selectedType;
    return matchesSearch && matchesType;
  });

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

  const openMenu = (mode: MenuMode) => {
    setMenuMode(mode);
    setIsFullMenuOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Full-Screen Navigation Menu Overlay (Synced with Home) */}
      <div className={`fixed inset-0 z-[500] bg-white transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${isFullMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="h-full flex flex-col">
          {/* Menu Header */}
          <div className="h-24 px-6 md:px-12 flex items-center justify-between shrink-0">
             <div className="flex items-center gap-2">
                <Link to="/" onClick={() => setIsFullMenuOpen(false)} className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                  <Cpu size={18} />
                </Link>
                <span className="text-lg font-black tracking-tighter uppercase">Meadow</span>
             </div>
             <button 
                onClick={() => setIsFullMenuOpen(false)}
                className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
             >
                <X size={24} />
             </button>
          </div>

          <div className="flex-1 flex flex-col md:flex-row px-6 md:px-24 py-12 gap-12 overflow-y-auto overflow-x-hidden">
             <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-12">Navigation Protocol</p>
                <nav className="flex flex-col gap-12 md:gap-16">
                   {/* Brand Story Parent */}
                   {(menuMode === 'all' || menuMode === 'story') && (
                     <div className="flex flex-col gap-6 group animate-in slide-in-from-left duration-500">
                        <div className="flex items-center gap-6">
                          <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-slate-900">Story</span>
                        </div>
                        <div className="flex flex-col items-start gap-3 pl-2 md:pl-4 border-l-2 border-slate-100">
                           <Link to="/" onClick={() => setIsFullMenuOpen(false)} className="text-sm md:text-xl font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2">
                              Brand Story <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100" />
                           </Link>
                           <Link to="/" onClick={() => setIsFullMenuOpen(false)} className="text-sm md:text-xl font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2">
                              Join Our Team <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100" />
                           </Link>
                        </div>
                     </div>
                   )}

                   {/* Products Parent */}
                   {(menuMode === 'all' || menuMode === 'products') && (
                     <Link to="/" onClick={() => setIsFullMenuOpen(false)} className="group flex items-center gap-6 animate-in slide-in-from-left duration-500 delay-100">
                        <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-slate-900 transition-all group-hover:italic group-hover:translate-x-4">Products</span>
                        <ArrowUpRight className="text-slate-200 group-hover:text-slate-900 transition-colors" size={32} />
                     </Link>
                   )}

                   {/* Contact Us Parent */}
                   {(menuMode === 'all' || menuMode === 'contact') && (
                     <div className="flex flex-col gap-6 group animate-in slide-in-from-left duration-500 delay-200">
                        <div className="flex items-center gap-6">
                          <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-slate-900">Contact</span>
                        </div>
                        <div className="flex flex-col items-start gap-3 pl-2 md:pl-4 border-l-2 border-slate-100">
                           <Link to="/" onClick={() => setIsFullMenuOpen(false)} className="text-sm md:text-xl font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2">
                              Contact Us <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100" />
                           </Link>
                           <Link to="/stores" onClick={() => setIsFullMenuOpen(false)} className="text-sm md:text-xl font-bold text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-2">
                              Store Locator <ArrowUpRight size={16} />
                           </Link>
                        </div>
                     </div>
                   )}
                   
                   {menuMode !== 'all' && (
                     <button 
                        onClick={() => setMenuMode('all')}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-900 transition-colors flex items-center gap-2"
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

      {/* Editorial Floating Header (Synced with Home) */}
      <nav className="fixed top-4 md:top-6 left-0 right-0 z-[100] px-4 md:px-10 pointer-events-none">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 pointer-events-auto">
            <Link to="/" className="w-8 h-8 md:w-9 md:h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg">
              <Cpu size={18} />
            </Link>
            <span className="text-base md:text-lg font-black tracking-tighter uppercase leading-none">Meadow</span>
          </div>

          <div className="hidden md:flex items-center bg-white/70 backdrop-blur-3xl border border-white/40 rounded-full px-8 py-2.5 gap-6 md:gap-8 lg:gap-10 shadow-xl shadow-slate-200/20 pointer-events-auto transition-all hover:bg-white/90 group">
            <button onClick={() => openMenu('story')} className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-slate-900 transition-all">Story</button>
            <button onClick={() => openMenu('products')} className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-slate-900 transition-all">Products</button>
            <Link to="/customised" className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-slate-900 transition-all">Customised</Link>
            <button onClick={() => openMenu('contact')} className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-slate-900 transition-all">Contact</button>
            <div className="w-px h-4 bg-slate-200 mx-2"></div>
            <button 
              onClick={() => openMenu('all')}
              className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] text-slate-900 group-hover:text-blue-600 transition-all"
            >
              Menu <Menu size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
            <button onClick={() => openMenu('all')} className="md:hidden w-10 h-10 bg-white border border-slate-100 text-slate-900 rounded-full flex items-center justify-center shadow-lg">
              <Menu size={18} />
            </button>
            {!user ? (
               <button onClick={() => navigate('/')} className="px-4 md:px-6 py-2 md:py-2.5 bg-slate-100 text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-slate-900 hover:text-white transition-all">Sign In</button>
            ) : (
               <button onClick={() => navigate(profile?.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard')} className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-slate-200 overflow-hidden shadow-sm">
                 <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} className="w-full h-full object-cover" />
               </button>
            )}
            <button onClick={() => setIsCartOpen(true)} className="w-10 h-10 md:w-11 md:h-11 bg-slate-900 text-white rounded-full flex items-center justify-center relative shadow-xl hover:scale-105 transition-all">
              <ShoppingCart size={16} />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-blue-500 text-white text-[8px] md:text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white">{cart.length}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden pt-24 md:pt-32">
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
    </div>
  );
};

export default StoreLocator;
