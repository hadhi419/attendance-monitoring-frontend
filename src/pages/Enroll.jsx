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
  };

  const parseTSV = async () => {
    if (!file) {
      alert("Please upload a TSV file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const contents = event.target.result;
      const lines = contents.trim().split("\n").slice(1);
      const students = lines.map((line) => {
        const [registration_number, course_code] = line.trim().split("\t");
        return { registration_number, course_code };
      });

      setParsedStudents(students);  // <-- store parsed data to show in table
      setLoading(true);
      setMessage("");
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:8080/enrollments/enroll",
          students,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessage(response.data.message);
        setSuccessMsg("Successful enrollments - " + response.data.successful);
        setFailMsg("Failed enrollments - " + response.data.skipped_duplicates + " (Caused by duplicate entries)\n");
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
    <div className="p-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="file"
          accept=".tsv"
          className="flex-1 border bg-gray-200 text-green-700 font-medium border-gray-300 rounded px-3 py-2 outline-none"
          onChange={handleFileChange}
        />

        <button 
          onClick={parseTSV}
          className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 transition-all duration-300"
        >
          Enroll Students
        </button>
      </div>




        {parsedStudents.length > 0 && (
        <div className="max-w-full mb-4 pt-6">
            {/* Header */}
            <div className="flex border-b border-gray-300 pb-2 mb-2 font-semibold text-gray-700">
            <div className="flex-1">Registration Number</div>
            <div className="flex-1">Course Code</div>
            </div>

            {/* Rows */}
            <div className="flex flex-col space-y-2">
            {parsedStudents.map((student, idx) => (
                <div
                key={idx}
                className="flex items-center p-2 border border-gray-200 rounded-xl shadow-sm"
                style={{ backgroundColor: idx % 2 === 0 ? "#f9fafb" : "white" }} // alternate row bg
                >
                <div className="flex-1">{student.registration_number}</div>
                <div className="flex-1">{student.course_code}</div>
                </div>
            ))}
            </div>
        </div>
        )}


      {loading && (
        <div className="flex justify-center my-4">
          <ClipLoader color="#06b6d4" size={35} />
        </div>
      )}


    {(message || successMsg || failMsg || error) && (
    <div>
        {/* {message && <pre className="text-green-600 mb-2">{message}</pre>}
        {successMsg && <pre className="text-green-600 mb-2">{successMsg}</pre>} */}
        {failMsg && <pre className="text-red-600 mb-2 justify-self-end mr-7">{failMsg}</pre>}
        {error && <pre className="text-red-500">{error}</pre>}
    </div>
    )}


    {!submitted && (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-100 p-4 rounded mt-6"
    >
        <h2 className="text-lg font-semibold mb-2">TSV Format:</h2>
        <pre className="text-sm text-gray-700">
        registrNum {"\t"} course_code {"\t"}
        {"\n"}2021ICT006 {"\t"} ACU2212
        </pre>
    </motion.div>
    )}


    </div>
  );
};

export default Enroll;
