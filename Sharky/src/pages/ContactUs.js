import React, { useState, useEffect } from 'react';
import { supabase } from "../client"; // Assuming you're importing supabase client

const ContactUs = () => {
  const [comment, setComment] = useState("");  // State to store the comment
  const [status, setStatus] = useState("");    // State to store status message
  const [feedbacks, setFeedbacks] = useState([]); // State to store all feedbacks

  // Fetch existing feedbacks on component mount
  useEffect(() => {
    const fetchFeedbacks = async () => {
      const { data, error } = await supabase.from('feedback').select('*');

      if (error) {
        console.error('Error fetching feedbacks:', error);
        setStatus('Failed to load feedbacks.');
        return;
      }

      // Now, fetch the user emails by user_id
      const feedbackWithEmails = await Promise.all(data.map(async (feedback) => {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email')
          .eq('id', feedback.user_id)
          .single();

        if (userError) {
          console.error('Error fetching user email:', userError);
          feedback.email = 'Unknown user';
        } else {
          feedback.email = userData.email; // Add email to the feedback object
        }

        return feedback;
      }));

      setFeedbacks(feedbackWithEmails);
    };
    
    fetchFeedbacks();
  }, []); // Empty dependency array means this runs only once when the component mounts

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      setStatus('Feedback cannot be empty.');
      return;
    }

    try {
      // Get the logged-in user's UUID
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        setStatus("Please log in before submitting feedback.");
        return;
      }

      // Insert feedback into the database
      const { data, error } = await supabase.from("feedback").insert([
        { comments: comment, user_id: user.id },
      ]);

      if (error) {
        setStatus(`Failed to submit feedback. Error: ${error.message}`);
        return;
      }

      setStatus("Thank you for your feedback!");
      setComment(""); // Clear the input field

      // Fetch the updated feedback list after submission
      const { data: updatedFeedbacks, error: fetchError } = await supabase.from('feedback').select('*');
      if (fetchError) {
        setStatus('Failed to load feedbacks after submission.');
      } else {
        // Now, fetch the user emails by user_id
        const feedbackWithEmails = await Promise.all(updatedFeedbacks.map(async (feedback) => {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('email')
            .eq('id', feedback.user_id)
            .single();

          if (userError) {
            console.error('Error fetching user email:', userError);
            feedback.email = 'Unknown user';
          } else {
            feedback.email = userData.email; // Add email to the feedback object
          }

          return feedback;
        }));

        setFeedbacks(feedbackWithEmails);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setStatus(`Unexpected error: ${error.message}`);
    }
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <div className="contact-info">
        <p>
          For inquiries regarding our services or if you have any questions, please contact us.
        </p>
        <h4>Contact Information for the application&apos;s managers</h4>
        <p>Yameen Adi - ya_adi@live.concordia.ca</p>
        <p>Ana Rostam - rostamana927@gmail.com</p>
        <p>Shaili Hakimpour - shailihakimpour@gmail.com</p>
        <p>Khujista Faqiri - faqiri.khujista@gmail.com</p>
        <p>Raghda Elkei - Raghdaelkei72@gmail.com</p>
      </div>

      <div className="feedback-form">
        <h3>We&apos;d love to hear your feedback about our SHARKY website</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comments here"
            rows="4"
            cols="50"
          />
          <br />
          <button type="submit">Submit Feedback</button>
        </form>

        {status && <p>{status}</p>} {/* Display status message */}

        {/* Display submitted feedbacks */}
        <div className="feedback-list">
          <h4>All Feedback:</h4>
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback) => (
              <div key={feedback.id} className="feedback-item">
                <p><strong>Comment:</strong> {feedback.comments}</p>
                
                <p><strong>Submitted at:</strong> {new Date(feedback.created_at).toLocaleString()}</p>
                <hr />
              </div>
            ))
          ) : (
            <p>No feedback available yet.</p>
          )}
        </div>
      </div>

      <footer>
        <p>&copy; 2024 SHARKY. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ContactUs;