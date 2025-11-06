import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XIcon } from '../icons';

const ICONS = {
    success: <CheckCircleIcon className="toast-icon success" />,
    error: <ExclamationCircleIcon className="toast-icon error" />,
    info: <InformationCircleIcon className="toast-icon info" />,
};

const TOAST_DURATION = 5000; 

export const Toast = ({ notification, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, TOAST_DURATION);

    return () => clearTimeout(timer);
  }, [notification.id]);
  
  const handleDismiss = () => {
      setIsExiting(true);
      setTimeout(() => onDismiss(notification.id), 300); 
  }

  const toastClass = `toast-item ${isExiting ? 'animate-fade-out' : 'animate-fade-in'}`;

  return (
    <div
      className={toastClass}
      role="alert"
      aria-live="assertive"
    >
      <div className="toast-icon-wrapper">
        {ICONS[notification.type]}
      </div>
      <div className="toast-content">
        <p className="toast-message">{notification.message}</p>
      </div>
      <div className="toast-close-wrapper">
        <button
            onClick={handleDismiss}
            className="toast-close-button"
            aria-label="Cerrar notificación"
        >
          <XIcon className="icon-sm" />
        </button>
      </div>
    </div>
  );
};

Toast.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'info']).isRequired,
  }).isRequired,
  onDismiss: PropTypes.func.isRequired,
};