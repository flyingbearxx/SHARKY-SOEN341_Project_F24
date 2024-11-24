import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import WorkEthicAssessment from "../pages/WorkEthicAssessment";
import "@testing-library/jest-dom";

describe("WorkEthicAssessment Component - Basic Rendering and Functionality", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <WorkEthicAssessment />
      </MemoryRouter>
    );

    // Mock alert function to catch alert calls
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });
//Unit Test: The header
  test("renders the main headers", () => {
    expect(screen.getByText(/SHARKY PEER ASSESSMENT/i)).toBeInTheDocument();
    expect(screen.getByText(/Evaluation Form/i)).toBeInTheDocument();
  });
//Unit Test: The section's header
  test("renders 'Work Ethic' section header", () => {
    expect(screen.getByText(/ASSESSMENT DIMENSION 4: WORK ETHIC/i)).toBeInTheDocument();
  });
//Unit Test: The questions of the page
  test("renders questions under Work Ethic dimension", () => {
    expect(
      screen.getByText(
        /1. How reliable was this team member in fulfilling their responsibilities and commitments to the team\?/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /2. How well did this team member manage their time and prioritize tasks to meet project deadlines\?/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /3. How effectively did this team member handle constructive criticism and feedback from the team\?/i
      )
    ).toBeInTheDocument();
  });
//Unit Test: The comment section
  test("renders the comment section for work ethic feedback", () => {
    expect(screen.getByLabelText(/Work Ethic - Additional Feedback:/i)).toBeInTheDocument();
  });
//Unit Test: The submit button
  test("renders 'Submit Assessment' button", () => {
    expect(screen.getByRole("button", { name: /Submit Assessment/i })).toBeInTheDocument();
  });

});
