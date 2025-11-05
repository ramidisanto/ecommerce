import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types'; 

const CartContext = createContext(undefined);


export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
    
    // --- CORRECCIÓN AQUÍ ---
    // Cambiamos item.price a item.precio
    setCartTotal(cartItems.reduce((sum, item) => sum + item.precio * item.quantity, 0));
    // --- FIN DE LA CORRECCIÓN ---

  }, [cartItems]);

  const addItem = (product, quantity = 1) => {
    setCartItems(prevItems => {
      // Buscamos por '_id' (de MongoDB) o 'id' (si es que se usa)
      const existingItem = prevItems.find(item => (item._id || item.id) === (product._id || product.id));
      if (existingItem) {
        return prevItems.map(item =>
          (item._id || item.id) === (product._id || product.id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      // Aseguramos que el producto tenga 'id' para consistencia interna
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