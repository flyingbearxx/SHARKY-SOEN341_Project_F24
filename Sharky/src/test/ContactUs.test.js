import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { act } from "react";
import ContactUs from "../pages/ContactUs";
import { supabase } from "../client";
import "@testing-library/jest-dom";

// Mock supabase client
jest.mock("../client");

beforeEach(() => {
  jest.clearAllMocks();

  // Mock supabase.auth.getUser
  supabase.auth = {
    getUser: jest.fn().mockResolvedValue({
      data: { user: { id: 1, email: "testuser@example.com" } },
      error: null,
    }),
  };

  // Mock supabase.from for feedback and user data
  supabase.from = jest.fn((table) => {
    if (table === "feedback") {
      return {
        insert: jest.fn(() =>
          Promise.resolve({
            data: [{ id: 2, comments: "Test feedback", user_id: 1, created_at: new Date().toISOString() }],
            error: null,
          })
        ),
        select: jest.fn(() =>
          Promise.resolve({
            data: [
              { id: 1, comments: "Great work!", user_id: 1, created_at: new Date().toISOString() },
              { id: 2, comments: "Test feedback", user_id: 1, created_at: new Date().toISOString() },
            ],
            error: null,
          })
        ),
      };
    }
    if (table === "users") {
      return {
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: { email: "testuser@example.com" },
              error: null,
            }),
          })),
        })),
      };
    }
    return { select: jest.fn(() => Promise.resolve({ data: [], error: null })) };
  });
});

describe("ContactUs Component Tests", () => {
  test("renders contact information and feedback form", () => {
    render(<ContactUs />);
    expect(screen.getByText(/We'd love to hear your feedback/i)).toBeInTheDocument();
  });

  test("fetches and displays feedbacks from database", async () => {
    await act(async () => {
      render(<ContactUs />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Great work!/i)).toBeInTheDocument();
    });
  });

  test("submits feedback and displays success message", async () => {
    await act(async () => {
      render(<ContactUs />);
    });

    const textarea = screen.getByPlaceholderText("Enter your comments here");
    const submitButton = screen.getByText("Submit Feedback");

    await act(async () => {
      fireEvent.change(textarea, { target: { value: "Test feedback" } });
      fireEvent.click(submitButton);
    });

    // Ensure the success message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Thank you for your feedback!/i)).toBeInTheDocument();
    });

    // Ensure the new feedback appears in the list
    await waitFor(() => {
      const feedbackItems = screen.getAllByText(/Test feedback/i);
      expect(feedbackItems.length).toBeGreaterThan(0);
    });
  });

  test("displays error when submitting empty feedback", async () => {
    render(<ContactUs />);
    const submitButton = screen.getByText("Submit Feedback");

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Feedback cannot be empty/i)).toBeInTheDocument();
    });
  });
});

