import React, { useState } from 'react';
import axios from 'axios';

const RegisterUser = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
    role: 'student'
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true); // Start loading

    try {
      await axios.post('https://backend-repo-crimson-dream-9959.fly.dev/admin/addUser', user);
      setMessage('✅ Student registered successfully.');
      setUser({ email: '', password: '', role: 'student' });
    } catch (err) {
      setMessage('❌ Registration failed. Email might already exist.');
      console.error(err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-6 sm:mt-10 bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700 text-center sm:text-left">
        Register a New Student as a User
      </h2>

      {message && (
        <p className="mb-4 p-2 text-sm text-center rounded bg-gray-100 text-gray-800 border">
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={user.email}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-600"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={user.password}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-600"
            required
          />
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            name="role"
            id="role"
            value={user.role}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded bg-white cursor-not-allowed"
            disabled
          >
            <option value="student">Student</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-cyan-700 text-white py-2 rounded hover:bg-green-800 hover:rounded-xl transition-all duration-300 flex justify-center items-center"
          disabled={loading} // disable button while loading
        >
          {loading ? (
            // Simple spinner
            <svg
              className="animate-spin h-5 w-5 text-white mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          ) : null}
          {loading ? 'Registering...' : 'Register Student'}
        </button>
      </form>
    </div>
  );
};

export default RegisterUser;
