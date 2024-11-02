import React, { useState, useEffect } from "react";
import { supabase } from "../client";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


const WorkEthicAssessment = () => {
    const location = useLocation();
    const navigate=useNavigate(); 
    //const member = location.state?.member;
    //const team = location.state?.team;
    
    const initialData = {
      Assessorid: location.state?.Assessorid || '', 
      Assessedmemberid: location.state?.Assessedmemberid || '', 
      Team_id: location.state?.Team_id || ' ', 
    };
  
    // Form State for Work Ethic DIMENTSION
    const [formData, setFormData] = useState({
      ... initialData, //initialize with data passed from Assessment.js
      Work1: '0',
      Work2: '0',
      Work3: '0',
      Work4: '0',
      Work5: '0', 
      Work6: '0', 
      Work7: '0', 
      WorkComment: ' ',
    });
    
      // Handle form input changes
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData, 
        [name]: value,
        }));  
      };
    
    
      // Handle form submission (if needed, you can implement submit logic)
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        
        console.log('Form Data:', formData);
      
        //Validate that required field are set
        const requiredFields = ['Assessorid', 'Assessedmemberid', 'Team_id', 'Work1', 'Work2', 'Work3', 'Work4', 'Work5', 'Work6', 'Work7', 'WorkComment'];
        for (const field of requiredFields){
          if(!formData[field] || formData[field]===''){
            alert(`Field ${field} is required and is missing or undefined.`);
          }
        }
      
        try{
          const { data, error } = await supabase
          .from('WorkEthic')
          .insert([formData]);
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
          WorkComment: ' ', 
          Work1: '0', 
          Work2: '0', 
          Work3: '0', 
          Work4: '0', 
          Work5: '0', 
          Work6: '0', 
          Work7: '0',
          Team_id: 0,
        });

        //Navigate to the next page 
        navigate("/Confirmpage", {
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
                              
    <h2>ASSESSMENT DIMENSION 4: WORK ETHIC</h2>
    <h4>Please choose the number best describing the teammate (1 to 5):</h4>
    <div>
        <p><br/></p>
      </div> 
              <div className="form-group">
                <div className="rating">
                <label><b>1. How reliable was this team member in fulfilling their responsibilities and commitments to the team?</b></label> <div>
       
      </div>
      <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="Work1"
                    value={value}
                    checked={formData.Work1 === String(value)}
                    onChange={handleInputChange}
                    style={{ display: 'none' }} // Hide radio buttons
                    required
                  />
                  <span
                    style={{
                      fontSize: '1.5rem',
                      color: value <= formData.Work1 ? '#FFD700' : '#ccc'
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
                <label><b>2. How well did this team member manage their time and prioritize tasks to meet project deadlines?</b></label>
                <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="Work2"
                    value={value}
                    checked={formData.Work2 === String(value)}
                    onChange={handleInputChange}
                    style={{ display: 'none' }} // Hide radio buttons
                    required
                  />
                  <span
                    style={{
                      fontSize: '1.5rem',
                      color: value <= formData.Work2 ? '#FFD700' : '#ccc'
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
                <label><b>3. How effectively did this team member handle constructive criticism and feedback from the team?</b></label>
    
                <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="Work3"
                    value={value}
                    checked={formData.Work3 === String(value)}
                    onChange={handleInputChange}
                    style={{ display: 'none' }} // Hide radio buttons
                    required
                  />
                  <span
                    style={{
                      fontSize: '1.5rem',
                      color: value <= formData.Work3 ? '#FFD700' : '#ccc'
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
                <label><b>4. How well did this team member demonstrate accountability for their work, taking responsibility for mistakes and learning from them?</b></label>
    
                <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="Work4"
                    value={value}
                    checked={formData.Work4 === String(value)}
                    onChange={handleInputChange}
                    style={{ display: 'none' }} // Hide radio buttons
                    required
                  />
                  <span
                    style={{
                      fontSize: '1.5rem',
                      color: value <= formData.Work4 ? '#FFD700' : '#ccc'
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
                <label><b>5. How positive and proactive was this team member's attitude towards challenges and setbacks?</b></label>
    
                <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="Work5"
                    value={value}
                    checked={formData.Work5 === String(value)}
                    onChange={handleInputChange}
                    style={{ display: 'none' }} // Hide radio buttons
                    required
                  />
                  <span
                    style={{
                      fontSize: '1.5rem',
                      color: value <= formData.Work5 ? '#FFD700' : '#ccc'
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
                <label><b>6. How well did this team member balance their workload to avoid impacting the team negatively during critical phases of the project?</b></label>
    
                <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="Work6"
                    value={value}
                    checked={formData.Work6 === String(value)}
                    onChange={handleInputChange}
                    style={{ display: 'none' }} // Hide radio buttons
                    required
                  />
                  <span
                    style={{
                      fontSize: '1.5rem',
                      color: value <= formData.Work6 ? '#FFD700' : '#ccc'
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
                <label><b>7. How well was this team member prepared for team meetings and group work sessions?</b></label>
    
                <div style={{ display: 'flex', gap: '5px', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="Work7"
                    value={value}
                    checked={formData.Work7 === String(value)}
                    onChange={handleInputChange}
                    style={{ display: 'none' }} // Hide radio buttons
                    required
                  />
                  <span
                    style={{
                      fontSize: '1.5rem',
                      color: value <= formData.Work7 ? '#FFD700' : '#ccc'
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
              <label htmlFor="WorkComment"><b>Work Ethic - Additional Feedback:</b></label>
              <div>
        <p><br/></p>
      </div>  
              <div className="form-group">  
                <textarea
                  id="WorkComment"
                  name="WorkComment"
                  rows="3"
                  style={{width:"100%"}}
                  value={formData.WorkComment}
                  onChange={handleInputChange}
                  placeholder="Write any comments concerning the work ethic here..."
                />
              </div>

    
    
    
    
            {/* Go to Confirm Page */}
            <div style={{ marginTop: "20px" }}>
            <button type="submit">Submit Assessment</button>
            </div> 
            </form>
                <Link
                  to={{
                    pathname: "/Confirmpage",
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
    
    export default WorkEthicAssessment;