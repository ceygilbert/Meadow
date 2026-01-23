
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Loader2, 
  AlertCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  ChevronRight,
  Eye,
  ShoppingBag,
  TrendingUp,
  X
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Profile } from '../../types';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Profile | null>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Query profiles and join with orders to get summary stats
      const { data, error: sbError } = await supabase
        .from('profiles')
        .select(`
          *,
          orders:orders(total_amount)
        `)
        .order('created_at', { ascending: false });

      if (sbError) throw sbError;

      const profilesWithStats = (data || []).map((p: any) => ({
        ...p,
        total_spent: p.orders.reduce((acc: number, o: any) => acc + o.total_amount, 0),
        order_count: p.orders.length
      }));

      setCustomers(profilesWithStats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerDetails = async (customer: Profile) => {
    setSelectedCustomer(customer);
    setOrdersLoading(true);
    try {
      const { data, error: sbError } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false });
      
      if (sbError) throw sbError;
      setCustomerOrders(data || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const filtered = customers.filter(c => 
    c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customer Directory</h1>
          <p className="text-slate-500 text-sm">Review registered user accounts and their purchasing patterns.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-slate-400 font-medium tracking-widest uppercase text-[10px]">Syncing User Base...</p>
        </div>
      ) : error ? (
        <div className="p-12 bg-rose-50 text-rose-600 rounded-[2.5rem] text-center border border-rose-100 shadow-sm">
          <AlertCircle className="mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold mb-2">Sync Error</h3>
          <p className="font-medium opacity-80 mb-6">{error}</p>
          <button onClick={fetchCustomers} className="px-6 py-2 bg-rose-600 text-white rounded-xl font-bold">Retry Sync</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((customer) => (
            <div key={customer.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 p-8 hover:border-blue-200 transition-all group overflow-hidden relative">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-inner">
                    <img 
                      src={customer.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.id}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-black text-slate-900 truncate tracking-tight">{customer.full_name || 'Incognito User'}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                       <Calendar size={10} /> Joined {new Date(customer.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => fetchCustomerDetails(customer)}
                  className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                >
                  <Eye size={18} />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-slate-500 text-sm">
                  <Mail size={16} className="text-slate-300" />
                  <span className="truncate font-medium">{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-3 text-slate-500 text-sm">
                    <Phone size={16} className="text-slate-300" />
                    <span className="font-medium">{customer.phone}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-50">
                <div className="p-4 bg-slate-50 rounded-2xl">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Orders</p>
                   <div className="flex items-center gap-2">
                     <ShoppingBag size={14} className="text-blue-500" />
                     <span className="font-black text-slate-900">{customer.order_count}</span>
                   </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Spent</p>
                   <div className="flex items-center gap-2">
                     <TrendingUp size={14} className="text-emerald-500" />
                     <span className="font-black text-slate-900">RM{customer.total_spent?.toLocaleString()}</span>
                   </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
               <Users className="mx-auto text-slate-200 mb-6" size={64} strokeWidth={1} />
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No users matching search criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Customer Insights Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[120] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-300">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200">
                    <img src={selectedCustomer.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCustomer.id}`} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{selectedCustomer.full_name}</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Customer Account Analytics</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="p-3 text-slate-400 hover:bg-white rounded-full transition-colors">
                  <X size={24} />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                   <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Account Details</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                           <Mail size={16} className="text-slate-300" />
                           <span className="text-slate-600 truncate">{selectedCustomer.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                           <Phone size={16} className="text-slate-300" />
                           <span className="text-slate-600">{selectedCustomer.phone || 'No phone recorded'}</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                           <MapPin size={16} className="text-slate-300 mt-1 shrink-0" />
                           <span className="text-slate-600 leading-relaxed">{selectedCustomer.address || 'No billing address provided.'}</span>
                        </div>
                      </div>
                   </div>

                   <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-600/20">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100 mb-6">Lifetime Value</h4>
                      <div className="flex items-end gap-2">
                         <span className="text-4xl font-black">RM{selectedCustomer.total_spent?.toLocaleString()}</span>
                         <span className="text-blue-200 text-xs font-bold mb-1.5">Total Spent</span>
                      </div>
                      <div className="mt-8 pt-8 border-t border-blue-500/30 flex justify-between items-center">
                         <div className="text-center">
                            <p className="text-[10px] font-black uppercase text-blue-100">Orders</p>
                            <p className="text-xl font-black mt-1">{selectedCustomer.order_count}</p>
                         </div>
                         <div className="w-px h-10 bg-blue-500/30"></div>
                         <div className="text-center">
                            <p className="text-[10px] font-black uppercase text-blue-100">Avg Tick</p>
                            <p className="text-xl font-black mt-1">
                               RM{selectedCustomer.order_count ? (selectedCustomer.total_spent! / selectedCustomer.order_count).toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0}
                            </p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                     <ShoppingBag size={14} /> Transaction History
                   </h4>

                   {ordersLoading ? (
                     <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" /></div>
                   ) : (
                     <div className="space-y-4">
                       {customerOrders.map(order => (
                         <div key={order.id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-between group hover:bg-white hover:border-blue-100 transition-all">
                            <div className="flex items-center gap-6">
                               <div className="text-center bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                                  <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{new Date(order.created_at).toLocaleDateString(undefined, { month: 'short' })}</p>
                                  <p className="text-xl font-black text-slate-900 leading-none">{new Date(order.created_at).getDate()}</p>
                               </div>
                               <div>
                                  <p className="font-bold text-slate-900 uppercase text-xs tracking-tight">Order #{order.id.slice(0, 8)}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{order.order_items?.length} Items • {order.status}</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="font-black text-slate-900">RM{order.total_amount.toLocaleString()}</p>
                               <button className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 justify-end ml-auto">
                                 Details <ChevronRight size={12} />
                               </button>
                            </div>
                         </div>
                       ))}
                       {customerOrders.length === 0 && (
                         <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                           <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No orders found.</p>
                         </div>
                       )}
                     </div>
                   )}
                </div>
             </div>

             <div className="p-8 border-t border-slate-100 flex justify-end">
               <button onClick={() => setSelectedCustomer(null)} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20">
                 Dismiss View
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
