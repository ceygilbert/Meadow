
import React, { useEffect, useState, useMemo } from 'react';
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
  Instagram,
  Eye,
  Package,
  Monitor,
  Maximize,
  HardDrive,
  Database,
  Shield,
  Wifi
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Breadcrumbs from '../../components/Breadcrumbs';
import { Product, Brand, Category, Profile } from '../../types';

interface CartItem extends Product {
  quantity: number;
}

type MenuMode = 'all' | 'story' | 'contact' | 'products';
const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/Red%20Full%20Logo.png";

import { useAuth } from '../../lib/AuthContext';

const ProductDetails: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<any | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [viewingCount, setViewingCount] = useState(() => Math.floor(Math.random() * 21) + 12);

  const availableColors = useMemo(() => {
    if (!product) return [];
    const pAny = product as any;
    if (Array.isArray(pAny.colors) && pAny.colors.length > 0) return pAny.colors;
    const colorSpec = product.specs?.Color || product.specs?.color || product.specs?.Colors || product.specs?.colors;
    if (colorSpec && typeof colorSpec === 'string' && colorSpec.trim()) {
      return colorSpec.split(',').map((c: string) => c.trim()).filter(Boolean);
    }
    return [];
  }, [product]);

  useEffect(() => {
    if (availableColors.length > 0) {
      setSelectedColor(availableColors[0]);
    } else {
      setSelectedColor('');
    }
  }, [availableColors]);

  useEffect(() => {
    setViewingCount(Math.floor(Math.random() * 21) + 12);
  }, [slug]);

  const getEstimatedDelivery = () => {
    const start = new Date();
    start.setDate(start.getDate() + 4);
    const end = new Date();
    end.setDate(end.getDate() + 7);
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    return `${startStr} - ${endStr}`;
  };

  const isDesktopOrLaptop = useMemo(() => {
    if (!product) return false;
    const catName = (category?.name || '').toLowerCase();
    const subName = (subcategory?.name || '').toLowerCase();
    const prodName = (product.name || '').toLowerCase();

    const targetCategories = ['laptop', 'laptops', 'desktop', 'desktops'];
    const isCatMatch = targetCategories.some(tc => catName.includes(tc) || subName.includes(tc));
    const isNameMatch = prodName.includes('laptop') || prodName.includes('desktop');

    return isCatMatch || isNameMatch;
  }, [product, category, subcategory]);

  const getSpec = (keys: string[], fallback: string) => {
    if (!product?.specs) return fallback;
    for (const k of keys) {
      if (product.specs[k] && typeof product.specs[k] === 'string' && product.specs[k].trim()) {
        return product.specs[k];
      }
    }
    return fallback;
  };

  const sysProcessor = getSpec(['Processor', 'processor', 'CPU', 'cpu'], 'AMD Ryzen™ 5 7535HS Processor');
  const sysGraphics = getSpec(['Graphics', 'graphics', 'GPU', 'gpu'], 'AMD Radeon™ 660M');
  const sysDisplay = getSpec(['Display', 'display', 'Screen', 'screen'], 'Non-touch screen, 15.6-inch, FHD (1920 × 1080) 16:9, Wide view, Anti-glare display, LED Backlit, 300nits, NTSC: 45%, Screen-to-body ratio:87 %');
  const sysMemory = getSpec(['Memory', 'memory', 'RAM', 'ram'], product?.ddr_type ? `16GB ${product.ddr_type} SO-DIMM, Memory Max Up to:64GB` : '16GB DDR5 SO-DIMM, Memory Max Up to:64GB');
  const sysStorage = getSpec(['Storage', 'storage', 'SSD', 'ssd'], '512GB M.2 2280 NVMe™ PCIe® 4.0 SSD');
  const sysSecurity = getSpec(['Security', 'security'], 'N/A');

  const addOS = getSpec(['Operating System', 'OS', 'os'], 'Windows 11 Home');
  const addColor = selectedColor || getSpec(['Color', 'color'], 'Misty Grey');
  const addSoftware = getSpec(['Included Software', 'Software', 'software'], 'Microsoft Office Home 2024 +Microsoft 365 Basic');
  const addIncluded = getSpec(['Whats Included', "What's Included?", 'Included', 'included'], 'Backpack');

  const featWeight = getSpec(['Total Weight', 'Weight', 'weight'], '1.60 kg');
  const featBattery = getSpec(['Battery & Charging', 'Battery', 'battery'], '50WHrs, 3S1P, 3-cell Li-ion, Long life rechargeable lithium polymer battery');
  const featPorts = getSpec(['Ports & Slots', 'Ports', 'ports'], '2x USB 3.2 Gen 2 Type-C support display / power delivery 2x USB 3.2 Gen 1 Type-A\n1x RJ45 Gigabit Ethernet 1x 3.5mm Combo Audio Jack\n1x HDMI 1.4\nup to 3840×2160p/30Hz');
  const featCamera = getSpec(['Web Camera', 'Camera', 'camera', 'Webcam'], '720p HD camera, With privacy shutter');
  const featKeyboard = getSpec(['Keyboard', 'keyboard'], 'Backlit Chiclet Keyboard with Num-key\n1.35mm Key-travel\nSpill-resistant Keyboard\nTouchpad');
  const featWireless = getSpec(['Wireless Connectivity', 'Wireless', 'wireless'], 'Wi-Fi 6 (802.11ax) + Bluetooth 5.2');

  // Shared UI States (Synced with Home)
  const [isFullMenuOpen, setIsFullMenuOpen] = useState(false);
  const [menuMode, setMenuMode] = useState<MenuMode>('all');
  const [headerSearch, setHeaderSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
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
    const savedCart = localStorage.getItem('meadow_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, [slug]);

  useEffect(() => {
    localStorage.setItem('meadow_cart', JSON.stringify(cart));
  }, [cart]);

  const fetchProductData = async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: prodError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (prodError) throw prodError;
      if (!data) throw new Error("Product not indexed.");

      setProduct(data);

      const [brandRes, catRes, subCatRes, relatedRes] = await Promise.all([
        data.brand_id ? supabase.from('brands').select('*').eq('id', data.brand_id).maybeSingle() : Promise.resolve({ data: null }),
        data.category_id ? supabase.from('categories').select('*').eq('id', data.category_id).maybeSingle() : Promise.resolve({ data: null }),
        data.subcategory_id ? supabase.from('subcategories').select('*').eq('id', data.subcategory_id).maybeSingle() : Promise.resolve({ data: null }),
        data.category_id ? supabase.from('products').select('*').eq('category_id', data.category_id).neq('id', data.id).limit(4) : Promise.resolve({ data: [] })
      ]);

      if (brandRes.data) setBrand(brandRes.data);
      if (catRes.data) setCategory(catRes.data);
      if (subCatRes.data) setSubcategory(subCatRes.data);
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
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-red-100 selection:text-red-900 overflow-x-hidden">
      
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
                      <span className="text-4xl md:text-7xl font-nav uppercase tracking-tighter text-red-600 group-hover:italic transition-all">Build Your Own PC</span>
                      <Zap className="text-red-600 animate-pulse" size={32} />
                   </Link>
                   <Link to="/our-stores" onClick={() => setIsFullMenuOpen(false)} className="group flex items-center gap-6">
                      <span className="text-4xl md:text-7xl font-nav uppercase tracking-tighter text-slate-900">Our Store</span>
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
              className="px-8 py-4 bg-slate-900 text-white text-xs font-nav uppercase tracking-[0.3em] rounded-full hover:bg-red-600 transition-all shadow-lg shadow-slate-900/20 hover:shadow-red-600/30 flex items-center gap-2"
            >
              <Zap size={18} className="text-red-500" />
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
              {cart.length > 0 && <span className="absolute -top-1 -right-1 w-6 h-6 md:w-7 md:h-7 bg-red-600 text-white text-[10px] md:text-xs font-black flex items-center justify-center rounded-full border-2 border-white">{cart.length}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Product Content */}
      <main className="pt-24 md:pt-36 pb-20 px-4 md:px-10 max-w-[1440px] mx-auto">
        <Breadcrumbs 
          items={[
            ...(category ? [{ label: category.name, path: `/products?category=${category.slug}` }] : []),
            ...(subcategory ? [{ label: subcategory.name, path: `/products?category=${category?.slug}&subcategory=${subcategory.slug}` }] : []),
            { label: product.name }
          ]}
        />
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
                     <div className="w-12 h-12 md:w-14 md:h-14 bg-red-600 text-white rounded-full flex items-center justify-center font-black text-[10px] uppercase tracking-widest shadow-xl rotate-12">
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
          <div className="lg:col-span-6 space-y-6 md:sticky md:top-36 animate-in fade-in slide-in-from-right duration-700">
             
             {/* Currently viewing banner */}
             <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
                <Eye size={20} className="text-slate-900 shrink-0" />
                <span>Currently {viewingCount} people are viewing this product.</span>
             </div>

             {/* Title, Category & Price */}
             <div className="space-y-3">
                <div className="flex items-center gap-3">
                   <span className="text-[11px] font-black uppercase tracking-[0.3em] text-red-600">{category?.name || 'Hardware'}</span>
                   <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                   <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">{brand?.name || 'Meadow IT'}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase leading-[1.2]">
                   {product.name}
                </h1>
                <div className="flex items-baseline gap-4 pt-1">
                   <span className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">RM{finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                   {product.discount_type !== 'none' && (
                     <span className="text-lg font-bold text-slate-300 line-through">RM{product.price.toLocaleString()}</span>
                   )}
                </div>
             </div>

             {/* Description summary */}
             <p className="text-sm text-slate-600 font-medium leading-relaxed">
                {product.description || `${product.name} features high-performance components, optimized thermal cooling, and precision engineering. Ideal for gaming, professional workstations, and high-performance custom desktop systems.`}
             </p>

             {/* Rating */}
             <div className="flex items-center gap-2 pt-1">
                <div className="flex text-amber-400 gap-0.5">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} size={16} className="text-amber-400 fill-amber-400/20" />
                   ))}
                </div>
                <span className="text-sm font-semibold text-slate-700 ml-1">No reviews</span>
             </div>

             {/* Color options - only shown if product has color variants */}
             {availableColors.length > 0 && (
                <div className="space-y-2.5 pt-2">
                   <label className="text-sm font-bold text-slate-900 block">Color:</label>
                   <div className="flex items-center gap-3">
                      {availableColors.map((color: string) => (
                         <button
                           key={color}
                           onClick={() => setSelectedColor(color)}
                           className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all border-2 ${
                             selectedColor === color 
                               ? 'border-slate-900 bg-white text-slate-900 shadow-sm' 
                               : 'border-slate-200/80 bg-white text-slate-600 hover:border-slate-400'
                           }`}
                         >
                            {color}
                         </button>
                      ))}
                   </div>
                </div>
             )}

             {/* Quantity & Action Buttons */}
             <div className="space-y-3 pt-2">
                <label className="text-sm font-bold text-slate-900 block">Quantity</label>
                <div className="flex items-center gap-3">
                   <div className="flex items-center bg-slate-100 rounded-xl px-4 py-3 justify-between w-32 border border-slate-200/60 shrink-0">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-slate-500 hover:text-slate-900 transition-colors font-bold"><Minus size={16} /></button>
                      <span className="font-extrabold text-base text-slate-900">{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="text-slate-500 hover:text-slate-900 transition-colors font-bold"><Plus size={16} /></button>
                   </div>
                   <button 
                     onClick={addToCart}
                     disabled={product.stock <= 0}
                     className="flex-1 py-3.5 px-6 border-2 border-slate-900 bg-white rounded-xl font-black text-xs uppercase tracking-widest text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                   >
                     {isAdded ? 'ADDED TO CART' : 'ADD TO CART'}
                   </button>
                </div>
                
                <button 
                  onClick={() => {
                    if (!product || product.stock <= 0) return;
                    const alreadyInCart = cart.find(item => item.id === product.id);
                    if (!alreadyInCart) {
                       setCart(prev => [...prev, { ...product, quantity }]);
                    }
                    navigate('/checkout-light');
                  }}
                  disabled={product.stock <= 0}
                  className="w-full py-3.5 px-6 bg-slate-300 text-slate-800 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                >
                  BUY IT NOW
                </button>
             </div>

             {/* Product Specs Box */}
             <div className="p-6 bg-slate-100/80 rounded-2xl space-y-3">
                <div className="grid grid-cols-12 text-sm">
                   <span className="col-span-4 font-bold text-slate-900">Product Type</span>
                   <span className="col-span-8 font-bold text-slate-900">{subcategory?.name || category?.name || 'Desktop Chassis'}</span>
                </div>
                <div className="grid grid-cols-12 text-sm">
                   <span className="col-span-4 font-bold text-slate-900">Availability</span>
                   <span className="col-span-8 font-bold text-emerald-600">{product.stock > 0 ? 'Available' : 'Out of Stock'}</span>
                </div>
                <div className="grid grid-cols-12 text-sm">
                   <span className="col-span-4 font-bold text-slate-900">SKU</span>
                   <span className="col-span-8 font-bold text-slate-900">{product.specs?.sku || product.specs?.SKU || `CAS-${brand?.name ? brand.name.substring(0,4).toUpperCase() : 'MEAD'}-${product.id.substring(0,8).toUpperCase()}`}</span>
                </div>
             </div>

             {/* Logistics & Shipping Info */}
             <div className="space-y-3 pt-1 text-sm font-bold text-slate-900">
                <div className="flex items-center gap-3">
                   <Truck className="w-5 h-5 text-slate-800 shrink-0" />
                   <span>Estimated Delivery: <span className="font-extrabold text-slate-900">{getEstimatedDelivery()}</span></span>
                </div>
                <div className="flex items-center gap-3">
                   <Package className="w-5 h-5 text-slate-800 shrink-0" />
                   <span>Free Shipping on West Malaysia for above RM2,500*</span>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* System Specification & Feature Specification Section */}
      {isDesktopOrLaptop ? (
        <section className="bg-[#F6F7FA] py-14 md:py-24 border-y border-slate-200/80 font-sans relative overflow-hidden">
          {/* Subtle background red gradient glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-[1550px] mx-auto px-4 md:px-10 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: System Spec + Additional Information */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* System Specification Header Box */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-black uppercase tracking-widest mb-2 border border-red-100">
                      <Cpu size={14} className="text-red-600" />
                      Hardware Architecture
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                      <span className="w-2 h-7 bg-red-600 rounded-full inline-block"></span>
                      System Specification
                    </h2>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg shrink-0 self-start sm:self-center">
                    Verified Specs
                  </span>
                </div>

                {/* 6 Grid Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  
                  {/* Processor */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/70 hover:border-red-500/40 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 shrink-0">
                          <Cpu size={22} />
                        </div>
                        <span className="text-red-600 font-extrabold text-base md:text-lg tracking-tight">Processor</span>
                      </div>
                      <p className="text-slate-900 font-bold text-sm md:text-base leading-snug">{sysProcessor}</p>
                    </div>
                  </div>

                  {/* Graphics */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/70 hover:border-red-500/40 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 shrink-0">
                          <Monitor size={22} />
                        </div>
                        <span className="text-red-600 font-extrabold text-base md:text-lg tracking-tight">Graphics</span>
                      </div>
                      <p className="text-slate-900 font-bold text-sm md:text-base leading-snug">{sysGraphics}</p>
                    </div>
                  </div>

                  {/* Display */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/70 hover:border-red-500/40 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 shrink-0">
                          <Maximize size={22} />
                        </div>
                        <span className="text-red-600 font-extrabold text-base md:text-lg tracking-tight">Display</span>
                      </div>
                      <p className="text-slate-900 font-bold text-xs md:text-sm leading-relaxed">{sysDisplay}</p>
                    </div>
                  </div>

                  {/* Memory */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/70 hover:border-red-500/40 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 shrink-0">
                          <HardDrive size={22} />
                        </div>
                        <span className="text-red-600 font-extrabold text-base md:text-lg tracking-tight">Memory</span>
                      </div>
                      <p className="text-slate-900 font-bold text-sm md:text-base leading-snug">{sysMemory}</p>
                    </div>
                  </div>

                  {/* Storage */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/70 hover:border-red-500/40 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 shrink-0">
                          <Database size={22} />
                        </div>
                        <span className="text-red-600 font-extrabold text-base md:text-lg tracking-tight">Storage</span>
                      </div>
                      <p className="text-slate-900 font-bold text-sm md:text-base leading-snug">{sysStorage}</p>
                    </div>
                  </div>

                  {/* Security */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/70 hover:border-red-500/40 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 shrink-0">
                          <Shield size={22} />
                        </div>
                        <span className="text-red-600 font-extrabold text-base md:text-lg tracking-tight">Security</span>
                      </div>
                      <p className="text-slate-900 font-bold text-sm md:text-base leading-snug">{sysSecurity}</p>
                    </div>
                  </div>

                </div>

                {/* Additional Information Box */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6">
                    <span className="w-2 h-7 bg-red-600 rounded-full inline-block"></span>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Additional Information</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-slate-100/80 transition-colors">
                      <p className="text-[11px] font-black uppercase tracking-wider text-red-600 mb-1">Operating System</p>
                      <p className="text-slate-900 font-bold text-base">{addOS}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-slate-100/80 transition-colors">
                      <p className="text-[11px] font-black uppercase tracking-wider text-red-600 mb-1">Color</p>
                      <p className="text-slate-900 font-bold text-base">{addColor}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-slate-100/80 transition-colors">
                      <p className="text-[11px] font-black uppercase tracking-wider text-red-600 mb-1">Included Software</p>
                      <p className="text-slate-900 font-bold text-base">{addSoftware}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 hover:bg-slate-100/80 transition-colors">
                      <p className="text-[11px] font-black uppercase tracking-wider text-red-600 mb-1">What's Included?</p>
                      <p className="text-slate-900 font-bold text-base">{addIncluded}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Feature Specification Box */}
              <div className="lg:col-span-4 flex">
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80 w-full flex flex-col justify-between sticky top-28">
                  <div>
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6">
                      <span className="w-2 h-7 bg-red-600 rounded-full inline-block"></span>
                      <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Feature Specification</h3>
                    </div>
                    <div className="space-y-5">
                      <div className="border-l-2 border-red-600/40 hover:border-red-600 transition-colors pl-4 py-1">
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-red-600 mb-1">Total Weight</h4>
                        <p className="text-slate-900 font-bold text-base">{featWeight}</p>
                      </div>
                      <div className="border-l-2 border-red-600/40 hover:border-red-600 transition-colors pl-4 py-1">
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-red-600 mb-1">Battery & Charging</h4>
                        <p className="text-slate-900 font-bold text-sm md:text-base leading-relaxed">{featBattery}</p>
                      </div>
                      <div className="border-l-2 border-red-600/40 hover:border-red-600 transition-colors pl-4 py-1">
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-red-600 mb-1">Ports & Slots</h4>
                        <p className="text-slate-900 font-bold text-sm md:text-base leading-relaxed whitespace-pre-line">{featPorts}</p>
                      </div>
                      <div className="border-l-2 border-red-600/40 hover:border-red-600 transition-colors pl-4 py-1">
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-red-600 mb-1">Web Camera</h4>
                        <p className="text-slate-900 font-bold text-base">{featCamera}</p>
                      </div>
                      <div className="border-l-2 border-red-600/40 hover:border-red-600 transition-colors pl-4 py-1">
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-red-600 mb-1">Keyboard</h4>
                        <p className="text-slate-900 font-bold text-sm md:text-base leading-relaxed whitespace-pre-line">{featKeyboard}</p>
                      </div>
                      <div className="border-l-2 border-red-600/40 hover:border-red-600 transition-colors pl-4 py-1">
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-red-600 mb-1">Wireless Connectivity</h4>
                        <p className="text-slate-900 font-bold text-base">{featWireless}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      ) : (
        /* Technical Specifications */
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
                         <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center text-red-600 group-hover:bg-slate-900 group-hover:text-white transition-all shrink-0">
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
      )}

      {/* Related Products */}
      <section className="py-20 md:py-32 bg-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
           <div className="flex items-center justify-between mb-16 md:mb-20">
              <div>
                 <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">Cross-Referenced Assets</h2>
                 <p className="text-xs text-slate-300 font-black uppercase tracking-[0.3em] mt-3">Recommended Deployments</p>
              </div>
           </div>

           <div className="flex gap-6 md:gap-10 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-10 -mb-10">
              {relatedProducts.map((p) => (
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-1 lg:col-span-1">
              <img src={LOGO_URL} className="h-16 w-auto mb-8 grayscale opacity-50" alt="Meadow" />
              <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs mb-8">
                Premium hardware distribution and bespoke computational engineering. Built for the elite.
              </p>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-4 text-left">Payment Method</h4>
                  <div className="flex flex-wrap gap-2">
                    <img src="https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/fpx.svg" className="h-8 w-auto px-2 py-1 bg-white rounded border border-slate-100 object-contain" alt="FPX" />
                    <img src="https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/master.svg" className="h-8 w-auto px-2 py-1 bg-white rounded border border-slate-100 object-contain" alt="Mastercard" />
                    <img src="https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/visa.svg" className="h-8 w-auto px-2 py-1 bg-white rounded border border-slate-100 object-contain" alt="VISA" />
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-4 text-left">Logistic Services</h4>
                  <div className="flex flex-wrap gap-2">
                    <img src="https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/gdex.svg" className="h-8 w-auto px-2 py-1 bg-white rounded border border-slate-100 object-contain" alt="GDEX" />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8">Company</h4>
              <ul className="space-y-4">
                <li><Link to="/our-story" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Our Story</Link></li>
                <li><Link to="/our-stores" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Our Store</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8">Shop With Us</h4>
              <ul className="space-y-4">
                <li><Link to="/buildpc" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">BUILD YOUR OWN PC</Link></li>
                <li><Link to="/products?category=Desktop" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Desktop</Link></li>
                <li><Link to="/products?category=Display" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Display</Link></li>
                <li><Link to="/products?category=Home+%26+Office" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Home & Office</Link></li>
                <li><Link to="/products?category=Laptop" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Laptop</Link></li>
                <li><Link to="/products?category=Networking" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Networking</Link></li>
                <li><Link to="/products?category=PC+Components" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">PC Component</Link></li>
                <li><Link to="/products?category=Peripherals" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Peripherals</Link></li>
                <li><Link to="/products?category=Smart+Home" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Smart Home</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8">Support</h4>
              <ul className="space-y-4">
                <li><Link to="/track-order" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Track Your Order</Link></li>
                <li><Link to="/warranty" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Warranty</Link></li>
                <li><Link to="/product-policy" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Terms & Conditions</Link></li>
                <li><button onClick={() => openMenu('contact')} className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Contact Us</button></li>
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
