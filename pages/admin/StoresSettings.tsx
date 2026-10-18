import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  MoveUp, 
  MoveDown, 
  Upload, 
  Check, 
  AlertCircle, 
  Search, 
  Building2, 
  Phone, 
  Clock, 
  Navigation, 
  Video, 
  Layers, 
  Sparkles,
  Tag,
  ListPlus,
  X
} from 'lucide-react';
import { 
  OurStoresSettings, 
  StoreItem, 
  DEFAULT_OUR_STORES_SETTINGS, 
  DEFAULT_STORE_LIST,
  getStoredOurStoresSettings, 
  fetchOurStoresSettings, 
  saveOurStoresSettings, 
  resetOurStoresSettings 
} from '../../services/storesService';

const BADGE_PRESETS = [
  { label: 'MEADOW STORE', type: 'meadow', category: 'Meadow Computer' },
  { label: 'ASUS CONCEPT STORE', type: 'asus', category: 'ASUS' },
  { label: 'HP CONCEPT STORE', type: 'hp', category: 'HP' },
  { label: 'DISTRIBUTION HQ', type: 'hq', category: 'Distribution HQ' },
  { label: 'SERVICE CENTER', type: 'other', category: 'Meadow Computer' },
] as const;

const StoresSettings: React.FC = () => {
  const [settings, setSettings] = useState<OurStoresSettings>(() => getStoredOurStoresSettings());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  
  const [activeTab, setActiveTab] = useState<'stores' | 'hero' | 'preview'>('stores');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal editing state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [storeForm, setStoreForm] = useState<StoreItem>({
    id: '',
    name: '',
    badge: 'MEADOW STORE',
    badgeType: 'meadow',
    category: 'Meadow Computer',
    address: '',
    tags: ['PC Build', 'Laptops', 'Components', 'Support'],
    image: '',
    phone: '',
    hours: '10:00 AM - 10:00 PM (Daily)',
    googleMapsUrl: '',
    embedMapUrl: '',
    description: '',
    features: ['Custom PC Assembly & Diagnostic Lab', 'Dedicated Consultation Desk'],
    isActive: true,
    order: 1
  });

  const [tagInput, setTagInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await fetchOurStoresSettings();
      setSettings(data);
    } catch (err: any) {
      showToast('error', 'Failed to load store settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const res = await saveOurStoresSettings(settings);
      showToast('success', res.message || 'Stores and locator page settings saved to database successfully!');
    } catch (err: any) {
      showToast('error', 'Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Reset all store locations and locator page content to system factory defaults? Any custom changes will be overwritten.')) {
      setSaving(true);
      try {
        const def = await resetOurStoresSettings();
        setSettings(def);
        showToast('info', 'Store locations reset to default configuration and synced to database.');
      } catch (err: any) {
        showToast('error', 'Reset failed: ' + err.message);
      } finally {
        setSaving(false);
      }
    }
  };

  // Reorder store items
  const handleMoveStore = (index: number, direction: 'up' | 'down') => {
    const newStores = [...settings.stores];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newStores.length) return;

    const temp = newStores[index];
    newStores[index] = newStores[targetIndex];
    newStores[targetIndex] = temp;

    // Update order sequence
    const reordered = newStores.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSettings(prev => ({ ...prev, stores: reordered }));
  };

  // Toggle active status
  const handleToggleActive = (id: string) => {
    setSettings(prev => ({
      ...prev,
      stores: prev.stores.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s)
    }));
  };

  // Delete store
  const handleDeleteStore = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove store "${name}"?`)) {
      setSettings(prev => ({
        ...prev,
        stores: prev.stores.filter(s => s.id !== id)
      }));
      showToast('info', `Store "${name}" removed. Click "Save Changes" to commit.`);
    }
  };

  // Modal open for Add / Edit
  const handleOpenAddModal = () => {
    setEditingStoreId(null);
    setStoreForm({
      id: 'store-' + Date.now(),
      name: '',
      badge: 'MEADOW STORE',
      badgeType: 'meadow',
      category: 'Meadow Computer',
      address: '',
      tags: ['PC Build', 'Laptops', 'Components', 'Support'],
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200',
      phone: '+60 7-',
      hours: '10:00 AM - 10:00 PM (Daily)',
      googleMapsUrl: '',
      embedMapUrl: '',
      description: '',
      features: ['Custom PC Assembly & Diagnostic Lab', 'Comprehensive Component Displays'],
      isActive: true,
      order: settings.stores.length + 1
    });
    setTagInput('');
    setFeatureInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (store: StoreItem) => {
    setEditingStoreId(store.id);
    setStoreForm({ ...store });
    setTagInput('');
    setFeatureInput('');
    setIsModalOpen(true);
  };

  // Save Modal Form
  const handleSaveModalStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeForm.name.trim()) {
      alert('Please provide a store name.');
      return;
    }
    if (!storeForm.address.trim()) {
      alert('Please provide a store address.');
      return;
    }

    if (editingStoreId) {
      // Update existing
      setSettings(prev => ({
        ...prev,
        stores: prev.stores.map(s => s.id === editingStoreId ? storeForm : s)
      }));
      showToast('success', `Updated "${storeForm.name}". Remember to click "Save Changes".`);
    } else {
      // Add new
      setSettings(prev => ({
        ...prev,
        stores: [...prev.stores, { ...storeForm, id: storeForm.id || 'store-' + Date.now() }]
      }));
      showToast('success', `Added new store "${storeForm.name}". Remember to click "Save Changes".`);
    }

    setIsModalOpen(false);
  };

  // Tag helper
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (!storeForm.tags.includes(tagInput.trim())) {
      setStoreForm(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setStoreForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  // Feature helper
  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    if (!storeForm.features.includes(featureInput.trim())) {
      setStoreForm(prev => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
    }
    setFeatureInput('');
  };

  const handleRemoveFeature = (featToRemove: string) => {
    setStoreForm(prev => ({ ...prev, features: prev.features.filter(f => f !== featToRemove) }));
  };

  // Upload image to /api/upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'image' | 'hero_video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = targetField === 'hero_video';
    if (isVideo) setUploadingVideo(true);
    else setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed with status ' + res.status);
      }

      const data = await res.json();
      const publicUrl = data.publicUrl || (data.filename ? `/uploads/${data.filename}` : '');

      if (targetField === 'image') {
        setStoreForm(prev => ({ ...prev, image: publicUrl }));
        showToast('success', 'Store image uploaded successfully!');
      } else {
        setSettings(prev => ({ ...prev, hero_video_url: publicUrl }));
        showToast('success', 'Hero media uploaded successfully!');
      }
    } catch (err: any) {
      showToast('error', 'Upload error: ' + err.message);
    } finally {
      if (isVideo) setUploadingVideo(false);
      else setUploadingImage(false);
    }
  };

  // Filtered stores for admin list
  const filteredStores = settings.stores.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.badge.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getBadgeClass = (type: StoreItem['badgeType']) => {
    switch (type) {
      case 'meadow':
        return 'bg-rose-50 text-rose-600 border border-rose-200';
      case 'asus':
        return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'hp':
        return 'bg-sky-50 text-sky-600 border border-sky-200';
      case 'hq':
        return 'bg-purple-50 text-purple-600 border border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto font-sans">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 text-sm font-semibold transition-all animate-in fade-in slide-in-from-bottom-4 ${
          toast.type === 'success' 
            ? 'bg-slate-900 text-emerald-400 border border-emerald-500/30' 
            : toast.type === 'error'
            ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
            : 'bg-slate-900 text-sky-300 border border-sky-500/30'
        }`}>
          {toast.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">
            <Building2 size={16} />
            <span>Store Locator & Locations Module</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Our Stores & Branches
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage physical retail showrooms, concept stores, service centers, and public locator page content.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/our-stores"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <ExternalLink size={14} />
            <span>View Public Page</span>
          </a>

          <button
            onClick={handleResetDefaults}
            disabled={saving}
            className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Reset to factory default store locations"
          >
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-6 py-2 bg-[#c5161d] hover:bg-[#a81318] active:bg-[#991217] disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save size={15} className={saving ? 'animate-spin' : ''} />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-8">
        <button
          onClick={() => setActiveTab('stores')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs uppercase tracking-wider transition-all ${
            activeTab === 'stores'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Building2 size={16} />
          <span>Store Locations ({settings.stores.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs uppercase tracking-wider transition-all ${
            activeTab === 'hero'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Video size={16} />
          <span>Hero & Page Copy</span>
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs uppercase tracking-wider transition-all ${
            activeTab === 'preview'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <Eye size={16} />
          <span>Quick Preview</span>
        </button>
      </div>

      {/* TAB 1: STORES LIST */}
      {activeTab === 'stores' && (
        <div className="space-y-6">
          
          {/* Controls: Search, Category Filter, and Add Button */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search stores by name, address, or badge..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              >
                <option value="All">All Categories</option>
                <option value="Meadow Computer">Meadow Computer</option>
                <option value="ASUS">ASUS</option>
                <option value="HP">HP</option>
                <option value="Distribution HQ">Distribution HQ</option>
              </select>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus size={16} />
              <span>Add New Store</span>
            </button>
          </div>

          {/* Stores Grid / Cards */}
          {filteredStores.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
              <Building2 className="mx-auto text-slate-300 mb-3" size={40} />
              <p className="text-slate-600 font-bold text-sm">No stores found</p>
              <p className="text-slate-400 text-xs mt-1">Try modifying your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map((store, index) => (
                <div 
                  key={store.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md ${
                    store.isActive ? 'border-slate-200/80' : 'border-slate-200 opacity-60 bg-slate-50/50'
                  }`}
                >
                  <div>
                    {/* Store Image Banner */}
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden group">
                      <img 
                        src={store.image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600'} 
                        alt={store.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e: any) => {
                          e.target.src = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-xs ${getBadgeClass(store.badgeType)}`}>
                          {store.badge}
                        </span>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          store.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-white'
                        }`}>
                          {store.isActive ? 'Active' : 'Draft / Hidden'}
                        </span>
                      </div>

                      {/* Store Name Title on bottom of banner */}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">{store.category}</p>
                        <h3 className="text-lg font-black tracking-tight leading-snug drop-shadow-xs">{store.name}</h3>
                      </div>
                    </div>

                    {/* Store Details Body */}
                    <div className="p-4 space-y-3 text-xs text-slate-600">
                      <div className="flex items-start gap-2.5">
                        <MapPin size={15} className="text-rose-600 shrink-0 mt-0.5" />
                        <p className="line-clamp-2 text-slate-700 leading-relaxed">{store.address}</p>
                      </div>

                      <div className="flex items-center gap-2.5 text-slate-600">
                        <Phone size={14} className="text-slate-400 shrink-0" />
                        <span className="font-medium">{store.phone || 'No phone provided'}</span>
                      </div>

                      <div className="flex items-center gap-2.5 text-slate-600">
                        <Clock size={14} className="text-slate-400 shrink-0" />
                        <span>{store.hours || 'Hours not listed'}</span>
                      </div>

                      {/* Tags */}
                      {store.tags && store.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {store.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-semibold">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Bottom Bar */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-1">
                    {/* Reorder Up/Down */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveStore(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 hover:bg-white text-slate-500 hover:text-slate-900 rounded-lg disabled:opacity-25 transition-colors cursor-pointer"
                        title="Move Up in sequence"
                      >
                        <MoveUp size={14} />
                      </button>
                      <button
                        onClick={() => handleMoveStore(index, 'down')}
                        disabled={index === settings.stores.length - 1}
                        className="p-1.5 hover:bg-white text-slate-500 hover:text-slate-900 rounded-lg disabled:opacity-25 transition-colors cursor-pointer"
                        title="Move Down in sequence"
                      >
                        <MoveDown size={14} />
                      </button>
                      <button
                        onClick={() => handleToggleActive(store.id)}
                        className={`p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer ${
                          store.isActive ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                        title={store.isActive ? 'Hide from public site' : 'Show on public site'}
                      >
                        {store.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                    </div>

                    {/* Edit & Delete */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(store)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteStore(store.id, store.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Store"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HERO & PAGE COPY SETTINGS */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 max-w-3xl shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Hero Section Content</h2>
            <p className="text-xs text-slate-500 mt-0.5">Customize the header eyebrow, main title, subtitle, and video displayed at the top of the Store Locator page.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Hero Eyebrow Label
              </label>
              <input
                type="text"
                value={settings.hero_eyebrow}
                onChange={e => setSettings(prev => ({ ...prev, hero_eyebrow: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                placeholder="e.g. Store Locator"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Main Headline
              </label>
              <input
                type="text"
                value={settings.hero_title}
                onChange={e => setSettings(prev => ({ ...prev, hero_title: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                placeholder="e.g. Find a Meadow Store Near You"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Subtitle Description
              </label>
              <textarea
                rows={2}
                value={settings.hero_subtitle}
                onChange={e => setSettings(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                placeholder="e.g. Discover Meadow's physical spaces across Johor"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Background Video / Media URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.hero_video_url}
                  onChange={e => setSettings(prev => ({ ...prev, hero_video_url: e.target.value }))}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  placeholder="https://..."
                />
                <label className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap shadow-xs">
                  <Upload size={14} className={uploadingVideo ? 'animate-spin' : ''} />
                  <span>{uploadingVideo ? 'Uploading...' : 'Upload Video'}</span>
                  <input
                    type="file"
                    accept="video/*,image/*"
                    onChange={e => handleFileUpload(e, 'hero_video')}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Recommended: MP4 looping video or high-resolution wide banner.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="px-6 py-2.5 bg-[#c5161d] hover:bg-[#a81318] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save size={15} className={saving ? 'animate-spin' : ''} />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: QUICK PREVIEW */}
      {activeTab === 'preview' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Active Public Stores Preview</h2>
            <p className="text-xs text-slate-500 mt-0.5">This represents what visitors see on the live public Store Locator page.</p>
          </div>

          {/* Hero Banner Preview */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 p-8 text-white min-h-[180px] flex flex-col justify-end">
            <div className="relative z-10 max-w-xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/70 block mb-2">{settings.hero_eyebrow}</span>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{settings.hero_title}</h1>
              <p className="text-xs italic text-white/80">{settings.hero_subtitle}</p>
            </div>
          </div>

          {/* Stores Preview List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {settings.stores.filter(s => s.isActive).map(st => (
              <div key={st.id} className="border border-slate-200 rounded-xl p-4 space-y-2 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${getBadgeClass(st.badgeType)}`}>
                    {st.badge}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">{st.category}</span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">{st.name}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{st.address}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                  <span>{st.phone}</span>
                  <span className="text-rose-600 font-bold">{st.hours.split('(')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT / CREATE STORE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingStoreId ? 'Edit Store Location' : 'Add New Store Location'}
                </h3>
                <p className="text-xs text-slate-500">Provide branch details, contact information, and coordinates.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveModalStore} className="space-y-5">
              
              {/* Name & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Store Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={storeForm.name}
                    onChange={e => setStoreForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    placeholder="e.g. Pelangi Plaza"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Category Filter
                  </label>
                  <select
                    value={storeForm.category}
                    onChange={e => setStoreForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  >
                    <option value="Meadow Computer">Meadow Computer</option>
                    <option value="ASUS">ASUS</option>
                    <option value="HP">HP</option>
                    <option value="Distribution HQ">Distribution HQ</option>
                    <option value="Service Center">Service Center</option>
                  </select>
                </div>
              </div>

              {/* Badge Text & Badge Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Badge Text Label
                  </label>
                  <input
                    type="text"
                    value={storeForm.badge}
                    onChange={e => setStoreForm(prev => ({ ...prev, badge: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    placeholder="e.g. MEADOW STORE"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Badge Color Theme
                  </label>
                  <select
                    value={storeForm.badgeType}
                    onChange={(e: any) => setStoreForm(prev => ({ ...prev, badgeType: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  >
                    <option value="meadow">Rose / Meadow (Red/Pink)</option>
                    <option value="asus">Blue (ASUS)</option>
                    <option value="hp">Sky Blue (HP)</option>
                    <option value="hq">Purple (Distribution HQ)</option>
                    <option value="other">Slate / Neutral</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Store Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={storeForm.address}
                  onChange={e => setStoreForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  placeholder="e.g. Lot 3.26, Level 3, Plaza Pelangi, 80400 Johor Bahru, Johor"
                />
              </div>

              {/* Phone & Operating Hours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Phone Contact
                  </label>
                  <input
                    type="text"
                    value={storeForm.phone}
                    onChange={e => setStoreForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    placeholder="e.g. +60 7-333 3333"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={storeForm.hours}
                    onChange={e => setStoreForm(prev => ({ ...prev, hours: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    placeholder="e.g. 10:00 AM - 10:00 PM (Daily)"
                  />
                </div>
              </div>

              {/* Store Image */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Store Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={storeForm.image}
                    onChange={e => setStoreForm(prev => ({ ...prev, image: e.target.value }))}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    placeholder="https://..."
                  />
                  <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap border border-slate-200">
                    <Upload size={13} className={uploadingImage ? 'animate-spin' : ''} />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileUpload(e, 'image')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Google Maps External URL & Embed URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Google Maps Link (For Directions)
                  </label>
                  <input
                    type="text"
                    value={storeForm.googleMapsUrl}
                    onChange={e => setStoreForm(prev => ({ ...prev, googleMapsUrl: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    placeholder="https://maps.google.com/?q=..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Google Maps Embed URL (Iframe View)
                  </label>
                  <input
                    type="text"
                    value={storeForm.embedMapUrl}
                    onChange={e => setStoreForm(prev => ({ ...prev, embedMapUrl: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    placeholder="https://www.google.com/maps?q=...&output=embed"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Store Overview / Description
                </label>
                <textarea
                  rows={2}
                  value={storeForm.description}
                  onChange={e => setStoreForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  placeholder="e.g. Flagship retail experience featuring custom PC showroom and workshop."
                />
              </div>

              {/* Tags Editor */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Store Tags (Pills)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    placeholder="Type tag (e.g. PC Build) and press Add"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {storeForm.tags.map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1">
                      <span>{tag}</span>
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="text-slate-400 hover:text-rose-600">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Features / Highlights Editor */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Key Services & Features (Bullet Points)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    placeholder="Type key feature and press Add"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                  {storeForm.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700">
                      <span>• {feat}</span>
                      <button type="button" onClick={() => handleRemoveFeature(feat)} className="text-slate-400 hover:text-rose-600">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActiveStore"
                  checked={storeForm.isActive !== false}
                  onChange={e => setStoreForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded-md border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <label htmlFor="isActiveStore" className="text-xs font-bold text-slate-800 cursor-pointer select-none">
                  Display this store on public locator page (Active)
                </label>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  {editingStoreId ? 'Apply Changes' : 'Add Store'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StoresSettings;
