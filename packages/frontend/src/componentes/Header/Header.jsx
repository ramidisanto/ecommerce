import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { SunIcon, BellIcon,XIcon, CartIcon, UserIcon, SearchIcon, TrashIcon, CheckCircleIcon, MenuIcon} from '../icons'; 
import { useCart } from '../Context/CartContext'; 
import { Button } from '../Button/Button'; 
//import { getNotificaciones } from '../../services/notificacionService';
import { MOCK_NOTIFICATIONS } from '../../mockData/data';
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

const CartDropdown = ({ closeDropdown }) => {
  const { cartItems, cartTotal, updateQuantity, removeItem } = useCart();
  if (cartItems.length === 0) {
    return <div className="dropdown-empty">Tu carrito está vacío.</div>;
  }
  return (
    <div className="cart-dropdown">
      <div className="cart-dropdown-list">
    
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            
            <img 
              src={item.fotos && item.fotos.length > 0 ? item.fotos[0] : "/images/LOGOSOL.png"} 
              alt={item.titulo} // <-- CAMBIO 2: 'item.title' -> 'item.titulo'
              className="cart-item-img" 
            />

            <div className="cart-item-details">
              
              <p className="cart-item-title">{item.titulo}</p>

              <p className="cart-item-price">${item.precio.toFixed(2)}</p>

              <div className="cart-item-quantity">
  
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
            </div>
            <div className="cart-item-subtotal">
        
              <p>${(item.precio * item.quantity).toFixed(2)}</p>

              <button onClick={() => removeItem(item.id)} className="cart-item-remove">
                <TrashIcon className="icon-xs" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="dropdown-footer">
        {/* 'cartTotal' ya viene bien calculado desde tu Context */}
        <p className="cart-total">Total: ${cartTotal.toFixed(2)}</p>
        <div className="dropdown-actions">
          <Link to="/carrito" onClick={closeDropdown} className="w-full">
            <Button variant="secondary" className="w-full">Ver Carrito</Button>
          </Link>
          <Link to="/checkout" onClick={closeDropdown} className="w-full">
            <Button variant="primary" className="w-full">Iniciar Compra</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
CartDropdown.propTypes = { closeDropdown: PropTypes.func.isRequired };

const NotificationsDropdown = ({ closeDropdown }) => {
  const [notifications] = useState(MOCK_NOTIFICATIONS);
  return (
    <div className="notifications-dropdown">
      <div className="notifications-list">
        {notifications.map(notif => (
          <div key={notif.id} className="notification-item">
            <div className="notification-icon">
              <CheckCircleIcon className={`icon-md ${notif.isRead ? 'icon-read' : 'icon-unread'}`} />
            </div>
            <div className="notification-details">
              <p className={`notification-title ${notif.isRead ? 'title-read' : 'title-unread'}`}>{notif.title}</p>
              <p className="notification-message">{notif.message}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="dropdown-footer">
        <Link to="/notificationes" onClick={closeDropdown} className="dropdown-link">
          Ver todas las notificaciones
        </Link>
      </div>
    </div>
  );
};
NotificationsDropdown.propTypes = { closeDropdown: PropTypes.func.isRequired };

const UserDropdown = ({ closeDropdown }) => {
  return (
    <div className="user-dropdown">
      <Link to="/ventas" onClick={closeDropdown} className="user-dropdown-link">Mis Ventas</Link>
      <Link to="/pedidos" onClick={closeDropdown} className="user-dropdown-link">Mis Pedidos</Link>
      <a href="#" onClick={closeDropdown} className="user-dropdown-link">Perfil</a>
      <div className="dropdown-divider"></div>
      <a href="#" onClick={closeDropdown} className="user-dropdown-link link-danger">Cerrar Sesión</a>
    </div>
  );
};

const MobileMenu = ({ isOpen, closeMenu }) => {
    if (!isOpen) return null;

    // Usamos NavLink para que el link activo se pinte
    const getLinkClass = ({ isActive }) => {
      return `mobile-nav-link ${isActive ? 'active' : ''}`;
    };

    return (
        <div className="mobile-menu-overlay" role="dialog" aria-modal="true">
            <div className="mobile-menu-header">
                <Link to="/" onClick={closeMenu} className="logo-link">
                    <SunIcon className="logo-icon" />
                    <span>SOL</span>
                </Link>
                <button onClick={closeMenu} className="icon-button" aria-label="Cerrar menú">
                    <XIcon className="icon-lg" />
                </button>
            </div>
            <nav className="mobile-menu-nav">
                <NavLink to="/ventas" onClick={closeMenu} className={getLinkClass}>Mis Ventas</NavLink>
                <NavLink to="/pedidos" onClick={closeMenu} className={getLinkClass}>Mis Pedidos</NavLink>
                <NavLink to="/notificationes" onClick={closeMenu} className={getLinkClass}>Notificaciones</NavLink>
            </nav>
        </div>
    );
};
MobileMenu.propTypes = { 
  isOpen: PropTypes.bool.isRequired, 
  closeMenu: PropTypes.func.isRequired 
};

export const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Estado para menú móvil
  const { cartCount } = useCart();
  const dropdownRef = useClickOutside(() => setActiveDropdown(null));
  
  // Bloquea el scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto' };
  }, [isMobileMenuOpen]);



  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };
  
  // Cierra todo (dropdowns y menú móvil)
  const closeAll = () => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  }

  const DROPDOWNS = {
      notifications: <NotificationsDropdown closeDropdown={closeAll} />,
      cart: <CartDropdown closeDropdown={closeAll} />,
      user: <UserDropdown closeDropdown={closeAll} />,
  };
  
  const unreadNotifications = MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;

  return (
    <header className="header-main">
      <div className="header-container">
        <div className="header-content">
          <Link to="/" className="logo-link">
            <SunIcon className="logo-icon" />
            <span className="logo-text-desktop">TIENDA SOL</span>
            <span className="logo-text-mobile">SOL</span>
          </Link>

          <div className="search-bar-container">
            <div className="search-bar-wrapper">
              <input
                type="text"
                placeholder="Ej. cyber monday"
                className="search-input"
                aria-label="Buscar productos"
              />
              <SearchIcon className="search-icon" />
            </div>
          </div>

          <div className="nav-icons">
            {/* Iconos de Desktop (se ocultan en móvil) */}
            <div className="nav-icons-desktop">
              <button onClick={() => toggleDropdown('notifications')} className="icon-button" aria-label={`Notificaciones (${unreadNotifications} no leídas)`}>
                <BellIcon className="icon-lg" />
                {unreadNotifications > 0 &&
                  <span className="notification-badge-wrapper">
                      <span className="notification-ping"></span>
                      <span className="notification-badge">
                          {unreadNotifications}
                      </span>
                  </span>
                }
              </button>
              <button onClick={() => toggleDropdown('user')} className="icon-button" aria-label="Menú de usuario">
                <UserIcon className="icon-lg" />
              </button>
            </div>
            
            <button onClick={() => toggleDropdown('cart')} className="icon-button" aria-label={`Carrito de compras (${cartCount} items)`}>
              <CartIcon className="icon-lg" />
              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount}
                </span>
              )}
            </button>

            <button onClick={() => setIsMobileMenuOpen(true)} className="icon-button mobile-menu-toggle" aria-label="Abrir menú de navegación">
              <MenuIcon className="icon-lg" />
            </button>

             {/* Contenedor de Dropdowns (sin cambios) */}
             {activeDropdown && (
                <div 
                    ref={dropdownRef}
                    className="dropdown-menu"
                >
                    {DROPDOWNS[activeDropdown]}
                </div>
              )}
          </div>
        </div>
      </div>
      <MobileMenu isOpen={isMobileMenuOpen} closeMenu={closeAll} />
    </header>
  );
};