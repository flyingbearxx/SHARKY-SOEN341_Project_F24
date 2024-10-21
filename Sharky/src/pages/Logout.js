import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Adjust this key based on your implementation
    // Navigate to the home page
    navigate("/");
  };

  return (
    <div>
      <h1>Logout</h1>
      <p>You have been logged out. Thank you for using our application!</p>
      <button onClick={handleLogout}>Go to Home Page</button>
    </div>
  );
};

export default Logout;
