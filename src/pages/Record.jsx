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
  const [selectedDate, setSelectedDate] = useState(new Date()); // 🟡 Date
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
      console.log("Token:", token);
      const response = await axios.get(`http://localhost:8080/students/course/${courseCode}`,
        {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
        }
      );
      console.log("Fetched students:", response.data);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to load students. Please check the course code or server status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-center md:space-x-4 mb-4">
          <input
            type="text"
            placeholder="Course Code"
            className="flex-1 border border-gray-300 rounded px-3 py-2 outline-none mb-2 md:mb-0"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
          />

          {/* 🟡 Date Picker */}
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {setSelectedDate(date);
                                console.log("Selected date:", date)
            }}
            className="border border-gray-300 rounded px-3 py-2 outline-none"
            dateFormat="yyyy-MM-dd"
          />

          <button
            className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-green-600 hover:rounded-xl ttransition-all duration-300 md:mt-0"
            onClick={fetchStudents}
          >
            Fetch Students
          </button>
        </div>

        {loading && (
          <div className="flex justify-center my-4">
            <ClipLoader color="#06b6d4" size={35} />
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}

        <motion.div
          className="p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {students.length > 0 ? (
              <AttendanceRecorder
                students={students}
                courseCode={courseCode}
                selectedDate={selectedDate} // 🟡 Pass to AttendanceRecorder
              />
            ) : (
              <p className="text-gray-500">
                No students loaded yet. Please enter a course code and click "Fetch Students".
              </p>
            )}  
        </motion.div>
      </div>
    </>
  );
};

export default Record;
