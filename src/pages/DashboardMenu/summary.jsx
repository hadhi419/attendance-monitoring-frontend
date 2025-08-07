import React, { useState } from 'react';
import axios from 'axios';
import AttendanceSummaryChart from '../../components/AttendanceSummaryChart';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

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
        `http://localhost:8080/courses/getCoursesByStudentId/${registrationNumber}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCourses(response.data);
      setResult(null);
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
        `http://localhost:8080/attendance/student/${registrationNumber}/course/${courseCode}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResult(response.data);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError(err);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getChartHeight = () => {
    if (courses.length <= 2) return 'h-64';
    if (courses.length <= 4) return 'h-80';
    return 'h-[30rem]';
  };

  return (
    <motion.div
      className="p-4 sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Registration Input */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Registration Number"
          className="flex-1 border border-gray-300 rounded px-3 py-2 outline-none"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
        />
        <button
          className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 transition-all duration-300"
          onClick={fetchCourses}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Show Summary'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 font-medium mb-4 max-w-full break-words">
          Error: {error.status === 403 ? 'No Summary Found.' : error.message}
        </p>
      )}

      {/* Main Content */}
      {courses.length > 0 && (
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-4 mt-6 w-full">
          {/* Attendance Chart */}
          <AnimatePresence>
            {result && (
              <motion.div
                key="attendance-chart"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="shadow-md rounded-lg p-4 sm:p-6 flex items-center justify-center w-full lg:w-1/3"
                layout
              >
                <div className={`w-full ${getChartHeight()}`}>
                  <AttendanceSummaryChart data={result} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Course List Buttons */}
          <motion.div
            className="rounded-lg p-4 pt-6 w-full lg:w-2/3"
            initial={false}
            animate={{
              width: result ? '100%' : '100%',
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={{ minWidth: 0 }}
            layout
          >
            <div className="space-y-3 max-h-[450px] overflow-y-auto">
              {courses.map((course, index) => (
                <button
                  key={index}
                  className={`w-full text-left border border-gray-300 rounded-lg px-4 py-2 shadow-sm font-medium transition-all duration-300 whitespace-normal truncate
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
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
