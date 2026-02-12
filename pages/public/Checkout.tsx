
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  CreditCard, 
  FileText, 
  Truck, 
  Store, 
  ChevronRight, 
  ShieldCheck, 
  Info,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
  Printer,
  Monitor,
  Cpu,
  Waves,
  Layers,
  Zap,
  Box,
  HardDrive,
  Gamepad2,
  Fan,
  Wifi,
  Disc,
  MousePointer2,
  TicketPercent
} from 'lucide-react';

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/White%20Full%20Logo.png";

const ICON_MAP: Record<string, any> = {
  promotion: <TicketPercent size={24} />,
  case: <Monitor size={24} />,
  cpu: <Cpu size={24} />,
  'cpu cooler': <Waves size={24} />,
  motherboard: <Layers size={24} />,
  psu: <Zap size={24} />,
  ram: <Box size={24} />,
  storage: <HardDrive size={24} />,
  gpu: <Gamepad2 size={24} />,
  fans: <Fan size={24} />,
  networking: <Wifi size={24} />,
  os: <Disc size={24} />,
  accessories: <MousePointer2 size={24} />
};

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState('MEADOW IT DISTRIBUTION (HQ)');
  const [deliveryMethod, setDeliveryMethod] = useState('Shipping');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  const [selections, setSelections] = useState<Record<string, any>>({});

  useEffect(() => {
    const saved = localStorage.getItem('meadow_pc_build');
    if (saved) {
      try {
        setSelections(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved build", e);
      }
    }
  }, []);

  const manifestItems = useMemo(() => {
    const items: Array<{ id: string, name: string, price: number, quantity: number, category: string }> = [];
    
    Object.keys(selections).forEach(catId => {
      const val = selections[catId];
      if (!val) return;

      if (Array.isArray(val)) {
        val.forEach((item, idx) => {
          items.push({
            id: `${catId}-${idx}`,
            name: item.name,
            price: item.price,
            quantity: 1,
            category: catId
          });
        });
      } else {
        items.push({
          id: catId,
          name: val.name,
          price: val.price,
          quantity: val.quantity || 1,
          category: catId
        });
      }
    });

    return items;
  }, [selections]);

  const subtotal = useMemo(() => {
    return manifestItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [manifestItems]);

  const deliveryFee = deliveryMethod === 'Shipping' ? 45 : 0;
  const grandTotal = subtotal + deliveryFee;

  const branches = [
    { id: 'hq', name: 'MEADOW IT DISTRIBUTION (HQ)', city: 'Johor Jaya' },
    { id: 'tu', name: 'MEADOW COMPUTER TAMAN U', city: 'Skudai' },
    { id: 'pp', name: 'MEADOW COMPUTER PLAZA PELANGI', city: 'Johor Bahru' },
    { id: 'as', name: 'ASUS CONCEPT STORE MEADOW', city: 'Johor Bahru' },
    { id: 'hp', name: 'HP WORLD MEADOW TOPPEN', city: 'Johor Bahru' },
    { id: 'hw', name: 'HUAWEI EXPERIENCE STORE', city: 'Johor Bahru' }
  ];

  const deliveryOptions = [
    { id: 'Shipping', label: 'Shipping By GDEX', sub: 'West Malaysia Coverage' },
    { id: 'Self-Pickup', label: 'Self-Pickup', sub: 'From Selected Branch' },
    { id: 'Onsite', label: 'Onsite Delivery', sub: 'Area Dependent' }
  ];

  const paymentOptions = [
    { id: 'Credit Card', label: 'Instant Settlement', sub: 'Card, FPX, E-Wallet' },
    { id: 'IPP', label: 'Instalment Plan', sub: 'IPP Settlement' },
    { id: 'Atome', label: 'Buy Now Pay Later', sub: 'Atome, Grab, SpayLater' }
  ];

  return (
    <div className="min-h-screen bg-[#050607] text-slate-100 selection:bg-rose-600 selection:text-white font-sans overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#1a0a0a_0%,_#050607_80%)]"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]"></div>
      </div>

      {/* Header */}
      <nav className="relative h-24 md:h-32 px-8 md:px-16 flex items-center justify-between z-10 border-b border-white/5 bg-[#050607]/80 backdrop-blur-xl">
        <div className="flex items-center gap-10">
          <Link to="/buildpc" className="group flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-rose-500 group-hover:border-rose-600 transition-all">
               <ArrowLeft size={18} />
            </div>
            <img src={LOGO_URL} className="h-10 md:h-14 w-auto opacity-80" alt="Meadow" />
          </Link>
          <div className="hidden lg:block w-px h-8 bg-white/10"></div>
          <p className="hidden lg:block text-[11px] font-black uppercase tracking-[0.4em] text-white/30">Protocol Execution: Phase_Final</p>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 text-rose-500">
              <Lock size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Secure Link</span>
           </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-[1600px] mx-auto px-8 md:px-16 py-12 md:py-20">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-8 space-y-24">
            
            {/* Client Registry */}
            <section className="space-y-10">
              <div className="flex items-center gap-6">
                 <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></div>
                 <h2 className="font-serif text-4xl md:text-5xl font-light text-white tracking-tight italic">Client Registry.</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 bg-white/[0.02] border border-white/5 p-10 rounded-[3rem]">
                <div className="space-y-8 md:col-span-2">
                   <div>
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 block">Customer Category</label>
                      <select className="w-full h-16 px-6 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-rose-600/50 font-bold transition-all text-white">
                         <option className="bg-[#050607]">Individual / Personal</option>
                         <option className="bg-[#050607]">Corporate / Enterprise</option>
                      </select>
                   </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] block">Full Name</label>
                   <input className="w-full h-16 px-6 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-rose-600/50 font-bold transition-all text-white placeholder:text-white/10" placeholder="LEGAL NAME" />
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] block">ID Number (For E-Invoice)</label>
                   <input className="w-full h-16 px-6 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-rose-600/50 font-bold transition-all text-white placeholder:text-white/10" placeholder="NRIC / PASSPORT" />
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] block">Communication Link (Mobile)</label>
                   <input className="w-full h-16 px-6 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-rose-600/50 font-bold transition-all text-white placeholder:text-white/10" placeholder="+60 000-0000" />
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] block">Registry Email</label>
                   <input className="w-full h-16 px-6 bg-white/[0.03] border border-white/10 rounded-2xl outline-none focus:border-rose-600/50 font-bold transition-all text-white placeholder:text-white/10" placeholder="EMAIL@DOMAIN.COM" />
                </div>

                <div className="md:col-span-2 space-y-4">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] block">Deployment Address</label>
                   <textarea rows={4} className="w-full p-6 bg-white/[0.03] border border-white/10 rounded-3xl outline-none focus:border-rose-600/50 font-bold transition-all text-white placeholder:text-white/10" placeholder="STREET, UNIT, POSTCODE, CITY" />
                </div>

                <div className="md:col-span-2 space-y-4">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] block">Operational Notes</label>
                   <textarea rows={2} className="w-full p-6 bg-white/[0.03] border border-white/10 rounded-3xl outline-none focus:border-rose-600/50 font-bold transition-all text-white placeholder:text-white/10" placeholder="LEAVE YOUR MESSAGE HERE..." />
                </div>
              </div>
            </section>

            {/* Logistics Deployment */}
            <section className="space-y-10">
              <div className="flex items-center gap-6">
                 <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></div>
                 <h2 className="font-serif text-4xl md:text-5xl font-light text-white tracking-tight italic">Logistics Deployment.</h2>
              </div>
              
              <div className="space-y-12">
                <div className="space-y-6">
                   <p className="text-[11px] font-black text-rose-500 uppercase tracking-[0.4em]">Select Operations Hub</p>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {branches.map((branch) => (
                        <button 
                          key={branch.id}
                          onClick={() => setSelectedBranch(branch.name)}
                          className={`p-8 rounded-[2.5rem] border text-left transition-all duration-500 relative overflow-hidden group min-h-[140px] flex flex-col justify-center ${
                            selectedBranch === branch.name 
                              ? 'bg-rose-600 border-rose-600 shadow-[0_0_40px_rgba(225,29,72,0.2)]' 
                              : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                          }`}
                        >
                           <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${selectedBranch === branch.name ? 'text-white/70' : 'text-white/30'}`}>{branch.city}</p>
                           <p className={`text-sm md:text-base font-black tracking-tight leading-tight ${selectedBranch === branch.name ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>{branch.name}</p>
                           {selectedBranch === branch.name && <div className="absolute top-4 right-4 text-white"><CheckCircle2 size={16} /></div>}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-6">
                   <p className="text-[11px] font-black text-rose-500 uppercase tracking-[0.4em]">Transmission Method</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {deliveryOptions.map((opt) => (
                        <button 
                          key={opt.id}
                          onClick={() => setDeliveryMethod(opt.id)}
                          className={`p-8 rounded-[2.5rem] border text-left transition-all duration-500 relative overflow-hidden group ${
                            deliveryMethod === opt.id 
                              ? 'bg-rose-600 border-rose-600 shadow-[0_0_40px_rgba(225,29,72,0.2)]' 
                              : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                          }`}
                        >
                           <p className={`text-lg font-black tracking-tight mb-2 ${deliveryMethod === opt.id ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>{opt.label}</p>
                           <p className={`text-[10px] font-black uppercase tracking-widest ${deliveryMethod === opt.id ? 'text-white/70' : 'text-white/30'}`}>{opt.sub}</p>
                           {deliveryMethod === opt.id && <div className="absolute top-4 right-4 text-white"><CheckCircle2 size={16} /></div>}
                        </button>
                      ))}
                   </div>
                </div>
              </div>
            </section>

            {/* Financial Resolution */}
            <section className="space-y-10">
              <div className="flex items-center gap-6">
                 <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></div>
                 <h2 className="font-serif text-4xl md:text-5xl font-light text-white tracking-tight italic">Financial Resolution.</h2>
              </div>
              
              <div className="space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {paymentOptions.map((opt) => (
                      <button 
                        key={opt.id}
                        onClick={() => setPaymentMethod(opt.id)}
                        className={`p-8 rounded-[2.5rem] border text-left transition-all duration-500 relative overflow-hidden group ${
                          paymentMethod === opt.id 
                            ? 'bg-rose-600 border-rose-600 shadow-[0_0_40px_rgba(225,29,72,0.2)]' 
                            : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                        }`}
                      >
                         <p className={`text-lg font-black tracking-tight mb-2 ${paymentMethod === opt.id ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>{opt.label}</p>
                         <p className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === opt.id ? 'text-white/70' : 'text-white/30'}`}>{opt.sub}</p>
                         {paymentMethod === opt.id && <div className="absolute top-4 right-4 text-white"><CheckCircle2 size={16} /></div>}
                      </button>
                    ))}
                 </div>

                 {/* Protocol Terms */}
                 <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 space-y-10">
                    <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                       <h3 className="text-xl font-bold uppercase tracking-widest text-white">Service Protocol & Conditions</h3>
                    </div>

                    <div className="space-y-8 max-h-[400px] overflow-y-auto pr-6 scrollbar-hide">
                       <div className="bg-rose-600/5 border border-rose-600/10 p-6 rounded-2xl flex items-start gap-5">
                          <Info className="text-rose-600 shrink-0 mt-1" size={20} />
                          <p className="text-sm font-bold text-rose-500 leading-relaxed uppercase tracking-wider">
                            Ensure active browser pop-ups are enabled for payment gateway redirection protocol.
                          </p>
                       </div>

                       <div className="space-y-6">
                          {[
                            { title: 'Instalment Handling', text: 'Administrative fees apply to all modular payment deployments.' },
                            { title: 'Overseas Resolution', text: 'Non-resident credit transactions incur a 3% handling protocol.' },
                            { title: 'Irreversible Selection', text: 'Once committed, the instalment period cannot be recalibrated.' },
                            { title: 'Cancellation Policy', text: 'Withdrawal of active orders incurs a 2% administrative decay fee.' },
                            { title: 'Refund Eligibility', text: 'All requests are subject to engineering review and approval cycles.' },
                            { title: 'Settlement Window', text: 'Transmission of funds may take 7-14 standard cycle days for full verification.' }
                          ].map((item, i) => (
                            <div key={i} className="flex gap-6 group">
                               <span className="text-rose-600 font-black text-xs mt-1 shrink-0">0{i+1}</span>
                               <div className="space-y-2">
                                  <h4 className="text-sm font-black text-white uppercase tracking-widest">{item.title}</h4>
                                  <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-300 transition-colors font-medium">{item.text}</p>
                               </div>
                            </div>
                          ))}
                       </div>

                       <div className="pt-8 border-t border-white/5">
                          <p className="text-[10px] font-bold text-rose-600/60 uppercase tracking-[0.2em] leading-loose italic">
                            * Completion of this terminal protocol confirms client acceptance of all liability and service terms stated above. Meadow reserves the right to terminate invalid deployments.
                          </p>
                       </div>
                    </div>
                 </div>
              </div>
            </section>
          </div>

          {/* Right Column: Order Manifest */}
          <div className="lg:col-span-4 sticky top-32">
             <div className="bg-[#0A0B0C] border border-white/5 rounded-[4rem] p-12 space-y-12 shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,_#200a0a_0%,_transparent_50%)]"></div>
                
                <div className="relative z-10">
                   <div className="flex items-center justify-between mb-10">
                      <div>
                        <h2 className="font-serif text-4xl font-light text-white italic">The Manifest.</h2>
                        <p className="text-[11px] font-black text-rose-600 uppercase tracking-[0.4em] mt-2">Active Buffer</p>
                      </div>
                      <FileText size={32} className="text-white/10" />
                   </div>

                   <div className="space-y-8 max-h-[450px] overflow-y-auto pr-4 scrollbar-hide">
                      {manifestItems.length === 0 ? (
                        <div className="py-12 text-center opacity-20">
                          <p className="text-[10px] font-black uppercase tracking-widest">No selections recorded.</p>
                        </div>
                      ) : (
                        manifestItems.map((item) => (
                          <div key={item.id} className="flex items-start gap-6 group/item">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover/item:border-rose-600 transition-colors">
                                <div className="text-white/20 group-hover/item:text-rose-500 transition-colors">
                                  {ICON_MAP[item.category] || <Box size={24} />}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[10px] font-black text-white uppercase tracking-tight leading-tight mb-2 truncate">{item.name}</h4>
                                <div className="flex items-center justify-between mt-4">
                                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
                                    RM {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                  </span>
                                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">x{item.quantity}</span>
                                </div>
                            </div>
                          </div>
                        ))
                      )}

                      {deliveryFee > 0 && (
                        <div className="flex items-start gap-6 group/item opacity-50">
                          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                              <Truck size={24} className="text-white/20" />
                          </div>
                          <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-black text-white uppercase tracking-tight leading-tight mb-1">Logistics Allocation</h4>
                              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">RM {deliveryFee.toLocaleString()}.00</p>
                          </div>
                        </div>
                      )}
                   </div>

                   <div className="mt-12 pt-10 border-t border-white/5 space-y-8">
                      <div className="space-y-3">
                         <div className="flex justify-between items-center text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                            <span>Asset Value</span>
                            <span>RM {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                            <span>Transmission Tax</span>
                            <span>RM 0.00</span>
                         </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                         <p className="text-[11px] font-black text-rose-600 uppercase tracking-[0.6em]">Aggregate Total</p>
                         <p className="text-6xl font-black tracking-tighter text-white">RM {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      </div>
                   </div>

                   <div className="mt-12 space-y-4">
                      <button className="w-full h-24 bg-white text-black rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.5em] hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-6 group shadow-3xl">
                         Authorize Checkout
                         <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                      </button>
                      <button className="w-full h-16 bg-white/5 border border-white/10 text-white/40 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-4">
                         <Printer size={18} />
                         Generate Quote PDF
                      </button>
                   </div>
                   
                   <div className="mt-12 flex items-center gap-6 px-6 py-4 bg-white/[0.03] rounded-2xl border border-white/5">
                      <ShieldCheck size={24} className="text-rose-600" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white">Meadow Shield</p>
                        <p className="text-[9px] text-white/40 font-medium leading-relaxed">Full technical insurance & validation included.</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </main>

      {/* Footer Minimal */}
      <footer className="relative z-10 px-8 md:px-16 py-20 border-t border-white/5 mt-20">
         <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
            <img src={LOGO_URL} className="h-8 opacity-20 grayscale" alt="Meadow" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
               © {new Date().getFullYear()} Meadow IT • Secure Transmission Node JB_4
            </p>
            <div className="flex items-center gap-8">
               {['Compliance', 'Data Security', 'Registry Terms'].map(item => (
                 <a key={item} href="#" className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-rose-500 transition-colors">{item}</a>
               ))}
            </div>
         </div>
      </footer>
    </div>
  );
};

export default Checkout;
