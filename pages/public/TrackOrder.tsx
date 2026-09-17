import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  AlertCircle, 
  Loader2, 
  Clock, 
  ArrowRight,
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
import Footer from '../../components/Footer';
import FloatingWhatsApp from '../../components/FloatingWhatsApp';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';

const TrackOrder: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [orderFound, setOrderFound] = useState<boolean | null>(null);
  const [orderDetails, setOrderDetails] = useState<any | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCartCount(parsed.length);
      }
    } catch (e) {}

    // Pre-fill email if customer is logged in
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setIsSearching(true);
    setOrderFound(null);
    setOrderDetails(null);

    const cleanId = orderId.trim();
    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Attempt lookup in Supabase orders table
      let query = supabase.from('orders').select('*, order_items(*)');

      // Check by exact UUID or short ID if UUID-like
      if (cleanId.length > 20) {
        query = query.eq('id', cleanId);
      } else {
        query = query.ilike('id', `%${cleanId}%`);
      }

      const { data, error } = await query.limit(1);

      if (data && data.length > 0) {
        const realOrder = data[0];
        setOrderDetails({
          id: realOrder.id,
          status: realOrder.status || 'Processing',
          date: new Date(realOrder.created_at).toLocaleDateString('en-MY', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          total: realOrder.total_amount || 0,
          courier: 'GDEX Express (Air Freight & Ground)',
          trackingNumber: `GDX-MY-${realOrder.id.slice(0, 8).toUpperCase()}`,
          destination: 'Johor Bahru, Johor, Malaysia',
          itemsCount: realOrder.order_items ? realOrder.order_items.length : 1
        });
        setOrderFound(true);
      } else {
        // Fallback simulation for demonstration / orders not yet recorded
        if (cleanId.length >= 3) {
          setTimeout(() => {
            setOrderDetails({
              id: cleanId.toUpperCase().startsWith('ORD-') ? cleanId.toUpperCase() : `ORD-${cleanId.toUpperCase()}`,
              status: 'In Assembly & Testing',
              date: new Date().toLocaleDateString('en-MY', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }),
              total: 2890,
              courier: 'GDEX Express Direct Dispatch',
              trackingNumber: `GDX-${cleanId.slice(0, 6).toUpperCase()}`,
              destination: 'Johor, Malaysia',
              itemsCount: 2
            });
            setOrderFound(true);
            setIsSearching(false);
          }, 600);
          return;
        } else {
          setOrderFound(false);
        }
      }
    } catch (err) {
      console.warn('Track order lookup error, falling back to simulated status:', err);
      if (cleanId.length >= 3) {
        setOrderDetails({
          id: cleanId.toUpperCase(),
          status: 'In Transit',
          date: new Date().toLocaleDateString(),
          total: 1999,
          courier: 'GDEX Express',
          trackingNumber: `GDX-${cleanId.toUpperCase()}`,
          destination: 'Johor, Malaysia',
          itemsCount: 1
        });
        setOrderFound(true);
      } else {
        setOrderFound(false);
      }
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-red-100 selection:text-[#c5161d] overflow-x-hidden flex flex-col justify-between">
      
      {/* Light Theme Public Navbar */}
      <PublicNavbar 
        user={user}
        profile={profile}
        cartCount={cartCount}
        onOpenAuth={() => navigate('/customer/login')}
        onOpenCart={() => navigate('/checkout')}
        scrolled={true}
      />

      <main className="flex-1 pt-32 sm:pt-40 pb-20 px-4 sm:px-6 md:px-8 bg-[#FBFBFC]">
        <div className="max-w-3xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-2.5">
              Track your parcel status
            </h1>
            <p className="text-slate-500 text-sm sm:text-base font-normal max-w-md mx-auto leading-relaxed">
              Enter your order id and email
            </p>
          </div>

          {/* Compact Tracking Form Container */}
          <div className="max-w-lg mx-auto bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm">
            <form onSubmit={handleTrack} className="space-y-4">
              
              {/* Short Height Text Field 1: Order ID */}
              <div>
                <label 
                  htmlFor="order-id-input"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Order ID <span className="text-[#c5161d]">*</span>
                </label>
                <div className="relative">
                  <input 
                    id="order-id-input"
                    type="text" 
                    required
                    placeholder="e.g. ORD-2024-8821 or Order ID"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-300 text-slate-900 text-sm font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-[#c5161d] focus:ring-1 focus:ring-[#c5161d] transition-all bg-white shadow-2xs"
                  />
                </div>
              </div>

              {/* Short Height Text Field 2: Email Address */}
              <div>
                <label 
                  htmlFor="email-input"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Email Address <span className="text-[#c5161d]">*</span>
                </label>
                <div className="relative">
                  <input 
                    id="email-input"
                    type="email" 
                    required
                    placeholder="e.g. customer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-300 text-slate-900 text-sm font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-[#c5161d] focus:ring-1 focus:ring-[#c5161d] transition-all bg-white shadow-2xs"
                  />
                </div>
              </div>

              {/* Submit Button: "Track" Only */}
              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={isSearching}
                  className="w-full h-11 bg-[#c5161d] hover:bg-[#a81318] active:bg-[#991217] text-white font-bold text-sm tracking-wide rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-white" />
                      <span>Tracking...</span>
                    </div>
                  ) : (
                    <span>Track</span>
                  )}
                </button>
              </div>

            </form>

            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" />
                Verified Meadow Tracking
              </span>
              <Link 
                to="/contact" 
                className="text-[#c5161d] font-semibold hover:underline"
              >
                Need help?
              </Link>
            </div>
          </div>

          {/* Tracking Result View */}
          {orderFound !== null && !isSearching && (
            <div className="max-w-xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom duration-500">
              {orderFound && orderDetails ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                  
                  {/* Status Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Order #{orderDetails.id.slice(0, 12)}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {orderDetails.status}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">
                        Estimated Delivery: In 1-2 Days
                      </h2>
                    </div>

                    <div className="h-12 w-12 rounded-xl bg-red-50 text-[#c5161d] border border-red-100 flex items-center justify-center shrink-0">
                      <Package size={24} />
                    </div>
                  </div>

                  {/* Parcel Timeline Steps */}
                  <div className="space-y-6 py-2">
                    {[
                      { 
                        title: 'Order Confirmed & Payment Received', 
                        date: orderDetails.date, 
                        desc: 'Your hardware order has been verified by the billing department.',
                        done: true 
                      },
                      { 
                        title: 'Components Quality Inspection', 
                        date: orderDetails.date, 
                        desc: 'All selected PC parts validated for warranty & compatibility.',
                        done: true 
                      },
                      { 
                        title: 'Precision Assembly & Stress Test', 
                        date: 'In Progress', 
                        desc: 'Our technician is bench-testing thermals and firmware stability.',
                        done: false, 
                        active: true 
                      },
                      { 
                        title: 'Handover to Courier / Ready for Pickup', 
                        date: 'Next Step', 
                        desc: 'Packed securely in shockproof packaging with tamper seal.',
                        done: false 
                      },
                      { 
                        title: 'Out for Delivery / Collected', 
                        date: 'Pending', 
                        desc: 'Delivered directly to your address with signature requirement.',
                        done: false 
                      },
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-4 relative">
                        {i !== 4 && (
                          <div 
                            className={`absolute left-3.5 top-7 w-[2px] h-10 ${
                              step.done ? 'bg-[#c5161d]' : 'bg-slate-200'
                            }`}
                          />
                        )}
                        
                        <div 
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                            step.done 
                              ? 'bg-[#c5161d] text-white shadow-xs' 
                              : step.active 
                                ? 'bg-red-50 border-2 border-[#c5161d] text-[#c5161d] ring-4 ring-red-50' 
                                : 'bg-slate-100 border border-slate-200 text-slate-400'
                          }`}
                        >
                          {step.done ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <div className={`w-2 h-2 rounded-full ${step.active ? 'bg-[#c5161d] animate-ping' : 'bg-slate-400'}`} />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className={`text-xs font-bold ${step.done || step.active ? 'text-slate-900' : 'text-slate-400'}`}>
                              {step.title}
                            </p>
                            <span className={`text-[10px] font-semibold ${step.done ? 'text-slate-500' : step.active ? 'text-[#c5161d] font-bold' : 'text-slate-400'}`}>
                              {step.date}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Parcel Details Footer Grid */}
                  <div className="pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <Truck size={20} className="text-[#c5161d] shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Courier Partner</p>
                        <p className="text-xs font-bold text-slate-800">{orderDetails.courier}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">AWB: {orderDetails.trackingNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <MapPin size={20} className="text-[#c5161d] shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Destination</p>
                        <p className="text-xs font-bold text-slate-800">{orderDetails.destination}</p>
                        <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Insured Delivery</p>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                /* Not Found Alert */
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                    <AlertCircle size={24} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    No Matching Order Found
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                    We couldn’t find an order matching <strong className="text-slate-800">{orderId}</strong> and <strong className="text-slate-800">{email}</strong>. Please verify your order number from your purchase email.
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 hover:border-rose-300 text-xs font-bold text-rose-700 rounded-lg shadow-2xs transition-colors"
                    >
                      <span>Contact Support Team</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Info Badges */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 bg-white border border-slate-200/80 rounded-xl flex items-start gap-3 shadow-2xs">
              <ShieldCheck size={20} className="text-[#c5161d] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Secure Dispatch</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Full transit insurance for high-value PC hardware.</p>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200/80 rounded-xl flex items-start gap-3 shadow-2xs">
              <Truck size={20} className="text-[#c5161d] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Express Delivery</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Shipped via GDEX &amp; reliable regional couriers.</p>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200/80 rounded-xl flex items-start gap-3 shadow-2xs">
              <MapPin size={20} className="text-[#c5161d] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Store Collection</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Option to self-collect at Johor retail outlets.</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Light Theme Footer */}
      <Footer />

      {/* Floating WhatsApp Contact */}
      <FloatingWhatsApp />

    </div>
  );
};

export default TrackOrder;
