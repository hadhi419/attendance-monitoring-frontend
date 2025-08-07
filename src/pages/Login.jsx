import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
const sitekey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [captchaValue, setCaptchaValue] = useState(null);

  const handleCaptchaChange = (value) => {
    console.log("Captcha value:", value);
    setCaptchaValue(value); // this is the token you get after solving captcha
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    if (!captchaValue) {
      alert("Please complete the CAPTCHA");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password, captcha: captchaValue }),
      });

      console.log(response);
      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem('token', token);

        const payload = parseJwt(token);
        if (payload && payload.exp) {
          localStorage.setItem('token_expiration', payload.exp * 1000);
        }

        setIsAuthenticated(true);
        navigate('/');
      } else {
        alert("Login failed. Please try again.");
      }

    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-96" onSubmit={handleLogin}>
        <h2 className="text-2xl mb-4 font-bold">Login</h2>
        <input type="email" name="email" placeholder="Email" className="w-full mb-3 p-2 border rounded" />
        <input type="password" name="password" placeholder="Password" className="w-full mb-4 p-2 border rounded" />
        
        <div className="mb-4">
          <ReCAPTCHA
            sitekey={sitekey}
            onChange={handleCaptchaChange}
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-green-700 hover:rounded-xl transition-all duration-300">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
