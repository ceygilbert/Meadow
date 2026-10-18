
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home,
  Package, 
  Tags, 
  Layers,
  Copyright, 
  LogOut, 
  ChevronDown,
  ChevronUp,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  ClipboardCheck,
  Receipt,
  DollarSign,
  ShoppingCart,
  Users,
  Ruler,
  BookOpen,
  Store,
  MapPin,
  Search,
  Globe,
  ChevronsUpDown,
  MessageSquare,
  Sparkles,
  LayoutTemplate,
  PanelBottom,
  Truck,
  Database,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { getActiveDatabaseDriver, setDatabaseDriver } from '../lib/supabase';

interface AdminLayoutProps {
  onLogout: () => Promise<void>;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCatalogOpen, setIsCatalogOpen] = useState(true);
  const [isContentOpen, setIsContentOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [dbDriver, setDbDriverState] = useState<'mysql' | 'supabase'>(getActiveDatabaseDriver());
  const [showDbModal, setShowDbModal] = useState(false);
  const [backendStatus, setBackendStatus] = useState<any>(null);
  const [isTestingDb, setIsTestingDb] = useState(false);

  useEffect(() => {
    fetch('/api/db-status')
      .then((res) => res.json())
      .then((data) => setBackendStatus(data))
      .catch(() => {});
  }, []);

  const refreshDbStatus = async () => {
    setIsTestingDb(true);
    try {
      const res = await fetch('/api/db-status');
      const data = await res.json();
      setBackendStatus(data);
    } catch {}
    setIsTestingDb(false);
  };
  
  useEffect(() => {
    try {
      const stored = localStorage.getItem('meadow_auth_profile_current');
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const handleLogoutClick = async () => {
    await onLogout();
    navigate('/admin/login');
  };

  const isCurrent = (path: string) => location.pathname === path;

  const catalogItems = [
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Stock Take', path: '/admin/stock-take', icon: ClipboardCheck },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
    { name: 'Sub-categories', path: '/admin/subcategories', icon: Layers },
    { name: 'Brands', path: '/admin/brands', icon: Copyright },
    { name: 'Units', path: '/admin/units', icon: Ruler },
  ];

  const contentItems = [
    { name: 'Home Page', path: '/admin/homepage', icon: LayoutTemplate },
    { name: 'Our Story', path: '/admin/our-story', icon: BookOpen },
    { name: 'Our Stores', path: '/admin/stores', icon: MapPin },
    { name: 'Supplier Page', path: '/admin/supplier', icon: Truck },
    { name: 'Footer', path: '/admin/footer', icon: PanelBottom },
  ];

  const isCatalogActive = catalogItems.some(i => location.pathname.startsWith(i.path));
  const isContentActive = contentItems.some(i => location.pathname.startsWith(i.path));

  return (
    <div className="flex h-screen bg-[#F5F6F8] overflow-hidden font-sans text-slate-900 antialiased">
      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-slate-200/80 flex flex-col shrink-0 transition-all duration-300 ease-in-out relative z-30 ${
          isSidebarOpen ? 'w-64 xl:w-72' : 'w-20'
        }`}
      >
        {/* Top Header / Logo */}
        <div className="p-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <img src={isSidebarOpen ? "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/Red%20Full%20Logo.png" : "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/Red%20Full%20Logo.png"} className={`transition-all duration-300 ${isSidebarOpen ? 'h-7 object-contain' : 'h-8 w-8 object-cover object-left'}`} alt="Meadow" style={{ objectPosition: isSidebarOpen ? 'center' : '0 50%' }} />
            </Link>
          </div>
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? <ChevronsLeft size={14} /> : <ChevronsRight size={14} />}
          </button>
        </div>

        {/* Store Selector Pill */}
        {isSidebarOpen ? (
          <div className="px-4 py-2">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 flex items-center justify-between shadow-xs hover:border-slate-300 transition-all cursor-pointer">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                  <Store size={14} />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 truncate leading-tight">Meadow IT Store</p>
                  <p className="text-[10px] text-slate-400 font-medium truncate">Terminal #01</p>
                </div>
              </div>
              <ChevronsUpDown size={14} className="text-slate-400 shrink-0 ml-2" />
            </div>
          </div>
        ) : (
          <div className="px-3 py-2 flex justify-center">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 cursor-pointer" title="Meadow IT Store">
              <Store size={16} />
            </div>
          </div>
        )}

        {/* Search Bar with ⌘K badge */}
        {isSidebarOpen ? (
          <div className="px-4 py-1.5">
            <div className="bg-slate-100/80 border border-slate-200/60 rounded-xl px-3 py-2 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Search size={14} className="text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none w-full"
                />
              </div>
              <span className="text-[10px] font-semibold text-slate-400 bg-white border border-slate-200/80 px-1.5 py-0.5 rounded shadow-xs shrink-0">
                ⌘K
              </span>
            </div>
          </div>
        ) : (
          <div className="px-3 py-1.5 flex justify-center">
            <button className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800">
              <Search size={16} />
            </button>
          </div>
        )}

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6 scrollbar-hide">
          {/* Main Menu Group */}
          <div>
            {isSidebarOpen && (
              <p className="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Menu
              </p>
            )}
            <nav className="space-y-1">
              {/* Home / Dashboard */}
              <Link
                to="/admin/dashboard"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isCurrent('/admin/dashboard')
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="Home / Dashboard"
              >
                <Home size={17} className={isCurrent('/admin/dashboard') ? 'text-slate-900' : 'text-slate-500'} />
                {isSidebarOpen && <span>Dashboard</span>}
              </Link>

              {/* Catalog (Collapsible) */}
              <div>
                <button
                  onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isCatalogActive
                      ? 'text-slate-900 font-bold bg-slate-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title="Catalog"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Package size={17} className={isCatalogActive ? 'text-slate-900' : 'text-slate-500'} />
                    {isSidebarOpen && <span>Catalog</span>}
                  </div>
                  {isSidebarOpen && (
                    isCatalogOpen ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />
                  )}
                </button>

                {isSidebarOpen && isCatalogOpen && (
                  <div className="mt-1 ml-4 pl-4 border-l border-slate-200 space-y-1">
                    {catalogItems.map((item) => {
                      const active = isCurrent(item.path);
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                            active
                              ? 'text-slate-900 font-bold bg-slate-100'
                              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <Icon size={14} className={active ? 'text-slate-900' : 'text-slate-400'} />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Orders */}
              <Link
                to="/admin/orders"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isCurrent('/admin/orders')
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="Orders"
              >
                <ShoppingCart size={17} className={isCurrent('/admin/orders') ? 'text-slate-900' : 'text-slate-500'} />
                {isSidebarOpen && <span>Orders</span>}
              </Link>

              {/* Finances */}
              <Link
                to="/admin/finances"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isCurrent('/admin/finances')
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="Finances"
              >
                <DollarSign size={17} className={isCurrent('/admin/finances') ? 'text-slate-900' : 'text-slate-500'} />
                {isSidebarOpen && <span>Finances</span>}
              </Link>

              {/* Customers */}
              <Link
                to="/admin/customers"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isCurrent('/admin/customers')
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="Customers"
              >
                <Users size={17} className={isCurrent('/admin/customers') ? 'text-slate-900' : 'text-slate-500'} />
                {isSidebarOpen && <span>Customers</span>}
              </Link>

              {/* Staff / Admins (Superadmin only) */}
              {profile?.role === 'superadmin' && (
                <Link
                  to="/admin/users"
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isCurrent('/admin/users')
                      ? 'bg-purple-50 text-purple-900 font-bold'
                      : 'text-slate-600 hover:text-purple-900 hover:bg-purple-50/50'
                  }`}
                  title="Admin Staff"
                >
                  <Sparkles size={17} className={isCurrent('/admin/users') ? 'text-purple-900' : 'text-slate-500'} />
                  {isSidebarOpen && <span>Staff</span>}
                </Link>
              )}

              {/* Store Content / Pages (Collapsible) */}
              <div>
                <button
                  onClick={() => setIsContentOpen(!isContentOpen)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isContentActive
                      ? 'text-slate-900 font-bold bg-slate-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title="Content Management"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <LayoutTemplate size={17} className={isContentActive ? 'text-slate-900' : 'text-slate-500'} />
                    {isSidebarOpen && <span>Content</span>}
                  </div>
                  {isSidebarOpen && (
                    isContentOpen ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />
                  )}
                </button>

                {isSidebarOpen && isContentOpen && (
                  <div className="mt-1 ml-4 pl-4 border-l border-slate-200 space-y-1">
                    {contentItems.map((item) => {
                      const active = isCurrent(item.path);
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                            active
                              ? 'text-slate-900 font-bold bg-slate-100'
                              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <Icon size={14} className={active ? 'text-slate-900' : 'text-slate-400'} />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          {/* User profile card */}
          {isSidebarOpen ? (
            <div className="p-2.5 bg-slate-50/80 border border-slate-200/60 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jonathan" 
                  className="w-9 h-9 rounded-xl bg-slate-200 shrink-0" 
                  alt="Admin" 
                />
                <div className="truncate">
                  <p className="font-bold text-slate-900 text-xs truncate leading-tight">Admin User</p>
                  <p className="text-[10px] text-slate-400 font-medium truncate">admin@meadowit.com</p>
                </div>
              </div>
              <ChevronDown size={14} className="text-slate-400 shrink-0 ml-1" />
            </div>
          ) : (
            <div className="flex justify-center">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jonathan" 
                className="w-8 h-8 rounded-xl bg-slate-200 shrink-0" 
                alt="Admin" 
              />
            </div>
          )}

          {/* Quick footer actions: Settings & Log out */}
          <div className="flex flex-col space-y-0.5">
            <Link
              to="/admin/homepage"
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all ${
                !isSidebarOpen && 'justify-center'
              }`}
              title="Settings"
            >
              <Settings size={16} className="text-slate-400" />
              {isSidebarOpen && <span>Settings</span>}
            </Link>

            <button 
              onClick={handleLogoutClick}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all ${
                !isSidebarOpen && 'justify-center'
              }`}
              title="Log out"
            >
              <LogOut size={16} className="text-slate-400 hover:text-rose-600" />
              {isSidebarOpen && <span>Log out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="px-6 md:px-10 pt-6 pb-2 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Hello, Admin!
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Database Engine Status Button */}
            <button
              onClick={() => setShowDbModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs transition-all cursor-pointer"
              title="Database Engine Settings"
            >
              <Database size={13} className={dbDriver === 'mysql' ? 'text-emerald-600' : 'text-blue-600'} />
              <span>DB: <strong className="font-semibold text-slate-900">{dbDriver === 'mysql' ? 'Hostinger MariaDB' : 'Supabase'}</strong></span>
              <span className={`w-2 h-2 rounded-full ${backendStatus?.connected ? 'bg-emerald-500' : (dbDriver === 'mysql' ? 'bg-amber-400' : 'bg-blue-500')}`} />
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-950 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs transition-all"
            >
              <Globe size={14} />
              <span>Open Site</span>
            </a>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-6 md:px-10 py-4 scrollbar-hide">
          <Outlet />
        </main>
      </div>

      {/* Floating Quick Support / Chat Action in Bottom Right (matching screenshot) */}
      <button 
        className="fixed bottom-6 right-6 w-12 h-12 bg-slate-950 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-slate-800 hover:scale-105 transition-all z-40"
        title="Admin Support & Terminal Logs"
        onClick={() => {
          window.open('https://wa.me/message/SWV2JDRGAAHHK1', '_blank');
        }}
      >
        <MessageSquare size={19} />
      </button>
      {/* Database Engine Switcher & Status Modal */}
      {showDbModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                  <Database size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Database Engine Settings</h3>
                  <p className="text-xs text-slate-500">Hostinger MariaDB & Supabase Integration</p>
                </div>
              </div>
              <button
                onClick={() => setShowDbModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Current Active Driver */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">Active Frontend Driver:</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    dbDriver === 'mysql' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {dbDriver === 'mysql' ? 'Hostinger MariaDB / MySQL' : 'Supabase (Cloud)'}
                  </span>
                </div>
              </div>

              {/* Backend Status Check */}
              <div className="border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">Server MySQL Connection:</span>
                  <button
                    onClick={refreshDbStatus}
                    disabled={isTestingDb}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 underline cursor-pointer"
                  >
                    {isTestingDb ? 'Checking...' : 'Refresh Status'}
                  </button>
                </div>

                {backendStatus?.connected ? (
                  <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg">
                    <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                    <div>
                      <strong>Connected to {backendStatus.database}</strong> on {backendStatus.host}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 p-2.5 rounded-lg">
                    <AlertCircle size={16} className="shrink-0 text-amber-600 mt-0.5" />
                    <div>
                      <span>Server is not currently connected to MySQL credentials in <code>.env</code>. (Active fallback: Supabase).</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Switch Buttons */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-slate-700">Choose Database Engine:</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => {
                      setDatabaseDriver('mysql');
                      setDbDriverState('mysql');
                    }}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                      dbDriver === 'mysql'
                        ? 'border-emerald-500 bg-emerald-50/60 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span>Hostinger MariaDB</span>
                      {dbDriver === 'mysql' && <CheckCircle2 size={14} className="text-emerald-600" />}
                    </div>
                    <span className="text-[10px] font-normal text-slate-500 block leading-tight">
                      Free hostinger quota & local image uploads
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setDatabaseDriver('supabase');
                      setDbDriverState('supabase');
                    }}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                      dbDriver === 'supabase'
                        ? 'border-blue-500 bg-blue-50/60 text-blue-900 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span>Supabase Cloud</span>
                      {dbDriver === 'supabase' && <CheckCircle2 size={14} className="text-blue-600" />}
                    </div>
                    <span className="text-[10px] font-normal text-slate-500 block leading-tight">
                      Remote BaaS with current live data
                    </span>
                  </button>
                </div>
              </div>

              {/* Instructions Link */}
              <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                💡 <strong>Migration Tip:</strong> Both <code>mysql-schema.sql</code> and <code>mysql-data-seed.sql</code> with all 119 products are generated in your repo and ready to import into phpMyAdmin.
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowDbModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;

