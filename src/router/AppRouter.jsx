// src/router/AppRouter.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import Dashboard from '../pages/Dashboard';
import HomePage from '../pages/homePage';
import AdminPanel from '../pages/AdminPanel';
import Login from '../pages/Login';
import Record from '../pages/Record';
import PrivateRoute from '../utils/privateRoute';
import Summary from '../pages/DashboardMenu/summary';
import ByDate from '../pages/DashboardMenu/ByDate';
import AttendanceByCourse from '../pages/DashboardMenu/AttendanceByCourse';
import AddStudent from '../pages/AdminMenu/AddStudent';
import AddAdmin from '../pages/AdminMenu/AddAdmin';
import Enroll from '../pages/enroll';

const AppRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('token_expiration');
    const now = Date.now();

    if (token && expiration && now < parseInt(expiration, 10)) {
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('token_expiration');
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Login route with redirect if already authenticated */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />

        {/* Protected Routes */}
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/" element={<MainLayout setIsAuthenticated={setIsAuthenticated}/>}>
            <Route index element={<HomePage />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path="record" element={<Record />} />

            <Route path="DashboardMenu/summary" element={<Summary />} />
            <Route path="home" element={<HomePage />} />
            <Route path="DashboardMenu/AttendanceByDate" element={<ByDate />} />
            <Route path="DashboardMenu/AttendanceByCourse" element={<AttendanceByCourse />} />
            <Route path="AdminMenu/AddStudent" element={<AddStudent />} />
            <Route path="AdminMenu/AddAdmin" element={<AddAdmin />} />
            <Route path="/enroll" element={<Enroll />} />
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
