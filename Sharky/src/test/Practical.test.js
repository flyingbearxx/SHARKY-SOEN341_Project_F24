import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PracticalAssessment from "../pages/PracticalAssessment";
import { supabase } from "../client";
import "@testing-library/jest-dom";

describe("PracticalAssessment Component - Basic Rendering and Functionality", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <PracticalAssessment />
      </MemoryRouter>
    );
  });

  test("renders the evaluation form title", () => {
    expect(screen.getByText(/Evaluation Form/i)).toBeInTheDocument();
  });

  test("renders practical assessment dimension header", () => {
    expect(screen.getByText(/ASSESSMENT DIMENSION 3: PRACTICAL CONTRIBUTION/i)).toBeInTheDocument();
  });

  test("renders all practical questions", () => {
    expect(
      screen.getByText(/1. How effectively did this team member contribute to the project?/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/2. How effectively did this team member troubleshoot any issues?/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/3. Did this team member actively ensure that all project components were consistent?/i)
    ).toBeInTheDocument();
  
  });

  test("renders comment section", () => {
    expect(screen.getByLabelText(/PRACTICAL CONTRIBUTION - Additional Feedback:/i)).toBeInTheDocument();
  });

  test("renders 'Next' button", () => {
    expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument();
  });


});