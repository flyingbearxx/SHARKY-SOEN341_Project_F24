import React, { useState } from "react";
import { supabase } from "../client";

const TeamManagement = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [teamName, setTeamName] = useState("");
  const [students, setStudents] = useState([]);

  const handleStudentCountChange = (event) => {
    const count = parseInt(event.target.value, 10);
    setStudentCount(count);
    setStudents(Array(count).fill(""));
  };
  const options = Array.from({ length: 11 }, (_, i) => i).slice(1); // Generate numbers from 1 to 10

  const handleStudentNameChange = (index, value) => {
    const newStudents = [...students];
    newStudents[index] = value;
    setStudents(newStudents);
  };

  const handleSubmit = async () => {
    if (teamName === "" || students.some((student) => student === "")) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    try {
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .insert([{ teamname: teamName }])
        .select("id")
        .single();

      if (teamError) throw teamError;

      const teamId = teamData.id;
      console.log("teamId", teamId);

      ///
      const { data: users, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .in("email", students);

      console.log(users);

      const teamMembers = users.map((user) => ({
        user_id: user.id,
        team_id: teamId,
      }));

      const { error: insertError } = await supabase
        .from("team_members")
        .insert(teamMembers);

      ///

      // const studentEntries = students.map((studentEmail) => ({
      //   team_id: teamId,
      //   name: studentEmail,
      // }));

      // const { error: studentError } = await supabase
      //   .from("students")
      //   .insert(studentEntries);

      // if (studentError) throw studentError;

      alert("Team and students added successfully!");
    } catch (error) {
      console.error("Error:", error.message);
      alert("Failed to create team or add students.");
    }
  };

  return (
    <div className="container">
      <nav className="sidebar">
        <h2>Menu</h2>
        <ul>
          <li>Team management</li>
          <li>Assessment</li>
          <li>Login</li>
          <li>Create an account</li>
          <li>Contact Us</li>
        </ul>
      </nav>
      <header className="header1">
        <h2>
          Sharky <br /> Peer Assessment
        </h2>
      </header>
      <div className="description">
        <h2 style={{ color: "#daae51" }}>Team Management</h2>
      </div>
      <div className="teamform">
        <div className="toolbar">
          <label>Select number of students:</label>
          <select onChange={handleStudentCountChange} value={studentCount}>
            {Array.from({ length: 11 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
          <button onClick={() => setStudents(Array(studentCount).fill(""))}>
            Generate Inputs
          </button>
        </div>
        {students.map((name, index) => (
          <div key={index} className="student-input">
            <input
              type="text"
              placeholder={`Student ${index + 1} Email`}
              value={name}
              onChange={(e) => handleStudentNameChange(index, e.target.value)}
            />
          </div>
        ))}
        <div className="student-input">
          <label>Team Name:</label>
          <input
            type="text"
            placeholder="Enter Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>
        <div className="button-container">
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
