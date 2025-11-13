import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types'; 
import { useNotification } from './NotificationContext';

const CartContext = createContext(undefined);



export const CartProvider = ({ children }) => {

  const { addNotification } = useNotification();
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
    setCartTotal(cartItems.reduce((sum, item) => sum + item.precio * item.quantity, 0));
  }, [cartItems]);

  const addItem = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => (item._id || item.id) === (product._id || product.id));
      if (existingItem) {
        return prevItems.map(item =>
          (item._id || item.id) === (product._id || product.id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      const newProduct = { ...product, id: product._id || product.id };
      return [...prevItems, { ...newProduct, quantity }];
    });
  };

  const removeItem = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => (item._id || item.id) !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        (item._id || item.id) === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};