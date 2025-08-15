import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import { motion } from 'framer-motion';

const Enroll = () => {
  const [file, setFile] = useState(null);
  const [parsedStudents, setParsedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [failMsg, setFailMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setMessage("");
    setError(null);
    setParsedStudents([]);
    setSuccessMsg("");
    setFailMsg("");
    setSubmitted(false);
  };

  const parseTSV = async () => {
    if (!file) {
      alert("Please upload a TSV file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const contents = event.target.result;
      const lines = contents.trim().split("\n").slice(1); // skip header line
      const students = lines.map((line) => {
        const [registration_number, course_code] = line.trim().split("\t");
        return { registration_number, course_code };
      });

      setParsedStudents(students);
      setLoading(true);
      setMessage("");
      setError(null);
      setSuccessMsg("");
      setFailMsg("");

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "https://backend-repo-rough-snowflake-31.fly.dev/enrollments/enroll",
          students,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessage(response.data.message || "Enrollment completed.");
        setSuccessMsg("Successful enrollments - " + (response.data.successful ?? 0));
        setFailMsg("Failed enrollments - " + (response.data.skipped_duplicates ?? 0) + " (Caused by duplicate entries)");
      } catch (err) {
        console.error(err);
        setError("Bulk enrollment failed. Please check the TSV format and server.");
      } finally {
        setLoading(false);
      }
    };

    setSubmitted(true);
    reader.readAsText(file);
  };

  return (
    <div className="p-6 max-w-screen-md mx-auto">
      {/* File Upload & Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="file"
          accept=".tsv"
          className="flex-1 border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-700 font-medium outline-none
            focus:ring-2 focus:ring-cyan-600"
          onChange={handleFileChange}
          aria-label="Upload TSV file"
        />
        <button
          onClick={parseTSV}
          className="bg-cyan-500 text-white px-5 py-2 rounded hover:bg-cyan-600 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={loading || !file}
          aria-disabled={loading || !file}
        >
          {loading ? <ClipLoader color="#fff" size={20} /> : 'Enroll Students'}
        </button>
      </div>

      {/* Parsed Students Table */}
      {parsedStudents.length > 0 && (
        <div className="max-w-full mb-6 overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-2 bg-gray-100 border-b border-gray-300 text-gray-700 font-semibold px-4 py-2">
            <div>Registration Number</div>
            <div>Course Code</div>
          </div>

          {/* Table Rows */}
          <div>
            {parsedStudents.map((student, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-2 px-4 py-2 items-center ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <div className="truncate">{student.registration_number}</div>
                <div className="truncate">{student.course_code}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {(message || successMsg || failMsg || error) && (
        <div className="mb-6 space-y-2">
          {message && <p className="text-green-700 font-semibold">{message}</p>}
          {successMsg && <p className="text-green-600 whitespace-pre-wrap">{successMsg}</p>}
          {failMsg && <p className="text-red-600 whitespace-pre-wrap">{failMsg}</p>}
          {error && <p className="text-red-500 font-medium">{error}</p>}
        </div>
      )}

      {/* TSV Format Instructions */}
      {!submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-100 p-4 rounded"
          aria-live="polite"
        >
          <h2 className="text-lg font-semibold mb-2">TSV Format:</h2>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
registrNum {"\t"} course_code{"\n"}
2021ICT006 {"\t"} ACU2212
          </pre>
        </motion.div>
      )}
    </div>
  );
};

export default Enroll;
