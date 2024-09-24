import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../client";

const LogIn = ({ setToken }) => {
  let navigate = useNavigate();

  const [formData, setFormdata] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  function togglePasswordVisibility() {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  }

  function handleChange(event) {
    setFormdata((previousData) => {
      return {
        ...previousData,
        [event.target.name]: event.target.value,
      };
    });
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
      navigate("./Homepage");
    } catch (error) {
      alert(error);
    }
  }
  return (
    <body>
      <div className="containter">
        <div className="background-img" id="background-img"></div>

        <header className="header1" id="header1">
          <h2>
            Sharky <br /> Peer Assement
          </h2>

          {/* <ul>
                        <li><a href="project1.html">Login</a></li>
                        <li><a href="project1.html">Teams</a></li>
                        <li><a href="project1.html">Assessment</a></li>
                    </ul>
                     */}
        </header>

        <div className="navigation-bar" id="navigation-bar">
          <div className="nav-bar" id="nav-bar">
            <h3 style={{ color: "rgb(95, 81, 81)", textAlign: "left" }}>
              <i>
                <li className="active">
                  {" "}
                  <a href="/" style={{ color: "grey" }}>
                    Login
                  </a>
                </li>
                <br />
                <li className="active">
                  {" "}
                  <a href="/signup" style={{ color: "grey" }}>
                    Sign Up
                  </a>
                </li>
                <br />
                <li className="active">
                  {" "}
                  <a href="/contactus" style={{ color: "grey" }}>
                    Contact us
                  </a>
                </li>
                <br />
              </i>
            </h3>
          </div>
        </div>

        <div className="login-box" id="login-box">
          <div className="switch-container" id="switch-container">
            <button
              type="button"
              id="student-btn"
              className="switch-btn active"
            >
              Student
            </button>
            <button type="button" id="teacher-btn" className="switch-btn">
              Teacher
            </button>
          </div>
          <h2>Login</h2>
          <form id="loginform" onSubmit={handleSubmit}>
            <div className="user-box" id="user-box">
              <input
                type="text"
                id="email"
                name="email"
                onChange={handleChange}
                required
              />
              <label>Email</label>
            </div>
            <div className="user-box" id="user-box">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                onChange={handleChange}
                required
              />
              <label>Password</label>
              <span
                className="show-password"
                onClick={togglePasswordVisibility}
              >
                👁️
              </span>
            </div>
            <div className="button-container" id="button-container">
              <button type="submit" className="submit-btn" id="submit-btn">
                Login
              </button>
            </div>
            <div className="forgotpw" id="forgotpw">
              <a href="forgetpw.html">forget password?</a>
            </div>
            <div className="forgotpw" id="forgotpw">
              Don't have an account?
              <a href="/SignUp"> Sign Up</a>
            </div>
            <p id="error-message"></p>
          </form>
        </div>
      </div>
    </body>
  );
};

export default LogIn;
