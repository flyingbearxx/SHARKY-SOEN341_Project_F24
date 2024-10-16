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
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      alert("Your password has been updated.");
      navigate("/login");
    } catch (error) {
      console.error("Error in updating password:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container">
      <header className="header1">
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          alt="Logo"
          className="logo"
        />
        <h2>
          Sharky <br /> Peer Assessment
        </h2>
      </header>

      <div className="login-box">
        <h2>Create New Password</h2>
        <form
          id="reset-password-form"
          onSubmit={handleSubmit}
          className="form-container"
        >
          <div className="user-box">
            <input
              type="password"
              id="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-text"
              placeholder="New Password"
            />
          </div>
          <div className="user-box">
            <input
              type="password"
              id="confirm-new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="input-text"
              placeholder="Confirm New Password"
            />
          </div>

          <div className="button-container">
            <button type="submit" className="btn">
              Submit
            </button>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPW;
