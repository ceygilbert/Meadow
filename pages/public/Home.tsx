
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
  MapPin
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Product, Profile, Brand } from '../../types';

interface CartItem extends Product {
  quantity: number;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
        <Loader2 className="animate-spin text-slate-900" size={48} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Initializing Terminal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-10 text-center">
        <AlertCircle className="text-rose-500 mb-6" size={64} strokeWidth={1} />
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Connection Failed</h2>
        <p className="text-slate-500 max-w-xs mb-10 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="px-10 py-4 bg-slate-900 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Retry Connection</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* Editorial Floating Header */}
      <nav className="fixed top-4 md:top-6 left-0 right-0 z-[100] px-4 md:px-10 pointer-events-none">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg">
              <Cpu size={18} />
            </div>
            <span className="text-base md:text-lg font-black tracking-tighter uppercase leading-none">Meadow</span>
          </div>

          <div className="hidden md:flex items-center bg-white/70 backdrop-blur-3xl border border-white/40 rounded-full px-8 py-3 gap-6 md:gap-10 shadow-xl shadow-slate-200/20 pointer-events-auto transition-all hover:bg-white/90">
            <a href="#" className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-slate-900 transition-all">Brand Story</a>
            <a href="#" className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-slate-900 transition-all">Product</a>
            <Link to="/stores" className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-slate-900 transition-all">Store Locator</Link>
            <a href="#" className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-slate-900 transition-all">Contact Us</a>
          </div>

          <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden w-10 h-10 bg-white border border-slate-100 text-slate-900 rounded-full flex items-center justify-center shadow-lg">
              <Menu size={18} />
            </button>
            {!user ? (
               <button onClick={() => setIsAuthModalOpen(true)} className="px-4 md:px-6 py-2 md:py-2.5 bg-slate-100 text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-slate-900 hover:text-white transition-all">Sign In</button>
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

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
           <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
           <div className="relative w-full max-w-[280px] bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 p-8 flex flex-col">
              <div className="flex justify-between items-center mb-16">
                 <span className="text-lg font-black tracking-tighter uppercase">Menu</span>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 bg-slate-50 text-slate-900 rounded-full flex items-center justify-center"><X size={20} /></button>
              </div>
              <div className="flex flex-col gap-10">
                 <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-colors">Brand Story</a>
                 <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-colors">Product</a>
                 <Link to="/stores" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-colors">Store Locator</Link>
                 <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-colors">Contact Us</a>
              </div>
           </div>
        </div>
      )}

      {/* Hero Section */}
      <header className="relative pt-24 md:pt-32 px-4 md:px-10 pb-10 md:pb-20">
        <div className="hidden lg:block absolute top-40 left-10 text-[11vw] font-black text-slate-50 tracking-tighter leading-none pointer-events-none select-none -z-10 uppercase">
          Precision Engineering
        </div>

        <div className="max-w-[1440px] mx-auto bg-[#F7F8FA] rounded-[2rem] md:rounded-[3.5rem] relative min-h-[500px] md:min-h-[750px] flex items-center overflow-hidden border border-slate-100">
          <div className="absolute -top-40 -right-40 w-[400px] md:w-[800px] h-[400px] md:h-[800px] border border-white/50 rounded-full pointer-events-none"></div>
          
          <div className="grid lg:grid-cols-2 w-full p-6 md:p-20 relative z-10">
            <div className="flex flex-col justify-center text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6 md:mb-10">
                <div className="px-3 py-1 bg-white rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-400 border border-slate-200/60 shadow-sm">Meadow — Core Unit</div>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8 md:mb-12">
                More sensitive <br /> <span className="text-slate-300 italic font-medium">interaction.</span>
              </h1>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 md:gap-8">
                <button className="w-full sm:w-auto h-14 md:h-16 px-6 md:px-10 bg-white text-slate-900 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-slate-900 hover:text-white transition-all shadow-xl group">
                  Know more 
                  <div className="w-8 h-8 md:w-9 md:h-9 bg-[#C5FF41] rounded-full flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform">
                    <ArrowRight size={18} />
                  </div>
                </button>
                <button className="flex items-center gap-4 group">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Play size={16} fill="currentColor" />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-900 transition-colors">Watch Film</span>
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center pt-10 lg:pt-0">
              <div className="relative w-full max-w-[300px] md:max-w-lg aspect-square bg-white rounded-[2.5rem] md:rounded-[4.5rem] shadow-2xl p-4 md:p-6 flex items-center justify-center group overflow-hidden border border-slate-50">
                 <div className="w-full h-full bg-slate-50 rounded-[2rem] md:rounded-[3.5rem] flex items-center justify-center relative overflow-hidden shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-50 z-10"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1587202377405-836165b1040a?auto=format&fit=crop&q=80" 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      alt="Hardware Engineering"
                    />
                    <div className="absolute bottom-6 right-6 z-20 flex gap-2">
                       <div className="w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white cursor-pointer hover:scale-110 transition-all"><Plus size={14} className="text-slate-400" /></div>
                       <div className="w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white cursor-pointer hover:scale-110 transition-all"><MousePointer2 size={14} className="text-slate-400" /></div>
                    </div>
                 </div>
              </div>
              <div className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 w-24 h-24 md:w-40 md:h-40 bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl p-3 border border-slate-100 animate-bounce transition-all hidden md:flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80" 
                    className="w-full h-full object-cover rounded-xl md:rounded-3xl" 
                    alt="Core Component"
                  />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Feature Blocks Section */}
      <section className="px-4 md:px-10 py-10 md:py-20 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 row-span-2 bg-[#F9FAFB] rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-16 flex flex-col justify-between group overflow-hidden relative border border-slate-100">
             <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
             <div className="relative z-10">
                <span className="inline-block px-5 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-full mb-12">Core Analytics</span>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.95] mb-8">
                  The precision <br /> <span className="text-slate-300 italic font-medium">expression analysis.</span>
                </h2>
                <p className="text-slate-400 text-sm max-w-sm font-medium leading-relaxed opacity-80">
                  Our neural engine processes interaction data in real-time, delivering insight into performance metrics you never thought possible.
                </p>
             </div>
             <div className="mt-10 md:mt-20 flex items-end justify-between relative z-10">
                <button className="h-14 px-8 bg-white border border-slate-100 text-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-4 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                  Try Now Meadow <div className="w-8 h-8 bg-[#C5FF41] rounded-full flex items-center justify-center text-slate-900 group-hover:rotate-45 transition-transform"><ArrowRight size={16} /></div>
                </button>
             </div>
          </div>

          <div className="bg-[#C5FF41] rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-12 flex flex-col justify-between group relative overflow-hidden shadow-2xl shadow-lime-400/20">
             <div className="absolute top-0 right-0 p-32 border border-black/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
             <div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none mb-6">
                  Try this product <br /> in Augmented Reality.
                </h3>
                <p className="text-[10px] font-black text-slate-900/40 uppercase tracking-[0.2em] leading-relaxed max-w-[200px]">
                  Download our companion app to see Meadow in your space.
                </p>
             </div>
             <div className="flex items-center justify-between mt-8 md:mt-12 relative z-10">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-xl">
                  <Monitor size={22} />
                </div>
                <button className="px-6 md:px-8 py-3 md:py-4 bg-slate-900 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl hover:bg-black transition-all">
                  Launch AR
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* THE COLLECTION Section */}
      <section className="bg-[#FAF9FB] px-4 md:px-10 py-20 md:py-32 overflow-hidden border-t border-slate-50">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center justify-between mb-16 md:mb-20">
             <div className="flex flex-col">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">The Collection</h2>
                <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.3em]">Featured — {featuredProducts.length} Items Indexed</p>
             </div>
             <div className="hidden md:flex gap-4">
                <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"><Search size={18} /></button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 justify-center items-center">
            {featuredProducts.slice(0, 2).map((p) => (
              <div key={p.id} className="w-full bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 relative flex flex-col group transition-all duration-500 hover:shadow-2xl">
                 <button className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all z-10">
                    <Heart size={16} />
                 </button>
                 <div className="aspect-[4/5] bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden mb-6 relative">
                    <img src={p.image_url} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-1000" />
                 </div>
                 <div className="mb-6">
                    <h3 className="text-base font-black text-slate-900 tracking-tight leading-tight mb-1 truncate">{p.name}</h3>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Meadow IT</p>
                 </div>
                 <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm font-black text-slate-900">RM{p.price.toLocaleString()}</span>
                    <button onClick={() => addToCart(p)} className="px-5 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-blue-600 transition-all shadow-lg">Add to cart</button>
                 </div>
              </div>
            ))}

            <div className="hidden lg:flex flex-col items-center justify-center w-full h-full min-h-[300px] relative">
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
               <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl border border-slate-100 group cursor-pointer hover:bg-slate-900 hover:text-white transition-all z-10">
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
               </div>
            </div>

            {featuredProducts.slice(2, 3).map((p) => (
              <div key={p.id} className="w-full bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 relative flex flex-col group transition-all duration-500 hover:shadow-2xl">
                 <button className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all z-10">
                    <Heart size={16} />
                 </button>
                 <div className="aspect-[4/5] bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden mb-6 relative">
                    <img src={p.image_url} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-1000" />
                 </div>
                 <div className="mb-6">
                    <h3 className="text-base font-black text-slate-900 tracking-tight leading-tight mb-1 truncate">{p.name}</h3>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Premium Build</p>
                 </div>
                 <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm font-black text-slate-900">RM{p.price.toLocaleString()}</span>
                    <button onClick={() => addToCart(p)} className="px-5 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-blue-600 transition-all shadow-lg">Add to cart</button>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR BLOG Section */}
      <section className="bg-[#FAF9FB] px-4 md:px-10 py-20 md:py-32 overflow-hidden border-t border-slate-50">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase mb-12 md:mb-24 text-center md:text-left">Our Blog</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 items-start">
            <div className="flex flex-col gap-8 order-2 lg:order-1">
              <div className="aspect-square bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 p-3 transition-transform hover:-translate-y-1 duration-500">
                 <img src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80" className="w-full h-full object-cover rounded-[1rem] md:rounded-[1.5rem]" />
              </div>
              <div className="space-y-4">
                 <p className="text-slate-500 text-sm font-medium leading-relaxed opacity-90">
                   Monthly updates on best-performing hardware deployments and extreme performance metrics.
                 </p>
                 <a href="#" className="inline-block text-[9px] font-black uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1 hover:text-blue-600 hover:border-blue-600 transition-all">Go to Blog</a>
              </div>
            </div>
            <div className="lg:col-span-2 order-1 lg:order-2">
               <div className="aspect-[4/5] bg-white rounded-[2rem] md:rounded-[3rem] rounded-br-[5rem] md:rounded-br-[10rem] overflow-hidden shadow-2xl relative border border-slate-100 group">
                  <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-6 md:bottom-16 left-6 md:left-16 text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                     <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] mb-2 md:mb-4">Deep Dive</p>
                     <h3 className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-none">Silicon Architecture <br /> Next Gen.</h3>
                  </div>
               </div>
            </div>
            <div className="flex flex-col h-full justify-between gap-8 order-3">
               <div className="space-y-4">
                  <h4 className="text-base md:text-lg font-black text-slate-900 tracking-tight leading-tight uppercase">Meadow Core <br /> Intelligence Blog</h4>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed opacity-80">
                    Insights on hardware calibration and custom cooling architectures.
                  </p>
               </div>
               <div className="aspect-square bg-blue-50 rounded-[1.5rem] md:rounded-[2.5rem] rounded-bl-[4rem] md:rounded-bl-[6rem] overflow-hidden shadow-xl p-3 md:p-4 relative flex items-center justify-center border border-white">
                  <div className="w-full h-full bg-slate-900 rounded-[1rem] md:rounded-[2rem] rounded-bl-[3.5rem] md:rounded-bl-[5.5rem] flex items-center justify-center overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-50" />
                     {/* Fix: removed invalid md:size prop and replaced with Tailwind responsive classes */}
                     <Cpu strokeWidth={0.5} className="text-white absolute drop-shadow-2xl w-[60px] h-[60px] md:w-[80px] md:h-[80px]" />
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
                 <div className="w-14 h-14 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-slate-100">
                    <UserIcon size={24} />
                 </div>
                 <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase mb-2">
                    {authMode === 'login' ? 'System Access' : 'Create Profile'}
                 </h3>
                 <form onSubmit={handleAuth} className="space-y-4 mt-8">
                    {authMode === 'signup' && (
                       <input required className="w-full px-6 py-4 bg-slate-50 border-none rounded-xl outline-none font-bold text-sm" placeholder="Legal Name" value={authForm.fullName} onChange={e => setAuthForm({...authForm, fullName: e.target.value})} />
                    )}
                    <input required type="email" className="w-full px-6 py-4 bg-slate-50 border-none rounded-xl outline-none font-bold text-sm" placeholder="Email" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} />
                    <input required type={showPassword ? "text" : "password"} className="w-full px-6 py-4 bg-slate-50 border-none rounded-xl outline-none font-bold text-sm" placeholder="Passkey" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} />
                    <button disabled={authLoading} className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all uppercase tracking-[0.2em] text-[10px] mt-4">{authLoading ? '...' : 'Authenticate'}</button>
                 </form>
                 <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="mt-8 text-[9px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest">
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
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-700 flex flex-col p-8 md:p-12">
            <div className="flex items-center justify-between mb-16">
               <div className="flex flex-col">
                 <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Your Selection</h2>
                 <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.3em] mt-2">Active Buffer</p>
               </div>
               <button onClick={() => setIsCartOpen(false)} className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full flex items-center justify-center transition-all shadow-sm"><X size={26} /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-10 scrollbar-hide">
               {cart.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-300 mb-8"><ShoppingCart size={40} /></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">No items in buffer.</p>
                 </div>
               ) : (
                 cart.map(item => (
                   <div key={item.id} className="group relative">
                      <div className="flex gap-8">
                         <div className="w-28 h-28 rounded-[2rem] bg-[#F9FAFB] overflow-hidden shrink-0 border border-slate-50 p-4 transition-all group-hover:scale-105">
                           <img src={item.image_url} className="w-full h-full object-contain" />
                         </div>
                         <div className="flex-1 py-2">
                           <div className="flex justify-between items-start gap-4 mb-4">
                             <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight leading-none">{item.name}</h4>
                             <button onClick={() => removeFromCart(item.id)} className="text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                           </div>
                           <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center bg-slate-50 rounded-xl px-2 py-1 gap-4">
                                <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-400 hover:text-slate-900 transition-colors"><Minus size={14} /></button>
                                <span className="font-black text-xs min-w-[20px] text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-400 hover:text-slate-900 transition-colors"><Plus size={14} /></button>
                              </div>
                              <span className="font-black text-slate-900 text-sm">RM{(item.price * item.quantity).toLocaleString()}</span>
                           </div>
                         </div>
                      </div>
                   </div>
                 ))
               )}
            </div>
            {cart.length > 0 && (
              <div className="mt-auto pt-12 border-t border-slate-50">
                 <div className="flex items-center justify-between mb-10">
                    <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em]">Subtotal</span>
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">RM{cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                 </div>
                 <button onClick={() => setIsCheckoutOpen(true)} className="w-full py-6 bg-slate-900 text-white font-black rounded-3xl hover:bg-black transition-all shadow-2xl uppercase tracking-[0.3em] text-[10px]">Initialize Purchase</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xl" onClick={() => setIsCheckoutOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-white rounded-[3rem] md:rounded-[4rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500 p-8 md:p-16">
             <div className="flex justify-between items-center mb-12">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Finalize Transaction</h3>
                <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-300 hover:text-slate-900 transition-colors"><X size={26} /></button>
             </div>
             <form onSubmit={handleCheckout} className="space-y-8">
                <div className="grid grid-cols-1 gap-4">
                   <div className="bg-[#F9FAFB] p-6 rounded-3xl border border-transparent focus-within:border-slate-100 transition-all">
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Recipient Legal Name</label>
                      <input required className="w-full bg-transparent outline-none font-bold text-slate-900 text-sm" placeholder="John Doe" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} />
                   </div>
                   <div className="bg-[#F9FAFB] p-6 rounded-3xl border border-transparent focus-within:border-slate-100 transition-all">
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Communication Mail</label>
                      <input required type="email" className="w-full bg-transparent outline-none font-bold text-slate-900 text-sm" placeholder="john@example.com" value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} />
                   </div>
                </div>
                <div className="p-8 bg-[#F9FAFB] rounded-[2rem] border border-slate-50 flex items-center justify-between">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate Total</span>
                   <span className="text-2xl font-black text-slate-900 tracking-tighter">RM{cartTotal.toLocaleString()}</span>
                </div>
                <button disabled={checkoutLoading} className="w-full py-6 bg-slate-900 text-white font-black rounded-3xl hover:bg-black transition-all shadow-2xl uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-4">
                  {checkoutLoading ? <Loader2 size={20} className="animate-spin" /> : 'Confirm Order Authorization'}
                </button>
             </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl" onClick={() => setOrderSuccess(null)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[3rem] md:rounded-[4.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-700 p-12 md:p-20 text-center">
             <div className="w-24 h-24 md:w-28 md:h-28 bg-[#C5FF41] text-slate-900 rounded-full flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-lime-400/20">
               <CheckCircle size={64} strokeWidth={1} />
             </div>
             <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 tracking-tighter uppercase leading-none">Transmission <br /> Successful.</h3>
             <button onClick={() => setOrderSuccess(null)} className="w-full py-6 bg-slate-900 text-white font-black rounded-3xl hover:bg-black transition-all shadow-2xl uppercase tracking-[0.3em] text-[10px]">Return to Node</button>
          </div>
        </div>
      )}

      {/* Editorial Footer */}
      <footer className="bg-[#F9FAFB] px-4 md:px-10 pt-24 pb-12 border-t border-slate-100">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-24 mb-20 md:mb-40">
             <div className="lg:col-span-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-8">
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">M</div>
                  <span className="text-xl font-black tracking-tighter uppercase">Meadow IT</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9] mb-8">
                  Engineer your <br /> ultimate environment.
                </h2>
             </div>
             <div className="text-center md:text-left">
                <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 mb-6">Navigation</h4>
                <ul className="space-y-3">
                   <li><a href="#" className="text-[11px] font-bold text-slate-500 hover:text-slate-900 transition-colors">The Terminal</a></li>
                   <li><Link to="/stores" className="text-[11px] font-bold text-slate-500 hover:text-slate-900 transition-colors">Store Locator</Link></li>
                </ul>
             </div>
             <div className="text-center md:text-left">
                <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 mb-6">Resources</h4>
                <ul className="space-y-3">
                   <li><a href="#" className="text-[11px] font-bold text-slate-500 hover:text-slate-900 transition-colors">Asset Protocol</a></li>
                   <li><a href="#" className="text-[11px] font-bold text-slate-500 hover:text-slate-900 transition-colors">Technical Support</a></li>
                </ul>
             </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-slate-200/50">
             <p className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-300 text-center">© {new Date().getFullYear()} Meadow Integrated Technologies</p>
             <p className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-300 italic">Core Operational Status: Nominal</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
