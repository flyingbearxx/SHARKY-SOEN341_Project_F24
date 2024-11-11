import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ConceptualAssessment from "../pages/ConceptualAssessment";
import "@testing-library/jest-dom";

describe("ConceptualAssessment Component - Basic Rendering and Functionality", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <ConceptualAssessment />
      </MemoryRouter>
    );

    // Mock alert function to catch alert calls
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  test("renders the main headers", () => {
    expect(screen.getByText(/SHARKY PEER ASSESSMENT/i)).toBeInTheDocument();
    expect(screen.getByText(/Evaluation Form/i)).toBeInTheDocument();
  });

  test("renders 'Conceptual Contribution' section header", () => {
    expect(screen.getByText(/ASSESSMENT DIMENSION 2: CONCEPTUAL CONTRIBUTION/i)).toBeInTheDocument();
  });

  test("renders questions under Conceptual Contribution dimension", () => {
    expect(
      screen.getByText(
        /1. Did this team member contribute to researching and gathering relevant information\?/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /2. How would you rate the quality of this team member's contribution to the project\?/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /3. How frequently did the team member suggest ideas that added value to the project\?/i
      )
    ).toBeInTheDocument();
    // Add other questions as needed
  });

  test("renders the comment section for conceptual contribution feedback", () => {
    expect(screen.getByLabelText(/CONCEPTUAL CONTRIBUTION- Additional Feedback:/i)).toBeInTheDocument();
  });

  test("renders 'Next' button for form submission", () => {
    expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument();
  });
});
