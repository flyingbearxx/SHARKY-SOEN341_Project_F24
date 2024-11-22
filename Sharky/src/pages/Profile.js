import React, { useState, useEffect } from 'react';
import { supabase } from "../client";


const Profile = () => {
  const [assessmentData, setAssessmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the logged-in user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        setUserEmail(user.email);

        // Fetch the user's ID from the "users" table
        const { data: userData, error: userFetchError } = await supabase
          .from("users")
          .select("id")
          .eq("email", user.email)
          .single();

        if (userFetchError) throw userFetchError;

        const userId = userData.id;

        // Fetch data from all four assessment tables
        const { data: cooperationData } = await supabase.from("Cooperation").select("*");
        const { data: practicalData } = await supabase.from("PracticalContribution").select("*");
        const { data: workEthicData } = await supabase.from("WorkEthic").select("*");
        const { data: conceptualData } = await supabase.from("ConceptualContribution").select("*");

        // Process and combine all assessments into a unified format
        const combinedData = [];

        const addToCombinedData = (data, dimension, commentField) => {
          data.forEach((row) => {
            if (row.Assessedmemberid === userId) {
              const existing = combinedData.find((item) => item.Assessor === row.Assessorid);
              if (existing) {
                existing[dimension] = row.averages;
                if (row[commentField]) {
                  existing.Comments.push(row[commentField]);
                }
              } else {
                combinedData.push({
                  Assessor: row.Assessorid,
                  Cooperation: dimension === "Cooperation" ? row.averages : "-",
                  Practical: dimension === "Practical" ? row.averages : "-",
                  WorkEthic: dimension === "WorkEthic" ? row.averages : "-",
                  Conceptual: dimension === "Conceptual" ? row.averages : "-",
                  Comments: row[commentField] ? [row[commentField]] : [],
                });
              }
            }
          });
        };

        addToCombinedData(cooperationData, "Cooperation", "Commentsection");
        addToCombinedData(practicalData, "Practical", "PracticalComment");
        addToCombinedData(workEthicData, "WorkEthic", "WorkComment");
        addToCombinedData(conceptualData, "Conceptual", "ConceptualComment");

        setAssessmentData(combinedData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="header1">
        <h2 className="dashboard-title">MY ASSESSMENT RESULTS</h2>
      </header>
      <div className="options-container">
        <h3>Logged in as: {userEmail}</h3>
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
                  <th>Assessor</th>
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
                    <td>{row.Assessor}</td>
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
