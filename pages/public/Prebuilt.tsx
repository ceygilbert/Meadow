import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Cpu, 
  Zap, 
  Microchip, 
  MemoryStick, 
  HardDrive, 
  CircuitBoard, 
  Fan, 
  Power,
  ChevronRight,
  Wifi
} from 'lucide-react';
import StudioNavbar from '../../components/StudioNavbar';
import WaveGradient from '../../components/WaveGradient';

const Prebuilt: React.FC = () => {
  const packages = [
    {
      id: "unbeatable-rtx-combo",
      title: "UNBEATABLE RTX COMBO",
      cpuModel: "Ryzen 5 7500F",
      gpuModel: "GeForce RTX 3050",
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop",
      badge: "NOW WITH WIFI 7",
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
      cpuModel: "Ryzen 5 7500F",
      gpuModel: "GeForce RTX 5050",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=800&auto=format&fit=crop",
      badge: "NOW WITH WIFI 7",
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
      id: "level-1-amd",
      title: "LEVEL 1 AMD",
      cpuModel: "Ryzen 5 7500F",
      gpuModel: "GeForce RTX 5060",
      image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=800&auto=format&fit=crop",
      badge: "NOW WITH WIFI 7",
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
      cpuModel: "i5 14400F",
      gpuModel: "GeForce RTX 5060",
      image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=800&auto=format&fit=crop",
      badge: "NOW WITH WIFI 7",
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

  return (
    <div className="min-h-screen bg-[#050607] text-slate-100 selection:bg-rose-600 selection:text-white overflow-x-hidden">
      
      {/* Header */}
      <StudioNavbar />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-white mb-10">Pre-Built PC</h1>
          <p className="text-xl text-slate-400 max-w-2xl">High-performance systems, expertly assembled and ready for deployment.</p>
        </div>
      </section>

      {/* PC Packages */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#0a0b0c]">
        <div className="max-w-[1600px] mx-auto">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white mb-16 text-center border-b border-white/5 pb-8">
            PC PACKAGES | LOW / MID / HIGH-END MODEL
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="flex flex-col bg-[#0d0e0f] border border-white/5 rounded-[2rem] overflow-hidden group hover:border-rose-600/30 transition-all duration-500 shadow-2xl">
                {/* Card Header */}
                <div className="p-6 text-center bg-gradient-to-b from-white/[0.03] to-transparent border-b border-white/5">
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">{pkg.title}</h3>
                  <div className="flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest">
                    <span className="text-rose-500">{pkg.cpuModel}</span>
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
                    <div className="bg-blue-600/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-blue-400/30 flex items-center gap-2 shadow-xl">
                      <Wifi size={14} className="text-white" />
                      <span className="text-[9px] font-black text-white uppercase tracking-widest leading-none">WIFI 7</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e0f] via-transparent to-transparent opacity-60"></div>
                </div>

                {/* Specs List */}
                <div className="p-6 space-y-4 flex-grow">
                  {pkg.specs.map((spec, i) => (
                    <div key={i} className="flex items-start gap-4 group/spec">
                      <div className="mt-0.5 text-white/40 group-hover/spec:text-rose-500 transition-colors shrink-0">
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
                      className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center text-white hover:bg-rose-700 transition-all shadow-lg group/btn"
                    >
                      <ChevronRight size={24} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                  <Link 
                    to={`/prebuilt/${pkg.id}`}
                    className="block w-full py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-rose-600 hover:border-rose-600 transition-all text-center"
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
