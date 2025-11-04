import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

// MODO ALTERNATIVO (para evitar el error del linter)
// 1. Recibimos 'props' como un solo objeto
export const Button = (props) => {
  
  // 2. Y "destructuramos" (separamos) las props aquí adentro
  const {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...restProps // 3. Renombramos 'props' a 'restProps' para evitar conflictos
  } = props;

  // El resto del código es igual, solo asegurate de que la plantilla esté en una línea
  // o que los espacios estén bien. Así es más seguro:
  const buttonClasses = `btn btn-${variant} btn-${size} ${className}`;
  return (
    <button
      className={buttonClasses.trim()}
      {...restProps} // 4. Pasamos el resto de las props (ej: onClick, type, disabled)
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
};