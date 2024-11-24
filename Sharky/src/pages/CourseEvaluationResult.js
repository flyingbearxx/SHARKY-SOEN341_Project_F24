import React, { useState, useEffect } from "react";
import { supabase } from "../client";

const CourseEvaluationResults = () => {
  const [results, setResults] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Fetch all course evaluation data
        const { data, error } = await supabase
          .from("CourseEvaluations")
          .select("*")
          .order("id", { ascending: true });

        if (error) throw error;

        // Separate comments
        const extractedComments = data
          .filter((entry) => entry.commentSection) // Keep only rows with comments
          .map((entry) => ({
            id: entry.id,
            comment: entry.commentSection,
            created_at: entry.created_at,
          }));

        setResults(data);
        setComments(extractedComments);
      } catch (err) {
        console.error("Supabase Fetch Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  // Calculate averages for ratings
  const calculateAverages = (evaluations) => {
    if (!evaluations.length) return {};

    const totalRatings = evaluations.reduce(
      (totals, evaluation) => {
        totals.courseStructure += Number(evaluation.courseStructure || 0);
        totals.courseOrganization += Number(evaluation.courseOrganization || 0);
        totals.courseRelevance += Number(evaluation.courseRelevance || 0);
        totals.creditHours += Number(evaluation.creditHours || 0);
        totals.count += 1;
        return totals;
      },
      { courseStructure: 0, courseOrganization: 0, courseRelevance: 0, creditHours: 0, count: 0 }
    );

    return {
      courseStructure: (totalRatings.courseStructure / totalRatings.count).toFixed(2),
      courseOrganization: (totalRatings.courseOrganization / totalRatings.count).toFixed(2),
      courseRelevance: (totalRatings.courseRelevance / totalRatings.count).toFixed(2),
      creditHours: (totalRatings.creditHours / totalRatings.count).toFixed(2),
    };
  };

  const averages = calculateAverages(results);

  return (
    <div className="header">
          <header  className="header1" id="header1">
    <h2> Sharky Peer Assessment</h2>
     </header>

   <div className="course-evaluation-results-container"> 
   <header>
      <h3><i>Course Evaluation Results: SOEN 341</i></h3>
      </header>
      {loading ? (
        <p>Loading results...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : results.length === 0 ? (
        <p>No evaluations submitted yet.</p>
      ) : (
        <div>
          {/* Ratings Summary Table */}
          <h3 style={{flexDirection: "column", textAlign: "center",}}>Summary of Average Ratings</h3>
          <table className="results-table2">
            <thead>
              <tr>
                <th>Evaluation Aspect</th>
                <th>Average Rating (1-5)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Course Structure</td>
                <td>{averages.courseStructure}</td>
              </tr>
              <tr>
                <td>Course Organization</td>
                <td>{averages.courseOrganization}</td>
              </tr>
              <tr>
                <td>Course Relevance</td>
                <td>{averages.courseRelevance}</td>
              </tr>
              <tr>
                <td>Credit Hours</td>
                <td>{averages.creditHours}</td>
              </tr>
            </tbody>
          </table>

          {/* Comments Table */}
          <h3 style={{flexDirection: "column", textAlign: "center",}}>Additional Comments</h3>
          {comments.length > 0 ? (
            <table className="results-table2">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment, index) => (
                  <tr key={comment.id}>
                    <td>{index + 1}</td>
                    <td>{comment.comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No comments available.</p>
          )}
        </div>
      )}
    </div>
    </div>
  );
};
export default CourseEvaluationResults;
