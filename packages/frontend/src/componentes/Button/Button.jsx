import React from 'react';
import PropTypes from 'prop-types';
import { SpinnerIcon } from '../icons'; // 1. Importar SpinnerIcon
import './Button.css';

export const Button = (props) => {
  const {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    isLoading = false, // 2. Agregar 'isLoading'
    ...restProps
  } = props;

  const buttonClasses = `btn btn-${variant} btn-${size} ${className}`;

  return (
    <button
      className={buttonClasses.trim()}
      disabled={isLoading} // 3. Deshabilitar si está cargando
      {...restProps}
    >
      {/* 4. Mostrar spinner o children */}
      {isLoading ? <SpinnerIcon className="icon-sm" /> : children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
  isLoading: PropTypes.bool, // 5. Agregar a propTypes
};