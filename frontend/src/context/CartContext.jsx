import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Failed to parse cart from local storage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to save cart to local storage', error);
    }
  }, [cartItems]);

  const addToCart = (product, options) => {
    setCartItems(prev => {
      // Check if item with same product ID and options already exists
      const existingItemIndex = prev.findIndex(item => 
        item.product._id === product._id && 
        JSON.stringify(item.options) === JSON.stringify(options)
      );

      if (existingItemIndex >= 0) {
        // If it exists, we could increase quantity, but for tours it's usually separate items or we just add it
        // Let's just add it as a separate item for simplicity with tours
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      } else {
        return [...prev, {
          id: Date.now().toString(), // Unique ID for cart item
          product,
          options,
          quantity: 1
        }];
      }
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => 
      item.id === cartItemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount: cartItems.reduce((total, item) => total + item.quantity, 0)
    }}>
      {children}
    </CartContext.Provider>
  );
};
