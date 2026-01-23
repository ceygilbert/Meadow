import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  History, 
  Clock, 
  CreditCard,
  User,
  Star,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Profile, Order } from '../../types';

const CustomerDashboard: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const [profileRes, ordersRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', session.user.id).single(),
        supabase.from('orders').select('*, order_items(*)').eq('customer_id', session.user.id).order('created_at', { ascending: false }).limit(5)
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (ordersRes.data) setOrders(ordersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Calibrating User Session...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[3rem] text-white shadow-2xl shadow-blue-600/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-20 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
           <h1 className="text-4xl font-black tracking-tighter mb-2">
             Welcome back, <span className="italic">{profile?.full_name?.split(' ')[0] || 'Member'}</span>!
           </h1>
           <p className="text-blue-100 font-medium opacity-80 max-w-md">
             Your specialized hardware workspace is active. Manage your rig upgrades and order history here.
           </p>
        </div>
        <div className="flex gap-4 relative z-10">
           <div className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-100 mb-1">Status</p>
              <div className="flex items-center gap-2 justify-center">
                 <Star size={14} className="text-amber-400 fill-current" />
                 <span className="font-bold text-sm uppercase">Gold Client</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Statistics Column */}
        <div className="space-y-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Account Summary</h3>
                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <User size={18} />
                 </div>
              </div>
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-500">Total Acquisitions</span>
                    <span className="text-xl font-black text-slate-900">{orders.length} Units</span>
                 </div>
                 <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-[65%] rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]"></div>
                 </div>
                 <p className="text-[10px] text-slate-400 font-medium">You are 3 orders away from Platinum tier rewards.</p>
              </div>
           </div>

           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-900/20">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-8">Technical Support</h3>
              <p className="text-sm font-medium text-slate-400 leading-relaxed mb-8">
                Need help with assembly or firmware for your recent acquisitions? Our expert technicians are on standby.
              </p>
              <button className="w-full py-4 bg-white text-slate-900 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">
                Open Support Ticket
              </button>
           </div>
        </div>

        {/* Orders Column */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between px-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                 <History size={18} className="text-blue-600" /> Recent Acquisitions
              </h2>
              <button className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors flex items-center gap-1">
                 View Full History <ArrowRight size={12} />
              </button>
           </div>

           <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-white p-20 rounded-[3rem] border border-dashed border-slate-200 text-center">
                   <ShoppingBag className="mx-auto text-slate-100 mb-6" size={80} strokeWidth={1} />
                   <p className="text-slate-400 font-black uppercase tracking-widest text-xs mb-8">No hardware deals on record.</p>
                   <Link to="/" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20">Start Building &rarr;</Link>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-lg shadow-slate-200/10 flex items-center justify-between group hover:border-blue-200 transition-all">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                           <Zap size={24} />
                        </div>
                        <div>
                           <div className="flex items-center gap-3">
                              <span className="font-black text-slate-900 uppercase text-sm">Order #{order.id.slice(0, 8)}</span>
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-emerald-100">
                                {order.status}
                              </span>
                           </div>
                           <div className="flex items-center gap-4 mt-1">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                <Clock size={10} /> {new Date(order.created_at).toLocaleDateString()}
                              </span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                <CreditCard size={10} /> RM{order.total_amount.toLocaleString()}
                              </span>
                           </div>
                        </div>
                     </div>
                     <button className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <ArrowRight size={20} />
                     </button>
                  </div>
                ))
              )}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100/50 flex items-center gap-6">
                 <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 border border-blue-100">
                    <Cpu size={20} />
                 </div>
                 <div>
                    <h4 className="font-black text-blue-900 text-xs uppercase tracking-tight">Active Warranty</h4>
                    <p className="text-[10px] text-blue-600 font-medium">3 Components covered until 2026</p>
                 </div>
              </div>
              <div className="p-8 bg-emerald-50/50 rounded-3xl border border-emerald-100/50 flex items-center gap-6">
                 <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-600 border border-emerald-100">
                    <ShieldCheck size={20} />
                 </div>
                 <div>
                    <h4 className="font-black text-emerald-900 text-xs uppercase tracking-tight">System Health</h4>
                    <p className="text-[10px] text-emerald-600 font-medium">Precision verification pass</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;