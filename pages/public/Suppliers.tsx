import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronDown,
  ArrowUpRight, 
  Loader2, 
  AlertCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Package,
  Layers,
  ArrowRight,
  ExternalLink,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PublicNavbar from '../../components/PublicNavbar';
import Breadcrumbs from '../../components/Breadcrumbs';
import Footer from '../../components/Footer';
import { supabase } from '../../lib/supabase';
import { Product, Category, Brand, Profile } from '../../types';
import { useAuth } from '../../lib/AuthContext';
import { useSupplierConfig } from '../../lib/supplierConfig';

interface CartItem extends Product {
  quantity: number;
}

const SuppliersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { config } = useSupplierConfig();

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cart states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartToast, setCartToast] = useState<string | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Load local cart
    try {
      const savedCart = localStorage.getItem('meadow_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (e) {
      console.warn('Failed to load cart from storage:', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('meadow_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodsRes, catsRes, brandsRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*'),
        supabase.from('brands').select('*')
      ]);

      if (prodsRes.error) throw prodsRes.error;

      setProducts(prodsRes.data || []);
      if (catsRes.data) setCategories(catsRes.data);
      if (brandsRes.data) setBrands(brandsRes.data);
    } catch (err: any) {
      console.error('Error fetching supplier page data:', err);
      setError(err.message || 'Failed to load supplier products');
    } finally {
      setLoading(false);
    }
  };

  const showCartToast = (productName: string) => {
    setCartToast(`Added "${productName}" to cart`);
    setTimeout(() => setCartToast(null), 3000);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showCartToast(product.name);
    setIsCartOpen(true);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const removeCartItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      let finalPrice = item.price;
      if (item.discount_type === 'percentage') {
        finalPrice = item.price * (1 - item.discount_value / 100);
      } else if (item.discount_type === 'fixed') {
        finalPrice = Math.max(0, item.price - item.discount_value);
      }
      return acc + (finalPrice * item.quantity);
    }, 0);
  }, [cart]);

  // Resolve products selected for the Supplier Page
  const displayedProducts = useMemo(() => {
    const selectedIds = config.selectedProductIds || [];
    
    // If admin has selected specific products, prioritize those in the order specified
    let baseList: Product[] = [];
    if (selectedIds.length > 0) {
      const productMap = new Map<string, Product>();
      products.forEach(p => productMap.set(p.id, p));
      
      selectedIds.forEach(id => {
        const item = productMap.get(id);
        if (item) baseList.push(item);
      });
    } else {
      // When NO products are selected in the admin supplier page module, do NOT show any products
      baseList = [];
    }

    // Apply client filters
    return baseList.filter(p => {
      const matchesSearch = searchQuery === '' || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.slug && p.slug.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'all' || p.category_id === selectedCategory;
      const matchesBrand = selectedBrand === 'all' || p.brand_id === selectedBrand;

      return matchesSearch && matchesCat && matchesBrand;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0; // 'featured' retains the curated order set in admin
    });
  }, [products, config.selectedProductIds, searchQuery, selectedCategory, selectedBrand, sortBy]);

  const categoriesMap = useMemo(() => new Map(categories.map(c => [c.id, c.name])), [categories]);
  const brandsMap = useMemo(() => new Map(brands.map(b => [b.id, b.name])), [brands]);

  const calculateFinalPrice = (p: Product) => {
    if (p.discount_type === 'percentage') {
      return p.price * (1 - p.discount_value / 100);
    }
    if (p.discount_type === 'fixed') {
      return Math.max(0, p.price - p.discount_value);
    }
    return p.price;
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-[#c5161d] selection:text-white overflow-x-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {cartToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800 text-xs font-bold"
          >
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{cartToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navbar */}
      <PublicNavbar 
        user={user}
        profile={profile}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenAuth={() => navigate('/customer/login')}
        onOpenCart={() => setIsCartOpen(true)}
        scrolled={scrolled}
      />

      {/* Breadcrumbs */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 pt-28 pb-4">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Suppliers' }]} />
      </div>

      {/* ==================================================== */}
      {/* TOP BANNER (EDITABLE VIA ADMIN PANEL)                */}
      {/* ==================================================== */}
      {(() => {
        const bannerHeight = config.bannerHeight ?? 680;
        const imageFit = config.bannerImageFit ?? 'cover';

        return (
          <section className="max-w-[1440px] mx-auto px-4 md:px-10 mb-12">
            <div 
              className="relative rounded-3xl overflow-hidden flex items-center shadow-xl border border-slate-200/60 group w-full bg-slate-950 transition-all duration-300"
              style={{ minHeight: `clamp(380px, 55vw, ${bannerHeight}px)` }}
            >
              {/* Blurred Ambient Backdrop for Contain Mode */}
              {imageFit === 'contain' && (
                <div 
                  className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110 pointer-events-none"
                  style={{ backgroundImage: `url(${config.bannerImageUrl || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=80"})` }}
                />
              )}

              {/* Background Image */}
              <img 
                src={config.bannerImageUrl || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=80"} 
                alt={config.bannerTitle?.trim() || "Supplier Banner"} 
                className={`absolute inset-0 w-full h-full object-center transition-transform duration-1000 ease-out ${
                  imageFit === 'contain' ? 'object-contain' : 'object-cover group-hover:scale-105'
                }`}
              />

              {/* Dynamic Overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/40"
                style={{ opacity: (config.bannerOverlayOpacity ?? 65) / 100 }}
              />

              {/* Banner Content: Strictly only render elements that have text */}
              {(config.bannerBadge?.trim() || config.bannerTitle?.trim() || config.bannerSubtitle?.trim() || config.bannerButtonText?.trim()) && (
                <div className="relative z-10 p-8 md:p-16 max-w-3xl text-white">
                  {config.bannerBadge?.trim() && (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-black uppercase tracking-widest text-white mb-6">
                      <ShieldCheck size={14} className="text-[#ff4d55]" />
                      <span>{config.bannerBadge.trim()}</span>
                    </div>
                  )}

                  {config.bannerTitle?.trim() && (
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.08] mb-6">
                      {config.bannerTitle.trim()}
                    </h1>
                  )}

                  {config.bannerSubtitle?.trim() && (
                    <p className="text-sm md:text-base text-white/80 font-medium leading-relaxed max-w-2xl mb-8">
                      {config.bannerSubtitle.trim()}
                    </p>
                  )}

                  {config.bannerButtonText?.trim() && (
                    <div className="flex flex-wrap items-center gap-4">
                      <a
                        href={config.bannerButtonLink?.trim() || "#supplier-products"}
                        className="px-8 py-4 bg-[#c5161d] hover:bg-[#a81318] active:bg-[#991217] text-white rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-red-900/30 flex items-center gap-2 cursor-pointer"
                      >
                        <span>{config.bannerButtonText.trim()}</span>
                        <ArrowRight size={15} />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        );
      })()}

      {/* ==================================================== */}
      {/* PRODUCTS SECTION (SHOWCASE FROM ADMIN SELECTION)    */}
      {/* ==================================================== */}
      <section id="supplier-products" className="max-w-[1440px] mx-auto px-4 md:px-10 py-12">
        {/* Section Header */}
        {(config.sectionBadge?.trim() || config.sectionTitle?.trim() || config.sectionDescription?.trim() || displayedProducts.length > 0) && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            {(config.sectionBadge?.trim() || config.sectionTitle?.trim() || config.sectionDescription?.trim()) ? (
              <div>
                {config.sectionBadge?.trim() && (
                  <span className="px-3 py-1 bg-red-50 text-[#c5161d] text-[10px] font-black uppercase tracking-widest rounded-full border border-red-100 inline-block mb-3">
                    {config.sectionBadge.trim()}
                  </span>
                )}
                {config.sectionTitle?.trim() && (
                  <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-slate-900">
                    {config.sectionTitle.trim()}
                  </h2>
                )}
                {config.sectionDescription?.trim() && (
                  <p className="text-xs md:text-sm text-slate-500 font-medium max-w-2xl mt-2 leading-relaxed">
                    {config.sectionDescription.trim()}
                  </p>
                )}
              </div>
            ) : <div />}

            <div className="text-xs font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-xl shrink-0 self-start md:self-auto">
              Showing <span className="text-slate-900 font-black">{displayedProducts.length}</span> Verified Products
            </div>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-sm mb-8 flex flex-col lg:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="relative w-full lg:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by product name, model, or specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#c5161d] focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="w-full lg:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#c5161d] cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="w-full lg:w-44">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#c5161d] cursor-pointer"
            >
              <option value="all">All Brands</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="w-full lg:w-44">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#c5161d] cursor-pointer"
            >
              <option value="featured">Curated Order</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical</option>
            </select>
          </div>

          {(searchQuery || selectedCategory !== 'all' || selectedBrand !== 'all' || sortBy !== 'featured') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedBrand('all');
                setSortBy('featured');
              }}
              className="px-3.5 py-2.5 text-xs font-bold text-slate-500 hover:text-[#c5161d] transition-colors shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-28 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-[#c5161d]" size={40} />
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Supplier Products...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-center max-w-md mx-auto my-12">
            <AlertCircle size={32} className="text-rose-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900 mb-1">Failed to load supplier catalog</h3>
            <p className="text-xs text-slate-500 mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && displayedProducts.length === 0 && (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 max-w-xl mx-auto shadow-2xs">
            <Package size={48} className="text-slate-300 mx-auto mb-4" />
            
            {(config.selectedProductIds || []).length === 0 ? (
              <>
                <h3 className="text-base font-black uppercase tracking-wider text-slate-900 mb-2">
                  No Products Selected For Supplier Page
                </h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed max-w-md mx-auto">
                  No products have been selected in the backend supplier module yet. Pick products in the Admin Panel to feature them on this page.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/admin/supplier"
                    className="px-6 py-2.5 bg-[#c5161d] hover:bg-[#a81318] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center gap-2"
                  >
                    <SlidersHorizontal size={14} />
                    <span>Select Products in Admin</span>
                  </Link>
                  <Link
                    to="/products"
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2"
                  >
                    <span>Browse All Products</span>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-base font-black uppercase tracking-wider text-slate-900 mb-2">
                  No matching supplier products found
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Try adjusting your search query or resetting filters to view the selected supplier products.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                  }}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Clear All Filters
                </button>
              </>
            )}
          </div>
        )}

        {/* Product Cards Grid */}
        {!loading && !error && displayedProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => {
              const categoryName = categoriesMap.get(product.category_id) || 'Hardware';
              const brandName = brandsMap.get(product.brand_id) || '';
              const finalPrice = calculateFinalPrice(product);
              const hasDiscount = product.discount_type !== 'none' && product.discount_value > 0;
              const isOutOfStock = product.stock <= 0;

              return (
                <div 
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Top / Image */}
                  <div className="relative bg-slate-50/80 p-6 flex items-center justify-center aspect-square overflow-hidden border-b border-slate-100">
                    {/* Badge */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
                      <span className="px-2.5 py-1 bg-white/95 backdrop-blur-xs text-[10px] font-black uppercase tracking-wider text-slate-900 rounded-md shadow-2xs border border-slate-200/60">
                        {categoryName}
                      </span>
                      {hasDiscount && (
                        <span className="px-2 py-0.5 bg-[#c5161d] text-white text-[9px] font-black uppercase tracking-wider rounded-md shadow-xs">
                          {product.discount_type === 'percentage' ? `-${product.discount_value}%` : `Save RM${product.discount_value}`}
                        </span>
                      )}
                    </div>

                    {/* Stock pill */}
                    <div className="absolute top-3 right-3 z-10">
                      {isOutOfStock ? (
                        <span className="px-2 py-1 bg-slate-200/90 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-md">
                          Out of Stock
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider rounded-md flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Supplier Stock
                        </span>
                      )}
                    </div>

                    <Link to={`/product/${product.slug}`} className="w-full h-full flex items-center justify-center">
                      <img 
                        src={product.image_url || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80"} 
                        alt={product.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </Link>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      {/* Brand */}
                      {brandName && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
                          {brandName}
                        </span>
                      )}

                      {/* Product Title */}
                      <Link to={`/product/${product.slug}`}>
                        <h3 className="text-xs font-black text-slate-900 group-hover:text-[#c5161d] transition-colors line-clamp-2 leading-snug mb-3">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Specs snippet if available */}
                      {product.specs && Object.keys(product.specs).length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {Object.entries(product.specs).slice(0, 2).map(([key, val]) => (
                            <span key={key} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold rounded">
                              {key}: {val}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Price & Action */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                          Supply Price
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-black text-slate-900">
                            RM {finalPrice.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          {hasDiscount && (
                            <span className="text-[11px] text-slate-400 line-through">
                              RM {product.price.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        disabled={isOutOfStock}
                        className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
                          isOutOfStock
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-900 hover:bg-[#c5161d] text-white shadow-md active:scale-95 cursor-pointer'
                        }`}
                        title={isOutOfStock ? "Out of stock" : "Add to cart"}
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ==================================================== */}
      {/* CART SLIDE-OVER DRAWER                               */}
      {/* ==================================================== */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[1000] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" 
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 md:p-8 z-10"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={18} className="text-[#c5161d]" />
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-900">
                    Your Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
                  </h3>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="py-20 text-center text-slate-400">
                    <ShoppingCart size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-xs font-bold uppercase tracking-wider">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map(item => {
                    const price = calculateFinalPrice(item);
                    return (
                      <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                        <img 
                          src={item.image_url || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80"} 
                          alt={item.name} 
                          className="w-14 h-14 object-contain rounded-lg bg-white p-1 shrink-0 border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                          <span className="text-xs font-black text-slate-800">
                            RM {(price * item.quantity).toFixed(2)}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <button 
                              onClick={() => updateCartQuantity(item.id, -1)}
                              className="w-5 h-5 rounded bg-white border border-slate-200 flex items-center justify-center text-xs font-bold hover:bg-slate-100"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQuantity(item.id, 1)}
                              className="w-5 h-5 rounded bg-white border border-slate-200 flex items-center justify-center text-xs font-bold hover:bg-slate-100"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeCartItem(item.id)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer */}
              {cart.length > 0 && (
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subtotal:</span>
                    <span className="text-lg font-black text-slate-900">
                      RM {cartTotal.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/checkout');
                    }}
                    className="w-full py-3.5 bg-[#c5161d] hover:bg-[#a81318] text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Public Footer */}
      <Footer theme="light" />
    </div>
  );
};

export default SuppliersPage;
