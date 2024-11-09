import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


const PracticalAssessment = () => {
    const location = useLocation();
    const navigate=useNavigate(); 
    //const member = location.state?.member;
    //const team = location.state?.team;
    
    const initialData = {
      Assessorid: location.state?.Assessorid || '', 
      Assessedmemberid: location.state?.Assessedmemberid || '', 
      Team_id: location.state?.Team_id || ' ', 
    };
  
    // Form State for PRACTICAL CONTRIBUTION DIMENTSION
    const [formData, setFormData] = useState({
      ... initialData, //initialize with data passed from Assessment.js
      Practical1: '0',
      Practical2: '0',
      Practical3: '0',
      Practical4: '0',
      Practical5: '0', 
      Practical6: '0', 
      Practical7: '0', 
      PracticalComment: ' ',
    });

    const [averagescore, setaveragescore] = useState("");
    
      // Handle form input changes
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData, 
        [name]: value,
        }));  
      };
    
      useEffect(() => {
        const calcualteAverage = () => {
        const totalscore = 
        Number(formData.Practical1) + 
        Number(formData.Practical2) +
        Number(formData.Practical3) + 
        Number(formData.Practical4) +
        Number(formData.Practical5) + 
        Number(formData.Practical6) +
        Number(formData.Practical7);
    
        const average = totalscore / 7;
        setaveragescore(average);
      };
      calcualteAverage();
    }, [formData]);
    
      // Handle form submission (if needed, you can implement submit logic)
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        
        console.log('Form Data:', formData);
      
        //Validate that required field are set
        const requiredFields = ['Assessorid', 'Assessedmemberid', 'Team_id', 'Practical1', 'Practical2', 'Practical3', 'Practical4', 'Practical5', 'Practical6', 'Practical7', 'PracticalComment'];
        for (const field of requiredFields){
          if(!formData[field] || formData[field]===''){
            alert(`Field ${field} is required and is missing or undefined.`);
          }
        }
      
        try{
          const { data, error } = await supabase
          .from('PracticalContribution')
          .insert([
            {
              Assessedmemberid: formData.Assessedmemberid,
              Assessorid: formData.Assessorid,
              Team_id: formData.Team_id,
              Practical1: formData.Practical1,
              Practical2: formData.Practical2,
              Practical3: formData.Practical3,
              Practical4: formData.Practical4,
              Practical5: formData.Practical5,
              Practical6: formData.Practical6,
              Practical7: formData.Practical7,
              PracticalComment: formData.PracticalComment,
              averages: averagescore,
            }
          ]);
          if(error){
            console.error('Supabase error details: ', error);
            throw error;
          }
          
    
        console.log('Form Submitted:', formData);
        alert('Assessment submitted successfully!');
        
         
        // Reset form data after submission
        setFormData({
          Assessorid: 0,
          Assessedmemberid: 0,
          PracticalComment: ' ', 
          Practical1: '0', 
          Practical2: '0', 
          Practical3: '0', 
          Practical4: '0', 
          Practical5: '0', 
          Practical6: '0', 
          Practical7: '0',
          Team_id: 0,
        });

        //Navigate to the next page with inherited data
        navigate("/WorkEthicAssessment", {
            state:{  
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
             
            
            
           

                              {/* QUESTIONS */}      
                              
    <h2>ASSESSMENT DIMENSION 3: PRACTICAL CONTRIBUTION</h2>
    <h4>Please choose the number best describing the teammate (1 to 5):</h4>
    <div>
        <p><br/></p>
      </div> 
              <div className="form-group">
                <div className="rating">
                <label><b>1. How effectively did this team member contribute to the project?</b></label> <div>
       
      </div>
      <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="Practical1"
                    value={value}
                    checked={formData.Practical1 === String(value)}
                    onChange={handleInputChange}
                    style={{ display: 'none' }} // Hide radio buttons
                    required
                  />
                  <span
                    style={{
                      fontSize: '1.5rem',
                      color: value <= formData.Practical1 ? '#FFD700' : '#ccc'
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
                <label><b>2. How effectively did this team member troubleshoot any issues or obstacles that arose during the project?</b></label>
                <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="Practical2"
                    value={value}
                    checked={formData.Practical2 === String(value)}
                    onChange={handleInputChange}
                    style={{ display: 'none' }} // Hide radio buttons
                    required
                  />
                  <span
                    style={{
                      fontSize: '1.5rem',
                      color: value <= formData.Practical2 ? '#FFD700' : '#ccc'
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
                <label><b>3. Did this team member actively ensure that all project components were consistent and aligned with the team's objectives?</b></label>
    
                <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="Practical3"
                    value={value}
                    checked={formData.Practical3 === String(value)}
                    onChange={handleInputChange}
                    style={{ display: 'none' }} // Hide radio buttons
                    required
                  />
                  <span
                    style={{
                      fontSize: '1.5rem',
                      color: value <= formData.Practical3 ? '#FFD700' : '#ccc'
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
                <label><b>4. How well did this team member take initiative in gathering or organizing resources that were beneficial to the team's practical tasks?</b></label>
    
                <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="Practical4"
                    value={value}
                    checked={formData.Practical4 === String(value)}
                    onChange={handleInputChange}
                    style={{ display: 'none' }} // Hide radio buttons
                    required
                  />
                  <span
                    style={{
                      fontSize: '1.5rem',
                      color: value <= formData.Practical4 ? '#FFD700' : '#ccc'
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
                <label><b>5. How much effort did this team member put into refining the project's final output to ensure it met the expected standards? </b></label>
    
                <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="Practical5"
                    value={value}
                    checked={formData.Practical5 === String(value)}
                    onChange={handleInputChange}
                    style={{ display: 'none' }} // Hide radio buttons
                    required
                  />
                  <span
                    style={{
                      fontSize: '1.5rem',
                      color: value <= formData.Practical5 ? '#FFD700' : '#ccc'
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
                <label><b>6. How often did this team member volunteer to take on additional practical tasks to support the project?</b></label>
    
                <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="Practical6"
                    value={value}
                    checked={formData.Practical6 === String(value)}
                    onChange={handleInputChange}
                    style={{ display: 'none' }} // Hide radio buttons
                    required
                  />
                  <span
                    style={{
                      fontSize: '1.5rem',
                      color: value <= formData.Practical6 ? '#FFD700' : '#ccc'
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
                <label><b>7. How supportive was this team member in assisting others with their practical tasks when they encountered difficulties?</b></label>
    
                <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="Practical7"
                    value={value}
                    checked={formData.Practical7 === String(value)}
                    onChange={handleInputChange}
                    style={{ display: 'none' }} // Hide radio buttons
                    required
                  />
                  <span
                    style={{
                      fontSize: '1.5rem',
                      color: value <= formData.Practical7 ? '#FFD700' : '#ccc'
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
              <label htmlFor="PracticalComment"><b>PRACTICAL CONTRIBUTION - Additional Feedback:</b></label>
              <div>
        <p><br/></p>
      </div>  
              <div className="form-group">  
                <textarea
                  id="PracticalComment"
                  name="PracticalComment"
                  rows="3"
                  style={{width:"100%"}}
                  value={formData.PracticalComment}
                  onChange={handleInputChange}
                  placeholder="Write any comments concering the Practical Contribution here..."
                />
              </div>

    
    
    
    
            {/* Go to next assessment dimension: Work Ethic Contribution */}
            <div style={{ marginTop: "20px" }}>
            <button type="submit">Next</button>
            </div> 
            </form>
                <Link
                  to={{
                    pathname: "/WorkEthicAssessment",
                  }}
                >
                </Link>
              </div>
              <div>
        <p><br/></p>
     
          </div>

        </div>
    
      );
    };
    
    export default PracticalAssessment;