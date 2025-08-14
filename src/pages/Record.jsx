import React, { useState } from 'react';
import axios from 'axios';
import AttendanceRecorder from '../components/AttendanceRecorder';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ClipLoader } from 'react-spinners';
import { motion } from 'framer-motion';

const Record = () => {
  const [courseCode, setCourseCode] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    if (!courseCode) {
      alert("Please enter a course code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://backend-repo-crimson-dream-9959.fly.dev/students/course/${courseCode}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudents(response.data);
    } catch (error) {
      setError("Failed to load students. Please check the course code or server status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-full">
      {/* Input row */}
      <div className="flex flex-col md:flex-row gap-3 mb-4 w-full">
        <input
          type="text"
          placeholder="Course Code"
          className="flex-grow border border-gray-300 rounded px-3 py-2 outline-none"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
        />
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="w-full md:w-40 border border-gray-300 rounded px-3 py-2 outline-none"
          dateFormat="yyyy-MM-dd"
        />
        <button
          className="w-full md:w-32 h-10 bg-cyan-500 text-white px-4 py-2 rounded hover:bg-green-600 hover:rounded-xl transition-all duration-300"
          onClick={fetchStudents}
        >
          Fetch Students
        </button>
      </div>

      {/* Loading spinner */}
      {loading && (
        <div className="flex justify-center my-4">
          <ClipLoader color="#06b6d4" size={35} />
        </div>
      )}

      {/* Error message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Attendance table */}
      <motion.div
        className="p-4 sm:p-6 overflow-x-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {students.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <div className="max-w-screen-lg mx-auto">
              <AttendanceRecorder
                students={students}
                courseCode={courseCode}
                selectedDate={selectedDate}
              />
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm sm:text-base text-center">
            No students loaded yet. Please enter a course code and click "Fetch Students".
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Record;
