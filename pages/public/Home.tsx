
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
  Instagram,
  Wrench,
  ShieldCheck,
  Truck
} from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
import Footer from '../../components/Footer';
import { supabase } from '../../lib/supabase';
import { Product, Profile, Brand, HomePageSettings } from '../../types';
import { fetchHomePageSettings } from '../../services/homepageService';

interface CartItem extends Product {
  quantity: number;
}

type MenuMode = 'all' | 'story' | 'contact' | 'products';

import { useAuth } from '../../lib/AuthContext';

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

const CACHE_KEY_HOME_PRODUCTS = 'meadow_home_cached_products';
const CACHE_KEY_HOME_BRANDS = 'meadow_home_cached_brands';

const getStoredHomeProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(CACHE_KEY_HOME_PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return [];
};

const getStoredHomeBrands = (): Brand[] => {
  try {
    const raw = localStorage.getItem(CACHE_KEY_HOME_BRANDS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return [];
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const initialProducts = useRef(getStoredHomeProducts()).current;
  const initialBrands = useRef(getStoredHomeBrands()).current;
  const isFetchingRef = useRef(false);

  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [promoProducts, setPromoProducts] = useState<Product[]>([]);
  const [newArrivalProducts, setNewArrivalProducts] = useState<Product[]>([]);
  const [laptopProducts, setLaptopProducts] = useState<Product[]>([]);
  const [pcComponentProducts, setPcComponentProducts] = useState<Product[]>([]);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [homeSettings, setHomeSettings] = useState<HomePageSettings | null>(null);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const [error, setError] = useState<string | null>(null);
  
  // UI States
  const [isFullMenuOpen, setIsFullMenuOpen] = useState(false);
  const [menuMode, setMenuMode] = useState<MenuMode>('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [menuBranchIndex, setMenuBranchIndex] = useState(0);

  const activeBanners = (homeSettings?.banners || []).filter(b => b.is_active);
  const bannersToDisplay = activeBanners.length > 0 
    ? activeBanners 
    : BANNERS.map((url, idx) => ({ id: `b-${idx}`, image_url: url, title: '', subtitle: '', link: '/products', button_text: 'Shop Now', is_active: true }));

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannersToDisplay.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannersToDisplay.length) % bannersToDisplay.length);
  };
  
  // Auth & Profile States
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
  const newArrivalRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const pcComponentRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);

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

  const scrollNewArrival = (direction: 'left' | 'right') => {
    if (newArrivalRef.current) {
      const scrollAmount = 400;
      newArrivalRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollLaptop = (direction: 'left' | 'right') => {
    if (laptopRef.current) {
      const scrollAmount = 400;
      laptopRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollPcComponent = (direction: 'left' | 'right') => {
    if (pcComponentRef.current) {
      const scrollAmount = 400;
      pcComponentRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollDisplay = (direction: 'left' | 'right') => {
    if (displayRef.current) {
      const scrollAmount = 400;
      displayRef.current.scrollBy({
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

  const distributeProducts = (allProducts: (Product & { categories?: any })[]) => {
    setTrendingProducts(allProducts);
    const featured = allProducts.filter(p => p.is_featured === true);
    setFeaturedProducts(featured.length > 0 ? featured : allProducts.slice(0, 12));
    const promo = allProducts.filter(p => p.is_Promo === true);
    setPromoProducts(promo);
    setNewArrivalProducts(allProducts.slice(0, 12));

    const laptops = allProducts.filter(p => 
      p.categories?.name?.toLowerCase().includes('laptop') || 
      p.categories?.slug === 'laptop'
    );
    setLaptopProducts(laptops);

    const pcComponents = allProducts.filter(p => 
      p.categories?.name?.toLowerCase().includes('pc component') || 
      p.categories?.slug === 'pc-component'
    );
    setPcComponentProducts(pcComponents);

    const displays = allProducts.filter(p => 
      p.categories?.name?.toLowerCase().includes('display') || 
      p.categories?.name?.toLowerCase().includes('monitor') || 
      p.categories?.slug === 'display' ||
      p.categories?.slug === 'displays' ||
      p.categories?.slug === 'monitors' ||
      p.categories?.slug === 'monitor'
    );
    setDisplayProducts(displays);
  };

  useEffect(() => {
    // If cached products exist, immediately populate the UI
    if (initialProducts.length > 0) {
      distributeProducts(initialProducts);
      setLoading(false);
    }

    fetchData();

    const savedCart = localStorage.getItem('meadow_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.warn("Failed to parse cart:", e);
      }
    }
  }, []);

  // Keep customer info in sync with auth user without re-fetching public catalog
  useEffect(() => {
    if (user) {
      setCustomerInfo({ 
        name: user.user_metadata?.full_name || '', 
        email: user.email || '' 
      });
    }
  }, [user]);

  // Auto-slide effect for hero banner (7 seconds)
  useEffect(() => {
    const slideCount = bannersToDisplay.length || 1;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 7000);
    return () => clearInterval(timer);
  }, [bannersToDisplay.length]);

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
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    // Only set full-page loading if we don't already have products in state
    const hasInitialProducts = trendingProducts.length > 0 || initialProducts.length > 0;
    if (!hasInitialProducts) {
      setLoading(true);
    }
    setError(null);

    try {
      const results = await Promise.allSettled([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('brands').select('*'),
        supabase.from('categories').select('*'),
        fetchHomePageSettings()
      ]);

      const prodOutcome = results[0];
      const brandOutcome = results[1];
      const catOutcome = results[2];
      const homeSettingsOutcome = results[3];

      if (homeSettingsOutcome.status === 'fulfilled' && homeSettingsOutcome.value) {
        setHomeSettings(homeSettingsOutcome.value);
      }

      if (brandOutcome.status === 'fulfilled' && brandOutcome.value.data) {
        setBrands(brandOutcome.value.data);
        try {
          localStorage.setItem(CACHE_KEY_HOME_BRANDS, JSON.stringify(brandOutcome.value.data));
        } catch (e) {}
      }

      if (prodOutcome.status === 'fulfilled' && prodOutcome.value.data) {
        const prodData = prodOutcome.value.data;
        const categoriesList = (catOutcome.status === 'fulfilled' && catOutcome.value.data) ? catOutcome.value.data : [];
        const categoriesMap = new Map(categoriesList.map((c: any) => [c.id, c]));

        const allProducts = (prodData || []).map((p: any) => ({
          ...p,
          categories: p.category_id ? categoriesMap.get(p.category_id) : undefined
        })) as (Product & { categories?: any })[];

        distributeProducts(allProducts);

        try {
          localStorage.setItem(CACHE_KEY_HOME_PRODUCTS, JSON.stringify(allProducts));
        } catch (e) {}

        setError(null);
      } else {
        const prodErr = prodOutcome.status === 'rejected' ? prodOutcome.reason : prodOutcome.value?.error;
        console.warn("Product fetch issue:", prodErr);

        const hasExisting = trendingProducts.length > 0 || initialProducts.length > 0;
        if (!hasExisting) {
          const msg = prodErr?.message || "Service temporarily unreachable";
          setError(`Unable to connect to database (${msg}). Please check your connection.`);
        }
      }
    } catch (err: any) {
      console.warn("Data fetch error detail:", err);
      const hasExisting = trendingProducts.length > 0 || initialProducts.length > 0;
      if (!hasExisting) {
        const msg = err?.message || "Service temporarily unreachable";
        setError(`Unable to connect (${msg}). Please check your connection.`);
      }
    } finally {
      isFetchingRef.current = false;
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
        <Loader2 className="animate-spin text-slate-900" size={48} />
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-10 text-center">
        <AlertCircle className="text-rose-500 mb-6" size={64} strokeWidth={1} />
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Connection Issue</h2>
        <p className="text-slate-500 max-w-sm mb-8 font-medium text-sm leading-relaxed">{error}</p>
        <button 
          onClick={() => {
            setError(null);
            fetchData();
          }} 
          className="px-10 py-4 bg-slate-900 text-white rounded-full font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer"
        >
          Try Again
        </button>
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
                           <Link to="/contact" onClick={() => setIsFullMenuOpen(false)} className="text-sm md:text-xl font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2">
                              Inquiry Form <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100" />
                           </Link>
                           <Link to="/our-stores" onClick={() => setIsFullMenuOpen(false)} className="text-sm md:text-xl font-bold text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-2">
                              Our Store <ArrowUpRight size={16} />
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
      <header className="relative pt-24 md:pt-32 pb-0">
        <div className="hidden lg:block absolute top-20 left-10 text-[11vw] font-black text-slate-50 tracking-tighter leading-none pointer-events-none select-none -z-10 uppercase">
          {homeSettings?.hero_bg_text || "Precision Engineering"}
        </div>

        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
          <div className="bg-[#F7F8FA] rounded-[2rem] md:rounded-[3.5rem] relative min-h-[400px] md:min-h-[550px] flex items-center overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/40">
          
          {/* Animated Background Slider */}
          <div className="absolute inset-0 z-0">
             {bannersToDisplay.map((banner, index) => (
               <Link 
                 key={banner.id || index}
                 to={banner.link || '/products'}
                 className={`absolute inset-0 block cursor-pointer transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 scale-105 pointer-events-auto' : 'opacity-0 scale-100 pointer-events-none'}`}
                 style={{ 
                   transition: 'opacity 1s ease-in-out, transform 8s linear' 
                 }}
               >
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent z-10"></div>
                  <img src={banner.image_url} className="w-full h-full object-cover" alt={banner.title || `Meadow Banner ${index + 1}`} />

                  {/* Dynamic Banner Overlay Content */}
                  {(banner.title || banner.subtitle || banner.button_text) && (
                    <div className="absolute inset-0 z-20 flex flex-col justify-center p-8 md:p-20 text-white max-w-2xl">
                      {banner.title && (
                        <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tight leading-none mb-3 drop-shadow-md">
                          {banner.title}
                        </h2>
                      )}
                      {banner.subtitle && (
                        <p className="text-sm md:text-lg text-slate-200 font-medium mb-6 max-w-lg drop-shadow-xs">
                          {banner.subtitle}
                        </p>
                      )}
                      {banner.button_text && (
                        <div>
                          <span className="inline-flex items-center gap-3 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-105">
                            {banner.button_text} <ArrowRight size={16} />
                          </span>
                        </div>
                      )}
                    </div>
                  )}
               </Link>
             ))}
          </div>

          {/* Slider Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3 pointer-events-auto">
             {bannersToDisplay.map((_, i) => (
               <button 
                key={i} 
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-12 bg-white' : 'w-2 bg-white/40'}`}
               />
             ))}
          </div>
        </div>
      </div>

        {/* Slider Controls */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 px-4 md:px-10 flex justify-between pointer-events-none">
          <button 
            onClick={prevSlide} 
            className="w-12 h-12 md:w-16 md:h-16 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-white shadow-xl transition-all pointer-events-auto"
          >
            <ChevronLeft size={28} />
          </button>
          <button 
            onClick={nextSlide} 
            className="w-12 h-12 md:w-16 md:h-16 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-white shadow-xl transition-all pointer-events-auto"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </header>

      {/* CATEGORIES Section */}
      <section className="px-4 md:px-10 pt-10 md:pt-24 pb-14 md:pb-32 max-w-[1440px] mx-auto text-left">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-6 md:mb-8 gap-4 md:gap-6">
          <div className="flex flex-col items-start text-left">
            <h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2 md:mb-3 text-left">Categories</h2>
            <p className="text-[10px] md:text-xs text-slate-400 font-black uppercase tracking-[0.4em] text-left">EXPLORE BY PRODUCT CATEGORIES</p>
          </div>
          <div className="flex items-center justify-start gap-3 md:gap-4 flex-wrap">
            <button 
              onClick={() => {
                const container = document.getElementById('categories-container');
                if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
              }}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => {
                const container = document.getElementById('categories-container');
                if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
              }}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
            >
              <ChevronRight size={18} />
            </button>
            <Link to="/products" className="group flex items-center gap-2 md:gap-4 text-xs font-black uppercase tracking-widest text-slate-900 hover:text-blue-600 transition-colors">
              View All Products
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                <ArrowUpRight size={14} />
              </div>
            </Link>
          </div>
        </div>

        <div id="categories-container" className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-8 pb-6 md:pb-10 scrollbar-hide">
          {(homeSettings?.categories && homeSettings.categories.length > 0 
            ? homeSettings.categories.filter(c => c.is_active !== false)
            : [
                { name: 'PC Component', image_url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80', slug: 'pc-component' },
                { name: 'Laptop', image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80', slug: 'laptop' },
                { name: 'Peripheral', image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80', slug: 'peripheral' },
                { name: 'Monitor', image_url: 'https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&q=80', slug: 'monitor' },
                { name: 'Desktop', image_url: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80', slug: 'desktop' },
                { name: 'Home & Office', image_url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80', slug: 'home-office' },
                { name: 'Networking', image_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80', slug: 'networking' },
                { name: 'Smart Home', image_url: 'https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/smart_house.jpg?auto=format&fit=crop&q=80', slug: 'smart-home' }
              ]
          ).map((cat) => (
            <Link 
              key={cat.slug || cat.name}
              to={`/products?category=${cat.slug}`}
              className="group relative flex-shrink-0 w-[70vw] sm:w-[50vw] md:w-[350px] aspect-[16/11] sm:aspect-[4/3] md:aspect-[4/5] rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-100 flex flex-col justify-end p-5 md:p-8 snap-start"
            >
              <img 
                src={cat.image_url} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                alt={cat.name} 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
              
              <div className="relative z-10">
                <h3 className="text-lg md:text-2xl font-black text-white uppercase tracking-tighter leading-tight mb-1 md:mb-2 group-hover:translate-x-2 transition-transform duration-500">{cat.name}</h3>
                <div className="flex items-center gap-1.5 md:gap-2 text-[10px] font-black text-white/70 uppercase tracking-widest opacity-90 md:opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0">
                  Explore <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BUILD YOUR OWN PC Section */}
      <section className="px-4 md:px-10 py-4 md:py-0 max-w-[1440px] mx-auto">
        <div className="relative min-h-[400px] sm:min-h-[440px] md:min-h-[480px] md:aspect-[21/9] rounded-2xl sm:rounded-3xl md:rounded-[3.5rem] overflow-hidden shadow-2xl group border border-slate-100 flex flex-col justify-center">
           <img 
             src={homeSettings?.custom_pc_bg_image || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80"} 
             className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
             alt="Build Your Own PC"
             referrerPolicy="no-referrer"
           />
           <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/95 via-black/75 to-black/40 md:via-black/50 md:to-transparent z-0"></div>
           
           <div className="relative z-10 flex flex-col justify-center p-6 sm:p-10 md:p-20">
             <div className="max-w-2xl animate-in fade-in slide-in-from-bottom duration-1000">
               <div className="flex items-center gap-3 mb-3 md:mb-5">
                 <span className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-black uppercase tracking-[0.25em] md:tracking-[0.4em] text-rose-400 bg-rose-500/20 backdrop-blur-xs px-3 py-1 rounded-full border border-rose-500/30">
                   CUSTOM PC BUILDS
                 </span>
               </div>
               <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight md:tracking-tighter uppercase leading-[1.1] md:leading-[0.95] mb-3 md:mb-5">
                 {homeSettings?.custom_pc_title || "Build Your Own PC."}
               </h2>
               <p className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-200 font-medium max-w-lg leading-relaxed mb-6 md:mb-8">
                 {homeSettings?.custom_pc_subtitle || "Pick your parts step by step to build your dream PC that suits your budget and needs. Support and after-sales guidance assurance."}
               </p>
               <Link 
                 to={homeSettings?.custom_pc_btn_link || "/customised"} 
                 className="inline-flex items-center gap-3 px-6 py-3 md:px-9 md:py-4 bg-[#e11d48] hover:bg-rose-700 text-white rounded-full font-black text-xs md:text-sm uppercase tracking-wider md:tracking-widest hover:scale-105 transition-all shadow-xl group/btn w-fit active:scale-95"
               >
                 <span>{homeSettings?.custom_pc_btn_text || "Start Building"}</span>
                 <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
               </Link>
             </div>
           </div>
        </div>
      </section>

      {/* THE COLLECTION Section */}
      <section className="bg-[#FAF9FB] pt-8 md:pt-12 pb-4 md:pb-6 overflow-hidden border-t border-slate-50">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
          <div className="flex items-center justify-between mb-8">
             <div className="flex flex-col">
                <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-3">BEST SELLERS</h2>
                <p className="text-sm text-slate-500 font-medium">The products customers shop most at Meadow.</p>
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
              <Link key={p.id} to={`/product/${p.slug}`} className="!w-[18.4117647059rem] h-[330px] sm:h-[360px] md:h-[400px] bg-white rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 relative flex flex-col group transition-all duration-500 hover:shadow-2xl snap-start border border-slate-100 flex-shrink-0">
                 <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all z-10"
                 >
                    <Heart size={14} />
                 </button>
                 <div className="flex-1 rounded-[1.5rem] overflow-hidden mb-2 md:mb-3 relative flex items-center justify-center">
                     <img src={p.image_url || undefined} className="w-full h-full object-contain p-2 md:p-3 group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
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


      {/* Promo Products Section */}
      <section className="py-2 md:py-4 bg-slate-50">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">FEATURED PROMOTION DEALS</h2>
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
              <Link key={p.id} to={`/product/${p.slug}`} className="!w-[18.4117647059rem] h-[330px] sm:h-[360px] md:h-[400px] bg-white rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 relative flex flex-col group transition-all duration-500 hover:shadow-2xl snap-start border border-slate-100 flex-shrink-0">
                 <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all z-10"
                 >
                    <Heart size={14} />
                 </button>
                 <div className="flex-1 rounded-[1.5rem] overflow-hidden mb-2 md:mb-3 relative flex items-center justify-center">
                     <img src={p.image_url || undefined} className="w-full h-full object-contain p-2 md:p-3 group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
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

      {/* New Arrival Section */}
      <section className="py-6 md:py-10 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">New Arrivals</h2>
            <div className="hidden md:flex gap-4">
                <button 
                  onClick={() => scrollNewArrival('left')}
                  className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                >
                  <ChevronLeft size={22} />
                </button>
                <button 
                  onClick={() => scrollNewArrival('right')}
                  className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                >
                  <ChevronRight size={22} />
                </button>
             </div>
          </div>
          <div 
            ref={newArrivalRef}
            className="flex gap-6 md:gap-10 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-10 -mb-10"
          >
            {/* Product Cards */}
            {newArrivalProducts.map((p) => (
              <Link key={p.id} to={`/product/${p.slug}`} className="!w-[18.4117647059rem] h-[330px] sm:h-[360px] md:h-[400px] bg-slate-50 rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 relative flex flex-col group transition-all duration-500 hover:shadow-2xl snap-start border border-slate-100 flex-shrink-0">
                 <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all z-10"
                 >
                    <Heart size={14} />
                 </button>
                 <div className="flex-1 rounded-[1.5rem] overflow-hidden mb-2 md:mb-3 relative flex items-center justify-center">
                     <img src={p.image_url || undefined} className="w-full h-full object-contain p-2 md:p-3 group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
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

      {/* PRE-BUILT SYSTEMS Section */}
      <section className="bg-slate-50 py-20 md:py-32 overflow-hidden border-t border-slate-100">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Left Content */}
            <div className="lg:w-1/4 flex flex-col items-start pt-10">
              <span className="text-xl font-bold text-rose-600 mb-6 uppercase tracking-tight">Ready To Go</span>
              <h2 className="text-5xl md:text-[4rem] font-black text-slate-900 leading-[0.85] tracking-tightest uppercase mb-8">
                PRE-BUILT PC<br /> PACKAGES
              </h2>
              <p className="text-slate-500 font-bold mb-12 tracking-widest text-sm">Built for different budgets and performance needs.</p>
              <Link 
                to="/prebuilt" 
                className="px-10 py-4 bg-white border border-slate-200 text-slate-900 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-lg"
              >
                View all
              </Link>
            </div>

            {/* Right Slider */}
            <div className="lg:w-3/4 w-full">
              <div id="prebuilt-container" className="flex gap-6 md:gap-10 overflow-x-auto pb-12 scrollbar-hide snap-x snap-mandatory">
                {[
                  {
                    id: "unbeatable-rtx-combo",
                    title: "UNBEATABLE RTX COMBO",
                    cpu: "RYZEN 5 7500F",
                    gpu: "GEFORCE RTX 3050",
                    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80",
                    specs: ["AMD Ryzen 5 7500F", "NVIDIA RTX 3050", "16GB DDR5 RAM", "1TB Gen4 SSD"]
                  },
                  {
                    id: "level-0-amd",
                    title: "LEVEL 0 AMD",
                    cpu: "RYZEN 5 7500F",
                    gpu: "GEFORCE RTX 5050",
                    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80",
                    specs: ["AMD Ryzen 5 7500F", "NVIDIA RTX 5050", "16GB DDR5 RAM", "1TB Gen4 SSD"]
                  },
                  {
                    id: "level-1-amd",
                    title: "LEVEL 1 AMD",
                    cpu: "RYZEN 5 7500F",
                    gpu: "GEFORCE RTX 5060",
                    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80",
                    specs: ["AMD Ryzen 5 7500F", "NVIDIA RTX 5060", "16GB DDR5 RAM", "1TB Gen4 SSD"]
                  },
                  {
                    id: "level-1-intel",
                    title: "LEVEL 1 INTEL",
                    cpu: "I5 14400F",
                    gpu: "GEFORCE RTX 5060",
                    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80",
                    specs: ["Intel Core i5 14400F", "NVIDIA RTX 5060", "16GB DDR5 RAM", "1TB Gen4 SSD"]
                  }
                ].map((item, i) => (
                  <Link 
                    key={i} 
                    to="/prebuilt"
                    className="flex-shrink-0 !w-[18.4117647059rem] h-[410px] sm:h-[440px] md:h-[480px] rounded-[2rem] md:rounded-[2.5rem] bg-white overflow-hidden shadow-2xl border border-slate-100 flex flex-col snap-start group"
                  >
                    <div className="p-4 pt-6 md:p-6 md:pt-8 text-center shrink-0">
                       <h3 className="text-base md:text-lg font-black text-slate-900 tracking-tighter uppercase mb-1 md:mb-2 group-hover:text-rose-600 transition-colors">{item.title}</h3>
                       <p className="text-[9px] font-black tracking-[0.2em] text-slate-400">
                         <span className="text-rose-600">{item.cpu}</span> <span className="mx-2 opacity-50">+</span> <span className="text-emerald-500">{item.gpu}</span>
                       </p>
                    </div>
                    <div className="flex-1 min-h-0 relative overflow-hidden mx-4 rounded-[1.5rem] border border-slate-50">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt={item.title} />
                      <div className="absolute top-4 right-4">
                        <span className="px-2 py-1 bg-blue-600 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                          <Zap size={8} fill="currentColor" /> WIFI 7
                        </span>
                      </div>
                    </div>
                    <div className="p-4 md:p-6 flex flex-col gap-4 bg-white shrink-0 mt-auto">
                      <div className="pt-3 md:pt-4 border-t border-slate-100 flex items-center justify-between">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">View all</span>
                         <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-rose-600 transition-colors">
                            <ArrowRight size={16} />
                         </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Navigation and Progress */}
              <div className="flex items-center justify-between pt-8 border-t border-slate-200">
                <div className="flex-1 max-w-[70%] h-px bg-slate-200 relative">
                   <div className="absolute inset-y-0 left-0 w-1/4 bg-slate-900 h-px"></div>
                </div>
                <div className="flex gap-4 ml-8">
                  <button 
                    onClick={() => {
                        const container = document.getElementById('prebuilt-container');
                        if (container) container.scrollBy({ left: -400, behavior: 'smooth' });
                    }}
                    className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all bg-white shadow-sm"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => {
                        const container = document.getElementById('prebuilt-container');
                        if (container) container.scrollBy({ left: 400, behavior: 'smooth' });
                    }}
                    className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all bg-white shadow-sm"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO / Support Beyond the Purchase Section */}
      <section className="bg-[#FAF9FB] py-20 md:py-28 border-t border-slate-100 font-sans">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* Left Header Info */}
            <div className="lg:col-span-4 flex flex-col justify-center pr-0 lg:pr-6">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#e11d48] mb-3">
                WHAT WE DO
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                Support Beyond the Purchase
              </h2>
              <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed max-w-md">
                Practical, ongoing support and added convenience that go beyond your purchase.
              </p>
            </div>

            {/* Right 3 Cards Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Workshop Services */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                <div>
                  <div className="w-12 h-12 rounded-full bg-rose-50 text-[#e11d48] flex items-center justify-center mb-6">
                    <Wrench size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">
                    Workshop Services
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed mb-8">
                    Dust cleaning, basic maintenance, problem diagnosis, formatting and data backup.
                  </p>
                </div>
                <Link to="/contact" className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-slate-900 hover:text-[#e11d48] transition-colors group/link mt-auto">
                  Learn More <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Card 2: Warranty & RMA Support */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                <div>
                  <div className="w-12 h-12 rounded-full bg-rose-50 text-[#e11d48] flex items-center justify-center mb-6">
                    <ShieldCheck size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">
                    Warranty & RMA Support
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed mb-8">
                    We manage the claim process from start to finish.
                  </p>
                </div>
                <Link to="/contact" className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-slate-900 hover:text-[#e11d48] transition-colors group/link mt-auto">
                  View Support <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Card 3: Delivery Nationwide */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                <div>
                  <div className="w-12 h-12 rounded-full bg-rose-50 text-[#e11d48] flex items-center justify-center mb-6">
                    <Truck size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">
                    Delivery Nationwide
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed mb-8">
                    We deliver nationwide across Malaysia for purchases above RM 1,500, arranged at no additional charges.
                  </p>
                </div>
                <Link to="/contact" className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-slate-900 hover:text-[#e11d48] transition-colors group/link mt-auto">
                  Learn More <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Laptop Section */}
      {laptopProducts.length > 0 && (
        <section className="py-6 md:py-10 bg-slate-50 border-t border-slate-100">
          <div className="max-w-[1440px] mx-auto px-4 md:px-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col">
                <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">Laptops</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Master of Portability</p>
              </div>
              <div className="hidden md:flex gap-4">
                  <button 
                    onClick={() => scrollLaptop('left')}
                    className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all bg-white"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button 
                    onClick={() => scrollLaptop('right')}
                    className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all bg-white"
                  >
                    <ChevronRight size={22} />
                  </button>
               </div>
            </div>
            <div 
              ref={laptopRef}
              className="flex gap-6 md:gap-10 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-10 -mb-10"
            >
              {laptopProducts.map((p) => (
                <Link key={p.id} to={`/product/${p.slug}`} className="!w-[18.4117647059rem] h-[330px] sm:h-[360px] md:h-[400px] bg-white rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 relative flex flex-col group transition-all duration-500 hover:shadow-2xl snap-start border border-slate-100 flex-shrink-0">
                   <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all z-10"
                   >
                      <Heart size={14} />
                   </button>
                   <div className="flex-1 rounded-[1.5rem] overflow-hidden mb-2 md:mb-3 relative flex items-center justify-center">
                       <img src={p.image_url || undefined} className="w-full h-full object-contain p-2 md:p-3 group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
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
      )}

      {/* PC Components Section */}
      {pcComponentProducts.length > 0 && (
        <section className="py-6 md:py-10 bg-white border-t border-slate-100">
          <div className="max-w-[1440px] mx-auto px-4 md:px-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col">
                <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">PC Components</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">The Core Elements</p>
              </div>
              <div className="hidden md:flex gap-4">
                  <button 
                    onClick={() => scrollPcComponent('left')}
                    className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button 
                    onClick={() => scrollPcComponent('right')}
                    className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                  >
                    <ChevronRight size={22} />
                  </button>
               </div>
            </div>
            <div 
              ref={pcComponentRef}
              className="flex gap-6 md:gap-10 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-10 -mb-10"
            >
              {pcComponentProducts.map((p) => (
                <Link key={p.id} to={`/product/${p.slug}`} className="!w-[18.4117647059rem] h-[330px] sm:h-[360px] md:h-[400px] bg-slate-50 rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 relative flex flex-col group transition-all duration-500 hover:shadow-2xl snap-start border border-slate-100 flex-shrink-0">
                   <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all z-10"
                   >
                      <Heart size={14} />
                   </button>
                   <div className="flex-1 rounded-[1.5rem] overflow-hidden mb-2 md:mb-3 relative flex items-center justify-center">
                       <img src={p.image_url || undefined} className="w-full h-full object-contain p-2 md:p-3 group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
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
      )}

      {/* Display Section */}
      {displayProducts.length > 0 && (
        <section className="py-6 md:py-10 bg-slate-50 border-t border-slate-100">
          <div className="max-w-[1440px] mx-auto px-4 md:px-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col">
                <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">Display</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Visual Excellence</p>
              </div>
              <div className="hidden md:flex gap-4">
                  <button 
                    onClick={() => scrollDisplay('left')}
                    className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all bg-white"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button 
                    onClick={() => scrollDisplay('right')}
                    className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all bg-white"
                  >
                    <ChevronRight size={22} />
                  </button>
               </div>
            </div>
            <div 
              ref={displayRef}
              className="flex gap-6 md:gap-10 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-10 -mb-10"
            >
              {displayProducts.map((p) => (
                <Link key={p.id} to={`/product/${p.slug}`} className="!w-[18.4117647059rem] h-[330px] sm:h-[360px] md:h-[400px] bg-white rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-6 relative flex flex-col group transition-all duration-500 hover:shadow-2xl snap-start border border-slate-100 flex-shrink-0">
                   <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all z-10"
                   >
                      <Heart size={14} />
                   </button>
                   <div className="flex-1 rounded-[1.5rem] overflow-hidden mb-2 md:mb-3 relative flex items-center justify-center">
                       <img src={p.image_url || undefined} className="w-full h-full object-contain p-2 md:p-3 group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
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
      )}

      {/* VISIT OUR STORE Section */}
      <section className="bg-white py-14 md:py-20 overflow-hidden border-t border-slate-50 font-sans">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
          <h2 className="text-3xl md:text-5xl font-black text-black tracking-tighter uppercase mb-8 md:mb-10">
            {homeSettings?.store_section_title || "Visit Our Store."}
          </h2>
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-stretch">
            {/* Left Card */}
            <div className="lg:w-1/3 bg-[#f3f4f6] rounded-2xl p-6 md:p-8 flex flex-col justify-between min-h-[300px] md:min-h-[340px] shadow-sm font-sans">
              <div className="flex flex-col justify-start gap-4">
                <h3 className="text-xl md:text-2xl font-bold text-black leading-tight text-left uppercase tracking-tight whitespace-pre-line">
                  {(homeSettings?.store_card_title || "View All Meadow\nComputer All Locations.")
                    .replace(/Mega\s*Store\s*Location\.?/gi, 'All Locations.')
                    .replace(/Mega\s*Store/gi, 'All Locations')}
                </h3>
              </div>
              
              <div className="flex flex-col gap-4">
                <Link 
                  to={homeSettings?.store_btn_link || "/our-stores"} 
                  className="inline-flex items-center justify-center w-fit max-w-full px-6 md:px-7 py-3 md:py-3.5 whitespace-nowrap bg-white border-2 border-black rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all shadow-sm text-center"
                >
                  {homeSettings?.store_btn_text || "Our Store"}
                </Link>
                <div className="border-t border-black/20 pt-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-[#333] mb-1.5">
                    {homeSettings?.store_media_type === 'image' ? 'LOCATION DISPLAYING' : 'VIDEO DISPLAYING'} <ArrowRight size={14} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#333]">
                    {homeSettings?.store_video_label || "TAMAN PELANGI ASUS STORE"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Card (Video or Image) */}
            <div className="lg:flex-1 h-[260px] sm:h-[300px] md:h-[340px] lg:h-[350px] rounded-2xl overflow-hidden shadow-xl border border-slate-100 relative bg-black">
              {homeSettings?.store_media_type === 'image' ? (
                <img 
                  src={homeSettings?.store_media_url || "https://illuminatelabs.space/assets/locator_vd.mp4"}
                  alt="Store Location"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video 
                  src={homeSettings?.store_media_url || "https://illuminatelabs.space/assets/locator_vd.mp4"}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
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

      <Footer />
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

