import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Lock, 
  CheckCircle2, 
  Tag, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PublicNavbar from '../../components/PublicNavbar';
import Breadcrumbs from '../../components/Breadcrumbs';
import Footer from '../../components/Footer';
import SidebarCart, { SidebarCartItem } from '../../components/SidebarCart';
import { useAuth } from '../../lib/AuthContext';

import { useCart, CartItem } from '../../lib/CartContext';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart: clearGlobalCart, 
    getItemPrice,
    isCartOpen: isSidebarCartOpen,
    setIsCartOpen: setIsSidebarCartOpen 
  } = useCart();

  const [scrolled, setScrolled] = useState(false);

  // Promo code states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: 'percent' | 'fixed'; value: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const removeItem = removeFromCart;

  const getItemImage = (item: CartItem): string => {
    return (
      item.image_url ||
      item.image ||
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400"
    );
  };

  const getItemSubtitle = (item: CartItem): string | null => {
    if (item.colour) return `Colour: ${item.colour}`;
    if (item.color) return `Colour: ${item.color}`;
    if (item.variant) return `Variant: ${item.variant}`;
    if (item.specs && Object.keys(item.specs).length > 0) {
      const [key, val] = Object.entries(item.specs)[0];
      return `${key}: ${val}`;
    }
    if (item.brand && item.category) return `${item.brand} • ${item.category}`;
    if (item.category) return item.category;
    if (item.brand) return item.brand;
    return null;
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to remove all items from your cart?')) {
      clearGlobalCart();
      setAppliedCoupon(null);
    }
  };

  // Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') {
      return (subtotal * appliedCoupon.value) / 100;
    }
    return Math.min(subtotal, appliedCoupon.value);
  }, [subtotal, appliedCoupon]);

  const estimatedTotal = Math.max(0, subtotal - discountAmount);
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);

    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a voucher or promo code.');
      return;
    }

    if (code === 'MEADOW10') {
      setAppliedCoupon({ code, type: 'percent', value: 10 });
      setCouponSuccess('Promo code MEADOW10 applied! 10% discount added.');
      setCouponCode('');
    } else if (code === 'WELCOME') {
      setAppliedCoupon({ code, type: 'fixed', value: 50 });
      setCouponSuccess('Welcome discount of RM 50.00 applied!');
      setCouponCode('');
    } else if (code === 'FREESHIP') {
      setCouponSuccess('Free Shipping applied to your order at checkout!');
      setCouponCode('');
    } else {
      setCouponError('Invalid promo code. Try MEADOW10 or WELCOME.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess(null);
    setCouponError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#c5161d] selection:text-white">
      {/* Top Navbar */}
      <PublicNavbar 
        user={user}
        profile={profile}
        cartCount={totalItemCount}
        onOpenAuth={() => navigate('/customer/login')}
        onOpenCart={() => setIsSidebarCartOpen(true)}
        scrolled={scrolled}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-12 pt-28 pb-16">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs homePath="/" items={[{ label: 'Shopping Cart' }]} />
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <span>Shopping Cart</span>
              {totalItemCount > 0 && (
                <span className="text-xs sm:text-sm font-bold px-2.5 py-1 rounded-full bg-slate-900 text-white">
                  {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Review your selected components and systems before proceeding to checkout.
            </p>
          </div>

          {cart.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[#c5161d] transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Trash2 size={14} />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {/* Cart Content: Empty State vs. Items Grid */}
        {cart.length === 0 ? (
          <div className="mt-8 bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-14 text-center max-w-2xl mx-auto shadow-xs">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-5 border border-slate-200/60 shadow-inner">
              <ShoppingBag size={36} className="text-slate-400" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Your Shopping Cart is Empty
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
              Looks like you haven't added any products to your cart yet. Discover our powerful custom builds, top-tier GPUs, CPUs, monitors, and peripherals.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/products"
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-[#c5161d] active:bg-[#a81318] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>Browse Products</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/customised"
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>PC Builder</span>
              </Link>
            </div>

            {/* Quick Category Chips */}
            <div className="mt-10 pt-8 border-t border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                Popular Categories
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  { label: 'Graphics Cards', path: '/products?search=RTX' },
                  { label: 'Processors', path: '/products?search=Intel' },
                  { label: 'Motherboards', path: '/products?search=Motherboard' },
                  { label: 'Gaming Laptops', path: '/products?search=Laptop' },
                  { label: 'Prebuilt Rigs', path: '/prebuilt' },
                ].map((chip) => (
                  <Link
                    key={chip.label}
                    to={chip.path}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    {chip.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Products Table & Items (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                {/* Table Header (Hidden on small mobile) */}
                <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-slate-100">
                  {cart.map((item) => {
                    const unitPrice = getItemPrice(item);
                    const itemTotal = unitPrice * item.quantity;
                    const subtitle = getItemSubtitle(item);

                    return (
                      <div
                        key={item.id}
                        className="p-4 sm:px-6 sm:py-5 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center transition-colors hover:bg-slate-50/50"
                      >
                        {/* Product Info */}
                        <div className="w-full sm:col-span-6 flex items-center gap-4">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-50 border border-slate-200/80 p-1.5 shrink-0 flex items-center justify-center overflow-hidden">
                            <img
                              src={getItemImage(item)}
                              alt={item.name}
                              className="w-full h-full object-contain"
                              loading="lazy"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2">
                              {item.slug ? (
                                <Link to={`/product/${item.slug}`} className="hover:text-[#c5161d] transition-colors">
                                  {item.name}
                                </Link>
                              ) : (
                                item.name
                              )}
                            </h3>

                            {subtitle && (
                              <p className="text-xs text-slate-500 font-medium mt-1 truncate">
                                {subtitle}
                              </p>
                            )}

                            {/* Mobile-only unit price */}
                            <div className="sm:hidden mt-1.5 flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-500">
                                Unit: RM {unitPrice.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Unit Price (Desktop) */}
                        <div className="hidden sm:block sm:col-span-2 text-right">
                          <span className="text-sm font-semibold text-slate-900">
                            RM {unitPrice.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="w-full sm:w-auto sm:col-span-2 flex items-center justify-between sm:justify-center">
                          <span className="sm:hidden text-xs font-semibold text-slate-500">Quantity</span>
                          <div className="bg-slate-100 rounded-xl px-3 py-1 inline-flex items-center gap-3 text-xs font-semibold">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="text-slate-500 hover:text-slate-900 transition-colors p-1 active:scale-90 cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="text-xs font-bold text-slate-900 min-w-[16px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="text-slate-500 hover:text-slate-900 transition-colors p-1 active:scale-90 cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Total & Remove */}
                        <div className="w-full sm:w-auto sm:col-span-2 flex items-center justify-between sm:justify-end gap-3 text-right">
                          <span className="sm:hidden text-xs font-semibold text-slate-500">Item Total</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm sm:text-base font-bold text-slate-900">
                              RM {itemTotal.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-slate-400 hover:text-[#c5161d] p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                              title="Remove item"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Action Bar inside Items Card */}
                <div className="p-4 sm:px-6 bg-slate-50/60 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#c5161d] transition-colors"
                  >
                    <ArrowLeft size={16} />
                    <span>Continue Shopping</span>
                  </Link>

                  <span className="text-[11px] text-slate-400">
                    Stock held for 15 minutes once checkout begins
                  </span>
                </div>
              </div>

              {/* Trust & Guarantee Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white rounded-xl border border-slate-200/70 p-4 flex items-center gap-3 shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">100% Genuine</h4>
                    <p className="text-[11px] text-slate-400">Official distributor warranty</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200/70 p-4 flex items-center gap-3 shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Fast Shipping</h4>
                    <p className="text-[11px] text-slate-400">Peninsular & East Malaysia</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200/70 p-4 flex items-center gap-3 shadow-2xs">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Secure Payment</h4>
                    <p className="text-[11px] text-slate-400">Encrypted checkout</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Order Summary Sidebar (4 Cols) */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                  Order Summary
                </h2>

                {/* Voucher / Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <Tag size={13} className="text-slate-400" />
                    <span>Have a promo code?</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. MEADOW10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-semibold text-slate-800 placeholder:normal-case placeholder:font-normal focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                    >
                      Apply
                    </button>
                  </div>

                  {couponError && (
                    <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 pt-1">
                      <AlertCircle size={12} />
                      <span>{couponError}</span>
                    </p>
                  )}

                  {couponSuccess && (
                    <div className="text-[11px] text-emerald-600 font-medium flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        {couponSuccess}
                      </span>
                      {appliedCoupon && (
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-slate-400 hover:text-red-500 text-[10px] underline cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )}
                </form>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-3 border-t border-slate-100 text-xs sm:text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">
                      RM {subtotal.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {appliedCoupon && discountAmount > 0 && (
                    <div className="flex items-center justify-between text-emerald-600">
                      <span className="flex items-center gap-1">
                        <Sparkles size={13} />
                        Discount ({appliedCoupon.code})
                      </span>
                      <span className="font-semibold">
                        − RM {discountAmount.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Shipping & Delivery</span>
                    <span className="italic font-medium">Calculated at checkout</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Estimated Tax</span>
                    <span className="italic font-medium">Included</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">Total</span>
                      <span className="text-[10px] text-slate-400 font-normal">MYR (Ringgit Malaysia)</span>
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      RM {estimatedTotal.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Primary CTA: Checkout */}
                <button
                  type="button"
                  onClick={() => navigate('/checkout-light')}
                  className="w-full py-3.5 bg-slate-900 hover:bg-[#c5161d] active:bg-[#a81318] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={17} />
                </button>

                <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                  By checking out, you agree to Meadow IT's Terms of Use and standard warranty policy.
                </p>
              </div>

              {/* Need assistance contact card */}
              <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200/60 text-xs text-slate-600 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 text-slate-700 shadow-2xs">
                  <HelpCircle size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">Need help with your order?</p>
                  <p className="text-[11px] text-slate-500">Contact our Meadow specialists via WhatsApp or Call.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sidebar Cart Component (synchronized) */}
      <SidebarCart
        isOpen={isSidebarCartOpen}
        onClose={() => setIsSidebarCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        checkoutPath="/checkout-light"
        viewCartPath="/cart"
        continueShoppingPath="/products"
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Cart;
