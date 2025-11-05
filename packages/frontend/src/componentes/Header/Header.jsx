import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SunIcon, BellIcon, CartIcon, UserIcon, SearchIcon, TrashIcon, CheckCircleIcon } from '../icons'; 
import { useCart } from '../Context/CartContext'; 
import { Button } from '../Button/Button'; 
import { getNotificaciones } from '../../services/notificacionService';

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

const CartDropdown = () => {
  const { cartItems, cartTotal, updateQuantity, removeItem } = useCart();

  if (cartItems.length === 0) {
    return <div className="dropdown-empty">Tu carrito está vacío.</div>;
  }

  return (
    <div className="cart-dropdown">
      <div className="cart-dropdown-list">
        {cartItems.map(item => {
          
          const imagenProducto = item.fotos && item.fotos.length > 0
            ? item.fotos[0]
            : "/images/LOGOSOL.png";

          return (
            <div key={item.id || item._id} className="cart-item">
              
              <img src={imagenProducto} alt={item.titulo} className="cart-item-img" />
              
              <div className="cart-item-details">

                <p className="cart-item-title">{item.titulo}</p>
                
                <p className="cart-item-price">${item.precio.toFixed(2)}</p>
                
                <div className="cart-item-quantity">
                  <button onClick={() => updateQuantity(item.id || item._id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id || item._id, item.quantity + 1)}>+</button>
                </div>
              </div>
              <div className="cart-item-subtotal">
                <p>${(item.precio * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeItem(item.id || item._id)} className="cart-item-remove">
                  <TrashIcon className="icon-xs" />
                </button>
              </div>
            </div>
          );
        })}
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

const NotificationsDropdown = ({ onDropdownToggle }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getNotificaciones(false)
      .then(notifs => {
        if (Array.isArray(notifs)) {
          setNotifications(notifs);
        } else {
          setNotifications([]); 
        }
      })
      .catch(err => {
        console.error("Error en dropdown de notificaciones:", err);
        setNotifications([]); 
      });
  }, []); 

  const handleLinkClick = () => {
    if (onDropdownToggle) {
      onDropdownToggle(null);
    }
  };

  return (
    <div className="notifications-dropdown">
      <div className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map(notif => {
            const titleClasses = `notification-title ${notif.isRead ? 'title-read' : 'title-unread'}`;
            
            return (
              <Link
                key={notif.id}
                to={`/notificationes?id=${notif.id}`} 
                className="notification-item" 
                onClick={handleLinkClick} 
              >
                <div className="notification-icon">
                  <CheckCircleIcon className={`icon-md ${notif.isRead ? 'icon-read' : 'icon-unread'}`} />
                </div>
                <div className="notification-details">
                  <p className={titleClasses}>{notif.title}</p>
                  <p className="notification-message">{notif.message}</p>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="dropdown-empty">No hay notificaciones nuevas.</p>
        )}
      </div>
      <div className="dropdown-footer">
        <Link 
          to="/notificationes" 
          className="dropdown-link" 
          onClick={handleLinkClick} 
        >
          Ver todas las notificaciones
        </Link>
      </div>
    </div>
  );
};

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

export const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { cartCount } = useCart();
  const dropdownRef = useClickOutside(() => setActiveDropdown(null));
  
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    getNotificaciones(false)
      .then(notifs => {
        if (Array.isArray(notifs)) {
          setUnreadCount(notifs.length);
        } else {
          setUnreadCount(0); 
        }
      })
      .catch(err => {
        console.error("Error contando notificaciones:", err);
        setUnreadCount(0); 
      });
  }, [activeDropdown]); 

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const DROPDOWNS = {
    notifications: <NotificationsDropdown onDropdownToggle={setActiveDropdown} />,
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
                {unreadCount > 0 && (
                  <span className="notification-badge-wrapper">
                    <span className="notification-ping"></span>
                    <span className="notification-badge">
                      {unreadCount}
                    </span>
                  </span>
                )}
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