
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  TicketPercent,
  Wifi,
  Wind,
  Disc,
  MousePointer2,
  Minus,
  Trash2,
  ScanText
} from 'lucide-react';

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/White%20Full%20Logo.png";

interface BuildItem {
  name: string;
  desc: string;
  price: number;
  status: string;
  perfWeight?: number; 
  quantity?: number;
}

const PCBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('PC Build');
  const [scrolled, setScrolled] = useState(false);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  const [selections, setSelections] = useState<Record<string, any>>(() => {
    const saved = localStorage.getItem('meadow_pc_build');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved build", e);
      }
    }
    return {
      promotion: null,
      cpu: null,
      'cpu cooler': null,
      motherboard: null,
      ram: null,
      storage: [],
      gpu: null,
      psu: null,
      case: null,
      fans: null,
      networking: null,
      os: null,
      accessories: []
    };
  });

  useEffect(() => {
    localStorage.setItem('meadow_pc_build', JSON.stringify(selections));
  }, [selections]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const metricMapping: Record<string, string[]> = {
    cpu: ['procPower'],
    'cpu cooler': ['procPower', 'stability'],
    motherboard: ['procPower', 'stability'],
    ram: ['memAlloc'],
    storage: ['memAlloc'],
    gpu: ['graphPower'],
    psu: ['graphPower', 'stability'],
    fans: ['stability'],
    case: ['stability']
  };

  const COMPONENT_DATA: Record<string, { filters: string[], items: BuildItem[] }> = {
    promotion: {
      filters: ['ALL', 'BUNDLE', 'SEASONAL'],
      items: [
        { name: "Year-End Ultimate Bundle", desc: "Free RGB Mousepad + 5% off GPU", price: 0, status: "Available" },
        { name: "New Build Starter Pack", desc: "Free Windows 11 Key with full build", price: 0, status: "Available" },
      ]
    },
    cpu: {
      filters: ['ALL', 'INTEL', 'AMD'],
      items: [
        { name: "Intel Core i9-14900K", desc: "24 Cores, up to 6.0 GHz", price: 2899, status: "Available", perfWeight: 100 },
        { name: "AMD Ryzen 9 7950X3D", desc: "16 Cores, 144MB Cache", price: 3259, status: "Sold Out", perfWeight: 98 },
        { name: "Intel Core i7-14700K", desc: "20 Cores, up to 5.6 GHz", price: 1959, status: "Available", perfWeight: 85 },
        { name: "AMD Ryzen 7 7800X3D", desc: "8 Cores, Gaming Champion", price: 1759, status: "Pre Order", perfWeight: 90 },
      ]
    },
    'cpu cooler': {
      filters: ['ALL', 'AIR', 'LIQUID'],
      items: [
        { name: "Valkyrie C360 Liquid Cooler", desc: "ARGB, 360mm Radiator", price: 459, status: "Available", perfWeight: 95 },
        { name: "DeepCool AK620 Digital", desc: "Dual Tower Air Cooler", price: 299, status: "Available", perfWeight: 75 },
        { name: "Noctua NH-D15 chromax.black", desc: "Silent King Air Cooler", price: 499, status: "Available", perfWeight: 85 },
      ]
    },
    motherboard: {
      filters: ['ALL', 'Z790', 'B760', 'X670', 'B650'],
      items: [
        { name: "ASUS ROG Maximus Z790 Hero", desc: "WiFi 6E, DDR5 Support", price: 2699, status: "Available", perfWeight: 98 },
        { name: "MSI MAG B650 Tomahawk WiFi", desc: "AM5, Robust VRM", price: 1159, status: "Available", perfWeight: 70 },
        { name: "GIGABYTE Z790 AORUS ELITE AX", desc: "ATX, Premium Audio", price: 1399, status: "Available", perfWeight: 75 },
      ]
    },
    ram: {
      filters: ['ALL', 'DDR5', 'DDR4'],
      items: [
        { name: "Corsair Vengeance RGB 32GB", desc: "DDR5 6000MT/s CL30", price: 559, status: "Available", perfWeight: 80 },
        { name: "G.Skill Trident Z5 RGB 64GB", desc: "DDR5 6400MT/s", price: 1059, status: "Available", perfWeight: 95 },
        { name: "Kingston FURY Renegade 16GB", desc: "DDR4 3600MT/s", price: 259, status: "Available", perfWeight: 40 },
      ]
    },
    storage: {
      filters: ['ALL', 'NVME', 'SATA', 'HDD'],
      items: [
        { name: "Samsung 990 Pro 2TB", desc: "Gen4 NVMe, 7450MB/s", price: 899, status: "Available", perfWeight: 98 },
        { name: "Western Digital Black SN850X 1TB", desc: "Gen4 Gaming Drive", price: 459, status: "Available", perfWeight: 90 },
      ]
    },
    gpu: {
      filters: ['ALL', 'NVIDIA', 'AMD'],
      items: [
        { name: "NVIDIA GeForce RTX 4090", desc: "24GB GDDR6X", price: 8999, status: "Sold Out", perfWeight: 100 },
        { name: "ASUS ROG Strix RTX 4080 Super", desc: "16GB", price: 5299, status: "Available", perfWeight: 92 },
      ]
    },
    psu: {
      filters: ['ALL', '850W+', '750W', 'SFF'],
      items: [
        { name: "Corsair RM850x (2021)", desc: "850W, 80+ Gold", price: 599, status: "Available", perfWeight: 85 },
        { name: "ASUS ROG Thor 1200P2", desc: "1200W, 80+ Platinum", price: 1459, status: "Available", perfWeight: 100 },
      ]
    },
    case: {
      filters: ['ALL', 'MID TOWER', 'FULL TOWER', 'ITX'],
      items: [
        { name: "Lian Li O11 Dynamic EVO", desc: "Panoramic View", price: 759, status: "Available", perfWeight: 90 },
        { name: "NZXT H9 Flow", desc: "Mid-Tower Airflow", price: 799, status: "Available", perfWeight: 85 },
      ]
    },
    fans: {
      filters: ['ALL', '120MM', 'PACKS'],
      items: [
        { name: "Lian Li UNI Fan SL-Infinity", desc: "3-Pack, ARGB", price: 429, status: "Available", perfWeight: 90 },
      ]
    },
    networking: {
      filters: ['ALL', 'WIFI 7', 'WIFI 6E'],
      items: [
        { name: "ASUS PCE-AXE59BT", desc: "WiFi 6E + Bluetooth 5.2", price: 259, status: "Available", perfWeight: 80 },
      ]
    },
    os: {
      filters: ['ALL', 'HOME', 'PRO'],
      items: [
        { name: "Windows 11 Home", desc: "Retail USB", price: 499, status: "Available", perfWeight: 100 },
        { name: "Windows 11 Pro", desc: "Retail USB", price: 699, status: "Available", perfWeight: 100 },
      ]
    },
    accessories: {
      filters: ['ALL', 'MOUSE', 'KEYBOARD'],
      items: [
        { name: "Logitech G Pro X Superlight 2", desc: "Wireless", price: 699, status: "Available", perfWeight: 100 },
        { name: "Razer Huntsman V3 Pro", desc: "Analog Optical", price: 999, status: "Available", perfWeight: 100 },
      ]
    }
  };

  const schematicZones = [
    {
      group: "Foundation Layer",
      items: [
        { id: 'promotion', label: 'Campaign / Promotion', icon: <TicketPercent size={24} />, multi: false },
        { id: 'case', label: 'Architectural Case', icon: <Monitor size={24} />, multi: false },
      ]
    },
    {
      group: "Logic Core",
      items: [
        { id: 'cpu', label: 'CPU Processor', icon: <Microchip size={24} />, multi: false },
        { id: 'cpu cooler', label: 'Thermal Solution', icon: <Waves size={24} />, multi: false },
      ]
    },
    {
      group: "Interface & Energy",
      items: [
        { id: 'motherboard', label: 'Logic Board', icon: <Layers size={24} />, multi: false },
        { id: 'psu', label: 'Power Module', icon: <Zap size={24} />, multi: false },
      ]
    },
    {
      group: "Data & Runtime",
      items: [
        { id: 'ram', label: 'Memory Bank', icon: <Box size={24} />, multi: false, hasQty: true },
        { id: 'storage', label: 'Persistence Layer', icon: <HardDrive size={24} />, multi: true },
      ]
    },
    {
      group: "Visual & Exhaust",
      items: [
        { id: 'gpu', label: 'Graphics Array', icon: <Gamepad2 size={24} />, multi: false },
        { id: 'fans', label: 'ARGB Flow', icon: <Fan size={24} />, multi: false },
      ]
    },
    {
      group: "External Link & UI",
      items: [
        { id: 'networking', label: 'Network Adapter', icon: <Wifi size={24} />, multi: false },
        { id: 'os', label: 'Operating System', icon: <Disc size={24} />, multi: false },
      ]
    },
    {
      group: "Tactile Interface",
      items: [
        { id: 'accessories', label: 'Master Accessories', icon: <MousePointer2 size={24} />, multi: true },
      ]
    }
  ];

  const handleSelectItem = (item: BuildItem) => {
    if (!activePopup) return;
    setSelections(prev => {
      const newSels = { ...prev };
      if (activePopup === 'storage' || activePopup === 'accessories') {
        newSels[activePopup] = [...(newSels[activePopup] || []), { ...item }];
      } else if (activePopup === 'ram') {
        newSels[activePopup] = { ...item, quantity: 1 };
      } else {
        newSels[activePopup] = { ...item };
      }
      return newSels;
    });
    setActivePopup(null);
  };

  const removeItem = (catId: string, index?: number) => {
    setSelections(prev => {
      const newSels = { ...prev };
      if (Array.isArray(newSels[catId]) && index !== undefined) {
        newSels[catId] = newSels[catId].filter((_: any, i: number) => i !== index);
      } else {
        newSels[catId] = null;
      }
      return newSels;
    });
  };

  const updateRamQty = (delta: number) => {
    setSelections(prev => {
      if (!prev.ram) return prev;
      const newQty = Math.max(1, (prev.ram.quantity || 1) + delta);
      return { ...prev, ram: { ...prev.ram, quantity: newQty } };
    });
  };

  const totalBudget = useMemo(() => {
    let total = 0;
    Object.keys(selections).forEach(key => {
      const val = selections[key];
      if (Array.isArray(val)) {
        val.forEach(item => total += item.price);
      } else if (val) {
        total += val.price * (val.quantity || 1);
      }
    });
    return total;
  }, [selections]);

  const diagnostics = useMemo(() => {
    const getWeight = (id: string) => selections[id]?.perfWeight || 0;
    const cpuWeight = getWeight('cpu');
    const procPower = (cpuWeight * 0.7) + (getWeight('motherboard') * 0.15) + (getWeight('cpu cooler') * 0.15);
    const gpuWeight = getWeight('gpu');
    const graphPower = (gpuWeight * 0.95) + (getWeight('psu') * 0.05);
    const ramBase = getWeight('ram');
    const ramQty = selections.ram?.quantity || 0;
    const memAlloc = Math.min(100, (ramBase * 0.8) + (ramQty > 1 ? 20 : 0));
    const stabilityBase = selections.psu ? 60 : 0;
    const coolingBonus = (getWeight('cpu cooler') / 5) + (getWeight('fans') / 10);
    const systemStability = Math.min(100, stabilityBase + coolingBonus);

    return {
      procPower: Math.round(procPower),
      graphPower: Math.round(graphPower),
      memAlloc: Math.round(memAlloc),
      stability: systemStability > 0 ? (systemStability > 80 ? 'Nominal' : 'Stable') : 'None'
    };
  }, [selections]);

  const handleOpenPopup = (id: string) => {
    setActivePopup(id);
    setActiveFilter('ALL');
    setSearchQuery('');
  };

  const currentPopupData = activePopup ? COMPONENT_DATA[activePopup] || { filters: ['ALL'], items: [] } : { filters: [], items: [] };
  const filteredItems = currentPopupData.items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'ALL' || item.name.toUpperCase().includes(activeFilter) || item.desc.toUpperCase().includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#050607] font-sans text-slate-100 selection:bg-rose-600 selection:text-white overflow-x-hidden">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#1a0a0a_0%,_#050607_80%)]"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] pointer-events-none"></div>
        <div className="absolute top-[20%] left-[30%] w-[60%] h-[60%] bg-rose-600/5 blur-[150px] rounded-full animate-pulse duration-[10s]"></div>
      </div>

      {/* Header */}
      <nav className={`fixed top-0 left-0 right-0 h-32 md:h-40 px-8 md:px-16 flex items-center justify-between z-[100] transition-all duration-1000 ${scrolled ? 'bg-[#050607]/95 backdrop-blur-2xl border-b border-white/5 h-24' : 'bg-transparent py-10'}`}>
        <div className="flex items-center gap-12">
          <Link to="/customised" className="group flex items-center gap-10">
             <img src={LOGO_URL} className="h-14 md:h-20 w-auto transition-all group-hover:opacity-80" alt="Meadow" />
             <div className="hidden lg:flex flex-col border-l border-white/20 pl-10">
                <span className="text-[13px] font-black tracking-[0.5em] text-white/50 uppercase">Forge Mode</span>
                <span className="text-[11px] font-bold tracking-[0.3em] text-rose-500 uppercase mt-1">System.Eng_V2.5</span>
             </div>
          </Link>
        </div>

        <div className="hidden xl:flex items-center bg-white/10 border border-white/20 rounded-full p-1.5 gap-2">
          {['PC Build', 'Accessories', 'Notebook'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.3em] transition-all ${
                activeTab === tab ? 'bg-white text-black shadow-2xl' : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-10">
          <button onClick={() => { localStorage.removeItem('meadow_pc_build'); window.location.reload(); }} className="w-14 h-14 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-rose-500 transition-all">
            <RotateCcw size={22} />
          </button>
          <button className="h-14 w-14 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-rose-600/20">
            <ShoppingCart size={22} />
          </button>
        </div>
      </nav>

      <main className="relative pt-48 md:pt-64 px-8 md:px-16 max-w-[1800px] mx-auto z-10 pb-64">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Schematic Grid */}
          <div className="lg:col-span-8 grid md:grid-cols-1 gap-10">
            {schematicZones.map((zone, zIdx) => (
              <div key={zIdx} className="space-y-6">
                <div className="flex items-center gap-4 px-4">
                   <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                   <h3 className="font-serif text-2xl font-light tracking-wide text-white/60">{zone.group}</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                {zone.items.map((item) => {
                  const selected = selections[item.id];
                  const isMulti = item.multi;
                  
                  return (
                    <div key={item.id} className="space-y-4">
                      {isMulti && Array.isArray(selected) && selected.map((sItem: any, sIdx: number) => (
                        <div key={sIdx} className="relative p-6 bg-[#0c0d0e] border border-rose-600 rounded-[3rem] animate-in fade-in slide-in-from-top-4 duration-500 group overflow-hidden">
                           <div className="flex items-center gap-8 relative z-10">
                               {/* Icon Capsule Pill */}
                               <div className="w-14 h-24 bg-rose-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-[0_0_30px_rgba(225,29,72,0.4)]">
                                  {item.icon}
                               </div>
                               
                               <div className="flex-1 min-w-0">
                                  <h4 className="text-[16px] font-black uppercase tracking-tight text-white leading-tight mb-2">
                                     {sItem.name}
                                  </h4>
                                  <p className="text-[14px] font-black text-rose-500 uppercase tracking-widest">RM {sItem.price.toLocaleString()}</p>
                               </div>

                               <div className="flex items-center gap-4">
                                  <button onClick={() => removeItem(item.id, sIdx)} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-rose-600 transition-all">
                                    <Trash2 size={20} />
                                  </button>
                               </div>
                           </div>
                        </div>
                      ))}

                      {(!isMulti || (isMulti && selected?.length === 0)) && (
                        <>
                        {selected && !isMulti ? (
                          <div 
                            onMouseEnter={() => setHoveredZone(item.id)}
                            onMouseLeave={() => setHoveredZone(null)}
                            className="relative p-6 bg-[#0c0d0e] border border-rose-600 rounded-[3rem] animate-in fade-in duration-500 group overflow-hidden"
                          >
                             <div className="flex items-center gap-8 relative z-10">
                                 {/* Icon Capsule Pill */}
                                 <div className="w-14 h-24 bg-rose-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-[0_0_30px_rgba(225,29,72,0.4)]">
                                    {item.icon}
                                 </div>
                                 
                                 <div className="flex-1 min-w-0">
                                    <h4 className="text-[16px] font-black uppercase tracking-tight text-white leading-tight mb-2">
                                       {selected.name} {selected.quantity > 1 && `(x${selected.quantity})`}
                                    </h4>
                                    <p className="text-[14px] font-black text-rose-500 uppercase tracking-widest">
                                       RM {(selected.price * (selected.quantity || 1)).toLocaleString()}
                                    </p>
                                 </div>

                                 <div className="flex items-center gap-4">
                                    {item.id === 'ram' && selected && (
                                       <div className="flex items-center bg-white/5 rounded-full px-6 py-3 gap-6 border border-white/10">
                                          <button onClick={(e) => { e.stopPropagation(); updateRamQty(-1); }} className="text-white/60 hover:text-white"><Minus size={14}/></button>
                                          <span className="text-[14px] font-black text-white">{selected.quantity}</span>
                                          <button onClick={(e) => { e.stopPropagation(); updateRamQty(1); }} className="text-white/60 hover:text-white"><Plus size={14}/></button>
                                       </div>
                                    )}
                                    
                                    <button onClick={(e) => { e.stopPropagation(); removeItem(item.id); }} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-rose-600 transition-all">
                                       <Trash2 size={22} />
                                    </button>
                                 </div>
                             </div>
                          </div>
                        ) : (
                          <div 
                            onClick={() => handleOpenPopup(item.id)}
                            onMouseEnter={() => setHoveredZone(item.id)}
                            onMouseLeave={() => setHoveredZone(null)}
                            className="relative p-8 rounded-[3rem] border border-white/10 bg-white/[0.02] hover:border-rose-600/50 hover:bg-white/[0.05] transition-all duration-500 group cursor-pointer overflow-hidden"
                          >
                            <div className="flex items-center justify-between relative z-10">
                              <div className="flex items-center gap-10">
                                <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 ${hoveredZone === item.id ? 'bg-rose-600 text-white shadow-[0_0_40px_rgba(225,29,72,0.5)]' : 'bg-white/10 text-white/50'}`}>
                                  {item.icon}
                                </div>
                                <div>
                                  <p className="text-[15px] font-black uppercase tracking-[0.1em] text-white/60 group-hover:text-white transition-colors">{item.label}</p>
                                  <p className="text-[11px] font-bold text-rose-500/80 mt-2 uppercase tracking-[0.2em]">Pending Integration</p>
                                </div>
                              </div>
                              <div className={`w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all ${hoveredZone === item.id ? 'bg-white text-black scale-110 shadow-2xl' : 'text-white/30'}`}>
                                <Plus size={24} />
                              </div>
                            </div>
                          </div>
                        )}
                        </>
                      )}

                      {isMulti && selected?.length > 0 && (
                        <button 
                          onClick={() => handleOpenPopup(item.id)}
                          className="w-full py-6 rounded-[2rem] border border-dashed border-white/20 text-[11px] font-black uppercase tracking-[0.3em] text-white/40 hover:border-rose-600/50 hover:text-rose-500 transition-all flex items-center justify-center gap-3"
                        >
                          <Plus size={16} /> Stack Another Asset
                        </button>
                      )}
                    </div>
                  );
                })}
                </div>
              </div>
            ))}
          </div>

          {/* Master HUD - Editorial Noir Style */}
          <div className="lg:col-span-4 space-y-16">
            <div className="bg-[#0A0B0C] border border-white/10 rounded-[4rem] p-16 sticky top-48 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden group">
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,_#200a0a_0%,_transparent_50%)]"></div>
              
              <div className="relative z-10 space-y-20">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-5xl font-light text-white leading-tight">Diagnostics.</h2>
                    <p className="text-[12px] font-black text-rose-500 uppercase tracking-[0.4em] mt-3">Live Telemetry</p>
                  </div>
                  <Activity size={40} className={`text-rose-500 ${totalBudget > 0 ? 'animate-pulse' : 'opacity-20'}`} />
                </div>

                <div className="space-y-14">
                  {[
                    { id: 'procPower', label: 'Processing Output', value: `${diagnostics.procPower}%`, color: 'bg-rose-600', width: diagnostics.procPower },
                    { id: 'graphPower', label: 'Graphical Load', value: `${diagnostics.graphPower}%`, color: 'bg-rose-700', width: diagnostics.graphPower },
                    { id: 'memAlloc', label: 'Data Registry', value: `${diagnostics.memAlloc}%`, color: 'bg-rose-800', width: diagnostics.memAlloc },
                    { id: 'stability', label: 'Engine Health', value: diagnostics.stability, color: 'bg-white', width: diagnostics.stability !== 'None' ? 100 : 0 },
                  ].map((metric) => {
                    const isHoverLinked = hoveredZone && metricMapping[hoveredZone]?.includes(metric.id);
                    
                    return (
                      <div key={metric.id} className={`space-y-5 transition-all duration-500 ${isHoverLinked ? 'scale-105' : ''}`}>
                        <div className="flex items-center justify-between px-1">
                          <span className={`text-[12px] font-black uppercase tracking-[0.3em] transition-colors ${isHoverLinked ? 'text-rose-500' : 'text-white/60'}`}>
                            {metric.label}
                          </span>
                          <span className="text-[13px] font-black text-white uppercase tracking-[0.2em]">{metric.value}</span>
                        </div>
                        <div className={`h-[3px] w-full bg-white/10 rounded-full overflow-hidden relative ${isHoverLinked ? 'shadow-[0_0_20px_rgba(225,29,72,0.4)]' : ''}`}>
                          <div 
                            className={`h-full ${metric.color} transition-all duration-1000 relative`}
                            style={{ width: `${metric.width}%` }}
                          >
                            {/* "Razer" Laser/Glitch Effect on Hover */}
                            {isHoverLinked && (
                              <div className="absolute top-0 right-0 h-full w-[20%] bg-white/40 blur-[4px] animate-[ping_1s_infinite]"></div>
                            )}
                          </div>
                          {isHoverLinked && (
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-16 border-t border-white/10 space-y-12">
                   <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[12px] font-black text-white/40 uppercase tracking-[0.5em] mb-4">Investment Scale</p>
                        <p className={`text-7xl font-black tracking-tighter transition-all duration-1000 ${totalBudget > 0 ? 'text-white' : 'text-white/20'}`}>
                          RM {totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="p-6 bg-white/5 rounded-[1.5rem] border border-white/10">
                         <Calculator size={32} className="text-rose-500" />
                      </div>
                   </div>
                   
                   <div className="p-10 bg-rose-600/10 border border-rose-600/30 rounded-[3rem] flex items-center gap-8 group/support cursor-pointer hover:bg-rose-600/20 transition-all">
                      <div className="w-16 h-16 rounded-[1.25rem] bg-rose-600/20 flex items-center justify-center text-rose-500">
                         <MessageCircle size={28} />
                      </div>
                      <div>
                         <p className="text-[13px] font-black uppercase tracking-[0.2em] text-white">Direct Advisory</p>
                         <p className="text-[11px] font-bold uppercase text-rose-500 mt-1">Registry Architect Link</p>
                      </div>
                      <ChevronRight size={24} className="ml-auto text-rose-500 transition-transform group-hover/support:translate-x-2" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Checkout Deck */}
      <div className="fixed bottom-0 left-0 right-0 z-[200] p-10 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
        <div className="max-w-[1600px] mx-auto bg-[#0A0B0C]/90 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-6 flex items-center justify-between shadow-[0_40px_120px_rgba(0,0,0,1)] pointer-events-auto overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-600/30 to-transparent"></div>
          
          <div className="flex items-center gap-20 px-12">
            <div className="flex flex-col">
              <span className="text-[12px] font-black text-rose-500 uppercase tracking-[0.6em]">Registry Manifest</span>
              <span className="font-serif text-4xl font-light text-white tracking-tight italic mt-2">Prototype_Noir</span>
            </div>
            <div className="hidden md:flex flex-col items-start border-l border-white/10 pl-20">
               <span className="text-[11px] font-black text-white/50 uppercase tracking-[0.4em]">Hardware Calibration</span>
               <div className="flex gap-3 mt-5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`w-10 h-[2px] rounded-full transition-all duration-700 ${totalBudget > 0 && i < 3 ? 'bg-rose-600 shadow-[0_0_10px_rose-600]' : 'bg-white/10'}`}></div>
                  ))}
               </div>
            </div>
          </div>

          <button 
            disabled={totalBudget === 0}
            onClick={() => navigate('/checkout')}
            className="h-24 px-16 bg-white text-black disabled:opacity-20 rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.5em] hover:bg-rose-600 hover:text-white transition-all flex items-center gap-12 group shadow-3xl active:scale-95"
          >
            Finalize Phase
            <div className="w-14 h-14 bg-black/10 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-2">
              <ArrowRight size={28} />
            </div>
          </button>
        </div>
      </div>

      {/* Popups & Dialogs Re-themed */}
      {activePopup && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 animate-in fade-in duration-700">
           <div className="absolute inset-0 bg-[#050607]/90 backdrop-blur-3xl" onClick={() => setActivePopup(null)}></div>
           
           <div className="relative w-full max-w-[1100px] bg-[#0A0B0C] border border-white/10 rounded-[5rem] shadow-[0_0_150px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[85vh]">
              
              <div className="p-14 border-b border-white/10 shrink-0 bg-gradient-to-b from-white/[0.03] to-transparent">
                 <button onClick={() => setActivePopup(null)} className="absolute top-14 right-14 w-16 h-16 rounded-full bg-white/10 text-white/50 hover:text-white hover:bg-rose-600 transition-all z-20 flex items-center justify-center shadow-2xl">
                    <X size={32} />
                 </button>

                 <div className="max-w-[700px] mx-auto relative group">
                    <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-rose-500 transition-colors" size={24} />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`Locate Master ${schematicZones.flatMap(z => z.items).find(i => i.id === activePopup)?.label || 'Units'}...`} 
                      className="w-full pl-24 pr-16 py-8 bg-white/[0.04] border border-white/10 rounded-full text-lg font-bold text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-rose-600/30 transition-all tracking-wide uppercase"
                    />
                 </div>
              </div>

              <div className="px-14 py-8 border-b border-white/10 flex items-center gap-6 shrink-0 overflow-x-auto scrollbar-hide">
                 {currentPopupData.filters.map((filter) => (
                   <button 
                     key={filter}
                     onClick={() => setActiveFilter(filter)}
                     className={`px-12 py-4 rounded-full text-[12px] font-black uppercase tracking-[0.3em] transition-all border ${
                       activeFilter === filter ? 'bg-rose-600 text-white border-rose-600 shadow-2xl' : 'bg-white/10 text-white/60 border-white/10 hover:bg-white/20'
                     }`}
                   >
                     {filter}
                   </button>
                 ))}
              </div>

              <div className="flex-1 overflow-y-auto p-14 space-y-6 scrollbar-hide">
                 <p className="text-[12px] font-black uppercase tracking-[0.5em] text-rose-500 mb-10 px-6">Available Registry Manifest</p>
                 {filteredItems.map((item, idx) => (
                   <div 
                     key={idx}
                     onClick={() => handleSelectItem(item)}
                     className="group p-10 rounded-[3rem] border border-transparent hover:border-rose-600/30 hover:bg-white/[0.04] flex items-center justify-between transition-all duration-500 cursor-pointer mb-4"
                   >
                      <div className="flex flex-col gap-3">
                         <h4 className="font-serif text-3xl font-light text-white group-hover:italic transition-all">{item.name}</h4>
                         <p className="text-[12px] font-medium text-white/50 uppercase tracking-[0.2em]">{item.desc}</p>
                      </div>
                      <div className="flex flex-col items-end gap-6 shrink-0">
                         <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                           item.status === 'Available' ? 'bg-rose-600/20 text-rose-500 border-rose-600/30' : 'bg-white/10 text-white/40 border-white/10'
                         }`}>
                            {item.status}
                         </span>
                         <span className="text-3xl font-black text-white tracking-tighter">RM {item.price.toLocaleString()}</span>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="p-10 bg-white/[0.02] border-t border-white/10 flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-6">
                    <div className="w-3 h-3 rounded-full bg-rose-600 animate-ping"></div>
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40">Manifest_Stream_Authenticated</span>
                 </div>
                 <button onClick={() => { setActiveFilter('ALL'); setSearchQuery(''); }} className="px-12 py-4 bg-white/10 text-white/60 rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-rose-600 hover:text-white transition-all shadow-xl">Flush Selection</button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

    </div>
  );
};

export default PCBuilder;
