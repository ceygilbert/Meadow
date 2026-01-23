
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Layers, Image as ImageIcon, X, Loader2, AlertCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Category, SubCategory } from '../../types';

const SubCategoryManagement: React.FC = () => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<SubCategory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    image_url: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, subRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('subcategories').select('*').order('name')
      ]);

      if (catRes.error) throw catRes.error;
      if (subRes.error) throw subRes.error;

      setCategories(catRes.data || []);
      setSubCategories(subRes.data || []);
      
      if (catRes.data && catRes.data.length > 0 && !formData.category_id) {
        setFormData(prev => ({ ...prev, category_id: catRes.data[0].id }));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id) return alert("Select a parent category first.");
    const slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from('subcategories')
          .update({ ...formData, slug })
          .eq('id', editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('subcategories')
          .insert([{ ...formData, slug }]);
        if (insertError) throw insertError;
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData(prev => ({ ...prev, name: '', description: '', image_url: '' }));
      fetchData();
    } catch (err: any) {
      alert("Error saving sub-category: " + err.message);
    }
  };

  const handleEdit = (sub: SubCategory) => {
    setFormData({ 
      name: sub.name, 
      description: sub.description, 
      category_id: sub.category_id,
      image_url: sub.image_url || '' 
    });
    setEditingId(sub.id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete || isDeleting) return;
    const id = itemToDelete.id;

    setIsDeleting(id);
    try {
      const { data, error: delError } = await supabase
        .from('subcategories')
        .delete()
        .eq('id', id)
        .select();
        
      if (delError) throw delError;

      if (!data || data.length === 0) {
        alert("Deletion failed: Row not affected. Check your RLS policies.");
        fetchData();
      } else {
        setSubCategories(prev => prev.filter(s => s.id !== id));
      }
    } catch (err: any) {
      alert("DATABASE ERROR: " + err.message);
    } finally {
      setIsDeleting(null);
      setItemToDelete(null);
    }
  };

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Unknown';

  const filtered = subCategories.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCategoryName(s.category_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sub-categories</h1>
          <p className="text-slate-500 text-sm">Targeted niches for specific hardware deployments.</p>
        </div>
        <button 
          onClick={() => {
            if (categories.length === 0) return alert("Please create a Category first.");
            setEditingId(null);
            setFormData(prev => ({ ...prev, name: '', description: '', image_url: '', category_id: categories[0].id }));
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 font-bold transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} />
          New Sub-category
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder="Filter sub-categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
      ) : error ? (
        <div className="p-8 bg-red-50 text-red-600 rounded-2xl text-center border border-red-100">
          <AlertCircle className="mx-auto mb-3" />
          <p className="font-bold">{error}</p>
          <button onClick={fetchData} className="mt-4 text-sm font-bold underline">Retry</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((sub) => (
            <div key={sub.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 group hover:shadow-indigo-500/10 transition-all overflow-hidden flex flex-col relative">
              <div className="aspect-video w-full bg-slate-100 relative overflow-hidden">
                {sub.image_url ? (
                  <img src={sub.image_url} alt={sub.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                    <Layers size={48} strokeWidth={1} />
                    <span className="text-[10px] font-bold uppercase tracking-widest mt-2">Default Header</span>
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <button onClick={() => handleEdit(sub)} className="p-2.5 bg-white/95 backdrop-blur-md text-slate-900 rounded-xl shadow-lg hover:bg-indigo-600 hover:text-white transition-all"><Edit2 size={16} /></button>
                  <button onClick={() => setItemToDelete(sub)} className="p-2.5 bg-white/95 backdrop-blur-md text-rose-600 rounded-xl shadow-lg hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="p-8">
                <div className="mb-4">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    {getCategoryName(sub.category_id)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{sub.name}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-6 min-h-[40px]">{sub.description || 'Specialized unit configuration within parent architecture.'}</p>
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
              <h3 className="text-2xl font-black text-slate-900 mb-2">Confirm Delete</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Permanently remove sub-category <span className="font-bold text-slate-900">"{itemToDelete.name}"</span>?
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
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{editingId ? 'Edit Sub-category' : 'New Sub-category'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-slate-400 hover:bg-white rounded-full transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Parent Category</label>
                <select className="w-full px-5 py-4 bg-slate-100/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} required>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Sub-category Name</label>
                <input className="w-full px-5 py-4 bg-slate-100/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 uppercase tracking-widest text-[10px]">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCategoryManagement;
