import React, { useState } from "react";
import axios from "axios";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);

  const handleRequestResetCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        import.meta.env.VITE_RESET_PASSWORD_URL,
        {
          action: "forgotPassword",
          email,
        }
      );
      console.log(email);

      setMessage(response.data.message);
      if (response.data.status === 1) {
        setStep(2);
      }
    } catch (error) {
      setMessage("Error requesting reset code");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

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
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error resetting password");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h2>{step === 1 ? "Request Reset Code" : "Reset Password"}</h2>

      {step === 1 ? (
        <form onSubmit={handleRequestResetCode}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Request Reset Code</button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <div>
            <label>Reset Code:</label>
            <input
              type="text"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              required
            />
          </div>
          <div>
            <label>New Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Reset Password</button>
        </form>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
