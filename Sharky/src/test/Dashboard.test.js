import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { act } from "react";
import Dashboard from "../pages/Dashboard";
import { supabase } from "../client";
import "@testing-library/jest-dom";

// AT-15

// Mock Supabase client
jest.mock("../client");

beforeEach(() => {
  jest.clearAllMocks();

  // Mock Supabase data fetching
  supabase.from = jest.fn((table) => {
    switch (table) {
      case "teams":
        return {
          select: jest.fn(() => ({
            order: jest.fn(() =>
              Promise.resolve({
                data: [{ id: 1, teamname: "Team A" }, { id: 2, teamname: "Team B" }],
                error: null,
              })
            ),
          })),
        };
      case "WorkEthic":
      case "PracticalContribution":
      case "Cooperation":
      case "ConceptualContribution":
        return {
          select: jest.fn(() => ({
            order: jest.fn(() =>
              Promise.resolve({
                data: [
                  {
                    Team_id: 1,
                    Assessedmemberid: 1,
                    Assessorid: 2,
                    averages: 4.5,
                    WorkComment: "Excellent effort",
                    PracticalComment: "Solid work",
                    Commentsection: "Great teamwork",
                    ConceptualComment: "Good understanding",
                    users: { email: "student1@example.com" },
                  },
                ],
                error: null,
              })
            ),
          })),
        };
      default:
        return { select: jest.fn(() => Promise.resolve({ data: [], error: null })) };
    }
  });
});

//Unit Test /: Renders loading state initially
describe("Dashboard Component Tests", () => {
  test("renders loading state initially", () => {
    render(<Dashboard />);
    expect(screen.getByText("Team Evaluation Results")).toBeInTheDocument();
  });

  //Unit Test 2: Fetches and displays data in "Summary' view
  test("fetches and displays data in 'Summary' view", async () => {
    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText("Summary of Assessment Results")).toBeInTheDocument();
      expect(screen.getByText("Team A")).toBeInTheDocument();
      expect(screen.getByText("student1@example.com")).toBeInTheDocument();
    });
  });

  //Unit Test 3: Fetches and displays data in "Detailed" view
  test("fetches and displays data in 'Detailed' view", async () => {
    await act(async () => {
      render(<Dashboard />);
    });

    // Switch to "Detailed" view
    const detailedButton = screen.getByText("Detailed Results");
    act(() => {
      fireEvent.click(detailedButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Detailed Assessment Results")).toBeInTheDocument();

      // Use a flexible matcher to check for "Team A"
      const teamNameElement = screen.getByText((content, element) => {
        return content.includes("Team A");
      });
      expect(teamNameElement).toBeInTheDocument();

      // Verify other details
      expect(screen.getByText("Excellent effort")).toBeInTheDocument();
    });
  });

  // Unit Test 4: Switches between "Summary" and "Detailed" views
  test("switches between 'Summary' and 'Detailed' views", async () => {
    await act(async () => {
      render(<Dashboard />);
    });

    // Verify initial view is "Summary"
    expect(screen.getByText("Summary of Assessment Results")).toBeInTheDocument();

    // Switch to "Detailed" view
    const detailedButton = screen.getByText("Detailed Results");
    act(() => {
      fireEvent.click(detailedButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Detailed Assessment Results")).toBeInTheDocument();
    });

    // Switch back to "Summary" view
    const summaryButton = screen.getByText("Summary of Results");
    act(() => {
      fireEvent.click(summaryButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Summary of Assessment Results")).toBeInTheDocument();
    });
  });

  //Unit Test 5: Displays error message if data fetching fails
  test("displays error message if data fetching fails", async () => {
    // Mock an error for the teams table
    supabase.from.mockImplementationOnce(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() =>
          Promise.resolve({
            data: null,
            error: { message: "Failed to fetch data" },
          })
        ),
      })),
    }));

    jest.spyOn(console, "error").mockImplementation(() => {});

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Error fetching data:", "Failed to fetch data");
    });
  });
});

