
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Clock,
  MapPin
} from 'lucide-react';

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/White%20Full%20Logo.png";

const TrackOrder: React.FC = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [contact, setContact] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [orderFound, setOrderFound] = useState<boolean | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
      setOrderFound(invoiceNumber.length > 5); // Mock logic
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050607] text-slate-100 selection:bg-rose-600 selection:text-white overflow-x-hidden font-sans">
      
      {/* Editorial Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#050607]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#1a0a0a_0%,_#050607_80%)]"></div>
        <div className="absolute top-[10%] left-[-5%] w-[30%] h-[1px] bg-rose-600/20 blur-[2px] rotate-12"></div>
        <div className="absolute bottom-[30%] right-[-5%] w-[20%] h-[1px] bg-rose-600/10 blur-[3px] -rotate-6"></div>
      </div>

      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 h-24 px-8 md:px-16 flex items-center justify-between z-[100] bg-[#050607]/80 backdrop-blur-xl border-b border-white/5">
        <Link to="/customised" className="group flex items-center gap-4 text-white/60 hover:text-white transition-all">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Studio</span>
        </Link>
        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <img src={LOGO_URL} className="h-12 md:h-16 w-auto" alt="Meadow" />
        </Link>
        <div className="w-24"></div> {/* Spacer */}
      </nav>

      <main className="relative z-10 pt-48 pb-32 px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-rose-600/10 border border-rose-600/20 mb-8 animate-in fade-in slide-in-from-top duration-700">
              <Clock size={14} className="text-rose-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">Real-Time Logistics</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white leading-none mb-8">
              Track Your <br />
              <span className="text-white/40">Masterwork.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
              Enter your credentials below to initialize the tracking protocol for your bespoke computational hardware.
            </p>
          </div>

          {/* Tracking Form */}
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleTrack} className="space-y-6">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-600/20 to-white/5 rounded-2xl blur opacity-30 group-focus-within:opacity-100 transition duration-1000"></div>
                <div className="relative bg-[#0a0b0c] border border-white/10 rounded-2xl p-2 flex flex-col">
                  <label className="px-6 pt-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Invoice Number</label>
                  <input 
                    type="text" 
                    required
                    placeholder="INV-2024-XXXX"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value.toUpperCase())}
                    className="bg-transparent border-none focus:ring-0 text-xl font-bold text-white px-6 pb-4 placeholder:text-white/10"
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-600/20 to-white/5 rounded-2xl blur opacity-30 group-focus-within:opacity-100 transition duration-1000"></div>
                <div className="relative bg-[#0a0b0c] border border-white/10 rounded-2xl p-2 flex flex-col">
                  <label className="px-6 pt-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Phone or Email</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter associated contact"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-xl font-bold text-white px-6 pb-4 placeholder:text-white/10"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSearching}
                className="w-full h-20 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.5em] hover:bg-rose-600 hover:text-white transition-all duration-500 flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSearching ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    <span>Initializing Search...</span>
                  </div>
                ) : (
                  <>
                    Initialize Tracking
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Mock Results */}
            {orderFound !== null && !isSearching && (
              <div className="mt-12 animate-in fade-in slide-in-from-bottom duration-700">
                {orderFound ? (
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-10 space-y-10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-2">Order Status</p>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter">In Assembly</h3>
                      </div>
                      <div className="h-16 w-16 rounded-full bg-rose-600/20 flex items-center justify-center text-rose-500">
                        <Package size={32} />
                      </div>
                    </div>

                    <div className="space-y-8">
                      {[
                        { status: 'Order Received', date: 'Mar 10, 2024', done: true },
                        { status: 'Component Validation', date: 'Mar 11, 2024', done: true },
                        { status: 'Precision Assembly', date: 'In Progress', done: false, active: true },
                        { status: 'Stress Testing', date: 'Pending', done: false },
                        { status: 'Dispatch', date: 'Pending', done: false },
                      ].map((step, i) => (
                        <div key={i} className="flex items-start gap-6 relative">
                          {i !== 4 && (
                            <div className={`absolute left-3 top-8 w-px h-12 ${step.done ? 'bg-rose-600' : 'bg-white/10'}`}></div>
                          )}
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${step.done ? 'bg-rose-600 text-white' : step.active ? 'bg-rose-600/20 border border-rose-600 text-rose-500 animate-pulse' : 'bg-white/5 border border-white/10 text-white/20'}`}>
                            {step.done ? <CheckCircle2 size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-current"></div>}
                          </div>
                          <div>
                            <p className={`text-sm font-black uppercase tracking-widest ${step.done || step.active ? 'text-white' : 'text-white/20'}`}>{step.status}</p>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">{step.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-8 border-t border-white/10 grid grid-cols-2 gap-8">
                      <div className="flex items-center gap-4">
                        <MapPin size={20} className="text-rose-500" />
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Destination</p>
                          <p className="text-[11px] font-bold text-white uppercase tracking-widest">Johor Bahru, MY</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <ShieldCheck size={20} className="text-rose-500" />
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Protection</p>
                          <p className="text-[11px] font-bold text-white uppercase tracking-widest">Elite Insured</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-rose-600/10 border border-rose-600/20 rounded-3xl p-10 text-center">
                    <p className="text-rose-500 font-black text-xs uppercase tracking-[0.3em] mb-4">Protocol Error</p>
                    <p className="text-white text-lg font-light">No record found for the provided credentials. Please verify your invoice number and contact details.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className="mt-32 grid md:grid-cols-3 gap-8">
            {[
              { icon: <ShieldCheck />, title: "Secure Access", desc: "Encrypted tracking data" },
              { icon: <Truck />, title: "Global Fleet", desc: "Real-time GPS integration" },
              { icon: <MapPin />, title: "Local Pickup", desc: "Available at JB Branch" },
            ].map((item, i) => (
              <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                <div className="text-rose-500">{item.icon}</div>
                <h4 className="text-sm font-black uppercase tracking-widest text-white">{item.title}</h4>
                <p className="text-[11px] text-white/40 uppercase tracking-widest leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Minimal */}
      <footer className="py-20 border-t border-white/5 text-center relative z-10">
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">
          Meadow IT — Space Age Logistics Protocol MMXXIV
        </p>
      </footer>
    </div>
  );
};

export default TrackOrder;
