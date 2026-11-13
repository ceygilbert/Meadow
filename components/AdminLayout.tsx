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
  DollarSign,
  ShoppingCart,
  Users,
  Ruler,
  BookOpen,
  MapPin,
  Search,
  Globe,
  Sparkles,
  LayoutTemplate,
  PanelBottom,
  Truck,
  Database,
  CheckCircle2,
  AlertCircle,
  X,
  Mail
} from 'lucide-react';
import { getActiveDatabaseDriver, setDatabaseDriver } from '../lib/supabase';
import { fetchInboxMessages, getCachedInboxMessages, INBOX_UPDATED_EVENT } from '../services/inboxService';

interface AdminLayoutProps {
  onLogout: () => Promise<void>;
}

const LOGO_URL = 'https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/Red%20Full%20Logo.png';

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
  const [unreadInboxCount, setUnreadInboxCount] = useState<number>(() => {
    return getCachedInboxMessages().filter((m) => m.status === 'unread').length;
  });

  useEffect(() => {
    fetch('/api/db-status')
      .then((res) => res.json())
      .then((data) => setBackendStatus(data))
      .catch(() => {});

    fetchInboxMessages()
      .then((msgs) => {
        setUnreadInboxCount(msgs.filter((m) => m.status === 'unread').length);
      })
      .catch(() => {});

    const handleInboxUpdated = () => {
      const cached = getCachedInboxMessages();
      setUnreadInboxCount(cached.filter((m) => m.status === 'unread').length);
    };
    window.addEventListener(INBOX_UPDATED_EVENT, handleInboxUpdated);
    return () => window.removeEventListener(INBOX_UPDATED_EVENT, handleInboxUpdated);
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

  const isCatalogActive = catalogItems.some((i) => location.pathname.startsWith(i.path));
  const isContentActive = contentItems.some((i) => location.pathname.startsWith(i.path));

  return (
    <div className="flex h-screen bg-[#F5F6F8] overflow-hidden font-sans text-slate-900 antialiased">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-slate-200/80 flex flex-col shrink-0 transition-all duration-300 ease-in-out relative z-30 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Top Header / Logo */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
          <Link to="/admin/dashboard" className="flex items-center gap-2 overflow-hidden">
            <img
              src={LOGO_URL}
              className={`object-contain transition-all duration-300 ${
                isSidebarOpen ? 'h-8' : 'h-8 w-8 object-left'
              }`}
              alt="Meadow"
              style={{ objectPosition: isSidebarOpen ? 'center' : '0 50%' }}
            />
          </Link>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isSidebarOpen ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-hide">
          <div>
            {isSidebarOpen && (
              <p className="px-3.5 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Store Management
              </p>
            )}
            <nav className="space-y-1">
              {/* Dashboard */}
              <Link
                to="/admin/dashboard"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isCurrent('/admin/dashboard')
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="Dashboard"
              >
                <Home size={17} className={isCurrent('/admin/dashboard') ? 'text-slate-900' : 'text-slate-500'} />
                {isSidebarOpen && <span>Dashboard</span>}
              </Link>

              {/* Catalog Group */}
              <div>
                <button
                  onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isCatalogActive
                      ? 'text-slate-900 bg-slate-50 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title="Catalog"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Package size={17} className={isCatalogActive ? 'text-slate-900' : 'text-slate-500'} />
                    {isSidebarOpen && <span>Catalog</span>}
                  </div>
                  {isSidebarOpen &&
                    (isCatalogOpen ? (
                      <ChevronUp size={14} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={14} className="text-slate-400" />
                    ))}
                </button>

                {isSidebarOpen && isCatalogOpen && (
                  <div className="mt-1 ml-5 pl-3 border-l border-slate-200 space-y-1">
                    {catalogItems.map((item) => {
                      const active = isCurrent(item.path);
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                            active
                              ? 'bg-slate-100 text-slate-900 font-bold'
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

              {/* Inbox / Mailbox */}
              <Link
                to="/admin/inbox"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isCurrent('/admin/inbox') || isCurrent('/admin/mailbox')
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="Inbox & Mailbox"
              >
                <Mail
                  size={17}
                  className={isCurrent('/admin/inbox') || isCurrent('/admin/mailbox') ? 'text-slate-900' : 'text-slate-500'}
                />
                {isSidebarOpen && (
                  <div className="flex items-center justify-between flex-1">
                    <span>Inbox</span>
                    {unreadInboxCount > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        {unreadInboxCount}
                      </span>
                    )}
                  </div>
                )}
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

              {/* Content Group */}
              <div>
                <button
                  onClick={() => setIsContentOpen(!isContentOpen)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isContentActive
                      ? 'text-slate-900 bg-slate-50 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title="Content"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <LayoutTemplate size={17} className={isContentActive ? 'text-slate-900' : 'text-slate-500'} />
                    {isSidebarOpen && <span>Content</span>}
                  </div>
                  {isSidebarOpen &&
                    (isContentOpen ? (
                      <ChevronUp size={14} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={14} className="text-slate-400" />
                    ))}
                </button>

                {isSidebarOpen && isContentOpen && (
                  <div className="mt-1 ml-5 pl-3 border-l border-slate-200 space-y-1">
                    {contentItems.map((item) => {
                      const active = isCurrent(item.path);
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                            active
                              ? 'bg-slate-100 text-slate-900 font-bold'
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

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          <Link
            to="/admin/homepage"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              isCurrent('/admin/homepage')
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title="Settings"
          >
            <Settings size={17} className="text-slate-500" />
            {isSidebarOpen && <span>Settings</span>}
          </Link>

          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
            title="Log out"
          >
            <LogOut size={17} className="text-rose-500" />
            {isSidebarOpen && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 px-6 md:px-10 bg-white/80 backdrop-blur-md border-b border-slate-200/70 flex items-center justify-between gap-4 shrink-0">
          {/* Search Input */}
          <div className="relative w-full max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100/80 border border-transparent focus:bg-white focus:border-slate-300 rounded-full text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowDbModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs transition-all cursor-pointer"
              title="Database Engine Settings"
            >
              <Database size={13} className={dbDriver === 'mysql' ? 'text-emerald-600' : 'text-blue-600'} />
              <span className="hidden sm:inline">
                DB: <strong className="font-semibold text-slate-900">{dbDriver === 'mysql' ? 'MariaDB' : 'Supabase'}</strong>
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  backendStatus?.connected
                    ? 'bg-emerald-500'
                    : dbDriver === 'mysql'
                    ? 'bg-amber-400'
                    : 'bg-blue-500'
                }`}
              />
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

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <Outlet />
        </main>
      </div>

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
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">Active Frontend Driver:</span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      dbDriver === 'mysql' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {dbDriver === 'mysql' ? 'Hostinger MariaDB / MySQL' : 'Supabase (Cloud)'}
                  </span>
                </div>
              </div>

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
                      <span>
                        Server is not currently connected to MySQL credentials in <code>.env</code>. (Active fallback:
                        Supabase).
                      </span>
                    </div>
                  </div>
                )}
              </div>

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
