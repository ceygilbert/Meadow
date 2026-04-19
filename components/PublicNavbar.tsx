
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  User as UserIcon, 
  ShoppingCart, 
  Zap, 
  ChevronRight,
  ArrowUpRight,
  Monitor,
  Cpu,
  Layers,
  MousePointer2,
  HardDrive,
  Wifi,
  Headphones,
  Smartphone,
  Home as HomeIcon,
  Gamepad2,
  Keyboard,
  Speaker,
  Laptop
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Category, SubCategory, Brand, Profile } from '../types';

interface PublicNavbarProps {
  user: any;
  profile: Profile | null;
  cartCount: number;
  onOpenAuth: () => void;
  onOpenCart: () => void;
  scrolled: boolean;
}

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/Red%20Full%20Logo.png";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'laptop': <Laptop size={20} />,
  'desktop': <Cpu size={20} />,
  'pc components': <Layers size={20} />,
  'peripherals': <MousePointer2 size={20} />,
  'display': <Monitor size={20} />,
  'storage': <HardDrive size={20} />,
  'networking': <Wifi size={20} />,
  'audio': <Headphones size={20} />,
  'gadgets': <Smartphone size={20} />,
  'home & office': <HomeIcon size={20} />,
  'smart home': <HomeIcon size={20} />,
  'console': <Gamepad2 size={20} />,
  'keyboard': <Keyboard size={20} />,
  'mouse': <MousePointer2 size={20} />,
  'speaker': <Speaker size={20} />,
};

const getIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  for (const key in CATEGORY_ICONS) {
    if (lowerName.includes(key)) return CATEGORY_ICONS[key];
  }
  return <Layers size={20} />;
};

const PublicNavbar: React.FC<PublicNavbarProps> = ({ 
  user, 
  profile, 
  cartCount, 
  onOpenAuth, 
  onOpenCart,
  scrolled 
}) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [activeMenu, setActiveMenu] = useState<'category' | 'brand' | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [headerSearch, setHeaderSearch] = useState('');
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menu: 'category' | 'brand') => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveMenu(null);
      setHoveredCategory(null);
    }, 500); // Increased to 500ms for better stability
    setCloseTimeout(timeout);
  };

  const handleMenuMouseEnter = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
  };

  useEffect(() => {
    fetchNavData();
  }, []);

  const fetchNavData = async () => {
    const [catRes, subRes, brandRes] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('subcategories').select('*').order('name'),
      supabase.from('brands').select('*').order('name')
    ]);

    if (catRes.data) {
      // Filter out Accessories and Gadget as requested
      const filteredCategories = catRes.data.filter(cat => {
        const name = cat.name.toLowerCase();
        return name !== 'accessories' && name !== 'gadget' && name !== 'gadgets';
      });
      setCategories(filteredCategories);
    }
    if (subRes.data) setSubCategories(subRes.data);
    if (brandRes.data) setBrands(brandRes.data);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(headerSearch.trim())}`);
      setActiveMenu(null);
    }
  };

  return (
    <>
      {/* Backdrop Blur Effect */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/20 backdrop-blur-md z-[90]"
            onClick={() => setActiveMenu(null)}
          />
        )}
      </AnimatePresence>

      <nav 
        className={`fixed left-0 right-0 z-[100] px-4 md:px-10 transition-all duration-500 top-0 pointer-events-none 
          ${scrolled ? 'py-3' : 'py-5'} 
          ${scrolled || activeMenu ? 'bg-white/95 backdrop-blur-2xl border-b border-slate-100 shadow-lg pointer-events-auto' : ''}`}
        onMouseEnter={handleMenuMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between pointer-events-auto">
          <Link to="/" className="flex items-center group">
            <img src={LOGO_URL} className={`w-auto object-contain transition-all duration-500 group-hover:scale-105 ${scrolled ? 'h-10 md:h-12' : 'h-24 md:h-36'}`} alt="Meadow" />
          </Link>

          <div className="hidden md:flex items-center bg-white/70 backdrop-blur-3xl border border-slate-100 rounded-full px-8 py-3 gap-6 md:gap-8 lg:gap-10 shadow-xl shadow-slate-200/10 transition-all hover:bg-white/95 group">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <Search size={18} className="absolute left-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                className="bg-slate-100/50 border-none rounded-full py-3 pl-14 pr-8 text-sm font-bold w-48 focus:w-64 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-slate-200"
              />
            </form>
            
            <div 
              className="relative py-2 group/trigger"
              onMouseEnter={() => handleMouseEnter('category')}
              onMouseLeave={handleMouseLeave}
            >
              <button className={`text-sm font-nav uppercase tracking-[0.25em] transition-all ${activeMenu === 'category' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}>
                Category
              </button>
              {/* Hover Bridge - Wider and taller for better hit area */}
              <div className="absolute top-full -left-4 -right-4 h-12 pointer-events-auto" />
            </div>

            <div 
              className="relative py-2 group/trigger"
              onMouseEnter={() => handleMouseEnter('brand')}
              onMouseLeave={handleMouseLeave}
            >
              <button className={`text-sm font-nav uppercase tracking-[0.25em] transition-all ${activeMenu === 'brand' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}>
                Brand
              </button>
              {/* Hover Bridge - Wider and taller for better hit area */}
              <div className="absolute top-full -left-4 -right-4 h-12 pointer-events-auto" />
            </div>

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
               <button onClick={onOpenAuth} className={`bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-xl hover:scale-105 ${scrolled ? 'w-12 h-12 md:w-14 md:h-14' : 'w-14 h-14 md:w-16 md:h-16'}`}>
                 <UserIcon size={scrolled ? 18 : 22} />
               </button>
            ) : (
               <button onClick={() => navigate(profile?.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard')} className={`rounded-full border border-slate-200 overflow-hidden shadow-sm transition-all ${scrolled ? 'w-10 h-10 md:w-12 md:h-12' : 'w-12 h-12 md:w-14 md:h-14'}`}>
                 <img src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} className="w-full h-full object-cover" />
               </button>
            )}
            <button onClick={onOpenCart} className={`bg-slate-900 text-white rounded-full flex items-center justify-center relative shadow-xl hover:scale-105 transition-all ${scrolled ? 'w-12 h-12 md:w-14 md:h-14' : 'w-14 h-14 md:w-16 md:h-16'}`}>
              <ShoppingCart size={scrolled ? 18 : 22} />
              {cartCount > 0 && <span className={`absolute -top-1 -right-1 bg-blue-500 text-white font-black flex items-center justify-center rounded-full border-2 border-white ${scrolled ? 'w-5 h-5 text-[8px]' : 'w-6 h-6 md:w-7 md:h-7 text-[10px] md:text-xs'}`}>{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute left-0 right-0 top-full bg-white/95 backdrop-blur-3xl border-b border-slate-100 shadow-2xl pointer-events-auto overflow-hidden"
              onMouseEnter={handleMenuMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="max-w-[1440px] mx-auto">
                {activeMenu === 'category' && (
                  <div className="max-w-[1440px] mx-auto p-12 grid grid-cols-12 gap-12">
                    {/* Categories List */}
                    <div className="col-span-4 border-r border-slate-100 pr-12">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Explore Categories</p>
                      <div className="space-y-2">
                        {categories.map((cat) => (
                          <div 
                            key={cat.id}
                            onMouseEnter={() => setHoveredCategory(cat.id)}
                            className={`group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${hoveredCategory === cat.id ? 'bg-slate-900 text-white' : 'hover:bg-slate-50 text-slate-600'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`${hoveredCategory === cat.id ? 'text-blue-400' : 'text-slate-400'}`}>
                                {getIcon(cat.name)}
                              </div>
                              <span className="text-xs font-black uppercase tracking-tight">{cat.name}</span>
                            </div>
                            <ChevronRight size={14} className={`transition-transform ${hoveredCategory === cat.id ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                          </div>
                        ))}
                      </div>
                      <Link 
                        to="/categories" 
                        className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700"
                        onClick={() => setActiveMenu(null)}
                      >
                        View All Categories <ArrowUpRight size={14} />
                      </Link>
                    </div>

                    {/* Subcategories / Items */}
                    <div className="col-span-5">
                      {hoveredCategory ? (
                        <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">
                            {categories.find(c => c.id === hoveredCategory)?.name} Sub-categories
                          </p>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            {subCategories
                              .filter(sub => sub.category_id === hoveredCategory)
                              .map(sub => (
                                <Link
                                  key={sub.id}
                                  to={`/products?category=${categories.find(c => c.id === hoveredCategory)?.slug}&subcategory=${sub.slug}`}
                                  className="group flex flex-col gap-0.5"
                                  onClick={() => setActiveMenu(null)}
                                >
                                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{sub.name}</span>
                                  <span className="text-[8px] text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Shop Now</span>
                                </Link>
                              ))}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-300">
                          <Layers size={48} className="mb-4 opacity-20" />
                          <p className="text-sm font-bold uppercase tracking-widest">Hover a category to explore</p>
                        </div>
                      )}
                    </div>

                    {/* Featured / More Info */}
                    <div className="col-span-3 bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Featured Collections</p>
                      <div className="space-y-6">
                        <div className="group cursor-pointer">
                          <div className="aspect-video rounded-2xl overflow-hidden mb-3">
                            <img src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="New Arrivals" />
                          </div>
                          <h5 className="font-black text-slate-900 uppercase tracking-tight">New Arrivals 2026</h5>
                          <p className="text-xs text-slate-500">Discover the latest in high-performance hardware.</p>
                        </div>
                        <div className="group cursor-pointer">
                          <div className="aspect-video rounded-2xl overflow-hidden mb-3">
                            <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Gaming Setup" />
                          </div>
                          <h5 className="font-black text-slate-900 uppercase tracking-tight">Ultimate Gaming Setup</h5>
                          <p className="text-xs text-slate-500">Everything you need for the perfect battle station.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeMenu === 'brand' && (
                  <div className="flex h-full min-h-[500px]">
                    {/* Left Info Panel */}
                    <div className="w-1/4 p-12 pr-16 bg-slate-50/50 flex flex-col border-r border-slate-100">
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase mb-6">Brands</h2>
                      <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xs mb-10">
                        We will never stop exploring and expanding the brands we carry. Stay tuned with us for more exciting updates.
                      </p>
                      
                      <div className="mt-auto pt-10 border-t border-slate-100">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">Passion Driven</span>
                      </div>
                    </div>

                    {/* Right Scrollable Brand Grid */}
                    <div className="flex-1 p-12 relative flex flex-col bg-white">
                      <div className="flex-1 overflow-y-auto pr-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent h-[450px]">
                        <div className="grid grid-cols-4 gap-x-12 gap-y-0 text-slate-900">
                          {brands.map((brand, idx) => (
                            <React.Fragment key={brand.id}>
                              <Link 
                                to={`/products?brand=${brand.id}`}
                                className="group flex flex-col items-center gap-6 py-12"
                                onClick={() => setActiveMenu(null)}
                              >
                                <div className="w-full aspect-[3/2] flex items-center justify-center p-6 relative">
                                  <img 
                                    src={brand.logo_url || undefined} 
                                    className="max-w-full max-h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                                    alt={brand.name} 
                                  />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-900 transition-colors uppercase">{brand.name}</span>
                              </Link>
                              
                              {/* Horizontal Divider after every 4 items (row end) */}
                              {(idx + 1) % 4 === 0 && (
                                <div className="col-span-4 h-px bg-slate-100 my-4" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* Scroll Indicator */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 animate-bounce">
                        <ChevronRight className="rotate-90" size={12} />
                        Scroll down for more brands
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default PublicNavbar;
