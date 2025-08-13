import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = ({ setIsAuthenticated, onToggleSidebar, collapsed }) => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="relative z-50">
      <header className="bg-white shadow-2xl shadow-gray-800/60 z-20 relative px-6 py-4 w-full h-12 md:h-16 flex justify-between items-center">
        <button
          onClick={onToggleSidebar}
          className="text-cyan-900 md:hidden mr-4"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <FiMenu size={20} /> : <FiX size={20}/> }
        </button>

        <h1 className="text-100 font-bold text-cyan-900 md:text-2xl flex-grow">
          Attendance Monitoring System
        </h1>

        <ul className="flex space-x-5">
          <li>
            <button
              onClick={handleLogout}
              className="text-blue-900 text-xs md:text-lg hover:underline bg-none border-none p-0 text-left"
            >
              Logout
            </button>
          </li>
        </ul>
      </header>
    </div>
  );
};

export default Navbar;
