import React from 'react';
import { useNotification } from '../Context/NotificationContext';
import { Toast } from './Toast';
import './Toast.css'; 

export const ToastContainer = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div
      aria-live="polite"
      className="toast-container-wrapper"
    >
      <div className="toast-container">
        {notifications.map(notification => (
          <Toast
            key={notification.id}
            notification={notification}
            onDismiss={removeNotification}
          />
        ))}
      </div>
    </div>
  );
};
