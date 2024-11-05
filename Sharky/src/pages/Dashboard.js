import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Papa from "papaparse";
import ShowTeams from './ShowTeams';


const AverageCalculator = () => {
    const location = useLocation();
    const navigate=useNavigate(); 
    const member = location.state?.member;
    const team = location.state?.team;
  const [teams, setTeams] = useState([]); // Holds the teams fetched from the database
  const [selectedTeam, setSelectedTeam] = useState(""); // Holds the selected team from the dropdown
  const [teamMembers, setTeamMembers] = useState([]); // Holds the team members for the selected team
  const [selectedMember, setSelectedMember] = useState(""); // Will hold the selected team member for evaluation

  const [tableAverages, setTableAverages] = useState({
    table1: null,
    table2: null,
    table3: null,
    table4: null,
  });
  const [overallAverage, setOverallAverage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



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

  useEffect(() => {
    const fetchTable1Average = async () => {
      try {
        const { data, error } = await supabase
          .from('Peer Assessment Questions')
          .select('Communication')
          .select('Participation')
          .select('Assistance')
          .select('Respect')
          .select('Cooperation')
          .select('Conflict_Resolution')
          .select('AdaptibilityandFlexibility'); 

        if (error) throw error;

        if (data.length > 0) {
          const total = data.reduce((sum, item) => sum + item.columnA, 0);
          return total / data.length;
        } else {
          return 0;
        }
      } catch (err) {
        throw new Error(`Peer Assessment Questions fetch error: ${err.message}`);
      }
    };

    const fetchTable2Average = async () => {
      try {
        const { data, error } = await supabase
          .from('ConceptualContribution')
          .select('Conceptual1')
          .select('Conceptual2')
          .select('Conceptual3')
          .select('Conceptual4')
          .select('Conceptual5')
          .select('Conceptual6')
          .select('Conceptual7');
        if (error) throw error;

        if (data.length > 0) {
          const total = data.reduce((sum, item) => sum + item.columnB, 0);
          return total / data.length;
        } else {
          return 0;
        }
      } catch (err) {
        throw new Error(`ConceptualContribution fetch error: ${err.message}`);
      }
    };

    const fetchTable3Average = async () => {
      try {
        const { data, error } = await supabase
          .from('PracticalContribution')
          .select('Practical1') 
          .select('Practical2') 
          .select('Practical3') 
          .select('Practical4') 
          .select('Practical5') 
          .select('Practical6') 
          .select('Practical7') ;

        if (error) throw error;

        if (data.length > 0) {
          const total = data.reduce((sum, item) => sum + item.columnC, 0);
          return total / data.length;
        } else {
          return 0;
        }
      } catch (err) {
        throw new Error(`PracticalContribution fetch error: ${err.message}`);
      }
    };

    const fetchTable4Average = async () => {
      try {
        const { data, error } = await supabase
          .from('WorkEthic')
          .select('Work1')
          .select('Work2')
          .select('Work3')
          .select('Work4')
          .select('Work5')
          .select('Work6')
          .select('Work7');

          if (error) throw error;

        if (data.length > 0) {
          const total = data.reduce((sum, item) => sum + item.columnD, 0);
          return total / data.length;
        } else {
          return 0;
        }
      } catch (err) {
        throw new Error(`WorkEthic fetch error: ${err.message}`);
      }
    };

    const fetchAndCalculateAverages = async () => {
      try {
        const [avg1, avg2, avg3, avg4] = await Promise.all([
          fetchTable1Average(),
          fetchTable2Average(),
          fetchTable3Average(),
          fetchTable4Average()
        ]);

        setTableAverages({
          table1: avg1,
          table2: avg2,
          table3: avg3,
          table4: avg4,
        });

        const overallAvg = (avg1 + avg2 + avg3 + avg4) / 4;
        setOverallAverage(overallAvg);
      } catch (err) {
        setError(`Error calculating averages: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculateAverages();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

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
      setTeamMembers([]); // Clear if no team is selected
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
    
    // if (selectedMember) {
    //   setSelectedMember(selectedMemberEmail);
    //   setFormData(prevFormData => ({
    //     ...prevFormData,
    //     Assessedmemberid: selectedMember.user_id, // Set to the correct user_id in the Cooperation Dimension
    //   }));
    // }
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // setFormData({ ...formData, [name]: value });  //Cooperation Contribution input change
  };

return (
    <div className="container" id="welcomepage">
      <nav className="sidebar">
        <div className="menu-buttons">
        <h2 style={{ color: '#daae51' }}> <br />Menu</h2>
        <Link to="/profile" className="menu-btn">
            Your Profile
          </Link>
        <Link to="/homepage" className="menu-btn">
            Home
          </Link>
          <Link to="/contact-us" className="menu-btn">
            Contact Us
          </Link>
          <Link to="/" className="menu-btn">
            About Us
          </Link>
          <Link to="/logout" className="menu-btn">
            Logout
          </Link>
          </div>
          </nav>

          <header className="header1" id="header1">
        <h2>Sharky <br /> Peer Assessment</h2>
      </header>

      <main>
        {/* Main content or additional logic can go here */}
      </main>

      <div style={{ marginTop: "20px" }}>
          <button
              onClick={() => alert(`You are in team: ${selectedTeam}`)}
              style={{ marginBottom: "10px" }}
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
          </div>
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() =>
                alert(`You selected to evaluate: ${selectedMember}`)
              }
              style={{ marginBottom: "10px" }}
            >
              Which one of your team members would you like to evaluate?
            </button>
            <select value={selectedMember} onChange={handleMemberSelection}>
              <option value="">Select a team member</option>
              {/* {teamMembers.map((member, index) => ( */}
              {teamMembers.map(member => (
                <option key={member.user_id} value={member.email}>
                  {/* {member} */}
                  {member.email}
                </option>
              ))}
            </select>
          </div>
          </div>
          
);
};
export default AverageCalculator;
