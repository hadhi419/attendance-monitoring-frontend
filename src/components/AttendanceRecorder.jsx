import React, { useState } from "react";
import axios from "axios";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import ConfirmModal from "./ConfirmModal";

const statuses = ["Present", "Absent", "Late"];

const statusStyles = {
  Present: "bg-green-200 text-gray-800",
  Absent: "bg-red-200 text-gray-800",
  Late: "bg-yellow-200 text-gray-800",
  "": "bg-white text-gray-700",
};

const AttendanceRecorder = ({ students, courseCode, selectedDate }) => {
  const [attendance, setAttendance] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const allSelected =
    students.length > 0 &&
    students.every(
      (student) =>
        attendance[student.registrationNumber] &&
        attendance[student.registrationNumber] !== ""
    );

  const submitAttendance = () => {
    if (!allSelected) {
      setSubmissionResult({
        type: "error",
        message: "Please select all statuses before submitting.",
      });
      return;
    }

    const todayDate = new Date().toISOString().slice(0, 10);
    const recordedBy = 1;
    const token = localStorage.getItem("token");

    const records = Object.entries(attendance).map(
      ([registrationNumber, status]) => ({
        registration_number: registrationNumber,
        course_code: courseCode,
        date: selectedDate || todayDate,
        status,
        remarks: "Nothing",
        recorded_by: recordedBy,
      })
    );

    let successCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;

    const requests = records.map((record) =>
      axios
        .post("http://localhost:8080/attendance/add", record, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          successCount++;
        })
        .catch((error) => {
          if (error.response && error.response.status === 409) {
            duplicateCount++;
          } else {
            errorCount++;
          }
        })
    );

    Promise.all(requests).then(() => {
      setSubmissionResult({
        type: "info",
        message:
          `Successfully recorded: ${successCount}\n` +
          `Duplicate entries: ${duplicateCount}\n` +
          `Failed submissions: ${errorCount}`,
      });
      setAttendance({});
    });
  };

  const handleSubmit = () => setShowConfirm(true);
  const confirmSubmit = () => {
    setShowConfirm(false);
    submitAttendance();
  };
  const cancelSubmit = () => setShowConfirm(false);

  // Helper to extract numeric part from registration number
  const getStudentNumber = (regNo) => {
    const match = regNo.match(/^2021ICT(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  };

  return students.length > 0 ? (
    <>
      <div className="w-full px-0 py-6">
        <div className="flex border-b border-gray-300 pb-2 mb-2 font-semibold text-gray-700">
          <div className="flex-1">Registration Number</div>
          <div className="flex-1">Name</div>
          <div className="flex-1">Status</div>
        </div>

        <div className="flex flex-col space-y-2 mt-6">
          {[...students]
            .sort(
              (a, b) =>
                getStudentNumber(a.registrationNumber) -
                getStudentNumber(b.registrationNumber)
            )
            .map((student, index) => {
              const currentStatus = attendance[student.registrationNumber] || "";

              return (
                <div
                  key={index}
                  className="flex items-center p-2 border w-full border-gray-200 rounded-xl shadow-stone-950"
                >
                  <div className="flex-1">{student.registrationNumber}</div>
                  <div className="flex-1">{`${student.firstName} ${student.lastName}`}</div>
                  <div className="flex-1">
                    <Listbox
                      value={currentStatus}
                      onChange={(value) =>
                        setAttendance((prev) => ({
                          ...prev,
                          [student.registrationNumber]: value,
                        }))
                      }
                    >
                      <div className="relative w-full">
                        <Listbox.Button
                          className={`relative w-full cursor-pointer rounded border border-gray-300 py-1.5 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                            statusStyles[currentStatus]
                          }`}
                        >
                          <span className="block truncate">
                            {currentStatus || "Select Status"}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                          </span>
                        </Listbox.Button>

                        <Listbox.Options className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {statuses.map((status) => (
                            <Listbox.Option
                              key={status}
                              value={status}
                              className={({ active }) =>
                                `relative cursor-pointer select-none px-4 py-2 ${
                                  active
                                    ? status === "Present"
                                      ? "bg-green-300 text-green-800"
                                      : status === "Absent"
                                      ? "bg-red-300 text-red-800"
                                      : "bg-yellow-200 text-yellow-800"
                                    : "text-gray-700"
                                }`
                              }
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? "font-medium" : "font-normal"
                                    }`}
                                  >
                                    {status}
                                  </span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 right-2 flex items-center text-cyan-600">
                                      <CheckIcon className="h-5 w-5" />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="flex flex-col mt-6 items-end space-y-2">
          <button
            className={`px-6 py-2 rounded text-white transition-all duration-300 ${
              allSelected
                ? "bg-cyan-600 hover:bg-green-500 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={allSelected ? handleSubmit : undefined}
            disabled={!allSelected}
          >
            Submit Attendance
          </button>

          {submissionResult && (
            <div
              className={`whitespace-pre-line px-4 py-2 rounded ${
                submissionResult.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {submissionResult.message}
            </div>
          )}
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to submit the attendance?"
          onConfirm={confirmSubmit}
          onCancel={cancelSubmit}
        />
      )}
    </>
  ) : (
    <p>Loading students...</p>
  );
};

export default AttendanceRecorder;
