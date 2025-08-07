import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-2xl shadow-gray-800/60 z-20 relative px-6 py-4 w-full flex justify-between items-center">
      <h1 className="text-2xl font-bold text-cyan-900">Attendance Monitoring System</h1>
      <ul className="flex space-x-5">
        <li>
          <button
            onClick={handleLogout}
            className="text-blue-900 hover:underline bg-none border-none p-0 text-left"
          >
            Logout
          </button>
        </li>
      </ul>
    </header>
  );
};

export default Navbar;
