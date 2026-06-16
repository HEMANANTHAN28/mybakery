'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  product: string; // Product ID
  name: string;
  price: number;
  image: string;
  qty: number;
  stock: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartItemsCount: number;
  cartSubtotal: number;
  addToCart: (item: Omit<CartItem, 'qty'>, qty: number) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Load cart from localStorage on client side mount
    const storedCart = localStorage.getItem('bakery_cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        localStorage.removeItem('bakery_cart');
      }
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('bakery_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  const addToCart = (item: Omit<CartItem, 'qty'>, qty: number) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((x) => x.product === item.product);

      if (existItem) {
        // Calculate new qty, capping it at product stock limit
        const newQty = Math.min(existItem.qty + qty, item.stock);
        return prevItems.map((x) =>
          x.product === existItem.product ? { ...x, qty: newQty } : x
        );
      } else {
        return [...prevItems, { ...item, qty: Math.min(qty, item.stock) }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((x) => x.product !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    setCartItems((prevItems) =>
      prevItems.map((x) =>
        x.product === productId ? { ...x, qty: Math.min(Math.max(1, qty), x.stock) } : x
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemsCount,
        cartSubtotal,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
