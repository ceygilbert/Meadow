
import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Search, 
  Loader2, 
  AlertCircle, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Truck, 
  PackageCheck, 
  XCircle,
  X,
  User,
  Mail,
  Calendar,
  DollarSign
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Order } from '../../types';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error: sbError } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .order('created_at', { ascending: false });
      if (sbError) throw sbError;
      setOrders(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingStatus(orderId);
    try {
      const { error: sbError } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      if (sbError) throw sbError;
      
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err: any) {
      alert("Status Update Failed: " + err.message);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock size={14} />;
      case 'processing': return <Loader2 size={14} className="animate-spin" />;
      case 'shipped': return <Truck size={14} />;
      case 'completed': return <CheckCircle2 size={14} />;
      case 'cancelled': return <XCircle size={14} />;
    }
  };

  const filteredOrders = orders.filter(o => 
    o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
          <p className="text-slate-500 text-sm">Monitor customer deals and manage fulfillment.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by customer or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-slate-400 font-medium">Fetching Transactions...</p>
        </div>
      ) : error ? (
        <div className="p-12 bg-red-50 text-red-600 rounded-[2.5rem] text-center border border-red-100 shadow-sm">
          <AlertCircle className="mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold mb-2">Sync Error</h3>
          <p className="font-medium opacity-80 mb-6">{error}</p>
          <button onClick={fetchOrders} className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold">Retry</button>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="text-xs font-black text-slate-400 uppercase font-mono">#{order.id.slice(0, 8)}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{order.customer_name}</span>
                        <span className="text-[10px] text-slate-400">{order.customer_email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString()}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-black text-slate-900">RM{order.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-8 py-24 text-center">
                      <Receipt className="mx-auto text-slate-200 mb-4" size={48} strokeWidth={1} />
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No transactions recorded.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[120] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Order Details</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Transaction ID: {selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-3 text-slate-400 hover:bg-white rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                    <PackageCheck size={14} /> Purchased Items
                  </h4>
                  <div className="space-y-4">
                    {selectedOrder.order_items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                          {item.products?.image_url && <img src={item.products.image_url} className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate">{item.products?.name || 'Unknown Product'}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">RM{item.unit_price.toLocaleString()} x {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-900">RM{(item.unit_price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Order Total</span>
                    <span className="text-2xl font-black text-blue-600">RM{selectedOrder.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                    <User size={14} /> Customer Info
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 border border-slate-100">
                         <User size={16} />
                       </div>
                       <span className="text-sm font-bold text-slate-900">{selectedOrder.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 border border-slate-100">
                         <Mail size={16} />
                       </div>
                       <span className="text-sm font-medium text-slate-500 truncate">{selectedOrder.customer_email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 border border-slate-100">
                         <Calendar size={16} />
                       </div>
                       <span className="text-sm font-medium text-slate-500">{new Date(selectedOrder.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                    <Receipt size={14} /> Actions
                  </h4>
                  <div className="space-y-2">
                    {['pending', 'processing', 'shipped', 'completed', 'cancelled'].map((status) => (
                      <button 
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder.id, status as any)}
                        disabled={updatingStatus === selectedOrder.id || selectedOrder.status === status}
                        className={`w-full py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                          selectedOrder.status === status 
                            ? getStatusColor(status as any) 
                            : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200 hover:text-blue-600'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20"
              >
                Close Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
