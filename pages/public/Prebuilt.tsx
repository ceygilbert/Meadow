import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import StudioNavbar from '../../components/StudioNavbar';

const Prebuilt: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050607] text-slate-100 selection:bg-rose-600 selection:text-white overflow-x-hidden">
      
      {/* Header */}
      <StudioNavbar />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-8 md:px-16">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-white mb-10">Pre-Built PC</h1>
          <p className="text-xl text-slate-400 max-w-2xl">High-performance systems, expertly assembled and ready for deployment.</p>
        </div>
      </section>

      {/* PC Packages */}
      <section className="py-20 px-8 md:px-16 bg-[#0a0b0c]">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-16 text-center">AMD PC PACKAGES | LOW / MID / HIGH-END MODEL</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Striker", cpu: "AMD RYZEN 5 5500", gpu: "RTX3050", price: "2,299.00", oldPrice: "2,793.00", saved: "494.00", recommended: false },
              { name: "Striker.V2", cpu: "AMD RYZEN 5 5500", gpu: "RTX5050", price: "2,599.00", oldPrice: "2,983.00", saved: "384.00", recommended: true },
              { name: "Phenom", cpu: "AMD RYZEN 5 5500", gpu: "RTX5060", price: "2,899.00", oldPrice: "3,233.00", saved: "334.00", recommended: false }
            ].map((pkg) => (
              <div key={pkg.name} className={`relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-3xl p-8 border ${pkg.recommended ? 'border-rose-500/50' : 'border-white/10'} flex flex-col hover:-translate-y-2 hover:border-rose-500/50 transition-all duration-300`}>
                {pkg.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 rounded-full">
                    Recommended
                  </div>
                )}
                <div className="aspect-video bg-black rounded-2xl mb-8 flex items-center justify-center border border-white/5">
                  <span className="text-slate-600 font-black uppercase tracking-widest">PC Image</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">{pkg.name}</h3>
                <p className="text-slate-400 text-sm mb-6 font-mono">{pkg.cpu} | {pkg.gpu}</p>
                <div className="mt-auto pt-6 border-t border-white/5">
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <p className="text-green-500 font-bold text-xs uppercase tracking-widest">Save RM {pkg.saved}</p>
                      <p className="text-slate-500 line-through text-sm">RM {pkg.oldPrice}</p>
                    </div>
                    <p className="text-3xl font-black text-white">RM {pkg.price}</p>
                  </div>
                  <Link 
                    to={`/prebuilt/${encodeURIComponent(pkg.name.toLowerCase().replace(/\s+/g, '-'))}`}
                    className="w-full py-4 bg-white text-slate-900 font-black uppercase tracking-widest rounded-full hover:bg-rose-600 hover:text-white transition-all text-center block"
                  >
                    View & Customise
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Prebuilt;
