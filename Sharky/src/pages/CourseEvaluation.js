import React, { useState } from "react";
import { supabase } from "../client";
import { useNavigate } from "react-router-dom";

const CourseEvaluation = () => {
  const navigate = useNavigate();

  // State to store form data
  const [formData, setFormData] = useState({
    courseStructure: "",
    courseOrganization: "",
    courseRelevance: "",
    creditHours: "",
    commentSection: "",
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.from("CourseEvaluations").insert([
        {
          courseStructure: formData.courseStructure,
          courseOrganization: formData.courseOrganization,
          courseRelevance: formData.courseRelevance,
          creditHours: formData.creditHours,
          commentSection: formData.commentSection,
        },
      ]);

      if (error) {
        throw error;
      }

      alert("Evaluation submitted successfully!");
      setFormData({
        courseStructure: "",
        courseOrganization: "",
        courseRelevance: "",
        creditHours: "",
        commentSection: "",
      });
      navigate("/homepage");
    } catch (error) {
      console.error("Error submitting form:", error.message);
      alert("Error submitting the evaluation. Please try again.");
    }
  };

  return (
    <div className="course-evaluation-container">
      <header>
        <h2>Course Evaluation: SOEN 341</h2>
      </header>

      <form onSubmit={handleSubmit}>
        {/* Questions for evaluation */}
        <div className="form-group">
          <label>1. Was the course well-organized and easy to follow?</label>
          <div className="radio-group">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name="courseStructure"
                  value={value}
                  checked={formData.courseStructure === String(value)}
                  onChange={handleInputChange}
                  required
                />
                {value}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>
            2. Were assignments and assessments spaced out effectively
            throughout the course?
          </label>
          <div className="radio-group">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name="courseOrganization"
                  value={value}
                  checked={formData.courseOrganization === String(value)}
                  onChange={handleInputChange}
                  required
                />
                {value}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>3. Was the content relevant and up-to-date?</label>
          <div className="radio-group">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name="courseRelevance"
                  value={value}
                  checked={formData.courseRelevance === String(value)}
                  onChange={handleInputChange}
                  required
                />
                {value}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>
            4. Were the workload and expectations appropriate for the credit
            hours?
          </label>
          <div className="radio-group">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name="creditHours"
                  value={value}
                  checked={formData.creditHours === String(value)}
                  onChange={handleInputChange}
                  required
                />
                {value}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Additional Comments:</label>
          <textarea
            name="commentSection"
            value={formData.commentSection}
            onChange={handleInputChange}
            placeholder="Write your feedback here..."
          />
        </div>

        <button type="submit">Submit Evaluation</button>
      </form>
    </div>
  );
};

export default CourseEvaluation;
