import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './project2.css'; // Link to your CSS file
import babySharkImage from './baby-shark-png-49175.png'; // Ensure you import images

const Assessmentt = () => {
  // Form State
  const [formData, setFormData] = useState({
    assessor_name: '',
    assessed_name: '',
    communication_rating: '',
    participation_rating: '',
    support_rating: '',
    respect_rating: '',
    feedback: ''
  });

  const [teams, setTeams] = useState([]);
  const[loadingTeams, setLoadingTeams] = useState(true);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (if needed, you can implement submit logic)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    // Add logic to submit formData to backend
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('teams') // Replace with your actual table name
        .select('teamname'); // Fetch all columns or specify specific ones

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setTeams(data);
      }
      setLoadingTeams(false);
    };

    fetchData();
  }, []);

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
        <h3 style={{ color: 'black' }}><i>Cooperation Form</i></h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="assessorName">Your Name:</label>
            <input
              type="text"
              id="assessorName"
              name="assessor_name"
              value={formData.assessor_name}
              onChange={handleInputChange}
              required
            />
          </div>


          <div className="form-group">
            <label htmlFor="teamSelect">Select Your Team:</label>
            <select
              id="teamSelect"
              name="team_id"
              value={formData.team_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a team</option>
              {loadingTeams ? (
                <option>Loading...</option>
              ) : (
                teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    Team {team.id}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="assessedName">Teammate's Name:</label>
            <input
              type="text"
              id="assessedName"
              name="assessed_name"
              value={formData.assessed_name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Communication:</label>
            <div className="rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="communication_rating"
                    value={value}
                    checked={formData.communication_rating === String(value)}
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
                    name="participation_rating"
                    value={value}
                    checked={formData.participation_rating === String(value)}
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
                    name="support_rating"
                    value={value}
                    checked={formData.support_rating === String(value)}
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
                    name="respect_rating"
                    value={value}
                    checked={formData.respect_rating === String(value)}
                    onChange={handleInputChange}
                    required
                  /> {value}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="feedback">Additional Feedback:</label>
            <textarea
              id="feedback"
              name="feedback"
              rows="4"
              value={formData.feedback}
              onChange={handleInputChange}
              placeholder="Write any comments here..."
            />
          </div>

          <button type="submit">Submit Assessment</button>
        </form>
        <br />
      </div>

      <div className="image" id="image">
        <img src={babySharkImage} width="270" alt="Sharky" />
      </div>
    </div>
  );
};

export default Assessmentt;
