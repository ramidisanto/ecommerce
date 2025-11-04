import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SunIcon, BellIcon, CartIcon, UserIcon, SearchIcon, TrashIcon, CheckCircleIcon } from '../icons'; 
import { useCart } from '../Context/CartContext'; 
import { MOCK_NOTIFICATIONS } from '../../mockData/data'; 
import { Button } from '../Button/Button'; 

import './Header.css'; 

const useClickOutside = (handler) => {
  const ref = useRef(null); 
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
  return ref;
};

// --- Dropdown del Carrito ---
const CartDropdown = () => {
  const { cartItems, cartTotal, updateQuantity, removeItem } = useCart();

  if (cartItems.length === 0) {
    return <div className="dropdown-empty">Tu carrito está vacío.</div>;
  }

  return (
    <div className="cart-dropdown">
      <div className="cart-dropdown-list">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.photos[0]} alt={item.title} className="cart-item-img" />
            <div className="cart-item-details">
              <p className="cart-item-title">{item.title}</p>
              <p className="cart-item-price">${item.price.toFixed(2)}</p>
              <div className="cart-item-quantity">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
            </div>
            <div className="cart-item-subtotal">
              <p>${(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => removeItem(item.id)} className="cart-item-remove">
                <TrashIcon className="icon-xs" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="dropdown-footer">
        <p className="cart-total">Total: ${cartTotal.toFixed(2)}</p>
        <div className="dropdown-actions">
          <Link to="/carrito" className="w-full">
            <Button variant="secondary" className="w-full">Ver Carrito</Button>
          </Link>
          <Link to="/checkout" className="w-full">
            <Button variant="primary" className="w-full">Iniciar Compra</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// --- Dropdown de Notificaciones ---
const NotificationsDropdown = () => {
  // (El useState se queda igual)
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  return (
    <div className="notifications-dropdown">
      <div className="notifications-list">
        {notifications.map(notif => {
            // Clases para el estilo (igual que antes)
            const titleClasses = `notification-title ${notif.isRead ? 'title-read' : 'title-unread'}`;
            
            return (
              // --- ESTE ES EL CAMBIO ---
              // Convertimos el <div> en un <Link>
              <Link
                key={notif.id}
                to={`/notificationes?id=${notif.id}`} 
                className="notification-item" 
              >
                <div className="notification-icon">
                  <CheckCircleIcon className={`icon-md ${notif.isRead ? 'icon-read' : 'icon-unread'}`} />
                </div>
                <div className="notification-details">
                  <p className={titleClasses}>{notif.title}</p>
                  <p className="notification-message">{notif.message}</p>
                </div>
              </Link>
              // --- FIN DEL CAMBIO ---
            );
        })}
      </div>
      <div className="dropdown-footer">
        <Link to="/notificationes" className="dropdown-link">
          Ver todas las notificaciones
        </Link>
      </div>
    </div>
  );
};

// --- Dropdown de Usuario ---
const UserDropdown = () => {
  return (
    <div className="user-dropdown">
      <Link to="/ventas" className="user-dropdown-link">Mis Ventas</Link>
      <Link to="/pedidos" className="user-dropdown-link">Mis Pedidos</Link>
      <a href="#" className="user-dropdown-link">Perfil</a>
      <div className="dropdown-divider"></div>
      <a href="#" className="user-dropdown-link link-danger">Cerrar Sesión</a>
    </div>
  );
};

// --- Componente Header Principal ---
export const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null); // Se saca <string | null>
  const { cartCount } = useCart();
  const dropdownRef = useClickOutside(() => setActiveDropdown(null));

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const DROPDOWNS = {
    notifications: <NotificationsDropdown />,
    cart: <CartDropdown />,
    user: <UserDropdown />,
  };

  return (
    <header className="header-main">
      <div className="header-container">
        <div className="header-content">
          
          <Link to="/" className="logo-link">
            <SunIcon className="logo-icon" />
            <span>SOL</span>
          </Link>

          <div className="nav-icons">
            <div className="icon-button-wrapper">
              <button onClick={() => toggleDropdown('notifications')} className="icon-button">
                <BellIcon className="icon-lg" />
                <span className="notification-badge-wrapper">
                  <span className="notification-ping"></span>
                  <span className="notification-badge">
                    {MOCK_NOTIFICATIONS.filter(n => !n.isRead).length}
                  </span>
                </span>
              </button>
            </div>

            <div className="icon-button-wrapper">
              <button onClick={() => toggleDropdown('cart')} className="icon-button">
                <CartIcon className="icon-lg" />
                {cartCount > 0 && (
                  <span className="cart-badge">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            <div className="icon-button-wrapper">
              <button onClick={() => toggleDropdown('user')} className="icon-button">
                <UserIcon className="icon-lg" />
              </button>
            </div>

            {activeDropdown && (
              <div ref={dropdownRef} className="dropdown-menu">
                {DROPDOWNS[activeDropdown]}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};