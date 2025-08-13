import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = ({ setIsAuthenticated }) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-neutral-100">
      <Navbar
        setIsAuthenticated={setIsAuthenticated}
        onToggleSidebar={() => setCollapsed(!collapsed)}
        collapsed={collapsed}
      />

      <div className="flex flex-1 overflow-hidden relative pt-16 md:pt-0">
        {/* Added pt-16 (64px) padding top on small screens to offset Navbar height */}

        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setIsAuthenticated={setIsAuthenticated}
        />

        <main
          className={`
            flex-1 bg-neutral-50 transition-all duration-300
            md:ml-0
            ${collapsed ? 'ml-0 md:ml-14' : 'ml-64'}
            overflow-y-auto
            px-6 py-4
          `}
          style={{ marginLeft: collapsed ? '40px' : '   10px' }}
        >
          <Outlet />
        </main>
      </div>
    </div>

  );
};

export default MainLayout;
