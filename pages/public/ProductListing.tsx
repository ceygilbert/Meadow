
import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  Search, 
  Filter, 
  ChevronDown, 
  ArrowUpRight, 
  Loader2, 
  AlertCircle,
  ArrowLeft,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Star,
  Zap,
  User as UserIcon,
  Facebook,
  Instagram
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicNavbar from '../../components/PublicNavbar';
import { supabase } from '../../lib/supabase';
import { Product, Category, SubCategory, Brand, Profile } from '../../types';

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/Red%20Full%20Logo.png";

interface CartItem extends Product {
  quantity: number;
}

const ProductListing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const categorySlug = searchParams.get('category');
  const subcategorySlug = searchParams.get('subcategory');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedBrandId, setSelectedBrandId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name-asc' | 'newest'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Shared UI States
  const [isFullMenuOpen, setIsFullMenuOpen] = useState(false);
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
    fetchInitialData();
    checkUser();
    const savedCart = localStorage.getItem('meadow_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    
    // Update search query if it changes in URL
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) setSearchQuery(searchFromUrl);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [categorySlug, subcategorySlug]);

  useEffect(() => {
    localStorage.setItem('meadow_cart', JSON.stringify(cart));
  }, [cart]);

  const fetchInitialData = async () => {
    try {
      const [catRes, subRes, brandRes] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase.from('subcategories').select('*'),
        supabase.from('brands').select('*')
      ]);
      if (catRes.data) {
        setCategories(catRes.data.filter(cat => {
          const name = cat.name.toLowerCase();
          return name !== 'accessories' && name !== 'gadget' && name !== 'gadgets';
        }));
      }
      if (subRes.data) setSubCategories(subRes.data);
      if (brandRes.data) setBrands(brandRes.data);
    } catch (err) {
      console.error('Error fetching initial data:', err);
    }
  };

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) fetchProfile(session.user.id);
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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let selectStr = '*, categories!inner(*)';
      if (subcategorySlug) {
        selectStr += ', subcategories!inner(*)';
      } else {
        selectStr += ', subcategories(*)';
      }

      let query = supabase.from('products').select(selectStr);

      if (categorySlug) {
        query = query.eq('categories.slug', categorySlug);
      }
      if (subcategorySlug) {
        query = query.eq('subcategories.slug', subcategorySlug);
      }

      const { data, error: err } = await query;
      if (err) throw err;
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentCategory = categories.find(c => c.slug === categorySlug);
  const currentSubCategory = subCategories.find(s => s.slug === subcategorySlug);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (selectedBrandId !== 'all') {
      result = result.filter(p => p.brand_id === selectedBrandId);
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        break;
    }

    return result;
  }, [products, searchQuery, selectedBrandId, sortBy]);

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(headerSearch.trim())}`);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
        <Loader2 className="animate-spin text-slate-900" size={48} />
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Syncing Inventory...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      <PublicNavbar 
        user={user}
        profile={profile}
        cartCount={cart.length}
        onOpenAuth={() => navigate('/')} 
        onOpenCart={() => setIsCartOpen(true)}
        scrolled={scrolled}
      />

      <main className="pt-24 md:pt-32 pb-20 px-4 md:px-10 max-w-[1440px] mx-auto">
        {/* Breadcrumbs & Title */}
        <div className="mb-12">
          <div className="flex items-center gap-3 text-xs md:text-sm font-black uppercase tracking-[0.3em] text-slate-300 mb-6">
            <Link to="/categories" className="hover:text-slate-900 transition-colors">All Categories</Link>
            <ChevronDown className="-rotate-90" size={12} />
            <span className="text-slate-900">{currentCategory?.name}</span>
            {currentSubCategory && (
              <>
                <ChevronDown className="-rotate-90" size={12} />
                <span className="text-blue-500">{currentSubCategory.name}</span>
              </>
            )}
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            {currentSubCategory?.name || currentCategory?.name || 'All Products'}
          </h1>
        </div>

        {/* Main Content Layout (Sidebar + Products) */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Floating Sidebar (Left) */}
          <aside className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-32 space-y-6 z-10">
            {/* Search */}
            <div className="relative w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text" 
                placeholder="Search matrix..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-16 pl-16 pr-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
              />
            </div>

            {/* Filter Group */}
            <div className="p-6 md:p-8 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-6">
              
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-2">Category</h3>
                <div className="relative">
                  <select 
                    value={categorySlug || 'all'}
                    onChange={(e) => {
                      if (e.target.value === 'all') {
                        searchParams.delete('category');
                        searchParams.delete('subcategory');
                        navigate(`/products?${searchParams.toString()}`);
                      } else {
                        searchParams.set('category', e.target.value);
                        searchParams.delete('subcategory');
                        navigate(`/products?${searchParams.toString()}`);
                      }
                    }}
                    className="w-full h-14 pl-4 pr-10 bg-white border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none shadow-sm text-slate-700"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-2">Subcategory</h3>
                <div className="relative">
                  <select 
                    value={subcategorySlug || 'all'}
                    onChange={(e) => {
                      if (e.target.value === 'all') {
                        searchParams.delete('subcategory');
                        navigate(`/products?${searchParams.toString()}`);
                      } else {
                        searchParams.set('subcategory', e.target.value);
                        // Also auto-select parent category
                        const selectedSubCat = subCategories.find(s => s.slug === e.target.value);
                        if (selectedSubCat) {
                          const parentCat = categories.find(c => c.id === selectedSubCat.category_id);
                          if (parentCat) {
                            searchParams.set('category', parentCat.slug);
                          }
                        }
                        navigate(`/products?${searchParams.toString()}`);
                      }
                    }}
                    className="w-full h-14 pl-4 pr-10 bg-white border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none shadow-sm text-slate-700"
                  >
                    <option value="all">All Subcategories</option>
                    {(categorySlug && currentCategory 
                      ? subCategories.filter(s => s.category_id === currentCategory.id)
                      : subCategories
                    ).map(s => (
                      <option key={s.id} value={s.slug}>{s.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-2">Brand</h3>
                <div className="relative">
                  <select 
                    value={selectedBrandId}
                    onChange={(e) => setSelectedBrandId(e.target.value)}
                    className="w-full h-14 pl-4 pr-10 bg-white border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none shadow-sm text-slate-700"
                  >
                    <option value="all">All Brands</option>
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-2">Sort By</h3>
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full h-14 pl-4 pr-10 bg-white border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none shadow-sm text-slate-700"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A-Z</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

            </div>
          </aside>

          {/* Product Listing Area (Right) */}
          <div className="flex-1 w-full min-w-0">
            
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between pb-6 border-b border-slate-100">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Showing {filteredProducts.length} Items
              </span>

              <div className="flex items-center gap-4">
                <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-500' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-500' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8" : "flex flex-col gap-6"}>
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div 
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className={`group bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:border-blue-500/20 transition-all duration-500 ${viewMode === 'list' ? 'flex flex-row h-64' : 'flex flex-col'}`}
              >
                <Link to={`/product/${product.slug}`} className={`relative bg-slate-50 overflow-hidden ${viewMode === 'list' ? 'w-64 shrink-0' : 'aspect-square'}`}>
                  <img 
                    src={product.image_url || undefined} 
                    alt={product.name}
                    className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                  />
                  {product.discount_value > 0 && (
                    <div className="absolute top-6 left-6 px-4 py-2 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      {product.discount_type === 'percentage' ? `-${product.discount_value}%` : `OFF RM${product.discount_value}`}
                    </div>
                  )}
                </Link>

                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                      {brands.find(b => b.id === product.brand_id)?.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star size={10} className="text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-bold text-slate-400">4.8</span>
                    </div>
                  </div>
                  
                  <Link to={`/product/${product.slug}`} className="text-lg font-black text-slate-900 uppercase tracking-tight leading-tight mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                  </Link>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-300 font-bold line-through">
                        {product.discount_value > 0 && `RM${(product.price + (product.discount_type === 'fixed' ? product.discount_value : (product.price * product.discount_value / 100))).toLocaleString()}`}
                      </span>
                      <span className="text-xl font-black text-slate-900">
                        RM{product.price.toLocaleString()}
                      </span>
                    </div>
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-40 text-center opacity-30">
            <AlertCircle className="mx-auto mb-6" size={64} strokeWidth={1} />
            <h3 className="text-xl font-black uppercase tracking-[0.3em]">No Hardware Found</h3>
            <p className="text-xs font-bold uppercase tracking-widest mt-4">Adjust your search or filter parameters</p>
          </div>
        )}
        </div>
        </div>
      </main>

      {/* Cart Slider */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[1000] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/10 backdrop-blur-md" 
              onClick={() => setIsCartOpen(false)}
            ></motion.div>
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-10 md:p-14"
            >
              <div className="flex items-center justify-between mb-16">
                 <div className="flex flex-col">
                   <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Your Selection</h2>
                   <p className="text-xs text-slate-300 font-black uppercase tracking-[0.3em] mt-3">Active Buffer</p>
                 </div>
                 <button onClick={() => setIsCartOpen(false)} className="w-12 h-12 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full flex items-center justify-center transition-all"><X size={24} /></button>
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-[#F9FAFB] px-4 md:px-10 py-24 border-t border-slate-100">
        <div className="max-w-[1440px] mx-auto text-center">
           <img src={LOGO_URL} className="h-16 md:h-24 w-auto object-contain mx-auto opacity-30 mb-12" alt="Meadow" />
           
           <div className="flex items-center justify-center gap-6 mb-12">
             <a href="#" className="w-12 h-12 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
               <Facebook size={20} />
             </a>
             <a href="#" className="w-12 h-12 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
               <Instagram size={20} />
             </a>
             <a href="#" className="w-12 h-12 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
               <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                 <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47V18.77a6.738 6.738 0 0 1-6.76 6.76 6.738 6.738 0 0 1-6.76-6.76 6.738 6.738 0 0 1 6.76-6.76c.42-.02.84.03 1.25.12v4.03a2.71 2.71 0 0 0-1.25-.12 2.728 2.728 0 0 0-2.72 2.73 2.728 2.728 0 0 0 2.72 2.73 2.728 2.728 0 0 0 2.73-2.73V.02z"/>
               </svg>
             </a>
             <a href="#" className="w-12 h-12 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
               <img src="https://illuminatelabs.space/assets/xhs_logo.png" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" alt="Xiaohongshu" />
             </a>
           </div>

           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">© {new Date().getFullYear()} Meadow SDN BHD — ALL RIGHTS RESERVED</p>
        </div>
      </footer>
    </div>
  );
};

export default ProductListing;
