import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    const errors = {};
    if (!email) {
      errors.email = "Email is required.";
    } else if (!validateEmail(email)) {
      errors.email = "Invalid email format.";
    }

    if (step === 2) {
      if (!resetCode) {
        errors.resetCode = "Reset code is required.";
      }
      if (!password) {
        errors.password = "Password is required.";
      } else if (password.length < 6) {
        errors.password = "Password must be at least 6 characters.";
      }
      if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
      }
    }
    return errors;
  };

  const handleRequestResetCode = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    try {
      const response = await axios.post(
        import.meta.env.VITE_RESET_PASSWORD_URL,
        {
          action: "forgotPassword",
          email,
        }
      );
      setMessage(response.data.message);
      if (response.data.status === 1) {
        toast.success("Sending code to your email");
        setStep(2);
      }
    } catch (error) {
      setMessage("Error requesting reset code");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    try {
      const response = await axios.post(
        import.meta.env.VITE_RESET_PASSWORD_URL,
        {
          action: "resetPassword",
          email,
          resetCode,
          newPassword: password,
        }
      );
      navigate("/login");
      toast.success("Password reset successfully!");
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error resetting password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg p-8 w-full max-w-md rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-neroBlack950">
          {step === 1 ? "Request Reset Code" : "Reset Your Password"}
        </h2>

        {message && (
          <p
            className={`mt-3 text-center text-md font-semibold ${
              message.includes("Error") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}

        {step === 1 ? (
          <form onSubmit={handleRequestResetCode} noValidate>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-6 text-xs">
                Please enter your email address! We will send you a reset code.
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className={`w-full px-4 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:ring-2 ${
                  errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-4">{errors.email}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-neroBlack950 text-white py-2 rounded hover:bg-neroBlack500 transition"
            >
              {isSubmitting ? "Sending code to email" : "Send Reset Code"}
            </button>
            <div className="mt-4 text-center">
              <Link to={"/login"} className="text-blue-500 hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} noValidate>
            <div className="mb-4 mt-6">
              <label className="block text-gray-700 font-medium mb-3">
                Reset Code:
              </label>
              <input
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                placeholder="Enter the reset code..."
                className={`w-full px-4 py-2 border ${
                  errors.resetCode ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:ring-2 ${
                  errors.resetCode
                    ? "focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
              />
              {errors.resetCode && (
                <p className="text-red-500 text-sm mt-4">{errors.resetCode}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-3">
                New Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a new password..."
                className={`w-full px-4 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:ring-2 ${
                  errors.password ? "focus:ring-red-500" : "focus:ring-blue-500"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-4">{errors.password}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-3">
                Confirm Password:
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password..."
                className={`w-full px-4 py-2 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? "focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-4">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-neroBlack950 text-white py-2 rounded hover:bg-neroBlack500 transition"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
