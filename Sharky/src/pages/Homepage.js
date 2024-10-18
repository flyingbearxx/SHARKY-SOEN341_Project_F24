import React from "react";
<<<<<<< HEAD
import { Link } from "react-router-dom"; // Import Link
=======
>>>>>>> ad8dff34e15c5106351153b9853bfd486df83a48

const Homepage = () => {
  return (
    <div className="container">
      <div className="content">
        <h2>Welcome to Sharky Peer Assessment</h2>
<<<<<<< HEAD
        <p>SHARKY is a peer assesment application that allows student to create teammates</p>
        <p> Also, Students can rate their peers using a detailed 7-point scale and comments to support their evaluation.</p>
        <p>SHARKY is designed to provide students with a dynamic environment to provide constructive feedback.</p>
        <p> Furthermore, instructors can create teams up to 10 members</p>
        <p>SHARKY helps promote fairer grading while providing crucial insights to both students and their instructors.</p>
          <p> SHARKY fosters a culture of continuous improvement, empowering students to reflect on their performance, and contribute more effectively to their teams.</p>
          <p> The goal of SHARKY is to Offer instructors a reliable tool to monitor and analyze team dynamics.</p>
        <p>In order to access our service you need to sign up.</p>
        {/* Link to the signup page */}
        <Link to="/signup" className="signUp">Sign Up</Link>
=======
        <p>Login was successful! You can now access your dashboard.</p>
>>>>>>> ad8dff34e15c5106351153b9853bfd486df83a48
      </div>
    </div>
  );
};

export default Homepage;