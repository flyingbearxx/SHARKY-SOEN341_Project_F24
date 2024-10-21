import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../client";

const LogIn = ({ setToken }) => {
  let navigate = useNavigate();

  const [formData, setFormdata] = useState({
    email: "",
    password: "",
  });

  const [selectedRole, setSelectedRole] = useState("student"); // Default to student
  const [errorMessage, setErrorMessage] = useState("");

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setErrorMessage("");
  };

  function handleChange(event) {
    setFormdata((previousData) => ({
      ...previousData,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;

      setToken(data);

      let { data: userInfo, error: userError } = await supabase
        .from("users")
        .select("is_teacher")
        .eq("email", formData.email.trim())
        .single();

      if (userError) throw userError;

      if (selectedRole === "student" && userInfo.is_teacher) {
        setErrorMessage("You are a teacher, please use the teacher login.");
        return;
      } else if (selectedRole === "teacher" && !userInfo.is_teacher) {
        setErrorMessage("You are a student, please use the student login.");
        return;
      }

      if (userInfo.is_teacher) {
        navigate("/team-management");
      } else {
        navigate("/homepage");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

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

      {/* Sidebar for Login, Sign Up, Contact Us, and Welcome Page */}
      <nav className="sidebar">
        <div className="menu-buttons">
          <button className="btn" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="btn" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
          <button className="btn" onClick={() => navigate("/contact-us")}>
            Contact Us
          </button>
          <button className="btn" onClick={() => navigate("/")}>
            About Sharky
          </button>
        </div>
      </nav>

      <div className="login-box">
        <div className="switch-container">
          <button
            type="button"
            className={`switch-btn ${
              selectedRole === "student" ? "active" : ""
            }`}
            onClick={() => handleRoleSelect("student")}
          >
            Student
          </button>
          <button
            type="button"
            className={`switch-btn ${
              selectedRole === "teacher" ? "active" : ""
            }`}
            onClick={() => handleRoleSelect("teacher")}
          >
            Teacher
          </button>
        </div>

        <h2>Login</h2>
        <form id="loginform" onSubmit={handleSubmit} className="form-container">
          <div className="user-box">
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              required
              className="input-text"
              placeholder="Email" /* Placeholder inside the input box */
            />
          </div>
          <div className="user-box">
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              required
              className="input-text"
              placeholder="Password" /* Placeholder inside the input box */
            />
          </div>

          <div className="button-container">
            <button type="submit" className="btn">
              Login
            </button>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>

        {/* Links for Sign Up and Reset Password */}
        <div className="extra-links">
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
          <p>
            Forgot password? <Link to="/forgot-password">Reset password</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
