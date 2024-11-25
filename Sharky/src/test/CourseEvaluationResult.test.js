import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { supabase } from "../client";
import CourseEvaluationResults from "../pages/CourseEvaluationResult"; // Adjust path as needed
import "@testing-library/jest-dom";

// Mock supabase client
jest.mock("../client");

beforeEach(() => {
  jest.clearAllMocks();

  // Mock Supabase `from` for CourseEvaluations
  supabase.from = jest.fn((table) => {
    if (table === "CourseEvaluations") {
      return {
        select: jest.fn().mockReturnValue({
          order: jest.fn(() =>
            Promise.resolve({
              data: [
                {
                  id: 1,
                  courseStructure: 4,
                  courseOrganization: 5,
                  courseRelevance: 4,
                  creditHours: 3,
                  commentSection: "Great course overall!",
                  created_at: "2024-11-24T12:00:00Z",
                },
                {
                  id: 2,
                  courseStructure: 5,
                  courseOrganization: 4,
                  courseRelevance: 5,
                  creditHours: 4,
                  commentSection: "Excellent course organization.",
                  created_at: "2024-11-23T10:00:00Z",
                },
              ],
              error: null,
            })
          ),
        }),
      };
    }
    return {
      select: jest.fn(() =>
        Promise.resolve({
          data: [],
          error: null,
        })
      ),
    };
  });
});

describe("CourseEvaluationResults Component", () => {
  //Unit Test: Checks the loading state
  test("renders loading state initially", () => {
    render(<CourseEvaluationResults />);
    expect(screen.getByText("Loading results...")).toBeInTheDocument();
  });
//Acceptance Test: Checks the fetch of data
  test("fetches and displays evaluation data", async () => {
    render(<CourseEvaluationResults />);
  
    await waitFor(() => {
      // Check if summary table renders with correct averages
      expect(screen.getByText("Summary of Average Ratings")).toBeInTheDocument();
      expect(screen.getByText("Course Structure")).toBeInTheDocument();
  
      // Use getAllByText for multiple matches
      const courseStructureRatings = screen.getAllByText("4.50");
      expect(courseStructureRatings.length).toBeGreaterThanOrEqual(1);
  
      expect(screen.getByText("Credit Hours")).toBeInTheDocument();
      expect(screen.getByText("3.50")).toBeInTheDocument();
  
      // Check if comments table renders
      expect(screen.getByText("Additional Comments")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument(); // First comment
      expect(screen.getByText("Great course overall!")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument(); // Second comment
      expect(screen.getByText("Excellent course organization.")).toBeInTheDocument();
    });
  });
  //Unit Test: Checks handling of empty data response
  test("renders no evaluations submitted message if data is empty", async () => {
    // Mock empty data response
    supabase.from.mockImplementation(() => ({
      select: jest.fn().mockReturnValue({
        order: jest.fn(() =>
          Promise.resolve({
            data: [],
            error: null,
          })
        ),
      }),
    }));

    render(<CourseEvaluationResults />);

    await waitFor(() => {
      expect(screen.getByText("No evaluations submitted yet.")).toBeInTheDocument();
    });
  });
});
