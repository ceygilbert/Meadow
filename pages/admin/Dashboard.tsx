import React, { useState, useEffect } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Loader2,
  RefreshCw,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Eye,
  TrendingUp,
  Layers,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Order, Product, Profile, Category, Brand } from '../../types';

interface ActivityItem {
  id: string;
  text: string;
  time: string;
  timestamp: number;
  type: 'order' | 'alert' | 'user' | 'product';
  badge: string;
  link?: string;
}

const StatsCard = ({ title, value, icon: Icon, subtext, color, trend, trendValue }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
      {trendValue && (
        <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
          trend === 'up' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' : 'bg-rose-50 text-rose-600 border border-rose-200/60'
        }`}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trendValue}
        </div>
      )}
    </div>
    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
    <p className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{value}</p>
    {subtext && <p className="text-xs text-slate-400 font-medium mt-1.5">{subtext}</p>}
  </div>
);

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [chartView, setChartView] = useState<'revenue' | 'orders'>('revenue');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersRes, productsRes, profilesRes, categoriesRes, brandsRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*'),
        supabase.from('brands').select('*')
      ]);

      if (ordersRes.error) throw ordersRes.error;
      if (productsRes.error) throw productsRes.error;
      if (profilesRes.error) throw profilesRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      if (brandsRes.error) throw brandsRes.error;

      setOrders(ordersRes.data || []);
      setProducts(productsRes.data || []);
      setCustomers(profilesRes.data || []);
      setCategories(categoriesRes.data || []);
      setBrands(brandsRes.data || []);
    } catch (err: any) {
      console.error("Error loading dashboard data:", err);
      setError(err.message || "Failed to load database metrics.");
    } finally {
      setLoading(false);
    }
  };

  // Calculations from Database Data
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing' || o.status === 'shipped');
  const completedOrders = orders.filter(o => o.status === 'completed');
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const lowStockProducts = products.filter(p => Number(p.stock) <= 5);
  const totalStockValue = products.reduce((acc, p) => acc + (Number(p.price || 0) * Number(p.stock || 0)), 0);

  // Calculate Relative Time
  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return 'Recently';
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Dynamic Chart Data Generation (Last 6 Months)
  const generateMonthlyChartData = () => {
    const monthsMap: { [key: string]: { name: string; sales: number; orders: number } } = {};
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthName = d.toLocaleString('en-US', { month: 'short' });
      monthsMap[monthKey] = {
        name: monthName,
        sales: 0,
        orders: 0
      };
    }

    orders.forEach(order => {
      if (order.status === 'cancelled') return;
      const orderDate = new Date(order.created_at);
      const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
      if (monthsMap[monthKey]) {
        monthsMap[monthKey].sales += Number(order.total_amount || 0);
        monthsMap[monthKey].orders += 1;
      }
    });

    return Object.values(monthsMap);
  };

  const chartData = generateMonthlyChartData();

  // Dynamic Recent Activities Feed from DB
  const generateActivities = (): ActivityItem[] => {
    const activities: ActivityItem[] = [];

    // Orders activities
    orders.slice(0, 5).forEach(o => {
      activities.push({
        id: `order-${o.id}`,
        text: `New order #${o.id.slice(0, 8)} by ${o.customer_name || 'Customer'} (RM${Number(o.total_amount).toLocaleString()})`,
        time: formatRelativeTime(o.created_at),
        timestamp: new Date(o.created_at).getTime(),
        type: 'order',
        badge: o.status,
        link: '/admin/orders'
      });
    });

    // Low stock alerts
    lowStockProducts.slice(0, 4).forEach(p => {
      activities.push({
        id: `stock-${p.id}`,
        text: `Low stock alert: "${p.name}" (${p.stock} remaining)`,
        time: formatRelativeTime(p.created_at),
        timestamp: Date.now() - 1000 * 60 * 30, // priority alert
        type: 'alert',
        badge: `${p.stock} left`,
        link: '/admin/products'
      });
    });

    // Customer registrations
    customers.slice(0, 3).forEach(c => {
      activities.push({
        id: `cust-${c.id}`,
        text: `New customer registered: ${c.full_name || c.email}`,
        time: formatRelativeTime(c.created_at),
        timestamp: new Date(c.created_at).getTime(),
        type: 'user',
        badge: 'Customer',
        link: '/admin/customers'
      });
    });

    // Sort by timestamp desc
    return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 6);
  };

  const recentActivities = generateActivities();

  // Order Status Breakdown Data
  const statusCounts = {
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-slate-500 font-bold text-sm tracking-wider uppercase">Loading Real-Time Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm font-medium">Real-time metrics & statistics directly from store database.</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold shadow-sm transition-all self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Sync Database
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center justify-between text-sm font-semibold">
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
          <button onClick={fetchDashboardData} className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold">Retry</button>
        </div>
      )}

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Revenue" 
          value={`RM${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          icon={DollarSign} 
          subtext={`From ${orders.length} total orders`}
          color="bg-blue-600" 
        />
        <StatsCard 
          title="Active Orders" 
          value={activeOrders.length} 
          icon={ShoppingCart} 
          subtext={`${pendingOrders.length} pending fulfillment`}
          color="bg-emerald-600" 
        />
        <StatsCard 
          title="Total Products" 
          value={products.length} 
          icon={Package} 
          subtext={`${lowStockProducts.length} low stock items`}
          color="bg-violet-600" 
        />
        <StatsCard 
          title="Total Customers" 
          value={customers.length} 
          icon={Users} 
          subtext="Registered accounts"
          color="bg-amber-600" 
        />
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-3">
          <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Stock Valuation</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">RM{totalStockValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="p-3 border-l border-slate-100">
          <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Completed Deals</p>
          <p className="text-xl font-extrabold text-emerald-600 mt-1">{completedOrders.length}</p>
        </div>
        <div className="p-3 border-l border-slate-100">
          <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Categories</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{categories.length}</p>
        </div>
        <div className="p-3 border-l border-slate-100">
          <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Brands Managed</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{brands.length}</p>
        </div>
      </div>

      {/* Main Charts & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recharts Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Sales & Orders Performance</h2>
              <p className="text-xs text-slate-400 font-medium">Aggregated from real database transactions</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setChartView('revenue')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  chartView === 'revenue' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Revenue (RM)
              </button>
              <button 
                onClick={() => setChartView('orders')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  chartView === 'orders' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Order Volume
              </button>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartView === 'revenue' ? (
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(v) => `RM${v}`} />
                  <Tooltip 
                    formatter={(value: any) => [`RM${Number(value).toLocaleString()}`, 'Revenue']}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} allowDecimals={false} />
                  <Tooltip 
                    formatter={(value: any) => [`${value} Orders`, 'Order Count']}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="orders" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Real Recent Activity Stream */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-base">Live Activity Feed</h2>
              <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">Database Live</span>
            </div>

            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex gap-3.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                      activity.type === 'order' ? 'bg-blue-600' : 
                      activity.type === 'alert' ? 'bg-rose-500' : 
                      activity.type === 'user' ? 'bg-emerald-500' : 'bg-violet-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-800 font-bold leading-snug">{activity.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400 font-medium">{activity.time}</span>
                        <span className="text-[9px] font-black uppercase text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{activity.badge}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs font-semibold">
                  No recent activities recorded in database.
                </div>
              )}
            </div>
          </div>

          <Link 
            to="/admin/orders" 
            className="w-full mt-6 py-2.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            View All Transactions <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {/* Bottom Row: Order Status Breakdown & Low Stock Alert Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Order Fulfillment Status Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="font-bold text-slate-900 text-base mb-6 flex items-center gap-2">
            <ShoppingBag size={18} className="text-blue-600" /> Order Status Distribution
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Pending Payment/Review', count: statusCounts.pending, color: 'bg-amber-500', textColor: 'text-amber-700', icon: Clock },
              { label: 'Processing & Assembly', count: statusCounts.processing, color: 'bg-blue-500', textColor: 'text-blue-700', icon: Loader2 },
              { label: 'Shipped & Out for Delivery', count: statusCounts.shipped, color: 'bg-indigo-500', textColor: 'text-indigo-700', icon: Truck },
              { label: 'Completed Transactions', count: statusCounts.completed, color: 'bg-emerald-500', textColor: 'text-emerald-700', icon: CheckCircle2 },
              { label: 'Cancelled Orders', count: statusCounts.cancelled, color: 'bg-rose-500', textColor: 'text-rose-700', icon: XCircle },
            ].map((st, i) => {
              const pct = orders.length > 0 ? Math.round((st.count / orders.length) * 100) : 0;
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="flex items-center gap-2 text-slate-700">
                      <st.icon size={14} className={st.textColor} />
                      {st.label}
                    </span>
                    <span className="text-slate-900 font-extrabold">{st.count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`${st.color} h-full rounded-full transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" /> Low Stock Watchlist
              </h2>
              <Link to="/admin/products" className="text-xs font-bold text-blue-600 hover:underline">
                Manage Inventory
              </Link>
            </div>

            {lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 4).map((p) => (
                  <div key={p.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Package size={16} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{p.name}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">RM{Number(p.price).toLocaleString()}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-black shrink-0 ${
                      p.stock === 0 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.stock === 0 ? 'Out of Stock' : `${p.stock} units left`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs font-semibold bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                All inventory levels are healthy (no items below 5 units).
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Items in Catalog: <strong className="text-slate-900 font-black">{products.length}</strong></span>
            <span>Stocked Units: <strong className="text-slate-900 font-black">{products.reduce((acc, p) => acc + Number(p.stock || 0), 0)}</strong></span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
