import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../client";

const SignUp = () => {
  const [formData, setFormdata] = useState({
    email: "",
    userName: "",
    password: "",
    role: "student",
  });

  function handleChange(event) {
    setFormdata((previousData) => ({
      ...previousData,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            userName: formData.userName,
          },
        },
      });

      alert("Check your email for Verification link");

      const { data: insertData, error: insertError } = await supabase
        .from("users")
        .insert([
          { email: formData.email, is_teacher: formData.role === "teacher" },
        ]);

      if (insertError) throw insertError;
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="container">
      {/* Add the Sharky Peer Assessment title at the top */}
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

      <div className="signup-box" id="signup-box">
        <h2>Create Account</h2>
        <form
          id="signupform"
          onSubmit={handleSubmit}
          className="form-container"
        >
          <div className="user-box">
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              required
              className="input-text"
              placeholder="Email"
            />
          </div>
          <div className="user-box">
            <input
              type="text"
              id="new-username"
              name="userName"
              onChange={handleChange}
              required
              className="input-text"
              placeholder="Username"
            />
          </div>
          <div className="user-box">
            <input
              type="password"
              id="new-password"
              name="password"
              onChange={handleChange}
              required
              className="input-text"
              placeholder="Password"
            />
          </div>

          <div className="user-box">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-text"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <div className="button-container">
            <button type="submit" className="btn">
              Sign Up
            </button>
          </div>
        </form>

        <div className="login-link">
          <p>
            Already have an account? <Link to="/">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
