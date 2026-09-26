'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { WCProduct } from '@/lib/wordpress';

export interface CartItem {
  product: WCProduct;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: WCProduct, qty?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Загрузка из sessionStorage при монтировании
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('cart');
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  // Сохранение при изменении
  useEffect(() => {
    try {
      sessionStorage.setItem('cart', JSON.stringify(items));
    } catch {}
  }, [items]);

  const addToCart = (product: WCProduct, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQty = (productId: number, qty: number) => {
    if (qty <= 0) return removeFromCart(productId);
    setItems(prev =>
      prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i)
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + parseFloat(i.product.price) * i.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}