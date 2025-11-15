import React, { createContext, useState, useContext, useEffect, use } from 'react';
import PropTypes from 'prop-types'; 
import { useNotification } from './NotificationContext';
import { getUserId } from '../../Keycloak.js';

const CartContext = createContext(undefined);

const calcularTotales = (items) => {
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.precio * item.quantity, 0);
  return { count, total };
};

export const CartProvider = ({ children }) => {

  const { addNotification } = useNotification();
  const userId = getUserId();
  const getCartKey = () => {
    if (!userId) return null; 
    return `cart_${userId}`;
  };

  const getInicialCart = () => {
    const cartKey = getCartKey();
    if (!cartKey) return { items: [], count: 0, total: 0 };; // Si no hay usuario, carrito vacío
    try {
      const storedItems = localStorage.getItem(cartKey);
      const items = storedItems ? JSON.parse(storedItems) : [];
      const { count, total } = calcularTotales(items); 
      return { items, count, total };
    } catch (error) {
      console.error('Error al cargar el carrito de localStorage:', error);
      return { items: [], count: 0, total: 0 };
    }
  };

  const [cartItems, setCartItems] = useState(getInicialCart().items);
  const [cartCount, setCartCount] = useState(getInicialCart().count);
  const [cartTotal, setCartTotal] = useState(getInicialCart().total);

  useEffect(() => {
    const { items, count, total } = getInicialCart();
    setCartItems(items);
    setCartCount(count);
    setCartTotal(total);

  }, [userId]);

  const setCart = (newItems) => {

    const { count, total } = calcularTotales(newItems);

    setCartItems(newItems);
    setCartCount(count);
    setCartTotal(total);

    const cartKey = getCartKey();
    if (cartKey) {
      try {
            localStorage.setItem(cartKey, JSON.stringify(newItems));
          } catch (error) {
            console.error('Error al guardar el carrito en localStorage:', error);
            addNotification('Error al guardar el carrito de compras.', 'error');
          }
      }
    };

  const addItem = (product, quantity = 1) => {

    if (!product.vendedorId || !product.vendedorId._id) {
        console.error("El producto no tiene un vendedorId válido.", product);
        addNotification("Error: El producto no se puede agregar.", "error");
        return false;
    }

    const newVendorId = product.vendedorId._id;

   
    if (cartItems.length > 0) {
        const currentVendorId = cartItems[0].vendedorId._id;
        
        
        if (currentVendorId !== newVendorId) {
            const confirmed = window.confirm(
                "Tienes productos de otro vendedor en tu carrito.\n\n¿Deseas vaciar el carrito y agregar este nuevo producto?"
            );

            if (confirmed) {
                const newProduct = { ...product, id: product._id || product.id, quantity };
                setCartItems([newProduct]); 
                addNotification(`Carrito anterior vaciado. "${product.titulo}" agregado.`, "success");
                return false;
            } else {
               
                return false; 
            }
        }
    }
    
const existingItem = cartItems.find(item => (item._id || item.id) === (product._id || product.id));
    let newItems;
     if (existingItem) {
        newItems = cartItems.map(item =>
          (item._id || item.id) === (product._id || product.id)
             ? { ...item, quantity: item.quantity + quantity }
             : item
        );
     } else {
        const newProduct = { ...product, id: product._id || product.id };
        newItems = [...cartItems, { ...newProduct, quantity }];
     }
    setCart(newItems); 
     return true; 
   };

   const removeItem = (productId) => {
    const newItems = cartItems.filter(item => (item._id || item.id) !== productId);
     setCart(newItems); 
   };

   const updateQuantity = (productId, quantity) => {
     if (quantity <= 0) {
        removeItem(productId);
        return;
     }
    const newItems = cartItems.map(item =>
        (item._id || item.id) === productId ? { ...item, quantity } : item
     );
     setCart(newItems); 
   };

   const clearCart = () => {
     setCart([]); 
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

