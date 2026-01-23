
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
  AlertTriangle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Product, StockLog } from '../../types';

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

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalModifications = products.filter(p => p.actual_count !== p.stock).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Stock Take Audit</h1>
          <p className="text-slate-500 text-sm">Perform physical inventory checks and sync database records.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => { setHistoryOpen(true); fetchLogs(); }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 font-bold transition-all"
          >
            <History size={18} />
            View History
          </button>
          <button 
            onClick={handleAuditRequest}
            disabled={submitting || totalModifications === 0}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 font-bold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
            Commit Audit {totalModifications > 0 && `(${totalModifications})`}
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-2xl flex items-center justify-between border animate-in slide-in-from-top duration-300 ${
          statusMsg.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          <div className="flex items-center gap-3">
            {statusMsg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-bold text-sm">{statusMsg.text}</span>
          </div>
          <button onClick={() => setStatusMsg(null)} className="p-1 hover:bg-black/5 rounded-full">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search hardware asset..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
          />
        </div>
        <button 
          onClick={fetchInventory}
          className="p-3 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-200 transition-colors"
          title="Refresh Data"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-slate-400 font-medium">Fetching Catalog Data...</p>
        </div>
      ) : error ? (
        <div className="p-12 bg-red-50 text-red-600 rounded-[2.5rem] text-center border border-red-100 shadow-sm">
          <AlertCircle className="mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold mb-2">Sync Error</h3>
          <p className="font-medium opacity-80 mb-6">{error}</p>
          <button onClick={fetchInventory} className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold">Retry Sync</button>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hardware Asset</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">System Count</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actual Physical Count</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((p) => {
                  const variance = p.actual_count - p.stock;
                  return (
                    <tr key={p.id} className={`transition-colors ${variance !== 0 ? 'bg-amber-50/20' : 'hover:bg-slate-50/50'}`}>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center shrink-0">
                              {p.image_url ? (
                                <img src={p.image_url} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <Package size={20} className="text-slate-300" />
                              )}
                           </div>
                           <div>
                            <span className="block font-bold text-slate-900 truncate max-w-[250px]">{p.name}</span>
                            {variance !== 0 && <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Awaiting Sync</span>}
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-black text-slate-400">{p.stock} Units</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <input 
                            type="number"
                            className={`w-28 px-4 py-2.5 rounded-xl border-2 font-bold transition-all outline-none ${
                              variance === 0 
                                ? 'border-slate-100 bg-white focus:border-blue-500' 
                                : variance > 0 
                                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 focus:border-emerald-500' 
                                  : 'border-rose-200 bg-rose-50 text-rose-700 focus:border-rose-500'
                            }`}
                            value={p.actual_count}
                            onChange={(e) => handleCountChange(p.id, e.target.value)}
                          />
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         {variance === 0 ? (
                           <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">In Sync</span>
                         ) : (
                           <div className={`flex items-center gap-1.5 font-black text-sm ${variance > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                             {variance > 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                             {variance > 0 ? `+${variance}` : variance}
                           </div>
                         )}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-24 text-center">
                      <div className="max-w-xs mx-auto">
                        <Package className="mx-auto text-slate-200 mb-4" size={48} strokeWidth={1} />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No matching hardware in local stock.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
