import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Importing React Icons
import useApi from "../hooks/useApi";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false); // State for toggling confirm password visibility
  const navigate = useNavigate();
  const { fetchApi, data, code, error: apiError, loading } = useApi();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Clear previous field errors
    setFieldErrors({
      name: "",
      email: "",
      password: "",
      password_confirmation: ""
    });

    if (password !== password_confirmation) {
      setFieldErrors((prevState) => ({
        ...prevState,
        password_confirmation: "Passwords do not match"
      }));
      return;
    }

    // Sending POST request to the register API
    fetchApi("/register", "POST", {
      body: { name, email, password, password_confirmation }
    });
  };

  // Handle response data after successful registration
  useEffect(() => {
    if (data) {
      setSuccessMessage("Registration successful! Redirecting to login...");
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [data, navigate]);

  // Handle API error
  useEffect(() => {
    if (apiError && apiError) {
      // Clear previous field errors
      setFieldErrors({
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
      });

      // Map API errors to the respective field
      if (apiError.name) {
        setFieldErrors((prevState) => ({
          ...prevState,
          name: apiError.name[0]
        }));
      }
      if (apiError.email) {
        setFieldErrors((prevState) => ({
          ...prevState,
          email: apiError.email[0]
        }));
      }
      if (apiError.password) {
        setFieldErrors((prevState) => ({
          ...prevState,
          password: apiError.password[0]
        }));
      }
      if (apiError.password_confirmation) {
        setFieldErrors((prevState) => ({
          ...prevState,
          password_confirmation: apiError.password_confirmation[0]
        }));
      }
    }
  }, [apiError]);

  // Clear error message on input focus
  const handleFocus = (field) => {
    setFieldErrors((prevState) => ({
      ...prevState,
      [field]: ""
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Register</h2>
        <form onSubmit={handleRegister}>
          {/* Success Message */}
          {successMessage && (
            <p className="text-green-500 text-sm text-center mb-4 font-bold">{successMessage}</p>
          )}

          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              onFocus={() => handleFocus("name")}
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {fieldErrors.name && <p className="text-red-500 text-sm mt-2">{fieldErrors.name}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              onFocus={() => handleFocus("email")}
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {fieldErrors.email && <p className="text-red-500 text-sm mt-2">{fieldErrors.email}</p>}
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"} // Toggle password visibility
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              onFocus={() => handleFocus("password")}
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)} // Toggle the visibility state
              className="absolute top-11 right-3 text-gray-600"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />} {/* Show/hide icon */}
            </button>
            {fieldErrors.password && <p className="text-red-500 text-sm mt-2">{fieldErrors.password}</p>}
          </div>

          {/* Password Confirmation */}
          <div className="mb-6 relative">
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-600">
              Confirm Password
            </label>
            <input
              type={showPasswordConfirmation ? "text" : "password"} // Toggle confirm password visibility
              id="password_confirmation"
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Confirm your password"
              required
              onFocus={() => handleFocus("password_confirmation")}
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)} // Toggle the visibility state
              className="absolute top-11 right-3 text-gray-600"
            >
              {showPasswordConfirmation ? <AiOutlineEyeInvisible /> : <AiOutlineEye />} {/* Show/hide icon */}
            </button>
            {fieldErrors.password_confirmation && (
              <p className="text-red-500 text-sm mt-2">{fieldErrors.password_confirmation}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
