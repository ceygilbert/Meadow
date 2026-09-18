import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  ExternalLink, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Upload, 
  Sparkles, 
  Truck, 
  Layers, 
  Eye, 
  Info,
  Check,
  Package,
  SlidersHorizontal,
  X,
  Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Product, Category, Brand } from '../../types';
import { 
  SupplierPageConfig, 
  DEFAULT_SUPPLIER_CONFIG, 
  getSupplierConfig, 
  fetchSupplierConfig,
  saveSupplierConfig, 
  resetSupplierConfig 
} from '../../lib/supplierConfig';

const PRESET_BANNERS = [
  {
    name: "Modern Tech Distribution",
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=80"
  },
  {
    name: "Hardware Engineering",
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=2000&q=80"
  },
  {
    name: "Server & Enterprise Cloud",
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2000&q=80"
  },
  {
    name: "Clean Workstation Lab",
    url: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=2000&q=80"
  }
];

const SupplierSettingsPage: React.FC = () => {
  const [config, setConfig] = useState<SupplierPageConfig>(() => getSupplierConfig());
  const [activeTab, setActiveTab] = useState<'banner' | 'products' | 'headlines'>('banner');
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  // Database Products
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Search & Filter for Product Selection
  const [searchCatalog, setSearchCatalog] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');

  // File upload state
  const [isUploading, setIsUploading] = useState(false);

  // Load latest settings from database / cache
  useEffect(() => {
    fetchSupplierConfig().then((latest) => {
      setConfig(latest);
    });
    fetchCatalogData();
  }, []);

  // Debounced auto-save so user changes are NEVER lost
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!isDirty) return;

    const timer = setTimeout(async () => {
      setSaving(true);
      try {
        await saveSupplierConfig(config);
        setIsDirty(false);
        setSavedAt(new Date());
      } catch (err) {
        console.warn('Auto-save error:', err);
      } finally {
        setSaving(false);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [config, isDirty]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchCatalogData = async () => {
    setLoadingProducts(true);
    try {
      const [prodsRes, catsRes, brandsRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*'),
        supabase.from('brands').select('*')
      ]);

      if (prodsRes.data) setAllProducts(prodsRes.data);
      if (catsRes.data) setCategories(catsRes.data);
      if (brandsRes.data) setBrands(brandsRes.data);
    } catch (err: any) {
      console.error('Error fetching catalog products:', err);
      showToast('Failed to load products: ' + err.message, 'error');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await saveSupplierConfig(config);
      setIsDirty(false);
      setSavedAt(new Date());
      showToast(res.message || "Supplier settings and product selections saved successfully!", 'success');
    } catch (err: any) {
      showToast("Error saving: " + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm("Reset supplier page banner, titles, and selected products to system defaults?")) {
      const def = await resetSupplierConfig();
      setConfig(def);
      setIsDirty(false);
      setSavedAt(new Date());
      showToast("Supplier page reset to factory defaults.", 'info');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `supplier_banner_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      setConfig(prev => ({ ...prev, bannerImageUrl: publicUrl }));
      setIsDirty(true);
      showToast("Banner image uploaded successfully!", 'success');
    } catch (err: any) {
      console.error('Upload error:', err);
      showToast('Upload failed: ' + err.message, 'error');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // Product Selection Handlers
  const toggleSelectProduct = (productId: string) => {
    const current = config.selectedProductIds || [];
    let updated: string[];
    if (current.includes(productId)) {
      updated = current.filter(id => id !== productId);
    } else {
      updated = [...current, productId];
    }
    setConfig({ ...config, selectedProductIds: updated });
    setIsDirty(true);
  };

  const moveProductOrder = (index: number, direction: 'up' | 'down') => {
    const list = [...(config.selectedProductIds || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    setConfig({ ...config, selectedProductIds: list });
    setIsDirty(true);
  };

  const removeSelectedProduct = (productId: string) => {
    setConfig({
      ...config,
      selectedProductIds: (config.selectedProductIds || []).filter(id => id !== productId)
    });
    setIsDirty(true);
  };

  const clearAllSelected = () => {
    if (window.confirm("Remove all selected products from the Supplier page?")) {
      setConfig({ ...config, selectedProductIds: [] });
      setIsDirty(true);
    }
  };

  // Maps
  const productsMap = useMemo(() => new Map(allProducts.map(p => [p.id, p])), [allProducts]);
  const categoriesMap = useMemo(() => new Map(categories.map(c => [c.id, c.name])), [categories]);
  const brandsMap = useMemo(() => new Map(brands.map(b => [b.id, b.name])), [brands]);

  // Filter available catalog
  const filteredCatalog = useMemo(() => {
    return allProducts.filter(p => {
      const matchesSearch = searchCatalog === '' || 
        p.name.toLowerCase().includes(searchCatalog.toLowerCase()) ||
        (p.slug && p.slug.toLowerCase().includes(searchCatalog.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || p.category_id === filterCategory;
      const matchesBrand = filterBrand === 'all' || p.brand_id === filterBrand;

      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [allProducts, searchCatalog, filterCategory, filterBrand]);

  const selectAllFiltered = () => {
    const currentSet = new Set(config.selectedProductIds || []);
    filteredCatalog.forEach(p => currentSet.add(p.id));
    setConfig({ ...config, selectedProductIds: Array.from(currentSet) });
    setIsDirty(true);
    showToast(`Added ${filteredCatalog.length} filtered products to selection.`, 'info');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border text-sm font-semibold transition-all animate-in fade-in slide-in-from-top duration-300 ${
          toast.type === 'success' 
            ? 'bg-emerald-900/95 text-white border-emerald-700' 
            : toast.type === 'error'
              ? 'bg-rose-900/95 text-white border-rose-700'
              : 'bg-slate-900/95 text-white border-slate-700'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertCircle size={18} className="text-rose-400 shrink-0" />
          ) : (
            <Info size={18} className="text-blue-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-red-50 text-[#c5161d] text-[10px] font-black uppercase tracking-widest rounded-full border border-red-100 flex items-center gap-1.5">
              <Truck size={12} /> Supplier Management
            </span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
              Frontend &amp; Catalog
            </span>
            {isDirty && (
              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase tracking-wider rounded-md animate-pulse">
                Unsaved Changes
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">
            Supplier Page Settings
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">
            Customize the top hero banner, headlines, and select which products appear on the public Supplier page.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            {saving ? (
              <span className="flex items-center gap-1.5 font-bold text-slate-700">
                <Loader2 size={13} className="animate-spin text-[#c5161d]" />
                Auto-saving...
              </span>
            ) : isDirty ? (
              <span className="flex items-center gap-1.5 font-bold text-amber-600">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                Unsaved edits
              </span>
            ) : savedAt ? (
              <span className="flex items-center gap-1.5 font-medium text-slate-500">
                <CheckCircle2 size={13} className="text-emerald-500" />
                Saved {savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 font-medium text-slate-500">
                <CheckCircle2 size={13} className="text-emerald-500" />
                Synchronized
              </span>
            )}
          </div>

          <a
            href="/suppliers"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200 flex items-center gap-2"
            title="Open public Supplier page in a new window"
          >
            <span>View Live Page</span>
            <ExternalLink size={13} />
          </a>

          <button
            onClick={handleReset}
            className="px-4 py-2.5 bg-slate-50 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 rounded-xl text-xs font-bold transition-all border border-slate-200 flex items-center gap-2 cursor-pointer"
            title="Reset to default settings"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-[#c5161d] hover:bg-[#a81318] active:bg-[#991217] disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('banner')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'banner'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ImageIcon size={15} />
          <span>1. Top Hero Banner &amp; Text</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'products'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package size={15} />
          <span>2. Product Selection ({(config.selectedProductIds || []).length} Selected)</span>
        </button>

        <button
          onClick={() => setActiveTab('headlines')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'headlines'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers size={15} />
          <span>3. Product Grid Headings</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: PRODUCT SELECTION (SELECT PRODUCTS MODULE)    */}
      {/* ==================================================== */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-2.5 text-xs text-slate-600">
              <Info size={16} className="text-[#c5161d] shrink-0 mt-0.5" />
              <span>
                Pick products from the catalog on the right to display on the Supplier page. Use the <strong>Up / Down</strong> buttons on the left to set their exact sequence. <strong>Note:</strong> Only products you select will appear on the public Supplier page. If no products are selected, the public page will show 0 products and an empty state.
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {config.selectedProductIds && config.selectedProductIds.length > 0 && (
                <button
                  onClick={clearAllSelected}
                  className="px-3 py-1.5 bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 transition-colors"
                >
                  Clear Selection
                </button>
              )}
            </div>
          </div>

          {/* Two-Column Selector Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Currently Selected Products in Sequence (5 Cols) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                    Selected Supplier Products
                  </h2>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Order of appearance on the public page
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-red-50 text-[#c5161d] font-black text-xs rounded-full border border-red-100">
                  {(config.selectedProductIds || []).length} Chosen
                </span>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto max-h-[640px] space-y-2.5 pr-1">
                {(config.selectedProductIds || []).length === 0 ? (
                  <div className="py-16 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl p-6">
                    <Package size={36} className="mx-auto mb-2.5 opacity-30" />
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">No products selected yet</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Click "+ Add to Supplier Page" from the catalog on the right to choose which products to feature.
                    </p>
                  </div>
                ) : (
                  config.selectedProductIds.map((prodId, idx) => {
                    const prod = productsMap.get(prodId);
                    if (!prod) return null;

                    const catName = categoriesMap.get(prod.category_id) || '';
                    const brandName = brandsMap.get(prod.brand_id) || '';

                    return (
                      <div 
                        key={prodId}
                        className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 transition-all flex items-center justify-between gap-3 text-xs"
                      >
                        {/* Sequence badge & Thumbnail */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-white text-slate-600 font-black text-[10px] flex items-center justify-center border border-slate-200 shrink-0">
                            {idx + 1}
                          </span>

                          <img 
                            src={prod.image_url || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80"} 
                            alt={prod.name}
                            className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-slate-200 shrink-0"
                          />

                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 truncate" title={prod.name}>
                              {prod.name}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                              {brandName && <span className="font-bold text-slate-700">{brandName}</span>}
                              {catName && <span>• {catName}</span>}
                            </div>
                            <span className="text-[11px] font-black text-[#c5161d]">
                              RM {prod.price.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Re-order & Remove controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => moveProductOrder(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-20 cursor-pointer"
                            title="Move product up"
                          >
                            <MoveUp size={13} />
                          </button>

                          <button
                            onClick={() => moveProductOrder(idx, 'down')}
                            disabled={idx === config.selectedProductIds.length - 1}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-20 cursor-pointer"
                            title="Move product down"
                          >
                            <MoveDown size={13} />
                          </button>

                          <button
                            onClick={() => removeSelectedProduct(prodId)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove product from Supplier page"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Database Product Catalog Picker (7 Cols) */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                    Product Catalog Picker
                  </h2>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Search and add products into the Supplier page
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={selectAllFiltered}
                    disabled={filteredCatalog.length === 0}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
                  >
                    + Add All Filtered ({filteredCatalog.length})
                  </button>
                </div>
              </div>

              {/* Filter controls inside picker */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchCatalog}
                    onChange={(e) => setSearchCatalog(e.target.value)}
                    className="w-full h-9 pl-8 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-[#c5161d] focus:bg-white"
                  />
                </div>

                <div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-[#c5161d] cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={filterBrand}
                    onChange={(e) => setFilterBrand(e.target.value)}
                    className="w-full h-9 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-[#c5161d] cursor-pointer"
                  >
                    <option value="all">All Brands</option>
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Available Products Grid */}
              <div className="flex-1 overflow-y-auto max-h-[600px] pr-1">
                {loadingProducts ? (
                  <div className="py-20 text-center text-slate-400 text-xs">Loading products...</div>
                ) : filteredCatalog.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 text-xs">No products match your search or filter</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredCatalog.map(p => {
                      const isSelected = (config.selectedProductIds || []).includes(p.id);
                      const brandName = brandsMap.get(p.brand_id) || '';

                      return (
                        <div 
                          key={p.id}
                          onClick={() => toggleSelectProduct(p.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected 
                              ? 'bg-red-50/50 border-[#c5161d] shadow-2xs' 
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img 
                              src={p.image_url || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80"} 
                              alt={p.name}
                              className="w-11 h-11 object-contain bg-slate-50 rounded-lg p-1 border border-slate-100 shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 truncate" title={p.name}>
                                {p.name}
                              </h4>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                {brandName && <span>{brandName}</span>}
                                <span>• Stock: {p.stock}</span>
                              </div>
                              <span className="text-[11px] font-black text-slate-900">
                                RM {p.price.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelectProduct(p.id);
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                              isSelected
                                ? 'bg-[#c5161d] text-white shadow-2xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Check size={12} />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <Plus size={12} />
                                <span>Add</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: TOP BANNER & HERO SETTINGS                    */}
      {/* ==================================================== */}
      {activeTab === 'banner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                Hero Banner Settings
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize the visual hero banner displayed at the top of the public Supplier page.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Banner Badge Tag
                </label>
                <input
                  type="text"
                  value={config.bannerBadge}
                  onChange={(e) => {
                    setConfig({ ...config, bannerBadge: e.target.value });
                    setIsDirty(true);
                  }}
                  placeholder="e.g. OFFICIAL DISTRIBUTION & SUPPLY NETWORK"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c5161d] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Banner Headline Title
                </label>
                <input
                  type="text"
                  value={config.bannerTitle}
                  onChange={(e) => {
                    setConfig({ ...config, bannerTitle: e.target.value });
                    setIsDirty(true);
                  }}
                  placeholder="e.g. Authorized Direct Supplier & Distribution"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#c5161d] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Banner Subtitle Description
                </label>
                <textarea
                  rows={3}
                  value={config.bannerSubtitle}
                  onChange={(e) => {
                    setConfig({ ...config, bannerSubtitle: e.target.value });
                    setIsDirty(true);
                  }}
                  placeholder="e.g. Direct supply of premier computing hardware, enterprise systems, and components..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#c5161d] focus:bg-white"
                />
              </div>

              {/* Banner Image URL & Presets */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Banner Background Image URL
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={config.bannerImageUrl}
                    onChange={(e) => {
                      setConfig({ ...config, bannerImageUrl: e.target.value });
                      setIsDirty(true);
                    }}
                    placeholder="https://..."
                    className="flex-1 h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:border-[#c5161d] focus:bg-white"
                  />
                  <label className="px-4 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shrink-0">
                    <Upload size={14} />
                    <span>{isUploading ? "Uploading..." : "Upload"}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
                  </label>
                </div>

                {/* Preset Suggestions */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Presets:</span>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_BANNERS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setConfig({ ...config, bannerImageUrl: preset.url });
                          setIsDirty(true);
                        }}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                          config.bannerImageUrl === preset.url
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Banner Height & Image Sizing */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Banner Height: {config.bannerHeight ?? 680}px
                  </label>
                  <span className="text-[10px] text-slate-500 font-semibold">Taller height displays full graphics without clipping</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="900"
                  step="20"
                  value={config.bannerHeight ?? 680}
                  onChange={(e) => {
                    setConfig({ ...config, bannerHeight: parseInt(e.target.value) });
                    setIsDirty(true);
                  }}
                  className="w-full accent-[#c5161d]"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    { label: 'Compact (480px)', val: 480 },
                    { label: 'Standard (580px)', val: 580 },
                    { label: 'Tall / Full (680px)', val: 680 },
                    { label: 'Extra Tall (800px)', val: 800 },
                  ].map(preset => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => {
                        setConfig({ ...config, bannerHeight: preset.val });
                        setIsDirty(true);
                      }}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                        (config.bannerHeight ?? 680) === preset.val
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Fit: Cover vs Contain */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Image Scaling / Fit Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setConfig({ ...config, bannerImageFit: 'cover' });
                      setIsDirty(true);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                      (config.bannerImageFit ?? 'cover') === 'cover'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-black">Cover (Fill Frame)</div>
                    <div className={`text-[10px] mt-0.5 ${(config.bannerImageFit ?? 'cover') === 'cover' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Fills entire box edge-to-edge
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setConfig({ ...config, bannerImageFit: 'contain' });
                      setIsDirty(true);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                      config.bannerImageFit === 'contain'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-black">Contain (Show 100% Full)</div>
                    <div className={`text-[10px] mt-0.5 ${config.bannerImageFit === 'contain' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Entire image fits without any cropping
                    </div>
                  </button>
                </div>
              </div>

              {/* Overlay Darkness */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Banner Dark Overlay: {config.bannerOverlayOpacity ?? 65}%
                  </label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={config.bannerOverlayOpacity ?? 65}
                  onChange={(e) => {
                    setConfig({ ...config, bannerOverlayOpacity: parseInt(e.target.value) });
                    setIsDirty(true);
                  }}
                  className="w-full accent-[#c5161d]"
                />
              </div>

              {/* Button text and link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={config.bannerButtonText}
                    onChange={(e) => {
                      setConfig({ ...config, bannerButtonText: e.target.value });
                      setIsDirty(true);
                    }}
                    placeholder="Explore Supplier Products"
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c5161d] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Button Destination Anchor / Link
                  </label>
                  <input
                    type="text"
                    value={config.bannerButtonLink}
                    onChange={(e) => {
                      setConfig({ ...config, bannerButtonLink: e.target.value });
                      setIsDirty(true);
                    }}
                    placeholder="#supplier-products"
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-[#c5161d] focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Banner Live Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Real-Time Hero Banner Preview ({config.bannerHeight ?? 680}px Height)
            </h3>

            <div 
              className="relative rounded-2xl overflow-hidden flex items-center shadow-lg border border-slate-200 bg-slate-950 transition-all duration-300"
              style={{ minHeight: `${Math.min(500, Math.max(340, Math.round((config.bannerHeight ?? 680) * 0.65)))}px` }}
            >
              {config.bannerImageFit === 'contain' && (
                <div 
                  className="absolute inset-0 bg-cover bg-center blur-xl opacity-40 scale-110"
                  style={{ backgroundImage: `url(${config.bannerImageUrl || PRESET_BANNERS[0].url})` }}
                />
              )}

              <img 
                src={config.bannerImageUrl || PRESET_BANNERS[0].url} 
                alt="Banner Preview" 
                className={`absolute inset-0 w-full h-full ${
                  config.bannerImageFit === 'contain' ? 'object-contain' : 'object-cover'
                }`}
              />
              <div 
                className="absolute inset-0 bg-slate-950"
                style={{ opacity: (config.bannerOverlayOpacity ?? 65) / 100 }}
              />
              <div className="relative z-10 p-6 text-white space-y-3 w-full">
                {config.bannerBadge?.trim() && (
                  <span className="inline-block px-2.5 py-1 rounded-full bg-white/10 text-[9px] font-black uppercase tracking-wider text-white border border-white/20">
                    {config.bannerBadge.trim()}
                  </span>
                )}
                {config.bannerTitle?.trim() && (
                  <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white leading-tight">
                    {config.bannerTitle.trim()}
                  </h4>
                )}
                {config.bannerSubtitle?.trim() && (
                  <p className="text-xs text-white/80 line-clamp-3 leading-relaxed">
                    {config.bannerSubtitle.trim()}
                  </p>
                )}
                {config.bannerButtonText?.trim() && (
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#c5161d] text-white rounded-full font-black text-[10px] uppercase tracking-wider shadow-md">
                      <span>{config.bannerButtonText.trim()}</span>
                    </span>
                  </div>
                )}
                {!config.bannerBadge?.trim() && !config.bannerTitle?.trim() && !config.bannerSubtitle?.trim() && !config.bannerButtonText?.trim() && (
                  <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-white/70 text-xs backdrop-blur-sm">
                    <p className="font-bold mb-1 text-white">Clean Banner (No Text or Buttons)</p>
                    <p className="text-[11px] text-white/60 leading-relaxed">
                      All text fields are empty. On the public page, this banner will display purely as a visual hero image with your selected overlay darkness.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: SHOWCASE SECTION TEXTS                        */}
      {/* ==================================================== */}
      {activeTab === 'headlines' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 max-w-3xl">
          <div>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
              Showcase Headlines &amp; Descriptions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize the section heading that sits above the supplier product grid on the public page. If left blank, no text or titles will be displayed.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Section Badge Pill
              </label>
              <input
                type="text"
                value={config.sectionBadge}
                onChange={(e) => {
                  setConfig({ ...config, sectionBadge: e.target.value });
                  setIsDirty(true);
                }}
                placeholder="e.g. VERIFIED HARDWARE (leave blank to hide)"
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c5161d] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Section Title Heading
              </label>
              <input
                type="text"
                value={config.sectionTitle}
                onChange={(e) => {
                  setConfig({ ...config, sectionTitle: e.target.value });
                  setIsDirty(true);
                }}
                placeholder="e.g. Official Supplier Products (leave blank to hide)"
                className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#c5161d] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Section Description Text
              </label>
              <textarea
                rows={3}
                value={config.sectionDescription}
                onChange={(e) => {
                  setConfig({ ...config, sectionDescription: e.target.value });
                  setIsDirty(true);
                }}
                placeholder="e.g. Explore our verified catalog... (leave blank to hide)"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#c5161d] focus:bg-white"
              />
            </div>

            {/* Live Preview for Section Heading */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Live Preview of Product Grid Header
              </h3>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                {config.sectionBadge?.trim() || config.sectionTitle?.trim() || config.sectionDescription?.trim() ? (
                  <div>
                    {config.sectionBadge?.trim() && (
                      <span className="px-3 py-1 bg-red-50 text-[#c5161d] text-[10px] font-black uppercase tracking-widest rounded-full border border-red-100 inline-block mb-3">
                        {config.sectionBadge.trim()}
                      </span>
                    )}
                    {config.sectionTitle?.trim() && (
                      <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900">
                        {config.sectionTitle.trim()}
                      </h2>
                    )}
                    {config.sectionDescription?.trim() && (
                      <p className="text-xs md:text-sm text-slate-500 font-medium max-w-2xl mt-2 leading-relaxed">
                        {config.sectionDescription.trim()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">
                    All fields are empty. No headings or descriptions will be rendered on the public page.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Floating Save / Status Bar */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200 shadow-xl">
        <div className="flex items-center gap-2 pr-2 border-r border-slate-200 text-xs">
          {saving ? (
            <>
              <Loader2 size={14} className="animate-spin text-[#c5161d]" />
              <span className="font-bold text-slate-700">Auto-saving...</span>
            </>
          ) : isDirty ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span className="font-bold text-amber-600">Unsaved edits (auto-saving)</span>
            </>
          ) : savedAt ? (
            <>
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span className="font-medium text-slate-500">
                Saved at {savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span className="font-medium text-slate-500">Synchronized</span>
            </>
          )}
        </div>

        <a
          href="/suppliers"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          title="Open live page in new tab"
        >
          <span>Live Page</span>
          <ExternalLink size={12} />
        </a>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-[#c5161d] hover:bg-[#a81318] active:bg-[#991217] disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </div>
  );
};

export default SupplierSettingsPage;
