
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Layers,
  Copyright, 
  LogOut, 
  Monitor, 
  ChevronDown,
  Bell,
  FileText,
  HelpCircle,
  Settings,
  Cpu,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Receipt,
  Users,
  Ruler
} from 'lucide-react';

interface AdminLayoutProps {
  onLogout: () => Promise<void>;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const primaryMenuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Stock Take', path: '/admin/stock-take', icon: ClipboardCheck },
    { name: 'Transactions', path: '/admin/orders', icon: Receipt },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
    { name: 'Sub-categories', path: '/admin/subcategories', icon: Layers },
    { name: 'Brands', path: '/admin/brands', icon: Copyright },
    { name: 'Units', path: '/admin/units', icon: Ruler },
  ];

  const secondaryMenuItems = [
    { name: 'Notifications', path: '#', icon: Bell, badge: 5 },
    { name: 'Documents', path: '#', icon: FileText },
    { name: 'Help', path: '#', icon: HelpCircle },
  ];

  const handleLogoutClick = async () => {
    await onLogout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-slate-200 p-4 gap-4 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={`bg-white rounded-[2rem] shadow-xl shadow-slate-300/50 transition-all duration-500 ease-in-out flex flex-col relative ${
          isSidebarOpen ? 'w-72' : 'w-24'
        }`}
      >
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 shadow-sm z-50 transition-colors"
        >
          {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        <div className={`p-6 flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} mb-4`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-slate-800/20">
              <Cpu size={24} />
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <h2 className="font-bold text-slate-900 whitespace-nowrap text-sm uppercase tracking-tighter">Meadow IT</h2>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap">Admin Console</p>
              </div>
            )}
          </div>
          {isSidebarOpen && <ChevronDown size={18} className="text-slate-300" />}
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-8 scrollbar-hide">
          <nav className="space-y-1">
            {primaryMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative ${
                    isActive 
                      ? 'text-blue-600 bg-blue-50/50' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {!isSidebarOpen && isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
                  )}
                  
                  <Icon size={22} className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-900'} />
                  {isSidebarOpen && <span className={`font-semibold text-sm ${isActive ? 'text-blue-600' : ''}`}>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="h-px bg-slate-100 mx-2" />

          <nav className="space-y-1">
            {secondaryMenuItems.map((item) => (
              <button
                key={item.name}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all group relative"
              >
                <item.icon size={22} className="text-slate-400 group-hover:text-slate-900" />
                {isSidebarOpen && (
                  <>
                    <span className="font-semibold text-sm flex-1 text-left">{item.name}</span>
                    {item.badge && (
                      <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {!isSidebarOpen && item.badge && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 border-2 border-white rounded-full"></span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-50">
          <div className={`p-2 flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'} rounded-2xl bg-slate-50/50 border border-slate-100/50`}>
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jonathan" 
              className="w-10 h-10 rounded-xl bg-blue-100 shadow-sm shrink-0" 
              alt="User" 
            />
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="font-bold text-slate-900 text-sm whitespace-nowrap">Admin User</p>
                <p className="text-[10px] text-slate-400 truncate">admin@meadowit.com</p>
              </div>
            )}
            <button 
              onClick={handleLogoutClick}
              className={`p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors ${!isSidebarOpen && 'mx-auto'}`}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-md rounded-3xl mb-4 flex items-center justify-between px-8 border border-white shadow-sm">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              {primaryMenuItems.find(i => i.path === location.pathname)?.name || 'Management'}
            </h1>
            <p className="text-xs text-slate-400 font-medium">Internal System Control</p>
          </div>
          
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2"
            >
              <Monitor size={14} />
              Live Store
            </Link>
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-600/20">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-white rounded-[2.5rem] p-8 shadow-sm border border-white scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
