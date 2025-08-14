import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AttendanceSummaryChart from '../../components/AttendanceSummaryChart';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchCourses = async () => {
    if (!registrationNumber.trim()) {
      setError(new Error('Registration Number cannot be empty!'));
      return;
    }

    setLoading(true);
    setError(null);
    setCourses([]);
    setResult(null);
    setSelectedCourse(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://backend-repo-crimson-dream-9959.fly.dev/courses/getCoursesByStudentId/${registrationNumber}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourses(response.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (registrationNumber, courseCode) => {
    setSelectedCourse(courseCode);
    setLoading(true);
    setResult(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://backend-repo-crimson-dream-9959.fly.dev/attendance/student/${registrationNumber}/course/${courseCode}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError(err);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Chart height adjusts dynamically for mobile vs desktop
  const getChartHeightClass = () => {
    if (isMobile) return 'h-auto'; // dynamic height on mobile
    if (courses.length <= 2) return 'h-64';
    if (courses.length <= 4) return 'h-80';
    return 'h-[30rem]';
  };

  return (
    <motion.div
      className="p-4 sm:p-6 max-w-screen-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Registration Input */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Registration Number"
          className="flex-1 border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-600"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
          aria-label="Registration Number"
        />
        <button
          className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={fetchCourses}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Show Summary'}
        </button>
      </div>

      {/* Error Message */}
      {error && !result && courses.length === 0 && (
        <p className="text-red-500 font-medium mb-4 max-w-full break-words text-center sm:text-left">
          Error: {error.status === 403 ? 'No Summary Found.' : error.message}
        </p>
      )}

      {/* Courses and Chart */}
     <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 w-full">
  {/* Course List */}
  <motion.div className="rounded-lg p-2 sm:p-4 w-full lg:w-2/3 overflow-y-auto">
    <div className="space-y-2">
      {courses.map((course, index) => (
        <button
          key={index}
          className={`w-full text-left border border-gray-300 rounded-lg px-3 py-2 shadow-sm font-medium transition-all duration-300 whitespace-normal truncate
            ${
              selectedCourse === course.course_code
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-green-500 hover:text-white'
            }`}
          onClick={() => fetchData(registrationNumber, course.course_code)}
        >
          {course.course_code} - {course.course_name}
        </button>
      ))}
    </div>
  </motion.div>

  {/* Chart */}
  {result && (
    <motion.div className="rounded-lg p-2 sm:p-4 w-full lg:w-1/3 flex-shrink-0">
      <div className="w-full min-h-0">
        <AttendanceSummaryChart data={result} />
      </div>
    </motion.div>
  )}
</div>

    </motion.div>
  );
};

export default Dashboard;
