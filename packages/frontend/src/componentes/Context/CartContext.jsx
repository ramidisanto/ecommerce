import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNotification } from './NotificationContext';
import { useKeycloak } from '@react-keycloak/web';

const CartContext = createContext(undefined);

const calcularTotales = (items) => {
  const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const total = items.reduce((sum, item) => sum + (item.precio || 0) * (item.quantity || 0), 0);
  return { count, total };
};

export const CartProvider = ({ children }) => {
  const { addNotification } = useNotification();
  const { keycloak, initialized } = useKeycloak();

  // Deriva la clave del carrito a partir del token ya inicializado
  const getCartKey = () => {
    const userId = keycloak?.tokenParsed?.sub;
    if (!initialized || !keycloak?.authenticated || !userId) return null;
    return `cart_${userId}`;
  };

  const loadItemsFromStorage = () => {
    const cartKey = getCartKey();
    if (!cartKey) return [];
    try {
      const raw = localStorage.getItem(cartKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Error leyendo localStorage:', e);
      return [];
    }
  };

  // Estado unificado
  const [cartItems, setCartItems] = useState(() => {
    // Inicio "prudente": si Keycloak aún no inicializó devolvemos vacío.
    // loadItemsFromStorage depende de initialized, así que no lo llamamos aquí.
    return [];
  });

  // Al inicializar Keycloak (o cambiar de usuario autenticado) cargamos storage
  useEffect(() => {
    if (!initialized) return; // esperamos a que Keycloak esté listo

    const cartKey = getCartKey();
    if (!cartKey) {
      // no hay usuario autenticado: mantenemos carrito vacío en memoria
      setCartItems([]);
      return;
    }

    const stored = loadItemsFromStorage();
    setCartItems(stored);
  }, [initialized, keycloak?.authenticated, keycloak?.tokenParsed?.sub]);

  // Guardar en storage (método centralizado)
  const persist = (items) => {
    setCartItems(items);
    const cartKey = getCartKey();
    if (!cartKey) return; // si no hay usuario, no persistimos por ahora
    try {
      localStorage.setItem(cartKey, JSON.stringify(items));
    } catch (e) {
      console.error('Error guardando carrito:', e);
      addNotification('Error al guardar el carrito.', 'error');
    }
  };

  // Helper que devuelve la "fuente de verdad" actual antes de mutar
  const getLatestItems = () => {
    const cartKey = getCartKey();
    if (!cartKey) return cartItems.slice();
    try {
      const raw = localStorage.getItem(cartKey);
      const stored = raw ? JSON.parse(raw) : [];
      // si hay algo en storage lo usamos como base; si no, usamos el estado en memoria
      return stored.length ? stored : cartItems.slice();
    } catch (e) {
      console.error('Error leyendo latest items:', e);
      return cartItems.slice();
    }
  };

  const addItem = (product, quantity = 1) => {
    if (!product || !product.vendedorId || !product.vendedorId._id) {
      addNotification('Error: producto inválido.', 'error');
      return false;
    }

    // Antes de mutar, leemos la última versión del carrito (evita condiciones de carrera)
    const base = getLatestItems();
    const newVendorId = product.vendedorId._id;

    if (base.length > 0) {
      const currentVendorId = base[0].vendedorId._id;
      if (currentVendorId !== newVendorId) {
        const confirmed = window.confirm(
          'Tienes productos de otro vendedor en tu carrito. ¿Vaciar y agregar?'
        );
        if (!confirmed) return false;
        const newProd = { ...product, id: product._id || product.id, quantity };
        persist([newProd]);
        addNotification(`Carrito vaciado exitosamente.`, 'success');
        return true;
      }
    }

    const id = product._id || product.id;
    const existing = base.find(i => (i._id || i.id) === id);

    let newItems;
    if (existing) {
      newItems = base.map(i =>
        (i._id || i.id) === id ? { ...i, quantity: (i.quantity || 0) + quantity } : i
      );
    } else {
      const newProduct = { ...product, id, quantity };
      newItems = [...base, newProduct];
    }

    persist(newItems);
    return true;
  };

  const removeItem = (productId) => {
    const base = getLatestItems();
    const newItems = base.filter(i => (i._id || i.id) !== productId);
    persist(newItems);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeItem(productId);
    const base = getLatestItems();
    const newItems = base.map(i => (i._id || i.id) === productId ? { ...i, quantity } : i);
    persist(newItems);
  };

  const clearCart = () => persist([]);

  const { count, total } = calcularTotales(cartItems);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount: count,
      cartTotal: total,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = { children: PropTypes.node.isRequired };

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (ctx === undefined) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
};
