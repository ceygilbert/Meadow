
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, X, Loader2, AlertCircle, AlertTriangle, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Category } from '../../types';

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error: sbError } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (sbError) throw sbError;
      setCategories(data || []);
    } catch (err: any) {
      setError(err.message);
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
      const fileName = `cat_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('categories')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('categories')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (err: any) {
      alert('Error uploading image: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from('categories')
          .update({ ...formData, slug })
          .eq('id', editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('categories')
          .insert([{ ...formData, slug }]);
        if (insertError) throw insertError;
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ name: '', description: '', image_url: '' });
      fetchCategories();
    } catch (err: any) {
      alert("Error saving category: " + err.message);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({ 
      name: category.name, 
      description: category.description, 
      image_url: category.image_url || '' 
    });
    setEditingId(category.id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete || isDeleting) return;
    const id = itemToDelete.id;

    setIsDeleting(id);
    try {
      const { data, error: delError } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .select();
        
      if (delError) throw delError;

      if (!data || data.length === 0) {
        alert("Deletion failed: The record was not removed. Please check your Supabase Row Level Security (RLS) policies.");
        fetchCategories();
      } else {
        setCategories(prev => prev.filter(c => c.id !== id));
      }
    } catch (err: any) {
      alert("DATABASE ERROR: " + (err.message || "Unknown error occurred."));
    } finally {
      setIsDeleting(null);
      setItemToDelete(null);
    }
  };

  const filtered = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-slate-500 text-sm">Organize your store into major hardware groups.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', description: '', image_url: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-bold transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={18} />
          New Category
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder="Filter categories..."
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
          <button onClick={fetchCategories} className="mt-4 text-sm font-bold underline">Retry</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((cat) => (
            <div key={cat.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 group hover:shadow-blue-500/10 transition-all overflow-hidden flex flex-col relative">
              <div className="aspect-video w-full bg-slate-100 relative overflow-hidden">
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                    <ImageIcon size={48} strokeWidth={1} />
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-2">No Header Image</span>
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleEdit(cat); }} 
                    className="p-2.5 bg-white/95 backdrop-blur-md text-slate-900 rounded-xl shadow-lg hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setItemToDelete(cat); }} 
                    className="p-2.5 bg-white/95 backdrop-blur-md text-rose-600 rounded-xl shadow-lg hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.name}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-6 min-h-[40px]">{cat.description || 'Professional category for IT inventory management.'}</p>
                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate max-w-[150px]">SLUG: {cat.slug}</span>
                </div>
              </div>
            </div>
          ))}
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
              <h3 className="text-2xl font-black text-slate-900 mb-2">Danger Zone</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                You are about to delete <span className="font-bold text-slate-900">"{itemToDelete.name}"</span>. This will remove all associated sub-categories and products. This action is permanent.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setItemToDelete(null)}
                  className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-[10px]"
                >
                  Keep It
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={isDeleting !== null}
                  className="flex-1 py-4 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                >
                  {isDeleting ? <Loader2 size={14} className="animate-spin" /> : 'Delete Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                {editingId ? 'Edit Category' : 'New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-slate-400 hover:bg-white rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Category Name</label>
                  <input className="w-full px-5 py-4 bg-slate-100/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-900" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Cover Image (Optional)</label>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden group">
                      {formData.image_url ? (
                        <img src={formData.image_url} className="w-full h-full object-cover" alt="Preview" />
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
                        className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                      >
                        <Upload size={14} /> {formData.image_url ? 'Replace Image' : 'Select Banner'}
                      </button>
                      <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">Recommended: 16:9 Aspect Ratio</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea rows={3} className="w-full px-5 py-4 bg-slate-100/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-600" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all uppercase tracking-widest text-[10px]">
                {editingId ? 'Update Info' : 'Finalize Creation'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
