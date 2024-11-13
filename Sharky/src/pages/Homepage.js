import React from "react";
import { Link } from "react-router-dom"; // Import Link

const Homepage = () => {
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
        <h2>Welcome, Student!</h2>
        <p>
          You are logged in to SHARKY, where you can manage your assessments,
          create or join teams, and provide feedback to your peers.
        </p>
        <p>
          Please choose from the options below to navigate through the platform.
        </p>

        <div className="menu-options">
          <Link to="/show-teams" className="menu-btn">
            Manage Teams
          </Link>
          <Link to="/Assessment" className="menu-btn">
            Evaluation
          </Link>
          <Link to="/profile" className="menu-btn">
            Your Profile
          </Link>
          <Link to="/logout" className="menu-btn">
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
