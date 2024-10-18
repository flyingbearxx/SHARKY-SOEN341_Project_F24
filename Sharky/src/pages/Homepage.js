import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div className="container">
      <header className="header1">
        <img src="logo.png" alt="Sharky Logo" className="logo" />
        <h1>Welcome to Sharky Peer Assessment</h1>
      </header>

      <div className="homepage-content">
        <section className="intro-section">
          <p>
            Sharky is a peer assessment tool designed to make teamwork more
            effective and transparent. Students can create teams, rate their
            peers using a detailed 7-point scale, and provide constructive
            feedback.
          </p>
        </section>

        <section className="features-section">
          <h2>Key Features</h2>
          <ul>
            <li>Create teams with up to 10 members</li>
            <li>Rate peers with a 7-point scale</li>
            <li>Anonymous peer assessments to ensure fairness</li>
            <li>Constructive feedback with comment support</li>
            <li>Instructors can upload CSV files to quickly manage teams</li>
          </ul>
        </section>

        <section className="instructor-section">
          <h2>For Instructors</h2>
          <p>
            Instructors can easily create teams, monitor team dynamics, and
            upload CSV files to manage large groups more efficiently. Sharky
            provides comprehensive feedback that helps instructors make
            well-informed grading decisions.
          </p>
        </section>

        <section className="cta-section">
          <p>
            Ready to start? Sign up now to create your teams and get started!
          </p>
          <Link to="/signup" className="signUp-btn">
            Sign Up
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Homepage;
