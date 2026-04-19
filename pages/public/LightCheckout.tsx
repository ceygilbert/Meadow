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
  Box,
  Facebook,
  Instagram,
  ShoppingCart
} from 'lucide-react';

import PublicNavbar from '../../components/PublicNavbar';
import { supabase } from '../../lib/supabase';

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/Red%20Full%20Logo.png";

const LightCheckout: React.FC = () => {
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState('MEADOW IT DISTRIBUTION (HQ)');
  const [deliveryMethod, setDeliveryMethod] = useState('Shipping');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [cartItems, setCartItems] = useState<any[]>([]);

  const filteredHubs = useMemo(() => {
    if (deliveryMethod === 'Shipping') {
      return [{ id: 'wm', name: 'WEST MALAYSIA', city: 'LOGISTICS', available: true }];
    }
    if (deliveryMethod === 'Self-Pickup') {
      return [
        { id: 'jj', name: 'JOHOR JAYA BRANCH', city: 'HQ', available: true },
        { id: 'pp', name: 'PLAZA PELANGI', city: 'JB', available: true },
        { id: 'lk', name: 'LARKIN (COMING SOON)', city: 'JB', available: false },
        { id: 'tu', name: 'TAMAN UNIVERSITI (COMING SOON)', city: 'SKUDAI', available: false }
      ];
    }
    if (deliveryMethod === 'Onsite') {
      return [{ id: 'jb', name: 'JB AREA', city: 'LOCAL', available: true }];
    }
    return [];
  }, [deliveryMethod]);

  useEffect(() => {
    // Reset selected branch if it's not in the filtered list
    if (filteredHubs.length > 0 && !filteredHubs.find(h => h.name === selectedBranch)) {
      setSelectedBranch(filteredHubs[0].name);
    }
  }, [filteredHubs]);

  useEffect(() => {
    const saved = localStorage.getItem('meadow_cart');
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved cart", e);
      }
    }
  }, []);

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cartItems]);

  const deliveryFee = deliveryMethod === 'Shipping' ? 45 : 0;
  const grandTotal = subtotal + deliveryFee;

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
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 selection:bg-rose-600 selection:text-white font-sans overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-[0]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#ffffff_0%,_#F9FAFB_80%)]"></div>
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]"></div>
      </div>

      <PublicNavbar />

      <main className="relative z-10 max-w-[1600px] mx-auto px-8 md:px-16 pt-32 md:pt-40 pb-12 md:pb-20">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-8 space-y-24">
            
            {/* Client Registry */}
            <section className="space-y-10">
              <div className="flex items-center gap-6">
                 <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse shadow-[0_0_10px_rgba(225,29,72,0.5)]"></div>
                 <h2 className="font-black text-4xl md:text-5xl text-slate-900 tracking-tighter uppercase">Client Registry.</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 bg-white border border-slate-200 p-10 rounded-[3rem] shadow-xl shadow-slate-200/40">
                <div className="space-y-8 md:col-span-2">
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 block">Customer Category</label>
                      <select className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-rose-600/50 font-bold transition-all text-slate-900 shadow-inner">
                         <option value="Personal">Individual / Personal</option>
                         <option value="Corporate">Corporate / Enterprise</option>
                      </select>
                   </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block">Full Name</label>
                   <input className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-rose-600/50 font-bold transition-all text-slate-900 placeholder:text-slate-300 shadow-inner" placeholder="LEGAL NAME" />
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block">ID Number (For E-Invoice)</label>
                   <input className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-rose-600/50 font-bold transition-all text-slate-900 placeholder:text-slate-300 shadow-inner" placeholder="NRIC / PASSPORT" />
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block">Communication Link (Mobile)</label>
                   <input className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-rose-600/50 font-bold transition-all text-slate-900 placeholder:text-slate-300 shadow-inner" placeholder="+60 000-0000" />
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block">Registry Email</label>
                   <input className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-rose-600/50 font-bold transition-all text-slate-900 placeholder:text-slate-300 shadow-inner" placeholder="EMAIL@DOMAIN.COM" />
                </div>

                <div className="md:col-span-2 space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block">Deployment Address</label>
                   <textarea rows={4} className="w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:border-rose-600/50 font-bold transition-all text-slate-900 placeholder:text-slate-300 shadow-inner" placeholder="STREET, UNIT, POSTCODE, CITY" />
                </div>

                <div className="md:col-span-2 space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block">Operational Notes</label>
                   <textarea rows={2} className="w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:border-rose-600/50 font-bold transition-all text-slate-900 placeholder:text-slate-300 shadow-inner" placeholder="LEAVE YOUR MESSAGE HERE..." />
                </div>
              </div>
            </section>

            {/* Shipping Method & Logistics Deployment */}
            <section className="space-y-10">
              <div className="flex items-center gap-6">
                 <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse shadow-[0_0_10px_rgba(225,29,72,0.5)]"></div>
                 <h2 className="font-black text-4xl md:text-5xl text-slate-900 tracking-tighter uppercase">Logistics.</h2>
              </div>
              
              <div className="space-y-12">
                <div className="space-y-6">
                   <p className="text-[11px] font-black text-rose-500 uppercase tracking-[0.4em]">Shipping Method</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {deliveryOptions.map((opt) => (
                        <button 
                          key={opt.id}
                          onClick={() => setDeliveryMethod(opt.id)}
                          className={`p-8 rounded-[2.5rem] border text-left transition-all duration-500 relative overflow-hidden group shadow-sm ${
                            deliveryMethod === opt.id 
                              ? 'bg-rose-600 border-rose-600 shadow-[0_0_40px_rgba(225,29,72,0.3)]' 
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                          }`}
                        >
                           <p className={`text-lg font-black tracking-tight mb-2 ${deliveryMethod === opt.id ? 'text-white' : 'text-slate-900 group-hover:text-black'}`}>{opt.label}</p>
                           <p className={`text-[10px] font-black uppercase tracking-widest ${deliveryMethod === opt.id ? 'text-white/80' : 'text-slate-400'}`}>{opt.sub}</p>
                           {deliveryMethod === opt.id && <div className="absolute top-4 right-4 text-white"><CheckCircle2 size={16} /></div>}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-6">
                   <p className="text-[11px] font-black text-rose-500 uppercase tracking-[0.4em]">Select Operations Hub</p>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredHubs.map((branch) => (
                        <button 
                          key={branch.id}
                          onClick={() => branch.available && setSelectedBranch(branch.name)}
                          disabled={!branch.available}
                          className={`p-8 rounded-[2.5rem] border text-left transition-all duration-500 relative overflow-hidden group min-h-[140px] flex flex-col justify-center shadow-sm ${
                            selectedBranch === branch.name 
                              ? 'bg-rose-600 border-rose-600 shadow-[0_0_40px_rgba(225,29,72,0.3)]' 
                              : branch.available 
                                ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                                : 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed text-slate-400'
                          }`}
                        >
                           <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${selectedBranch === branch.name ? 'text-white/80' : branch.available ? 'text-slate-400' : 'text-slate-300'}`}>{branch.city}</p>
                           <p className={`text-sm md:text-base font-black tracking-tight leading-tight ${selectedBranch === branch.name ? 'text-white' : branch.available ? 'text-slate-900 group-hover:text-black' : 'text-slate-500'}`}>{branch.name}</p>
                           {selectedBranch === branch.name && <div className="absolute top-4 right-4 text-white"><CheckCircle2 size={16} /></div>}
                        </button>
                      ))}
                   </div>
                </div>
              </div>
            </section>

            {/* Financial Resolution */}
            <section className="space-y-10">
              <div className="flex items-center gap-6">
                 <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse shadow-[0_0_10px_rgba(225,29,72,0.5)]"></div>
                 <h2 className="font-black text-4xl md:text-5xl text-slate-900 tracking-tighter uppercase">Payment Options.</h2>
              </div>
              
              <div className="space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {paymentOptions.map((opt) => (
                      <button 
                        key={opt.id}
                        onClick={() => setPaymentMethod(opt.id)}
                        className={`p-8 rounded-[2.5rem] border text-left transition-all duration-500 relative overflow-hidden group shadow-sm ${
                          paymentMethod === opt.id 
                            ? 'bg-rose-600 border-rose-600 shadow-[0_0_40px_rgba(225,29,72,0.3)]' 
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                        }`}
                      >
                         <p className={`text-lg font-black tracking-tight mb-2 ${paymentMethod === opt.id ? 'text-white' : 'text-slate-900 group-hover:text-black'}`}>{opt.label}</p>
                         <p className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === opt.id ? 'text-white/80' : 'text-slate-400'}`}>{opt.sub}</p>
                         {paymentMethod === opt.id && <div className="absolute top-4 right-4 text-white"><CheckCircle2 size={16} /></div>}
                      </button>
                    ))}
                 </div>

                 {/* Protocol Terms */}
                 <div className="bg-white border border-slate-200 rounded-[3rem] p-10 space-y-10 shadow-xl shadow-slate-200/40">
                    <div className="flex items-center gap-6 border-b border-slate-100 pb-8">
                       <h3 className="text-xl font-bold uppercase tracking-widest text-slate-900">Service Protocol & Conditions</h3>
                    </div>

                    <div className="space-y-8 max-h-[400px] overflow-y-auto pr-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                       <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl flex items-start gap-5 shadow-sm">
                          <Info className="text-rose-600 shrink-0 mt-1" size={20} />
                          <p className="text-sm font-bold text-rose-600 leading-relaxed uppercase tracking-wider">
                            Ensure active browser pop-ups are enabled for payment gateway redirection protocol.
                          </p>
                       </div>

                       <div className="space-y-8">
                          {[
                            { title: 'Instalment Handling', text: 'Administrative fees apply to all modular payment deployments.' },
                            { title: 'Overseas Resolution', text: 'Non-resident credit transactions incur a 3% handling protocol.' },
                            { title: 'Irreversible Selection', text: 'Once committed, the instalment period cannot be recalibrated.' },
                            { title: 'Cancellation Policy', text: 'Withdrawal of active orders incurs a 2% administrative decay fee.' },
                            { title: 'Refund Eligibility', text: 'All requests are subject to engineering review and approval cycles.' },
                            { title: 'Settlement Window', text: 'Transmission of funds may take 7-14 standard cycle days for full verification.' }
                          ].map((item, i) => (
                            <div key={i} className="flex gap-6 group bg-slate-50 p-6 rounded-2xl border border-slate-100">
                               <span className="text-rose-600 font-black text-sm mt-0.5 shrink-0">0{i+1}</span>
                               <div className="space-y-2">
                                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">{item.title}</h4>
                                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.text}</p>
                               </div>
                            </div>
                          ))}
                       </div>

                       <div className="pt-8 border-t border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-loose italic">
                            * Completion of checkout confirms client acceptance of all liability and service terms stated above. Meadow reserves the right to terminate invalid deployments.
                          </p>
                       </div>
                    </div>
                 </div>
              </div>
            </section>
          </div>

          {/* Right Column: Order Manifest */}
          <div className="lg:col-span-4 sticky top-32">
             <div className="bg-white border border-slate-200 rounded-[4rem] p-12 space-y-12 shadow-2xl shadow-slate-200/50 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,_#f1f5f9_0%,_transparent_50%)] pointer-events-none"></div>
                
                <div className="relative z-10">
                   <div className="flex items-center justify-between mb-10">
                      <div>
                        <h2 className="font-black text-4xl text-slate-900 tracking-tighter uppercase min-w-max">Your Order.</h2>
                        <p className="text-[11px] font-black text-rose-600 uppercase tracking-[0.4em] mt-2">Shopping Cart</p>
                      </div>
                      <ShoppingCart size={32} className="text-slate-200 shrink-0" />
                   </div>

                   <div className="space-y-8 max-h-[450px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                      {cartItems.length === 0 ? (
                        <div className="py-12 text-center opacity-40">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">No items recorded.</p>
                        </div>
                      ) : (
                        cartItems.map((item, idx) => (
                          <div key={`${item.id}-${idx}`} className="flex items-start gap-6 group/item">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 p-2 overflow-hidden">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
                                ) : (
                                    <Box size={24} className="text-slate-300" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-tight leading-snug mb-2 line-clamp-2">{item.name}</h4>
                                <div className="flex items-center justify-between mt-4">
                                  <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">
                                    RM {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                  </span>
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">Qty: {item.quantity}</span>
                                </div>
                            </div>
                          </div>
                        ))
                      )}

                      {deliveryFee > 0 && (
                        <div className="flex items-start gap-6 group/item pt-6 border-t border-slate-100">
                          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                              <Truck size={24} className="text-slate-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-tight mb-2">Logistics / Delivery</h4>
                              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">RM {deliveryFee.toLocaleString()}.00</p>
                          </div>
                        </div>
                      )}
                   </div>

                   <div className="mt-12 pt-10 border-t border-slate-200 space-y-8 bg-slate-50 -mx-12 -mb-12 p-12">
                      <div className="space-y-4">
                         <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                            <span>Subtotal</span>
                            <span className="text-slate-900">RM {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                            <span>Shipping</span>
                            <span className="text-slate-900">RM {deliveryFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                            <span>Tax</span>
                            <span className="text-slate-900">RM 0.00</span>
                         </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 pt-6 border-t border-slate-200">
                         <p className="text-[11px] font-black text-rose-600 uppercase tracking-[0.6em]">Total</p>
                         <p className="text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 truncate">RM {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      </div>

                      <div className="mt-12 space-y-4">
                         <button className="w-full h-16 bg-slate-900 text-white rounded-[2rem] font-black text-[13px] uppercase tracking-[0.5em] hover:bg-rose-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-6 group shadow-xl shadow-slate-900/20 active:scale-95">
                            Pay Now
                         </button>
                         <button className="w-full h-16 bg-white border border-slate-200 text-slate-500 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center justify-center gap-4">
                            <FileText size={18} />
                            Generate Quote
                         </button>
                      </div>
                   </div>

                </div>
             </div>
          </div>

        </div>
      </main>

      {/* Footer Minimal */}
      <footer className="relative z-10 px-8 md:px-16 py-20 border-t border-slate-200 mt-20 bg-white">
         <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
            <img src={LOGO_URL} className="h-8 opacity-40 grayscale" alt="Meadow" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 text-center">
               © {new Date().getFullYear()} Meadow IT • Secure Transmission Node JB_4
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47V18.77a6.738 6.738 0 0 1-6.76 6.76 6.738 6.738 0 0 1-6.76-6.76 6.738 6.738 0 0 1 6.76-6.76c.42-.02.84.03 1.25.12v4.03a2.71 2.71 0 0 0-1.25-.12 2.728 2.728 0 0 0-2.72 2.73 2.728 2.728 0 0 0 2.72 2.73 2.728 2.728 0 0 0 2.73-2.73V.02z"/>
                </svg>
              </a>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default LightCheckout;
