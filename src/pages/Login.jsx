import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { ClipLoader } from 'react-spinners';

const sitekey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [captchaValue, setCaptchaValue] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCaptchaChange = (token) => {
    setCaptchaValue(token); // ✅ store the token
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

    setLoading(true);

    try {
      const response = await fetch('https://backend-repo-rough-snowflake-31.fly.dev/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: email,
          password,
          captcha: captchaValue 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem('token', token);

        // Optional: parse token expiration
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload && payload.exp) {
            localStorage.setItem('token_expiration', payload.exp * 1000);
          }
        }

        setIsAuthenticated(true);
        navigate('/');
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Login failed. Please try again.");
      }
    } catch (error) {
      alert("Login failed: " + error.message);
    } finally {
      setLoading(false);
      setCaptchaValue(null); // reset CAPTCHA after attempt
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative px-4">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <ClipLoader color="#06b6d4" size={50} />
        </div>
      )}

      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-md sm:p-8"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl sm:text-3xl mb-4 font-bold text-center">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full mb-3 p-2 sm:p-3 border rounded text-sm sm:text-base"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-4 p-2 sm:p-3 border rounded text-sm sm:text-base"
        />

        <div className="mb-4 flex justify-center">
          <ReCAPTCHA
            sitekey={sitekey}
            onChange={handleCaptchaChange} // ✅ capture token
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded hover:bg-green-700 hover:rounded-xl transition-all duration-300 text-sm sm:text-base"
          disabled={loading}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
