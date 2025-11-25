import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useKeycloak } from '@react-keycloak/web'; 

import { SunIcon, BellIcon,XIcon, CartIcon, UserIcon, TrashIcon, CheckCircleIcon, MenuIcon} from '../icons'; 
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
              alt={item.titulo}
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

const NotificationsDropdown = ({ closeDropdown, notifications }) => {
 return (
    <div className="notifications-dropdown">
     <div className="notifications-list">
     {notifications.length > 0 ? (
         notifications.map(notif => (
          <Link
           key={notif.id} 
           to={`/notificationes?id=${notif.id}`} 
           className="notification-item"
           onClick={closeDropdown}
          >
       <div className="notification-icon">
        <CheckCircleIcon className={`icon-md ${!notif.isRead ? 'icon-unread' : 'icon-read'}`} />
       </div>
       <div className="notification-details">
        <p className={`notification-title ${!notif.isRead ? 'title-unread' : 'title-read'}`}>{notif.title}</p>
        <p className="notification-message">{notif.message}</p> 
       </div>
      </Link>
       ))
      ) : (
       <div className="dropdown-empty">No hay notificaciones.</div>
      )}
     </div>
     <div className="dropdown-footer">
     <Link to="/notificationes" onClick={closeDropdown} className="dropdown-link">
     Ver todas las notificaciones
     </Link>
     </div>
    </div>
    );
};
NotificationsDropdown.propTypes = { 
    closeDropdown: PropTypes.func.isRequired,
    notifications: PropTypes.array.isRequired
};

const UserDropdown = ({ closeDropdown }) => {
  
  const { keycloak } = useKeycloak();

  return (
    <div className="user-dropdown">
      <div className="user-dropdown-info">
        <p className="user-info-name">{keycloak.tokenParsed?.name || keycloak.tokenParsed?.preferred_username}</p>
        <p className="user-info-email">{keycloak.tokenParsed?.email}</p>
      </div>
      <div className="user-dropdown-divider"></div>
      <Link to="/ventas" onClick={closeDropdown} className="user-dropdown-link">Mis Ventas</Link>
      <Link to="/pedidos" onClick={closeDropdown} className="user-dropdown-link">Mis Pedidos</Link>
      <div className="user-dropdown-divider"></div>
      
     
      <button 
        onClick={() => {
            closeDropdown();
            keycloak.logout();
        }} 
        className="user-dropdown-link logout-btn"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};
UserDropdown.propTypes = { closeDropdown: PropTypes.func.isRequired, keycloak: PropTypes.object.isRequired};

const MobileMenu = ({ isOpen, closeMenu }) => {
    const { keycloak, initialized } = useKeycloak();
    if (!isOpen) return null;

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
                {!initialized ? (
                    <p style={{padding: '20px', textAlign: 'center'}}>Cargando...</p>
                ) : (
                    <>
                        {keycloak.authenticated && (
                            <>
                                <NavLink to="/ventas" onClick={closeMenu} className={getLinkClass}>Mis Ventas</NavLink>
                                <NavLink to="/pedidos" onClick={closeMenu} className={getLinkClass}>Mis Pedidos</NavLink>
                                <NavLink to="/notificationes" onClick={closeMenu} className={getLinkClass}>Notificaciones</NavLink>
                            </>
                        )}
                    </>
                )}
            </nav>

            <div className="mobile-menu-login">
                {!initialized ? null : ( 
                    !keycloak.authenticated ? (
                    <Button 
                        variant="primary" 
                        className="w-full"
                        onClick={() => {
                            closeMenu();
                            keycloak.login();
                        }} 
                    >
                        Iniciar Sesión
                    </Button>
                ) : (
                    <Button 
                        variant="secondary" 
                        className="w-full"
                        onClick={() => {
                            closeMenu();
                            keycloak.logout();
                        }} 
                    >
                        Cerrar Sesión
                    </Button>
                )
                )}
            </div>
        </div>
    );
};
MobileMenu.propTypes = { 
  isOpen: PropTypes.bool.isRequired, 
  closeMenu: PropTypes.func.isRequired 
};

export const Header = () => {
  const { keycloak, initialized } = useKeycloak();
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const { cartCount } = useCart();
  const dropdownRef = useClickOutside(() => setActiveDropdown(null));
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto' };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (keycloak.authenticated) {
        const cargarNotificaciones = async () => {
            try {
              const data = await getNotificaciones();
              const normalizadas = data.map((n) => ({
                id: n.id || n._id || n.ID || Math.random().toString(36).slice(2),
                isRead: n.isRead ?? n.leida ?? n.read ?? false,
                title: n.title || n.titulo || n.asunto || "Notificación",
                message: n.message || n.mensaje || n.descripcion || "Sin contenido disponible",
              }));
        
              setNotifications(normalizadas);
              const noLeidas = normalizadas.filter(n => !n.isRead).length;
              setUnreadCount(noLeidas);
            } catch (error) {
              console.error("Error al cargar notificaciones:", error);
              setNotifications([]);
              setUnreadCount(0);
            }
          };
          cargarNotificaciones();
    }
  }, [keycloak.authenticated, location]);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };
  
  const closeAll = () => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  }

  const DROPDOWNS = {
    notifications: <NotificationsDropdown closeDropdown={closeAll} notifications={notifications} />,
    cart: <CartDropdown closeDropdown={closeAll} />,
    user: <UserDropdown closeDropdown={closeAll} keycloak={keycloak} />,
 };
  
  const unreadNotifications = unreadCount;

  return (
    <header className="header-main">
      <div className="header-container">
        <div className="header-content">
          <Link to="/" className="logo-link">
            <SunIcon className="logo-icon" />
            <span className="logo-text-desktop">TIENDA SOL</span>
            <span className="logo-text-mobile">SOL</span>
          </Link>
          

              <div className="nav-icons">

                {!initialized && (
                    <div className="nav-skeleton" style={{ width: '100px', height: '40px', background: '#e0e0e0', borderRadius: '4px', opacity: 0.5 }}></div>
                )}
                {initialized && (
        <>
          <div className="nav-icons-desktop">
            {/* Solo mostramos esto si está autenticado */}
            {keycloak.authenticated && (
              <>
                <button onClick={() => toggleDropdown('notifications')} className="icon-button">
                  <BellIcon className="icon-lg" />
                  {unreadNotifications > 0 && (
                    <span className="notification-badge-wrapper">
                      <span className="notification-ping"></span>
                      <span className="notification-badge">{unreadNotifications}</span>
                    </span>
                  )}
                </button>

                <button onClick={() => toggleDropdown('user')} className="icon-button">
                  <UserIcon className="icon-lg" />
                </button>
              </>
            )}
          </div>

          {/* El carrito siempre se muestra, es independiente del login */}
          <button onClick={() => toggleDropdown('cart')} className="icon-button">
            <CartIcon className="icon-lg" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* Botón Iniciar Sesión: Solo si NO está autenticado Y YA inicializó */}
          {!keycloak.authenticated && (
            <div className="header-login-btn-wrapper">
              <Button
                variant="secondary"
                size="sm"
                className="header-login-btn"
                onClick={() => keycloak.login()}
              >
                Iniciar Sesión
              </Button>
            </div>
          )}
        </>
      )}

      <button onClick={() => setIsMobileMenuOpen(true)} className="icon-button mobile-menu-toggle">
        <MenuIcon className="icon-lg" />
      </button>

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