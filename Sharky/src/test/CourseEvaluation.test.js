import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { supabase } from "../client";
import CourseEvaluation from "../pages/CourseEvaluation";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

// Mock supabase
jest.mock("../client");

beforeEach(() => {
  jest.clearAllMocks();

  // Mock supabase 'from' method
  supabase.from.mockReturnValue({
    insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
  });

  // Mock window.alert
  window.alert = jest.fn();

  // Mock console.error
  console.error = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("CourseEvaluation Component", () => {

// Unit Test 1: Renders form correctly
  test("renders form correctly", () => {
    render(
      <MemoryRouter>
        <CourseEvaluation />
      </MemoryRouter>
    );

    expect(screen.getByText("Course Evaluation: SOEN 341")).toBeInTheDocument();
    expect(screen.getByText("1. Was the course well-organized and easy to follow?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Write your feedback here...")).toBeInTheDocument();
  });

  // Unit Test 2: allows form submission and resets form after its submission
  test("allows form submission and resets form after its submission", async () => {
    render(
      <MemoryRouter>
        <CourseEvaluation />
      </MemoryRouter>
    );

    // Fill out the form
    fireEvent.click(screen.getAllByRole("radio", { name: /1/i })[0]); // CourseStructure
    fireEvent.click(screen.getAllByRole("radio", { name: /2/i })[1]); // CourseOrganization
    fireEvent.click(screen.getAllByRole("radio", { name: /3/i })[2]); // CourseRelevance
    fireEvent.click(screen.getAllByRole("radio", { name: /4/i })[3]); // CreditHours
    fireEvent.change(screen.getByPlaceholderText("Write your feedback here..."), {
      target: { value: "This is a test comment." },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Submit Evaluation"));

    await waitFor(() => {
      // Ensure form fields are reset
      expect(screen.getByPlaceholderText("Write your feedback here...").value).toBe("");
    });

    // Ensure Supabase insert was called
    expect(supabase.from).toHaveBeenCalledWith("CourseEvaluations");
    expect(supabase.from().insert).toHaveBeenCalledWith([
      {
        courseStructure: "1",
        courseOrganization: "2",
        courseRelevance: "3",
        creditHours: "4",
        commentSection: "This is a test comment.",
      },
    ]);

    // Ensure success alert was shown
    expect(window.alert).toHaveBeenCalledWith("Evaluation submitted successfully!");
  });

  // Unit test 3: shows error message on failed submission
  test("shows error message on failed submission", async () => {
    // Mock error response from supabase
    supabase.from.mockReturnValueOnce({
      insert: jest.fn(() => Promise.resolve({ data: null, error: { message: "Insertion error" } })),
    });

    render(
      <MemoryRouter>
        <CourseEvaluation />
      </MemoryRouter>
    );

    // Fill out the form
    fireEvent.click(screen.getAllByRole("radio", { name: /1/i })[0]); // CourseStructure
    fireEvent.click(screen.getAllByRole("radio", { name: /2/i })[1]); // CourseOrganization
    fireEvent.click(screen.getAllByRole("radio", { name: /3/i })[2]); // CourseRelevance
    fireEvent.click(screen.getAllByRole("radio", { name: /4/i })[3]); // CreditHours
    fireEvent.change(screen.getByPlaceholderText("Write your feedback here..."), {
      target: { value: "This is a test comment." },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Submit Evaluation"));

    await waitFor(() => {
      // Ensure error alert was shown
      expect(window.alert).toHaveBeenCalledWith("Error submitting the evaluation. Please try again.");
    });

    // Ensure error was logged to console
    expect(console.error).toHaveBeenCalledWith("Error submitting form:", "Insertion error");
  });
});
