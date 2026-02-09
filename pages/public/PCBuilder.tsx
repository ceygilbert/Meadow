
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Cpu, 
  Monitor, 
  Layers, 
  Fan, 
  HardDrive, 
  Gamepad2, 
  Zap, 
  Box, 
  Search, 
  RotateCcw, 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
  Info, 
  Calculator, 
  MessageCircle, 
  ArrowRight,
  Laptop,
  Armchair,
  Keyboard,
  Microchip,
  Waves,
  Terminal,
  Activity,
  ShoppingCart,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/White%20Full%20Logo.png";

const PCBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState('PC Build');
  const [scrolled, setScrolled] = useState(false);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const builderTabs = [
    { id: 'PC Build', icon: <Cpu size={18} /> },
    { id: 'Accessories', icon: <Keyboard size={18} /> },
    { id: 'Desk & Chair', icon: <Armchair size={18} /> },
    { id: 'Notebook', icon: <Laptop size={18} /> },
  ];

  const schematicZones = [
    {
      group: "Logic Core",
      items: [
        { id: 'cpu', label: 'CPU Processor', icon: <Microchip size={24} />, spec: "Awaiting Core Selection" },
        { id: 'cooler', label: 'Thermal Solution', icon: <Waves size={24} />, spec: "Socket Empty" },
      ]
    },
    {
      group: "Architectural Base",
      items: [
        { id: 'motherboard', label: 'Logic Board', icon: <Layers size={24} />, spec: "Standard Config" },
        { id: 'ram', label: 'Memory Bank', icon: <Box size={24} />, spec: "Slots: 0/4" },
      ]
    },
    {
      group: "Visual Execution",
      items: [
        { id: 'gpu', label: 'Graphics Array', icon: <Gamepad2 size={24} />, spec: "Unallocated" },
        { id: 'monitor', label: 'Visual Interface', icon: <Monitor size={24} />, spec: "Standard" },
      ]
    },
    {
      group: "Energy & Flow",
      items: [
        { id: 'psu', label: 'Power Module', icon: <Zap size={24} />, spec: "0W Load" },
        { id: 'fans', label: 'Thermal Exhaust', icon: <Fan size={24} />, spec: "Idle" },
      ]
    }
  ];

  // Dummy Data for CPU Popup
  const cpuBrands = ['ALL', 'INTEL CORE', 'AMD RYZEN', 'WORKSTATION'];
  const cpuItems = [
    { name: "Intel Core i9-14900K Processor", desc: "36MB Cache, up to 6.0 GHz", price: 2899, status: "Available" },
    { name: "AMD Ryzen 9 7950X3D", desc: "144MB Cache, 16 Cores, 32 Threads", price: 3259, status: "Sold Out" },
    { name: "Intel Core i7-14700K Processor", desc: "33MB Cache, up to 5.6 GHz", price: 1959, status: "Available" },
    { name: "AMD Ryzen 7 7800X3D", desc: "96MB Cache, 8 Cores, Gaming Legend", price: 1759, status: "Pre Order" },
    { name: "Intel Core i5-14600K Processor", desc: "24MB Cache, up to 5.3 GHz", price: 1359, status: "Available" },
    { name: "AMD Ryzen 5 7600X", desc: "38MB Cache, 6 Cores, 5.3 GHz", price: 959, status: "Available" },
  ];

  return (
    <div className="min-h-screen bg-[#050607] font-sans text-slate-100 selection:bg-cyan-500 selection:text-white overflow-x-hidden">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#0a141d_0%,_#050607_100%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-[20%] left-[30%] w-[60%] h-[60%] bg-cyan-500/5 blur-[150px] rounded-full animate-pulse duration-[10s]"></div>
      </div>

      {/* Futuristic Header */}
      <nav className={`fixed top-0 left-0 right-0 h-24 px-8 md:px-16 flex items-center justify-between z-[100] transition-all duration-700 ${scrolled ? 'bg-[#050607]/90 backdrop-blur-3xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="flex items-center gap-16">
          <Link to="/customised" className="group flex items-center gap-6">
             <img src={LOGO_URL} className="h-10 md:h-16 w-auto transition-all group-hover:drop-shadow-[0_0_15px_cyan]" alt="Meadow" />
             <div className="w-px h-10 bg-white/10 hidden lg:block"></div>
             <div className="hidden lg:flex flex-col">
                <span className="text-[12px] font-black tracking-[0.4em] text-cyan-500">FORGE_MODE</span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-white/40">SYSTEM.ENG_V2.5</span>
             </div>
          </Link>

          <div className="hidden xl:flex items-center bg-white/5 border border-white/10 rounded-2xl p-1.5 gap-1.5">
            {builderTabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3.5 px-7 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id ? 'bg-cyan-600 text-white shadow-[0_0_20px_rgba(8,145,178,0.3)]' : 'text-white/30 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                {tab.id}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden md:block group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search Schematics..." 
              className="w-56 xl:w-72 pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-[12px] font-bold text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all uppercase tracking-widest"
            />
          </div>
          <button className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/30 hover:text-cyan-400 hover:border-cyan-500/50 transition-all">
            <RotateCcw size={22} />
          </button>
          <button className="w-14 h-14 bg-cyan-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-600/20">
            <ShoppingCart size={22} />
          </button>
        </div>
      </nav>

      <main className="relative pt-40 px-8 md:px-16 max-w-[1800px] mx-auto z-10 pb-48">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Technical Grid */}
          <div className="lg:col-span-8 grid md:grid-cols-2 gap-8">
            {schematicZones.map((zone, zIdx) => (
              <div 
                key={zIdx} 
                className="space-y-6 animate-in fade-in slide-in-from-left duration-700"
                style={{ transitionDelay: `${zIdx * 100}ms` }}
              >
                <div className="flex items-center gap-4 px-3">
                   <Terminal size={18} className="text-cyan-500/50" />
                   <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-white/30">{zone.group}</h3>
                </div>
                
                {zone.items.map((item) => (
                  <div 
                    key={item.id}
                    onMouseEnter={() => setHoveredZone(item.id)}
                    onMouseLeave={() => setHoveredZone(null)}
                    onClick={() => setActivePopup(item.id)}
                    className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 group cursor-pointer overflow-hidden ${
                      hoveredZone === item.id 
                        ? 'bg-white/10 border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.15)]' 
                        : 'bg-white/[0.02] border-white/5'
                    }`}
                  >
                    {/* Scanning Line Animation */}
                    <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent transition-all duration-[2s] pointer-events-none opacity-0 group-hover:opacity-100 group-hover:top-full`}></div>
                    
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-8">
                        <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-500 ${hoveredZone === item.id ? 'bg-cyan-500 text-black shadow-[0_0_25px_cyan]' : 'bg-white/5 text-white/30'}`}>
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-[13px] font-black uppercase tracking-[0.2em] text-white/80">{item.label}</p>
                          <p className="text-[11px] font-bold text-cyan-500/50 mt-1.5 uppercase tracking-widest">{item.spec}</p>
                        </div>
                      </div>
                      <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all ${hoveredZone === item.id ? 'bg-white text-black scale-110 shadow-xl' : 'text-white/20'}`}>
                        <Plus size={20} />
                      </div>
                    </div>

                    {/* Technical Decoration */}
                    <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-white/10"></div>
                    <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-white/10"></div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Right Column: Master Diagnostics HUD */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-[#0A0B0C] border border-white/10 rounded-[3.5rem] p-12 sticky top-40 shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,_#0e141b_0%,_transparent_60%)]"></div>
              
              <div className="relative z-10 space-y-14">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Diagnostics</h2>
                    <p className="text-[11px] font-black text-cyan-500 uppercase tracking-[0.3em] mt-1.5">Live Telemetry</p>
                  </div>
                  <Activity size={32} className="text-cyan-400 animate-pulse" />
                </div>

                <div className="space-y-10">
                  {[
                    { label: 'Processing Efficiency', value: '0%', color: 'bg-cyan-500' },
                    { label: 'Graphical Load Capacity', value: '0%', color: 'bg-blue-600' },
                    { label: 'Memory Allocation', value: '0%', color: 'bg-indigo-500' },
                    { label: 'Thermal Envelope', value: 'Optimal', color: 'bg-emerald-500' },
                  ].map((metric, i) => (
                    <div key={i} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em]">{metric.label}</span>
                        <span className="text-[12px] font-black text-white/80 uppercase tracking-widest">{metric.value}</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${metric.color} opacity-20 w-[10%] transition-all duration-1000`}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col gap-10">
                   <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em]">Total Estimated Budget</p>
                        <p className="text-6xl font-black text-white mt-1.5 tracking-tighter">RM 0.00</p>
                      </div>
                      <div className="p-5 bg-white/5 rounded-2xl">
                         <Calculator size={26} className="text-cyan-500" />
                      </div>
                   </div>
                   
                   <div className="p-7 bg-cyan-500/5 border border-cyan-500/20 rounded-[2rem] flex items-center gap-5 group/support cursor-pointer">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                         <MessageCircle size={22} />
                      </div>
                      <div>
                         <p className="text-[12px] font-black uppercase tracking-widest text-white">Need Consultation?</p>
                         <p className="text-[10px] font-bold uppercase text-cyan-500/50">Speak with an Engineer</p>
                      </div>
                      <ChevronRight size={18} className="ml-auto text-cyan-500 transition-transform group-hover/support:translate-x-1" />
                   </div>
                </div>
              </div>
            </div>

            {/* Storage Info Card */}
            <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[3rem] flex items-center justify-between group cursor-help hover:bg-white/[0.03] transition-all">
               <div className="flex items-center gap-8">
                  <div className="w-14 h-14 rounded-[1.25rem] bg-white/5 flex items-center justify-center text-white/20 group-hover:text-cyan-400 transition-colors shadow-inner">
                     <HardDrive size={24} />
                  </div>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-widest text-white/40">Persistence Layer</p>
                    <p className="text-sm font-bold text-white mt-1.5">0 Storage Units Connected</p>
                  </div>
               </div>
               <Plus size={20} className="text-white/10 group-hover:text-white" />
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[200] p-8 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
        <div className="max-w-[1600px] mx-auto bg-[#0A0B0C]/90 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-5 flex items-center justify-between shadow-[0_30px_80px_rgba(0,0,0,1)] pointer-events-auto">
          <div className="flex items-center gap-16 px-10">
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-cyan-500/50 uppercase tracking-[0.5em]">Current Schematic</span>
              <span className="text-3xl font-black text-white tracking-tighter uppercase italic">Prototype_Zero</span>
            </div>
            <div className="hidden md:flex flex-col items-center border-l border-white/10 pl-16">
               <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Configuration Health</span>
               <div className="flex gap-2 mt-3">
                  {[...Array(5)].map((_, i) => <div key={i} className="w-6 h-1.5 bg-white/10 rounded-full"></div>)}
               </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="h-20 px-12 bg-white text-black rounded-[2rem] font-black text-[12px] uppercase tracking-[0.5em] hover:bg-cyan-500 hover:text-white transition-all flex items-center gap-10 group shadow-2xl active:scale-95">
              Initialize Phase II
              <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1">
                <ArrowRight size={24} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Component Selection Popup */}
      {activePopup && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-[#050607]/80 backdrop-blur-2xl" onClick={() => setActivePopup(null)}></div>
           
           <div className="relative w-full max-w-[1000px] bg-[#0A0B0C] border border-white/10 rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh]">
              
              {/* Popup Header with Search */}
              <div className="p-10 border-b border-white/5 shrink-0 bg-gradient-to-b from-white/[0.02] to-transparent">
                 <button onClick={() => setActivePopup(null)} className="absolute top-10 right-10 w-12 h-12 rounded-full bg-white/5 text-white/40 hover:text-white flex items-center justify-center transition-all z-20">
                    <X size={24} />
                 </button>

                 <div className="max-w-[600px] mx-auto relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400 transition-colors" size={20} />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`Search all ${schematicZones.flatMap(z => z.items).find(i => i.id === activePopup)?.label || 'Components'}`} 
                      className="w-full pl-16 pr-16 py-5 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all tracking-wider"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                        <X size={18} />
                      </button>
                    )}
                 </div>
              </div>

              {/* Sub-Category/Filter Navigation */}
              <div className="px-10 py-6 border-b border-white/5 flex items-center gap-4 shrink-0 overflow-x-auto scrollbar-hide">
                 <button className="p-3 rounded-xl bg-white/5 text-white/40 hover:text-white shrink-0"><ChevronLeft size={20} /></button>
                 <div className="flex items-center gap-2">
                    {cpuBrands.map((filter) => (
                      <button 
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all shrink-0 border ${
                          activeFilter === filter ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-600/20' : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                 </div>
                 <button className="p-3 rounded-xl bg-white/5 text-white/40 hover:text-white shrink-0 ml-auto"><ChevronRight size={20} /></button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-10 space-y-4 scrollbar-hide">
                 <div className="mb-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 mb-4 px-4">Available Logic Units</p>
                    {cpuItems.map((item, idx) => (
                      <div 
                        key={idx}
                        className="group p-6 rounded-3xl border border-transparent hover:border-white/5 hover:bg-white/[0.02] flex items-center justify-between transition-all cursor-pointer"
                      >
                         <div className="flex flex-col gap-1.5">
                            <h4 className="text-[15px] font-black text-white tracking-tight uppercase group-hover:text-cyan-400 transition-colors">{item.name}</h4>
                            <p className="text-[11px] font-medium text-white/30 uppercase tracking-widest">({item.desc})</p>
                         </div>
                         <div className="flex flex-col items-end gap-3 shrink-0">
                            <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                              item.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                              item.status === 'Sold Out' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                              'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}>
                               {item.status}
                            </span>
                            <span className="text-xl font-black text-white">RM {item.price.toLocaleString()}</span>
                         </div>
                      </div>
                    ))}
                 </div>

                 {/* Custom Loop Option Example (from image) */}
                 <div className="p-8 rounded-[2rem] bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-between group cursor-pointer hover:bg-cyan-500/10 transition-all">
                    <div className="space-y-1">
                       <h4 className="text-[14px] font-black text-white uppercase tracking-tight">Looking for custom integration?</h4>
                       <p className="text-[10px] font-bold text-cyan-500/50 uppercase tracking-widest">Speak with our master architect for bespoke solutions</p>
                    </div>
                    <div className="flex items-center gap-6">
                       <span className="px-4 py-1 rounded-full bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest">Inquiry Only</span>
                       <span className="text-xl font-black text-white">RM 0</span>
                    </div>
                 </div>
              </div>

              {/* Technical Bottom Bar */}
              <div className="p-8 bg-white/[0.02] border-t border-white/5 flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Awaiting_User_Selection_Input</span>
                 </div>
                 <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                       <Info size={14} className="text-white/20" />
                       <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Terms & Warranty Apply</span>
                    </div>
                    <button className="px-8 py-3 bg-white/5 text-white/40 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Reset Config</button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default PCBuilder;
