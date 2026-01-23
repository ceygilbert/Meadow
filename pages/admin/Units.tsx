
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Ruler, X, Loader2, AlertCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Unit } from '../../types';

const UnitManagement: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Unit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filtered = units.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Units of Measurement</h1>
          <p className="text-slate-500 text-sm">Define stock units like PCS, SET, UNIT, or BOX.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-bold transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={18} />
          New Unit
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder="Search units..."
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
          <button onClick={fetchUnits} className="mt-4 text-sm font-bold underline">Retry</button>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((unit) => (
                <tr key={unit.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="font-bold text-slate-900">{unit.name}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(unit)} className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => setItemToDelete(unit)} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-8 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No units found</td>
                </tr>
              )}
            </tbody>
          </table>
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
