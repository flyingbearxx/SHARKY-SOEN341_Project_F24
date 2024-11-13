import React, { useState, useEffect } from "react";
import { supabase } from "../client";

const Dashboard = () => {
  const [workEthicData, setWorkEthicData] = useState([]);
  const [practicalData, setPracticalData] = useState([]);
  const [cooperationData, setCooperationData] = useState([]);
  const [conceptualData, setConceptualData] = useState([]);
  const [teams, setTeams] = useState([]);
  const [view, setView] = useState("Summary");

  useEffect(() => {

// added code. 
    const fetchData = async () => {
      try {
        const { data: teamsData, error: teamsError } = await supabase
          .from("teams")
          .select("id, teamname")
          .order("id", { ascending: true });
        if (teamsError) throw teamsError;
        setTeams(teamsData);

        const { data: workEthicData, error: workEthicError } = await supabase
          .from("WorkEthic")
          .select(
            `
            Team_id,
            Assessedmemberid,
            Assessorid,
            averages,
            WorkComment,
            users:Assessedmemberid (email)
          `
          )
          .order("Team_id", { ascending: true });
        if (workEthicError) throw workEthicError;
        setWorkEthicData(workEthicData);


        const { data: practicalData, error: practicalError } = await supabase
          .from("PracticalContribution")
          .select(
            `
            Team_id,
            Assessedmemberid,
            Assessorid,
            averages,
            PracticalComment,
            users:Assessedmemberid (email)
          `
          )
          .order("Team_id", { ascending: true });
        if (practicalError) throw practicalError;
        setPracticalData(practicalData);

        const { data: cooperationData, error: cooperationError } =
          await supabase
            .from("Cooperation")
            .select(
              `
            Team_id,
            Assessedmemberid,
            Assessorid,
            averages,
            Commentsection,
            users:Assessedmemberid (email)
          `
            )
            .order("Team_id", { ascending: true });
        if (cooperationError) throw cooperationError;
        setCooperationData(cooperationData);

        const { data: conceptualData, error: conceptualError } = await supabase
          .from("ConceptualContribution")
          .select(
            `
            Team_id,
            Assessedmemberid,
            Assessorid,
            averages,
            ConceptualComment,
            users:Assessedmemberid (email)
          `
          )
          .order("Team_id", { ascending: true });
        if (conceptualError) throw conceptualError;
        setConceptualData(conceptualData);

      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };


    fetchData();
  }, []); 

  const calculateOverallAverage = (scores) => {
    const values = Object.values(scores);
    const total = values.reduce((acc, curr) => acc + (curr || 0), 0);
    return (total / values.length).toFixed(2);
  };

  return (
    <div className="dashboard-container">
      <header className="header1">
        <h2 className="dashboard-title">SHARKY PEER Assessment
        </h2>
      </header>

      <div className="options-container" style={{
         display: "flex",
         flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
  }}>
        <h2>Team Evaluation Results</h2>
        <div className="options"
         style={{
          display: "flex",
          gap: "10px",
        }}>
          <button
            className="option-btn"
            onClick={() => setView("Summary")}
            style={{
              backgroundColor: view === "Summary" ? "#7d3c98" : "#9b59b6",
            }}
          >
            Summary of Results
          </button>
          <button
            className="option-btn"
            onClick={() => setView("Detailed")}
            style={{
              backgroundColor: view === "Detailed" ? "#7d3c98" : "#9b59b6",
            }}
          >
            Detailed Results
          </button>
        </div>
      </div>

      {view === "Summary" && (
        <div className="results-container">
           <div className="table-title" >Summary of Assessment Results</div>
          <table className="results-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Team</th>
                <th>Student Email</th>
                <th>Cooperation</th>
                <th>Conceptual</th>
                <th>Practical</th>
                <th>Work Ethic</th>
                <th>Overall Average</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) =>
                workEthicData
                  .filter((entry) => entry.Team_id === team.id)
                  .map((entry, idx) => (
                    <tr key={idx}>
                     
                      <td>{entry.Assessedmemberid}</td>
                      <td>{team.teamname}</td>
                      <td>{entry.users?.email || "N/A"}</td>
                      <td>
                        {
                          cooperationData.find(
                            (c) => c.Assessedmemberid === entry.Assessedmemberid
                          )?.averages || "N/A"
                        }
                      </td>
                      <td>
                        {
                          conceptualData.find(
                            (cc) =>
                              cc.Assessedmemberid === entry.Assessedmemberid
                          )?.averages || "N/A"
                        }
                      </td>
                      <td>
                        {
                          practicalData.find(
                            (p) => p.Assessedmemberid === entry.Assessedmemberid
                          )?.averages || "N/A"
                        }
                      </td>
                      <td>{entry.averages || "N/A"}</td>
                      <td>
                        {calculateOverallAverage({
                          workEthic: entry.averages,
                          practical: practicalData.find(
                            (p) => p.Assessedmemberid === entry.Assessedmemberid
                          )?.averages,
                          cooperation: cooperationData.find(
                            (c) => c.Assessedmemberid === entry.Assessedmemberid
                          )?.averages,
                          conceptual: conceptualData.find(
                            (cc) =>
                              cc.Assessedmemberid === entry.Assessedmemberid
                          )?.averages,
                        })}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      )}

{view === "Detailed" && (
        <div className="results-container">
          <div className="table-title" >Detailed Assessment Results</div>
          {teams.map((team) =>
            workEthicData
              .filter((entry) => entry.Team_id === team.id)
              .map((entry) => {
                const assessedMemberId = entry.Assessedmemberid;
                const evaluatedStudentEmail = entry.users?.email || "N/A";

                const assessmentsByAssessor = {};

                workEthicData
                  .filter((we) => we.Assessedmemberid === assessedMemberId)
                  .forEach((we) => {
                    assessmentsByAssessor[we.Assessorid] = {
                      ...assessmentsByAssessor[we.Assessorid],
                      workEthic: we.averages,
                      workComment: we.WorkComment,
                    };
                  });

                practicalData
                  .filter((p) => p.Assessedmemberid === assessedMemberId)
                  .forEach((p) => {
                    assessmentsByAssessor[p.Assessorid] = {
                      ...assessmentsByAssessor[p.Assessorid],
                      practical: p.averages,
                      practicalComment: p.PracticalComment,
                    };
                  });

                cooperationData
                  .filter((c) => c.Assessedmemberid === assessedMemberId)
                  .forEach((c) => {
                    assessmentsByAssessor[c.Assessorid] = {
                      ...assessmentsByAssessor[c.Assessorid],
                      cooperation: c.averages,
                      cooperationComment: c.Commentsection,
                    };
                  });

                conceptualData
                  .filter((cc) => cc.Assessedmemberid === assessedMemberId)
                  .forEach((cc) => {
                    assessmentsByAssessor[cc.Assessorid] = {
                      ...assessmentsByAssessor[cc.Assessorid],
                      conceptual: cc.averages,
                      conceptualComment: cc.ConceptualComment,
                    };
                  });

                return (
                  <div key={entry.Assessedmemberid} className="team-assessment">
                    <div className="team-info-box">
                    <h3>Team: {team.teamname}</h3>
                    <h4>Assessor ID: {entry.Assessorid}</h4>
                    </div>

                    <table className="results-table">
                      <thead>
                        <tr>
                          <th>Team Member Email</th>
                          <th>Cooperation</th>
                          <th>Conceptual</th>
                          <th>Practical</th>
                          <th>Work Ethic</th>
                          <th>Average</th>
                          <th>Comments</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(assessmentsByAssessor).map(
                          ([assessorId, scores], idx) => (

                            <tr key={idx}>
                              <td>{evaluatedStudentEmail}</td>
                              <td>{scores.cooperation || "N/A"}</td>
                              <td>{scores.conceptual || "N/A"}</td>
                              <td>{scores.practical || "N/A"}</td>
                              <td>{scores.workEthic || "N/A"}</td>
                              <td>
                                {calculateOverallAverage({
                                  cooperation: scores.cooperation,
                                  conceptual: scores.conceptual,
                                  practical: scores.practical,
                                  workEthic: scores.workEthic,
                                })}
                              </td>
                              <td>
                                <ul>
                                  <li><b>Work:</b> {scores.workComment || "No comment"}</li>
                                  <li><b>Practical:</b> {scores.practicalComment || "No comment"}</li>
                                  <li><b>Cooperation:</b> {scores.cooperationComment || "No comment"}</li>
                                  <li><b>Conceptual:</b> {scores.conceptualComment || "No comment"}</li>
                                </ul>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                );
              })
          )}
        </div>
      )}
    </div>
  );
};
export default Dashboard;
