
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';

const data = [
  { name: 'Jan', sales: 4000, orders: 240 },
  { name: 'Feb', sales: 3000, orders: 198 },
  { name: 'Mar', sales: 5000, orders: 305 },
  { name: 'Apr', sales: 4500, orders: 280 },
  { name: 'May', sales: 6000, orders: 390 },
  { name: 'Jun', sales: 7500, orders: 480 },
];

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
        {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {trendValue}
      </div>
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard Overview</h1>
        <p className="text-slate-500 text-sm">Monitoring your IT store performance in real-time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Revenue" 
          value="$24,560" 
          icon={DollarSign} 
          trend="up" 
          trendValue="+12.5%" 
          color="bg-blue-600" 
        />
        <StatsCard 
          title="Active Orders" 
          value="156" 
          icon={ShoppingCart} 
          trend="up" 
          trendValue="+8.2%" 
          color="bg-emerald-600" 
        />
        <StatsCard 
          title="Total Products" 
          value="1,240" 
          icon={Package} 
          trend="down" 
          trendValue="-2.4%" 
          color="bg-violet-600" 
        />
        <StatsCard 
          title="Total Customers" 
          value="892" 
          icon={Users} 
          trend="up" 
          trendValue="+15.3%" 
          color="bg-amber-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-slate-900">Revenue Analysis</h2>
            <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-1 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-6">Recent Activities</h2>
          <div className="space-y-6">
            {[
              { id: 1, text: 'Custom PC Build order #1024 completed', time: '2h ago', type: 'order' },
              { id: 2, text: 'Stock low for "RTX 4090"', time: '4h ago', type: 'alert' },
              { id: 3, text: 'New category "VR Gear" created', time: '6h ago', type: 'system' },
              { id: 4, text: 'Brand "Razer" updated', time: '1d ago', type: 'system' },
            ].map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                  activity.type === 'order' ? 'bg-blue-600' : 
                  activity.type === 'alert' ? 'bg-rose-600' : 'bg-slate-300'
                }`} />
                <div>
                  <p className="text-sm text-slate-800 leading-tight">{activity.text}</p>
                  <span className="text-xs text-slate-400">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
            View All Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
