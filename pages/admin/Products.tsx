
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Upload, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Sparkles,
  Loader2,
  AlertCircle,
  AlertTriangle,
  ImageIcon,
  Banknote,
  Package,
  Settings2,
  Percent,
  ToggleLeft,
  ToggleRight,
  ArrowRight,
  Info,
  Ruler,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { generateProductDescription } from '../../services/geminiService';
import { Product, Category, Brand, Unit, SubCategory } from '../../types';
import { supabase } from '../../lib/supabase';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category_id: '',
    subcategory_id: '',
    brand_id: '',
    unit_id: '',
    price: 0,
    discount_type: 'none',
    discount_value: 0,
    stock: 0,
    description: '',
    image_url: '',
    is_custom_build: false,
    is_customised: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, catRes, subRes, brandRes, unitRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
        supabase.from('subcategories').select('*').order('name'),
        supabase.from('brands').select('*').order('name'),
        supabase.from('units').select('*').order('name')
      ]);

      if (prodRes.error) throw prodRes.error;
      if (catRes.error) throw catRes.error;
      if (subRes.error) throw subRes.error;
      if (brandRes.error) throw brandRes.error;
      if (unitRes.error) throw unitRes.error;

      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
      setSubCategories(subRes.data || []);
      setBrands(brandRes.data || []);
      setUnits(unitRes.data || []);
      
      if (!editingId && catRes.data?.[0]) {
        setFormData(prev => ({ 
          ...prev, 
          category_id: prev.category_id || catRes.data[0].id,
          brand_id: prev.brand_id || (brandRes.data?.[0]?.id || ''),
          unit_id: prev.unit_id || (unitRes.data?.[0]?.id || '')
        }));
      }
    } catch (err: any) {
      setError(err.message || "Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (err: any) {
      alert('Error uploading image: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!formData.name) return alert('Please enter product name first');
    setIsGenerating(true);
    try {
      const catName = categories.find(c => c.id === formData.category_id)?.name || 'IT Component';
      const brandName = brands.find(b => b.id === formData.brand_id)?.name || 'Generic';
      const description = await generateProductDescription(formData.name || '', catName, brandName);
      setFormData(prev => ({ ...prev, description }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    const slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    const payload = {
      ...formData,
      slug,
      specs: formData.specs || {}
    };

    try {
      if (editingId) {
        const { stock, ...updatePayload } = payload;
        const { error: updateError } = await supabase
          .from('products')
          .update(updatePayload)
          .eq('id', editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('products')
          .insert([payload]);
        if (insertError) throw insertError;
      }
      
      setIsModalOpen(false);
      setEditingId(null);
      resetForm();
      fetchData();
    } catch (err: any) {
      alert("Error saving product: " + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category_id: categories[0]?.id || '',
      subcategory_id: '',
      brand_id: brands[0]?.id || '',
      unit_id: units[0]?.id || '',
      price: 0,
      discount_type: 'none',
      discount_value: 0,
      stock: 0,
      description: '',
      image_url: '',
      is_custom_build: false,
      is_customised: false
    });
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      category_id: product.category_id,
      subcategory_id: product.subcategory_id || '',
      brand_id: product.brand_id,
      unit_id: product.unit_id || '',
      price: product.price,
      discount_type: product.discount_type || 'none',
      discount_value: product.discount_value || 0,
      stock: product.stock,
      description: product.description,
      image_url: product.image_url,
      is_custom_build: product.is_custom_build,
      is_customised: product.is_customised
    });
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete || isDeleting) return;
    const id = itemToDelete.id;
    setIsDeleting(id);
    try {
      const { error: delError } = await supabase.from('products').delete().eq('id', id);
      if (delError) throw delError;
      setProducts(products.filter(p => p.id !== id));
    } catch (err: any) {
      alert("Error deleting product: " + err.message);
    } finally {
      setIsDeleting(null);
      setItemToDelete(null);
    }
  };

  const calculateDiscountedPrice = (price: number, type: string, value: number) => {
    if (type === 'percentage') return price * (1 - value / 100);
    if (type === 'fixed') return Math.max(0, price - value);
    return price;
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categories.find(c => c.id === p.category_id)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableSubCategories = subCategories.filter(s => s.category_id === formData.category_id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-slate-500 text-sm">Manage hardware, pricing, units and customisations.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            resetForm();
            setIsModalOpen(true);
          }} 
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-bold transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-slate-400 font-medium animate-pulse">Syncing Active Catalog...</p>
        </div>
      ) : error ? (
        <div className="p-12 bg-red-50 text-red-600 rounded-[2.5rem] text-center border border-red-100 shadow-xl shadow-red-100/10">
          <AlertCircle className="mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold mb-2">Sync Error</h3>
          <p className="font-medium opacity-80 mb-6">{error}</p>
          <button onClick={fetchData} className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors">Retry Sync</button>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Product Details</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category Hierarchy</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pricing (RM)</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stock Level</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProducts.map((p) => {
                  const cat = categories.find(c => c.id === p.category_id);
                  const sub = subCategories.find(s => s.id === p.subcategory_id);
                  const brand = brands.find(b => b.id === p.brand_id);
                  const unit = units.find(u => u.id === p.unit_id);
                  const isLowStock = p.stock < 10;
                  const finalPrice = calculateDiscountedPrice(p.price, p.discount_type, p.discount_value);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center shrink-0">
                            {p.image_url ? (
                              <img src={p.image_url} className="w-full h-full object-cover" alt={p.name} />
                            ) : (
                              <ImageIcon className="text-slate-300" size={24} />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="block font-bold text-slate-900 truncate max-w-[200px]">{p.name}</span>
                              {p.is_customised && (
                                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase rounded-md border border-indigo-100">Custom</span>
                              )}
                            </div>
                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{brand?.name || 'Generic'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md self-start uppercase tracking-wider">{cat?.name || 'Uncategorized'}</span>
                          {sub && (
                            <span className="text-[9px] font-bold text-slate-400 px-2 flex items-center gap-1 italic">
                              <ArrowRight size={8} /> {sub.name}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          {p.discount_type !== 'none' ? (
                            <>
                              <span className="text-lg font-black text-emerald-600">RM{finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                              <span className="text-xs text-slate-400 line-through font-bold">RM{p.price.toLocaleString()}</span>
                            </>
                          ) : (
                            <span className="text-lg font-black text-slate-900">RM{p.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${p.stock > 0 ? (isLowStock ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-rose-500'}`} />
                          <span className={`text-sm font-bold ${p.stock > 0 ? (isLowStock ? 'text-amber-600' : 'text-emerald-600') : 'text-rose-600'}`}>
                            {p.stock} <span className="text-[10px] opacity-70 uppercase tracking-tighter">{unit?.name || 'PCS'}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(p)} className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => setItemToDelete(p)} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Delete Product?</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                You are about to remove <span className="font-bold text-slate-900">"{itemToDelete.name}"</span>. This action is permanent.
              </p>
              <div className="flex gap-4">
                <button onClick={() => setItemToDelete(null)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 uppercase tracking-widest text-[10px]">Cancel</button>
                <button onClick={confirmDelete} disabled={isDeleting !== null} className="flex-1 py-4 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 shadow-lg shadow-rose-600/20 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                  {isDeleting ? <Loader2 size={14} className="animate-spin" /> : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="p-8 md:p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                  {editingId ? 'Edit Product' : 'Register New Hardware'}
                </h3>
                <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-[0.2em]">Active Inventory Management</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-slate-400 hover:bg-white hover:text-slate-900 rounded-full transition-all shadow-sm">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 md:p-10 space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
                {/* Basic Info */}
                <div className="space-y-8">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Hardware Name</label>
                    <input 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-900 placeholder:text-slate-300 transition-all" 
                      required 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. ASUS ROG Strix Laptop"
                    />
                  </div>

                  <div className="space-y-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                       <Layers size={14} /> Classification
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Main Category</label>
                        <select 
                          className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-900 transition-all"
                          value={formData.category_id}
                          onChange={e => setFormData({...formData, category_id: e.target.value, subcategory_id: ''})}
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Sub-category</label>
                        <select 
                          className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-900 transition-all disabled:opacity-50"
                          value={formData.subcategory_id}
                          onChange={e => setFormData({...formData, subcategory_id: e.target.value})}
                          disabled={!formData.category_id || availableSubCategories.length === 0}
                        >
                          <option value="">No Sub-category</option>
                          {availableSubCategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        {!formData.category_id ? (
                           <p className="text-[9px] text-slate-400 mt-2 font-medium italic">Select a category first</p>
                        ) : availableSubCategories.length === 0 ? (
                           <p className="text-[9px] text-slate-400 mt-2 font-medium italic">No sub-categories for this group</p>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Manufacturer</label>
                        <select 
                          className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-900 transition-all"
                          value={formData.brand_id}
                          onChange={e => setFormData({...formData, brand_id: e.target.value})}
                          required
                        >
                          <option value="">Brand</option>
                          {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Stock Unit</label>
                        <select 
                          className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-slate-900 transition-all"
                          value={formData.unit_id}
                          onChange={e => setFormData({...formData, unit_id: e.target.value})}
                          required
                        >
                          <option value="">Select Unit</option>
                          {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pricing & Stock</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Base Price (RM)</label>
                        <div className="relative">
                           <Banknote size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                           <input 
                            type="number" 
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20" 
                            required 
                            value={formData.price} 
                            onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Initial Stock</label>
                        <div className="relative">
                          <Package size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${editingId ? 'text-slate-300' : 'text-slate-400'}`} />
                          <input 
                            type="number" 
                            disabled={!!editingId}
                            className={`w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${editingId ? 'text-slate-400 bg-slate-50/50 cursor-not-allowed border-slate-200' : 'text-slate-900'}`} 
                            required 
                            value={formData.stock} 
                            onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} 
                          />
                        </div>
                        {editingId && (
                          <div className="mt-2 flex items-start gap-2 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                            <Info size={12} className="text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-[9px] text-blue-600 font-bold leading-tight uppercase tracking-tight">
                              Stock edits disabled. Use the <Link to="/admin/stock-take" className="underline hover:text-blue-800 flex items-center gap-1 inline-flex">Stock Take Module <ArrowRight size={8}/></Link> for adjustments.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/50">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Discount Type</label>
                        <select 
                          className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20"
                          value={formData.discount_type}
                          onChange={e => setFormData({...formData, discount_type: e.target.value as any})}
                        >
                          <option value="none">No Discount</option>
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount (RM)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Discount Value</label>
                        <div className="relative">
                          {formData.discount_type === 'percentage' ? (
                            <Percent size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          ) : (
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">RM</span>
                          )}
                          <input 
                            type="number" 
                            disabled={formData.discount_type === 'none'}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50" 
                            value={formData.discount_value} 
                            onChange={e => setFormData({...formData, discount_value: parseFloat(e.target.value)})} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="flex flex-col gap-4">
                     <label className="flex items-center justify-between p-5 bg-indigo-50/30 border border-indigo-100 rounded-3xl cursor-pointer group hover:bg-indigo-50/50 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                            <Settings2 size={20} />
                          </div>
                          <div>
                            <span className="block font-bold text-indigo-900 text-sm">Allow Customised Options</span>
                            <span className="text-[10px] text-indigo-500 font-medium uppercase tracking-widest">Enable unique hardware variations</span>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, is_customised: !formData.is_customised})}
                        >
                          {formData.is_customised ? <ToggleRight size={32} className="text-indigo-600" /> : <ToggleLeft size={32} className="text-slate-300" />}
                        </button>
                     </label>
                  </div>
                </div>

                {/* Media & AI */}
                <div className="space-y-8">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Product Media</label>
                    <div className="aspect-video w-full rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden group transition-all hover:border-blue-400">
                      {formData.image_url ? (
                        <>
                          <img src={formData.image_url} className="w-full h-full object-contain p-4" alt="Preview" />
                          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px]">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="px-8 py-3 bg-white text-slate-900 rounded-2xl font-bold text-sm shadow-2xl">Change Visual</button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-8">
                          <ImageIcon className="mx-auto text-slate-300 mb-4" size={48} strokeWidth={1} />
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Drop assets here</p>
                          <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-6 px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all">Upload File</button>
                        </div>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                          <Loader2 className="animate-spin text-blue-600" size={32} />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Uploading...</span>
                        </div>
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">AI Description</label>
                      <button 
                        type="button"
                        onClick={handleGenerateAI}
                        disabled={isGenerating || !formData.name}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-black text-[10px] uppercase tracking-widest disabled:opacity-30 transition-all"
                      >
                        {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        Auto-Generate
                      </button>
                    </div>
                    <textarea 
                      rows={8}
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-600 text-sm leading-relaxed"
                      placeholder="Hardware specs, capabilities, and highlights..."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-10 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="sm:flex-1 py-5 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-colors uppercase tracking-widest text-[11px]">
                  Cancel
                </button>
                <button type="submit" className="sm:flex-[2] py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 uppercase tracking-widest text-[11px] flex items-center justify-center gap-2">
                  {editingId ? 'Push Live Update' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
