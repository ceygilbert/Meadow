import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  User as UserIcon, 
  ShoppingCart, 
  Zap, 
  ChevronRight,
  ChevronDown,
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
  Laptop,
  Menu,
  X,
  Sparkles,
  MapPin,
  Truck,
  Box,
  Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Category, SubCategory, Brand, Profile } from '../types';
import { useAuth } from '../lib/AuthContext';

interface PublicNavbarProps {
  user?: any;
  profile?: Profile | null;
  cartCount: number;
  onOpenAuth: () => void;
  onOpenCart: () => void;
  scrolled: boolean;
}

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/Red%20Full%20Logo.png";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'laptop': <Laptop size={18} />,
  'desktop': <Cpu size={18} />,
  'pc components': <Layers size={18} />,
  'peripherals': <MousePointer2 size={18} />,
  'display': <Monitor size={18} />,
  'storage': <HardDrive size={18} />,
  'networking': <Wifi size={18} />,
  'audio': <Headphones size={18} />,
  'gadgets': <Smartphone size={18} />,
  'home & office': <HomeIcon size={18} />,
  'smart home': <HomeIcon size={18} />,
  'console': <Gamepad2 size={18} />,
  'keyboard': <Keyboard size={18} />,
  'mouse': <MousePointer2 size={18} />,
  'speaker': <Speaker size={18} />,
};

const getIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  for (const key in CATEGORY_ICONS) {
    if (lowerName.includes(key)) return CATEGORY_ICONS[key];
  }
  return <Layers size={18} />;
};

const PublicNavbar: React.FC<PublicNavbarProps> = ({ 
  user: userProp, 
  profile: profileProp, 
  cartCount, 
  onOpenAuth, 
  onOpenCart,
  scrolled 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, profile: authProfile } = useAuth();
  
  const user = userProp || authUser;
  const profile = profileProp || authProfile;

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  
  // Desktop Mega Menu state
  const [activeMenu, setActiveMenu] = useState<'categories' | 'brands' | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [headerSearch, setHeaderSearch] = useState('');

  // Mobile navigation state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileActiveSection, setMobileActiveSection] = useState<'categories' | 'brands'>('categories');
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);

  // Close menus on route change
  useEffect(() => {
    setActiveMenu(null);
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  // Prevent background scroll when mobile menu is full open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleDesktopMenu = (menu: 'categories' | 'brands') => {
    setActiveMenu(prev => prev === menu ? null : menu);
    if (activeMenu === menu) setHoveredCategory(null);
  };

  const openMobileSection = (section: 'categories' | 'brands') => {
    setMobileActiveSection(section);
    setMobileMenuOpen(true);
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
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Backdrop Blur Effect */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="hidden md:block fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[90]"
            onClick={() => setActiveMenu(null)}
          />
        )}
      </AnimatePresence>

      <nav 
        className={`fixed left-0 right-0 z-[100] transition-all duration-300 top-0 
          ${scrolled ? 'py-2 md:py-3 bg-white/95 backdrop-blur-2xl border-b border-slate-100 shadow-md' : 'py-3 md:py-5 bg-white/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-b md:border-b-0 border-slate-100 md:border-transparent'} 
          ${activeMenu ? 'bg-white/95 backdrop-blur-2xl border-b border-slate-100 shadow-lg' : ''}`}
      >
        <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 md:px-10">
          
          {/* Main Top Row */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Logo */}
            <Link to="/" className="flex items-center group shrink-0">
              <img 
                src={LOGO_URL} 
                className={`w-auto object-contain transition-all duration-300 group-hover:scale-105 
                  ${scrolled ? 'h-7 sm:h-9 md:h-11' : 'h-8 sm:h-10 md:h-24 lg:h-32'}`} 
                alt="Meadow Computer" 
              />
            </Link>

            {/* Desktop Center Pill Bar */}
            <div className="hidden md:flex items-center bg-white/70 backdrop-blur-3xl border border-slate-100 rounded-full px-6 lg:px-8 py-2.5 lg:py-3 gap-6 lg:gap-8 shadow-xl shadow-slate-200/10 transition-all hover:bg-white/95 group">
              <form onSubmit={handleSearch} className="relative flex items-center">
                <Search size={18} className="absolute left-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={headerSearch}
                  onChange={(e) => setHeaderSearch(e.target.value)}
                  className="bg-slate-100/60 border-none rounded-full py-2.5 pl-12 pr-6 text-sm font-semibold w-40 lg:w-56 focus:w-64 transition-all outline-none focus:bg-white focus:ring-1 focus:ring-slate-300"
                />
              </form>
              
              <div className="relative py-1 group/trigger">
                <button 
                  onClick={() => toggleDesktopMenu('categories')}
                  className={`text-xs lg:text-sm font-nav uppercase tracking-[0.2em] transition-all flex items-center gap-1 ${activeMenu === 'categories' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Categories
                  <ChevronDown size={14} className={`transition-transform duration-200 ${activeMenu === 'categories' ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                </button>
              </div>

              <div className="relative py-1 group/trigger">
                <button 
                  onClick={() => toggleDesktopMenu('brands')}
                  className={`text-xs lg:text-sm font-nav uppercase tracking-[0.2em] transition-all flex items-center gap-1 ${activeMenu === 'brands' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Brands
                  <ChevronDown size={14} className={`transition-transform duration-200 ${activeMenu === 'brands' ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                </button>
              </div>

              <Link 
                to="#" 
                onClick={(e) => e.preventDefault()}
                className="px-5 lg:px-7 py-3 bg-slate-900 text-white text-[11px] lg:text-xs font-nav uppercase tracking-[0.25em] rounded-full hover:bg-slate-700 transition-all shadow-md shadow-slate-900/20 flex items-center gap-2 shrink-0 opacity-50 cursor-not-allowed pointer-events-none"
              >
                <Zap size={16} className="text-rose-400" />
                Build Your Own PC
              </Link>
            </div>

            {/* Right Action Cluster (Both Mobile & Desktop) */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
              
              {/* Mobile Search Toggle Button */}
              <button 
                onClick={() => {
                  setMobileSearchVisible(prev => !prev);
                  setMobileMenuOpen(false);
                }}
                className={`md:hidden flex items-center justify-center rounded-full transition-all border ${
                  mobileSearchVisible 
                    ? 'bg-slate-900 text-white border-slate-900' 
                    : 'bg-white/90 text-slate-700 border-slate-200 hover:bg-slate-50'
                } w-9 h-9 sm:w-10 sm:h-10 shadow-sm`}
                aria-label="Toggle search"
              >
                <Search size={17} />
              </button>

              {/* User / Profile Icon */}
              {!user ? (
                <button 
                  onClick={onOpenAuth} 
                  className="bg-slate-100/90 text-slate-600 rounded-full flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 hover:scale-105"
                  aria-label="Sign in"
                >
                  <UserIcon size={18} />
                </button>
              ) : (
                <button 
                  onClick={() => navigate(profile?.role === 'admin' ? '/admin/dashboard' : '/customer/dashboard')} 
                  className="rounded-full border border-slate-200 overflow-hidden shadow-sm transition-all w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 hover:scale-105"
                  aria-label="View account"
                >
                  <img 
                    src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} 
                    className="w-full h-full object-cover" 
                    alt="Profile"
                  />
                </button>
              )}

              {/* Cart Button */}
              <button 
                onClick={onOpenCart} 
                className="bg-slate-900 text-white rounded-full flex items-center justify-center relative shadow-md hover:bg-slate-800 transition-all w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 hover:scale-105"
                aria-label="View cart"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#c5161d] text-white font-black flex items-center justify-center rounded-full border-2 border-white w-5 h-5 text-[9px] shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Menu Toggle */}
              <button 
                onClick={() => {
                  setMobileMenuOpen(prev => !prev);
                  setMobileSearchVisible(false);
                }}
                className={`md:hidden flex items-center justify-center rounded-full transition-all border ${
                  mobileMenuOpen 
                    ? 'bg-slate-900 text-white border-slate-900' 
                    : 'bg-white/90 text-slate-800 border-slate-200 hover:bg-slate-100'
                } w-9 h-9 sm:w-10 sm:h-10 shadow-sm`}
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>

            </div>
          </div>

          {/* EXPANDABLE MOBILE SEARCH BAR (Only shown when search icon is clicked) */}
          <AnimatePresence>
            {mobileSearchVisible && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden mt-2 pt-2 pb-1 border-t border-slate-100"
              >
                <form 
                  onSubmit={handleSearch}
                  className="relative flex items-center"
                >
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    autoFocus
                    placeholder="Search products, brands, parts..." 
                    value={headerSearch}
                    onChange={(e) => setHeaderSearch(e.target.value)}
                    className="w-full bg-slate-100/90 border border-slate-200 rounded-full py-2.5 pl-10 pr-20 text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-slate-400 transition-all shadow-inner"
                  />
                  <div className="absolute right-2 flex items-center gap-1">
                    {headerSearch && (
                      <button 
                        type="button" 
                        onClick={() => setHeaderSearch('')}
                        className="text-slate-400 hover:text-slate-600 p-1"
                        aria-label="Clear search"
                      >
                        <X size={14} />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-full hover:bg-slate-800 transition-colors"
                    >
                      Go
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* ========================================================================= */}
        {/* MOBILE NAVIGATION MENU (Only shown when hamburger button is clicked) */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden fixed inset-x-0 top-[100%] max-h-[85vh] bg-white border-b border-slate-200 shadow-2xl flex flex-col overflow-hidden z-[105]"
            >
              {/* Header Action Items in Drawer */}
              <div className="p-3.5 bg-slate-50/90 border-b border-slate-100 space-y-2 shrink-0">
                {/* Build Your Own PC Feature Card */}
                <Link 
                  to="#" 
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900 text-white shadow-md transition-transform group opacity-50 cursor-not-allowed pointer-events-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                      <Zap size={18} className="fill-rose-400 text-rose-400" />
                    </div>
                    <div>
                      <div className="text-xs font-black tracking-tight flex items-center gap-1.5">
                        Build Your Own PC
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-500 text-white tracking-wider">Custom</span>
                      </div>
                      <div className="text-[10px] text-slate-300">Compatibility checker & live pricing</div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-white transition-colors" />
                </Link>

                {/* Categories / Brands Switcher */}
                <div className="pt-0.5 flex items-center gap-2">
                  <button 
                    onClick={() => setMobileActiveSection('categories')}
                    className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 border ${
                      mobileActiveSection === 'categories' 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Layers size={14} className={mobileActiveSection === 'categories' ? 'text-blue-400' : 'text-slate-400'} />
                    Categories ({categories.length})
                  </button>
                  <button 
                    onClick={() => setMobileActiveSection('brands')}
                    className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 border ${
                      mobileActiveSection === 'brands' 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles size={14} className={mobileActiveSection === 'brands' ? 'text-amber-400' : 'text-slate-400'} />
                    Brands ({brands.length})
                  </button>
                </div>
              </div>

              {/* Scrollable Drawer Content: Categories & Brands Only */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {/* --- CATEGORIES ACCORDION --- */}
                {mobileActiveSection === 'categories' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-1 text-xs">
                      <span className="font-extrabold uppercase tracking-wider text-slate-400 text-[10px]">
                        Hardware Categories
                      </span>
                      <Link 
                        to="/categories" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                      >
                        View All <ChevronRight size={12} />
                      </Link>
                    </div>

                    {categories.map((cat) => {
                      const catSubs = subCategories.filter(s => s.category_id === cat.id);
                      const isExpanded = mobileExpandedCat === cat.id;

                      return (
                        <div key={cat.id} className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-xs">
                          <div 
                            onClick={() => setMobileExpandedCat(isExpanded ? null : cat.id)}
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-slate-500">
                                {getIcon(cat.name)}
                              </div>
                              <span className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                                {cat.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                {catSubs.length}
                              </span>
                              <ChevronDown size={14} className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>
                          </div>

                          {/* Subcategories Dropdown */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-slate-50/70 border-t border-slate-100 p-2.5 space-y-1"
                              >
                                <Link 
                                  to={`/products?category=${cat.slug}`}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block py-1.5 px-3 rounded-lg text-xs font-extrabold text-blue-600 hover:bg-blue-50 transition-colors"
                                >
                                  Browse All {cat.name} →
                                </Link>
                                {catSubs.map(sub => (
                                  <Link
                                    key={sub.id}
                                    to={`/products?category=${cat.slug}&subcategory=${sub.slug}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-between py-1.5 px-3 rounded-lg text-xs font-medium text-slate-700 hover:bg-white hover:text-slate-900 transition-colors"
                                  >
                                    <span>{sub.name}</span>
                                    <ChevronRight size={12} className="text-slate-300" />
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* --- BRANDS DIRECTORY --- */}
                {mobileActiveSection === 'brands' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-1 text-xs">
                      <span className="font-extrabold uppercase tracking-wider text-slate-400 text-[10px]">
                        Official Authorized Brands ({brands.length})
                      </span>
                      <Link 
                        to="/brands" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                      >
                        All Brands <ChevronRight size={12} />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {brands.map(brand => (
                        <Link 
                          key={brand.id}
                          to={`/products?brand=${brand.id}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-slate-400 transition-all shadow-xs"
                        >
                          <div className="h-10 w-full flex items-center justify-center">
                            {brand.logo_url ? (
                              <img 
                                src={brand.logo_url} 
                                alt={brand.name} 
                                className="max-h-full max-w-full object-contain" 
                              />
                            ) : (
                              <span className="text-xs font-black uppercase text-slate-400">{brand.name}</span>
                            )}
                          </div>
                          <span className="text-[11px] font-bold text-slate-700 truncate w-full text-center">
                            {brand.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Drawer Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold shrink-0">
                <span>Meadow Computer</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-600 font-bold hover:underline"
                >
                  Close Menu
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================================= */}
        {/* DESKTOP MEGA MENU DROPDOWN */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="hidden md:block absolute left-0 right-0 top-full bg-white/95 backdrop-blur-3xl border-b border-slate-100 shadow-2xl pointer-events-auto overflow-hidden"
            >
              <div className="max-w-[1440px] mx-auto">
                {activeMenu === 'categories' && (
                  <div className="max-w-[1440px] mx-auto p-10 lg:p-12 grid grid-cols-12 gap-10 lg:gap-12">
                    {/* Categories List */}
                    <div className="col-span-4 border-r border-slate-100 pr-8 lg:pr-12">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Explore Categories</p>
                      <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-2">
                        {categories.map((cat) => (
                          <div 
                            key={cat.id}
                            onClick={() => setHoveredCategory(prev => prev === cat.id ? null : cat.id)}
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
                        className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700"
                        onClick={() => setActiveMenu(null)}
                      >
                        View All Categories <ArrowUpRight size={14} />
                      </Link>
                    </div>

                    {/* Subcategories / Items */}
                    <div className="col-span-5">
                      {hoveredCategory ? (
                        <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">
                            {categories.find(c => c.id === hoveredCategory)?.name} Sub-categories
                          </p>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
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
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-300 py-16">
                          <Layers size={48} className="mb-4 opacity-20" />
                          <p className="text-sm font-bold uppercase tracking-widest">Hover a category to explore</p>
                        </div>
                      )}
                    </div>

                    {/* Featured / More Info */}
                    <div className="col-span-3 bg-slate-50/60 rounded-[2rem] p-6 lg:p-8 border border-slate-100">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-5">Featured Collections</p>
                      <div className="space-y-5">
                        <Link 
                          to="#"
                          onClick={(e) => e.preventDefault()}
                          className="group block cursor-not-allowed opacity-50 pointer-events-none"
                        >
                          <div className="aspect-video rounded-2xl overflow-hidden mb-2.5 bg-slate-900 relative">
                            <img src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" alt="PC Builder" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex items-end p-3">
                              <span className="text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                                <Zap size={14} className="text-rose-400" /> Build Your Own PC
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500">Interactive PC parts configurator with real-time compatibility.</p>
                        </Link>
                        <Link 
                          to="/products"
                          onClick={() => setActiveMenu(null)}
                          className="group block cursor-pointer"
                        >
                          <div className="aspect-video rounded-2xl overflow-hidden mb-2.5 bg-slate-100">
                            <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Gaming Setup" />
                          </div>
                          <h5 className="font-black text-slate-900 uppercase tracking-tight text-xs">Battle Station Gears</h5>
                          <p className="text-[11px] text-slate-500">Monitors, mechanical keyboards & peripherals.</p>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {activeMenu === 'brands' && (
                  <div className="flex max-h-[65vh]">
                    {/* Left Info Panel */}
                    <div className="w-1/4 p-8 lg:p-12 pr-12 lg:pr-16 bg-slate-50/50 flex flex-col border-r border-slate-100 overflow-y-auto">
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase mb-6 shrink-0">Brands</h2>
                      <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xs mb-10 shrink-0">
                        We partner directly with leading worldwide hardware and component manufacturers.
                      </p>
                      
                      <div className="mt-auto pt-8 border-t border-slate-100 shrink-0">
                        <Link 
                          to="/brands"
                          onClick={() => setActiveMenu(null)}
                          className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          View All Brands Directory <ArrowUpRight size={14} />
                        </Link>
                      </div>
                    </div>

                    {/* Right Scrollable Brand Grid */}
                    <div className="flex-1 p-8 lg:p-12 relative flex flex-col bg-white min-h-0">
                      <div className="flex-1 overflow-y-auto pr-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        <div className="grid grid-cols-4 gap-x-8 lg:gap-x-12 text-slate-900">
                          {brands.map((brand, idx) => (
                            <React.Fragment key={brand.id}>
                              <Link 
                                to={`/products?brand=${brand.id}`}
                                className="group flex flex-col items-center gap-4 py-6 lg:py-8"
                                onClick={() => setActiveMenu(null)}
                              >
                                <div className="w-full h-14 lg:h-16 flex items-center justify-center relative">
                                  <img 
                                    src={brand.logo_url || undefined} 
                                    className="max-w-full max-h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                                    alt={brand.name} 
                                  />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-900 text-center">{brand.name}</span>
                              </Link>
                              
                              {(idx + 1) % 4 === 0 && (
                                <div className="col-span-4 h-px bg-slate-100 my-1" />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
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
