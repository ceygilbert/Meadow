import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Share2, RefreshCw, Copy, List, Calculator, MessageCircle, ArrowRight, X, Check, ChevronDown } from 'lucide-react';
import StudioNavbar from '../../components/StudioNavbar';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  id: string;
  label: string;
  price: number;
}

const RAM_OPTIONS: Option[] = [
  { id: '8gb', label: '1X8GB (8GB) DDR4', price: 0 },
  { id: '16gb', label: '2X8GB (16GB) DDR4 3200MHZ', price: 150 },
  { id: '32gb', label: '2X16GB (32GB) DDR4 3600MHZ', price: 450 },
];

const SSD_OPTIONS: Option[] = [
  { id: '256gb', label: 'ACER FA100 256GB GEN3 NVME SSD', price: 0 },
  { id: '512gb', label: 'ACER FA100 512GB GEN3 NVME SSD', price: 80 },
  { id: '1tb', label: 'ACER FA100 1TB GEN3 NVME SSD', price: 220 },
];

const FAN_OPTIONS: Option[] = [
  { id: '3fans', label: '3 FANS ARGB', price: 0 },
  { id: '6fans', label: '6 FANS ARGB', price: 60 },
  { id: '9fans', label: '9 FANS ARGB', price: 120 },
];

const COOLER_OPTIONS: Option[] = [
  { id: 'stock', label: 'AMD WRAITH STEALTH', price: 0 },
  { id: 'tower', label: 'DEEPCOOL AG400 ARGB TOWER COOLER', price: 90 },
  { id: 'aio240', label: 'DEEPCOOL LE520 240MM AIO LIQUID COOLING', price: 250 },
];

const WIFI_OPTIONS: Option[] = [
  { id: 'none', label: 'NONE', price: 0 },
  { id: 'wifi5', label: 'AC600 WIFI 5 USB ADAPTER', price: 30 },
  { id: 'wifi6', label: 'AX3000 WIFI 6 PCIE CARD + BLUETOOTH', price: 120 },
];

const OS_OPTIONS: Option[] = [
  { id: 'none', label: 'NONE', price: 0 },
  { id: 'win11_trial', label: 'WINDOWS 11 HOME (TRIAL / UNACTIVATED)', price: 40 },
  { id: 'win11_pro', label: 'WINDOWS 11 PRO (ACTIVATED)', price: 150 },
];

const PrebuiltProduct: React.FC = () => {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  
  const [selectedRam, setSelectedRam] = useState(RAM_OPTIONS[0]);
  const [selectedSsd, setSelectedSsd] = useState(SSD_OPTIONS[0]);
  const [selectedFan, setSelectedFan] = useState(FAN_OPTIONS[0]);
  const [selectedCooler, setSelectedCooler] = useState(COOLER_OPTIONS[0]);
  const [selectedWifi, setSelectedWifi] = useState(WIFI_OPTIONS[0]);
  const [selectedOs, setSelectedOs] = useState(OS_OPTIONS[0]);
  
  const [activeModal, setActiveModal] = useState<'RAM' | 'SSD' | 'FAN' | 'COOLER' | 'WIFI' | 'OS' | null>(null);

  const basePrice = 2299.00;
  const saved = 494.00;

  const totalPrice = useMemo(() => {
    return (basePrice + selectedRam.price + selectedSsd.price + selectedFan.price + selectedCooler.price + selectedWifi.price + selectedOs.price) * quantity;
  }, [selectedRam, selectedSsd, selectedFan, selectedCooler, selectedWifi, selectedOs, quantity]);

  const getAddonPrice = (type: string) => {
    if (type === 'RAM') return selectedRam.price;
    if (type === 'SSD') return selectedSsd.price;
    if (type === 'FAN') return selectedFan.price;
    if (type === 'COOLER') return selectedCooler.price;
    if (type === 'WIFI') return selectedWifi.price;
    if (type === 'OS') return selectedOs.price;
    return 0;
  };

  const specs = [
    { label: "CPU", value: "AMD RYZEN 5 5500", reselectable: false },
    { label: "CPU COOLER", value: selectedCooler.label, reselectable: true, type: 'COOLER' },
    { label: "MOTHERBOARD", value: "AMD A520M (MSI/GIGABYTE) (NON WIFI) ( 2x RAM SLOT | 1x NVME SLOT )", reselectable: false },
    { label: "RAM", value: selectedRam.label, reselectable: true, type: 'RAM' },
    { label: "SSD", value: selectedSsd.label, reselectable: true, type: 'SSD' },
    { label: "GPU", value: "NVIDIA GEFORCE RTX 3050 6GB (MSI)", reselectable: false },
    { label: "PSU", value: "THERMALTAKE 650W", reselectable: false },
    { label: "CASE", value: "TECWARE VXO M BLACK", reselectable: false },
    { label: "FAN", value: selectedFan.label, reselectable: true, type: 'FAN' },
    { label: "WIFI", value: selectedWifi.label, reselectable: true, type: 'WIFI' },
    { label: "OS", value: selectedOs.label, reselectable: true, type: 'OS' },
  ];

  const renderModal = () => {
    if (!activeModal) return null;

    let options: Option[] = [];
    let currentSelection: Option;
    let setSelection: (opt: Option) => void;

    if (activeModal === 'RAM') {
      options = RAM_OPTIONS;
      currentSelection = selectedRam;
      setSelection = setSelectedRam;
    } else if (activeModal === 'SSD') {
      options = SSD_OPTIONS;
      currentSelection = selectedSsd;
      setSelection = setSelectedSsd;
    } else if (activeModal === 'FAN') {
      options = FAN_OPTIONS;
      currentSelection = selectedFan;
      setSelection = setSelectedFan;
    } else if (activeModal === 'COOLER') {
      options = COOLER_OPTIONS;
      currentSelection = selectedCooler;
      setSelection = setSelectedCooler;
    } else if (activeModal === 'WIFI') {
      options = WIFI_OPTIONS;
      currentSelection = selectedWifi;
      setSelection = setSelectedWifi;
    } else {
      options = OS_OPTIONS;
      currentSelection = selectedOs;
      setSelection = setSelectedOs;
    }

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={() => setActiveModal(null)}
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-[#1a1a1a] w-full max-w-md rounded-3xl overflow-hidden border border-white/10"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h3 className="text-xl font-black uppercase tracking-tighter">Select {activeModal}</h3>
            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-4 space-y-2">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setSelection(opt);
                  setActiveModal(null);
                }}
                className={`w-full p-4 rounded-2xl flex justify-between items-center transition-all border ${
                  currentSelection.id === opt.id 
                    ? 'bg-rose-600/10 border-rose-600 text-white' 
                    : 'bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20'
                }`}
              >
                <div className="text-left">
                  <p className="font-bold text-sm">{opt.label}</p>
                  {opt.price > 0 && <p className="text-[10px] text-rose-500 font-black mt-1">+ RM {opt.price.toFixed(2)}</p>}
                  {opt.price === 0 && <p className="text-[10px] text-green-500 font-black mt-1">Included</p>}
                </div>
                {currentSelection.id === opt.id && <Check size={18} className="text-rose-600" />}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050607] text-white">
      <StudioNavbar />
      
      <AnimatePresence>
        {renderModal()}
      </AnimatePresence>

      <div className="pt-40 pb-32 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Image Gallery */}
          <div>
            <div className="aspect-square bg-[#1a1a1a] rounded-3xl mb-6 flex items-center justify-center overflow-hidden border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop" 
                alt="PC Build"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
                   <img 
                    src={`https://picsum.photos/seed/pc-${i}/200/200`} 
                    alt={`View ${i}`}
                    className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Configuration */}
          <div>
            <h1 className="text-3xl font-black mb-6 uppercase tracking-tighter leading-tight">
              {slug?.replace(/-/g, ' ').toUpperCase() || "STRIKER (AMD RYZEN 5 5500 | RTX3050)"}
            </h1>
            
            <div className="flex items-center gap-4 mb-8">
              <button className="p-3 bg-[#1a1a1a] rounded-full hover:bg-white/5 transition-colors">
                <Share2 size={20} className="text-slate-400" />
              </button>
              <div className="flex items-center gap-4 bg-[#1a1a1a] px-6 py-2 rounded-full border border-white/5">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center hover:text-rose-500 transition-colors font-bold"
                >-</button>
                <span className="font-black w-4 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center hover:text-rose-500 transition-colors font-bold"
                >+</button>
              </div>
              <button className="p-3 bg-[#1a1a1a] rounded-full hover:bg-white/5 transition-colors">
                <RefreshCw size={20} className="text-slate-400" />
              </button>
              <button className="p-3 bg-[#1a1a1a] rounded-full hover:bg-white/5 transition-colors">
                <Copy size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Configuration List */}
            <div className="space-y-3">
              {specs.map((spec, index) => (
                <div 
                  key={index} 
                  onClick={() => spec.reselectable && setActiveModal(spec.type as any)}
                  className={`p-4 rounded-2xl flex justify-between items-center border transition-all ${
                    spec.reselectable 
                      ? 'bg-[#1a1a1a] border-white/10 cursor-pointer hover:border-rose-600/50 hover:bg-white/[0.02]' 
                      : 'bg-black/20 border-white/5 opacity-80'
                  }`}
                >
                  <div className="flex-grow">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">{spec.label}</p>
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-bold ${spec.reselectable ? 'text-white' : 'text-slate-400'}`}>{spec.value}</p>
                      {spec.reselectable && getAddonPrice(spec.type!) > 0 && (
                        <span className="text-[10px] font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                          + RM {getAddonPrice(spec.type!).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  {spec.reselectable ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Reselect</span>
                      <ChevronRight size={16} className="text-rose-600" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-white/10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-32">
          <div className="text-center mb-10">
            <h2 className="text-sm font-black text-rose-500 uppercase tracking-[0.3em] mb-2">Support & Info</h2>
            <h3 className="text-3xl font-black uppercase tracking-tighter">Frequently Asked Questions</h3>
          </div>
          
          <div className="space-y-4">
            {[
              {
                question: "What is the warranty on this prebuilt system?",
                answer: "All our prebuilt systems come with a comprehensive 3-year warranty covering both parts and labor. We handle RMAs and repairs directly to ensure your system is running perfectly."
              },
              {
                question: "How long does assembly and shipping take?",
                answer: "Standard assembly and stress testing takes 3-5 business days. Once shipped, delivery within Peninsula Malaysia typically takes 1-3 business days, while East Malaysia may take up to 7 business days."
              },
              {
                question: "Are the components upgradable in the future?",
                answer: "Absolutely. Unlike some proprietary prebuilts, we use entirely standard, off-the-shelf ATX/mATX components. This means you can easily upgrade the GPU, RAM, storage, or any other part whenever you want."
              },
              {
                question: "Does it come with Windows pre-installed?",
                answer: "Yes, if you select a Windows OS option during configuration, we will install it along with all necessary motherboard, GPU, and chipset drivers so it is perfectly plug-and-play."
              }
            ].map((faq, index) => {
              const [isOpen, setIsOpen] = useState(false);
              return (
                <div key={index} className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
                  <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/[0.02]"
                  >
                    <span className="font-bold text-white/90">{faq.question}</span>
                    <ChevronDown size={20} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0d0e0f]/80 backdrop-blur-xl p-6 flex flex-col md:flex-row justify-between items-center border-t border-white/10 z-40">
        <div className="mb-4 md:mb-0">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-rose-500 tracking-tighter">RM {totalPrice.toFixed(2)}</p>
            <p className="text-sm text-slate-500 line-through">RM {(totalPrice + saved).toFixed(2)}</p>
          </div>
          <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">You save RM {saved.toFixed(2)}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"><Calculator size={16} /> Loan Calc.</button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"><MessageCircle size={16} /> Talk To Us</button>
          <button className="flex items-center gap-2 px-10 py-4 bg-rose-600 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-rose-700 transition-all shadow-[0_0_30px_rgba(225,29,72,0.3)]">Next <ArrowRight size={16} /></button>
        </div>
      </div>
    </div>
  );
};

export default PrebuiltProduct;
