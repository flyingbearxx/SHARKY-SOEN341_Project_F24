import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Assessment from "../pages/Assessment";
import "@testing-library/jest-dom";

describe("Assessment Component - Basic Rendering and Functionality", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Assessment />
      </MemoryRouter>
    );

    // Mock alert function to catch alert calls
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  test("renders the main headers", () => {
    expect(screen.getByText(/SHARKY PEER ASSESSMENT/i)).toBeInTheDocument();
    expect(screen.getByText(/Evaluation Form/i)).toBeInTheDocument();
  });

  test("renders 'Your Name' input field", () => {
    expect(screen.getByLabelText(/Your Name:/i)).toBeInTheDocument();
  });

  test("renders team selection dropdown", () => {
    expect(screen.getByText(/Which team are you in\?/i)).toBeInTheDocument();
    expect(screen.getAllByRole("combobox")[0]).toBeInTheDocument(); // Select a team dropdown
  });

  test("renders team member selection dropdown", () => {
    expect(
      screen.getByText(
        /Which one of your team members would you like to evaluate\?/i
      )
    ).toBeInTheDocument();
    expect(screen.getAllByRole("combobox")[1]).toBeInTheDocument(); // Select a team member dropdown
  });

  test("renders assessment dimension section header", () => {
    expect(
      screen.getByText(/ASSESSMENT DIMENSION: COOPERATION/i)
    ).toBeInTheDocument();
  });

  test("renders questions under cooperation dimension", () => {
    expect(
      screen.getByText(
        /1. Did this team member communicate effectively with the rest of the group\?/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /2. Did this team member actively participate in group discussions\?/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /3. Was this team member willing to assist others when needed\?/i
      )
    ).toBeInTheDocument();
  });

  test("renders the comment section for cooperation feedback", () => {
    expect(
      screen.getByLabelText(/COOPERATION - Additional Feedback:/i)
    ).toBeInTheDocument();
  });

  test("renders 'NEXT' button for form submission", () => {
    expect(screen.getByRole("button", { name: /NEXT/i })).toBeInTheDocument();
  });

  test("does not submit if any input field is empty", async () => {
    // Fill in the 'Your Name' field
    fireEvent.change(screen.getByLabelText(/Your Name:/i), {
      target: { value: "Student Name" },
    });

    // Attempt to submit the form without selecting a team and member
    fireEvent.click(screen.getByRole("button", { name: /NEXT/i }));

    // Check for the alert message shown for submission errors
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Error submitting the assessment. Please try again."
      );
    });
  });
});
