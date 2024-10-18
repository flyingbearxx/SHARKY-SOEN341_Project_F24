import React, { useEffect, useState } from "react";
import { supabase } from "../client";

const ShowTeams = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const { data: teamsData, error } = await supabase.from("teams").select("*");
      if (error) {
        console.error("Error fetching teams:", error.message);
      } else {
        setTeams(teamsData);
      }
    };
    fetchTeams();
  }, []);

  return (
    <div>
      <h2>Teams</h2>
      {teams.length === 0 ? (
        <p>No teams found.</p>
      ) : (
        teams.map((team) => (
          <div key={team.id}>
            <h3>{team.teamname}</h3>
            
          </div>
        ))
      )}
    </div>
  );
};

export default ShowTeams;
