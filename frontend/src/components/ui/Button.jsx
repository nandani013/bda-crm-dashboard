import React from 'react';

/**
 * Button component with variants.
 * Props:
 *   children: button label/content
 *   variant: 'primary' | 'secondary'
 *   onClick: handler
 *   className: additional classes
 */
const Button = ({ children, variant = 'primary', onClick, className = '' }) => {
  const base = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-500',
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default Button;
