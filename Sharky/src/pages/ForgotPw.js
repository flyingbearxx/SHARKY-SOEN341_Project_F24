import React, { useState } from "react";
import { supabase } from "../client";

const ForgotPw = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/reset-password",
      });
      if (error) throw error;

      alert("Check your email for the reset password link.");
    } catch (error) {
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
        <h2>Forgot Password</h2>
        <form
          id="forgot-password-form"
          onSubmit={handleSubmit}
          className="form-container"
        >
          <div className="user-box">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-text"
              placeholder="Email"
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

export default ForgotPw;
