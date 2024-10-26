import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Papa from "papaparse";
import ShowTeams from './ShowTeams';
// import babySharkImage from './baby-shark-png-49175.png'; // Ensure you import images

const Assessment = () => {
  const location = useLocation();
  // const { member, team} = location.state || {};
  const member = location.state?.member;
  const team = location.state?.team;
  

  // Form State
  const [formData, setFormData] = useState({
    Assessorid: '',
    Assessedmemberid: member,
    Communication: '',
    Participation: '',
    Assistance: '',
    Respect: '',
    Commentsection: '',
    Team_id: team,
  });
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

      setFormData((prevFormData) => ({
        ...prevFormData,
        Team_id: selectedTeamObj.id, // Set the correct team ID
      }));
    }
    
   else {
      setTeamMembers([]); // Clear if no team is selected
      setFormData((prevFormData) => ({
        ...prevFormData,
        Team_id: "", // Clear team ID if no team is selected
      }));
    }
  };

  const handleMemberSelection = (event) => {
    setSelectedMember(event.target.value); // Updates the selected member
   
    
    
  };
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  // Handle form submission (if needed, you can implement submit logic)
  const handleSubmit = async (e) => {
    e.preventDefault();

    
    console.log('Form Data:', formData);
    try{
      const { data, error } = await supabase
      .from('Peer Assessment Questions')
      .insert([
        {
          Assessorid: formData.Assessorid,
          Assessedmemberid: formData.Assessedmemberid,
          Communication: formData.Communication,
          Participation: formData.Participation,
          Assistance: formData.Assistance,
          Respect: formData.Respect,
          Commentsection: formData.Commentsection,
          Team_id: formData.Team_id,
        },
      ]);
      if(error){
        throw error;
      }
    console.log('Form Submitted:', formData);
    alert('Assessment submitted successfully!');
    // Add logic to submit formData to backend

    setFormData({
      Assessorid: '',
      Assessedmemberid: member,
      Communication: '',
      Participation: '',
      Assistance: '',
      Respect: '',
      Commentsection: '',
      Team_id: team,
    });
  } catch (error) {
    console.error('Error submitting form:', error.message);
    alert('Error submitting the assessment. Please try again.'); // Provide user feedback
  }
  };

  return (
    <div className="container" id="welcomepage">
      <nav className="sidebar">
        <h2 style={{ color: '#daae51' }}> <br /> Menu</h2>
        <ul>
          <li><a href="/welcomepage">Home</a></li>
          <li><a href="/team-manage">Team management</a></li>
          <li><a href="/Overview">Teams/Assessment</a></li>
          <li><a href="/login">Login</a></li>
          <li><a href="/create-account">Create an account</a></li>
          <li><a href="/contact-us">Contact Us</a></li>
        </ul>
      </nav>

      <header className="header1" id="header1">
        <h2>Sharky <br /> Peer Assessment</h2>
      </header>

      <main>
        {/* Main content or additional logic can go here */}
      </main>

      <div className="content2" id="content2">
        <h3 style={{ color: 'black' }}><i>Evaluation Form</i></h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="Assessorid">Your Name:</label>
            <input
              type="text"
              id="Assessorid"
              name="Assessorid"
              value={formData.Assessorid}
              onChange={handleInputChange}
              required
            />
          </div>
          
        
          {teams.map((team) => (
            <div key={team.id}>
              <h3>{team.teamname}</h3>
              <p>Members: {team.members}</p>
            </div>
          ))}
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
              {teamMembers.map((member, index) => (
                <option key={index} value={member}>
                  {member}
                </option>
              ))}
            </select>
          </div>


<h4>Please choose the number best describing the teammate (1 to 5):</h4>
          <div className="form-group">
            <label>Communication:</label>
            <div className="rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="Communication"
                    value={value}
                    checked={formData.Communication === String(value)}
                    onChange={handleInputChange}
                    required
                  /> {value}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Participation:</label>
            <div className="rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="Participation"
                    value={value}
                    checked={formData.Participation === String(value)}
                    onChange={handleInputChange}
                    required
                  /> {value}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Support:</label>
            <div className="rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="Assistance"
                    value={value}
                    checked={formData.Assistance === String(value)}
                    onChange={handleInputChange}
                    required
                  /> {value}
                </label>
              ))}
            </div>
          </div>

           <div className="form-group">
            <label>Respect for Others' Ideas:</label>
            <div className="rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="Respect"
                    value={value}
                    checked={formData.Respect === String(value)}
                    onChange={handleInputChange}
                    required
                  /> {value}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="Commentsection">Additional Feedback:</label>
            <textarea
              id="Commentsection"
              name="Commentsection"
              rows="4"
              value={formData.Commentsection}
              onChange={handleInputChange}
              placeholder="Write any comments here..."
            />
          </div>

          <button type="submit">Submit Assessment</button>
        </form>
        <br />
      </div>

      <div className="image" id="image">
        {/* <img src={babySharkImage} width="270" alt="Sharky" /> */}
      </div>
    </div>

  );
};

export default Assessment;
