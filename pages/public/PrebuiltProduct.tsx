import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Share2, RefreshCw, Copy, List, Calculator, MessageCircle, ArrowRight } from 'lucide-react';
import StudioNavbar from '../../components/StudioNavbar';

const PrebuiltProduct: React.FC = () => {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);

  // Mock data based on the image
  const product = {
    name: "Striker (AMD RYZEN 5 5500 | RTX3050)",
    price: 2299.00,
    oldPrice: 2793.00,
    saved: 494.00,
    specs: [
      { label: "CPU", value: "AMD RYZEN 5 5500" },
      { label: "CPU COOLER", value: "AMD WRAITH STEALTH" },
      { label: "MOTHERBOARD", value: "AMD A520M (MSI/GIGABYTE) (NON WIFI) ( 2x RAM SLOT | 1x NVME SLOT )" },
      { label: "RAM", value: "1X8GB (8GB) DDR4" },
      { label: "MAIN STORAGE", value: "ACER FA100 256GB GEN3 NVME SSD" },
      { label: "GPU", value: "NVIDIA GEFORCE RTX 3050 6GB (MSI)" },
      { label: "PSU", value: "THERMALTAKE 650W" },
      { label: "CASE", value: "TECWARE VXO M BLACK (3 FANS ARGB)" },
    ]
  };

  return (
    <div className="min-h-screen bg-[#050607] text-white">
      <StudioNavbar />
      
      <div className="pt-40 pb-32 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Image Gallery */}
          <div>
            <div className="aspect-square bg-[#1a1a1a] rounded-3xl mb-6 flex items-center justify-center">
              <span className="text-slate-600">Product Image</span>
            </div>
            <div className="flex gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-20 h-20 bg-[#1a1a1a] rounded-xl border border-white/10" />
              ))}
            </div>
          </div>

          {/* Right: Configuration */}
          <div>
            <h1 className="text-3xl font-black mb-6">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex bg-[#1a1a1a] rounded-full p-1">
                <button className="px-6 py-2 bg-rose-600 rounded-full text-sm font-bold">PC Configuration</button>
                <button className="px-6 py-2 rounded-full text-sm font-bold text-slate-400">Accessories</button>
                <button className="px-6 py-2 rounded-full text-sm font-bold text-slate-400">Gaming Chair & Desk</button>
              </div>
              <Share2 className="text-slate-400" />
              <div className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded-full">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <RefreshCw className="text-slate-400" />
              <Copy className="text-slate-400" />
              <List className="text-slate-400" />
            </div>

            {/* Configuration List */}
            <div className="space-y-4">
              {product.specs.map((spec, index) => (
                <div key={index} className="bg-[#1a1a1a] p-4 rounded-xl flex justify-between items-center border border-white/5">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase">{spec.label}</p>
                    <p className="font-bold">{spec.value}</p>
                  </div>
                  <ChevronRight className="text-rose-600" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] p-6 flex justify-between items-center border-t border-white/10">
        <div>
          <p className="text-2xl font-black text-rose-500">RM {product.price.toFixed(2)}</p>
          <p className="text-sm text-slate-400">Save RM {product.saved}</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-[#333] rounded-full"><Calculator size={18} /> Loan Calc.</button>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#333] rounded-full"><MessageCircle size={18} /> Talk To Us</button>
          <button className="flex items-center gap-2 px-8 py-3 bg-rose-600 rounded-full font-bold">Next <ArrowRight size={18} /></button>
        </div>
      </div>
    </div>
  );
};

export default PrebuiltProduct;
