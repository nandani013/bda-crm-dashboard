import React from 'react';

/**
 * Card component with glassmorphism styling.
 * Props:
 *   children: content inside the card
 *   className: optional additional Tailwind classes
 */
const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`backdrop-blur-sm bg-white/30 dark:bg-black/30 rounded-xl shadow-lg p-4 transition-transform duration-200 hover:scale-105 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
