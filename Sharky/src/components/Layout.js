import React from "react";
import DateTime from "./DateTime";  // Make sure this import is correct

const Layout = ({ children }) => {
  return (
    <div>
      {/* DateTime component with inline style */}
      <DateTime style={{  paddingTop: "80px" , position: "absolute", top: "10px", right: "10px", fontSize: "14px", fontWeight: "bold" }} />
      
      {/* Page content */}
      <div>{children}</div>
    </div>
  );
};

export default Layout;
