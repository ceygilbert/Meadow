
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Cpu, ArrowLeft, Settings2, Hammer, MousePointer2 } from 'lucide-react';

const Customised: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <nav className="fixed top-0 left-0 right-0 h-20 px-6 md:px-12 flex items-center justify-between bg-white/80 backdrop-blur-3xl z-50 border-b border-slate-50">
        <div className="flex items-center gap-2">
          <Link to="/" className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
            <Cpu size={18} />
          </Link>
          <span className="text-lg font-black tracking-tighter uppercase">Meadow</span>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Node
        </button>
      </nav>

      <main className="pt-40 px-6 md:px-12 max-w-7xl mx-auto pb-20">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-blue-100">
              <Settings2 size={12} /> Custom Calibration
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-10">
              Your vision, <br /> <span className="text-slate-300 italic">engineered.</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-lg mb-12">
              Beyond the shelf. We specialize in high-performance liquid cooling loops, custom cable management, and professional overclocking for extreme workloads.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-blue-200 transition-all">
                <Hammer className="text-blue-600 mb-4" />
                <h3 className="font-black uppercase text-sm mb-2">Build Service</h3>
                <p className="text-xs text-slate-400 font-medium">Professional assembly with 48h stress testing.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-blue-200 transition-all">
                <MousePointer2 className="text-blue-600 mb-4" />
                <h3 className="font-black uppercase text-sm mb-2">Configuration</h3>
                <p className="text-xs text-slate-400 font-medium">Virtual consultation with lead engineers.</p>
              </div>
            </div>
          </div>

          <div className="relative aspect-square">
            <div className="absolute inset-0 bg-blue-600/5 rounded-[4rem] blur-3xl"></div>
            <div className="relative h-full w-full bg-[#F9FAFB] rounded-[3.5rem] border border-slate-100 overflow-hidden group shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80" 
                className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" 
              />
              <div className="absolute bottom-10 left-10 right-10 p-8 bg-white/90 backdrop-blur-xl rounded-[2rem] border border-white shadow-2xl">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2">Coming Soon</p>
                 <h4 className="text-xl font-black uppercase tracking-tighter">Rig Configurator 2.0</h4>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Customised;
