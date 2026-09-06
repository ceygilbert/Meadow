
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
  ArrowRight,
  MoreHorizontal,
  User,
  Mail,
  Calendar,
  DollarSign
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Order } from '../../types';

const Finances: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [actionDropdownId, setActionDropdownId] = useState<string | null>(null);

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
      
      if (sbError) {
        // Fallback to simple orders query if relationship embeds are not defined in schema cache
        const { data: simpleData, error: simpleError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (simpleError) throw simpleError;
        setOrders(simpleData || []);
      } else {
        setOrders(data || []);
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err);
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

  
  const getPaymentStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'processing': return 'bg-emerald-100 text-emerald-700 border-emerald-200'; // paid
      case 'shipped': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200'; // refunded/void
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPaymentStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Unpaid';
      case 'processing':
      case 'shipped':
      case 'completed': return 'Paid';
      case 'cancelled': return 'Refunded';
      default: return 'Unknown';
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
          <h1 className="text-2xl font-bold text-slate-900">Finances</h1>
          <p className="text-slate-500 text-sm">Track payments, invoices, and revenue records.</p>
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
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-sm"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-slate-800" size={32} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="py-4 px-6 text-xs font-semibold text-slate-900">Invoice ID</th>
                  <th className="py-4 px-4 text-xs font-semibold text-slate-900">Customer</th>
                  <th className="py-4 px-4 text-xs font-semibold text-slate-900">Date</th>
                  <th className="py-4 px-4 text-xs font-semibold text-slate-900">Amount</th>
                  <th className="py-4 px-4 text-xs font-semibold text-slate-900">Status</th>
                  <th className="py-4 pr-6 pl-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 pl-6 pr-4">
                      <span className="text-xs font-bold text-slate-900 font-mono">#{order.id.slice(0, 8)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 truncate">{order.customer_name}</span>
                        <span className="text-[11px] font-medium text-slate-400">{order.customer_email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-slate-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-xs font-semibold text-slate-900">
                      RM{order.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold ${getPaymentStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {getPaymentStatusText(order.status)}
                      </div>
                    </td>
                    <td className="py-4 pr-6 pl-4 text-right relative">
                      <div className="flex items-center justify-end">
                        <button 
                          onClick={() => setActionDropdownId(actionDropdownId === order.id ? null : order.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60 transition-all"
                        >
                          <MoreHorizontal size={15} />
                        </button>
                      </div>
                      
                      {actionDropdownId === order.id && (
                        <div className="absolute right-6 top-12 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-100 z-50 py-1.5 animate-in fade-in slide-in-from-top-2">
                          <button onClick={() => { setActionDropdownId(null); setSelectedOrder(order); }} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                            <Eye size={14} /> View Details
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400 font-medium">
                      <Receipt className="mx-auto text-slate-200 mb-4" size={48} strokeWidth={1} />
                      No financial records found.
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
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Invoice / Order ID: {selectedOrder.id}</p>
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

export default Finances;
