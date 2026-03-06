
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Cpu, 
  Loader2, 
  X,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  User as UserIcon,
  Play,
  ArrowRight,
  Monitor,
  Search,
  MousePointer2,
  Heart,
  Menu,
  AlertCircle,
  MapPin,
  ArrowUpRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Zap,
  Layers,
  Navigation,
  Video,
  Circle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Product, Profile, Brand } from '../../types';

interface CartItem extends Product {
  quantity: number;
}

type MenuMode = 'all' | 'story' | 'contact' | 'products';

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/Red%20Full%20Logo.png";
const BANNERS = [
  "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/banner_1.png",
  "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/banner_2.jpg"
];

const BRANCHES = [
  {
    id: '1',
    name: 'MEADOW IT DISTRIBUTION SDN BHD (HQ)',
    type: 'Service Center',
    address: 'No 5, 7 & 9, Jalan Keembong 22, Johor Jaya, 81100 Johor Bahru, Johor.',
    lat: 1.5410,
    lng: 103.7997,
    phone: '+60 7-355 5555',
    city: 'Johor Jaya',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80'
  },
  {
    id: '2',
    name: 'MEADOW COMPUTER SDN BHD TAMAN U',
    type: 'IT Store',
    address: 'No 8, Jalan Kebudayaan 1, Taman Universiti, 81300 Skudai, Johor.',
    lat: 1.5435,
    lng: 103.6267,
    phone: '+60 7-521 1111',
    city: 'Skudai',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80'
  },
  {
    id: '3',
    name: 'MEADOW COMPUTER SDN BHD PLAZA PELANGI',
    type: 'Mega Store',
    address: 'Lot.3.26, 26A, 27, Level 3, Plaza Pelangi, 80400 Johor Bahru, Johor.',
    lat: 1.4827,
    lng: 103.7635,
    phone: '+60 7-333 3333',
    city: 'Johor Bahru',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80'
  },
  {
    id: '4',
    name: 'ASUS CONCEPT STORE MEADOW COMPUTER',
    type: 'IT Store',
    address: 'Lot.3.16, Level 3, Plaza Pelangi, 80400 Johor Bahru, Johor.',
    lat: 1.4827,
    lng: 103.7635,
    phone: '+60 7-333 4444',
    city: 'Johor Bahru',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80'
  },
  {
    id: '5',
    name: 'HP WORLD MEADOW COMPUTER TOPPEN',
    type: 'IT Store',
    address: 'Level 2, Lot L2.22, Toppen Shopping Centre, 33A, Jln Harmonium, Taman Desa Tebrau, 81100 Johor Bahru, Johor Darul Ta’zim.',
    lat: 1.5484,
    lng: 103.7963,
    phone: '+60 7-364 8888',
    city: 'Johor Bahru',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80'
  },
  {
    id: '6',
    name: 'HUAWEI AUTHORIZED EXPERIENCE STORE',
    type: 'IT Store',
    address: 'K1.01B, Level 1, Plaza Pelangi, 80400 Johor Bahru, Johor.',
    lat: 1.4827,
    lng: 103.7635,
    phone: '+60 7-333 5555',
    city: 'Johor Bahru',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80'
  }
];

const TICKER_ITEMS = [
  "LENOVO", "APPLE", "SAMSUNG", "ASUS ROG", "HEWLETT PACKARD", "DELL ALIENWARE", 
  "RAZER", "MSI GAMING", "MICROSOFT SURFACE", "ACER PREDATOR", "GIGABYTE", "HUAWEI"
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI States
  const [isFullMenuOpen, setIsFullMenuOpen] = useState(false);
  const [menuMode, setMenuMode] = useState<MenuMode>('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [menuBranchIndex, setMenuBranchIndex] = useState(0);
  
  // Auth & Profile States
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', password: '', fullName: '' });
  const [showPassword, setShowPassword] = useState(false);

  // Cart States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  // Form States
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '' });

  const [headerSearch, setHeaderSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [activeStoreIndex, setActiveStoreIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(headerSearch.trim())}`);
      setIsFullMenuOpen(false);
    }
  };

  useEffect(() => {
    fetchData();
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

  // Auto-slide effect for hero banner (7 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Auto-slide for Menu Branch Slider (5 seconds)
  useEffect(() => {
    if (isFullMenuOpen) {
      const timer = setInterval(() => {
        setMenuBranchIndex((prev) => (prev + 1) % BRANCHES.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isFullMenuOpen]);

  useEffect(() => {
    localStorage.setItem('meadow_cart', JSON.stringify(cart));
  }, [cart]);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) {
        fetchProfile(session.user.id);
        setCustomerInfo({ 
          name: session.user.user_metadata?.full_name || '', 
          email: session.user.email || '' 
        });
      }
    } catch (err) {
      console.error("Auth check failed", err);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (data) setProfile(data);
    } catch (err) {
      console.error("Profile fetch failed", err);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (authMode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email: authForm.email,
          password: authForm.password,
          options: {
            data: { full_name: authForm.fullName }
          }
        });
        if (signUpError) throw signUpError;
        alert("Check your email for confirmation!");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: authForm.email,
          password: authForm.password,
        });
        if (signInError) throw signInError;
      }
      setIsAuthModalOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, brandRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('brands').select('*')
      ]);

      if (prodRes.error) throw prodRes.error;
      if (brandRes.error) throw brandRes.error;

      if (prodRes.data) {
        setTrendingProducts(prodRes.data);
        const featured = prodRes.data.filter(p => p.is_featured === true);
        setFeaturedProducts(featured.length > 0 ? featured : prodRes.data.slice(0, 3));
      }
      if (brandRes.data) setBrands(brandRes.data);
    } catch (err: any) {
      console.error("Data fetch error:", err);
      setError("Unable to connect to the terminal. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscountedPrice = (price: number, type: string, value: number) => {
    if (type === 'percentage') return price * (1 - value / 100);
    if (type === 'fixed') return Math.max(0, price - value);
    return price;
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
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

  const cartTotal = cart.reduce((acc, item) => {
    const price = calculateDiscountedPrice(item.price, item.discount_type, item.discount_value);
    return acc + (price * item.quantity);
  }, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setCheckoutLoading(true);
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_id: user?.id || null,
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          total_amount: cartTotal,
          status: 'pending'
        }])
        .select().single();
      if (orderError) throw orderError;

      for (const item of cart) {
        const itemPrice = calculateDiscountedPrice(item.price, item.discount_type, item.discount_value);
        await supabase.from('order_items').insert([{
          order_id: orderData.id,
          product_id: item.id,
          quantity: item.quantity,
          unit_price: itemPrice
        }]);
        await supabase.from('products').update({ stock: item.stock - item.quantity }).eq('id', item.id);
      }
      setOrderSuccess(orderData.id);
      setCart([]);
      setIsCheckoutOpen(false);
      fetchData();
    } catch (err: any) {
      alert("Checkout failed: " + err.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const openMenu = (mode: MenuMode) => {
    setMenuMode(mode);
    setIsFullMenuOpen(true);
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
        <Loader2 className="animate-spin text-slate-900" size={48} />
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Initializing Terminal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-10 text-center">
        <AlertCircle className="text-rose-500 mb-6" size={64} strokeWidth={1} />
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Connection Failed</h2>
        <p className="text-slate-500 max-w-xs mb-10 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="px-10 py-4 bg-slate-900 text-white rounded-full font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Retry Connection</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* Full-Screen Navigation Menu Overlay (Synced with Home) */}
      <div className={`fixed inset-0 z-[500] bg-white transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${isFullMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="h-full flex flex-col">
          {/* Menu Header */}
          <div className="h-32 md:h-48 px-6 md:px-12 flex items-center justify-between shrink-0">
             <Link to="/" onClick={() => setIsFullMenuOpen(false)} className="flex items-center group">
                <img src={LOGO_URL} className="h-24 md:h-36 w-auto object-contain transition-transform group-hover:scale-105" alt="Meadow" />
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
                        <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-slate-900 transition-all group-hover:italic group-hover:translate-x-4">Products</span>
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
                {/* Branch Slider in Menu */}
                <div className="aspect-[4/5] bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-100 flex flex-col group relative">
                   {BRANCHES.map((branch, idx) => (
                     <div 
                       key={branch.id} 
                       className={`absolute inset-0 flex flex-col transition-all duration-1000 ease-in-out ${idx === menuBranchIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                     >
                        <div className="flex-1 relative overflow-hidden">
                           <img src={branch.image} className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" alt={branch.name} />
                           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                           <div className="absolute top-8 left-8">
                              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-white border border-white/20">{branch.type}</span>
                           </div>
                        </div>
                        <div className="p-10 pt-4 bg-slate-900">
                           <div className="flex justify-between items-end">
                              <div className="space-y-3">
                                 <h4 className="text-2xl font-black uppercase tracking-tighter leading-none text-white whitespace-pre-line">{branch.name.replace(' (', '\n(')}</h4>
                                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">{branch.city}, MY</p>
                              </div>
                              <Link to="/stores" onClick={() => setIsFullMenuOpen(false)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 hover:bg-blue-500 hover:text-white transition-all shadow-xl">
                                 <Navigation size={20} />
                              </Link>
                           </div>
                        </div>
                     </div>
                   ))}
                   
                   {/* Slider Indicators for Branch Slider */}
                   <div className="absolute bottom-6 left-10 flex gap-2">
                      {BRANCHES.map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1 rounded-full transition-all duration-500 ${i === menuBranchIndex ? 'w-8 bg-blue-500' : 'w-2 bg-white/20'}`}
                        />
                      ))}
                   </div>
                </div>

                <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                   <span>Meadow © {new Date().getFullYear()}</span>
                   <span>JOHOR BAHRU, MY</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Editorial Floating Header */}
      <nav className={`fixed left-0 right-0 z-[100] px-4 md:px-10 pointer-events-none transition-all duration-500 ${scrolled ? 'top-0 py-4 bg-white/80 backdrop-blur-2xl border-b border-slate-100 shadow-lg' : 'top-4 md:top-6'}`}>
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center pointer-events-auto group">
            <img src={LOGO_URL} className={`w-auto object-contain transition-all duration-500 group-hover:scale-105 ${scrolled ? 'h-16 md:h-24' : 'h-28 md:h-44'}`} alt="Meadow" />
          </Link>

          <div className="hidden md:flex items-center bg-white/70 backdrop-blur-3xl border border-white/40 rounded-full px-8 py-3 gap-6 md:gap-8 lg:gap-10 shadow-xl shadow-slate-200/20 pointer-events-auto transition-all hover:bg-white/90 group">
            <form onSubmit={handleHeaderSearch} className="relative flex items-center">
              <Search size={18} className="absolute left-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                className="bg-slate-100/50 border-none rounded-full py-4 pl-14 pr-8 text-sm font-bold w-80 focus:w-[450px] transition-all outline-none focus:bg-white focus:ring-1 focus:ring-slate-200"
              />
            </form>
            <Link to="/categories" className="text-sm font-black uppercase tracking-[0.25em] text-slate-400 hover:text-slate-900 transition-all">Products</Link>
            <Link to="/categories" className="text-sm font-black uppercase tracking-[0.25em] text-slate-400 hover:text-slate-900 transition-all">Brand</Link>
            <Link 
              to="/customised" 
              className="px-8 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.3em] rounded-full hover:bg-rose-600 transition-all shadow-lg shadow-slate-900/20 hover:shadow-rose-600/30 flex items-center gap-2"
            >
              <Zap size={18} className="text-rose-400" />
              Build Your Own PC
            </Link>
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            <button 
              onClick={() => openMenu('all')}
              className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.25em] text-slate-900 group-hover:text-blue-600 transition-all"
            >
              <Menu size={18} />
            </button>
          </div>

          <div className="flex items-center gap-3 md:gap-6 pointer-events-auto">
            <button onClick={() => openMenu('all')} className="md:hidden w-12 h-12 bg-white border border-slate-100 text-slate-900 rounded-full flex items-center justify-center shadow-lg">
              <Menu size={20} />
            </button>
            {!user ? (
               <button onClick={() => setIsAuthModalOpen(true)} className="px-6 md:px-8 py-2.5 md:py-3.5 bg-slate-100 text-slate-500 text-[11px] md:text-xs font-black uppercase tracking-[0.2em] rounded-full hover:bg-slate-900 hover:text-white transition-all">Sign In</button>
            ) : (
               <button onClick={() => navigate(profile?.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard')} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-200 overflow-hidden shadow-sm">
                 <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} className="w-full h-full object-cover" />
               </button>
            )}
            <button onClick={() => setIsCartOpen(true)} className="w-14 h-14 md:w-16 md:h-16 bg-slate-900 text-white rounded-full flex items-center justify-center relative shadow-xl hover:scale-105 transition-all">
              <ShoppingCart size={22} />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 w-6 h-6 md:w-7 md:h-7 bg-blue-500 text-white text-[10px] md:text-xs font-black flex items-center justify-center rounded-full border-2 border-white">{cart.length}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 md:pt-48 px-4 md:px-10 pb-10 md:pb-20">
        <div className="hidden lg:block absolute top-48 left-10 text-[11vw] font-black text-slate-50 tracking-tighter leading-none pointer-events-none select-none -z-10 uppercase">
          Precision Engineering
        </div>

        <div className="max-w-[1440px] mx-auto bg-[#F7F8FA] rounded-[2rem] md:rounded-[3.5rem] relative min-h-[500px] md:min-h-[750px] flex items-center overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/40">
          
          {/* Animated Background Slider */}
          <div className="absolute inset-0 z-0">
             {BANNERS.map((url, index) => (
               <div 
                 key={url}
                 className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
                 style={{ 
                   transition: 'opacity 1s ease-in-out, transform 8s linear' 
                 }}
               >
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent z-10"></div>
                  <img src={url} className="w-full h-full object-cover" alt={`Meadow Banner ${index + 1}`} />
               </div>
             ))}
          </div>
          
          <div className="grid lg:grid-cols-2 w-full p-6 md:p-20 relative z-10">
            <div className="flex flex-col justify-center text-center lg:text-left">
              {/* Content removed per user request */}
            </div>
          </div>

          {/* Slider Indicators */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
             {BANNERS.map((_, i) => (
               <button 
                key={i} 
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-12 bg-slate-900' : 'w-2 bg-slate-300'}`}
               />
             ))}
          </div>
        </div>

        {/* Slider Controls - Repositioned to screen edges */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 px-4 md:px-10 flex justify-between pointer-events-none">
          <button 
            onClick={prevSlide} 
            className="w-12 h-12 md:w-16 md:h-16 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white shadow-xl transition-all pointer-events-auto"
          >
            <ChevronLeft size={28} />
          </button>
          <button 
            onClick={nextSlide} 
            className="w-12 h-12 md:w-16 md:h-16 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white shadow-xl transition-all pointer-events-auto"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </header>

      {/* Feature Blocks Section */}
      <section className="px-4 md:px-10 py-10 md:py-20 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Block 1: Build Your Own (Links to Customised.tsx) */}
          <div className="aspect-[3/4] md:aspect-[4/5] rounded-[3rem] overflow-hidden relative group shadow-2xl">
             <img 
               src="https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80" 
               className="absolute inset-0 w-full h-full object-cover transition-transform duration-[8s] group-hover:scale-110" 
               alt="Custom PC Interior" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
             
             {/* Top Corner UI */}
             <div className="absolute top-8 left-8">
               <div className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                 <Video size={14} className="fill-white" /> View Showcase
               </div>
             </div>
             <div className="absolute top-8 right-8">
               <Link to="/customised" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl hover:scale-110 transition-all">
                  <ArrowUpRight size={24} />
               </Link>
             </div>

             {/* Bottom UI */}
             <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-8">
                <h3 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tighter uppercase">Bespoke <br /> Performance</h3>
                <div className="flex justify-end">
                   <Link 
                     to="/customised" 
                     className="px-10 py-4 bg-white text-slate-900 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl"
                   >
                     Build Your Own
                   </Link>
                </div>
             </div>
          </div>

          {/* Block 2: Workstation Station */}
          <div className="aspect-[3/4] md:aspect-[4/5] rounded-[3rem] overflow-hidden relative group shadow-2xl">
             <img 
               src="https://images.unsplash.com/photo-1626218174358-7769486c4b79?auto=format&fit=crop&q=80" 
               className="absolute inset-0 w-full h-full object-cover transition-transform duration-[8s] group-hover:scale-110" 
               alt="PC Workstation" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
             
             <div className="absolute top-8 left-8">
               <div className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                 <Video size={14} className="fill-white" /> View Build
               </div>
             </div>
             <div className="absolute top-8 right-8">
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl hover:scale-110 transition-all">
                  <ArrowUpRight size={24} />
               </div>
             </div>

             <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-8">
                <h3 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tighter uppercase">Elite <br /> Workflow</h3>
                <div className="flex justify-end">
                   <button className="px-10 py-4 bg-white text-slate-900 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-2xl">
                     Get Started
                   </button>
                </div>
             </div>
          </div>

          {/* Block 3: Gaming Rigs */}
          <div className="aspect-[3/4] md:aspect-[4/5] rounded-[3rem] overflow-hidden relative group shadow-2xl">
             <img 
               src="https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80" 
               className="absolute inset-0 w-full h-full object-cover transition-transform duration-[8s] group-hover:scale-110" 
               alt="Gaming Rig" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
             
             <div className="absolute top-8 left-8">
               <div className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                 <Plus size={14} className="text-white" /> Upgrade Now
               </div>
             </div>
             <div className="absolute top-8 right-8">
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl hover:scale-110 transition-all">
                  <ArrowUpRight size={24} />
               </div>
             </div>

             <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-8">
                <h3 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tighter uppercase">Supreme <br /> Stability</h3>
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 border border-white/20">
                   <input type="email" placeholder="Your email" className="bg-transparent text-white text-xs outline-none placeholder:text-white/40 flex-1" />
                   <button className="bg-white text-slate-900 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">Go</button>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Specialized Infinite Ticker Section */}
      <section className="py-20 md:py-32 bg-white overflow-hidden relative">
         <div className="absolute top-0 inset-x-0 h-px bg-slate-100"></div>
         <div className="absolute bottom-0 inset-x-0 h-px bg-slate-100"></div>
         
         <div className="relative flex whitespace-nowrap overflow-hidden">
            <div className="flex items-center gap-12 animate-ticker-infinite">
               {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
                 <div key={idx} className="flex items-center gap-12">
                   <span className={`text-6xl md:text-[8rem] font-black uppercase tracking-tighter leading-none ${idx % 2 === 0 ? 'text-slate-900' : 'text-transparent stroke-text'}`} style={{ WebkitTextStroke: '2px #0f172a' }}>
                     {item}
                   </span>
                   <Circle className="text-blue-600 shrink-0" size={24} fill="currentColor" />
                 </div>
               ))}
            </div>
         </div>

         <style>{`
           @keyframes ticker-infinite {
             0% { transform: translateX(0); }
             100% { transform: translateX(-50%); }
           }
           .animate-ticker-infinite {
             animation: ticker-infinite 40s linear infinite;
           }
         `}</style>
      </section>

      {/* CATEGORIES Section */}
      <section className="px-4 md:px-10 py-20 md:py-32 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="flex flex-col">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-4">Categories</h2>
            <p className="text-xs text-slate-400 font-black uppercase tracking-[0.4em]">Browse by Hardware Class</p>
          </div>
          <Link to="/products" className="group flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-900 hover:text-blue-600 transition-colors">
            View All Products
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
              <ArrowUpRight size={16} />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[
            { name: 'PC Component', img: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80', slug: 'pc-component' },
            { name: 'Laptop', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80', slug: 'laptop' },
            { name: 'Peripheral', img: 'https://images.unsplash.com/photo-1612198188271-0670e495b0ae?auto=format&fit=crop&q=80', slug: 'peripheral' },
            { name: 'Monitor', img: 'https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&q=80', slug: 'monitor' }
          ].map((cat) => (
            <Link 
              key={cat.name}
              to={`/products?category=${cat.slug}`}
              className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 flex flex-col justify-end p-8"
            >
              <img 
                src={cat.img} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                alt={cat.name} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-2 group-hover:translate-x-2 transition-transform duration-500">{cat.name}</h3>
                <div className="flex items-center gap-2 text-[10px] font-black text-white/60 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  Explore <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* THE COLLECTION Section */}
      <section className="bg-[#FAF9FB] px-4 md:px-10 py-20 md:py-32 overflow-hidden border-t border-slate-50">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center justify-between mb-16 md:mb-20">
             <div className="flex flex-col">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-3">The Collection</h2>
                <p className="text-xs text-slate-300 font-black uppercase tracking-[0.3em]">Featured — {featuredProducts.length} Items Indexed</p>
             </div>
             <div className="hidden md:flex gap-4">
                <button className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"><Search size={22} /></button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
            {featuredProducts.map((p) => (
              <div key={p.id} className="w-full bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 relative flex flex-col group transition-all duration-500 hover:shadow-2xl">
                 <button className="absolute top-8 right-8 w-11 h-11 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all z-10">
                    <Heart size={20} />
                 </button>
                 <Link to={`/product/${p.slug}`} className="flex-1 flex flex-col">
                    <div className="aspect-[4/5] bg-slate-50 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden mb-8 relative flex items-center justify-center">
                        <img src={p.image_url} className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-1000" />
                    </div>
                    <div className="mb-8">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight mb-2 truncate">{p.name}</h3>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Meadow Tech</p>
                    </div>
                 </Link>
                 <div className="flex items-center justify-between mt-auto">
                    <span className="text-base font-black text-slate-900">RM{p.price.toLocaleString()}</span>
                    <button onClick={() => addToCart(p)} className="px-6 py-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-blue-600 transition-all shadow-lg">Add to cart</button>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUILD YOUR OWN PC Section */}
      <section className="px-4 md:px-10 py-10 md:py-20 max-w-[1440px] mx-auto">
        <div className="relative aspect-video md:aspect-[21/9] rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl group border border-slate-100">
           <img 
             src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80" 
             className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
             alt="Build Your Own PC"
             referrerPolicy="no-referrer"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
           
           <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-20">
             <div className="max-w-2xl animate-in fade-in slide-in-from-bottom duration-1000">
               <div className="flex items-center gap-3 mb-6">
                 <Zap size={20} className="text-[#C5FF41]" fill="currentColor" />
                 <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-[#C5FF41]">Bespoke Performance</span>
               </div>
               <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-8">Build Your <br /> Own PC.</h2>
               <p className="text-sm md:text-lg text-white/70 font-medium max-w-md leading-relaxed mb-10">
                 Unleash your creativity and power. Customise every component to match your specific needs, from gaming beasts to professional workstations.
               </p>
               <Link 
                 to="/customised" 
                 className="inline-flex items-center gap-4 px-10 py-4 bg-[#C5FF41] text-slate-900 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white transition-all shadow-xl group/btn w-fit"
               >
                 Start Building
                 <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
               </Link>
             </div>
           </div>
        </div>
      </section>

      {/* VISIT OUR STORE Section */}
      <section className="bg-white px-4 md:px-10 py-20 md:py-32 overflow-hidden border-t border-slate-50">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-[#1e40af] tracking-tighter uppercase mb-12">Visit Our Store.</h2>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Card */}
            <div className="lg:w-1/3 bg-[#f3f4f6] rounded-2xl p-8 flex flex-col justify-between min-h-[400px] shadow-sm">
              <div className="space-y-10">
                <h3 className="text-2xl md:text-3xl font-black leading-tight">
                  <span className="text-[#ef4444]">VIEW ALL</span> <br />
                  <span className="text-[#1e40af]">{BRANCHES[activeStoreIndex].name}</span> <br />
                  <span className="text-[#ef4444]">LOCATION.</span>
                </h3>
                <Link 
                  to="/stores" 
                  className="inline-block px-8 py-3 bg-white border-2 border-black rounded-xl text-sm font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
                >
                  Store Locator
                </Link>
              </div>
              
              <div className="pt-8 border-t border-black/10">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-2 flex items-center gap-1">
                      Video Displaying <ArrowRight size={10} />
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-tight text-slate-900">
                      {BRANCHES[activeStoreIndex].name}, {BRANCHES[activeStoreIndex].city}
                    </span>
                  </div>
                  <button 
                    onClick={() => setActiveStoreIndex((prev) => (prev + 1) % BRANCHES.length)}
                    className="w-12 h-12 rounded-full bg-white border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-md group"
                    title="Next Store"
                  >
                    <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Card (Map) */}
            <div className="lg:flex-1 aspect-video md:aspect-auto md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-slate-100 relative">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{ border: 0 }}
                src={`https://www.google.com/maps?q=${encodeURIComponent(BRANCHES[activeStoreIndex].address)}&output=embed`}
                allowFullScreen
                title="Store Location"
                className="grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
              ></iframe>
              <div className="absolute top-6 right-6 flex flex-col gap-3">
                <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/20 flex flex-col items-center gap-1">
                   <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                   <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Live Map</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-xl" onClick={() => setIsAuthModalOpen(false)}></div>
           <div className="relative w-full max-w-md bg-white rounded-[3rem] md:rounded-[4rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
              <div className="p-10 md:p-16 text-center">
                 <div className="w-16 h-16 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-slate-100">
                    <UserIcon size={28} />
                 </div>
                 <h3 className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase mb-3">
                    {authMode === 'login' ? 'System Access' : 'Create Profile'}
                 </h3>
                 <form onSubmit={handleAuth} className="space-y-5 mt-10">
                    {authMode === 'signup' && (
                       <input required className="w-full px-8 py-5 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm" placeholder="Legal Name" value={authForm.fullName} onChange={e => setAuthForm({...authForm, fullName: e.target.value})} />
                    )}
                    <input required type="email" className="w-full px-8 py-5 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm" placeholder="Email" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} />
                    <input required type={showPassword ? "text" : "password"} className="w-full px-8 py-5 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm" placeholder="Passkey" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} />
                    <button disabled={authLoading} className="w-full py-6 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all uppercase tracking-[0.2em] text-xs mt-6">{authLoading ? '...' : 'Authenticate'}</button>
                 </form>
                 <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="mt-10 text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest">
                    {authMode === 'login' ? "Register Node" : "Existing Node Login"}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Cart Slider */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[150] flex justify-end">
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
                             <button onClick={() => removeFromCart(item.id)} className="text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                           </div>
                           <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center bg-slate-50 rounded-2xl px-3 py-1.5 gap-5">
                                <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-400 hover:text-slate-900 transition-colors"><Minus size={16} /></button>
                                <span className="font-black text-sm min-w-[24px] text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-400 hover:text-slate-900 transition-colors"><Plus size={16} /></button>
                              </div>
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
                 <div className="flex items-center justify-between mb-12">
                    <span className="text-xs font-black text-slate-300 uppercase tracking-[0.4em]">Subtotal</span>
                    <span className="text-4xl font-black text-slate-900 tracking-tighter">RM{cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                 </div>
                 <button onClick={() => setIsCheckoutOpen(true)} className="w-full py-7 bg-slate-900 text-white font-black rounded-3xl hover:bg-black transition-all shadow-2xl uppercase tracking-[0.3em] text-xs">Initialize Purchase</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Editorial Footer */}
      <footer className="bg-[#F9FAFB] px-4 md:px-10 pt-24 pb-12 border-t border-slate-100">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <img src={LOGO_URL} className="h-16 w-auto mb-8 grayscale opacity-50" alt="Meadow" />
              <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs">
                Premium hardware distribution and bespoke computational engineering. Built for the elite.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8">Company</h4>
              <ul className="space-y-4">
                <li><button onClick={() => openMenu('story')} className="text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Our Story</button></li>
                <li><button onClick={() => openMenu('contact')} className="text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Contact Us</button></li>
                <li><Link to="/stores" className="text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Store Locator</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Terms & Conditions</a></li>
                <li><a href="#" className="text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Privacy Policy</a></li>
                <li><a href="#" className="text-[11px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Refund Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8">Newsletter</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Join the Registry for updates.</p>
              <form className="flex gap-2">
                <input type="email" placeholder="Email" className="flex-1 bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:border-slate-900 transition-colors" />
                <button className="bg-slate-900 text-white p-3 rounded-xl hover:bg-black transition-colors"><ArrowRight size={16} /></button>
              </form>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-slate-200/50">
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 text-center">© {new Date().getFullYear()} Meadow SDN BHD — ALL RIGHTS RESERVED</p>
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 italic">Core Operational Status: Nominal</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
