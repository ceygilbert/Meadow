import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Image as ImageIcon, 
  Upload, 
  Link as LinkIcon, 
  Eye, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  Sliders, 
  Tag, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  Cpu,
  Monitor,
  Store
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { HomePageSettings, HeroBanner, FeaturedCategorySetting, Category } from '../../types';
import { fetchHomePageSettings, saveHomePageSettings, DEFAULT_HOMEPAGE_SETTINGS } from '../../services/homepageService';

const HomePageSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<HomePageSettings>(DEFAULT_HOMEPAGE_SETTINGS);
  const [categoriesFromDb, setCategoriesFromDb] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'banners' | 'categories' | 'custom_pc' | 'visit_store'>('banners');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Uploading states
  const [uploadingBannerId, setUploadingBannerId] = useState<string | null>(null);
  const [uploadingCatId, setUploadingCatId] = useState<string | null>(null);
  const [uploadingCustomPcBg, setUploadingCustomPcBg] = useState(false);
  const [uploadingStoreMedia, setUploadingStoreMedia] = useState(false);

  // Hero Preview Slide State
  const [previewSlide, setPreviewSlide] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{ type: 'banner' | 'category' | 'custom_pc' | 'store_media'; id?: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [homeSettings, dbCategoriesRes] = await Promise.all([
        fetchHomePageSettings(),
        supabase.from('categories').select('*').order('name')
      ]);

      setSettings(homeSettings);
      if (dbCategoriesRes.data) {
        setCategoriesFromDb(dbCategoriesRes.data);
      }
    } catch (err: any) {
      showToast('error', 'Error loading settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await saveHomePageSettings(settings);
      showToast('success', res.message || 'Home page settings saved successfully!');
    } catch (err: any) {
      showToast('error', 'Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset Home Page settings back to system defaults?')) {
      setSettings(DEFAULT_HOMEPAGE_SETTINGS);
      showToast('success', 'Reset to defaults. Click "Save Settings" to make permanent.');
    }
  };

  // Upload file helper
  const triggerImageUpload = (target: { type: 'banner' | 'category' | 'custom_pc' | 'store_media'; id?: string }) => {
    setUploadTarget(target);
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget) return;

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      showToast('error', 'Please select a valid image or video file.');
      return;
    }

    const { type, id } = uploadTarget;

    if (type === 'banner' && id) setUploadingBannerId(id);
    else if (type === 'category' && id) setUploadingCatId(id);
    else if (type === 'custom_pc') setUploadingCustomPcBg(true);
    else if (type === 'store_media') setUploadingStoreMedia(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `home_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      if (type === 'banner' && id) {
        updateBanner(id, 'image_url', publicUrl);
      } else if (type === 'category' && id) {
        updateCategorySetting(id, 'image_url', publicUrl);
      } else if (type === 'custom_pc') {
        setSettings(prev => ({ ...prev, custom_pc_bg_image: publicUrl }));
      } else if (type === 'store_media') {
        const isVideo = file.type.startsWith('video/');
        setSettings(prev => ({ 
          ...prev, 
          store_media_url: publicUrl,
          store_media_type: isVideo ? 'video' : 'image'
        }));
      }

      showToast('success', 'Media file uploaded successfully!');
    } catch (err: any) {
      showToast('error', 'Upload failed: ' + err.message);
    } finally {
      setUploadingBannerId(null);
      setUploadingCatId(null);
      setUploadingCustomPcBg(false);
      setUploadingStoreMedia(false);
      setUploadTarget(null);
    }
  };

  // Banner Actions
  const addBanner = () => {
    const newBanner: HeroBanner = {
      id: `banner-${Date.now()}`,
      image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80',
      title: 'New Featured Promo',
      subtitle: 'Highlight your latest products and exclusive deals',
      link: '/products',
      button_text: 'Explore Deals',
      is_active: true
    };
    setSettings(prev => ({ ...prev, banners: [...prev.banners, newBanner] }));
  };

  const updateBanner = (id: string, field: keyof HeroBanner, value: any) => {
    setSettings(prev => ({
      ...prev,
      banners: prev.banners.map(b => b.id === id ? { ...b, [field]: value } : b)
    }));
  };

  const deleteBanner = (id: string) => {
    if (settings.banners.length <= 1) {
      showToast('error', 'You must have at least one hero banner.');
      return;
    }
    setSettings(prev => ({
      ...prev,
      banners: prev.banners.filter(b => b.id !== id)
    }));
  };

  const moveBanner = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= settings.banners.length) return;
    const updated = [...settings.banners];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSettings(prev => ({ ...prev, banners: updated }));
  };

  // Category Actions
  const addCategoryCard = () => {
    const defaultCat = categoriesFromDb[0];
    const newCat: FeaturedCategorySetting = {
      id: `cat-${Date.now()}`,
      name: defaultCat ? defaultCat.name : 'New Category',
      slug: defaultCat ? defaultCat.slug : 'new-category',
      image_url: defaultCat?.image_url || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80',
      is_active: true,
      order: settings.categories.length + 1
    };
    setSettings(prev => ({ ...prev, categories: [...prev.categories, newCat] }));
  };

  const updateCategorySetting = (id: string, field: keyof FeaturedCategorySetting, value: any) => {
    setSettings(prev => ({
      ...prev,
      categories: prev.categories.map(c => {
        if (c.id === id) {
          const updated = { ...c, [field]: value };
          // If slug changed via dropdown, auto update name if default
          if (field === 'slug') {
            const selectedDbCat = categoriesFromDb.find(cat => cat.slug === value);
            if (selectedDbCat) {
              updated.name = selectedDbCat.name;
              if (selectedDbCat.image_url) updated.image_url = selectedDbCat.image_url;
            }
          }
          return updated;
        }
        return c;
      })
    }));
  };

  const deleteCategorySetting = (id: string) => {
    setSettings(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id)
    }));
  };

  const syncCategoriesFromDb = () => {
    if (categoriesFromDb.length === 0) {
      showToast('error', 'No categories found in the database.');
      return;
    }
    const synced: FeaturedCategorySetting[] = categoriesFromDb.map((cat, idx) => ({
      id: `cat-db-${cat.id}`,
      name: cat.name,
      slug: cat.slug,
      image_url: cat.image_url || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80',
      is_active: true,
      order: idx + 1
    }));
    setSettings(prev => ({ ...prev, categories: synced }));
    showToast('success', `Imported ${categoriesFromDb.length} categories from store database!`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <RefreshCw className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-bold text-sm tracking-wider uppercase">Loading Home Page Configuration...</p>
      </div>
    );
  }

  const activeBanners = settings.banners.filter(b => b.is_active);

  return (
    <div className="space-y-8 font-sans pb-16">
      
      {/* Hidden Global File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*,video/*" 
        className="hidden" 
      />

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-bottom-5 duration-300 ${
          toast.type === 'success' ? 'bg-emerald-900 text-white border border-emerald-700' : 'bg-rose-900 text-white border border-rose-700'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} className="text-emerald-400" /> : <AlertCircle size={20} className="text-rose-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header & Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider">CMS Module</span>
            <span className="text-slate-400 text-xs font-bold">• Real-time Store Sync</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Home Page Management</h1>
          <p className="text-slate-500 text-sm font-medium">Control hero banner sliders, links, and featured category cards displayed on your storefront.</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link 
            to="/" 
            target="_blank" 
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <ExternalLink size={14} /> Preview Storefront
          </Link>

          <button 
            onClick={handleReset}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all"
          >
            Reset Defaults
          </button>

          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        <button 
          onClick={() => setActiveTab('banners')}
          className={`px-5 py-3 text-xs font-bold rounded-t-2xl border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'banners' 
              ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sliders size={16} />
          Hero Banners ({settings.banners.length})
        </button>

        <button 
          onClick={() => setActiveTab('categories')}
          className={`px-5 py-3 text-xs font-bold rounded-t-2xl border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'categories' 
              ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Tag size={16} />
          Category Cards ({settings.categories.length})
        </button>

        <button 
          onClick={() => setActiveTab('custom_pc')}
          className={`px-5 py-3 text-xs font-bold rounded-t-2xl border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'custom_pc' 
              ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Cpu size={16} />
          Custom PC & Texts
        </button>

        <button 
          onClick={() => setActiveTab('visit_store')}
          className={`px-5 py-3 text-xs font-bold rounded-t-2xl border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'visit_store' 
              ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Store size={16} />
          Visit Our Store
        </button>
      </div>

      {/* TAB 1: HERO BANNERS MANAGEMENT */}
      {activeTab === 'banners' && (
        <div className="space-y-8">
          
          {/* Live Hero Carousel Preview */}
          <div className="bg-slate-900 rounded-[2.5rem] p-6 md:p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 flex items-center gap-2">
                <Eye size={12} /> Live Banner Carousel Preview
              </span>
              <span className="text-xs text-slate-400 font-medium">Slide {previewSlide + 1} of {activeBanners.length || 1}</span>
            </div>

            {activeBanners.length > 0 ? (
              <div className="relative h-[220px] md:h-[320px] rounded-2xl overflow-hidden bg-slate-800 border border-slate-700/50 flex items-center">
                <img 
                  src={activeBanners[previewSlide]?.image_url} 
                  alt="Banner preview" 
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent"></div>

                <div className="relative z-10 p-6 md:p-12 max-w-xl">
                  {activeBanners[previewSlide]?.title && (
                    <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white mb-2 leading-none">
                      {activeBanners[previewSlide].title}
                    </h3>
                  )}
                  {activeBanners[previewSlide]?.subtitle && (
                    <p className="text-xs md:text-sm text-slate-300 font-medium mb-6 line-clamp-2">
                      {activeBanners[previewSlide].subtitle}
                    </p>
                  )}
                  {activeBanners[previewSlide]?.button_text && (
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                      {activeBanners[previewSlide].button_text} <ArrowRight size={14} />
                    </span>
                  )}
                  {activeBanners[previewSlide]?.link && (
                    <p className="text-[10px] text-blue-300 font-mono mt-3">Link: {activeBanners[previewSlide].link}</p>
                  )}
                </div>

                {/* Preview controls */}
                <button 
                  onClick={() => setPreviewSlide((previewSlide - 1 + activeBanners.length) % activeBanners.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  onClick={() => setPreviewSlide((previewSlide + 1) % activeBanners.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-slate-500 text-xs font-bold">
                No active banners to preview. Enable at least one banner below.
              </div>
            )}
          </div>

          {/* Banner List & Controls */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Hero Banners List</h2>
              <button 
                onClick={addBanner}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
              >
                <Plus size={16} /> Add Hero Banner
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {settings.banners.map((banner, index) => (
                <div 
                  key={banner.id} 
                  className={`bg-white rounded-2xl border p-6 shadow-sm transition-all flex flex-col lg:flex-row gap-6 ${
                    banner.is_active ? 'border-slate-200' : 'border-slate-100 bg-slate-50/50 opacity-60'
                  }`}
                >
                  {/* Banner Image Preview Column */}
                  <div className="w-full lg:w-72 shrink-0 space-y-3">
                    <div className="aspect-[16/9] bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200 group">
                      <img src={banner.image_url} alt={banner.title || 'Banner'} className="w-full h-full object-cover" />
                      {uploadingBannerId === banner.id && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white">
                          <RefreshCw className="animate-spin" size={24} />
                        </div>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => triggerImageUpload({ type: 'banner', id: banner.id })}
                      className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Upload size={14} /> Upload New Banner
                    </button>
                  </div>

                  {/* Banner Content Form Fields */}
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Banner Image URL</label>
                        <input 
                          type="text" 
                          value={banner.image_url} 
                          onChange={(e) => updateBanner(banner.id, 'image_url', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://..."
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Link / URL</label>
                        <div className="relative">
                          <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            type="text" 
                            value={banner.link || ''} 
                            onChange={(e) => updateBanner(banner.id, 'link', e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. /products?category=laptop or /customised"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Banner Title (Overlay)</label>
                        <input 
                          type="text" 
                          value={banner.title || ''} 
                          onChange={(e) => updateBanner(banner.id, 'title', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Headline text..."
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Subtitle / Tagline</label>
                        <input 
                          type="text" 
                          value={banner.subtitle || ''} 
                          onChange={(e) => updateBanner(banner.id, 'subtitle', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Subtitle description..."
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Button Label</label>
                        <input 
                          type="text" 
                          value={banner.button_text || ''} 
                          onChange={(e) => updateBanner(banner.id, 'button_text', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. Shop Now"
                        />
                      </div>
                    </div>

                    {/* Controls Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={banner.is_active} 
                          onChange={(e) => updateBanner(banner.id, 'is_active', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        />
                        <span className="text-xs font-bold text-slate-700">Display on Storefront</span>
                      </label>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => moveBanner(index, 'up')}
                          disabled={index === 0}
                          className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-30 rounded-lg"
                          title="Move Up"
                        >
                          <MoveUp size={16} />
                        </button>
                        <button 
                          onClick={() => moveBanner(index, 'down')}
                          disabled={index === settings.banners.length - 1}
                          className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-30 rounded-lg"
                          title="Move Down"
                        >
                          <MoveDown size={16} />
                        </button>
                        <button 
                          onClick={() => deleteBanner(banner.id)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors ml-2"
                          title="Delete Banner"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FEATURED CATEGORIES SECTION MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-blue-50/60 p-6 rounded-2xl border border-blue-100">
            <div>
              <h2 className="font-bold text-blue-950 text-base">Categories Section Cards</h2>
              <p className="text-xs text-blue-700 font-medium">Select which categories to display in the Categories Carousel along with custom background cover images.</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={syncCategoriesFromDb}
                className="px-4 py-2.5 bg-white border border-blue-200 text-blue-700 font-bold rounded-xl text-xs hover:bg-blue-100 transition-colors shadow-xs"
              >
                Import DB Categories
              </button>
              <button 
                onClick={addCategoryCard}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/20"
              >
                <Plus size={16} /> Add Category Card
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {settings.categories.map((catCard) => (
              <div 
                key={catCard.id} 
                className={`bg-white rounded-2xl border p-5 shadow-sm space-y-4 flex flex-col justify-between ${
                  catCard.is_active ? 'border-slate-200' : 'border-slate-100 opacity-60 bg-slate-50'
                }`}
              >
                <div className="space-y-4">
                  {/* Image Header */}
                  <div className="aspect-[4/3] bg-slate-900 rounded-xl overflow-hidden relative group">
                    <img src={catCard.image_url} alt={catCard.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-xs font-black uppercase tracking-tight text-white">{catCard.name}</span>
                      <p className="text-[10px] text-blue-300 font-mono">/products?category={catCard.slug}</p>
                    </div>

                    <button 
                      onClick={() => triggerImageUpload({ type: 'category', id: catCard.id })}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-slate-800 rounded-lg text-[10px] font-bold shadow-lg flex items-center gap-1"
                    >
                      <Upload size={12} /> Replace
                    </button>

                    {uploadingCatId === catCard.id && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white">
                        <RefreshCw className="animate-spin" size={24} />
                      </div>
                    )}
                  </div>

                  {/* Category Link Selection */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Store Category</label>
                    <select 
                      value={catCard.slug}
                      onChange={(e) => updateCategorySetting(catCard.id, 'slug', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categoriesFromDb.map((dbCat) => (
                        <option key={dbCat.id} value={dbCat.slug}>
                          {dbCat.name} (slug: {dbCat.slug})
                        </option>
                      ))}
                      {/* Fallback option if not in db */}
                      {!categoriesFromDb.some(c => c.slug === catCard.slug) && (
                        <option value={catCard.slug}>{catCard.name} ({catCard.slug})</option>
                      )}
                    </select>
                  </div>

                  {/* Custom Display Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Display Title</label>
                    <input 
                      type="text" 
                      value={catCard.name}
                      onChange={(e) => updateCategorySetting(catCard.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Background Image URL */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Card Background Image URL</label>
                    <input 
                      type="text" 
                      value={catCard.image_url}
                      onChange={(e) => updateCategorySetting(catCard.id, 'image_url', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={catCard.is_active} 
                      onChange={(e) => updateCategorySetting(catCard.id, 'is_active', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-700">Active</span>
                  </label>

                  <button 
                    onClick={() => deleteCategorySetting(catCard.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove Card"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOM PC & TEXTS */}
      {activeTab === 'custom_pc' && (
        <div className="space-y-8 max-w-4xl">
          
          {/* Main Hero Header Text */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles size={18} className="text-blue-600" /> Hero Section Display Texts
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Top Watermark Background Text</label>
              <input 
                type="text" 
                value={settings.hero_bg_text || ''} 
                onChange={(e) => setSettings({ ...settings, hero_bg_text: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 uppercase"
                placeholder="PRECISION ENGINEERING"
              />
            </div>
          </div>

          {/* Custom PC Banner Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Cpu size={18} className="text-blue-600" /> "Build Your Own PC" Feature Banner
            </h2>

            <div className="aspect-[21/9] bg-slate-900 rounded-2xl overflow-hidden relative border border-slate-200">
              <img src={settings.custom_pc_bg_image} alt="Custom PC" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 mb-2">CUSTOM PC BUILDS</span>
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight">{settings.custom_pc_title}</h3>
                <p className="text-xs text-slate-300 max-w-md mt-2 font-medium line-clamp-2">{settings.custom_pc_subtitle}</p>
                <div className="mt-4">
                  <span className="inline-flex items-center gap-2 px-5 py-2 bg-rose-600 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                    {settings.custom_pc_btn_text} <ArrowRight size={14} />
                  </span>
                </div>
              </div>

              {uploadingCustomPcBg && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white">
                  <RefreshCw className="animate-spin" size={24} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Banner Headline Title</label>
                <input 
                  type="text" 
                  value={settings.custom_pc_title || ''} 
                  onChange={(e) => setSettings({ ...settings, custom_pc_title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Background Image URL</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={settings.custom_pc_bg_image || ''} 
                    onChange={(e) => setSettings({ ...settings, custom_pc_bg_image: e.target.value })}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                  />
                  <button 
                    onClick={() => triggerImageUpload({ type: 'custom_pc' })}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Upload size={14} /> Upload
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">CTA Button Text</label>
                <input 
                  type="text" 
                  value={settings.custom_pc_btn_text || ''} 
                  onChange={(e) => setSettings({ ...settings, custom_pc_btn_text: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">CTA Button Target Link</label>
                <input 
                  type="text" 
                  value={settings.custom_pc_btn_link || ''} 
                  onChange={(e) => setSettings({ ...settings, custom_pc_btn_link: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  placeholder="/customised"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description Subtitle</label>
              <textarea 
                rows={3} 
                value={settings.custom_pc_subtitle || ''} 
                onChange={(e) => setSettings({ ...settings, custom_pc_subtitle: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VISIT OUR STORE SECTION MANAGEMENT */}
      {activeTab === 'visit_store' && (
        <div className="space-y-8 max-w-4xl">
          
          {/* Section Header */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Store size={18} className="text-blue-600" /> Visit Our Store Section
            </h2>
            <p className="text-xs text-slate-500">
              Customize headlines, CTA buttons, location tags, and showcase media (video or image) for the "Visit Our Store" section on the home page.
            </p>
          </div>

          {/* Live Section Preview Card */}
          <div className="bg-slate-900 rounded-[2.5rem] p-6 md:p-8 text-white relative overflow-hidden shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 flex items-center gap-2">
                <Eye size={12} /> Live Preview - Visit Our Store
              </span>
            </div>

            <div className="bg-white rounded-2xl p-6 text-slate-900 space-y-6">
              <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">
                {settings.store_section_title || 'Visit Our Store.'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Preview Left Card */}
                <div className="bg-[#f3f4f6] rounded-xl p-6 flex flex-col justify-between min-h-[220px]">
                  <h4 className="text-sm md:text-base font-bold text-black uppercase tracking-tight whitespace-pre-line">
                    {settings.store_card_title || 'View All Meadow\nComputer All Locations.'}
                  </h4>

                  <div className="space-y-3 mt-4">
                    <span className="inline-block px-4 py-2 bg-white border border-black rounded-lg text-[10px] font-black uppercase tracking-wider text-black">
                      {settings.store_btn_text || 'Our Store'}
                    </span>
                    <div className="border-t border-black/20 pt-3">
                      <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-slate-600">
                        VIDEO DISPLAYING <ArrowRight size={12} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-800">
                        {settings.store_video_label || 'TAMAN PELANGI ASUS STORE'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preview Right Media */}
                <div className="md:col-span-2 aspect-video rounded-xl overflow-hidden bg-black border border-slate-200 relative">
                  {settings.store_media_type === 'image' ? (
                    <img 
                      src={settings.store_media_url || 'https://illuminatelabs.space/assets/locator_vd.mp4'} 
                      alt="Store Media" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <video 
                      src={settings.store_media_url || 'https://illuminatelabs.space/assets/locator_vd.mp4'} 
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
          </div>

          {/* Settings Controls */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Content Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Section Main Heading
                </label>
                <input 
                  type="text" 
                  value={settings.store_section_title || ''} 
                  onChange={(e) => setSettings({ ...settings, store_section_title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  placeholder="Visit Our Store."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Location / Video Sub-Label
                </label>
                <input 
                  type="text" 
                  value={settings.store_video_label || ''} 
                  onChange={(e) => setSettings({ ...settings, store_video_label: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  placeholder="TAMAN PELANGI ASUS STORE"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Store Card Main Title (Supports multi-line text)
              </label>
              <textarea 
                rows={3} 
                value={settings.store_card_title || ''} 
                onChange={(e) => setSettings({ ...settings, store_card_title: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                placeholder="View All Meadow&#10;Computer All Locations."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  CTA Button Label
                </label>
                <input 
                  type="text" 
                  value={settings.store_btn_text || ''} 
                  onChange={(e) => setSettings({ ...settings, store_btn_text: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  placeholder="Our Store"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  CTA Button Target Link
                </label>
                <input 
                  type="text" 
                  value={settings.store_btn_link || ''} 
                  onChange={(e) => setSettings({ ...settings, store_btn_link: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  placeholder="/our-stores"
                />
              </div>
            </div>

            {/* Media Section */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Store Banner Media (Video or Image)
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-medium">Type:</span>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-800">
                    <input 
                      type="radio" 
                      name="store_media_type" 
                      value="video" 
                      checked={settings.store_media_type !== 'image'} 
                      onChange={() => setSettings({ ...settings, store_media_type: 'video' })} 
                      className="text-blue-600 focus:ring-blue-500" 
                    />
                    Video
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-800">
                    <input 
                      type="radio" 
                      name="store_media_type" 
                      value="image" 
                      checked={settings.store_media_type === 'image'} 
                      onChange={() => setSettings({ ...settings, store_media_type: 'image' })} 
                      className="text-blue-600 focus:ring-blue-500" 
                    />
                    Image
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={settings.store_media_url || ''} 
                  onChange={(e) => setSettings({ ...settings, store_media_url: e.target.value })}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                  placeholder="https://..."
                />
                <button 
                  onClick={() => triggerImageUpload({ type: 'store_media' })}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Upload size={14} /> Upload Media
                </button>
              </div>
              {uploadingStoreMedia && (
                <p className="text-xs text-blue-600 font-bold flex items-center gap-2">
                  <RefreshCw className="animate-spin" size={14} /> Uploading media file...
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HomePageSettingsPage;
