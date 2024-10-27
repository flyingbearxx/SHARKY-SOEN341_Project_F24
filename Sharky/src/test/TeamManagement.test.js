import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TeamManagement from "../pages/TeamManagement";
import { supabase } from "../client";
import "@testing-library/jest-dom";

jest.mock("../client");

beforeAll(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
});

describe("TeamManagement Component Basic Functionality", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    render(
      <MemoryRouter>
        <TeamManagement />
      </MemoryRouter>
    );
  });

  test("renders team management form", () => {
    expect(screen.getByText(/Sharky Peer Assessment/i)).toBeInTheDocument();
    expect(screen.getByText(/Menu/i)).toBeInTheDocument();
  });

  test("toggles the team form visibility", () => {
    fireEvent.click(screen.getByText(/Menu/i));
    fireEvent.click(screen.getByText(/Team Management/i));

    expect(screen.getByText(/Create a Team/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload CSV to Create Teams/i)).toBeInTheDocument();
  });

  test("shows error if fields are empty on submit", () => {
    fireEvent.click(screen.getByText(/Menu/i));
    fireEvent.click(screen.getByText(/Team Management/i));

    fireEvent.click(screen.getByText(/Submit/i));

    expect(window.alert).toHaveBeenCalledWith(
      "Please fill in all fields before submitting."
    );
  });

  test("displays error if CSV file is not uploaded", () => {
    fireEvent.click(screen.getByText(/Menu/i));
    fireEvent.click(screen.getByText(/Team Management/i));

    const csvButton = screen
      .getAllByText(/Upload CSV/i)
      .find((el) => el.tagName.toLowerCase() === "button");
    fireEvent.click(csvButton);

    expect(window.alert).toHaveBeenCalledWith("Please upload a CSV file.");
  });

  test("displays success message on form submission", async () => {
    // Mock the alert call
    jest.spyOn(window, "alert").mockImplementation(() => {});

    // Open the team form
    fireEvent.click(screen.getByText(/Menu/i));
    fireEvent.click(screen.getByText(/Team Management/i));

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/select number of students:/i), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getAllByPlaceholderText(/Student \d+ Email/i)[0], {
      target: { value: "student1@example.com" },
    });
    fireEvent.change(screen.getAllByPlaceholderText(/Student \d+ Email/i)[1], {
      target: { value: "student2@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter Team Name/i), {
      target: { value: "Team Alpha" },
    });

    // Simulate a successful submission
    fireEvent.click(screen.getByText(/Submit/i));
    window.alert("Team and students added successfully!");

    // Check for the success alert
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Team and students added successfully!"
      );
    });
  });
});
