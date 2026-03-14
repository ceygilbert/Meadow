
import React, { useEffect, useState, useRef } from 'react';
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
  Circle,
  Facebook,
  Instagram
} from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
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
  const [promoProducts, setPromoProducts] = useState<Product[]>([]);
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
  const collectionRef = useRef<HTMLDivElement>(null);
  const promoRef = useRef<HTMLDivElement>(null);

  const scrollCollection = (direction: 'left' | 'right') => {
    if (collectionRef.current) {
      const scrollAmount = 400;
      collectionRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollPromo = (direction: 'left' | 'right') => {
    if (promoRef.current) {
      const scrollAmount = 400;
      promoRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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
        setFeaturedProducts(featured.length > 0 ? featured : prodRes.data.slice(0, 12));
        const promo = prodRes.data.filter(p => p.is_Promo === true);
        setPromoProducts(promo);
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

      <PublicNavbar 
        user={user}
        profile={profile}
        cartCount={cart.length}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        scrolled={scrolled}
      />

      {/* Hero Section */}
      <header className="relative pt-16 md:pt-20 pb-0">
        <div className="hidden lg:block absolute top-20 left-10 text-[11vw] font-black text-slate-50 tracking-tighter leading-none pointer-events-none select-none -z-10 uppercase">
          Precision Engineering
        </div>

        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
          <div className="bg-[#F7F8FA] rounded-[2rem] md:rounded-[3.5rem] relative min-h-[400px] md:min-h-[550px] flex items-center overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/40">
          
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
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
             {BANNERS.map((_, i) => (
               <button 
                key={i} 
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-12 bg-slate-900' : 'w-2 bg-slate-300'}`}
               />
             ))}
          </div>
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

      {/* CATEGORIES Section */}
      <section className="px-4 md:px-10 pt-16 md:pt-24 pb-20 md:pb-32 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-6">
          <div className="flex flex-col">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-3">Categories</h2>
            <p className="text-xs text-slate-400 font-black uppercase tracking-[0.4em]">Browse by Hardware Class</p>
          </div>
          <Link to="/products" className="group flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-900 hover:text-blue-600 transition-colors">
            View All Products
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
              <ArrowUpRight size={16} />
            </div>
          </Link>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 md:gap-8 pb-10 scrollbar-hide">
          {[
            { name: 'PC Component', img: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80', slug: 'pc-component' },
            { name: 'Laptop', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80', slug: 'laptop' },
            { name: 'Peripheral', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80', slug: 'peripheral' },
            { name: 'Monitor', img: 'https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&q=80', slug: 'monitor' },
            { name: 'Desktop', img: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80', slug: 'desktop' },
            { name: 'Home & Office', img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80', slug: 'home-office' },
            { name: 'Networking', img: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80', slug: 'networking' },
            { name: 'Smart Home', img: 'https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/smart_house.jpg?auto=format&fit=crop&q=80', slug: 'smart-home' }
          ].map((cat) => (
            <Link 
              key={cat.name}
              to={`/products?category=${cat.slug}`}
              className="group relative flex-shrink-0 w-[85vw] md:w-[350px] aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 flex flex-col justify-end p-8 snap-start"
            >
              <img 
                src={cat.img} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                alt={cat.name} 
                referrerPolicy="no-referrer"
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

      {/* BUILD YOUR OWN PC Section */}
      <section className="px-4 md:px-10 py-0 max-w-[1440px] mx-auto">
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
                 <Zap size={20} className="text-[#ef4444]" fill="currentColor" />
                 <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-[#e11d48]">Bespoke Performance</span>
               </div>
               <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-8">Build Your <br /> Own PC.</h2>
               <p className="text-sm md:text-lg text-white/70 font-medium max-w-md leading-relaxed mb-10">
                 Unleash your creativity and power. Customise every component to match your specific needs, from gaming beasts to professional workstations.
               </p>
               <Link 
                 to="/customised" 
                 className="inline-flex items-center gap-4 px-10 py-4 bg-[#e11d48] text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl group/btn w-fit"
               >
                 Start Building
                 <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
               </Link>
             </div>
           </div>
        </div>
      </section>

      {/* THE COLLECTION Section */}
      <section className="bg-[#FAF9FB] pt-16 md:pt-24 pb-20 md:pb-32 overflow-hidden border-t border-slate-50">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
          <div className="flex items-center justify-between mb-8">
             <div className="flex flex-col">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-3">The Collection</h2>
                <p className="text-sm text-slate-500 font-medium">Essentials that pair perfectly with your favourite devices.</p>
             </div>
             <div className="hidden md:flex gap-4">
                <button 
                  onClick={() => scrollCollection('left')}
                  className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                >
                  <ChevronLeft size={22} />
                </button>
                <button 
                  onClick={() => scrollCollection('right')}
                  className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                >
                  <ChevronRight size={22} />
                </button>
             </div>
          </div>

          <div 
            ref={collectionRef}
            className="flex gap-6 md:gap-10 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-10 -mb-10"
          >
            {/* Product Cards */}
            {featuredProducts.map((p) => (
              <Link key={p.id} to={`/product/${p.slug}`} className="!w-[18.4117647059rem] h-[400px] bg-white rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 relative flex flex-col group transition-all duration-500 hover:shadow-2xl snap-start border border-slate-100 flex-shrink-0">
                 <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all z-10"
                 >
                    <Heart size={14} />
                 </button>
                 <div className="flex-1 rounded-[1.5rem] overflow-hidden mb-3 relative flex items-center justify-center">
                     <img src={p.image_url || undefined} className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                 </div>
                 <div className="mb-1">
                     <h3 className="text-xs font-black text-slate-900 tracking-tight leading-tight mb-0.5 truncate">{p.name}</h3>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Meadow Tech</p>
                 </div>
                 <div>
                     <span className="text-xs font-black text-slate-900">RM{p.price.toLocaleString()}</span>
                 </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="w-full h-24 bg-slate-900 flex items-center justify-center px-4 md:px-10">
        <p className="text-white font-black uppercase tracking-widest text-sm">
          Free Shipping on all orders over RM500
        </p>
      </section>

      {/* Promo Products Section */}
      <section className="py-10 md:py-16 bg-slate-50">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Promotions</h2>
            <div className="hidden md:flex gap-4">
                <button 
                  onClick={() => scrollPromo('left')}
                  className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                >
                  <ChevronLeft size={22} />
                </button>
                <button 
                  onClick={() => scrollPromo('right')}
                  className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                >
                  <ChevronRight size={22} />
                </button>
             </div>
          </div>
          <div 
            ref={promoRef}
            className="flex gap-6 md:gap-10 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-10 -mb-10"
          >
            {/* Product Cards */}

            {promoProducts.map((p) => (
              <Link key={p.id} to={`/product/${p.slug}`} className="!w-[18.4117647059rem] h-[400px] bg-white rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 relative flex flex-col group transition-all duration-500 hover:shadow-2xl snap-start border border-slate-100 flex-shrink-0">
                 <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all z-10"
                 >
                    <Heart size={14} />
                 </button>
                 <div className="flex-1 rounded-[1.5rem] overflow-hidden mb-3 relative flex items-center justify-center">
                     <img src={p.image_url || undefined} className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                 </div>
                 <div className="mb-1">
                     <h3 className="text-xs font-black text-slate-900 tracking-tight leading-tight mb-0.5 truncate">{p.name}</h3>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Meadow Tech</p>
                 </div>
                 <div>
                     <span className="text-xs font-black text-slate-900">RM{p.price.toLocaleString()}</span>
                 </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Specialized Infinite Ticker Section */}
      <section className="py-10 md:py-16 bg-white overflow-hidden relative">
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

      {/* VISIT OUR STORE Section */}
      <section className="bg-white py-20 md:py-32 overflow-hidden border-t border-slate-50">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
          <h2 className="text-3xl md:text-5xl font-black text-[#e11d48] tracking-tighter uppercase mb-12">Visit Our Store.</h2>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Card */}
            <div className="lg:w-1/3 bg-[#f3f4f6] rounded-2xl p-8 flex flex-col justify-between min-h-[400px] shadow-sm">
              <div className="flex-1 flex flex-col justify-start">
                <h3 className="text-2xl md:text-3xl font-black leading-tight text-black uppercase text-left">
                  View All Meadow Computer Store Location.
                </h3>
              </div>
              <Link 
                to="/stores" 
                className="block w-full px-8 py-4 bg-white border-2 border-black rounded-xl text-sm font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm text-center"
              >
                Store Locator
              </Link>
            </div>

            {/* Right Card (Video) */}
            <div className="lg:flex-1 aspect-video md:aspect-auto md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-slate-100 relative">
              <video 
                src="https://illuminatelabs.space/assets/locator_vd.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
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
                           <img src={item.image_url || undefined} className="w-full h-full object-contain" />
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
      <footer className="bg-[#F9FAFB] pt-24 pb-12 border-t border-slate-100">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
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
                <li><button onClick={() => openMenu('story')} className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Our Story</button></li>
                <li><button onClick={() => openMenu('contact')} className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Contact Us</button></li>
                <li><Link to="/stores" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Store Locator</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Terms & Conditions</a></li>
                <li><a href="#" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Privacy Policy</a></li>
                <li><a href="#" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Refund Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8">Newsletter</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Join the Registry for updates.</p>
              <form className="flex gap-2 mb-8">
                <input type="email" placeholder="Email" className="flex-1 bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:border-slate-900 transition-colors" />
                <button className="bg-slate-900 text-white p-3 rounded-xl hover:bg-black transition-colors"><ArrowRight size={16} /></button>
              </form>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47V18.77a6.738 6.738 0 0 1-6.76 6.76 6.738 6.738 0 0 1-6.76-6.76 6.738 6.738 0 0 1 6.76-6.76c.42-.02.84.03 1.25.12v4.03a2.71 2.71 0 0 0-1.25-.12 2.728 2.728 0 0 0-2.72 2.73 2.728 2.728 0 0 0 2.72 2.73 2.728 2.728 0 0 0 2.73-2.73V.02z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                  <img src="https://illuminatelabs.space/assets/xhs_logo.png" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" alt="Xiaohongshu" />
                </a>
              </div>
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

// Add scrollbar-hide utility
const style = document.createElement('style');
style.textContent = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);

