import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Use MemoryRouter for isolated tests
import ResetPW from "../pages/ResetPW"; // Adjust the import as necessary
import "@testing-library/jest-dom";

describe("ResetPW Component - Basic Rendering and Functionality", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <ResetPW />
      </MemoryRouter>
    );

    // Mock alert function to catch alert calls
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  test("renders the form header", () => {
    expect(screen.getByText(/Create New Password/i)).toBeInTheDocument();
  });

  test("renders 'Confirm New Password' input field", () => {
    expect(screen.getByPlaceholderText(/Confirm New Password/i)).toBeInTheDocument();
  });

  test("renders 'Submit' button", () => {
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
  });

});
