import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';


export const Button = (props) => {
  
  const {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...restProps 
  } = props;

 
  const buttonClasses = `btn btn-${variant} btn-${size} ${className}`;
  return (
    <button
      className={buttonClasses.trim()}
      {...restProps} 
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