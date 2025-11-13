import React from 'react';
import PropTypes from 'prop-types';
import { SpinnerIcon } from '../icons'; 
import './Button.css';

export const Button = (props) => {
  const {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    isLoading = false, 
    ...restProps
  } = props;

  const buttonClasses = `btn btn-${variant} btn-${size} ${className}`;

  return (
    <button
      className={buttonClasses.trim()}
      disabled={isLoading} 
      {...restProps}
    >
      {isLoading ? <SpinnerIcon className="icon-sm" /> : children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
  isLoading: PropTypes.bool, 
};