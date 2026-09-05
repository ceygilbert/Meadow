
import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Search, 
  Loader2, 
  AlertCircle, 
  RotateCcw, 
  CheckCircle2, 
  History,
  X,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  AlertTriangle,
  SlidersHorizontal,
  ArrowDownAZ,
  MoreHorizontal
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Product, StockLog } from '../../types';
import { AdminTablePagination } from '../../components/AdminTablePagination';

interface AuditItem extends Product {
  actual_count: number;
}

const StockTake: React.FC = () => {
  const [products, setProducts] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [logs, setLogs] = useState<StockLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  
  // Custom Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Reference Table Design Pattern States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'variance' | 'in_sync'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from('products')
        .select('*')
        .order('name');
      if (sbError) throw sbError;
      
      const auditData = (data || []).map(p => ({ ...p, actual_count: p.stock }));
      setProducts(auditData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const { data, error: sbError } = await supabase
        .from('stock_logs')
        .select('*, products(name)')
        .order('created_at', { ascending: false })
        .limit(50);
      if (sbError) throw sbError;
      setLogs(data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleCountChange = (id: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setProducts(prev => prev.map(p => p.id === id ? { ...p, actual_count: Math.max(0, numValue) } : p));
  };

  const handleAuditRequest = () => {
    const modifiedItems = products.filter(p => p.actual_count !== p.stock);
    if (modifiedItems.length === 0) {
      setStatusMsg({ type: 'error', text: "No stock discrepancies detected. Adjust 'Actual' values first." });
      return;
    }
    setShowConfirmModal(true);
  };

  const commitAudit = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);
    setStatusMsg(null);
    
    const modifiedItems = products.filter(p => p.actual_count !== p.stock);

    try {
      for (const item of modifiedItems) {
        // 1. Log the change
        const { error: logError } = await supabase.from('stock_logs').insert([{
          product_id: item.id,
          change_amount: item.actual_count - item.stock,
          previous_stock: item.stock,
          new_stock: item.actual_count,
          reason: 'Physical Stock Take'
        }]);

        if (logError) throw logError;

        // 2. Update product stock
        const { error: updateError } = await supabase
          .from('products')
          .update({ stock: item.actual_count })
          .eq('id', item.id);

        if (updateError) throw updateError;
      }

      setStatusMsg({ type: 'success', text: "Inventory successfully synchronized with physical count." });
      fetchInventory();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: "Inventory Update Failed: " + err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Filter, sort and pagination matching reference pattern
  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    const variance = p.actual_count - p.stock;
    if (statusFilter === 'variance') return variance !== 0;
    if (statusFilter === 'in_sync') return variance === 0;
    return true;
  }).sort((a, b) => {
    if (sortOrder === 'asc') return a.name.localeCompare(b.name);
    return b.name.localeCompare(a.name);
  });

  const totalModifications = products.filter(p => p.actual_count !== p.stock).length;
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedItems.map(p => p.id));
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
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Stock Take</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => { setHistoryOpen(true); fetchLogs(); }}
            className="bg-white border border-slate-200/90 text-slate-700 rounded-full px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 transition-all shadow-xs flex items-center gap-1.5"
          >
            <History size={14} className="text-slate-500" />
            <span>Audit History</span>
          </button>
          <button 
            onClick={handleAuditRequest}
            disabled={submitting || totalModifications === 0}
            className="bg-slate-950 text-white rounded-full px-5 py-2.5 text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs flex items-center gap-2 disabled:opacity-40"
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
            <span>Commit Audit {totalModifications > 0 && `(${totalModifications})`}</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-2xl flex items-center justify-between border animate-in slide-in-from-top duration-300 ${
          statusMsg.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          <div className="flex items-center gap-3">
            {statusMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="font-semibold text-xs">{statusMsg.text}</span>
          </div>
          <button onClick={() => setStatusMsg(null)} className="p-1 hover:bg-black/5 rounded-full">
            <X size={15} />
          </button>
        </div>
      )}

      {/* Filter & Search Bar Row Matching Screenshot */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Pill Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Search hardware asset..."
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
          {/* Status Filter Pill */}
          <button
            onClick={() => {
              const next = statusFilter === 'all' ? 'variance' : statusFilter === 'variance' ? 'in_sync' : 'all';
              setStatusFilter(next);
              setCurrentPage(1);
            }}
            className="bg-white border border-slate-200/90 hover:border-slate-300 text-slate-700 px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs transition-all"
          >
            <SlidersHorizontal size={14} className="text-slate-500" />
            <span>{statusFilter === 'all' ? 'Show All Products' : statusFilter === 'variance' ? 'Variances Only' : 'In Sync Only'}</span>
          </button>

          {/* Sort Pill */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="bg-white border border-slate-200/90 hover:border-slate-300 text-slate-700 px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs transition-all"
          >
            <ArrowDownAZ size={14} className="text-slate-500" />
            <span>Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <Loader2 className="animate-spin text-slate-800" size={36} />
          <p className="text-slate-400 font-semibold text-xs tracking-wider uppercase">Loading Audit Data...</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-red-50 text-red-600 rounded-2xl text-center border border-red-100 shadow-xs">
          <AlertCircle className="mx-auto mb-3" size={32} />
          <h3 className="text-sm font-bold mb-1">Sync Error</h3>
          <p className="text-xs font-medium opacity-80 mb-4">{error}</p>
          <button onClick={fetchInventory} className="px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-semibold">Retry Sync</button>
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
                        checked={paginatedItems.length > 0 && selectedIds.length === paginatedItems.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-slate-900">Product</th>
                    <th className="py-4 px-4 text-xs font-semibold text-slate-900">Status</th>
                    <th className="py-4 px-4 text-xs font-semibold text-slate-900">System Count</th>
                    <th className="py-4 px-4 text-xs font-semibold text-slate-900">Physical Count</th>
                    <th className="py-4 px-4 text-xs font-semibold text-slate-900">Variance</th>
                    <th className="py-4 pr-6 pl-4 w-12 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedItems.map((p) => {
                    const variance = p.actual_count - p.stock;
                    const isSelected = selectedIds.includes(p.id);

                    return (
                      <tr 
                        key={p.id} 
                        className={`hover:bg-slate-50/70 transition-colors ${variance !== 0 ? 'bg-amber-50/15' : ''} ${isSelected ? 'bg-slate-50/50' : ''}`}
                      >
                        {/* Checkbox */}
                        <td className="py-4 pl-6 pr-3">
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(p.id)}
                            className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                          />
                        </td>

                        {/* Product Thumbnail + Name */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3.5 min-w-[220px]">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200/70 flex items-center justify-center shrink-0">
                              {p.image_url ? (
                                <img src={p.image_url} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <Package size={20} className="text-slate-300" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="block text-xs font-bold text-slate-900 truncate">
                                {p.name}
                              </span>
                              <span className="text-[11px] font-medium text-slate-400">
                                SKU: {p.id.slice(0, 8)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Status Pill Badge */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {variance === 0 ? (
                            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/40">
                              In Sync
                            </span>
                          ) : variance > 0 ? (
                            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-200/40">
                              Surplus (+{variance})
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200/40">
                              Deficit ({variance})
                            </span>
                          )}
                        </td>

                        {/* System Count */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="text-xs font-semibold text-slate-900">
                            {p.stock} Units
                          </span>
                        </td>

                        {/* Physical Count Input */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <input 
                            type="number"
                            className="w-24 px-3 py-1.5 rounded-full border border-slate-200/90 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-400 bg-white transition-all shadow-2xs"
                            value={p.actual_count}
                            onChange={(e) => handleCountChange(p.id, e.target.value)}
                          />
                        </td>

                        {/* Variance Indicator */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {variance === 0 ? (
                            <span className="text-xs font-medium text-slate-400">0</span>
                          ) : (
                            <div className={`flex items-center gap-1 font-bold text-xs ${variance > 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                              {variance > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                              {variance > 0 ? `+${variance}` : variance}
                            </div>
                          )}
                        </td>

                        {/* Options */}
                        <td className="py-4 pr-6 pl-4 text-right">
                          <button 
                            onClick={() => handleCountChange(p.id, String(p.stock))}
                            className="w-8 h-8 rounded-full inline-flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60 transition-all"
                            title="Reset count to system"
                          >
                            <RotateCcw size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {paginatedItems.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-xs font-medium text-slate-400">
                        No matching hardware items found.
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[120] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-amber-100">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Sync Inventory?</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                You are about to adjust stock levels for <span className="font-bold text-slate-900">{totalModifications} items</span> based on your physical audit. This will update the live catalog.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={commitAudit}
                  className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-900/20 uppercase tracking-widest text-[11px]"
                >
                  Apply Adjustments
                </button>
                <button 
                  onClick={() => setShowConfirmModal(false)} 
                  className="w-full py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-[11px]"
                >
                  Keep Reviewing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Side-over */}
      {historyOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex justify-end">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Movement Logs</h3>
                <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">Inventory History (Last 50)</p>
              </div>
              <button onClick={() => setHistoryOpen(false)} className="p-3 text-slate-400 hover:bg-white rounded-full transition-all shadow-sm">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-4">
              {logsLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-blue-600" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading History...</p>
                </div>
              ) : (
                <>
                  {logs.map((log: any) => (
                    <div key={log.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-start justify-between group hover:border-blue-200 transition-all">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{log.products?.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase bg-white px-2 py-0.5 rounded border border-slate-200">{log.reason}</span>
                          <span className="text-[10px] text-slate-400 font-bold">• {new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                         <div className={`text-sm font-black flex items-center gap-1 justify-end ${log.change_amount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                           {log.change_amount > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                           {log.change_amount > 0 ? `+${log.change_amount}` : log.change_amount}
                         </div>
                         <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Final Stock: {log.new_stock}</p>
                      </div>
                    </div>
                  ))}
                  {logs.length === 0 && (
                    <div className="text-center py-20">
                      <Info className="mx-auto text-slate-200 mb-4" size={40} />
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No inventory movement recorded.</p>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="p-8 border-t border-slate-100 bg-slate-50 shrink-0">
               <button onClick={() => setHistoryOpen(false)} className="w-full py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest text-[10px]">
                 Close History
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockTake;
