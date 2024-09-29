import React, { useState } from "react";
import { supabase } from "../client";
import { useNavigate } from "react-router-dom";

const ResetPW = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      // Assuming the user is recovering the password through a recovery token sent via email
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      alert("Your password has been updated.");
      navigate("/login"); // Redirect user to login page after password update
    } catch (error) {
      console.error("Error in updating password:", error);
      setErrorMessage(error.error_description || error.message);
    }
  };

  return (
    <div className="container">
      <header className="header1" id="header1">
        <h2>
          Sharky <br /> Peer Assessment
        </h2>
      </header>

      <div className="login-box" id="login-box">
        <h2>Create New Password</h2>
        <form id="reset-password-form" onSubmit={handleSubmit}>
          <div className="user-box">
            <input
              type="password"
              id="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>New Password</label>
          </div>
          <div className="user-box">
            <input
              type="password"
              id="confirm-new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <label>Confirm New Password</label>
          </div>
          <div className="button-container">
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
          {errorMessage && <p id="error-message">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPW;
