import React from "react";
import DateTime from "./DateTime";  // Make sure this import is correct

const Layout = ({ children }) => {
  return (
    <div>
      {/* DateTime component with inline style */}
      <DateTime
  style={{
    paddingTop: "80px",
    position: "absolute",
    top: "100px",
    right: "20px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#4b0082",
    background: "linear-gradient(to right, #f9f9f9, #ececff)",
    padding: "8px 12px",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    border: "1px solid #6a0dad",
    textAlign: "center",
  }}
/>

      
      {/* Page content */}
      <div>{children}</div>
    </div>
  );
};

export default Layout;
