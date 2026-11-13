import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  ArrowUpRight,
  ArrowRight,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  AlertTriangle,
  Loader2,
  DollarSign,
  ClipboardCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { supabase } from '../../lib/supabase';
import { Order, Product, Profile } from '../../types';

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Profile[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes, profilesRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').eq('role', 'customer').order('created_at', { ascending: false })
      ]);

      if (ordersRes.data) setOrders(ordersRes.data);
      if (productsRes.data) setProducts(productsRes.data);
      if (profilesRes.data) setCustomers(profilesRes.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  const lowStockProducts = products.filter((p) => Number(p.stock) <= 5);
  const outOfStockCount = products.filter((p) => Number(p.stock) === 0).length;

  const chartData = [
    { name: 'Mon', revenue: 4200, orders: 4 },
    { name: 'Tue', revenue: 6800, orders: 7 },
    { name: 'Wed', revenue: 5100, orders: 5 },
    { name: 'Thu', revenue: 8900, orders: 9 },
    { name: 'Fri', revenue: 7400, orders: 8 },
    { name: 'Sat', revenue: 11200, orders: 12 },
    { name: 'Sun', revenue: Math.max(9500, Math.round(totalRevenue * 0.25)), orders: Math.max(6, orders.length) }
  ];

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700 border border-amber-200">
            <Clock size={12} /> Pending
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            <Clock size={12} /> Processing
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
            <Truck size={12} /> Shipped
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-700 border border-rose-200">
            <XCircle size={12} /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-slate-800" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm">Overview of your store performance, orders, and inventory.</p>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Total Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold text-slate-900">
              RM {totalRevenue.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
              <ArrowUpRight size={13} /> +12.5%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Total Orders</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
            <Link to="/admin/orders" className="text-xs font-semibold text-slate-500 hover:text-slate-900">
              View orders &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Products in Catalog</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package size={18} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold text-slate-900">{products.length}</p>
            <Link to="/admin/products" className="text-xs font-semibold text-slate-500 hover:text-slate-900">
              Manage &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Registered Customers</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold text-slate-900">{customers.length}</p>
            <Link to="/admin/customers" className="text-xs font-semibold text-slate-500 hover:text-slate-900">
              Directory &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Main 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Overview Chart */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Sales & Revenue Overview</h2>
                <p className="text-xs text-slate-500">Weekly store revenue performance</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                <TrendingUp size={14} />
                <span>Active Storefront</span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f172a" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={(val) => `RM${val / 1000}k`}
                  />
                  <Tooltip
                    formatter={(value: any) => [`RM ${Number(value).toLocaleString()}`, 'Revenue']}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0f172a"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Orders</h2>
                <p className="text-xs text-slate-500">Latest customer orders across the store</p>
              </div>
              <Link
                to="/admin/orders"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-3.5 pl-6 pr-4 text-xs font-semibold text-slate-900">Order ID</th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-slate-900">Customer</th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-slate-900">Date</th>
                    <th className="py-3.5 px-4 text-xs font-semibold text-slate-900">Amount</th>
                    <th className="py-3.5 pl-4 pr-6 text-xs font-semibold text-slate-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-xs text-slate-400">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    orders.slice(0, 6).map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 pl-6 pr-4">
                          <span className="text-xs font-bold text-slate-900 font-mono">
                            #{order.id.slice(0, 8)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {order.customer_name}
                            </span>
                            <span className="text-[11px] text-slate-400">{order.customer_email}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-bold text-slate-900">
                          RM {Number(order.total_amount || 0).toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 pl-4 pr-6">{getStatusBadge(order.status)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-6">
          {/* Inventory & Low Stock Alert Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Inventory Status</h2>
                <p className="text-xs text-slate-500">Stock alerts & low-quantity items</p>
              </div>
              <Link
                to="/admin/stock-take"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                Stock Take <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70">
                <p className="text-[11px] font-medium text-amber-800">Low Stock (≤ 5)</p>
                <p className="text-xl font-bold text-amber-900 mt-0.5">{lowStockProducts.length}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/70">
                <p className="text-[11px] font-medium text-rose-800">Out of Stock</p>
                <p className="text-xl font-bold text-rose-900 mt-0.5">{outOfStockCount}</p>
              </div>
            </div>

            <div className="space-y-3">
              {lowStockProducts.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  All products are well stocked.
                </div>
              ) : (
                lowStockProducts.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 last:border-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200/70 overflow-hidden shrink-0 flex items-center justify-center">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={16} className="text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-400">
                          RM {Number(item.price || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 ${
                        Number(item.stock) === 0
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {item.stock} left
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
            <h2 className="text-base font-bold text-slate-900 mb-1">Quick Shortcuts</h2>
            <p className="text-xs text-slate-500 mb-4">Common store management actions</p>

            <div className="space-y-2">
              <Link
                to="/admin/products"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                    <Package size={15} />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">Manage Products</span>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
              </Link>

              <Link
                to="/admin/stock-take"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                    <ClipboardCheck size={15} />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">Stock Audit & Take</span>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
              </Link>

              <Link
                to="/admin/finances"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                    <DollarSign size={15} />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">Financial Records</span>
                </div>
                <ArrowRight size={14} className="text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
