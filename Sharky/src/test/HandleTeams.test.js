import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HandleTeamInstructor from "../pages/HandleTeamInstructor";
import { supabase } from "../client";
import "@testing-library/jest-dom";

jest.mock("../client");

// Set up a consistent mock for alert across all tests
beforeAll(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {}); // Mock alert
});

describe("HandleTeamInstructor Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock supabase responses to match expected structure
    supabase.from.mockImplementation((table) => {
      if (table === "teams") {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({
            data: [{ id: 1, teamname: "Team Alpha" }],
          }),
        };
      } else if (table === "team_members") {
        return {
          select: jest.fn().mockResolvedValue({
            data: [{ user_id: 1 }],
          }),
          delete: jest.fn().mockResolvedValue({}),
        };
      } else if (table === "users") {
        return {
          select: jest.fn().mockResolvedValue({
            data: [{ id: 1, email: "user1@example.com", is_teacher: false }],
          }),
        };
      }
      return {};
    });
  });

  test("renders loading initially", async () => {
    render(<HandleTeamInstructor />);
    expect(screen.queryByText(/loading teams/i)).toBeInTheDocument();
  });

  test("displays team management options after loading", async () => {
    render(<HandleTeamInstructor />);

    await waitFor(() => {
      expect(screen.getByText(/Team Management Options/i)).toBeInTheDocument();
    });
  });

  test("toggles display teams view", async () => {
    render(<HandleTeamInstructor />);
    await waitFor(() => {
      expect(screen.getByText(/Display Teams/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Display Teams/i));
    expect(screen.getByRole("heading", { name: /Teams/i })).toBeInTheDocument();
  });

  test("toggles modify teams view", async () => {
    render(<HandleTeamInstructor />);
    await waitFor(() => {
      expect(screen.getByText(/Modify Teams/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Modify Teams/i));
    expect(
      screen.getByRole("heading", { name: /Modify Teams/i })
    ).toBeInTheDocument();
  });

  test("toggles add member to teams view", async () => {
    render(<HandleTeamInstructor />);
    await waitFor(() => {
      expect(screen.getByText(/Add Member to Teams/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Add Member to Teams/i));
    expect(
      screen.getByRole("heading", { name: /Add User to Team/i })
    ).toBeInTheDocument();
  });
});
