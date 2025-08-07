import React, { useState } from 'react';
import axios from 'axios';

const RegisterUser = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
    role: 'admin'
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await axios.post('http://localhost:8080/admin/addUser', user);
      setMessage('✅ Student registered successfully.');
      setUser({ email: '', password: '', role: 'student' });
    } catch (err) {
      setMessage('❌ Registration failed. Email might already exist.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg ">
      {/* <h1 className="text-3xl font-bold text-center text-cyan-900 mb-6">Admin Panel</h1> */}
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Admin</h2>

      {message && (
        <p className="mb-4 p-2 text-sm text-center rounded bg-gray-100 text-gray-800 border">
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            name="role"
            id="role"
            value={user.role}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded bg-white"
            disabled
          >
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-700 text-white py-2 rounded hover:bg-green-800 hover:rounded-xl transition-all  duration-300"
        >
          Register Student
        </button>
      </form>
    </div>
  );
};

export default RegisterUser;
