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
        <h2 className="dashboard-title">Instructor Dashboard</h2>
      </header>

      <div className="options-container">
        <h2>Team Evaluation Results</h2>
        <div className="options">
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
          <h3>Summary of Assessment Results</h3>
          <table className="results-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Email</th>
                <th>Team</th>
                <th>Work Ethic</th>
                <th>Practical</th>
                <th>Cooperation</th>
                <th>Conceptual</th>
                <th>Average</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) =>
                workEthicData
                  .filter((entry) => entry.Team_id === team.id)
                  .map((entry, index) => {
                    const practicalEntry = practicalData.find(
                      (p) =>
                        p.Assessedmemberid === entry.Assessedmemberid &&
                        p.Team_id === entry.Team_id
                    );
                    const cooperationEntry = cooperationData.find(
                      (c) =>
                        c.Assessedmemberid === entry.Assessedmemberid &&
                        c.Team_id === entry.Team_id
                    );
                    const conceptualEntry = conceptualData.find(
                      (cc) =>
                        cc.Assessedmemberid === entry.Assessedmemberid &&
                        cc.Team_id === entry.Team_id
                    );

                    const scores = {
                      workEthic: entry.averages,
                      practical: practicalEntry?.averages || 0,
                      cooperation: cooperationEntry?.averages || 0,
                      conceptual: conceptualEntry?.averages || 0,
                    };

                    return (
                      <tr key={index}>
                        <td>{entry.Assessedmemberid}</td>
                        <td>{entry.users.email}</td>
                        <td>{team.teamname}</td>
                        <td>{scores.workEthic}</td>
                        <td>{scores.practical}</td>
                        <td>{scores.cooperation}</td>
                        <td>{scores.conceptual}</td>
                        <td>{calculateOverallAverage(scores)}</td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      )}

      {view === "Detailed" && (
        <div className="results-container">
          <h3>Detailed Assessment Results</h3>
          {teams.map((team) =>
            workEthicData
              .filter((entry) => entry.Team_id === team.id)
              .map((entry) => {
                const assessedMemberId = entry.Assessedmemberid;
                const evaluatedStudentEmail = entry.users?.email || "N/A";

                // Gather all assessments by assessor for this student
                const assessmentsByAssessor = {};

                workEthicData
                  .filter((we) => we.Assessedmemberid === assessedMemberId)
                  .forEach((we) => {
                    assessmentsByAssessor[we.Assessorid] = {
                      ...assessmentsByAssessor[we.Assessorid],
                      workEthic: we.averages,
                    };
                  });

                practicalData
                  .filter((p) => p.Assessedmemberid === assessedMemberId)
                  .forEach((p) => {
                    assessmentsByAssessor[p.Assessorid] = {
                      ...assessmentsByAssessor[p.Assessorid],
                      practical: p.averages,
                    };
                  });

                cooperationData
                  .filter((c) => c.Assessedmemberid === assessedMemberId)
                  .forEach((c) => {
                    assessmentsByAssessor[c.Assessorid] = {
                      ...assessmentsByAssessor[c.Assessorid],
                      cooperation: c.averages,
                    };
                  });

                conceptualData
                  .filter((cc) => cc.Assessedmemberid === assessedMemberId)
                  .forEach((cc) => {
                    assessmentsByAssessor[cc.Assessorid] = {
                      ...assessmentsByAssessor[cc.Assessorid],
                      conceptual: cc.averages,
                    };
                  });

                return (
                  <div key={assessedMemberId} style={{ marginBottom: "30px" }}>
                    <h4 className="team-name">Team: {team.teamname}</h4>
                    <h5 style={{ fontSize: "1.1em" }}>
                      Evaluated Student Email: {evaluatedStudentEmail}
                    </h5>
                    <table className="results-table">
                      <thead>
                        <tr>
                          <th>Assessor ID</th>
                          <th>Cooperation</th>
                          <th>Conceptual</th>
                          <th>Practical</th>
                          <th>Work Ethic</th>
                          <th>Average</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(assessmentsByAssessor).map(
                          ([assessorId, scores], idx) => (
                            <tr key={idx}>
                              <td>{assessorId}</td>
                              <td>{scores.cooperation || "N/A"}</td>
                              <td>{scores.conceptual || "N/A"}</td>
                              <td>{scores.practical || "N/A"}</td>
                              <td>{scores.workEthic || "N/A"}</td>
                              <td>{calculateOverallAverage(scores)}</td>
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
