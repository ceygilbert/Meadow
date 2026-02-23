
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  ArrowUpRight, 
  Loader2, 
  AlertCircle,
  Plus,
  ChevronRight,
  Monitor,
  Cpu,
  Layers,
  MousePointer2,
  HardDrive,
  Wifi,
  Headphones,
  Smartphone,
  Home,
  Gamepad2,
  Laptop,
  Keyboard,
  Speaker,
  Database,
  Search,
  ArrowLeft
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Category, SubCategory, Profile, Product } from '../../types';

type MenuMode = 'all' | 'story' | 'contact' | 'products';
const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/Red%20Full%20Logo.png";

interface CartItem extends Product {
  quantity: number;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'laptop': <Laptop size={24} />,
  'desktop': <Cpu size={24} />,
  'pc components': <Layers size={24} />,
  'peripherals': <MousePointer2 size={24} />,
  'display': <Monitor size={24} />,
  'storage': <Database size={24} />,
  'networking': <Wifi size={24} />,
  'audio': <Headphones size={24} />,
  'gadgets': <Smartphone size={24} />,
  'home & office': <Home size={24} />,
  'smart home': <Home size={24} />,
  'console': <Gamepad2 size={24} />,
  'keyboard': <Keyboard size={24} />,
  'mouse': <MousePointer2 size={24} />,
  'speaker': <Speaker size={24} />,
  'hard drive': <HardDrive size={24} />
};

const getIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  for (const key in CATEGORY_ICONS) {
    if (lowerName.includes(key)) return CATEGORY_ICONS[key];
  }
  return <Layers size={24} />; // Default icon
};

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Shared UI States
  const [isFullMenuOpen, setIsFullMenuOpen] = useState(false);
  const [menuMode, setMenuMode] = useState<MenuMode>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

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
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
    if (session?.user) fetchProfile(session.user.id);
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setProfile(data);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, subRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('subcategories').select('*').order('name')
      ]);

      if (catRes.error) throw catRes.error;
      if (subRes.error) throw subRes.error;

      setCategories(catRes.data || []);
      setSubCategories(subRes.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Indexing Categories...</p>
      </div>
    );
  }

  const selectedCatSubcategories = selectedCategory 
    ? subCategories.filter(s => s.category_id === selectedCategory.id)
    : [];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* Full-Screen Navigation Menu Overlay */}
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
                   <Link to="/" onClick={() => setIsFullMenuOpen(false)} className="group flex items-center gap-6">
                      <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-slate-900">Home</span>
                      <ArrowUpRight className="text-slate-200 group-hover:text-slate-900 transition-colors" size={32} />
                   </Link>
                   <Link to="/customised" onClick={() => setIsFullMenuOpen(false)} className="group flex items-center gap-6">
                      <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-slate-900">Bespoke</span>
                      <ArrowUpRight className="text-slate-200 group-hover:text-slate-900 transition-colors" size={32} />
                   </Link>
                   <Link to="/stores" onClick={() => setIsFullMenuOpen(false)} className="group flex items-center gap-6">
                      <span className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-slate-900">Stores</span>
                      <ArrowUpRight className="text-slate-200 group-hover:text-slate-900 transition-colors" size={32} />
                   </Link>
                </nav>
             </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <nav className="fixed top-4 md:top-6 left-0 right-0 z-[100] px-4 md:px-10 pointer-events-none">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center pointer-events-auto group">
            <img src={LOGO_URL} className="h-20 md:h-32 w-auto object-contain transition-transform group-hover:scale-105" alt="Meadow" />
          </Link>
          <div className="flex items-center gap-3 md:gap-6 pointer-events-auto">
            <button onClick={() => openMenu('all')} className="w-14 h-14 md:w-16 md:h-16 bg-white border border-slate-100 text-slate-900 rounded-full flex items-center justify-center shadow-lg">
              <Menu size={20} />
            </button>
            <button onClick={() => setIsCartOpen(true)} className="w-14 h-14 md:w-16 md:h-16 bg-slate-900 text-white rounded-full flex items-center justify-center relative shadow-xl hover:scale-105 transition-all">
              <ShoppingCart size={22} />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 w-6 h-6 md:w-7 md:h-7 bg-blue-500 text-white text-[10px] md:text-xs font-black flex items-center justify-center rounded-full border-2 border-white">{cart.length}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 md:pt-48 pb-20 px-4 md:px-10 max-w-[1440px] mx-auto">
        <div className="mb-12 md:mb-20 animate-in fade-in slide-in-from-bottom duration-700">
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9] mb-6">
            Hardware <br /> Categories.
          </h1>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">
            Browse our complete inventory matrix
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
          {categories.map((cat) => {
            const catSubcategories = subCategories.filter(s => s.category_id === cat.id);

            return (
              <div key={cat.id} className="group flex flex-col">
                <div 
                  onClick={() => setSelectedCategory(cat)}
                  className="aspect-[4/5] bg-slate-50 rounded-[3rem] overflow-hidden relative border border-slate-100 transition-all duration-700 cursor-pointer shadow-xl group-hover:shadow-2xl group-hover:scale-[1.02]"
                >
                  {cat.image_url ? (
                    <img 
                      src={cat.image_url} 
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-[10s] group-hover:scale-110" 
                      alt={cat.name} 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-200">
                      {getIcon(cat.name)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  
                  <div className="absolute top-8 left-8">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-white shadow-sm transition-all bg-white/10 backdrop-blur-xl border border-white/20 group-hover:bg-blue-600 group-hover:border-blue-500">
                      {getIcon(cat.name)}
                    </div>
                  </div>

                  <div className="absolute bottom-10 left-10 right-10 transition-all duration-500">
                    <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none mb-4 group-hover:translate-x-2 transition-transform">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">
                      {catSubcategories.length} Units Indexed
                    </p>
                  </div>

                  <div className="absolute top-8 right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
                    <Plus size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Subcategories Popup Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setSelectedCategory(null)}></div>
          
          <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-500 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-8 md:p-12 border-b border-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                  {getIcon(selectedCategory.name)}
                </div>
                <div>
                  <h2 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">
                    {selectedCategory.name}
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Select Hardware Deployment
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCategory(null)}
                className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full flex items-center justify-center transition-all"
              >
                <X size={28} />
              </button>
            </div>

            {/* Modal Body - Subcategory List */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-4 scrollbar-hide">
              {selectedCatSubcategories.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {selectedCatSubcategories.map((sub, idx) => (
                    <Link 
                      key={sub.id} 
                      to={`/products?category=${selectedCategory.slug}&subcategory=${sub.slug}`}
                      className="group/sub flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-slate-900 hover:border-slate-900 transition-all duration-500 animate-in fade-in slide-in-from-bottom"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover/sub:bg-blue-600 group-hover/sub:text-white transition-all shadow-sm">
                          <ChevronRight size={18} />
                        </div>
                        <div>
                          <span className="text-base md:text-lg font-black text-slate-900 group-hover/sub:text-white uppercase tracking-tight transition-colors">
                            {sub.name}
                          </span>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 group-hover/sub:text-slate-500">
                            View Hardware Matrix
                          </p>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 group-hover/sub:border-white/20 group-hover/sub:text-white transition-all">
                        <ArrowUpRight size={18} />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center opacity-30">
                  <AlertCircle className="mx-auto mb-6" size={48} />
                  <p className="text-xs font-black uppercase tracking-[0.3em]">No sub-deployments found.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-8 md:p-10 bg-slate-50/50 border-t border-slate-50 shrink-0 text-center">
               <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Meadow IT — Core Inventory Protocol</p>
            </div>
          </div>
        </div>
      )}

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

      {/* Footer */}
      <footer className="bg-[#F9FAFB] px-4 md:px-10 py-24 border-t border-slate-100">
        <div className="max-w-[1440px] mx-auto text-center">
           <img src={LOGO_URL} className="h-16 md:h-24 w-auto object-contain mx-auto opacity-30 mb-12" alt="Meadow" />
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">© {new Date().getFullYear()} Meadow SDN BHD — ALL RIGHTS RESERVED</p>
        </div>
      </footer>
    </div>
  );
};

export default Categories;
