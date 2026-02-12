
import React, { useState, useEffect, useMemo } from 'react';
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
  TicketPercent,
  Wifi,
  Wind,
  Disc,
  MousePointer2,
  Minus,
  Trash2
} from 'lucide-react';

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/White%20Full%20Logo.png";

// Interface for components in our build
interface BuildItem {
  name: string;
  desc: string;
  price: number;
  status: string;
  perfWeight?: number; // 1-100 score for diagnostics
  quantity?: number;
}

const PCBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState('PC Build');
  const [scrolled, setScrolled] = useState(false);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  // State for all selected components
  const [selections, setSelections] = useState<Record<string, any>>({
    promotion: null,
    cpu: null,
    'cpu cooler': null,
    motherboard: null,
    ram: null, // { ...item, quantity: 1 }
    storage: [], // Array for multiple storage
    gpu: null,
    psu: null,
    case: null,
    fans: null,
    networking: null,
    os: null,
    accessories: [] // Array for multiple accessories
  });

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

  // Component Data categorized by the user's requested list
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
        { name: "Corsair Vengeance RGB 32GB (2x16GB)", desc: "DDR5 6000MT/s CL30", price: 559, status: "Available", perfWeight: 80 },
        { name: "G.Skill Trident Z5 RGB 64GB", desc: "DDR5 6400MT/s", price: 1059, status: "Available", perfWeight: 95 },
        { name: "Kingston FURY Renegade 16GB", desc: "DDR4 3600MT/s", price: 259, status: "Available", perfWeight: 40 },
      ]
    },
    storage: {
      filters: ['ALL', 'NVME', 'SATA', 'HDD'],
      items: [
        { name: "Samsung 990 Pro 2TB", desc: "Gen4 NVMe, 7450MB/s", price: 899, status: "Available", perfWeight: 98 },
        { name: "Western Digital Black SN850X 1TB", desc: "Gen4 Gaming Drive", price: 459, status: "Available", perfWeight: 90 },
        { name: "Seagate IronWolf 4TB", desc: "NAS Internal HDD", price: 499, status: "Available", perfWeight: 30 },
      ]
    },
    gpu: {
      filters: ['ALL', 'NVIDIA', 'AMD'],
      items: [
        { name: "NVIDIA GeForce RTX 4090", desc: "24GB GDDR6X, Founders Edition", price: 8999, status: "Sold Out", perfWeight: 100 },
        { name: "ASUS ROG Strix RTX 4080 Super", desc: "16GB, Triple Fan", price: 5299, status: "Available", perfWeight: 92 },
        { name: "Sapphire Nitro+ RX 7900 XTX", desc: "24GB, AMD RDNA 3", price: 4599, status: "Available", perfWeight: 94 },
      ]
    },
    psu: {
      filters: ['ALL', '850W+', '750W', 'SFF'],
      items: [
        { name: "Corsair RM850x (2021)", desc: "850W, 80+ Gold Fully Modular", price: 599, status: "Available", perfWeight: 85 },
        { name: "ASUS ROG Thor 1200P2", desc: "1200W, 80+ Platinum, OLED", price: 1459, status: "Available", perfWeight: 100 },
        { name: "Cooler Master V850 SFX", desc: "Gold, ITX Build Specialist", price: 659, status: "Available", perfWeight: 80 },
      ]
    },
    case: {
      filters: ['ALL', 'MID TOWER', 'FULL TOWER', 'ITX'],
      items: [
        { name: "Lian Li O11 Dynamic EVO", desc: "Dual Chamber, Panoramic View", price: 759, status: "Available", perfWeight: 90 },
        { name: "NZXT H9 Flow", desc: "Mid-Tower Airflow Chassis", price: 799, status: "Available", perfWeight: 85 },
        { name: "Fractal Design North", desc: "Walnut Trim, Elegant Design", price: 659, status: "Available", perfWeight: 80 },
      ]
    },
    fans: {
      filters: ['ALL', '120MM', '140MM', 'PACKS'],
      items: [
        { name: "Lian Li UNI Fan SL-Infinity", desc: "3-Pack, 120mm ARGB", price: 429, status: "Available", perfWeight: 90 },
        { name: "Corsair iCUE Link QX120", desc: "Single Fan, High Perf", price: 199, status: "Available", perfWeight: 80 },
        { name: "Noctua NF-A12x25 PWM", desc: "Industrial Brown Silent", price: 149, status: "Available", perfWeight: 95 },
      ]
    },
    networking: {
      filters: ['ALL', 'WIFI 7', 'WIFI 6E', 'BLUETOOTH'],
      items: [
        { name: "ASUS PCE-AXE59BT", desc: "WiFi 6E + Bluetooth 5.2", price: 259, status: "Available", perfWeight: 80 },
        { name: "TP-Link Archer TX20E", desc: "AX1800 Dual Band", price: 129, status: "Available", perfWeight: 40 },
      ]
    },
    os: {
      filters: ['ALL', 'HOME', 'PRO'],
      items: [
        { name: "Windows 11 Home", desc: "Retail USB Version", price: 499, status: "Available", perfWeight: 100 },
        { name: "Windows 11 Pro", desc: "Retail USB Version", price: 699, status: "Available", perfWeight: 100 },
      ]
    },
    accessories: {
      filters: ['ALL', 'MOUSE', 'KEYBOARD', 'HEADSET'],
      items: [
        { name: "Logitech G Pro X Superlight 2", desc: "Wireless, 60g Lightweight", price: 699, status: "Available", perfWeight: 100 },
        { name: "Razer Huntsman V3 Pro", desc: "Analog Optical, TKL", price: 999, status: "Available", perfWeight: 100 },
        { name: "SteelSeries Arctis Nova Pro", desc: "Wireless Multi-System", price: 1599, status: "Available", perfWeight: 100 },
      ]
    }
  };

  // Build Schematic Categories
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

  // Logic to handle selection
  const handleSelectItem = (item: BuildItem) => {
    if (!activePopup) return;

    setSelections(prev => {
      const newSels = { ...prev };
      
      if (activePopup === 'storage' || activePopup === 'accessories') {
        // Multi-select categories
        newSels[activePopup] = [...(newSels[activePopup] || []), { ...item }];
      } else if (activePopup === 'ram') {
        // RAM kit selection with default quantity 1
        newSels[activePopup] = { ...item, quantity: 1 };
      } else {
        // Single select categories
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

  // Derived Build Valuation
  const totalBudget = useMemo(() => {
    let total = 0;
    Object.keys(selections).forEach(key => {
      const val = selections[key];
      if (Array.isArray(val)) {
        val.forEach(item => total += item.price);
      } else if (val) {
        if (key === 'ram') {
          total += val.price * (val.quantity || 1);
        } else {
          total += val.price;
        }
      }
    });
    return total;
  }, [selections]);

  // Derived Diagnostics (Mock calculation based on performance weights)
  const diagnostics = useMemo(() => {
    const getWeight = (id: string) => selections[id]?.perfWeight || 0;
    
    // Processing Power: Influenced by CPU mainly, then Mobo and Cooler
    const cpuWeight = getWeight('cpu');
    const procPower = (cpuWeight * 0.7) + (getWeight('motherboard') * 0.15) + (getWeight('cpu cooler') * 0.15);
    
    // Graphical Capacity: Heavily GPU dependent
    const gpuWeight = getWeight('gpu');
    const graphPower = (gpuWeight * 0.95) + (getWeight('psu') * 0.05);

    // Memory Allocation: RAM kit tier and quantity
    const ramBase = getWeight('ram');
    const ramQty = selections.ram?.quantity || 0;
    const memAlloc = Math.min(100, (ramBase * 0.8) + (ramQty > 1 ? 20 : 0));

    // Stability: Psu, Case, Cooler
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

  const getPopupData = () => {
    if (!activePopup) return { filters: [], items: [] };
    return COMPONENT_DATA[activePopup] || { filters: ['ALL'], items: [] };
  };

  const currentPopupData = getPopupData();
  const filteredItems = currentPopupData.items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'ALL' || item.name.toUpperCase().includes(activeFilter) || item.desc.toUpperCase().includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#050607] font-sans text-slate-100 selection:bg-cyan-500 selection:text-white overflow-x-hidden">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#0a141d_0%,_#050607_100%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-[20%] left-[30%] w-[60%] h-[60%] bg-cyan-500/5 blur-[150px] rounded-full animate-pulse duration-[10s]"></div>
      </div>

      {/* Header */}
      <nav className={`fixed top-0 left-0 right-0 h-24 px-8 md:px-16 flex items-center justify-between z-[100] transition-all duration-700 ${scrolled ? 'bg-[#050607]/90 backdrop-blur-3xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="flex items-center gap-16">
          <Link to="/customised" className="group flex items-center gap-6">
             <img src={LOGO_URL} className="h-10 md:h-16 w-auto transition-all group-hover:drop-shadow-[0_0_15px_cyan]" alt="Meadow" />
             <div className="w-px h-10 bg-white/10 hidden lg:block"></div>
             <div className="hidden lg:flex flex-col">
                <span className="text-[12px] font-black tracking-[0.4em] text-cyan-500 uppercase">Forge Mode</span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">System.Eng_V2.5</span>
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
          <button 
            onClick={() => window.location.reload()}
            className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/30 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
          >
            <RotateCcw size={22} />
          </button>
          <button className="w-14 h-14 bg-cyan-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-600/20">
            <ShoppingCart size={22} />
          </button>
        </div>
      </nav>

      <main className="relative pt-40 px-8 md:px-16 max-w-[1800px] mx-auto z-10 pb-48">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Schematic Grid */}
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
                
                {zone.items.map((item) => {
                  const selected = selections[item.id];
                  const isMulti = item.multi;
                  
                  return (
                    <div key={item.id} className="space-y-3">
                      {/* If Multi-select, render each item row */}
                      {isMulti && Array.isArray(selected) && selected.map((sItem: any, sIdx: number) => (
                        <div 
                          key={sIdx}
                          className="relative p-6 rounded-[2rem] border bg-white/10 border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.15)] group overflow-hidden"
                        >
                          <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-6">
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-cyan-500 text-black shadow-[0_0_15px_cyan]">
                                {item.icon}
                              </div>
                              <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80">{sItem.name}</p>
                                <p className="text-[10px] font-bold text-cyan-500 mt-1 uppercase tracking-widest">RM {sItem.price.toLocaleString()}</p>
                              </div>
                            </div>
                            <button onClick={() => removeItem(item.id, sIdx)} className="p-2 text-white/20 hover:text-rose-500 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Main Interaction Card */}
                      {(!isMulti || (isMulti && selected.length === 0)) && (
                        <div 
                          onClick={() => handleOpenPopup(item.id)}
                          onMouseEnter={() => setHoveredZone(item.id)}
                          onMouseLeave={() => setHoveredZone(null)}
                          className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 group cursor-pointer overflow-hidden ${
                            selected 
                              ? 'bg-white/10 border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.15)]' 
                              : 'bg-white/[0.02] border-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-8">
                              <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-500 ${selected || hoveredZone === item.id ? 'bg-cyan-500 text-black shadow-[0_0_25px_cyan]' : 'bg-white/5 text-white/30'}`}>
                                {item.icon}
                              </div>
                              <div>
                                <p className="text-[13px] font-black uppercase tracking-[0.2em] text-white/80">
                                  {selected ? (item.id === 'ram' ? `${selected.name} (x${selected.quantity})` : selected.name) : item.label}
                                </p>
                                <p className="text-[11px] font-bold text-cyan-500/50 mt-1.5 uppercase tracking-widest">
                                  {selected ? `RM ${(selected.price * (selected.quantity || 1)).toLocaleString()}` : "Awaiting Integration"}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                               {item.id === 'ram' && selected && (
                                 <div className="flex items-center bg-white/5 rounded-full px-4 py-2 gap-4 border border-white/10 mr-4">
                                   <button onClick={(e) => { e.stopPropagation(); updateRamQty(-1); }} className="text-white/40 hover:text-white"><Minus size={14}/></button>
                                   <span className="text-[10px] font-black">{selected.quantity}</span>
                                   <button onClick={(e) => { e.stopPropagation(); updateRamQty(1); }} className="text-white/40 hover:text-white"><Plus size={14}/></button>
                                 </div>
                               )}
                               
                               {selected ? (
                                 <button onClick={(e) => { e.stopPropagation(); removeItem(item.id); }} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-rose-500/10 hover:text-rose-500 transition-all">
                                   <Trash2 size={18} />
                                 </button>
                               ) : (
                                 <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all ${hoveredZone === item.id ? 'bg-white text-black scale-110 shadow-xl' : 'text-white/20'}`}>
                                   <Plus size={20} />
                                 </div>
                               )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* If Multi-select and has items, show "Add Another" button */}
                      {isMulti && selected.length > 0 && (
                        <button 
                          onClick={() => handleOpenPopup(item.id)}
                          className="w-full py-4 rounded-[1.5rem] border border-dashed border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:border-cyan-500/50 hover:text-cyan-500 transition-all flex items-center justify-center gap-2"
                        >
                          <Plus size={14} /> Add Another {item.label.split(' ').pop()}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Master HUD */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-[#0A0B0C] border border-white/10 rounded-[3.5rem] p-12 sticky top-40 shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,_#0e141b_0%,_transparent_60%)]"></div>
              
              <div className="relative z-10 space-y-14">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Diagnostics</h2>
                    <p className="text-[11px] font-black text-cyan-500 uppercase tracking-[0.3em] mt-1.5">Live Telemetry</p>
                  </div>
                  <Activity size={32} className={`text-cyan-400 ${totalBudget > 0 ? 'animate-pulse' : 'opacity-20'}`} />
                </div>

                <div className="space-y-10">
                  {[
                    { label: 'Processing Power', value: `${diagnostics.procPower}%`, color: 'bg-cyan-500', width: diagnostics.procPower },
                    { label: 'Graphical Capacity', value: `${diagnostics.graphPower}%`, color: 'bg-blue-600', width: diagnostics.graphPower },
                    { label: 'Memory Availability', value: `${diagnostics.memAlloc}%`, color: 'bg-indigo-500', width: diagnostics.memAlloc },
                    { label: 'System Stability', value: diagnostics.stability, color: 'bg-emerald-500', width: diagnostics.stability !== 'None' ? 100 : 0 },
                  ].map((metric, i) => (
                    <div key={i} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em]">{metric.label}</span>
                        <span className="text-[12px] font-black text-white/80 uppercase tracking-widest">{metric.value}</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${metric.color} transition-all duration-1000`}
                          style={{ width: `${metric.width}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col gap-10">
                   <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em]">Build Valuation</p>
                        <p className={`text-6xl font-black mt-1.5 tracking-tighter transition-all ${totalBudget > 0 ? 'text-white' : 'text-white/20'}`}>
                          RM {totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
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
                         <p className="text-[12px] font-black uppercase tracking-widest text-white">Engineering Assist</p>
                         <p className="text-[10px] font-bold uppercase text-cyan-500/50">Consultancy Link</p>
                      </div>
                      <ChevronRight size={18} className="ml-auto text-cyan-500 transition-transform group-hover/support:translate-x-1" />
                   </div>
                </div>
              </div>
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
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-6 h-1.5 rounded-full transition-colors ${totalBudget > 0 && i < 3 ? 'bg-cyan-500' : 'bg-white/10'}`}></div>
                  ))}
               </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              disabled={totalBudget === 0}
              className="h-20 px-12 bg-white text-black disabled:opacity-20 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.5em] hover:bg-cyan-500 hover:text-white transition-all flex items-center gap-10 group shadow-2xl active:scale-95"
            >
              Initialize Phase II
              <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1">
                <ArrowRight size={24} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Component Selection Popup */}
      {activePopup && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-[#050607]/80 backdrop-blur-2xl" onClick={() => setActivePopup(null)}></div>
           
           <div className="relative w-full max-w-[1000px] bg-[#0A0B0C] border border-white/10 rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh]">
              
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
                      placeholder={`Search all ${schematicZones.flatMap(z => z.items).find(i => i.id === activePopup)?.label || 'Components'}...`} 
                      className="w-full pl-16 pr-16 py-5 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-white placeholder:text-white/20 outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all tracking-wider uppercase"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                        <X size={18} />
                      </button>
                    )}
                 </div>
              </div>

              <div className="px-10 py-6 border-b border-white/5 flex items-center gap-4 shrink-0 overflow-x-auto scrollbar-hide">
                 <button className="p-3 rounded-xl bg-white/5 text-white/40 hover:text-white shrink-0"><ChevronLeft size={20} /></button>
                 <div className="flex items-center gap-2">
                    {currentPopupData.filters.map((filter) => (
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

              <div className="flex-1 overflow-y-auto p-10 space-y-4 scrollbar-hide">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500 mb-6 px-4">Available Manifest Items</p>
                    {filteredItems.map((item, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handleSelectItem(item)}
                        className="group p-6 rounded-3xl border border-transparent hover:border-white/5 hover:bg-white/[0.02] flex items-center justify-between transition-all cursor-pointer mb-2"
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
                    {filteredItems.length === 0 && (
                      <div className="py-20 text-center opacity-20">
                         <Search size={48} className="mx-auto mb-4" />
                         <p className="text-xs font-black uppercase tracking-widest">No matching units found</p>
                      </div>
                    )}
                 </div>

                 <div className="p-8 rounded-[2rem] bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-between group cursor-pointer hover:bg-cyan-500/10 transition-all">
                    <div className="space-y-1">
                       <h4 className="text-[14px] font-black text-white uppercase tracking-tight">Requirement Unlisted?</h4>
                       <p className="text-[10px] font-bold text-cyan-500/50 uppercase tracking-widest">Speak with our master architect for unique configurations</p>
                    </div>
                    <div className="flex items-center gap-6">
                       <span className="px-4 py-1 rounded-full bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest">Inquiry Node</span>
                       <span className="text-xl font-black text-white">RM 0</span>
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-white/[0.02] border-t border-white/5 flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Syncing_User_Selection_Stream</span>
                 </div>
                 <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                       <Info size={14} className="text-white/20" />
                       <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Hardware Compatibility Guaranteed</span>
                    </div>
                    <button onClick={() => { setActiveFilter('ALL'); setSearchQuery(''); }} className="px-8 py-3 bg-white/5 text-white/40 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Reset List</button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default PCBuilder;
