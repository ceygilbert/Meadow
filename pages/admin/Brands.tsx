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
  AlertTriangle,
  SlidersHorizontal,
  ArrowDownAZ,
  MoreHorizontal
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Brand } from '../../types';
import { AdminTablePagination } from '../../components/AdminTablePagination';

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

  // Reference Table Pattern States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [actionDropdownId, setActionDropdownId] = useState<string | null>(null);

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
        .from('products')
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
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('products')
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
          .from('products')
          .update(formData)
          .eq('id', editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('products')
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
        .from('products')
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
  ).sort((a, b) => {
    if (sortOrder === 'asc') return a.name.localeCompare(b.name);
    return b.name.localeCompare(a.name);
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedBrands = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedBrands.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedBrands.map(b => b.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Top Header Row Matching Screenshot */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Brands</h1>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', description: '', logo_url: '' });
            setIsModalOpen(true);
          }} 
          className="bg-slate-950 text-white rounded-full px-5 py-2.5 text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs flex items-center gap-2"
        >
          <Plus size={15} />
          <span>Add Brand</span>
        </button>
      </div>

      {/* Filter & Search Bar Row Matching Screenshot */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Pill Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 shadow-xs transition-all font-medium"
          />
        </div>

        {/* Filter & Sort Pills */}
        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
          {/* Sort Pill */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="bg-white border border-slate-200/90 hover:border-slate-300 text-slate-700 px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs transition-all"
          >
            <ArrowDownAZ size={14} className="text-slate-500" />
            <span>Sort by name {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <Loader2 className="animate-spin text-slate-800" size={36} />
          <p className="text-slate-400 font-semibold text-xs tracking-wider uppercase">Loading Brands...</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-red-50 text-red-600 rounded-2xl text-center border border-red-100 shadow-xs">
          <AlertCircle className="mx-auto mb-3" size={32} />
          <h3 className="text-sm font-bold mb-1">Error Loading Brands</h3>
          <p className="text-xs font-medium opacity-80 mb-4">{error}</p>
          <button onClick={fetchBrands} className="px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-semibold">Retry</button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-4 pl-6 pr-3 w-10">
                      <input 
                        type="checkbox"
                        checked={paginatedBrands.length > 0 && selectedIds.length === paginatedBrands.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-slate-900">Brand</th>
                    <th className="py-4 px-4 text-xs font-semibold text-slate-900">Status</th>
                    <th className="py-4 px-4 text-xs font-semibold text-slate-900">Description</th>
                    <th className="py-4 pr-6 pl-4 w-12 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedBrands.map((brand) => {
                    const isSelected = selectedIds.includes(brand.id);

                    return (
                      <tr 
                        key={brand.id} 
                        className={`hover:bg-slate-50/70 transition-colors ${isSelected ? 'bg-slate-50/50' : ''}`}
                      >
                        {/* Checkbox */}
                        <td className="py-4 pl-6 pr-3">
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(brand.id)}
                            className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                          />
                        </td>

                        {/* Brand Logo + Name */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3.5 min-w-[200px]">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/70 p-1.5 overflow-hidden flex items-center justify-center shrink-0">
                              {brand.logo_url ? (
                                <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain" />
                              ) : (
                                <Copyright size={20} className="text-slate-300" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="block text-xs font-bold text-slate-900 truncate">
                                {brand.name}
                              </span>
                              <span className="text-[11px] font-medium text-slate-400">
                                ID: {brand.id.slice(0, 8)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Status Pill Badge */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/40">
                            Active Partner
                          </span>
                        </td>

                        {/* Description */}
                        <td className="py-4 px-4">
                          <span className="text-xs text-slate-500 line-clamp-1 max-w-md">
                            {brand.description || 'Global technology manufacturer delivering high-performance IT solutions.'}
                          </span>
                        </td>

                        {/* Actions (••• button with dropdown) */}
                        <td className="py-4 pr-6 pl-4 text-right relative">
                          <div className="flex items-center justify-end">
                            <button 
                              onClick={() => setActionDropdownId(actionDropdownId === brand.id ? null : brand.id)}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60 transition-all"
                              title="Options"
                            >
                              <MoreHorizontal size={15} />
                            </button>
                          </div>

                          {actionDropdownId === brand.id && (
                            <div className="absolute right-6 top-12 w-32 bg-white border border-slate-200/90 rounded-2xl shadow-lg py-1.5 z-20 text-left animate-in fade-in zoom-in-95 duration-100">
                              <button
                                onClick={() => {
                                  setActionDropdownId(null);
                                  handleEdit(brand);
                                }}
                                className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                              >
                                <Edit2 size={13} />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActionDropdownId(null);
                                  setItemToDelete(brand);
                                }}
                                className="w-full px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                              >
                                <Trash2 size={13} />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {paginatedBrands.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-xs font-medium text-slate-400">
                        No brands found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Pagination Bar */}
          <AdminTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filtered.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 sm:p-6">
          <div className="bg-slate-50 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="px-6 md:px-8 py-5 bg-white border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between shrink-0">
              <h3 className="text-xl md:text-2xl font-semibold text-slate-900">
                {editingId ? 'Edit Brand' : 'Add New Brand'}
              </h3>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-full hover:bg-slate-50 transition-colors text-sm">
                  Discard
                </button>
                <button type="submit" form="brand-form" className="px-8 py-2.5 bg-slate-900 text-white font-medium rounded-full hover:bg-slate-800 transition-all text-sm">
                  Save
                </button>
              </div>
            </div>
            
            <form id="brand-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Brand Name</label>
                  <input 
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 placeholder:text-slate-400 transition-all" 
                    required
                    value={formData.name || ''}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Corsair"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Logo</label>
                  <div className="w-full rounded-2xl bg-white border border-dashed border-slate-300 flex flex-col items-center justify-center p-8 relative overflow-hidden group transition-all hover:border-slate-400">
                    {formData.logo_url ? (
                      <>
                        <img src={formData.logo_url} className="w-full max-h-48 object-contain p-2" alt="Preview" />
                        <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                          <Upload size={32} className="text-slate-400 mb-3" />
                          <button type="button" onClick={() => fileInputRef.current?.click()} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-full font-medium text-sm shadow-sm hover:bg-slate-50">Browse File</button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center flex flex-col items-center">
                        <Upload className="text-slate-900 mb-4" size={32} />
                        <p className="text-sm text-slate-900 font-medium mb-1">Choose a file or drag & drop it here</p>
                        <p className="text-xs text-slate-400 mb-6">JPG or PNG formats, up to 5MB (Square recommended)</p>
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-full font-medium text-sm shadow-sm hover:bg-slate-50 transition-all">Browse File</button>
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                        <Loader2 className="animate-spin text-slate-900" size={24} />
                        <span className="text-sm font-medium text-slate-900">Uploading...</span>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea 
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-600 text-sm leading-relaxed min-h-[120px]"
                    value={formData.description || ''}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Brand description..."
                  ></textarea>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandManagement;