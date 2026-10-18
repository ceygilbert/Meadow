
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
  TicketPercent,
  Facebook,
  Instagram,
  Loader2,
  Settings
} from 'lucide-react';
import { getStripeClient, DEFAULT_STRIPE_PUBLISHABLE_KEY, DEFAULT_STRIPE_CHECKOUT_URL, redirectToStripeCheckout } from '../../lib/stripe';
import { useAuth } from '../../lib/AuthContext';

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
  const { user, profile } = useAuth();

  const selectedBranch = 'West Malaysia GDEX Logistics';
  const deliveryMethod = 'Shipping By GDEX';
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [selections, setSelections] = useState<Record<string, any>>({});

  // Form states
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [nric, setNric] = useState('');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [customerCategory, setCustomerCategory] = useState('Personal');

  // Stripe Config & State
  const [showStripeConfig, setShowStripeConfig] = useState(false);
  const [stripePublishableKey, setStripePublishableKey] = useState(DEFAULT_STRIPE_PUBLISHABLE_KEY);
  const [stripeCheckoutUrl, setStripeCheckoutUrl] = useState(DEFAULT_STRIPE_CHECKOUT_URL);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Stripe Card Simulation
  const [stripeCardNumber, setStripeCardNumber] = useState('4242 •••• •••• 4242');
  const [stripeExpiry, setStripeExpiry] = useState('12 / 28');
  const [stripeCvc, setStripeCvc] = useState('•••');
  const [currentOrderId, setCurrentOrderId] = useState('');

  useEffect(() => {
    if (profile?.full_name && !fullName) setFullName(profile.full_name);
    if (user?.email && !email) setEmail(user.email);
    if (profile?.phone && !phone) setPhone(profile.phone);
  }, [profile, user]);

  useEffect(() => {
    let hasBuild = false;
    const saved = localStorage.getItem('meadow_pc_build');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Object.keys(parsed).length > 0) {
          hasBuild = true;
          setSelections(parsed);
        }
      } catch (e) {
        console.error("Failed to parse saved build", e);
      }
    }

    // If no active custom PC build, check if user has normal cart items
    if (!hasBuild) {
      const savedCart = localStorage.getItem('meadow_cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart) && parsedCart.length > 0) {
            navigate('/checkout-light', { replace: true });
          }
        } catch (e) {}
      }
    }
  }, [navigate]);

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

  const deliveryFee = 45;
  const grandTotal = subtotal + deliveryFee;


  const handlePaymentSubmit = () => {
    setFormError(null);
    if (!fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setFormError('Please enter your registry email.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Please enter your mobile phone number.');
      return;
    }

    setIsProcessing(true);

    const orderId = `ORD-${Date.now()}`;
    setCurrentOrderId(orderId);

    const orderData = {
      order_id: orderId,
      customer_name: fullName,
      email: email,
      phone: phone,
      nric: nric,
      address: address,
      notes: notes,
      delivery_method: deliveryMethod,
      branch: selectedBranch,
      amount: grandTotal,
      payment_method: paymentMethod === 'Credit Card' ? 'Stripe Checkout' : paymentMethod,
      items: manifestItems,
      created_at: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('meadow_orders') || '[]');
      localStorage.setItem('meadow_orders', JSON.stringify([orderData, ...existing]));
    } catch (e) {
      console.error("Failed to save order", e);
    }

    if (paymentMethod === 'Credit Card') {
      const redirected = redirectToStripeCheckout({
        orderId,
        amount: grandTotal,
        detail: `Meadow PC Build Order ${orderId}`,
        name: fullName,
        email: email,
        phone: phone,
        checkoutUrl: stripeCheckoutUrl
      });

      setIsProcessing(false);
      if (!redirected) {
        setShowStripeModal(true);
      } else {
        localStorage.removeItem('meadow_pc_build');
        navigate(`/order-success?orderId=${orderId}`);
      }
    } else {
      setTimeout(() => {
        setIsProcessing(false);
        localStorage.removeItem('meadow_pc_build');
        navigate(`/order-success?orderId=${orderId}`);
      }, 1000);
    }
  };

  const handleCompleteStripePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowStripeModal(false);
      localStorage.removeItem('meadow_pc_build');
      navigate(`/order-success?orderId=${currentOrderId || 'ORD-COMPLETE'}`);
    }, 1200);
  };

  const deliveryOptions = [
    { id: 'Shipping', label: 'Shipping By GDEX', sub: 'West Malaysia Doorstep Delivery (1-3 Days)' }
  ];

  const paymentOptions = [
    { id: 'Credit Card', label: 'Instant Card / FPX', sub: 'Stripe Gateway' },
    { id: 'IPP', label: 'Instalment Plan', sub: 'EPP Participating Banks' },
    { id: 'Atome', label: 'Buy Now Pay Later', sub: 'Atome 3x Split' }
  ];

  return (
    <div className="min-h-screen bg-[#050607] text-slate-100 selection:bg-rose-600 selection:text-white font-sans overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#1a0a0a_0%,_#050607_80%)]"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]"></div>
      </div>

      {/* Header */}
      <nav className="relative h-16 sm:h-20 px-4 sm:px-8 flex items-center justify-between z-10 border-b border-white/10 bg-[#050607]/80 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <Link to="/buildpc" className="group flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover:text-rose-500 group-hover:border-rose-600 transition-all">
               <ArrowLeft size={15} />
            </div>
            <img src={LOGO_URL} className="h-8 sm:h-10 w-auto opacity-90" alt="Meadow" />
          </Link>
          <div className="hidden sm:block w-px h-6 bg-white/10"></div>
          <p className="hidden sm:block text-[11px] font-bold uppercase tracking-wider text-white/40">PC Builder Checkout</p>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb & Title */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs text-white/40 mb-1">
              <Link to="/buildpc" className="hover:text-white transition-colors">PC Builder</Link>
              <span>/</span>
              <span className="text-white font-medium">Checkout</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Checkout</span>
            </h1>
          </div>

          <Link
            to="/buildpc"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-rose-400 transition-colors self-start sm:self-auto"
          >
            <ArrowLeft size={13} />
            <span>Modify Build</span>
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            
            {/* 1. Customer Details */}
            <section className="bg-[#0B0C0E] border border-white/10 rounded-xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between pb-2.5 mb-3.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center">1</span>
                  <h2 className="text-xs sm:text-sm font-bold text-white">Customer Details</h2>
                </div>
                <span className="text-[10px] text-white/40 font-medium">* Required fields</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs sm:text-sm font-semibold text-slate-300 block mb-1.5">Customer</label>
                  <select 
                    value={customerCategory}
                    onChange={(e) => setCustomerCategory(e.target.value)}
                    className="w-full h-14 px-4 bg-white/[0.04] border border-white/10 rounded-lg text-sm sm:text-base font-medium text-white focus:bg-white/[0.08] focus:border-rose-500 outline-none transition-all cursor-pointer shadow-2xs"
                  >
                    <option value="Personal" className="bg-[#0B0C0E] text-white">Individual / Personal</option>
                    <option value="Corporate" className="bg-[#0B0C0E] text-white">Corporate / Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-300 block mb-1.5">Full Name *</label>
                  <input 
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Tan Wei Ming"
                    className="w-full h-14 px-4 bg-white/[0.04] border border-white/10 rounded-lg text-sm sm:text-base font-medium text-white placeholder:text-white/30 focus:bg-white/[0.08] focus:border-rose-500 outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-300 block mb-1.5">ID Number (NRIC / Passport)</label>
                  <input 
                    type="text"
                    value={nric}
                    onChange={(e) => setNric(e.target.value)}
                    placeholder="For E-Invoice"
                    className="w-full h-14 px-4 bg-white/[0.04] border border-white/10 rounded-lg text-sm sm:text-base font-medium text-white placeholder:text-white/30 focus:bg-white/[0.08] focus:border-rose-500 outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-300 block mb-1.5">Mobile Phone *</label>
                  <input 
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+60 12-345 6789"
                    className="w-full h-14 px-4 bg-white/[0.04] border border-white/10 rounded-lg text-sm sm:text-base font-medium text-white placeholder:text-white/30 focus:bg-white/[0.08] focus:border-rose-500 outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-300 block mb-1.5">Registry Email *</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-14 px-4 bg-white/[0.04] border border-white/10 rounded-lg text-sm sm:text-base font-medium text-white placeholder:text-white/30 focus:bg-white/[0.08] focus:border-rose-500 outline-none transition-all shadow-2xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs sm:text-sm font-semibold text-slate-300 block mb-1.5">Delivery Address *</label>
                  <textarea 
                    rows={6} 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, building, unit number, city, and state"
                    className="w-full p-4 bg-white/[0.04] border border-white/10 rounded-lg text-sm sm:text-base font-medium text-white placeholder:text-white/30 focus:bg-white/[0.08] focus:border-rose-500 outline-none transition-all resize-y min-h-[160px] shadow-2xs leading-relaxed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs sm:text-sm font-semibold text-slate-300 block mb-1.5">Operational Notes (Optional)</label>
                  <input 
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Special instructions or cabling requests"
                    className="w-full h-14 px-4 bg-white/[0.04] border border-white/10 rounded-lg text-sm sm:text-base font-medium text-white placeholder:text-white/30 focus:bg-white/[0.08] focus:border-rose-500 outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>
            </section>

            {/* 2. Logistics & Delivery (Shipping By GDEX only, compact box & small text) */}
            <section className="bg-[#0B0C0E] border border-white/10 rounded-xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center">2</span>
                  <h2 className="text-xs sm:text-sm font-bold text-white">Delivery Method</h2>
                </div>
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wide">GDEX Courier</span>
              </div>

              {/* Single Compact GDEX Shipping Card */}
              <div className="border border-rose-500/30 bg-rose-950/20 rounded-lg p-2.5 sm:p-3 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <Truck size={14} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs font-bold text-white">Shipping By GDEX</p>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300">Doorstep Delivery</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">West Malaysia coverage • 1 - 3 working days with live parcel tracking</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 shrink-0">
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-extrabold text-white block">RM 45.00</span>
                    <span className="text-[9px] text-slate-400">Standard Rate</span>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 size={11} />
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Payment Option */}
            <section className="bg-[#0B0C0E] border border-white/10 rounded-xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center">3</span>
                  <h2 className="text-xs sm:text-sm font-bold text-white">Payment Option</h2>
                </div>
                <span className="text-[10px] text-white/40 font-medium">Encrypted Checkout</span>
              </div>

              {/* Payment Options Grid - Compact */}
              <div className="grid sm:grid-cols-3 gap-2.5">
                {paymentOptions.map((opt) => (
                  <button 
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all duration-200 relative flex flex-col justify-between cursor-pointer ${
                      paymentMethod === opt.id 
                        ? 'bg-rose-950/30 border-rose-600 shadow-2xs' 
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center shrink-0 text-rose-400">
                          {opt.id === 'Credit Card' ? <Zap size={13} /> : <CreditCard size={13} />}
                        </div>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          paymentMethod === opt.id ? 'border-rose-600 bg-rose-600 text-white' : 'border-white/20'
                        }`}>
                          {paymentMethod === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <p className={`text-xs font-bold ${paymentMethod === opt.id ? 'text-white' : 'text-slate-200'}`}>{opt.label}</p>
                      <p className="text-[9.5px] text-slate-400 mt-0.5 leading-snug line-clamp-1">{opt.sub}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Stripe Gateway Notice */}
              {paymentMethod === 'Credit Card' && (
                <div className="mt-2.5 bg-indigo-950/40 border border-indigo-500/20 rounded-lg p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <CreditCard size={13} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Stripe Checkout Integrated</p>
                      <p className="text-[10px] text-slate-400">Encrypted instant credit card & mobile wallet processing</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowStripeConfig(!showStripeConfig)}
                    className="flex items-center gap-1.5 text-[10px] font-semibold text-indigo-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md hover:bg-white/10 transition-all self-start sm:self-auto cursor-pointer"
                  >
                    <Settings size={12} />
                    <span>{showStripeConfig ? 'Hide Config' : 'Publishable Key'}</span>
                  </button>
                </div>
              )}

              {showStripeConfig && paymentMethod === 'Credit Card' && (
                <div className="mt-2.5 p-2.5 bg-black/40 border border-white/10 rounded-lg space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Stripe Publishable Key</label>
                  <input 
                    type="text" 
                    value={stripePublishableKey} 
                    onChange={(e) => setStripePublishableKey(e.target.value)}
                    placeholder="pk_test_..." 
                    className="w-full h-8 px-2.5 bg-white/5 border border-white/10 rounded-md text-xs font-mono text-white outline-none" 
                  />
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Order Manifest */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24 space-y-3">
             <div className="bg-[#0B0C0E] border border-white/10 rounded-xl p-4 sm:p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                   <div>
                     <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">The Manifest</h3>
                     <p className="text-[10px] text-slate-400">Custom PC build components</p>
                   </div>
                   <FileText size={16} className="text-white/30" />
                </div>

                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                   {manifestItems.length === 0 ? (
                     <div className="py-6 text-center text-xs text-slate-400">
                       <p>No selections recorded.</p>
                       <Link to="/buildpc" className="text-rose-400 font-semibold hover:underline mt-1 inline-block">Return to PC Builder</Link>
                     </div>
                   ) : (
                     manifestItems.map((item) => (
                       <div key={item.id} className="flex items-start gap-2.5 pb-2 border-b border-white/5 last:border-b-0">
                         <div className="w-8 h-8 bg-white/5 rounded-md flex items-center justify-center shrink-0 border border-white/10 text-white/50">
                           {ICON_MAP[item.category] || <Box size={14} />}
                         </div>
                         <div className="flex-1 min-w-0">
                           <h4 className="text-xs font-semibold text-white line-clamp-1 leading-tight">{item.name}</h4>
                           <div className="flex items-center justify-between mt-1">
                             <span className="text-xs font-bold text-rose-400">
                               RM {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                             </span>
                             <span className="text-[10px] text-slate-400">x{item.quantity}</span>
                           </div>
                         </div>
                       </div>
                     ))
                   )}

                   {deliveryFee > 0 && (
                     <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
                       <span className="flex items-center gap-1.5">
                         <Truck size={12} className="text-slate-400" />
                         <span>Shipping (GDEX)</span>
                       </span>
                       <span className="font-semibold text-white">RM {deliveryFee.toFixed(2)}</span>
                     </div>
                   )}
                </div>

                <div className="pt-2.5 border-t border-white/10 space-y-1.5 text-xs">
                   <div className="flex justify-between text-slate-400">
                      <span>Subtotal</span>
                      <span className="font-semibold text-white">RM {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                   </div>
                   <div className="flex justify-between text-slate-400">
                      <span>Delivery Fee (GDEX)</span>
                      <span className="font-semibold text-white">RM {deliveryFee.toFixed(2)}</span>
                   </div>
                   
                   <div className="pt-2 border-t border-white/10 flex items-baseline justify-between">
                      <div>
                        <span className="text-xs font-bold text-white block">Grand Total</span>
                        <span className="text-[9.5px] text-slate-400">MYR (Ringgit Malaysia)</span>
                      </div>
                      <span className="text-lg sm:text-xl font-black text-white tracking-tight">
                        RM {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                   </div>
                </div>

                {formError && (
                  <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-500/40 text-xs font-semibold text-rose-300 flex items-center gap-2">
                    <Info size={13} className="shrink-0 text-rose-400" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="pt-1 space-y-2">
                  <button 
                    type="button"
                    onClick={handlePaymentSubmit}
                    disabled={isProcessing || manifestItems.length === 0}
                    className="w-full h-9 sm:h-10 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white rounded-lg font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {isProcessing ? (
                       <>
                         <Loader2 size={14} className="animate-spin" />
                         <span>Processing Order...</span>
                       </>
                     ) : paymentMethod === 'Credit Card' ? (
                       <>
                         <CreditCard size={14} />
                         <span>Pay via Stripe</span>
                       </>
                     ) : (
                       <span>Confirm & Place Order</span>
                     )}
                  </button>
                  <button 
                    type="button"
                    onClick={() => window.print()}
                    className="w-full h-8 bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 rounded-lg font-semibold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                     <Printer size={13} />
                     <span>Print Build Quote</span>
                  </button>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Stripe Payment Modal (Dark Theme) */}
      {showStripeModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-[#0C0E12] rounded-[2.5rem] border border-white/10 p-8 md:p-10 max-w-lg w-full shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200 text-white my-auto">
            <button 
              onClick={() => setShowStripeModal(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white font-bold transition-all"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-600/30">
                <CreditCard size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider text-white">Stripe Payment Gateway</h3>
                <p className="text-xs font-bold text-white/40">Order: {currentOrderId || 'ORD-MEADOW-PC'}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-white/50">
                <span>Customer</span>
                <span className="text-white">{fullName}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-white/50">
                <span>Email</span>
                <span className="text-white">{email}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-black text-white pt-2 border-t border-white/10">
                <span>Total Amount</span>
                <span className="text-indigo-400 text-base">RM {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Card Inputs */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-white/70 block mb-1">Card Number (Stripe Test Card)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={stripeCardNumber} 
                    onChange={(e) => setStripeCardNumber(e.target.value)}
                    className="w-full h-10.5 px-3 pl-10 bg-white/5 border border-white/10 rounded-lg text-sm font-mono font-medium text-white focus:border-indigo-500 outline-none" 
                  />
                  <CreditCard className="absolute left-3 top-3 text-indigo-400" size={16} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">Expires</label>
                  <input 
                    type="text" 
                    value={stripeExpiry} 
                    onChange={(e) => setStripeExpiry(e.target.value)}
                    className="w-full h-10.5 px-3 bg-white/5 border border-white/10 rounded-lg text-sm font-mono font-medium text-white focus:border-indigo-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">CVC / CVC2</label>
                  <input 
                    type="text" 
                    value={stripeCvc} 
                    onChange={(e) => setStripeCvc(e.target.value)}
                    className="w-full h-10.5 px-3 bg-white/5 border border-white/10 rounded-lg text-sm font-mono font-medium text-white focus:border-indigo-500 outline-none" 
                  />
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-indigo-950/50 border border-indigo-500/30 rounded-lg flex items-center gap-2 text-xs font-medium text-indigo-300">
              <Lock size={13} className="shrink-0" />
              <span className="text-xs">Stripe test transaction environment</span>
            </div>

            <button 
              onClick={handleCompleteStripePayment}
              disabled={isProcessing}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Authorizing Stripe...</span>
                </>
              ) : (
                <>
                  <span>Pay RM {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} with Stripe</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Footer Minimal */}
      <footer className="relative z-10 px-8 md:px-16 py-12 border-t border-white/5 mt-16">
         <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <img src={LOGO_URL} className="h-7 opacity-30 grayscale" alt="Meadow" />
            <p className="text-[11px] font-medium text-white/30">
               © {new Date().getFullYear()} Meadow IT Distribution
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all shadow-sm">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all shadow-sm">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all shadow-sm">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47V18.77a6.738 6.738 0 0 1-6.76 6.76 6.738 6.738 0 0 1-6.76-6.76 6.738 6.738 0 0 1 6.76-6.76c.42-.02.84.03 1.25.12v4.03a2.71 2.71 0 0 0-1.25-.12 2.728 2.728 0 0 0-2.72 2.73 2.728 2.728 0 0 0 2.72 2.73 2.728 2.728 0 0 0 2.73-2.73V.02z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all shadow-sm group">
                <img src="https://illuminatelabs.space/assets/xhs_logo.png" className="w-5 h-5 object-contain brightness-0 invert opacity-40 group-hover:opacity-100 transition-all" referrerPolicy="no-referrer" alt="Xiaohongshu" />
              </a>
            </div>
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
