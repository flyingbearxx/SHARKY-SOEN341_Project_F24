import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Papa from "papaparse";
import ShowTeams from './ShowTeams';
// import babySharkImage from './baby-shark-png-49175.png'; // Ensure you import images

const Assessment = () => {
  const location = useLocation();
  const navigate=useNavigate(); 
  const member = location.state?.member;
  const team = location.state?.team;
  

  // Form State for COOPERATION DIMENTSION
  const [formData, setFormData] = useState({
    Assessorid: '',
    Assessedmemberid: member,
    Team_id: team,
    Communication: '',
    Participation: '',
    Assistance: '',
    Respect: '',
    Cooperation: '', 
    Conflict_Resolution: '', 
    AdaptibilityandFlexibility: '', 
    Commentsection: '',
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
//////////////////////
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
}, [selectedTeam]); // Dependency on selectedTeam
/////////////////////

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

      setFormData((prevFormData) => ({
        ...prevFormData,
        Team_id: selectedTeamObj.id, // Set the correct team ID
      }));

    }else {
      setTeamMembers([]); // Clear if no team is selected
      setFormData((prevFormData) => ({
        ...prevFormData,
        Team_id: "", // Clear team ID if no team is selected
      }));
    }

    


  };


  


  const handleMemberSelection = (event) => {
    // setSelectedMember(event.target.value); // Updates the selected member

    const selectedMemberEmail = event.target.value;
    const selectedMember = teamMembers.find(member => member.email === selectedMemberEmail);
    
    if (selectedMember) {
      setSelectedMember(selectedMemberEmail);
      setFormData(prevFormData => ({
        ...prevFormData,
        Assessedmemberid: selectedMember.user_id, // Set to the correct user_id in the Cooperation Dimension
      }));
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });  //Cooperation Contribution input change
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
          Cooperation: formData.Cooperation,
          Conflict_Resolution: formData.Conflict_Resolution,
          AdaptibilityandFlexibility: formData.AdaptibilityandFlexibility, 
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
      Assessorid: formData.Assessorid,
      Assessedmemberid: formData.Assessedmemberid,
      Communication: '',
      Participation: '',
      Assistance: '',
      Respect: '',
      Commentsection: '',
      Cooperation: '', 
      Conflict_Resolution: '', 
      AdaptibilityandFlexibility: '', 
      Team_id: formData.Team_id,
    });
    navigate("/ConceptualAssessment", {
      state:{ 
        //member: formData.Assessedmemberid, team: formData.Team_id }, 
        Assessorid: formData.Assessorid, 
        Assessedmemberid: formData.Assessedmemberid, 
        Team_id: formData.Team_id,
      }
    }); 
  } catch (error) {
    console.error('Error submitting form:', error.message);
    alert('Error submitting the assessment. Please try again.'); // Provide user feedback
  }
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

      <div className="content2" id="content2">
      <h3 style={{ color: 'black', textAlign: 'center'}}><i>Evaluation Form</i></h3>
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
       
 {/* Show the selected team and member */}
        {/* <h3>Selected Team: {team}</h3>
        <h3>Evaluating Member: {member}</h3> */}
        {/* { member && team ? (
          <p>You are evaluating {member} from team {team}.</p>) : (
            <p>No team member selected for evaluation.</p>
          )} */}
        
       
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
      
<h2>ASSESSMENT DIMENSION: COOPERATION</h2>
<h4>Please choose the number best describing the teammate (1 to 5):</h4>
<div>
    <p><br/></p>
  </div> 
          <div className="form-group">
            <div className="rating">
            <label><b>1. Did this team member communicate effectively with the rest of the group?</b></label> <div>
   
  </div>
  <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value}>
              <input
                type="radio"
                name="Communication"
                value={value}
                checked={formData.Communication === String(value)}
                onChange={handleInputChange}
                style={{ display: 'none' }} // Hide radio buttons
                required
              />
              <span
                style={{
                  fontSize: '1.5rem',
                  color: value <= formData.Communication ? '#FFD700' : '#ccc'
                }}
              >
                ★
              </span>
            </label>
          ))}
        </div>
            </div>
          </div>      
  <div>
    <p><br/></p>
  </div>      
<div className="form-group">
            
            <div className="rating">
            <label><b>2. Did this team member actively participate in group discussions?</b></label>
            <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value}>
              <input
                type="radio"
                name="Participation"
                value={value}
                checked={formData.Participation === String(value)}
                onChange={handleInputChange}
                style={{ display: 'none' }} // Hide radio buttons
                required
              />
              <span
                style={{
                  fontSize: '1.5rem',
                  color: value <= formData.Participation ? '#FFD700' : '#ccc'
                }}
              >
                ★
              </span>
            </label>
          ))}
        </div>
            </div>
          </div>
          <div>
    <p><br/></p>
  </div> 
          <div className="form-group">
            <div className="rating">
            <label><b>3. Was this team member willing to assist others when needed?</b></label>

            <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value}>
              <input
                type="radio"
                name="Assistance"
                value={value}
                checked={formData.Assistance === String(value)}
                onChange={handleInputChange}
                style={{ display: 'none' }} // Hide radio buttons
                required
              />
              <span
                style={{
                  fontSize: '1.5rem',
                  color: value <= formData.Assistance ? '#FFD700' : '#ccc'
                }}
              >
                ★
              </span>
            </label>
          ))}
        </div>
            </div>
          </div>
          <div>
    <p><br/></p>
  </div> 
          <div className="form-group">
            <div className="rating">
            <label><b>4. Did this team member respect and consider the ideas and perspectives of others?</b></label>

            <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value}>
              <input
                type="radio"
                name="Respect"
                value={value}
                checked={formData.Respect === String(value)}
                onChange={handleInputChange}
                style={{ display: 'none' }} // Hide radio buttons
                required
              />
              <span
                style={{
                  fontSize: '1.5rem',
                  color: value <= formData.Respect ? '#FFD700' : '#ccc'
                }}
              >
                ★
              </span>
            </label>
          ))}
        </div>
            </div>
          </div>
          <div>
    <p><br/></p>
  </div> 
  <div className="form-group">
            <div className="rating">
            <label><b>5. How well did this team member adapt to changes in the project or team dynamics?</b></label>

            <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value}>
              <input
                type="radio"
                name="AdaptibilityandFlexibility"
                value={value}
                checked={formData.AdaptibilityandFlexibility === String(value)}
                onChange={handleInputChange}
                style={{ display: 'none' }} // Hide radio buttons
                required
              />
              <span
                style={{
                  fontSize: '1.5rem',
                  color: value <= formData.AdaptibilityandFlexibility ? '#FFD700' : '#ccc'
                }}
              >
                ★
              </span>
            </label>
          ))}
        </div>
            </div>
          </div>
          <div>
    <p><br/></p>
  </div> 
  <div className="form-group">
            <div className="rating">
            <label><b>6. Did they collaborate to find solutions rather than escalate issues?</b></label>

            <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value}>
              <input
                type="radio"
                name="Conflict_Resolution"
                value={value}
                checked={formData.Conflict_Resolution === String(value)}
                onChange={handleInputChange}
                style={{ display: 'none' }} // Hide radio buttons
                required
              />
              <span
                style={{
                  fontSize: '1.5rem',
                  color: value <= formData.Conflict_Resolution ? '#FFD700' : '#ccc'
                }}
              >
                ★
              </span>
            </label>
          ))}
        </div>
            </div>
          </div>
          <div>
    <p><br/></p>
  </div> 
  <div className="form-group">
            <div className="rating">
            <label><b>7. Did this team member collaborate effectively and contribute to a positive team environment?</b></label>

            <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value}>
              <input
                type="radio"
                name="Cooperation"
                value={value}
                checked={formData.Cooperation === String(value)}
                onChange={handleInputChange}
                style={{ display: 'none' }} // Hide radio buttons
                required
              />
              <span
                style={{
                  fontSize: '1.5rem',
                  color: value <= formData.Cooperation ? '#FFD700' : '#ccc'
                }}
              >
                ★
              </span>
            </label>
          ))}
        </div>
            </div>
          </div>
          <div>
    <p><br/></p>
  </div> 
  {/* COMMENT SECTION */}
          <label htmlFor="Commentsection"><b>COOPERATION - Additional Feedback:</b></label>
          <div>
    <p><br/></p>
  </div>  
          <div className="form-group">  
            <textarea
              id="Commentsection"
              name="Commentsection"
              rows="3"
              style={{width:"100%"}}
              value={formData.Commentsection}
              onChange={handleInputChange}
              placeholder="Write any comments here..."
            />
          </div>




        {/* Go to Next Assessment dimension: Conceptual Contribution */}
        <div style={{ marginTop: "20px" }}>
        <button type="submit">NEXT</button>
        </div> 
        </form>
            <Link
              to={{
                pathname: "/ConceptualAssessment",
                state: { member: selectedMember,
                  team: selectedTeam
                 },
              }}
            >
            </Link>
          </div>
          <div>
    <p><br/></p>
 
      </div>
      <div className="image" id="image">
        {/* <img src={babySharkImage} width="270" alt="Sharky" /> */}
      </div>
    </div>

  );
};

export default Assessment;
