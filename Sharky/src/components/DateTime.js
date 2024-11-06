import React, { useState, useEffect } from "react";

const DateTime = ({ style }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Update the current date and time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const formattedDate = currentDate.toLocaleString();

  return (
    <div style={style}>
      <p>{formattedDate}</p>
    </div>
  );
};

export default DateTime;