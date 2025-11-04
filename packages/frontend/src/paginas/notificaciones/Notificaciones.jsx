import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MOCK_NOTIFICATIONS } from '../../mockData/data'; 
import { ChevronLeftIcon, BellIcon } from '../../componentes/icons'; 
import { Button } from '../../componentes/Button/Button'; 
import './Notificaciones.css'; 

export const Notificaciones = () => {
    // Quitamos todos los tipos de los 'useState'
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [filter, setFilter] = useState('all');


    const [searchParams] = useSearchParams();

    // Quitamos el tipo de 'id'
    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id && !n.isRead ? { ...n, isRead: true, readDate: new Date().toISOString() } : n))
        );
    };

    // Quitamos el tipo de 'id'
    const handleSelectNotification = (id) => {
        const notification = notifications.find(n => n.id === id);
        if (notification) {
            setSelectedNotification(notification);
            if (!notification.isRead) {
                markAsRead(id);
            }
        }
    };
    
    const markAllAsRead = () => {
        setNotifications(
            notifications.map(n => ({ ...n, isRead: true, readDate: n.isRead ? n.readDate : new Date().toISOString() }))
        );
    };

    // Cuando conectes tu API, este 'useEffect' va a buscar
    // los datos de 'usuarios/:id/notificaciones' y hará un 'setNotifications(datos)'
    useEffect(() => {
        // Leemos el parámetro 'id' de la URL (ej: ?id=notif-1)
        const idFromUrl = searchParams.get('id');

        if (idFromUrl) {
            // Si la URL trae un ID, buscamos esa notificación y la seleccionamos
            const notificationFromUrl = notifications.find(n => n.id === idFromUrl);
            if (notificationFromUrl) {
                handleSelectNotification(notificationFromUrl.id);
            }
        } else {
            // Si la URL no trae ID (es solo /notifications), hacemos lo de antes:
            // mostramos la primera no leída.
            const firstUnread = notifications.find(n => !n.isRead);
            if (firstUnread) {
                handleSelectNotification(firstUnread.id);
            } else if (notifications.length > 0) {
                setSelectedNotification(notifications[0]);
            }
        }
        // Agregamos 'searchParams' a las dependencias
    }, [notifications, searchParams]); 

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.isRead)
        : notifications;

  return (
    <div className="notifications-container">
        <div className="notifications-header">
            <Link to="/" className="header-back-link">
                <ChevronLeftIcon className="icon-md" />
            </Link>
            <h1 className="header-title">Notificaciones</h1>
        </div>
        
        <div className="notifications-layout">
            {/* --- Barra Lateral (Lista) --- */}
            <div className="notifications-sidebar">
                <div className="sidebar-actions">
                    <Button onClick={markAllAsRead} variant="secondary" size="sm">
                        Marcar todas como leídas
                    </Button>
                    <div className="sidebar-filters">
                        <Button onClick={() => setFilter('all')} variant={filter === 'all' ? 'primary' : 'ghost'} size="sm" className="w-full">
                            Todas
                        </Button>
                         <Button onClick={() => setFilter('unread')} variant={filter === 'unread' ? 'primary' : 'ghost'} size="sm" className="w-full">
                            No leídas
                        </Button>
                    </div>
                </div>
                <div className="sidebar-list">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map(notification => {
                            // Definimos las clases condicionales
                            const itemClasses = `
                                notification-list-item 
                                ${selectedNotification?.id === notification.id ? 'selected' : ''}
                            `;
                            const titleClasses = `
                                item-title 
                                ${notification.isRead ? 'read' : 'unread'}
                            `;

                            return (
                               <button 
                                    key={notification.id}
                                    onClick={() => handleSelectNotification(notification.id)}
                                    className={itemClasses}
                                >
                                    <div className="item-content-wrapper">
                                        {!notification.isRead && (
                                            <div className="item-status-dot"></div>
                                        )}
                                        <div className={`item-details ${notification.isRead ? 'read' : ''}`}>
                                            <p className={titleClasses}>{notification.title}</p>
                                            <p className="item-message">{notification.message}</p>
                                            <p className="item-date">{new Date(notification.creationDate).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <p className="sidebar-empty">No hay notificaciones.</p>
                    )}
                </div>
            </div>

            {/* --- Panel de Contenido --- */}
            <div className="notification-content">
                {selectedNotification ? (
                    <div>
                        <div className="content-header">
                            <h2 className="content-title">{selectedNotification.title}</h2>
                            <p className="content-date">{new Date(selectedNotification.creationDate).toLocaleString()}</p>
                        </div>
                        <div className="content-body">
                            <p>{selectedNotification.message}</p>
                        </div>
                        {selectedNotification.isRead && selectedNotification.readDate && (
                            <p className="content-read-date">
                                Leída el {new Date(selectedNotification.readDate).toLocaleString()}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="content-empty-state">
                        <BellIcon className="empty-state-icon" />
                        <h3 className="empty-state-title">Selecciona una notificación</h3>
                        <p>Elige una notificación de la lista para ver los detalles.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default Notificaciones;