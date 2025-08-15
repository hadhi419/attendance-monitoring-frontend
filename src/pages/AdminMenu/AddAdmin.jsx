import React, { useState } from 'react';
import axios from 'axios';

const RegisterUser = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
    role: 'admin'
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
      await axios.post('https://backend-repo-rough-snowflake-31.fly.dev/admin/addUser', user);
      setMessage('✅ Admin registered successfully.');
      setUser({ email: '', password: '', role: 'student' });
    } catch (err) {
      setMessage('❌ Registration failed. Email might already exist.');
      console.error(err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg
                    sm:max-w-lg sm:p-8
                    md:max-w-xl md:p-10
                    lg:max-w-2xl">
      {/* Heading */}
      <h2 className="text-xl font-semibold mb-4 text-gray-700
                     sm:text-2xl md:text-3xl">
        Add New Admin
      </h2>

      {/* Message */}
      {message && (
        <p className="mb-4 p-2 text-sm text-center rounded bg-gray-100 text-gray-800 border
                      sm:text-base">
          {message}
        </p>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700
                       sm:text-base"
          >
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={user.email}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-600
                       sm:p-3 sm:text-base"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700
                       sm:text-base"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={user.password}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-600
                       sm:p-3 sm:text-base"
            required
          />
        </div>

        {/* Role */}
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700
                       sm:text-base"
          >
            Role
          </label>
          <select
            name="role"
            id="role"
            value={user.role}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded bg-white
                       sm:p-3 sm:text-base"
            disabled
          >
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-cyan-700 text-white py-2 rounded hover:bg-green-800 hover:rounded-xl
                     transition-all duration-300
                     sm:py-3 sm:text-lg flex justify-center items-center"
          disabled={loading} // disable while loading
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
