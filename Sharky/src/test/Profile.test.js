import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import Profile from "../pages/Profile";
import { supabase } from "../client";
import "@testing-library/jest-dom";

// Mock supabase client
jest.mock("../client");

beforeEach(() => {
  jest.clearAllMocks();

  // Mock supabase.auth.getUser
  supabase.auth = {
    getUser: jest.fn().mockResolvedValue({
      data: { user: { email: "testuser@example.com" } },
      error: null,
    }),
  };

  // Mock supabase.from for table data
  supabase.from = jest.fn((table) => {
    switch (table) {
      case "users":
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: { id: 1, profilepic: "test-pic.jpg" },
                error: null,
              }),
            })),
          })),
        };
      case "Cooperation":
      case "PracticalContribution":
      case "WorkEthic":
      case "ConceptualContribution":
        return {
          select: jest.fn(() =>
            Promise.resolve({
              data: [
                {
                  Assessorid: 2,
                  Assessedmemberid: 1,
                  averages: 4.5,
                  Commentsection: "Great teamwork!",
                },
              ],
              error: null,
            })
          ),
        };
      default:
        return { select: jest.fn(() => Promise.resolve({ data: [], error: null })) };
    }
  });

  // Mock supabase.storage
  supabase.storage = {
    from: jest.fn(() => ({
      download: jest.fn().mockResolvedValue({
        data: new Blob(["dummy content"]),
        error: null,
      }),
      upload: jest.fn().mockResolvedValue({ error: null }),
      getPublicUrl: jest.fn().mockReturnValue({
        publicURL: "https://example.com/test-pic.jpg",
        error: null,
      }),
    })),
  };

  // Mock URL.createObjectURL
  global.URL.createObjectURL = jest.fn(() => "blob:https://example.com/test-pic.jpg");
});

describe("Profile Component Tests", () => {
  //Unit Test: Loading state
  test("renders loading state initially", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
//Acceptance Test: Fetch of the data
  test("fetches and displays user data", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      );
    });

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByText(/Logged in as:/i)).toBeInTheDocument();
      expect(screen.getByText(/testuser@example.com/i)).toBeInTheDocument();
    });

    // Check profile picture is displayed
    const profilePic = screen.getByAltText("Profile");
    expect(profilePic).toBeInTheDocument();
    expect(profilePic).toHaveAttribute("src", "blob:https://example.com/test-pic.jpg");
  });
});
