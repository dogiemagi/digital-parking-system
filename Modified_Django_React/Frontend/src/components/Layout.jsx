import React from "react";

function Layout({ children }) {
  return (
    <div>
      {/* Main content area, equivalent to {% block content %} in Flask */}
      <main>
        {children}
      </main>
    </div>
  );
}

export default Layout;
