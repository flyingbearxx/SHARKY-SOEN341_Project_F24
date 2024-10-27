import React, { useEffect, useState } from "react";
import { supabase } from "../client";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const ShowTeams = () => {
  const [teams, setTeams] = useState([]); // Holds the teams fetched from the database
  const [selectedTeam, setSelectedTeam] = useState(""); // Holds the selected team from the dropdown
  const [teamMembers, setTeamMembers] = useState([]); // Holds the team members for the selected team
  const [selectedMember, setSelectedMember] = useState(""); // Will hold the selected team member for evaluation

  useEffect(() => {
    const fetchTeams = async () => {
      const { data: teamsData, error } = await supabase
        .from("teams")
        .select(
          `
          id,
          teamname,
          team_members(
            user_id,
            users(
              email
            )
          )
          `
        )
        .order("id", { ascending: true });
      if (error) {
        console.error("Error fetching teams:", error.message);
      } else {
        // Map over the teams to format the data
        const formattedTeams = teamsData.map((team) => ({
          ...team,
          members: team.team_members
            .map((member) => member.users.email)
            .join(", "),
        }));
        setTeams(formattedTeams);
      }
    };
    fetchTeams();
  }, []);

  const handleTeamSelection = (event) => {
    const selectedTeamName = event.target.value;
    setSelectedTeam(selectedTeamName); // Updates the selected team name
    const selectedTeamObj = teams.find(
      (team) => team.teamname === selectedTeamName
    );

    if (selectedTeamObj) {
      // Update the teamMembers state with the emails of the selected team's members
      setTeamMembers(
        selectedTeamObj.team_members.map((member) => member.users.email)
      );
    } else {
      setTeamMembers([]); // Clear if no team is selected
    }
  };

  const handleMemberSelection = (event) => {
    setSelectedMember(event.target.value); // Updates the selected member
  };

  return (
    <div className="show-teams-container">
      <h2>Teams</h2>
      {teams.length === 0 ? (
        <p>No teams found.</p>
      ) : (
        <div>
          {teams.map((team) => (
            <div key={team.id} className="team-item">
              <h3>{team.teamname}</h3>
              <p>Members: {team.members}</p>
            </div>
          ))}
          {/* <div className="team-selection-container">
            <button
              onClick={() => alert(`You are in team: ${selectedTeam}`)}
              className="team-button"
            >
              Which team are you in?
            </button>
            <select value={selectedTeam} onChange={handleTeamSelection}>
              <option value="">Select a team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.teamname}>
                  {team.teamname}
                </option>
              ))}
            </select>
          </div> */}
          {/* <div className="member-selection-container">
            <button
              onClick={() =>
                alert(`You selected to evaluate: ${selectedMember}`)
              }
              className="team-button"
            >
              Which one of your team members would you like to evaluate?
            </button>
            <select value={selectedMember} onChange={handleMemberSelection}>
              <option value="">Select a team member</option>
              {teamMembers.map((member, index) => (
                <option key={index} value={member}>
                  {member}
                </option>
              ))}
            </select>
          </div>  */}
          {/* Link to the Assessment page with the Button */}
          <div className="evaluation-link-container">
            <Link
            to = "/Assessment"
              // to={{
              //   pathname: "/Assessment",
              //   // state: { member: selectedMember,
              //   //   team: selectedTeam
              //   //  },
              // }}
            >
          {/* <button disabled={!selectedMember}>Evaluate Now</button> */}
          <button >Evaluate Now</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowTeams;
