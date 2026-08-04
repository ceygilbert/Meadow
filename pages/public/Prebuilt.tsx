import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Cpu, 
  Microchip, 
  MemoryStick, 
  HardDrive, 
  CircuitBoard, 
  Fan, 
  Power,
  ChevronRight,
  Wifi,
  PackageCheck,
  ShieldCheck,
  Grid,
  Zap
} from 'lucide-react';
import StudioNavbar from '../../components/StudioNavbar';
import Breadcrumbs from '../../components/Breadcrumbs';
import WaveGradient from '../../components/WaveGradient';

const Prebuilt: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeType = searchParams.get('type') || 'all';

  const packages = [
    {
      id: "unbeatable-rtx-combo",
      title: "UNBEATABLE RTX COMBO",
      type: "ready-to-ship",
      cpuModel: "Ryzen 5 7500F",
      gpuModel: "GeForce RTX 3050",
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop",
      badge: "READY TO SHIP",
      price: "2,299.00",
      specs: [
        { icon: <Microchip size={18} />, text: "AMD Ryzen 5 7500F Processor" },
        { icon: <Cpu size={18} />, text: "ZOTAC GeForce RTX 3050 Solo 6GB" },
        { icon: <MemoryStick size={18} />, text: "16GB KingBank KJXS Soarblade DDR5 6400Mhz CL32 (Silver) (16x1)" },
        { icon: <HardDrive size={18} />, text: "1TB Patriot P410 Lite Gen4 SSD (R 5000 | W 2300)" },
        { icon: <CircuitBoard size={18} />, text: "Gigabyte B850M C WIFI7" },
        { icon: <Fan size={18} />, text: "AMD Wraith Stealth Cooler" },
        { icon: <Power size={18} />, text: "550W Gigabyte 80+ Silver (ATX 3.0)" }
      ]
    },
    {
      id: "level-0-amd",
      title: "LEVEL 0 AMD",
      type: "ready-to-ship",
      cpuModel: "Ryzen 5 7500F",
      gpuModel: "GeForce RTX 5050",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=800&auto=format&fit=crop",
      badge: "READY TO SHIP",
      price: "2,599.00",
      specs: [
        { icon: <Microchip size={18} />, text: "AMD Ryzen 5 7500F Processor" },
        { icon: <Cpu size={18} />, text: "NVIDIA GeForce RTX 5050 8GB OC | [Select from Zotac/Palit models]" },
        { icon: <MemoryStick size={18} />, text: "16GB KingBank KJXS Soarblade DDR5 6400Mhz CL32 (Silver) (16x1)" },
        { icon: <HardDrive size={18} />, text: "1TB Patriot P410 Lite Gen4 SSD (R 5000 | W 2300)" },
        { icon: <CircuitBoard size={18} />, text: "Gigabyte B850M C WIFI7" },
        { icon: <Fan size={18} />, text: "AMD Wraith Stealth Cooler" },
        { icon: <Power size={18} />, text: "550W Gigabyte 80+ Silver (ATX 3.0)" }
      ]
    },
    {
      id: "gigabyte-aorus-master",
      title: "POWERED BY GIGABYTE AORUS",
      type: "powered-by-brand",
      cpuModel: "Ryzen 7 7800X3D",
      gpuModel: "AORUS RTX 4080 SUPER",
      image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=800&auto=format&fit=crop",
      badge: "POWERED BY GIGABYTE",
      price: "8,999.00",
      specs: [
        { icon: <Microchip size={18} />, text: "AMD Ryzen 7 7800X3D Processor" },
        { icon: <Cpu size={18} />, text: "Gigabyte AORUS GeForce RTX 4080 SUPER MASTER 16G" },
        { icon: <MemoryStick size={18} />, text: "32GB Gigabyte AORUS RGB DDR5 6000MHz" },
        { icon: <HardDrive size={18} />, text: "2TB AORUS Gen5 10000 SSD" },
        { icon: <CircuitBoard size={18} />, text: "Gigabyte X670E AORUS MASTER" },
        { icon: <Fan size={18} />, text: "AORUS WATERFORCE X II 360 ICE" },
        { icon: <Power size={18} />, text: "1000W Gigabyte AORUS 80+ Gold Modular" }
      ]
    },
    {
      id: "asus-rog-strix-edition",
      title: "POWERED BY ASUS ROG",
      type: "powered-by-brand",
      cpuModel: "Intel i9 14900K",
      gpuModel: "ROG STRIX RTX 4090",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
      badge: "POWERED BY ASUS",
      price: "12,499.00",
      specs: [
        { icon: <Microchip size={18} />, text: "Intel Core i9 14900K Processor" },
        { icon: <Cpu size={18} />, text: "ASUS ROG Strix GeForce RTX 4090 24GB OC" },
        { icon: <MemoryStick size={18} />, text: "64GB Corsair Dominator Titanium DDR5 7200MHz" },
        { icon: <HardDrive size={18} />, text: "2TB Samsung 990 PRO Gen4 SSD" },
        { icon: <CircuitBoard size={18} />, text: "ASUS ROG MAXIMUS Z790 HERO" },
        { icon: <Fan size={18} />, text: "ASUS ROG RYUJIN III 360 ARGB" },
        { icon: <Power size={18} />, text: "1200W ASUS ROG Thor II 80+ Platinum" }
      ]
    },
    {
      id: "level-1-amd",
      title: "LEVEL 1 AMD",
      type: "ready-to-ship",
      cpuModel: "Ryzen 5 7500F",
      gpuModel: "GeForce RTX 5060",
      image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=800&auto=format&fit=crop",
      badge: "READY TO SHIP",
      price: "2,899.00",
      specs: [
        { icon: <Microchip size={18} />, text: "AMD Ryzen 5 7500F Processor" },
        { icon: <Cpu size={18} />, text: "NVIDIA GeForce RTX 5060 8GB OC | [Select from PNY/Gigabyte models]" },
        { icon: <MemoryStick size={18} />, text: "16GB Patriot SL Sig DDR5 6400MHz CL34 Low Latency" },
        { icon: <HardDrive size={18} />, text: "1TB Patriot P410 Lite Gen4 SSD (R 5000 | W 2300)" },
        { icon: <CircuitBoard size={18} />, text: "Gigabyte B850M C WIFI7" },
        { icon: <Fan size={18} />, text: "AMD Wraith Stealth Cooler" },
        { icon: <Power size={18} />, text: "550W Gigabyte 80+ Silver (ATX 3.0)" }
      ]
    },
    {
      id: "level-1-intel",
      title: "LEVEL 1 INTEL",
      type: "ready-to-ship",
      cpuModel: "i5 14400F",
      gpuModel: "GeForce RTX 5060",
      image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=800&auto=format&fit=crop",
      badge: "READY TO SHIP",
      price: "2,999.00",
      specs: [
        { icon: <Microchip size={18} />, text: "Intel Core i5 14400F Processor" },
        { icon: <Cpu size={18} />, text: "NVIDIA GeForce RTX 5060 8GB OC | [Select from PNY/Gigabyte models]" },
        { icon: <MemoryStick size={18} />, text: "16GB KingBank KJXS Soarblade DDR5 6000MHz CL32 (Silver) (16x1)" },
        { icon: <HardDrive size={18} />, text: "1TB Patriot P410 Lite Gen4 SSD (R 5000 | W 2300)" },
        { icon: <CircuitBoard size={18} />, text: "ASUS B760M AYW WIFI" },
        { icon: <Fan size={18} />, text: "ID Cooling SE 214 XT" },
        { icon: <Power size={18} />, text: "550W Gigabyte 80+ Silver (ATX 3.0)" }
      ]
    }
  ];

  const filteredPackages = packages.filter(pkg => {
    if (activeType === 'ready-to-ship') return pkg.type === 'ready-to-ship';
    if (activeType === 'powered-by-brand') return pkg.type === 'powered-by-brand';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#050607] text-slate-100 selection:bg-red-600 selection:text-white overflow-x-hidden">
      
      {/* Header */}
      <StudioNavbar />

      <div className="max-w-[1600px] mx-auto px-8 md:px-16 pt-36 md:pt-44">
        {/* Build PC Hero Banner */}
        <div className="relative mb-12 rounded-[2.5rem] overflow-hidden border border-white/10 bg-gradient-to-r from-[#0d0e11] via-[#121418] to-[#1a0a0f] p-8 md:p-12 shadow-2xl">
          {/* Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-600/15 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Text Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-600/10 border border-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-[0.25em]">
                <Cpu size={14} className="text-rose-500 animate-pulse" />
                <span>Next-Gen System Configurator</span>
              </div>

              <h1 className="text-4xl md:text-6xl xl:text-7xl font-black uppercase tracking-tight text-white leading-none">
                BUILD YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400">DREAM PC</span>
              </h1>

              <p className="text-slate-300 text-base md:text-lg font-medium max-w-2xl leading-relaxed">
                Engineer your ultimate workstation or gaming rig with complete freedom. Select premium flagship processors, graphics cards, liquid cooling, and custom chassis with real-time hardware compatibility validation.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <Zap size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-wider text-white">Live Wattage</div>
                    <div className="text-[10px] text-slate-400 font-medium">Auto PSU Estimator</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Microchip size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-wider text-white">100% Compatible</div>
                    <div className="text-[10px] text-slate-400 font-medium">Smart Socket Check</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1200&auto=format&fit=crop"
                  alt="Build PC Custom Rig Banner"
                  className="w-full h-[260px] md:h-[320px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e11] via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-white">Meadow Custom Showcase</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-600/20 border border-rose-500/30 px-3 py-1 rounded-full">Pro Assembly</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Breadcrumbs items={[{ label: 'PRE-BUILT SYSTEMS' }]} />
      </div>

      {/* Hero Section */}
      <section className="pt-40 pb-16 px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-white mb-6">Pre-Built PC</h1>
          <p className="text-xl text-slate-400 max-w-2xl">High-performance systems, expertly assembled and ready for deployment.</p>
        </div>
      </section>

      {/* PC Packages */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-[#0a0b0c]">
        <div className="max-w-[1600px] mx-auto">
          
          {/* Sub Items Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16 border-b border-white/5 pb-8">
            <button
              onClick={() => setSearchParams({})}
              className={`px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2.5 ${
                activeType === 'all'
                  ? 'bg-white text-slate-900 shadow-lg shadow-white/10'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              <Grid size={16} />
              <span>All Pre-Builts</span>
            </button>

            <button
              onClick={() => setSearchParams({ type: 'ready-to-ship' })}
              className={`px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2.5 ${
                activeType === 'ready-to-ship'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              <PackageCheck size={16} />
              <span>Ready-to-Ship PCs</span>
            </button>

            <button
              onClick={() => setSearchParams({ type: 'powered-by-brand' })}
              className={`px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2.5 ${
                activeType === 'powered-by-brand'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              <ShieldCheck size={16} />
              <span>Powered by Brand</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPackages.map((pkg) => (
              <div key={pkg.id} className="flex flex-col bg-[#0d0e0f] border border-white/5 rounded-[2rem] overflow-hidden group hover:border-red-600/30 transition-all duration-500 shadow-2xl">
                {/* Card Header */}
                <div className="p-6 text-center bg-gradient-to-b from-white/[0.03] to-transparent border-b border-white/5">
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">{pkg.title}</h3>
                  <div className="flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest">
                    <span className="text-red-500">{pkg.cpuModel}</span>
                    <span className="text-white/20">+</span>
                    <span className="text-green-500">{pkg.gpuModel}</span>
                  </div>
                </div>

                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={pkg.image} 
                    alt={pkg.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  {/* Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className={`backdrop-blur-md px-3 py-1.5 rounded-lg border flex items-center gap-2 shadow-xl ${
                      pkg.type === 'powered-by-brand' 
                        ? 'bg-blue-600/90 border-blue-400/30 text-white' 
                        : 'bg-red-600/90 border-red-400/30 text-white'
                    }`}>
                      <Wifi size={14} className="text-white" />
                      <span className="text-[9px] font-black uppercase tracking-widest leading-none">{pkg.badge}</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e0f] via-transparent to-transparent opacity-60"></div>
                </div>

                {/* Specs List */}
                <div className="p-6 space-y-4 flex-grow">
                  {pkg.specs.map((spec, i) => (
                    <div key={i} className="flex items-start gap-4 group/spec">
                      <div className="mt-0.5 text-white/40 group-hover/spec:text-red-500 transition-colors shrink-0">
                        {spec.icon}
                      </div>
                      <p className="text-[11px] text-slate-300 font-medium leading-relaxed tracking-wide">
                        {spec.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Footer / Price */}
                <div className="p-6 mt-auto border-t border-white/5 bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Starting from</p>
                      <p className="text-3xl font-black text-white tracking-tighter">RM {pkg.price}</p>
                    </div>
                    <Link 
                      to={`/prebuilt/${pkg.id}`}
                      className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-700 transition-all shadow-lg group/btn"
                    >
                      <ChevronRight size={24} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                  <Link 
                    to={`/prebuilt/${pkg.id}`}
                    className="block w-full py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-red-600 hover:border-red-600 transition-all text-center"
                  >
                    Customise Build
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <WaveGradient />
    </div>
  );
};

export default Prebuilt;
