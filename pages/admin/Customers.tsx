import React, { useState, useEffect } from 'react';
import { Users, Search, Loader2, AlertCircle, Edit2, Trash2, Plus, X, ArrowRight, MoreHorizontal, Mail, Phone, MapPin, Eye, ShoppingBag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Profile } from '../../types';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<Profile>>({});
  const [password, setPassword] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  
  const [actionDropdownId, setActionDropdownId] = useState<string | null>(null);
  
  const [selectedCustomer, setSelectedCustomer] = useState<Profile | null>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data, error: sbError } = await supabase
        .from('profiles')
        .select(`
          *,
          orders:orders(total_amount)
        `)
        .eq('role', 'customer')
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    try {
      const { error: sbError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
        
      if (sbError) throw sbError;
      fetchCustomers();
    } catch (err: any) {
      console.error(err);
      alert('Failed to delete user.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (currentUser.id) {
        // Edit existing
        const res = await fetch('/api/admin/update-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: currentUser.id,
            full_name: currentUser.full_name,
            phone: currentUser.phone,
            address: currentUser.address,
            role: 'customer',
            password: password
          })
        });
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned an invalid response (not JSON). Ensure your backend Express server is running in production.");
        }
        
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      } else {
        // Create new
        const res = await fetch('/api/admin/create-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: currentUser.email,
            password: password,
            full_name: currentUser.full_name,
            phone: currentUser.phone,
            address: currentUser.address,
            role: 'customer'
          })
        });
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned an invalid response (not JSON). Ensure your backend Express server is running in production.");
        }
        
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
      }
      
      setIsEditing(false);
      fetchCustomers();
    } catch (err: any) {
      console.error(err);
      alert(`Failed to save customer: ${err.message}`);
    } finally {
      setFormLoading(false);
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
        <button 
          onClick={() => {
            setCurrentUser({ role: 'customer' });
            setPassword("");
            setIsEditing(true);
          }}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <Plus size={16} /> Add Customer
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name or email..."
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
                  <th className="py-4 px-6 text-xs font-semibold text-slate-900">Customer</th>
                  <th className="py-4 px-4 text-xs font-semibold text-slate-900">Phone</th>
                  <th className="py-4 px-4 text-xs font-semibold text-slate-900">Orders</th>
                  <th className="py-4 px-4 text-xs font-semibold text-slate-900">Total Spent</th>
                  <th className="py-4 pr-6 pl-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 pl-6 pr-4">
                      <div className="flex items-center gap-3.5 min-w-[220px]">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200/70 flex items-center justify-center shrink-0">
                          <img src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-xs font-bold text-slate-900 truncate">{user.full_name}</span>
                          <span className="text-[11px] font-medium text-slate-400">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-slate-600">
                      {user.phone || '-'}
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-slate-600">
                      {user.order_count || 0}
                    </td>
                    <td className="py-4 px-4 text-xs font-semibold text-slate-900">
                      RM{user.total_spent?.toLocaleString() || 0}
                    </td>
                    <td className="py-4 pr-6 pl-4 text-right relative">
                      <div className="flex items-center justify-end">
                        <button 
                          onClick={() => setActionDropdownId(actionDropdownId === user.id ? null : user.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60 transition-all"
                        >
                          <MoreHorizontal size={15} />
                        </button>
                      </div>
                      
                      {actionDropdownId === user.id && (
                        <div className="absolute right-6 top-12 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-100 z-50 py-1.5 animate-in fade-in slide-in-from-top-2">
                          <button onClick={() => { setActionDropdownId(null); fetchCustomerDetails(user); }} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                            <Eye size={14} /> Insights
                          </button>
                          <button onClick={() => { setActionDropdownId(null); setCurrentUser(user); setPassword(""); setIsEditing(true); }} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                            <Edit2 size={14} /> Edit Customer
                          </button>
                          <div className="h-px bg-slate-100 my-1 mx-2" />
                          <button onClick={() => { setActionDropdownId(null); handleDelete(user.id); }} className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400 font-medium">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit/Create Modal (matching Products pattern) */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex justify-end">
          <div className="bg-[#F5F6F8] w-full max-w-3xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="px-6 md:px-8 py-5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsEditing(false)} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 rounded-full transition-colors">
                  <ArrowRight size={20} className="rotate-180" />
                </button>
                <h3 className="text-lg font-semibold text-slate-900">{currentUser.id ? 'Edit Customer' : 'Add Customer'}</h3>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-full hover:bg-slate-50 transition-colors text-sm">
                  Discard
                </button>
                <button type="submit" form="customer-form" disabled={formLoading} className="px-8 py-2.5 bg-slate-900 text-white font-medium rounded-full hover:bg-slate-800 transition-all text-sm flex items-center gap-2">
                  {formLoading && <Loader2 size={16} className="animate-spin" />}
                  {currentUser.id ? 'Save Changes' : 'Save'}
                </button>
              </div>
            </div>
            
            <form id="customer-form" onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <h4 className="text-lg font-semibold text-slate-900">Customer Details</h4>
                
                {!currentUser.id ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={currentUser.email || ''} 
                        onChange={e => setCurrentUser({...currentUser, email: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 placeholder:text-slate-400 transition-all"
                        placeholder="Enter customer email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                      <input 
                        type="password" 
                        required
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 placeholder:text-slate-400 transition-all"
                        placeholder="Create a password"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Reset Password <span className="text-slate-400 font-normal ml-1">(Leave blank to keep current)</span></label>
                    <input 
                      type="password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 placeholder:text-slate-400 transition-all"
                      placeholder="Enter new password"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={currentUser.full_name || ''} 
                    onChange={e => setCurrentUser({...currentUser, full_name: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 placeholder:text-slate-400 transition-all"
                    placeholder="Enter customer full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input 
                    type="text" 
                    value={currentUser.phone || ''} 
                    onChange={e => setCurrentUser({...currentUser, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 placeholder:text-slate-400 transition-all"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Shipping Address</label>
                  <textarea 
                    rows={4}
                    value={currentUser.address || ''} 
                    onChange={e => setCurrentUser({...currentUser, address: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 placeholder:text-slate-400 transition-all"
                    placeholder="Enter full shipping address"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Insights Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[120] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-300">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 flex shrink-0">
                    <img src={selectedCustomer.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCustomer.id}`} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedCustomer.full_name}</h3>
                    <p className="text-xs text-slate-500 font-medium">Customer Account Analytics</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCustomer(null)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                   <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-6">Account Details</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                           <Mail size={16} className="text-slate-400" />
                           <span className="text-slate-700 truncate font-medium">{selectedCustomer.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                           <Phone size={16} className="text-slate-400" />
                           <span className="text-slate-700 font-medium">{selectedCustomer.phone || 'No phone recorded'}</span>
                        </div>
                        <div className="flex items-start gap-3 text-sm">
                           <MapPin size={16} className="text-slate-400 mt-1 shrink-0" />
                           <span className="text-slate-700 leading-relaxed font-medium">{selectedCustomer.address || 'No billing address provided.'}</span>
                        </div>
                      </div>
                   </div>

                   <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">Lifetime Value</h4>
                      <div className="flex items-end gap-2">
                         <span className="text-3xl font-bold">RM{selectedCustomer.total_spent?.toLocaleString()}</span>
                         <span className="text-slate-400 text-xs font-medium mb-1.5">Total Spent</span>
                      </div>
                      <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center">
                         <div className="text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Orders</p>
                            <p className="text-lg font-bold mt-1">{selectedCustomer.order_count}</p>
                         </div>
                         <div className="w-px h-8 bg-slate-800"></div>
                         <div className="text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Avg Tick</p>
                            <p className="text-lg font-bold mt-1">
                               RM{selectedCustomer.order_count ? (selectedCustomer.total_spent! / selectedCustomer.order_count).toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0}
                            </p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                   <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                     <ShoppingBag size={14} /> Transaction History
                   </h4>
                   
                   {ordersLoading ? (
                     <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-400" /></div>
                   ) : (
                     <div className="space-y-4">
                       {customerOrders.map(order => (
                         <div key={order.id} className="p-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between group hover:border-slate-300 transition-all shadow-sm">
                            <div className="flex items-center gap-5">
                               <div className="text-center bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                  <p className="text-[10px] font-semibold text-slate-500 uppercase leading-none mb-1">{new Date(order.created_at).toLocaleDateString(undefined, { month: 'short' })}</p>
                                  <p className="text-lg font-bold text-slate-900 leading-none">{new Date(order.created_at).getDate()}</p>
                               </div>
                               <div>
                                  <p className="font-semibold text-slate-900 text-sm">Order #{order.id.slice(0, 8)}</p>
                                  <p className="text-xs text-slate-500 font-medium mt-1">{order.order_items?.length} Items • {order.status}</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="font-bold text-slate-900 text-sm">RM{order.total_amount.toLocaleString()}</p>
                            </div>
                         </div>
                       ))}
                       {customerOrders.length === 0 && (
                         <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                           <p className="text-slate-500 text-sm font-medium">No orders found.</p>
                         </div>
                       )}
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
