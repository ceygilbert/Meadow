import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  CreditCard, 
  FileText, 
  Truck, 
  ChevronRight, 
  ShieldCheck, 
  Info, 
  Lock, 
  ArrowRight, 
  Box, 
  Facebook, 
  Instagram, 
  ShoppingCart, 
  Zap, 
  Loader2, 
  Settings, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

import PublicNavbar from '../../components/PublicNavbar';
import { useAuth } from '../../lib/AuthContext';
import { useCart } from '../../lib/CartContext';
import { DEFAULT_STRIPE_PUBLISHABLE_KEY, DEFAULT_STRIPE_CHECKOUT_URL, redirectToStripeCheckout } from '../../lib/stripe';

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/Red%20Full%20Logo.png";

const LightCheckout: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { cart: contextCart, clearCart } = useCart();

  const [deliveryMethod] = useState('Shipping');
  const [selectedBranch] = useState('WEST MALAYSIA GDEX LOGISTICS');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [showTerms, setShowTerms] = useState(false);

  const [cartItems, setCartItems] = useState<any[]>(() => {
    if (contextCart && contextCart.length > 0) return contextCart;
    try {
      const saved = localStorage.getItem('meadow_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  // Form states - Compact & optimized
  const [customerCategory, setCustomerCategory] = useState('Personal');
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [nric, setNric] = useState('');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');

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
    if (contextCart && contextCart.length > 0) {
      setCartItems(contextCart);
    } else {
      const saved = localStorage.getItem('meadow_cart');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setCartItems(parsed);
          }
        } catch (e) {
          console.error("Failed to parse saved cart", e);
        }
      }
    }
  }, [contextCart]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (Number(item.price || 0) * (item.quantity || 1)), 0);
  }, [cartItems]);

  // Standard GDEX flat rate delivery across West Malaysia
  const deliveryFee = 45;
  const grandTotal = subtotal + deliveryFee;

  const paymentOptions = [
    { 
      id: 'Credit Card', 
      label: 'Instant Card / FPX', 
      sub: 'Stripe Gateway (Visa, Mastercard, FPX, GrabPay)',
      icon: <Zap size={16} className="text-amber-500" />
    },
    { 
      id: 'IPP', 
      label: 'Instalment Plan', 
      sub: '0% Interest EPP via Participating Banks',
      icon: <CreditCard size={16} className="text-blue-500" />
    },
    { 
      id: 'Atome', 
      label: 'Buy Now Pay Later', 
      sub: 'Split into 3 monthly interest-free payments',
      icon: <CheckCircle2 size={16} className="text-emerald-500" />
    }
  ];

  const handlePaymentSubmit = () => {
    setFormError(null);
    if (cartItems.length === 0) {
      setFormError('Your shopping cart is empty. Add products before checking out.');
      return;
    }
    if (!fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Please enter your mobile contact number.');
      return;
    }
    if (!email.trim()) {
      setFormError('Please enter your registry email address.');
      return;
    }
    if (!address.trim()) {
      setFormError('Please enter your delivery address for GDEX shipping.');
      return;
    }
    if (!postalCode.trim()) {
      setFormError('Please enter your postal code.');
      return;
    }

    setIsProcessing(true);

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    setCurrentOrderId(orderId);

    const orderData = {
      order_id: orderId,
      customer_name: fullName,
      email: email,
      phone: phone,
      nric: nric,
      address: address,
      postal_code: postalCode,
      notes: notes,
      delivery_method: 'Shipping By GDEX',
      branch: 'West Malaysia GDEX Logistics',
      subtotal: subtotal,
      delivery_fee: deliveryFee,
      total_amount: grandTotal,
      payment_method: paymentMethod === 'Credit Card' ? 'Stripe Checkout' : paymentMethod,
      payment_status: paymentMethod === 'Credit Card' ? 'Pending' : 'Completed',
      order_status: 'Processing',
      items: cartItems,
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
        detail: `Meadow Order ${orderId}`,
        name: fullName,
        email: email,
        phone: phone,
        checkoutUrl: stripeCheckoutUrl
      });

      setIsProcessing(false);
      if (!redirected) {
        setShowStripeModal(true);
      } else {
        clearCart();
        navigate(`/order-success?orderId=${orderId}`);
      }
    } else {
      setTimeout(() => {
        setIsProcessing(false);
        clearCart();
        navigate(`/order-success?orderId=${orderId}`);
      }, 900);
    }
  };

  const handleCompleteStripePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowStripeModal(false);
      clearCart();
      navigate(`/order-success?orderId=${currentOrderId || 'ORD-COMPLETE'}`);
    }, 1100);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-rose-600 selection:text-white font-sans overflow-x-hidden">
      <PublicNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16">
        {/* Breadcrumb & Title */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link to="/products" className="hover:text-slate-900 transition-colors">Products</Link>
              <span>/</span>
              <Link to="/cart" className="hover:text-slate-900 transition-colors">Cart</Link>
              <span>/</span>
              <span className="text-slate-900 font-semibold">Checkout</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Checkout
            </h1>
          </div>

          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 transition-colors self-start sm:self-auto"
          >
            <ArrowLeft size={14} />
            <span>Return to Cart</span>
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Form Sections */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            
            {/* 1. Customer Details */}
            <section className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between pb-2.5 mb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">1</span>
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900">Customer Details</h2>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">* Required fields</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700 block mb-1.5">Customer</label>
                  <select 
                    value={customerCategory}
                    onChange={(e) => setCustomerCategory(e.target.value)}
                    className="w-full h-14 px-4 bg-slate-50/70 border border-slate-200 rounded-lg text-sm sm:text-base font-medium text-slate-800 focus:bg-white focus:border-rose-600 focus:ring-1 focus:ring-rose-600 outline-none transition-all cursor-pointer shadow-2xs"
                  >
                    <option value="Personal">Individual / Personal</option>
                    <option value="Corporate">Corporate / Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-700 block mb-1.5">Full Name *</label>
                  <input 
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Tan Wei Ming"
                    className="w-full h-14 px-4 bg-slate-50/70 border border-slate-200 rounded-lg text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-rose-600 focus:ring-1 focus:ring-rose-600 outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-700 block mb-1.5">ID Number (NRIC / Passport)</label>
                  <input 
                    type="text"
                    value={nric}
                    onChange={(e) => setNric(e.target.value)}
                    placeholder="For E-Invoice"
                    className="w-full h-14 px-4 bg-slate-50/70 border border-slate-200 rounded-lg text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-rose-600 focus:ring-1 focus:ring-rose-600 outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-700 block mb-1.5">Mobile Phone *</label>
                  <input 
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+60 12-345 6789"
                    className="w-full h-14 px-4 bg-slate-50/70 border border-slate-200 rounded-lg text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-rose-600 focus:ring-1 focus:ring-rose-600 outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-700 block mb-1.5">Email Address *</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-14 px-4 bg-slate-50/70 border border-slate-200 rounded-lg text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-rose-600 focus:ring-1 focus:ring-rose-600 outline-none transition-all shadow-2xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700 block mb-1.5">Delivery Address *</label>
                  <textarea 
                    rows={6} 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, building, unit number, city, and state"
                    className="w-full p-4 bg-slate-50/70 border border-slate-200 rounded-lg text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-rose-600 focus:ring-1 focus:ring-rose-600 outline-none transition-all resize-y min-h-[160px] shadow-2xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-700 block mb-1.5">Postal Code *</label>
                  <input 
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 81100"
                    className="w-full h-14 px-4 bg-slate-50/70 border border-slate-200 rounded-lg text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-rose-600 focus:ring-1 focus:ring-rose-600 outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-700 block mb-1.5">Delivery Notes (Optional)</label>
                  <input 
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Special delivery instructions"
                    className="w-full h-14 px-4 bg-slate-50/70 border border-slate-200 rounded-lg text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-rose-600 focus:ring-1 focus:ring-rose-600 outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>
            </section>

            {/* 2. Logistics & Delivery (Shipping By GDEX only, compact box & small text) */}
            <section className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">2</span>
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900">Delivery Method</h2>
                </div>
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wide">GDEX Courier</span>
              </div>

              {/* Single Compact GDEX Shipping Card */}
              <div className="border border-rose-400/40 bg-rose-50/20 rounded-lg p-2.5 sm:p-3 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <Truck size={14} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs font-bold text-slate-900">Shipping By GDEX</p>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700">Doorstep Delivery</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">West Malaysia coverage • 1 - 3 working days with live parcel tracking</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-slate-900 block">RM 45.00</span>
                    <span className="text-[9px] text-slate-400">Standard Rate</span>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 size={11} />
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Payment Method */}
            <section className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">3</span>
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900">Payment Option</h2>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Encrypted Checkout</span>
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
                        ? 'bg-rose-50/50 border-rose-600 shadow-2xs' 
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center shrink-0">
                          {opt.icon}
                        </div>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          paymentMethod === opt.id ? 'border-rose-600 bg-rose-600 text-white' : 'border-slate-300'
                        }`}>
                          {paymentMethod === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <p className={`text-xs font-bold ${paymentMethod === opt.id ? 'text-rose-900' : 'text-slate-900'}`}>{opt.label}</p>
                      <p className="text-[9.5px] text-slate-400 mt-0.5 leading-snug line-clamp-1">{opt.sub}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Stripe Gateway Notice */}
              {paymentMethod === 'Credit Card' && (
                <div className="mt-3.5 bg-indigo-50/60 border border-indigo-200/70 rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <CreditCard size={15} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Stripe Secure Payment Gateway</p>
                      <p className="text-[11px] text-slate-500">Supports Visa, Mastercard, FPX, and major mobile wallets.</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowStripeConfig(!showStripeConfig)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 bg-white border border-indigo-200 px-2.5 py-1 rounded-lg hover:bg-indigo-50 transition-colors self-start sm:self-auto cursor-pointer"
                  >
                    <Settings size={12} />
                    <span>{showStripeConfig ? 'Hide Config' : 'Stripe Key'}</span>
                  </button>
                </div>
              )}

              {showStripeConfig && paymentMethod === 'Credit Card' && (
                <div className="mt-3 p-3 bg-white border border-slate-200 rounded-xl space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Stripe Publishable Key</label>
                  <input 
                    type="text" 
                    value={stripePublishableKey} 
                    onChange={(e) => setStripePublishableKey(e.target.value)}
                    placeholder="pk_test_..." 
                    className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 outline-none" 
                  />
                </div>
              )}

              {/* Collapsible Service Protocol */}
              <div className="mt-4 pt-3.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTerms(!showTerms)}
                  className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors py-1 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-slate-400" />
                    <span>Meadow Service Protocol & Warranty Policies</span>
                  </span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${showTerms ? 'rotate-180' : ''}`} />
                </button>

                {showTerms && (
                  <div className="mt-2.5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px] text-slate-600 space-y-2 leading-relaxed">
                    <p>• <strong>Genuine Stock:</strong> All hardware and components are 100% genuine with official distributor warranty.</p>
                    <p>• <strong>Doorstep Handling:</strong> Secure protective packaging applied for all West Malaysia GDEX shipments.</p>
                    <p>• <strong>Order Verification:</strong> Orders are verified and dispatched within 24 hours of payment confirmation.</p>
                    <p className="text-[10px] text-slate-400 italic pt-1">Completion of checkout confirms acceptance of Meadow IT distribution terms.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary (Compact & Refined) */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-28 space-y-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Order Summary</h3>
                  <p className="text-[11px] text-slate-400">Review selected components</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <ShoppingCart size={16} />
                </div>
              </div>

              {/* Items List */}
              <div className="py-3.5 space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {cartItems.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    <p>No items in cart.</p>
                    <Link to="/products" className="text-rose-600 font-bold hover:underline mt-1 inline-block">Browse Catalog</Link>
                  </div>
                ) : (
                  cartItems.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-b-0">
                      <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200/80 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        {item.image_url || item.image ? (
                          <img src={item.image_url || item.image} alt={item.name} className="w-full h-full object-contain" />
                        ) : (
                          <Box size={18} className="text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-slate-900 line-clamp-2 leading-tight">{item.name}</h4>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-xs font-bold text-slate-900">
                            RM {Number(item.price || 0).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            Qty: {item.quantity || 1}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Price Breakdown */}
              <div className="pt-3.5 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    RM {subtotal.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <span>Shipping (GDEX)</span>
                    <Truck size={12} className="text-slate-400" />
                  </span>
                  <span className="font-semibold text-slate-900">RM {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>SST / Taxes</span>
                  <span className="font-semibold text-slate-900">RM 0.00</span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">Total</span>
                    <span className="text-[10px] text-slate-400">MYR (Ringgit Malaysia)</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    RM {grandTotal.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {formError && (
                <div className="mt-3.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
                  <Info size={14} className="shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Submit Payment CTA */}
              <button 
                type="button"
                onClick={handlePaymentSubmit}
                disabled={isProcessing || cartItems.length === 0}
                className="w-full mt-4 h-12 rounded-xl bg-slate-900 hover:bg-[#c5161d] active:bg-[#a81318] text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : paymentMethod === 'Credit Card' ? (
                  <>
                    <CreditCard size={16} />
                    <span>Pay RM {grandTotal.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <ArrowRight size={14} />
                  </>
                ) : (
                  <>
                    <span>Place Order</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

              <div className="mt-3.5 flex items-center justify-center gap-4 text-[11px] text-slate-400 text-center">
                <span className="flex items-center gap-1"><ShieldCheck size={13} className="text-emerald-600" /> 100% Genuine</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Lock size={13} className="text-blue-600" /> Secure Link</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Stripe Payment Modal */}
      {showStripeModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 relative my-auto animate-in zoom-in-95 duration-150">
            <button 
              type="button"
              onClick={() => setShowStripeModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 text-sm font-bold transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
                <CreditCard size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Stripe Payment Gateway</h3>
                <p className="text-[11px] text-slate-400">Order Ref: {currentOrderId || 'ORD-MEADOW'}</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Customer</span>
                <span className="font-semibold text-slate-900">{fullName}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Email</span>
                <span className="font-semibold text-slate-900">{email}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Courier</span>
                <span className="font-semibold text-slate-900">GDEX Express (WM)</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Amount Due</span>
                <span className="text-rose-600 font-extrabold text-sm">RM {grandTotal.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Compact Card Inputs */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Card Number (Stripe Test Card)</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={stripeCardNumber} 
                    onChange={(e) => setStripeCardNumber(e.target.value)}
                    className="w-full h-10.5 px-3 pl-10 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-medium text-slate-900 focus:bg-white focus:border-indigo-600 outline-none" 
                  />
                  <CreditCard className="absolute left-3 top-3 text-indigo-600" size={16} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Expiry</label>
                  <input 
                    type="text" 
                    value={stripeExpiry} 
                    onChange={(e) => setStripeExpiry(e.target.value)}
                    className="w-full h-10.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-medium text-slate-900 focus:bg-white focus:border-indigo-600 outline-none" 
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">CVC / CVC2</label>
                  <input 
                    type="text" 
                    value={stripeCvc} 
                    onChange={(e) => setStripeCvc(e.target.value)}
                    className="w-full h-10.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono font-medium text-slate-900 focus:bg-white focus:border-indigo-600 outline-none" 
                  />
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center gap-2 text-xs font-medium text-indigo-700">
              <Lock size={12} className="shrink-0" />
              <span>Stripe test transaction environment</span>
            </div>

            <button 
              type="button"
              onClick={handleCompleteStripePayment}
              disabled={isProcessing}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Authorizing Stripe...</span>
                </>
              ) : (
                <>
                  <span>Pay RM {grandTotal.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Footer Minimal */}
      <footer className="relative z-10 px-4 sm:px-8 py-8 border-t border-slate-200 mt-16 bg-white text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} className="h-6 opacity-60 grayscale" alt="Meadow" />
            <span>© {new Date().getFullYear()} Meadow IT Distribution</span>
          </div>
          <p className="text-[11px] text-slate-400 text-center">
            Official IT hardware distributor • Secure GDEX Express West Malaysia Delivery
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LightCheckout;
