import React, { useState } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AttendanceByDate = () => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [date, setDate] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAttendance = async () => {
    if (!registrationNumber.trim()) {
      setError(new Error('Registration number is required'));
      return;
    }
    if (!date.trim()) {
      setError(new Error('Date is required'));
      return;
    }

    setLoading(true);
    setError(null);
    setAttendanceData([]);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8080/attendance/student/${registrationNumber}/by-date`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            date: date,
          },
        }
      );
      setAttendanceData(response.data);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Present':
        return <FaCheckCircle className="text-green-600 inline mr-1" />;
      case 'Absent':
        return <FaTimesCircle className="text-red-600 inline mr-1" />;
      case 'Late':
        return <FaClock className="text-yellow-600 inline mr-1" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Input fields */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Enter Registration Number"
          className="flex-1 border border-gray-300 px-3 py-2 rounded"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
        />
        <input
          type="date"
          className="border border-gray-300 px-3 py-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          onClick={fetchAttendance}
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-green-700 hover:rounded-xl transition-all duration-300"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Fetch Attendance'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 font-medium mb-4">Error: {error.message}</p>
      )}

      {/* Results */}
      {attendanceData.length > 0 && (
        <motion.div
        className="-p-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="overflow-x-auto mt-10">
          <div className="inline-block min-w-full overflow-auto rounded-xl border border-gray-300 shadow-sm">
            <table className="min-w-full">
              <thead className="bg-green-600">
                <tr>
                  <th className="px-4 py-3 text-left text-white">Course Code</th>
                  <th className="px-4 py-3 text-left text-white">Course Name</th>
                  <th className="px-4 py-3 text-left text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record, index) => (
                  <tr key={index} className="even:bg-gray-200">
                    <td className="px-4 py-2">{record.courseCode}</td>
                    <td className="px-4 py-2">{record.courseName}</td>
                    <td className="px-4 py-2">
                      {getStatusIcon(record.status)}
                      {record.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </motion.div>
      )}

      {attendanceData.length === 0 && !loading && !error && (
        <p className="text-gray-500 mt-4">No attendance records found.</p>
      )}
    </motion.div>
  );
};

export default AttendanceByDate;
