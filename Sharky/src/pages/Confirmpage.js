import React from "react";
import { useNavigate } from "react-router-dom";

const Confirmpage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Adjust this key based on your implementation
    // Navigate to the home page
    navigate("/");
  };

  return (
    <div>
    <h1>Thank you for filling out the form</h1>

    <button onClick={handleLogout}>Go to Home Page</button>
  </div>
  );
};

export default Confirmpage;

