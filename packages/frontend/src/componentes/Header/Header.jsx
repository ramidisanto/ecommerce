import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
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
  return (
    <div className="user-dropdown">
      <Link to="/ventas" onClick={closeDropdown} className="user-dropdown-link">Mis Ventas</Link>
      <Link to="/pedidos" onClick={closeDropdown} className="user-dropdown-link">Mis Pedidos</Link>
    </div>
  );
};

const MobileMenu = ({ isOpen, closeMenu }) => {
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
}, []);
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
    user: <UserDropdown closeDropdown={closeAll} />,
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