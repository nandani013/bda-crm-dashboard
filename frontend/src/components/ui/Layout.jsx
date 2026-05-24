import React from 'react';

/**
 * Layout component to wrap page content with consistent padding and scrolling.
 * It provides a flexible container that works well with dark mode.
 */
const Layout = ({ children }) => {
  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto">
      <div className="container mx-auto px-6 py-8">
        {children}
      </div>
    </main>
  );
};

export default Layout;
