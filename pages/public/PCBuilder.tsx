
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
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
import StudioNavbar from '../../components/StudioNavbar';

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

  const selectedCount = useMemo(() => {
    const mainIds = ['cpu', 'motherboard', 'gpu', 'ram', 'storage', 'cpu cooler', 'psu', 'case'];
    return mainIds.filter(id => {
      const selection = selections[id];
      if (Array.isArray(selection)) return selection.length > 0;
      return selection !== null;
    }).length;
  }, [selections]);

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
      group: "Core Components",
      items: [
        { id: 'cpu', label: 'CPU Processor', icon: <Microchip size={24} />, multi: false },
        { id: 'motherboard', label: 'Motherboard', icon: <Layers size={24} />, multi: false },
        { id: 'gpu', label: 'Graphic Card (GPU)', icon: <Gamepad2 size={24} />, multi: false },
        { id: 'ram', label: 'RAM', icon: <Box size={24} />, multi: false, hasQty: true },
      ]
    },
    {
      group: "Secondary Components",
      items: [
        { id: 'storage', label: 'Storage (SSD)', icon: <HardDrive size={24} />, multi: true },
        { id: 'cpu cooler', label: 'CPU Cooler', icon: <Waves size={24} />, multi: false },
        { id: 'psu', label: 'Power Supply', icon: <Zap size={24} />, multi: false },
        { id: 'case', label: 'Cases', icon: <Monitor size={24} />, multi: false },
      ]
    }
  ];

  const handleSelectItem = (item: BuildItem) => {
    if (!activePopup) return;
    setSelections(prev => {
      const newSels = { ...prev };
      if (activePopup === 'storage') {
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
    const coolingBonus = (getWeight('cpu cooler') / 5);
    const systemStability = Math.min(100, stabilityBase + coolingBonus);

    return {
      procPower: Math.round(procPower),
      graphPower: Math.round(graphPower),
      memAlloc: Math.round(memAlloc),
      stability: systemStability > 0 ? (systemStability > 80 ? 'Nominal' : 'Stable') : 'None'
    };
  }, [selections]);

  const [radarPulse, setRadarPulse] = useState(false);

  useEffect(() => {
    setRadarPulse(true);
    const timer = setTimeout(() => setRadarPulse(false), 1000);
    return () => clearTimeout(timer);
  }, [selections]);

  const radarData = useMemo(() => {
    const getWeight = (id: string) => selections[id]?.perfWeight || 0;
    
    // Performance: GPU (60%) + CPU (30%) + RAM (10%)
    const performance = Math.round((getWeight('gpu') * 0.6) + (getWeight('cpu') * 0.3) + (getWeight('ram') * 0.1)) || 0;
    
    // Speed: CPU (50%) + RAM (50%)
    const speed = Math.round((getWeight('cpu') * 0.5) + (getWeight('ram') * 0.5)) || 0;
    
    // Storage: Storage (SSD)
    const storageWeight = Array.isArray(selections['storage']) && selections['storage'].length > 0 
      ? selections['storage'].reduce((acc: number, curr: any) => acc + (curr.perfWeight || 0), 0) / selections['storage'].length
      : 0;
    const storage = Math.round(storageWeight) || 0;
    
    // Cooling: CPU Cooler (70%) + Fans (30%)
    const cooling = Math.round((getWeight('cpu cooler') * 0.7) + (getWeight('fans') * 0.3)) || 0;
    
    // Stability: PSU (60%) + Motherboard (40%)
    const stability = Math.round((getWeight('psu') * 0.6) + (getWeight('motherboard') * 0.4)) || 0;

    return [
      { subject: 'Performance', A: performance, fullMark: 100 },
      { subject: 'Speed', A: speed, fullMark: 100 },
      { subject: 'Storage', A: storage, fullMark: 100 },
      { subject: 'Cooling', A: cooling, fullMark: 100 },
      { subject: 'Stability', A: stability, fullMark: 100 },
    ];
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
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#1a0a0a_0%,_#050607_80%)]"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] pointer-events-none"></div>
        <div className="absolute top-[20%] left-[30%] w-[60%] h-[60%] bg-rose-600/5 blur-[150px] rounded-full animate-pulse duration-[10s]"></div>
      </div>

      {/* Header */}
      <StudioNavbar 
        showReset={true} 
        onReset={() => { localStorage.removeItem('meadow_pc_build'); window.location.reload(); }} 
      />

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
          <div className="lg:col-span-4">
            <div className="sticky top-32 z-50 space-y-8">
              <div className="bg-[#0A0B0C]/80 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group relative transition-all duration-500 hover:border-rose-600/30 hover:shadow-[0_20px_80px_rgba(225,29,72,0.15)]">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,_#200a0a_0%,_transparent_50%)]"></div>
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-lg font-light text-white leading-tight">Performance Overview.</h2>
                      <p className="text-[8px] font-black text-rose-500 uppercase tracking-[0.3em] mt-1">Live Telemetry</p>
                    </div>
                    <Activity size={20} className={`text-rose-500 ${totalBudget > 0 ? 'animate-pulse' : 'opacity-20'}`} />
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: 'procPower', label: 'Processing Power (CPU)', value: `${diagnostics.procPower}%`, color: 'bg-rose-600', width: diagnostics.procPower },
                      { id: 'graphPower', label: 'Graphical Performance (GPU)', value: `${diagnostics.graphPower}%`, color: 'bg-rose-700', width: diagnostics.graphPower },
                      { id: 'memAlloc', label: 'Memory (RAM Size/Speed)', value: `${diagnostics.memAlloc}%`, color: 'bg-rose-800', width: diagnostics.memAlloc },
                      { id: 'stability', label: 'Storage', value: diagnostics.stability, color: 'bg-white', width: diagnostics.stability !== 'None' ? 100 : 0 },
                    ].map((metric) => {
                      const isHoverLinked = hoveredZone && metricMapping[hoveredZone]?.includes(metric.id);
                      
                      return (
                        <div key={metric.id} className={`space-y-2 transition-all duration-500 ${isHoverLinked ? 'scale-105' : ''}`}>
                          <div className="flex items-center justify-between px-1">
                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${isHoverLinked ? 'text-rose-500' : 'text-white/60'}`}>
                              {metric.label}
                            </span>
                            <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{metric.value}</span>
                          </div>
                          <div className={`h-[2px] w-full bg-white/10 rounded-full overflow-hidden relative ${isHoverLinked ? 'shadow-[0_0_20px_rgba(225,29,72,0.4)]' : ''}`}>
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

                  <div className="pt-6 border-t border-white/10 space-y-4">
                     <div className="flex items-end justify-between">
                     </div>
                  </div>
                </div>
              </div>

              {/* Ability Pentagon Chart */}
              <div className={`bg-[#0A0B0C]/80 backdrop-blur-xl border transition-all duration-500 rounded-[1.5rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group relative ${radarPulse ? 'border-rose-600 shadow-[0_0_40px_rgba(225,29,72,0.3)] scale-[1.02]' : 'border-white/10'}`}>
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_0%_100%,_#0a1a20_0%,_transparent_50%)]"></div>
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-lg font-light text-white leading-tight">System Dynamics.</h2>
                      <p className="text-[8px] font-black text-rose-500 uppercase tracking-[0.3em] mt-1">Ability Matrix</p>
                    </div>
                    <ScanText size={20} className="text-rose-500 opacity-50" />
                  </div>

                  <div className="h-[220px] w-full relative">
                    {/* Scanning Line Effect */}
                    {radarPulse && (
                      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-full">
                        <div className="w-full h-[2px] bg-rose-500/50 shadow-[0_0_15px_rgba(225,29,72,0.8)] absolute top-0 animate-[scan_1s_ease-in-out_infinite]"></div>
                      </div>
                    )}
                    
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.25)" gridType="polygon" />
                        <PolarAngleAxis 
                          dataKey="subject" 
                          tick={{ 
                            fill: radarPulse ? '#e11d48' : 'rgba(255,255,255,0.7)', 
                            fontSize: 10, 
                            fontWeight: '900', 
                            letterSpacing: '0.05em',
                            transition: 'all 0.3s ease'
                          }}
                        />
                        <PolarRadiusAxis 
                          angle={90} 
                          domain={[0, 100]} 
                          tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 8, fontWeight: 'bold' }}
                          axisLine={true}
                          stroke="rgba(255,255,255,0.1)"
                          orientation="middle"
                        />
                        {/* Background Shadow Radar */}
                        <Radar
                          name="System Shadow"
                          dataKey="A"
                          stroke="none"
                          fill="#e11d48"
                          fillOpacity={0.2}
                          animationDuration={1000}
                        />
                        {/* Main Radar */}
                        <Radar
                          name="System"
                          dataKey="A"
                          stroke="#e11d48"
                          strokeWidth={3}
                          fill="#e11d48"
                          fillOpacity={0.7}
                          animationDuration={1500}
                          isAnimationActive={true}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 pt-4 border-t border-white/5">
                    {radarData.map((stat) => (
                      <div key={stat.subject} className="flex items-center justify-between">
                        <span className="text-[8px] font-black text-white/40 uppercase tracking-wider">{stat.subject}</span>
                        <span className="text-[10px] font-black text-white">{stat.A}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Floating Checkout Deck */}
      <div className="fixed bottom-0 left-0 right-0 z-[200] p-6 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
        <div className="max-w-[1600px] mx-auto bg-[#0A0B0C]/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-2 flex items-center justify-between shadow-[0_40px_120px_rgba(0,0,0,1)] pointer-events-auto overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-600/30 to-transparent"></div>
          
          <div className="flex items-center gap-12 px-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.6em]">Total Price</span>
              <span className="font-serif text-xl font-light text-white tracking-tight italic mt-1">RM {totalBudget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="hidden md:flex flex-col items-start border-l border-white/10 pl-12">
               <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.4em]">Hardware Calibration</span>
               <div className="flex gap-2 mt-3">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={`w-8 h-[1.5px] rounded-full transition-all duration-700 ${i < selectedCount ? 'bg-rose-600 shadow-[0_0_10px_rose-600]' : 'bg-white/10'}`}></div>
                  ))}
               </div>
            </div>
          </div>

          <button 
            disabled={totalBudget === 0}
            onClick={() => navigate('/checkout')}
            className="h-10 px-8 bg-white text-black disabled:opacity-20 rounded-full font-black text-[11px] uppercase tracking-[0.5em] hover:bg-rose-600 hover:text-white transition-all flex items-center gap-8 group shadow-3xl active:scale-95"
          >
            Next
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

    </div>
  );
};

export default PCBuilder;
