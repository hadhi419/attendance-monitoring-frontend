import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';

const Sidebar = ({ collapsed, setCollapsed, setIsAuthenticated }) => {
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDashboardMenu = () => {
    setDashboardOpen(!dashboardOpen);
  };

  const toggleAdminMenu = () => {
    setAdminOpen(!adminOpen);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <aside
      className={`
        bg-cyan-800 text-white p-4 transition-all duration-300
        fixed left-0 z-40
        ${collapsed ? 'w-14' : 'w-full md:w-64'}
        md:relative
        flex flex-col
        top-10  md:top-0    
        h-[calc(100vh-20px)] md:h-full  
      `}
    >
      {/* Header with toggle button visible only on md+ */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        {!collapsed && <h2 className="text-lg font-bold md:text-2xl">Admin</h2>}

        {/* Toggle button for md+ screens */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hidden md:inline-block"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <FiMenu size={20} /> : <FiX size={20} />}
        </button>
      </div>

      {/* Navigation: show only if not collapsed */}
      {!collapsed && (
        <nav className="flex-1 overflow-y-auto flex flex-col gap-3 text-sm md:text-lg">
          <Link to="/home" className="hover:underline">
            Home Page
          </Link>

          <div>
            <button
              onClick={toggleDashboardMenu}
              className="flex justify-between items-center w-full hover:underline"
            >
              <span>Dashboard</span>
              {dashboardOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </button>
            {dashboardOpen && (
              <div className="ml-4 mt-2 flex flex-col gap-2 text-sm">
                <Link to="/DashboardMenu/summary" className="hover:underline">
                  Attendance Summary
                </Link>
                <Link to="/DashboardMenu/AttendanceByDate" className="hover:underline">
                  Attendance by Date
                </Link>
                <Link to="/DashboardMenu/AttendanceByCourse" className="hover:underline">
                  Course Attendance
                </Link>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={toggleAdminMenu}
              className="flex justify-between items-center w-full hover:underline"
            >
              <span>Add Users</span>
              {adminOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </button>
            {adminOpen && (
              <div className="ml-4 mt-2 flex flex-col gap-2 text-sm">
                <Link to="/AdminMenu/AddStudent" className="hover:underline">
                  Add Student
                </Link>
                <Link to="/AdminMenu/AddAdmin" className="hover:underline">
                  Add Admin
                </Link>
              </div>
            )}
          </div>

          <Link to="/enroll" className="hover:underline">
            Enroll Students
          </Link>

          <Link to="/record" className="hover:underline">
            Record
          </Link>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="mt-auto text-left text-blue-300 hover:underline"
          >
            Logout
          </button>
        </nav>
      )}
    </aside>
  );
};

export default Sidebar;
