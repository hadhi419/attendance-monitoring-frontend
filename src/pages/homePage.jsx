import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
  const navigate = useNavigate();

  const widgets = [
    {
      title: 'Record Attendance',
      description: 'Quickly record attendance for students in selected courses.',
      route: '/record',
      color: 'bg-purple-900',
      isLarge: true,
    },
    {
      title: 'Attendance Summary',
      description: 'View attendance summary by student and course.',
      route: '/DashboardMenu/summary',
      color: 'bg-cyan-500',
    },
    {
      title: 'Attendance by Date',
      description: 'Check attendance records on a specific date.',
      route: '/DashboardMenu/AttendanceByDate',
      color: 'bg-green-500',
    },
    {
      title: 'Course Attendance',
      description: 'Explore course-wise attendance details.',
      route: '/DashboardMenu/AttendanceByCourse',
      color: 'bg-yellow-500',
    },
  ];

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map((widget, index) => (
          <motion.div
            key={index}
            onClick={() => navigate(widget.route)}
            className={`cursor-pointer ${widget.color} text-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300
              ${widget.isLarge ? 'sm:col-span-2 lg:col-span-3 text-center' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <h2 className="text-2xl font-bold mb-2">{widget.title}</h2>
            <p className="text-md opacity-90">{widget.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HomePage;
