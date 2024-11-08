import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Papa from "papaparse";
import ShowTeams from './ShowTeams';

const Dashboard = () => {

  const [selectedoption, setselectedoption] = useState(null);
  const [teams, setTeams] = useState([]); // Holds the teams fetched from the database
  const [selectedTeam, setSelectedTeam] = useState(""); // Holds the selected team from the dropdown
  const [teamMembers, setTeamMembers] = useState([]); // Holds the team members for the selected team
  const [selectedMember, setSelectedMember] = useState(""); // Will hold the selected team member for evaluation
  const [scores, setscores] = useState({});
  const [showResults, setShowResults] = useState(false);

    const toggleOption = (option) => {
        if(selectedoption === option){
            setselectedoption(null);
        } else{
            setselectedoption(option);

        }
    };
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

      useEffect(() => {
        const fetchTeamMembers = async () => {
          if (!selectedTeam) return; // If no team is selected, exit early
          const { data: membersData, error } = await supabase
            .from("team_members")
            .select("user_id, users(email)")
            .eq("team_id", selectedTeam.id); // Assuming you have a field for team_id in team_members
          
          if (error) {
            console.error("Error fetching team members:", error.message);
          } else {
            // Update the teamMembers state with the fetched data
            setTeamMembers(membersData.map(member => ({
              email: member.users.email,
              user_id: member.user_id,
            })));
          }
        };
        fetchTeamMembers();
      }, [selectedTeam]);

    //   useEffect(() => {
        const fetchscores = async () => {
            if(!selectedTeam || !selectedMember) {
                // alert("Please select both a team and a team member!");
                return;
            }
            try{
                const [cooperationdata, conceptualdata, practicaldata, workdata] = await Promise.all([
                    supabase.from("Peer Assessment Questions").select("averages").eq("user_id", selectedMember.user_id),
                    supabase.from("ConceptualContribution").select("averages").eq("user_id", selectedMember.user_id),
                    supabase.from("PracticalContribution").select("averages").eq("user_id", selectedMember.user_id),
                    supabase.from("WorkEthic").select("averages").eq("user_id", selectedMember.user_id),
                ]);
                if(
                    cooperationdata.error ||
                    conceptualdata.error ||
                    practicaldata.error ||
                    workdata.error 
                ) {
                    console.error("Error fetching averages");
                    return;
                }

        const cooperation = cooperationdata.data[0]?.score || 0;
        const conceptual = conceptualdata.data[0]?.score || 0;
        const practical = practicaldata.data[0]?.score || 0;
        const work = workdata.data[0]?.score || 0;
        const average = ((cooperation + conceptual + practical + work) / 4).toFixed(2);

        setscores({ cooperation, conceptual, practical, work, average});
        setShowResults(true);

            }catch(error){
                console.error("Error fetching scores: ", error);
            }
        };
        fetchscores();
    // });
    //   }, [selectedMember]);

      const handleTeamSelection = async (event) => {
        const selectedTeamName = event.target.value;
        setSelectedTeam(selectedTeamName); // Updates the selected team name
        
        const selectedTeamObj = teams.find(
          (team) => team.teamname === selectedTeamName
        );
    
        if (selectedTeamObj) {
          // Update the teamMembers state with the emails of the selected team's members
          setTeamMembers(
            selectedTeamObj.team_members.map((member) => ({
              ////////////
              email: member.users.email,
              user_id: member.user_id,})
            )
          );
    
        //   setFormData((prevFormData) => ({
        //     ...prevFormData,
        //     Team_id: selectedTeamObj.id, // Set the correct team ID
        //   }));
    
        }else {
        //   setTeamMembers([]); // Clear if no team is selected
        //   setFormData((prevFormData) => ({
        //     ...prevFormData,
        //     Team_id: "", // Clear team ID if no team is selected
        //   }));
        }
    
        
    
    
      };

      const handleMemberSelection = (event) => {
        // setSelectedMember(event.target.value); // Updates the selected member
    
        const selectedMemberEmail = event.target.value;
        const selectedMember = teamMembers.find(member => member.email === selectedMemberEmail);
        
        if (selectedMember) {
          setSelectedMember(selectedMemberEmail);
        //   setFormData(prevFormData => ({
        //     ...prevFormData,
        //     Assessedmemberid: selectedMember.user_id, // Set to the correct user_id in the Cooperation Dimension
        //   }));
        }
      };

    return(

        <div className = "container">
            <header className = "header1">
            <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          alt="Logo"
          className="logo"
        />
        <h2>Sharky Peer Assessment</h2>
            </header>
            <div className = "options-container">
                <h2>Team Evaluation Results</h2>
                <div className = "options">
                    <button 
                    className = "option-btn"
                    onClick={() => toggleOption("SummaryofResults")}>
                        Summary of Results
                    </button>
                    <button 
                    className = "option-btn"
                    onClick= {() => toggleOption("DetailedResults")}>
                        Detailed Results
                    </button>
                </div>

                {/*Team and Teammember selection*/}
                {selectedoption === "SummaryofResults" && (
                    <div>
                    <div className = "selectors">
                        <label>
                            Select Team: 
                            <select value = {selectedTeam.teamname || ""} onChange={handleTeamSelection}>
                                <option value=""> --Select Team --</option>
                                {teams.map((team) => (
                    <option key={team.id} value={team.teamname}>{team.teamname}</option>
                  ))}
                            </select>
                        </label>
                        {teamMembers.length > 0 && (
                <label>
                  Select Member:
                  <select value={selectedMember.email || ""} onChange={handleMemberSelection}>
                    <option value="">-- Select Member --</option>
                    {teamMembers.map((member) => (
                      <option key={member.user_id} value={member.email}>{member.email}</option>
                    ))}
                  </select>
                </label>
              )}</div>

              {/* Show Results Button */}
            {selectedTeam && selectedMember && (
              <button onClick={() => fetchscores()}>Show Results</button>
            )}



                {/* Summary of Results*/}
                {showResults && (
                    <table className = "table">
                        <thead>
                            <tr>
                                <th> Name </th>
                                <th> Team Name </th>
                                <th> Cooperation </th>
                                <th> Conceptual </th>
                                <th> Practical </th>
                                <th> Work </th>
                                <th> Average </th>
                            </tr>
                        </thead>
                        <tbody>
                        {scores && (
                <tr>
                  <td>{selectedMember}</td>
                  <td>{selectedTeam}</td>
                  <td>{scores.cooperation}</td>
                  <td>{scores.conceptual}</td>
                  <td>{scores.practical}</td>
                  <td>{scores.work}</td>
                  <td>{scores.average}</td>
                </tr>
              )}
                        </tbody>
                    </table>
                    )}
                    </div>
                )}


            </div>
            
        </div>
         );
};
export default Dashboard;