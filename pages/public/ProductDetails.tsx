
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Heart, 
  ShieldCheck, 
  Zap, 
  Truck, 
  Cpu, 
  Loader2, 
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Star,
  CheckCircle,
  Menu,
  X,
  // Fix: Added missing ArrowUpRight import used in the navigation menu
  ArrowUpRight,
  Search,
  User as UserIcon,
  Facebook,
  Instagram
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Product, Brand, Category, Profile } from '../../types';

interface CartItem extends Product {
  quantity: number;
}

type MenuMode = 'all' | 'story' | 'contact' | 'products';
const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/Red%20Full%20Logo.png";

const ProductDetails: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Shared UI States (Synced with Home)
  const [isFullMenuOpen, setIsFullMenuOpen] = useState(false);
  const [menuMode, setMenuMode] = useState<MenuMode>('all');
  const [headerSearch, setHeaderSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchProductData();
    checkUser();
    const savedCart = localStorage.getItem('meadow_cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, [slug]);

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

  const fetchProductData = async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: prodError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (prodError) throw prodError;
      if (!data) throw new Error("Product not indexed.");

      setProduct(data);

      const [brandRes, catRes, relatedRes] = await Promise.all([
        supabase.from('brands').select('*').eq('id', data.brand_id).single(),
        supabase.from('categories').select('*').eq('id', data.category_id).single(),
        supabase.from('products').select('*').eq('category_id', data.category_id).neq('id', data.id).limit(4)
      ]);

      if (brandRes.data) setBrand(brandRes.data);
      if (catRes.data) setCategory(catRes.data);
      if (relatedRes.data) setRelatedProducts(relatedRes.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscountedPrice = (price: number, type: string, value: number) => {
    if (type === 'percentage') return price * (1 - value / 100);
    if (type === 'fixed') return Math.max(0, price - value);
    return price;
  };

  const addToCart = () => {
    if (!product || product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    setIsCartOpen(true);
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
        <Loader2 className="animate-spin text-slate-900" size={48} />
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Loading Product Data...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-10 text-center">
        <AlertCircle className="text-rose-500 mb-6" size={64} strokeWidth={1} />
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Product Not Found</h2>
        <button onClick={() => navigate('/')} className="px-10 py-4 bg-slate-900 text-white rounded-full font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-2">
           <ArrowLeft size={16} /> Return to Terminal
        </button>
      </div>
    );
  }

  const finalPrice = calculateDiscountedPrice(product.price, product.discount_type, product.discount_value);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* Full-Screen Navigation Menu Overlay (Synced with Home) */}
      <div className={`fixed inset-0 z-[500] bg-white transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${isFullMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="h-full flex flex-col">
          <div className="h-32 md:h-48 px-6 md:px-12 flex items-center justify-between shrink-0">
             <Link to="/" onClick={() => setIsFullMenuOpen(false)} className="flex items-center group">
                <img src={LOGO_URL} className="h-24 md:h-36 w-auto object-contain transition-transform group-hover:scale-105" alt="Meadow" />
             </Link>
             <button onClick={() => setIsFullMenuOpen(false)} className="w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <X size={28} />
             </button>
          </div>
          <div className="flex-1 flex flex-col md:flex-row px-6 md:px-24 py-12 gap-12 overflow-y-auto">
             <div className="flex-1">
                <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 mb-12">Navigation Protocol</p>
                <nav className="flex flex-col gap-12 md:gap-16">
                   <Link to="/categories" onClick={() => setIsFullMenuOpen(false)} className="group flex items-center gap-6">
                      <span className="text-4xl md:text-7xl font-nav uppercase tracking-tighter text-slate-900">Products</span>
                      <ArrowUpRight className="text-slate-200 group-hover:text-slate-900 transition-colors" size={32} />
                   </Link>
                   <Link to="/customised" onClick={() => setIsFullMenuOpen(false)} className="group flex items-center gap-6">
                      <span className="text-4xl md:text-7xl font-nav uppercase tracking-tighter text-rose-600 group-hover:italic transition-all">Build Your Own PC</span>
                      <Zap className="text-rose-500 animate-pulse" size={32} />
                   </Link>
                   <Link to="/stores" onClick={() => setIsFullMenuOpen(false)} className="group flex items-center gap-6">
                      <span className="text-4xl md:text-7xl font-nav uppercase tracking-tighter text-slate-900">Stores</span>
                      <ArrowUpRight className="text-slate-200 group-hover:text-slate-900 transition-colors" size={32} />
                   </Link>
                </nav>
             </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <nav className={`fixed left-0 right-0 z-[100] px-4 md:px-10 pointer-events-none transition-all duration-500 ${scrolled ? 'top-0 py-4 bg-white/80 backdrop-blur-2xl border-b border-slate-100 shadow-lg' : 'top-0'}`}>
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center pointer-events-auto group">
            <img src={LOGO_URL} className={`w-auto object-contain transition-all duration-500 group-hover:scale-105 ${scrolled ? 'h-14 md:h-20' : 'h-24 md:h-36'}`} alt="Meadow" />
          </Link>
          
          <div className="hidden md:flex items-center bg-white/70 backdrop-blur-3xl border border-white/40 rounded-full px-8 py-3 gap-6 md:gap-8 lg:gap-10 shadow-xl shadow-slate-200/20 pointer-events-auto transition-all hover:bg-white/90 group">
            <form onSubmit={handleHeaderSearch} className="relative flex items-center">
              <Search size={18} className="absolute left-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                className="bg-slate-100/50 border-none rounded-full py-3 pl-14 pr-8 text-sm font-bold w-48 focus:w-64 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-slate-200"
              />
            </form>
            <Link to="/categories" className="text-sm font-nav uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-colors">Category</Link>
            <Link to="/categories" className="text-sm font-nav uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-colors">Brand</Link>
            <Link 
              to="/customised" 
              className="px-8 py-4 bg-slate-900 text-white text-xs font-nav uppercase tracking-[0.3em] rounded-full hover:bg-rose-600 transition-all shadow-lg shadow-slate-900/20 hover:shadow-rose-600/30 flex items-center gap-2"
            >
              <Zap size={18} className="text-rose-400" />
              Build Your Own PC
            </Link>
          </div>

          <div className="flex items-center gap-3 md:gap-6 pointer-events-auto">
            {!user ? (
               <button onClick={() => navigate('/')} className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                 <UserIcon size={20} />
               </button>
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

      {/* Product Content */}
      <main className="pt-24 md:pt-36 pb-20 px-4 md:px-10 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20 items-start">
          
          {/* Visual Showcase (Left - 6 Columns) */}
          <div className="lg:col-span-6 space-y-8 animate-in fade-in slide-in-from-left duration-700">
             <div className="w-full max-w-md lg:max-w-[420px] mx-auto aspect-[3/4] bg-[#F7F8FA] rounded-[2rem] md:rounded-[3rem] overflow-hidden flex items-center justify-center p-8 md:p-12 relative border border-slate-50 group">
                <img 
                  src={product.image_url || undefined} 
                  className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110" 
                  alt={product.name} 
                />
                <div className="absolute top-6 left-6 md:top-8 md:left-8">
                   <div className="px-4 py-2 bg-white/80 backdrop-blur-xl border border-white rounded-full flex items-center gap-3 shadow-sm">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Stock Verified</span>
                   </div>
                </div>
                {product.discount_type !== 'none' && (
                  <div className="absolute top-6 right-6 md:top-8 md:right-8">
                     <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-[10px] uppercase tracking-widest shadow-xl rotate-12">
                        Sale
                     </div>
                  </div>
                )}
             </div>

             <div className="flex flex-wrap justify-center gap-4">
                {[...Array(4)].map((_, i) => (
                   <div key={i} className="aspect-square w-[80px] md:w-[100px] bg-slate-50 rounded-2xl border border-slate-100 p-3 md:p-4 flex items-center justify-center opacity-60 hover:opacity-100 transition-all cursor-pointer">
                      <img src={product.image_url || undefined} className="w-full h-full object-contain grayscale" />
                   </div>
                ))}
             </div>
          </div>

          {/* Product Info (Right - 6 Columns) */}
          <div className="lg:col-span-6 space-y-12 md:sticky md:top-48 animate-in fade-in slide-in-from-right duration-700">
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <span className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-600">{category?.name || 'Hardware'}</span>
                   <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                   <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">{brand?.name || 'Meadow IT'}</span>
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase leading-[1.2]">
                   {product.name}
                </h1>
                <div className="flex items-center gap-2 pt-2">
                   {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-blue-500 text-blue-500" />)}
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">24 Verified Reviews</span>
                </div>
             </div>

             <div className="space-y-8 pb-12 border-b border-slate-100">
                <div className="flex items-end gap-4">
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retail Price</span>
                      <span className="text-3xl lg:text-3xl font-black text-slate-900 tracking-tight">RM{finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                   </div>
                   {product.discount_type !== 'none' && (
                     <span className="text-lg font-bold text-slate-300 line-through mb-1">RM{product.price.toLocaleString()}</span>
                   )}
                </div>
                
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                   {product.description || "Unparalleled performance meets precise engineering. Engineered for the modern professional seeking reliability and power in every deployment."}
                </p>
             </div>

             <div className="space-y-10">
                <div className="flex items-center gap-6">
                   <div className="flex items-center bg-slate-50 rounded-2xl px-6 py-4 gap-10 border border-slate-100">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-slate-400 hover:text-slate-900 transition-colors"><Minus size={20} /></button>
                      <span className="font-black text-xl min-w-[30px] text-center">{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="text-slate-400 hover:text-slate-900 transition-colors"><Plus size={20} /></button>
                   </div>
                   <button 
                     onClick={addToCart}
                     disabled={product.stock <= 0}
                     className="flex-1 h-20 bg-slate-900 text-white rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-widest flex items-center justify-center gap-6 hover:bg-blue-600 transition-all shadow-2xl group active:scale-95"
                   >
                     {isAdded ? (
                       <><CheckCircle size={20} /> Added to cart</>
                     ) : (
                       <>Add to cart <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-all"><ShoppingCart size={18} /></div></>
                     )}
                   </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-4">
                      <ShieldCheck className="text-blue-600" size={24} />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Technical Warranty</p>
                        <p className="text-xs font-bold text-slate-900 mt-1 uppercase">24-Month Logic Protection</p>
                      </div>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-4">
                      <Truck className="text-blue-600" size={24} />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Global Logistics</p>
                        <p className="text-xs font-bold text-slate-900 mt-1 uppercase">48-Hour Rapid Deploy</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Technical Specifications */}
      <section className="bg-[#FAF9FB] py-20 md:py-32 border-y border-slate-100">
         <div className="max-w-[1440px] mx-auto px-4 md:px-10">
            <div className="grid lg:grid-cols-12 gap-16 md:gap-24">
               <div className="lg:col-span-4">
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9] mb-8">Technical <br /> Architecture.</h2>
                  <p className="text-slate-500 font-medium text-lg leading-relaxed">
                     Detailed metrics and component validation. Every unit undergoes 72 hours of thermal stress testing prior to indexing.
                  </p>
               </div>
               <div className="lg:col-span-8 grid md:grid-cols-2 gap-12">
                  {[
                    { label: 'Thermal Efficiency', val: 'Vortex Airflow Cooling', icon: Zap },
                    { label: 'System Logic', val: 'Engineered V-Series PCB', icon: Cpu },
                    { label: 'Durability Matrix', val: 'Military-Grade Alloy', icon: ShieldCheck },
                    { label: 'Acoustic Level', val: 'Zero-Decibel Static', icon: Zap }
                  ].map((spec, i) => (
                    <div key={i} className="flex gap-8 group">
                       <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center text-blue-600 group-hover:bg-slate-900 group-hover:text-white transition-all shrink-0">
                          <spec.icon size={28} />
                       </div>
                       <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">{spec.label}</p>
                          <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{spec.val}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Related Products */}
      <section className="py-20 md:py-32 bg-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
           <div className="flex items-center justify-between mb-16 md:mb-20">
              <div>
                 <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">Cross-Referenced Assets</h2>
                 <p className="text-xs text-slate-300 font-black uppercase tracking-[0.3em] mt-3">Recommended Deployments</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <Link to={`/product/${p.slug}`} key={p.id} className="group flex flex-col bg-[#F9FAFB] rounded-[2.5rem] p-10 hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-slate-100">
                   <div className="aspect-[4/5] mb-8 overflow-hidden rounded-[2rem] flex items-center justify-center p-6">
                      <img src={p.image_url || undefined} className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110" alt={p.name} />
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Indexed HW</span>
                         <span className="text-sm font-black text-slate-900">RM{p.price.toLocaleString()}</span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight uppercase line-clamp-2 min-h-[44px]">{p.name}</h3>
                      <div className="flex items-center gap-2 pt-2 text-blue-600 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                         Analyze Details <ChevronRight size={14} />
                      </div>
                   </div>
                </Link>
              ))}
           </div>
        </div>
      </section>

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
                           <img src={item.image_url || undefined} className="w-full h-full object-contain" />
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
                 <button onClick={() => navigate('/checkout-light')} className="w-full py-7 bg-slate-900 text-white font-black rounded-3xl hover:bg-black transition-all shadow-2xl uppercase tracking-[0.3em] text-xs">Initialize Purchase</button>
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
                <li><Link to="/" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Our Story</Link></li>
                <li><Link to="/" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Contact Us</Link></li>
                <li><Link to="/stores" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Store Locator</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8">Legal</h4>
              <ul className="space-y-4">
                <li><Link to="/terms" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Terms & Conditions</Link></li>
                <li><Link to="/product-policy" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Product Policy</Link></li>
                <li><Link to="/product-policy" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8">Newsletter</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Join the Registry for updates.</p>
              <form className="flex gap-2 mb-8" onSubmit={(e) => e.preventDefault()}>
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

export default ProductDetails;
