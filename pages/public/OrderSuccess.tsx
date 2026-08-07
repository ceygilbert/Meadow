import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Printer, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Copy, 
  Check, 
  MapPin, 
  CreditCard,
  Building2,
  FileText,
  ShoppingBag
} from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
import StudioNavbar from '../../components/StudioNavbar';

interface OrderItem {
  id?: string;
  name?: string;
  title?: string;
  price?: number;
  quantity?: number;
  qty?: number;
  image?: string;
  image_url?: string;
  category?: string;
  spec?: string;
}

interface OrderData {
  order_id: string;
  customer_name: string;
  email: string;
  phone: string;
  nric?: string;
  address?: string;
  postal_code?: string;
  notes?: string;
  delivery_method?: string;
  branch?: string;
  amount: number;
  payment_method: string;
  items: OrderItem[];
  created_at: string;
}

const OrderSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderIdParam = searchParams.get('orderId');

  const [order, setOrder] = useState<OrderData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const existing: OrderData[] = JSON.parse(localStorage.getItem('meadow_orders') || '[]');
      if (existing && existing.length > 0) {
        if (orderIdParam) {
          const found = existing.find(o => o.order_id === orderIdParam);
          setOrder(found || existing[0]);
        } else {
          setOrder(existing[0]);
        }
      } else if (orderIdParam) {
        // Mock fallback if order ID provided without local array
        setOrder({
          order_id: orderIdParam,
          customer_name: "Valued Customer",
          email: "customer@meadowit.com",
          phone: "+60 12-345 6789",
          delivery_method: "Shipping By GDEX",
          amount: 4999.00,
          payment_method: "Stripe / Online Gateway",
          items: [
            { name: "Custom PC Hardware Build", price: 4999.00, qty: 1 }
          ],
          created_at: new Date().toISOString()
        });
      }
    } catch (e) {
      console.error("Failed to load order detail", e);
    }
  }, [orderIdParam]);

  const handleCopyOrderId = () => {
    if (order?.order_id) {
      navigator.clipboard.writeText(order.order_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const displayOrderId = order?.order_id || orderIdParam || `ORD-${Date.now()}`;
  const formattedDate = order?.created_at ? new Date(order.created_at).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short'
  }) : new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' });

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans selection:bg-rose-600 selection:text-white print:bg-white print:text-black">
      
      {/* Non-printable Navbar */}
      <div className="print:hidden">
        <PublicNavbar />
      </div>

      <main className="max-w-[1200px] mx-auto px-6 sm:px-8 pt-32 sm:pt-36 pb-20 print:pt-4 print:pb-4">
        
        {/* Success Header Banner */}
        <div className="text-center mb-12 animate-in fade-in zoom-in-95 duration-500">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 mb-6 shadow-xl shadow-emerald-500/10">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 print:hidden">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Payment Verified & Order Confirmed</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-slate-900 mb-3">
            Thank You For Your Order!
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto font-normal leading-relaxed">
            Your transaction has been processed successfully. We have sent a copy of your receipt and order details to <span className="font-semibold text-slate-900">{order?.email || 'your email'}</span>.
          </p>
        </div>

        {/* Order Reference Badge & Actions Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6 print:border-none print:p-0">
          <div>
            <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Official Reference ID</div>
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-rose-600">
                {displayOrderId}
              </span>
              <button 
                onClick={handleCopyOrderId}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition print:hidden"
                title="Copy Order ID"
              >
                {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">Placed on {formattedDate}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto print:hidden">
            <button 
              onClick={handlePrint}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider transition"
            >
              <Printer size={16} />
              <span>Print Invoice</span>
            </button>
            <Link 
              to="/track-order"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition shadow-md"
            >
              <Truck size={16} />
              <span>Track Order</span>
            </Link>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid lg:grid-cols-12 gap-8 mb-8">
          
          {/* Left Column: Summary & Items */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Items Purchased */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <h2 className="text-lg font-black uppercase tracking-wide text-slate-900 flex items-center gap-2">
                  <Package size={20} className="text-rose-600" />
                  Purchased Items ({order?.items?.length || 0})
                </h2>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  Status: Processing
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {order?.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => {
                    const itemName = item.name || item.title || 'Meadow IT Hardware Product';
                    const qty = item.quantity || item.qty || 1;
                    const price = item.price || 0;
                    return (
                      <div key={idx} className="py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600 font-bold text-xs">
                            {item.image || item.image_url ? (
                              <img src={item.image || item.image_url} alt={itemName} className="w-full h-full object-cover rounded-xl" />
                            ) : (
                              <ShoppingBag size={20} className="text-slate-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 leading-snug">{itemName}</h3>
                            <p className="text-xs text-slate-500 font-medium">Qty: {qty} &times; RM {price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                          </div>
                        </div>
                        <div className="text-right font-black text-sm text-slate-900 whitespace-nowrap">
                          RM {(qty * price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-6 text-center text-slate-400 text-sm">
                    No item list stored for this reference.
                  </div>
                )}
              </div>

              {/* Total Calculation */}
              <div className="mt-6 pt-6 border-t border-slate-200 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    RM {(order?.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping & Handling</span>
                  <span className="font-semibold text-emerald-600">FREE / Standard</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (Included)</span>
                  <span className="font-semibold text-slate-900">RM 0.00</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-slate-200 text-base font-black text-slate-900">
                  <span>Grand Total Paid</span>
                  <span className="text-xl text-rose-600">
                    RM {(order?.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl print:hidden">
              <h2 className="text-lg font-black uppercase tracking-wide text-white mb-4 flex items-center gap-2">
                <Clock size={20} className="text-rose-500" />
                What Happens Next?
              </h2>
              <div className="grid sm:grid-cols-3 gap-6 text-xs text-slate-300">
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center mb-2">1</div>
                  <h4 className="font-bold text-white text-sm">Order Verification</h4>
                  <p className="leading-relaxed">Our technical team checks component stock and verifies your order spec.</p>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center mb-2">2</div>
                  <h4 className="font-bold text-white text-sm">Assembly & QC</h4>
                  <p className="leading-relaxed">Rigorous stress testing and custom cable management by certified engineers.</p>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center mb-2">3</div>
                  <h4 className="font-bold text-white text-sm">Dispatch & Tracking</h4>
                  <p className="leading-relaxed">Shipped via GDEX / Pickup notification sent via WhatsApp & SMS.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Customer & Delivery Info */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Customer Details Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3">
                Customer Information
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="text-slate-400 uppercase font-bold text-[10px] tracking-wider mb-0.5">Name</div>
                  <div className="font-bold text-slate-900 text-sm">{order?.customer_name || 'Guest User'}</div>
                </div>

                <div>
                  <div className="text-slate-400 uppercase font-bold text-[10px] tracking-wider mb-0.5">Email</div>
                  <div className="font-semibold text-slate-800">{order?.email || 'N/A'}</div>
                </div>

                <div>
                  <div className="text-slate-400 uppercase font-bold text-[10px] tracking-wider mb-0.5">Phone Number</div>
                  <div className="font-semibold text-slate-800">{order?.phone || 'N/A'}</div>
                </div>

                {order?.nric && (
                  <div>
                    <div className="text-slate-400 uppercase font-bold text-[10px] tracking-wider mb-0.5">NRIC / Passport</div>
                    <div className="font-semibold text-slate-800">{order.nric}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery & Payment Method Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-3">
                Delivery & Payment
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="text-slate-400 uppercase font-bold text-[10px] tracking-wider mb-0.5 flex items-center gap-1">
                    <Truck size={12} className="text-rose-600" />
                    Delivery Method
                  </div>
                  <div className="font-bold text-slate-900">{order?.delivery_method || 'Shipping By GDEX'}</div>
                  {order?.branch && (
                    <div className="text-slate-500 mt-0.5 flex items-center gap-1">
                      <Building2 size={12} />
                      <span>Branch: {order.branch}</span>
                    </div>
                  )}
                </div>

                {order?.address && (
                  <div>
                    <div className="text-slate-400 uppercase font-bold text-[10px] tracking-wider mb-0.5 flex items-center gap-1">
                      <MapPin size={12} className="text-rose-600" />
                      Shipping Address
                    </div>
                    <div className="font-medium text-slate-800 leading-relaxed whitespace-pre-line">
                      {order.address} {order.postal_code ? `, ${order.postal_code}` : ''}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-slate-400 uppercase font-bold text-[10px] tracking-wider mb-0.5 flex items-center gap-1">
                    <CreditCard size={12} className="text-rose-600" />
                    Payment Method
                  </div>
                  <div className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    <span>{order?.payment_method || 'Online Payment Gateway'}</span>
                  </div>
                </div>

                {order?.notes && (
                  <div>
                    <div className="text-slate-400 uppercase font-bold text-[10px] tracking-wider mb-0.5 flex items-center gap-1">
                      <FileText size={12} />
                      Order Notes
                    </div>
                    <div className="text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      "{order.notes}"
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Back to shop link */}
            <div className="pt-2 print:hidden">
              <Link 
                to="/"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm uppercase tracking-wider transition shadow-lg shadow-rose-600/20"
              >
                <span>Continue Shopping</span>
                <ArrowRight size={18} />
              </Link>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default OrderSuccess;
