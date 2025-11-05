import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getNotificaciones, marcarNotificacionComoLeida } from '../../services/notificacionService';
import { ChevronLeftIcon, BellIcon } from '../../componentes/icons';
import { Button } from '../../componentes/Button/Button';
import './Notificaciones.css';
import { Spinner } from 'react-bootstrap';

export const Notificaciones = () => {
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [filter, setFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchParams] = useSearchParams();

    useEffect(() => {
        setIsLoading(true);
        getNotificaciones()
            .then(data => {
                setNotifications(data);

                const idFromUrl = searchParams.get('id');
                let notificationToSelect = null;

                if (idFromUrl) {
                    notificationToSelect = data.find(n => n.id === idFromUrl);
                }

                if (!notificationToSelect) {
                    notificationToSelect = data.find(n => !n.isRead) || data[0];
                }

                if (notificationToSelect) {
                    handleSelectNotification(notificationToSelect.id, data);
                }
            })
            .catch(err => {
                console.error(err);
                setError("No se pudiero cargar las notificaciones.");
            })
            .finally(() => setIsLoading(false));
    }, [searchParams]);


    const markAsRead = async (id, currentNotifications) => {
        try {
            const updatedNotification = await marcarNotificacionComoLeida(id);

            const updatedList = currentNotifications.map(n =>
                n.id === id ? updatedNotification : n
            );
            setNotifications(updatedList);
            setSelectedNotification(updatedNotification);

        } catch (err) {
            console.error("Error al marcar como leída:", err);
        }
    };

    const handleSelectNotification = (id, notificationList) => {
        const list = notificationList || notifications;
        const notification = list.find(n => n.id === id);

        if (notification) {
            setSelectedNotification(notification);
            if (!notification.isRead) {
                markAsRead(id, list);
            }
        }
    };

    const markAllAsRead = async () => {
        setIsLoading(true);
        const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);

        try {
            await Promise.all(
                unreadIds.map(id => marcarNotificacionComoLeida(id))
            );
            const data = await getNotificaciones();
            setNotifications(data);
            setSelectedNotification(data.find(n => n.id === selectedNotification?.id) || data[0]);
        } catch (err) {
            console.error("Error marcando todas como leídas:", err);
        } finally {
            setIsLoading(false);
        }
    };

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
                <div className="notifications-sidebar">
                    <div className="sidebar-actions">
                        <Button onClick={markAllAsRead} variant="secondary" size="sm" disabled={isLoading}>
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
                        {isLoading ? (
                            <div className="sidebar-empty">
                                <Spinner animation="border" size="sm" />
                            </div>
                        ) : error ? (
                            <p className="sidebar-empty" style={{ color: 'red' }}>{error}</p>
                        ) : filteredNotifications.length > 0 ? (
                            filteredNotifications.map(notification => {
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