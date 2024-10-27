import React from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaStar, FaClipboard, FaUpload } from "react-icons/fa"; // Icons for better visualization

const Welcomepage = () => {
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

      <div className="homepage-content">
        {/* Introduction Section */}
        <section className="intro-section">
          <h2 className="section-title">Welcome to Sharky Peer Assessment</h2>
          <p className="intro-paragraph">
            Sharky is a peer assessment tool designed to make teamwork more
            effective and transparent. Students can create teams, rate their
            peers, and provide constructive feedback.
          </p>
        </section>

        {/* Key Features Section with icons */}
        <section className="features-section">
          <h2 className="section-title">Key Features</h2>
          <ul className="features-list">
            <li>
              <FaUsers className="icon" /> Create teams with up to 10 members
            </li>
            <li>
              <FaStar className="icon" /> Rate peers with a detailed 5-point
              scale
            </li>
            <li>
              <FaClipboard className="icon" /> Anonymous peer assessments for
              fairness
            </li>
            <li>
              <FaClipboard className="icon" /> Constructive feedback with
              comment support
            </li>
            <li>
              <FaUpload className="icon" /> Instructors can upload CSV files to
              manage teams
            </li>
          </ul>
        </section>

        {/* Instructor Section */}
        <section className="instructor-section">
          <h2 className="section-title">For Instructors</h2>
          <p className="instructor-paragraph">
            Instructors can easily create teams, monitor team dynamics, and
            manage large groups with ease. Sharky helps instructors make
            informed grading decisions with comprehensive feedback.
          </p>
        </section>

        {/* Call to Action Section */}
        <section className="cta-section">
          <h2 className="section-title">Get Started Now!</h2>
          <p className="cta-paragraph">
            Ready to create your teams and improve teamwork? Sign up today and
            take advantage of Sharky’s powerful peer assessment features.
          </p>
          <Link to="/signup" className="menu-btn">
            Sign Up
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Welcomepage;
