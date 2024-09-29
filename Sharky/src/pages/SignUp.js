import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../client";

const SignUp = () => {
  const [formData, setFormdata] = useState({
    email: "",
    userName: "",
    password: "",
  });

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
    } catch (error) {
      alert(error);
    }

    const { data, error } = await supabase
      .from("users")
      .insert([
        { email: formData.email, is_teacher: formData.role === "teacher" },
      ]);

    if (error) {
      throw error;
    }
  }

  return (
    <body>
      <div class="container">
        <div className="signup-box" id="signup-box">
          <h2>Create Account</h2>
          <form id="signupform" onSubmit={handleSubmit}>
            <div className="user-box">
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                required
              />
              <label>Email</label>
            </div>
            <div className="user-box">
              <input
                type="text"
                id="new-username"
                name="userName"
                onChange={handleChange}
                required
              />
              <label>Username</label>
            </div>
            <div class="user-box">
              <input
                type="password"
                id="new-password"
                name="password"
                onChange={handleChange}
                required
              />
              <label>Password</label>
            </div>

            {/* Role selection */}
            <div className="user-box">
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            <div className="button-container" id="button-container">
              <button type="submit" className="submit-btn" id="submit-btn">
                Sign Up
              </button>
            </div>
          </form>

          {/* Link to go back to login */}
          <div className="login-link">
            <p>
              Already have an account? <Link to="/">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </body>
  );
};

export default SignUp;
