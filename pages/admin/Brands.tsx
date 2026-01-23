import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Copyright, 
  X, 
  Loader2, 
  AlertCircle, 
  Upload,
  Check,
  Image as ImageIcon,
  AlertTriangle 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Brand } from '../../types';

const BrandManagement: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Brand | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Upload states
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo_url: ''
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const { data, error: sbError } = await supabase
        .from('brands')
        .select('*')
        .order('name');
      if (sbError) throw sbError;
      setBrands(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage bucket 'brands'
      const { data, error: uploadError } = await supabase.storage
        .from('brands')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('brands')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, logo_url: publicUrl }));
    } catch (err: any) {
      alert('Error uploading logo: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from('brands')
          .update(formData)
          .eq('id', editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('brands')
          .insert([formData]);
        if (insertError) throw insertError;
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ name: '', description: '', logo_url: '' });
      fetchBrands();
    } catch (err: any) {
      alert("Error saving brand: " + err.message);
    }
  };

  const handleEdit = (brand: Brand) => {
    setFormData({ 
      name: brand.name, 
      description: brand.description, 
      logo_url: brand.logo_url || '' 
    });
    setEditingId(brand.id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete || isDeleting) return;
    const id = itemToDelete.id;

    setIsDeleting(id);
    try {
      const { data, error: delError } = await supabase
        .from('brands')
        .delete()
        .eq('id', id)
        .select();
        
      if (delError) throw delError;

      if (!data || data.length === 0) {
        alert("Deletion failed: Row not affected. Check your RLS policies.");
        fetchBrands();
      } else {
        setBrands(prev => prev.filter(b => b.id !== id));
      }
    } catch (err: any) {
      alert("DATABASE ERROR: " + err.message);
    } finally {
      setIsDeleting(null);
      setItemToDelete(null);
    }
  };

  const filtered = brands.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.description && b.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Brand Management</h1>
          <p className="text-slate-500 text-sm">Manage partner brands and manufacturers.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', description: '', logo_url: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-bold transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={18} />
          New Brand
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder="Search brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
      ) : error ? (
        <div className="p-8 bg-red-50 text-red-600 rounded-2xl text-center border border-red-100">
          <AlertCircle className="mx-auto mb-3" />
          <p className="font-bold">{error}</p>
          <button onClick={fetchBrands} className="mt-4 text-sm font-bold underline">Retry</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((brand) => (
            <div key={brand.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 group hover:shadow-blue-500/10 transition-all p-8 flex flex-col relative overflow-hidden">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-[1.5rem] bg-slate-50 border border-slate-100 p-2 overflow-hidden flex items-center justify-center shrink-0">
                  {brand.logo_url ? (
                    <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <Copyright size={32} className="text-slate-200" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-slate-900 truncate">{brand.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Official Partner</p>
                </div>
              </div>
              
              <p className="text-slate-500 text-sm line-clamp-2 mb-8 min-h-[40px]">
                {brand.description || 'Global technology manufacturer delivering high-performance IT solutions.'}
              </p>

              <div className="mt-auto pt-6 border-t border-slate-50 flex items-center gap-3">
                <button 
                  onClick={() => handleEdit(brand)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button 
                  onClick={() => setItemToDelete(brand)}
                  className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Brands Registered</p>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Remove Brand?</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                You are removing <span className="font-bold text-slate-900">"{itemToDelete.name}"</span>. This will detach this brand from all associated products. This action is permanent.
              </p>
              <div className="flex gap-4">
                <button onClick={() => setItemToDelete(null)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-[10px]">Cancel</button>
                <button onClick={confirmDelete} disabled={isDeleting !== null} className="flex-1 py-4 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                  {isDeleting ? <Loader2 size={14} className="animate-spin" /> : 'Confirm Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                  {editingId ? 'Edit Brand' : 'New Brand'}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">Partner Relations</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-slate-400 hover:bg-white rounded-full transition-colors shadow-sm">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Brand Name</label>
                  <input 
                    className="w-full px-5 py-4 bg-slate-100/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-900" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Corsair"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Logo Upload</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden group">
                      {formData.logo_url ? (
                        <img src={formData.logo_url} className="w-full h-full object-contain p-2" alt="Logo Preview" />
                      ) : (
                        <ImageIcon className="text-slate-300" size={32} />
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                          <Loader2 className="animate-spin text-blue-600" size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        className="hidden" 
                        accept="image/*" 
                      />
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                      >
                        <Upload size={14} /> {formData.logo_url ? 'Change Logo' : 'Choose File'}
                      </button>
                      <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest">Recommended: Square PNG / SVG</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    rows={3}
                    className="w-full px-5 py-4 bg-slate-100/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium text-slate-600"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Industry-leading components for gaming enthusiasts..."
                  ></textarea>
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-colors uppercase tracking-widest text-[10px]">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 uppercase tracking-widest text-[10px]">
                  {editingId ? 'Save Changes' : 'Register Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandManagement;