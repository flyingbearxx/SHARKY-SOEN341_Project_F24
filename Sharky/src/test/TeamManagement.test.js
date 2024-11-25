import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react";
import { MemoryRouter } from "react-router-dom";
import TeamManagement from "../pages/TeamManagement";
import { supabase } from "../client";
import "@testing-library/jest-dom";
import Papa from "papaparse";

// Mock supabase client
jest.mock("../client");

beforeEach(() => {
  jest.clearAllMocks();

  // Mock supabase methods
  supabase.from = jest.fn((table) => {
    switch (table) {
      case "teams":
        return {
          insert: jest.fn(() => ({
            select: jest.fn(() =>
              Promise.resolve({ data: { id: 1 }, error: null })
            ),
          })),
        };
      case "users":
        return {
          select: jest.fn(() => ({
            in: jest.fn(() =>
              Promise.resolve({
                data: [{ id: 1 }, { id: 2 }],
                error: null,
              })
            ),
          })),
        };
      case "team_members":
        return {
          insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
        };
      default:
        return { insert: jest.fn(() => Promise.resolve({ data: null, error: null })) };
    }
  });
});

jest.mock("papaparse", () => ({
  parse: jest.fn((file, options) => {
    options.complete({
      data: [
        { teamname: "Team Alpha", email: "student1@example.com" },
        { teamname: "Team Alpha", email: "student2@example.com" },
      ],
    });
  }),
}));

//Unit test 1: Renders team management form
describe("TeamManagement Component Tests", () => {
  test("renders header and menu button", () => {
    render(
      <MemoryRouter>
        <TeamManagement />
      </MemoryRouter>
    );

    expect(screen.getByText(/Sharky/i)).toBeInTheDocument();
    expect(screen.getByText("Menu")).toBeInTheDocument();
  });

  // Unit Test 2: Toggles the team form visibility
  test("toggles menu visibility", () => {
    render(
      <MemoryRouter>
        <TeamManagement />
      </MemoryRouter>
    );

    const menuButton = screen.getByText("Menu");
    fireEvent.click(menuButton);

    expect(screen.getByText("Team Management")).toBeInTheDocument();
    expect(screen.getByText("Welcome Page")).toBeInTheDocument();
  });

  // Unit Test 3: Shows error if fields are empty on submit
  test("renders team creation form when 'Team Management' is clicked", () => {
    render(
      <MemoryRouter>
        <TeamManagement />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Menu"));
    fireEvent.click(screen.getByText("Team Management"));

    expect(screen.getByText("Create a Team")).toBeInTheDocument();
    expect(screen.getByText("Upload CSV to Create Teams")).toBeInTheDocument();
  });

  //Unit Test 4: Displays error if CSV file is not uploaded 
  test("handles student input and team name changes", () => {
    render(
      <MemoryRouter>
        <TeamManagement />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Menu"));
    fireEvent.click(screen.getByText("Team Management"));

    const studentCountSelect = screen.getByLabelText("Select number of students:");
    fireEvent.change(studentCountSelect, { target: { value: "2" } });

    const studentInputs = screen.getAllByPlaceholderText(/Student/i);
    fireEvent.change(studentInputs[0], { target: { value: "student1@example.com" } });
    fireEvent.change(studentInputs[1], { target: { value: "student2@example.com" } });

    const teamNameInput = screen.getByPlaceholderText("Enter Team Name");
    fireEvent.change(teamNameInput, { target: { value: "Team Alpha" } });

    expect(studentInputs[0].value).toBe("student1@example.com");
    expect(studentInputs[1].value).toBe("student2@example.com");
    expect(teamNameInput.value).toBe("Team Alpha");
  });

  //Unit Test 5: Displays success message on form submission
  test("submits team and students to the database", async () => {
    render(
      <MemoryRouter>
        <TeamManagement />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Menu"));
    fireEvent.click(screen.getByText("Team Management"));

    fireEvent.change(screen.getByLabelText("Select number of students:"), { target: { value: "2" } });
    fireEvent.change(screen.getAllByPlaceholderText(/Student/i)[0], {
      target: { value: "student1@example.com" },
    });
    fireEvent.change(screen.getAllByPlaceholderText(/Student/i)[1], {
      target: { value: "student2@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter Team Name"), {
      target: { value: "Team Alpha" },
    });

    const submitButton = screen.getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(supabase.from).toHaveBeenCalledWith("teams");
    expect(supabase.from).toHaveBeenCalledWith("users");
    expect(supabase.from).toHaveBeenCalledWith("team_members");
    expect(screen.getByText("Menu")).toBeInTheDocument();
  });

  test("parses and uploads CSV file", async () => {
    render(
      <MemoryRouter>
        <TeamManagement />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Menu"));
    fireEvent.click(screen.getByText("Team Management"));

    const fileInput = screen.getByLabelText(/upload/i);
    const file = new File(["teamname,email\nTeam Alpha,student1@example.com"], "teams.csv", {
      type: "text/csv",
    });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
      fireEvent.click(screen.getByText("Upload CSV"));
    });

    expect(Papa.parse).toHaveBeenCalled();
    expect(supabase.from).toHaveBeenCalledWith("teams");
    expect(supabase.from).toHaveBeenCalledWith("users");
    expect(supabase.from).toHaveBeenCalledWith("team_members");
  });

  test("alerts on missing fields when creating a team", async () => {
    render(
      <MemoryRouter>
        <TeamManagement />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Menu"));
    fireEvent.click(screen.getByText("Team Management"));

    const submitButton = screen.getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(screen.getByText("Please fill in all fields before submitting.")).toBeInTheDocument();
  });
});
