import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

export interface CartItem {
  id: string;
  name: string;
  slug?: string;
  price: number;
  quantity: number;
  image_url?: string;
  image?: string;
  category?: string;
  category_id?: string;
  subcategory_id?: string;
  brand?: string;
  brand_id?: string;
  specs?: Record<string, string>;
  discount_type?: 'none' | 'percentage' | 'fixed' | null;
  discount_value?: number;
  color?: string;
  colour?: string;
  variant?: string;
  stock?: number;
  [key: string]: any;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: Partial<CartItem> & { id: string; name: string; price: number }, quantity?: number) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getItemPrice: (item: CartItem) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'meadow_cart';

export const getItemDiscountedPrice = (item: CartItem): number => {
  let p = Number(item.price) || 0;
  if (item.discount_type === 'percentage' && item.discount_value) {
    p = p * (1 - item.discount_value / 100);
  } else if (item.discount_type === 'fixed' && item.discount_value) {
    p = Math.max(0, p - item.discount_value);
  }
  return p;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronously initialize cart from localStorage so it NEVER renders or wipes with []
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to parse cart from localStorage:', err);
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Synchronize cart with localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err);
    }
  }, [cart]);

  // Synchronize across tabs if localStorage is modified elsewhere
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setCart(parsed);
          }
        } catch (err) {
          console.warn('Failed to parse storage event cart:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addToCart = useCallback((item: Partial<CartItem> & { id: string; name: string; price: number }, quantity: number = 1) => {
    const qtyToAdd = Math.max(1, Number(quantity) || 1);
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((i) => String(i.id) === String(item.id));
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const existing = updated[existingIndex];
        const currentQty = Number(existing.quantity) || 1;
        const newQty = Math.min(currentQty + qtyToAdd, 99);
        updated[existingIndex] = {
          ...existing,
          ...item,
          quantity: newQty,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          ...item,
          quantity: Math.min(qtyToAdd, 99),
        } as CartItem;
        return [...prevCart, newItem];
      }
    });
    setIsCartOpen(true);
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (String(item.id) === String(id)) {
            const currentQty = Number(item.quantity) || 1;
            const newQty = currentQty + delta;
            // Only remove if user deliberately steps quantity to 0
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: Math.min(newQty, 99),
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prevCart) => prevCart.filter((item) => String(item.id) !== String(id)));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }, []);

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      return total + getItemDiscountedPrice(item) * (item.quantity || 1);
    }, 0);
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      subtotal,
      isCartOpen,
      setIsCartOpen,
      openCart,
      closeCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getItemPrice: getItemDiscountedPrice,
    }),
    [
      cart,
      cartCount,
      subtotal,
      isCartOpen,
      openCart,
      closeCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
