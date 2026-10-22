import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { X, ShoppingCart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart, CartItem } from '../lib/CartContext';

export interface SidebarCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  slug?: string;
  image_url?: string;
  image?: string;
  category?: string;
  brand?: string;
  specs?: Record<string, string>;
  discount_type?: 'none' | 'percentage' | 'fixed' | null;
  discount_value?: number;
  color?: string;
  colour?: string;
  variant?: string;
  [key: string]: any;
}

interface SidebarCartProps {
  isOpen?: boolean;
  onClose?: () => void;
  items?: SidebarCartItem[];
  onUpdateQuantity?: (id: string, delta: number) => void;
  onRemoveItem?: (id: string) => void;
  checkoutPath?: string;
  viewCartPath?: string;
  continueShoppingPath?: string;
}

export const SidebarCart: React.FC<SidebarCartProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  items: propItems,
  onUpdateQuantity: propOnUpdateQuantity,
  onRemoveItem: propOnRemoveItem,
  checkoutPath = '/checkout-light',
  viewCartPath = '/cart',
  continueShoppingPath = '/products'
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Safely hook into CartContext if available
  let contextCart: CartItem[] = [];
  let contextIsOpen = false;
  let contextCloseCart = () => {};
  let contextUpdateQuantity = (_id: string, _delta: number) => {};
  let contextRemoveFromCart = (_id: string) => {};

  try {
    const ctx = useCart();
    contextCart = ctx.cart;
    contextIsOpen = ctx.isCartOpen;
    contextCloseCart = ctx.closeCart;
    contextUpdateQuantity = ctx.updateQuantity;
    contextRemoveFromCart = ctx.removeFromCart;
  } catch (e) {
    // If used outside CartProvider fallback gracefully
  }

  const isOpen = propIsOpen !== undefined ? propIsOpen : contextIsOpen;
  const onClose = propOnClose || contextCloseCart;
  const items = propItems !== undefined ? propItems : contextCart;
  const onUpdateQuantity = propOnUpdateQuantity || contextUpdateQuantity;
  const onRemoveItem = propOnRemoveItem || contextRemoveFromCart;

  const getItemPrice = (item: SidebarCartItem): number => {
    let p = Number(item.price) || 0;
    if (item.discount_type === 'percentage' && item.discount_value) {
      p = p * (1 - item.discount_value / 100);
    } else if (item.discount_type === 'fixed' && item.discount_value) {
      p = Math.max(0, p - item.discount_value);
    }
    return p;
  };

  const subtotal = items.reduce((sum, item) => {
    return sum + getItemPrice(item) * item.quantity;
  }, 0);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const getItemImage = (item: SidebarCartItem): string => {
    return (
      item.image_url ||
      item.image ||
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400"
    );
  };

  const getItemSubtitle = (item: SidebarCartItem): string | null => {
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

  const getItemLink = (item: SidebarCartItem): string => {
    if (item.link && typeof item.link === 'string') return item.link;
    if (item.url && typeof item.url === 'string') return item.url;
    
    const slug = item.slug || item.id;
    if (!slug) return '/products';

    if (slug.startsWith('/')) return slug;

    const isPrebuilt = 
      item.is_prebuilt || 
      item.category?.toLowerCase() === 'prebuilt' || 
      slug.startsWith('level-') || 
      slug.includes('combo') || 
      slug.includes('prebuilt');

    if (isPrebuilt) {
      return `/prebuilt/${slug}`;
    }

    return `/product/${slug}`;
  };

  const handleCheckout = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigate(checkoutPath);
    onClose();
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleViewCart = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigate(viewCartPath);
    onClose();
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleContinueShopping = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onClose();
    // If already on products catalog, product details, or home, just closing the drawer lets them continue shopping!
    // If on /cart or /checkout or order completion, navigate back to /products
    if (
      location.pathname === '/cart' || 
      location.pathname.startsWith('/checkout') || 
      location.pathname === '/order-success'
    ) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      navigate(continueShoppingPath);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-[9998]"
            onClick={onClose}
          />

          {/* Drawer Panel - compact & presentable size */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="relative w-full max-w-[370px] bg-white h-full shadow-2xl flex flex-col z-[10000]"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Shopping Cart
                </h2>
                {totalCount > 0 && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {totalCount}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Items List */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
              {items.length === 0 ? (
                <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center px-4 py-8">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-3 border border-slate-100">
                    <ShoppingCart size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">
                    Your cart is empty
                  </h3>
                  <p className="text-xs text-slate-400 mb-5 max-w-xs leading-relaxed">
                    Explore our collection of custom rigs, components and laptops to add items to your cart.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      window.scrollTo({ top: 0, behavior: 'instant' });
                      navigate(continueShoppingPath);
                    }}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-[#c5161d] active:bg-[#a81318] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer inline-block"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  const finalUnitPrice = getItemPrice(item);
                  const subtitle = getItemSubtitle(item);
                  const itemLink = getItemLink(item);

                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-b-0"
                    >
                      {/* Product Thumbnail */}
                      <Link
                        to={itemLink}
                        onClick={() => {
                          onClose();
                          window.scrollTo({ top: 0, behavior: 'instant' });
                        }}
                        className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200/70 p-1 flex items-center justify-center shrink-0 overflow-hidden hover:border-slate-300 transition-all cursor-pointer group/thumb"
                        title={item.name}
                      >
                        <img
                          src={getItemImage(item)}
                          alt={item.name}
                          className="w-full h-full object-contain group-hover/thumb:scale-105 transition-transform"
                          loading="lazy"
                        />
                      </Link>

                      {/* Product Info & Controls */}
                      <div className="flex-1 min-w-0">
                        {/* Title - Clickable Link to Product */}
                        <Link
                          to={itemLink}
                          onClick={() => {
                            onClose();
                            window.scrollTo({ top: 0, behavior: 'instant' });
                          }}
                          className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2 hover:text-[#e11d48] transition-colors block cursor-pointer"
                          title={item.name}
                        >
                          {item.name}
                        </Link>

                        {/* Optional Subtitle / Specs / Colour */}
                        {subtitle && (
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                            {subtitle}
                          </p>
                        )}

                        {/* Price */}
                        <div className="mt-1">
                          <span className="text-xs sm:text-sm font-bold text-slate-900">
                            RM {finalUnitPrice.toLocaleString('en-MY', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>

                        {/* Quantity Stepper + Remove Button */}
                        <div className="flex items-center justify-between gap-2 mt-2">
                          {/* Stepper */}
                          <div className="bg-slate-100 rounded-lg px-2 py-0.5 inline-flex items-center gap-2.5 text-xs font-semibold">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onUpdateQuantity) onUpdateQuantity(item.id, -1);
                              }}
                              className="text-slate-500 hover:text-slate-900 transition-colors p-1 active:scale-90 cursor-pointer text-sm font-bold"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="text-xs font-bold text-slate-900 min-w-[16px] text-center select-none">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onUpdateQuantity) onUpdateQuantity(item.id, 1);
                              }}
                              className="text-slate-500 hover:text-slate-900 transition-colors p-1 active:scale-90 cursor-pointer text-sm font-bold"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          {/* Remove Link */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onRemoveItem) onRemoveItem(item.id);
                            }}
                            className="text-[11px] font-semibold text-slate-400 hover:text-[#c5161d] transition-colors cursor-pointer py-1 px-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-white space-y-2.5 shrink-0">
                {/* Subtotal */}
                <div className="flex items-center justify-between pb-0.5">
                  <span className="text-xs sm:text-sm font-semibold text-slate-600">
                    Subtotal
                  </span>
                  <span className="text-base sm:text-lg font-bold text-slate-900">
                    RM {subtotal.toLocaleString('en-MY', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <p className="text-[10px] text-slate-400">
                  Taxes and shipping calculated at checkout.
                </p>

                {/* Primary: Checkout */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-2.5 bg-slate-900 hover:bg-[#c5161d] active:bg-[#a81318] text-white rounded-xl text-xs sm:text-sm font-bold shadow hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Checkout</span>
                  <ArrowRight size={15} />
                </button>

                {/* Secondary: View Cart */}
                <button
                  type="button"
                  onClick={handleViewCart}
                  className="w-full py-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 border border-slate-200 hover:border-slate-300 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <span>View Cart</span>
                </button>

                {/* Tertiary: Continue Shopping */}
                <button
                  type="button"
                  onClick={handleContinueShopping}
                  className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-900 py-1 transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SidebarCart;
