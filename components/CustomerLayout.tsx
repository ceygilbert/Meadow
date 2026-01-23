
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  User, 
  LogOut, 
  Monitor, 
  Bell,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Settings,
  HelpCircle
} from 'lucide-react';

interface CustomerLayoutProps {
  onLogout: () => Promise<void>;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/customer/dashboard', icon: LayoutDashboard },
    { name: 'My Orders', path: '#', icon: ShoppingBag },
    { name: 'Hardware Profile', path: '#', icon: Cpu },
    { name: 'Account Settings', path: '#', icon: Settings },
  ];

  const handleLogoutClick = async () => {
    await onLogout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-slate-100 p-4 gap-4 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={`bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 transition-all duration-500 ease-in-out flex flex-col relative ${
          isSidebarOpen ? 'w-72' : 'w-24'
        }`}
      >
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-300 hover:text-blue-600 shadow-sm z-50 transition-colors"
        >
          {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        <div className={`p-8 flex items-center ${isSidebarOpen ? 'justify-start gap-4' : 'justify-center'} mb-8`}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-600/20">
            <Cpu size={20} />
          </div>
          {isSidebarOpen && (
            <div>
              <h2 className="font-black text-slate-900 text-sm uppercase tracking-tighter">Meadow IT</h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Client Console</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group relative ${
                  isActive 
                    ? 'text-blue-600 bg-blue-50/50' 
                    : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-900'} />
                {isSidebarOpen && <span className={`font-bold text-xs uppercase tracking-widest ${isActive ? 'text-blue-600' : ''}`}>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-50">
          <div className={`p-3 flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'} rounded-[2rem] bg-slate-50/50 border border-slate-100`}>
             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs shrink-0">
               ME
             </div>
             {isSidebarOpen && (
               <div className="flex-1 overflow-hidden">
                 <p className="font-bold text-slate-900 text-xs truncate">My Account</p>
                 <button onClick={handleLogoutClick} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline">Log Out</button>
               </div>
             )}
             {!isSidebarOpen && (
               <button onClick={handleLogoutClick} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                 <LogOut size={16} />
               </button>
             )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/60 backdrop-blur-xl rounded-[2rem] mb-4 flex items-center justify-between px-8 border border-white/50 shadow-sm">
          <div className="flex items-center gap-4 text-slate-300">
             <LayoutDashboard size={18} />
             <div className="w-px h-4 bg-slate-200" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Meadow Customer Experience Platform
             </span>
          </div>
          
          <div className="flex items-center gap-4">
             <Link to="/" className="px-5 py-2 bg-white text-slate-900 text-[10px] font-black rounded-xl border border-slate-100 hover:bg-slate-50 transition-all uppercase tracking-widest flex items-center gap-2 shadow-sm">
                <Monitor size={14} /> Browse Shop
             </Link>
             <button className="p-2.5 text-slate-400 hover:text-blue-600 rounded-xl transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
             </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-white/50 backdrop-blur-sm rounded-[2.5rem] p-8 shadow-inner border border-white/40">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
