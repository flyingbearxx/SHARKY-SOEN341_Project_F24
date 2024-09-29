import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import { useNavigate } from "react-router-dom";

const ForgotPw = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return email.includes("@") && email.includes(".");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");

      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/reset-password",
      });
      if (error) throw error;
      alert("Check your email for the reset password link.");
      //navigate("/reset-password");//1
    } catch (error) {
      // console.log(error);
      console.error("Error in sending reset password email:", error);
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
        <h2>Forgot Password</h2>
        <form id="forgot-password-form" onSubmit={handleSubmit}>
          <div className="user-box" id="user-box">
            <input
              type="email"
              id="email"
              value={email} // Make sure to uncomment this line
              onChange={(e) => {
                const newEmail = e.target.value;
                setEmail(newEmail);
                console.log(newEmail); // This will print the email to the console every time it changes
              }}
              required
            />

            <label>Email</label>
          </div>
          <div className="button-container" id="button-container">
            <button type="submit" className="submit-btn" id="submit-btn">
              Submit
            </button>
          </div>
          {errorMessage && <p id="error-message">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPw;
