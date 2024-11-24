import React, { useState, useEffect } from 'react';
import { supabase } from "../client";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';


ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);


const Profile = () => {
  const [assessmentData, setAssessmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [imgurl, setimgurl] = useState(null);
  const [newimgurl, setnewimgurl] = useState(null);
  const [uploading, setuploading] = useState(false);
  const [average, setaverage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the logged-in user
        const { data: userResponse, error: userError } = await supabase.auth.getUser();
        if (userError || !userResponse?.user) {
          console.error("Error fetching user:", userError || "User not found.");
          throw new Error(userError || "User not found.");
        }
  
        const user = userResponse.user;
        setUserEmail(user.email);
  
        // Fetch the user's ID and profile picture from the "users" table
        const { data: userData, error: userFetchError } = await supabase
          .from("users")
          .select("id, profilepic")
          .eq("email", user.email)
          .single();
        if (userFetchError || !userData) {
          console.error("Error fetching user data:", userFetchError || "No user data found.");
          throw new Error(userFetchError || "No user data found.");
        }
  
        const userId = userData.id;
  
        // Handle profile picture download
        if (userData.profilepic) {
          try {
            const { data: profilePicData, error: downloadError } = await supabase.storage
              .from("Profilepictures")
              .download(userData.profilepic);
            if (downloadError || !profilePicData) {
              console.error("Error downloading profile picture:", downloadError || "No profile picture found.");
              throw new Error(downloadError || "No profile picture found.");
            }
  
            const url = URL.createObjectURL(profilePicData);
            setimgurl(url);
          } catch (error) {
            console.error("Error processing profile picture:", error);
          }
        }
  
        // Fetch data from all assessment tables
        const assessmentTables = [
          { table: "Cooperation", dimension: "Cooperation", commentField: "Commentsection" },
          { table: "PracticalContribution", dimension: "Practical", commentField: "PracticalComment" },
          { table: "WorkEthic", dimension: "WorkEthic", commentField: "WorkComment" },
          { table: "ConceptualContribution", dimension: "Conceptual", commentField: "ConceptualComment" },
        ];
  
        const combinedData = [];
        for (const { table, dimension, commentField } of assessmentTables) {
          const { data: tableData, error: tableError } = await supabase.from(table).select("*");
          if (tableError) {
            console.error(`Error fetching data from ${table}:`, tableError);
            continue;
          }
  
          tableData.forEach((row) => {
            if (row.Assessedmemberid === userId) {
              const existing = combinedData.find((item) => item.Assessor === row.Assessorid);
              if (existing) {
                existing[dimension] = row.averages || "-";
                if (row[commentField]) {
                  existing.Comments.push(row[commentField]);
                }
              } else {
                combinedData.push({
                  Assessor: row.Assessorid,
                  Cooperation: dimension === "Cooperation" ? row.averages || "-" : "-",
                  Practical: dimension === "Practical" ? row.averages || "-" : "-",
                  WorkEthic: dimension === "WorkEthic" ? row.averages || "-" : "-",
                  Conceptual: dimension === "Conceptual" ? row.averages || "-" : "-",
                  Comments: row[commentField] ? [row[commentField]] : [],
                });
              }
            }
          });
        }
  
        setAssessmentData(combinedData);
  
        // Calculate the total average of the four dimensions
        const totalSum = combinedData.reduce(
          (sum, row) =>
            sum +
            ["Cooperation", "Practical", "WorkEthic", "Conceptual"].reduce(
              (dimensionSum, dimension) => dimensionSum + (parseFloat(row[dimension]) || 0),
              0
            ),
          0
        );
        const totalCount = combinedData.length * 4; // Four dimensions per row
        setaverage(totalCount ? totalSum / totalCount : 0);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const getComment = (average) => {
    if (average >= 4.5) return "Excellent job";
    if (4.5>average >= 3.9) return "Very good job";
    if (3.9> average >= 2.9) return "Good job";
    if (2.9>average >= 2) return "Fair";
    return "Very poor";
  };

  const chartData = {
    labels: ["Score"],
    datasets: [
      {
        data: [average, 5 - average],
        backgroundColor: ["#6a0dad", "#eaeaea"],
        hoverBackgroundColor: ["#6a0dad", "#eaeaea"],
        borderWidth: 0,
      },
    ],
  };


const chartOptions = {
    cutout: "70%", // Creates the circular inner cutout for the Doughnut chart
    plugins: {
      tooltip: { enabled: false }, // Hides hover tooltips
    },
  };
  

  const handleProfilePictureChange = async () => {
    if (!newimgurl) {
        alert("Please select a file to upload!");
        return;
      }
    
      setuploading(true);
    
      try {
       
       const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (!user) {
        throw new Error("User not found. Please ensure you are logged in.");
      }
      
        if(user.error) throw user.error;
        const userEmail = user.email;
        const fileName = `${newimgurl.name}`;

    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase
      .storage
      .from("Profilepictures")
      .upload(fileName, newimgurl);

    if (uploadError) throw uploadError;

    // Get the public URL of the uploaded image
    const { publicURL, error: urlError } = await supabase
      .storage
      .from("Profilepictures")
      .getPublicUrl(fileName);

    if (urlError) throw urlError;

    // Update the profilepic column in the users table with the file name
    const { error: updateError } = await supabase
      .from("users")
      .update({ profilepic: fileName })
      .eq("email", user.email);

      if (updateError) {
        console.error("Failed to update profilepic column:", updateError);
        alert("Failed to update your profile picture in the database.");
      } else {
        console.log("Profile picture file name successfully updated in the database.");
      }

    if (updateError) throw updateError;

    // Directly construct the URL for the uploaded image
    const imageUrl = `https://cxaalqtjgahwhmkzmqmh.supabase.co/storage/v1/object/public/Profilepictures/${fileName}`;

    // Immediately set the image URL
    setimgurl(imageUrl);
    alert("Profile picture updated successfully!");
      } catch (err) {
        console.error("Error updating profile picture:", err);
        alert("Failed to upload profile picture.");
      } finally {
        setuploading(false);
      }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <header className="header1">
        <h2 className="profile-title">MY Profile</h2>
      </header>
      <div className="options-container">
        <h3>Logged in as: {userEmail}</h3>

        
        {/* Display Profile Picture */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
        {imgurl ? (
         <img
      src={imgurl}
      alt="Profile"
      style={{ width: "150px", height: "150px", borderRadius: "50%" }}
    />
    ) : (
    <p>No profile picture</p>
   )}
   </div>
        {/* Upload New Profile Picture */}
        <div style={{ textAlign: "center", marginTop: "15px", width: "40%"}}>
          <input
            type="file"
            data-testid="file-input"
            onChange={(e) => setnewimgurl(e.target.files[0])}
          />
          <button onClick={handleProfilePictureChange} disabled={uploading}>
            {/* Upload New Picture */}
            {uploading ? "Uploading..." : "Upadate new picture"}
            </button>
        </div>

         {/* Pie Chart */}
    <div className="pie-chart-container">
    <Doughnut data={chartData} options={chartOptions} />
    <div className="result">
        Your Average Score: <span>{average.toFixed(2)}</span>/5
      </div>
      <div className="comment">
            {getComment(average)}
          </div>
    </div>

        <h3 style={{ textAlign: "center", marginTop: "20px", color: "#6a0dad" }}>
          Here are your results:
        </h3>
        {assessmentData.length === 0 ? (
          <p>No assessment results found for your profile.</p>
        ) : (
          <div className="results-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Cooperation</th>
                  <th>Practical</th>
                  <th>Work Ethic</th>
                  <th>Conceptual</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                {assessmentData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.Cooperation}</td>
                    <td>{row.Practical}</td>
                    <td>{row.WorkEthic}</td>
                    <td>{row.Conceptual}</td>
                    <td>
                      <ul>
                        {row.Comments.map((comment, commentIdx) => (
                          <li key={commentIdx}>{comment}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
       

      </div>
    </div>
  );
};

export default Profile;
