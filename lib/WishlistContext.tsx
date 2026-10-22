import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Heart, Check, Trash2, X, ShoppingCart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from './CartContext';
import { Link } from 'react-router-dom';

export interface WishlistItem {
  id: string;
  name: string;
  slug?: string;
  price: number;
  image_url?: string;
  category?: string;
  brand?: string;
  [key: string]: any;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  wishlistCount: number;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (item: WishlistItem, e?: React.MouseEvent) => boolean;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string, e?: React.MouseEvent) => void;
  clearWishlist: () => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = 'meadow_wishlist';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      console.warn('Failed to parse wishlist from localStorage:', err);
    }
    return [];
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [toast, setToast] = useState<{ id: number; message: string; type: 'add' | 'remove'; item?: WishlistItem } | null>(null);

  // Synchronize wishlist with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (err) {
      console.error('Failed to save wishlist to localStorage:', err);
    }
  }, [wishlist]);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setWishlist(parsed);
          }
        } catch (err) {
          console.warn('Failed to parse storage event wishlist:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isInWishlist = useCallback((id: string) => {
    if (!id) return false;
    return wishlist.some(item => String(item.id) === String(id));
  }, [wishlist]);

  const showToast = (message: string, type: 'add' | 'remove', item?: WishlistItem) => {
    const toastId = Date.now();
    setToast({ id: toastId, message, type, item });
    setTimeout(() => {
      setToast(current => (current?.id === toastId ? null : current));
    }, 2800);
  };

  const addToWishlist = useCallback((item: WishlistItem) => {
    if (!item || !item.id) return;
    setWishlist(prev => {
      if (prev.some(i => String(i.id) === String(item.id))) return prev;
      return [item, ...prev];
    });
    showToast(`Added to wishlist`, 'add', item);
  }, []);

  const removeFromWishlist = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setWishlist(prev => {
      const removedItem = prev.find(i => String(i.id) === String(id));
      if (removedItem) {
        showToast(`Removed from wishlist`, 'remove', removedItem);
      }
      return prev.filter(i => String(i.id) !== String(id));
    });
  }, []);

  const toggleWishlist = useCallback((item: WishlistItem, e?: React.MouseEvent): boolean => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!item || !item.id) return false;

    let wasAdded = false;
    setWishlist(prev => {
      const exists = prev.some(i => String(i.id) === String(item.id));
      if (exists) {
        showToast(`Removed from wishlist`, 'remove', item);
        return prev.filter(i => String(i.id) !== String(item.id));
      } else {
        wasAdded = true;
        showToast(`Added to wishlist`, 'add', item);
        return [item, ...prev];
      }
    });
    return wasAdded;
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const openWishlist = useCallback(() => setIsWishlistOpen(true), []);
  const closeWishlist = useCallback(() => setIsWishlistOpen(false), []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        openWishlist,
        closeWishlist,
      }}
    >
      {children}

      {/* Global Interactive Wishlist Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-6 right-6 z-[9999] max-w-sm pointer-events-auto"
          >
            <div className="bg-slate-900 text-white px-4 py-3.5 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 backdrop-blur-xl">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                toast.type === 'add' ? 'bg-rose-500/20 text-rose-500' : 'bg-slate-800 text-slate-400'
              }`}>
                <Heart size={18} className={toast.type === 'add' ? 'fill-rose-500 text-rose-500' : ''} />
              </div>
              <div className="flex-1 min-w-0 pr-1">
                <p className="text-xs font-black uppercase tracking-wider text-white">
                  {toast.message}
                </p>
                {toast.item?.name && (
                  <p className="text-[11px] text-slate-300 truncate font-medium">
                    {toast.item.name}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase tracking-wider text-white rounded-lg transition-colors shrink-0"
              >
                View
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Wishlist Drawer Component */}
      <WishlistDrawerModal
        isOpen={isWishlistOpen}
        onClose={closeWishlist}
        items={wishlist}
        onRemove={removeFromWishlist}
        onClear={clearWishlist}
      />
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

// Internal Drawer Modal
const WishlistDrawerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  items: WishlistItem[];
  onRemove: (id: string, e?: React.MouseEvent) => void;
  onClear: () => void;
}> = ({ isOpen, onClose, items, onRemove, onClear }) => {
  const { addToCart, openCart } = useCart();

  const handleMoveToCart = (item: WishlistItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item, 1);
    onRemove(item.id);
    onClose();
    openCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[5000] overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer Slide-in */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col pointer-events-auto border-l border-slate-100"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                    <Heart size={20} className="fill-rose-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">Your Wishlist</h2>
                    <p className="text-xs text-slate-400 font-semibold">{items.length} {items.length === 1 ? 'item saved' : 'items saved'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button
                      onClick={onClear}
                      className="text-[10px] font-bold text-slate-400 hover:text-rose-600 uppercase tracking-wider px-2 py-1 transition-colors"
                      title="Clear all items"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                    aria-label="Close wishlist"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
                    <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 mb-4">
                      <Heart size={36} />
                    </div>
                    <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mb-1">Your wishlist is empty</h3>
                    <p className="text-xs text-slate-400 max-w-xs mb-6">
                      Click the heart button on any product card to save items you want to keep an eye on.
                    </p>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md"
                    >
                      Explore Products
                    </button>
                  </div>
                ) : (
                  items.map(item => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-2xl flex items-center gap-3.5 transition-all group"
                    >
                      <Link
                        to={`/product/${item.slug || item.id}`}
                        onClick={onClose}
                        className="w-16 h-16 bg-white rounded-xl border border-slate-100 flex items-center justify-center p-2 shrink-0 overflow-hidden"
                      >
                        <img
                          src={item.image_url || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=300'}
                          alt={item.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.slug || item.id}`}
                          onClick={onClose}
                          className="text-xs font-black text-slate-900 hover:text-rose-600 transition-colors uppercase tracking-tight line-clamp-1 block"
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-black text-slate-900">
                            RM{Number(item.price || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={(e) => handleMoveToCart(item, e)}
                          className="w-8 h-8 rounded-lg bg-slate-900 text-white hover:bg-rose-600 flex items-center justify-center transition-colors shadow-sm"
                          title="Move to Cart"
                          aria-label="Move to cart"
                        >
                          <ShoppingCart size={14} />
                        </button>
                        <button
                          onClick={(e) => onRemove(item.id, e)}
                          className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 flex items-center justify-center transition-colors"
                          title="Remove from wishlist"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>Total saved products</span>
                    <span className="text-slate-900 font-black">{items.length} units</span>
                  </div>
                  <button
                    onClick={() => {
                      items.forEach(item => addToCart(item, 1));
                      onClear();
                      onClose();
                      openCart();
                    }}
                    className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <span>Add All to Cart</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
