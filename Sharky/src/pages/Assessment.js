import React from "react";
import { useLocation } from "react-router-dom"; 
import { supabase } from "../client";
//import "./style.css"; // Import your existing CSS file for consistent styling


const Assessment = () => {
    const location = useLocation();
    const { member } = location.state || {};

    return (
      <div className="assessment-wrapper">
        <div className="assessment-box">
          <h2>Assessment page for your selected team member</h2>
          {member ? (
            <p>You are evaluating: <strong>{member}</strong></p>
          ) : (
            <p>Filler text</p>
          )}
        </div>
      </div>
    );
  };
  
  

export default Assessment;
