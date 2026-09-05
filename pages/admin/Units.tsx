
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Ruler, 
  X, 
  Loader2, 
  AlertCircle, 
  AlertTriangle,
  SlidersHorizontal,
  ArrowDownAZ,
  MoreHorizontal
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Unit } from '../../types';
import { AdminTablePagination } from '../../components/AdminTablePagination';

const UnitManagement: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Unit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Reference Table Pattern States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [actionDropdownId, setActionDropdownId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: ''
  });

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const { data, error: sbError } = await supabase
        .from('units')
        .select('*')
        .order('name');
      if (sbError) throw sbError;
      setUnits(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from('units')
          .update(formData)
          .eq('id', editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('units')
          .insert([formData]);
        if (insertError) throw insertError;
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ name: '' });
      fetchUnits();
    } catch (err: any) {
      alert("Error saving unit: " + err.message);
    }
  };

  const handleEdit = (unit: Unit) => {
    setFormData({ name: unit.name });
    setEditingId(unit.id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete || isDeleting) return;
    const id = itemToDelete.id;

    setIsDeleting(id);
    try {
      const { error: delError } = await supabase
        .from('units')
        .delete()
        .eq('id', id);
        
      if (delError) throw delError;
      setUnits(prev => prev.filter(u => u.id !== id));
    } catch (err: any) {
      alert("Error deleting unit: " + err.message);
    } finally {
      setIsDeleting(null);
      setItemToDelete(null);
    }
  };

  const filtered = units
    .filter(u => !u.name.startsWith('HOMEPAGE_SETTINGS:') && !u.name.startsWith('OUR_STORY_SETTINGS:') && u.id !== '00000000-0000-0000-0000-000000000001' && u.id !== '00000000-0000-0000-0000-000000000002')
    .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedUnits = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedUnits.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedUnits.map(u => u.id));
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
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Units of Measurement</h1>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '' });
            setIsModalOpen(true);
          }} 
          className="bg-slate-950 text-white rounded-full px-5 py-2.5 text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs flex items-center gap-2"
        >
          <Plus size={15} />
          <span>Add Unit</span>
        </button>
      </div>

      {/* Filter & Search Bar Row Matching Screenshot */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Pill Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search units..."
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
          <p className="text-slate-400 font-semibold text-xs tracking-wider uppercase">Loading Units...</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-red-50 text-red-600 rounded-2xl text-center border border-red-100 shadow-xs">
          <AlertCircle className="mx-auto mb-3" size={32} />
          <h3 className="text-sm font-bold mb-1">Error Loading Units</h3>
          <p className="text-xs font-medium opacity-80 mb-4">{error}</p>
          <button onClick={fetchUnits} className="px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-semibold">Retry</button>
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
                        checked={paginatedUnits.length > 0 && selectedIds.length === paginatedUnits.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-slate-900">Unit Name</th>
                    <th className="py-4 px-4 text-xs font-semibold text-slate-900">Status</th>
                    <th className="py-4 px-4 text-xs font-semibold text-slate-900">Unit ID</th>
                    <th className="py-4 pr-6 pl-4 w-12 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedUnits.map((unit) => {
                    const isSelected = selectedIds.includes(unit.id);

                    return (
                      <tr 
                        key={unit.id} 
                        className={`hover:bg-slate-50/70 transition-colors ${isSelected ? 'bg-slate-50/50' : ''}`}
                      >
                        {/* Checkbox */}
                        <td className="py-4 pl-6 pr-3">
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(unit.id)}
                            className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                          />
                        </td>

                        {/* Unit Name + Icon */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3 min-w-[180px]">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/70 flex items-center justify-center text-slate-600 shrink-0">
                              <Ruler size={16} />
                            </div>
                            <span className="text-xs font-bold text-slate-900">
                              {unit.name}
                            </span>
                          </div>
                        </td>

                        {/* Status Pill Badge */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/40">
                            Active
                          </span>
                        </td>

                        {/* Unit ID */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="text-xs font-medium text-slate-400">
                            UID: {unit.id.slice(0, 8)}
                          </span>
                        </td>

                        {/* Actions (••• button with dropdown) */}
                        <td className="py-4 pr-6 pl-4 text-right relative">
                          <div className="flex items-center justify-end">
                            <button 
                              onClick={() => setActionDropdownId(actionDropdownId === unit.id ? null : unit.id)}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60 transition-all"
                              title="Options"
                            >
                              <MoreHorizontal size={15} />
                            </button>
                          </div>

                          {actionDropdownId === unit.id && (
                            <div className="absolute right-6 top-12 w-32 bg-white border border-slate-200/90 rounded-2xl shadow-lg py-1.5 z-20 text-left animate-in fade-in zoom-in-95 duration-100">
                              <button
                                onClick={() => {
                                  setActionDropdownId(null);
                                  handleEdit(unit);
                                }}
                                className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                              >
                                <Edit2 size={13} />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActionDropdownId(null);
                                  setItemToDelete(unit);
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

                  {paginatedUnits.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-xs font-medium text-slate-400">
                        No measurement units found.
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

      {/* Delete Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Delete Unit?</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Confirm deletion of unit <span className="font-bold text-slate-900">"{itemToDelete.name}"</span>.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setItemToDelete(null)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl uppercase tracking-widest text-[10px]">Cancel</button>
              <button onClick={confirmDelete} disabled={isDeleting !== null} className="flex-1 py-4 bg-rose-600 text-white font-bold rounded-2xl uppercase tracking-widest text-[10px]">
                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{editingId ? 'Edit Unit' : 'New Unit'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-slate-400 hover:bg-white rounded-full transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Unit Name</label>
                <input 
                  className="w-full px-5 py-4 bg-slate-100/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-900" 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({ name: e.target.value })} 
                  placeholder="e.g. PCS"
                />
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all uppercase tracking-widest text-[10px]">
                {editingId ? 'Save Changes' : 'Register Unit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitManagement;
