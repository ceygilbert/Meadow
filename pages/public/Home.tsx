
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
    id: 'hq',
    name: 'MEADOW IT DISTRIBUTION (HQ)',
    city: 'Johor Jaya',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
    type: 'Service Center'
  },
  {
    id: 'tu',
    name: 'MEADOW COMPUTER TAMAN U',
    city: 'Skudai',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80',
    type: 'IT Store'
  },
  {
    id: 'pp',
    name: 'MEADOW COMPUTER PLAZA PELANGI',
    city: 'Johor Bahru',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80',
    type: 'Mega Store'
  },
  {
    id: 'as',
    name: 'ASUS CONCEPT STORE MEADOW',
    city: 'Johor Bahru',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80',
    type: 'Concept Store'
  },
  {
    id: 'hp',
    name: 'HP WORLD MEADOW TOPPEN',
    city: 'Johor Bahru',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80',
    type: 'IT Store'
  },
  {
    id: 'hw',
    name: 'HUAWEI EXPERIENCE STORE',
    city: 'Johor Bahru',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80',
    type: 'Experience Store'
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
                     <a href="#" onClick={() => setIsFullMenuOpen(false)} className="group flex items-center gap-6 animate-in slide-in-from-left duration-500">
                        <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-slate-900 transition-all group-hover:italic group-hover:translate-x-4">Products</span>
                        <ArrowUpRight className="text-slate-200 group-hover:text-slate-900 transition-colors" size={32} />
                     </a>
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
      <nav className="fixed top-4 md:top-6 left-0 right-0 z-[100] px-4 md:px-10 pointer-events-none">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center pointer-events-auto group">
            <img src={LOGO_URL} className="h-20 md:h-32 w-auto object-contain transition-transform group-hover:scale-105" alt="Meadow" />
          </Link>

          <div className="hidden md:flex items-center bg-white/70 backdrop-blur-3xl border border-white/40 rounded-full px-10 py-3.5 gap-6 md:gap-10 lg:gap-12 shadow-xl shadow-slate-200/20 pointer-events-auto transition-all hover:bg-white/90 group">
            <button onClick={() => openMenu('story')} className="text-xs font-black uppercase tracking-[0.25em] text-slate-400 hover:text-slate-900 transition-all">Story</button>
            <button onClick={() => openMenu('products')} className="text-xs font-black uppercase tracking-[0.25em] text-slate-400 hover:text-slate-900 transition-all">Products</button>
            <Link to="/customised" className="text-xs font-black uppercase tracking-[0.25em] text-slate-400 hover:text-slate-900 transition-all">Customised</Link>
            <button onClick={() => openMenu('contact')} className="text-xs font-black uppercase tracking-[0.25em] text-slate-400 hover:text-slate-900 transition-all">Contact</button>
            <div className="w-px h-5 bg-slate-200 mx-2"></div>
            <button 
              onClick={() => openMenu('all')}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-slate-900 group-hover:text-blue-600 transition-all"
            >
              Menu <Menu size={16} />
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
      <header className="relative pt-48 md:pt-72 px-4 md:px-10 pb-10 md:pb-20">
        <div className="hidden lg:block absolute top-64 left-10 text-[11vw] font-black text-slate-50 tracking-tighter leading-none pointer-events-none select-none -z-10 uppercase">
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
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6 md:mb-10 animate-in fade-in slide-in-from-bottom duration-700">
                <div className="px-4 py-1.5 bg-white/80 backdrop-blur-md rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 border border-slate-200/60 shadow-sm">Meadow — Core Unit</div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
                <button className="w-full sm:w-auto h-16 md:h-18 px-10 md:px-12 bg-slate-900 text-white rounded-full font-black text-xs md:text-sm uppercase tracking-widest flex items-center justify-center gap-5 hover:bg-black transition-all shadow-2xl group">
                  Explore Now
                  <div className="w-9 h-9 md:w-10 md:h-10 bg-[#C5FF41] rounded-full flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform">
                    <ArrowRight size={20} />
                  </div>
                </button>
                <button className="flex items-center gap-4 group">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Play size={18} fill="currentColor" />
                  </div>
                  <span className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-900 transition-colors">Showcase Reel</span>
                </button>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-end">
               {/* Minimal Slider Controls */}
               <div className="flex flex-col gap-4">
                  <button onClick={prevSlide} className="w-14 h-14 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white shadow-xl transition-all"><ChevronLeft size={28} /></button>
                  <button onClick={nextSlide} className="w-14 h-14 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white shadow-xl transition-all"><ChevronRight size={28} /></button>
               </div>
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
      </header>

      {/* Feature Blocks Section — Re-styled to match the Yoga layout */}
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
           .stroke-text {
             /* Handled via inline style for safety */
           }
         `}</style>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10 justify-center items-center">
            {featuredProducts.slice(0, 2).map((p) => (
              <div key={p.id} className="w-full bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 relative flex flex-col group transition-all duration-500 hover:shadow-2xl">
                 <button className="absolute top-8 right-8 w-11 h-11 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all z-10">
                    <Heart size={20} />
                 </button>
                 <div className="aspect-[4/5] bg-slate-50 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden mb-8 relative">
                    <img src={p.image_url} className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-1000" />
                 </div>
                 <div className="mb-8">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight mb-2 truncate">{p.name}</h3>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Meadow Tech</p>
                 </div>
                 <div className="flex items-center justify-between mt-auto">
                    <span className="text-base font-black text-slate-900">RM{p.price.toLocaleString()}</span>
                    <button onClick={() => addToCart(p)} className="px-6 py-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-blue-600 transition-all shadow-lg">Add to cart</button>
                 </div>
              </div>
            ))}

            <div className="hidden lg:flex flex-col items-center justify-center w-full h-full min-h-[350px] relative">
               <div className="absolute inset-0 animate-[spin_12s_linear_infinite]">
                 <svg viewBox="0 0 100 100" className="w-full h-full">
                   <path id="collCirclePath" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="none" />
                   <text className="text-[5px] font-black uppercase tracking-[0.25em] fill-slate-900/60">
                     <textPath xlinkHref="#collCirclePath">
                       View all products • View all products • View all products • 
                     </textPath>
                   </text>
                 </svg>
               </div>
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl border border-slate-100 group cursor-pointer hover:bg-slate-900 hover:text-white transition-all z-10">
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
               </div>
            </div>

            {featuredProducts.slice(2, 3).map((p) => (
              <div key={p.id} className="w-full bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 relative flex flex-col group transition-all duration-500 hover:shadow-2xl">
                 <button className="absolute top-8 right-8 w-11 h-11 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all z-10">
                    <Heart size={20} />
                 </button>
                 <div className="aspect-[4/5] bg-slate-50 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden mb-8 relative">
                    <img src={p.image_url} className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-1000" />
                 </div>
                 <div className="mb-8">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight mb-2 truncate">{p.name}</h3>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Premium Build</p>
                 </div>
                 <div className="flex items-center justify-between mt-auto">
                    <span className="text-base font-black text-slate-900">RM{p.price.toLocaleString()}</span>
                    <button onClick={() => addToCart(p)} className="px-6 py-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-blue-600 transition-all shadow-lg">Add to cart</button>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CINEMATIC SHOWCASE Section */}
      <section className="px-4 md:px-10 py-10 md:py-20 max-w-[1440px] mx-auto">
        <div className="relative aspect-video md:aspect-[21/9] rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl group border border-slate-100">
           <video 
             autoPlay 
             muted 
             loop 
             playsInline 
             className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000"
           >
             <source src="https://cdn.pixabay.com/video/2021/04/12/70878-537482813_large.mp4" type="video/mp4" />
             Your browser does not support the video tag.
           </video>
           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
           
           <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20">
             <div className="max-w-2xl animate-in fade-in slide-in-from-bottom duration-1000">
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
                 <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-blue-500">System Calibration Series</span>
               </div>
               <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-8">Internal <br /> Architecture.</h2>
               <p className="text-sm md:text-lg text-white/50 font-medium max-w-md leading-relaxed">
                 Witness the meticulous integration of our high-performance deployments. Every component is verified for electrical harmony and thermal efficiency.
               </p>
             </div>
           </div>

           {/* Central Play Aesthetic Button */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <button className="w-20 h-20 md:w-32 md:h-32 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 hover:bg-white hover:text-slate-900 opacity-0 group-hover:opacity-100 shadow-2xl">
                <Play size={40} fill="currentColor" className="ml-2 transition-transform group-active:scale-90" />
              </button>
           </div>

           {/* Technical Specs Overlay (Corner) */}
           <div className="absolute top-10 right-10 hidden md:block">
              <div className="px-6 py-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col gap-1">
                 <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Rendering Engine</span>
                 <span className="text-xs font-bold text-white uppercase">Forge Mode V2.5</span>
              </div>
           </div>
        </div>
      </section>

      {/* OUR BLOG Section */}
      <section className="bg-[#FAF9FB] px-4 md:px-10 py-20 md:py-32 overflow-hidden border-t border-slate-50">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase mb-12 md:mb-24 text-center md:text-left">Our Blog</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16 items-start">
            <div className="flex flex-col gap-10 order-2 lg:order-1">
              <div className="aspect-square bg-white rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 p-4 transition-transform hover:-translate-y-1 duration-500">
                 <img src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80" className="w-full h-full object-cover rounded-[1.5rem]" />
              </div>
              <div className="space-y-5">
                 <p className="text-slate-500 text-base font-medium leading-relaxed opacity-90">
                   Monthly updates on performance deployments and technical metrics from our engineers.
                 </p>
                 <a href="#" className="inline-block text-xs font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1.5 hover:text-blue-600 hover:border-blue-600 transition-all">Go to Blog</a>
              </div>
            </div>
            <div className="lg:col-span-2 order-1 lg:order-2">
               <div className="aspect-[4/5] bg-white rounded-[2rem] md:rounded-[3rem] rounded-br-[5rem] md:rounded-br-[12rem] overflow-hidden shadow-2xl relative border border-slate-100 group">
                  <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-10 md:bottom-20 left-10 md:left-20 text-white opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all">
                     <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-4 md:mb-6">Deep Dive</p>
                     <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">Architectural <br /> Performance.</h3>
                  </div>
               </div>
            </div>
            <div className="flex flex-col h-full justify-between gap-10 order-3">
               <div className="space-y-5">
                  <h4 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-tight uppercase">Meadow Core <br /> Technical Blog</h4>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed opacity-80">
                    Deep dives into hardware calibration and custom liquid cooling systems.
                  </p>
               </div>
               <div className="aspect-square bg-blue-50 rounded-[2rem] md:rounded-[3rem] rounded-bl-[5rem] md:rounded-bl-[8rem] overflow-hidden shadow-xl p-4 md:p-6 relative flex items-center justify-center border border-white">
                  <div className="w-full h-full bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] rounded-bl-[4.5rem] md:rounded-bl-[7rem] flex items-center justify-center overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-50" />
                     <Cpu strokeWidth={0.5} className="text-white absolute drop-shadow-2xl w-[70px] h-[70px] md:w-[100px] md:h-[100px]" />
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
                             <h4 className="font-black text-slate-900 text-base uppercase tracking-tight leading-none">{item.name}</h4>
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

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xl" onClick={() => setIsCheckoutOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-white rounded-[3rem] md:rounded-[4rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500 p-10 md:p-20">
             <div className="flex justify-between items-center mb-14">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase">Finalize Transaction</h3>
                <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-300 hover:text-slate-900 transition-colors"><X size={30} /></button>
             </div>
             <form onSubmit={handleCheckout} className="space-y-10">
                <div className="grid grid-cols-1 gap-6">
                   <div className="bg-[#F9FAFB] p-8 rounded-[2rem] border border-transparent focus-within:border-slate-100 transition-all">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Recipient Legal Name</label>
                      <input required className="w-full bg-transparent outline-none font-bold text-slate-900 text-base" placeholder="John Doe" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} />
                   </div>
                   <div className="bg-[#F9FAFB] p-8 rounded-[2rem] border border-transparent focus-within:border-slate-100 transition-all">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Communication Mail</label>
                      <input required type="email" className="w-full bg-transparent outline-none font-bold text-slate-900 text-base" placeholder="john@example.com" value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} />
                   </div>
                </div>
                <div className="p-10 bg-[#F9FAFB] rounded-[2.5rem] border border-slate-50 flex items-center justify-between">
                   <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Aggregate Total</span>
                   <span className="text-3xl font-black text-slate-900 tracking-tighter">RM{cartTotal.toLocaleString()}</span>
                </div>
                <button disabled={checkoutLoading} className="w-full py-7 bg-slate-900 text-white font-black rounded-[2.5rem] hover:bg-black transition-all shadow-2xl uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-5">
                  {checkoutLoading ? <Loader2 size={24} className="animate-spin" /> : 'Confirm Order Authorization'}
                </button>
             </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl" onClick={() => setOrderSuccess(null)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[3rem] md:rounded-[5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-700 p-14 md:p-24 text-center">
             <div className="w-28 h-28 md:w-32 md:h-32 bg-[#C5FF41] text-slate-900 rounded-full flex items-center justify-center mx-auto mb-14 shadow-2xl shadow-lime-400/20">
               <CheckCircle size={80} strokeWidth={1} />
             </div>
             <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 tracking-tighter uppercase leading-none">Transmission <br /> Successful.</h3>
             <button onClick={() => setOrderSuccess(null)} className="w-full py-7 bg-slate-900 text-white font-black rounded-3xl hover:bg-black transition-all shadow-2xl uppercase tracking-[0.3em] text-xs">Return to Node</button>
          </div>
        </div>
      )}

      {/* Editorial Footer */}
      <footer className="bg-[#F9FAFB] px-4 md:px-10 pt-24 pb-12 border-t border-slate-100">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-24 mb-24 md:mb-48">
             <div className="lg:col-span-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-10">
                  <Link to="/" className="flex items-center group">
                    <img src={LOGO_URL} className="h-18 md:h-36 w-auto object-contain transition-transform group-hover:scale-105" alt="Meadow" />
                  </Link>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9] mb-10">
                  Engineer your <br /> ultimate workspace.
                </h2>
             </div>
             <div className="text-center md:text-left">
                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 mb-8">Navigation</h4>
                <ul className="space-y-4">
                   <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">The Terminal</a></li>
                   <li><Link to="/stores" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Store Locator</Link></li>
                </ul>
             </div>
             <div className="text-center md:text-left">
                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 mb-8">Resources</h4>
                <ul className="space-y-4">
                   <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Asset Protocol</a></li>
                   <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">Technical Support</a></li>
                </ul>
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
