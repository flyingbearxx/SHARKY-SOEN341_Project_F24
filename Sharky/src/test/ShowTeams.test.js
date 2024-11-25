import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import { MemoryRouter } from "react-router-dom";
import ShowTeams from "../pages/ShowTeams";
import { supabase } from "../client";
import "@testing-library/jest-dom";

// Mock supabase client
jest.mock("../client");

beforeEach(() => {
  jest.clearAllMocks();

  // Mock supabase.from for fetching teams
  supabase.from = jest.fn((table) => {
    if (table === "teams") {
      return {
        select: jest.fn(() => ({
          order: jest.fn(() =>
            Promise.resolve({
              data: [
                {
                  id: 1,
                  teamname: "Team Alpha",
                  team_members: [
                    {
                      user_id: 1,
                      users: { email: "alpha1@example.com" },
                    },
                    {
                      user_id: 2,
                      users: { email: "alpha2@example.com" },
                    },
                  ],
                },
                {
                  id: 2,
                  teamname: "Team Beta",
                  team_members: [
                    {
                      user_id: 3,
                      users: { email: "beta1@example.com" },
                    },
                    {
                      user_id: 4,
                      users: { email: "beta2@example.com" },
                    },
                  ],
                },
              ],
              error: null,
            })
          ),
        })),
      };
    }
    return { select: jest.fn(() => Promise.resolve({ data: [], error: null })) };
  });
});

describe("ShowTeams Component Tests", () => {
  test("renders loading message initially", () => {
    render(
      <MemoryRouter>
        <ShowTeams />
      </MemoryRouter>
    );

    // Ensure it displays a title
    expect(screen.getByText("Teams")).toBeInTheDocument();
  });

  test("fetches and displays teams", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ShowTeams />
        </MemoryRouter>
      );
    });

    // Wait for teams data to load
    await waitFor(() => {
      expect(screen.getByText("Team Alpha")).toBeInTheDocument();
      expect(screen.getByText("Members: alpha1@example.com, alpha2@example.com")).toBeInTheDocument();
      expect(screen.getByText("Team Beta")).toBeInTheDocument();
      expect(screen.getByText("Members: beta1@example.com, beta2@example.com")).toBeInTheDocument();
    });
  });

  test("displays 'No teams found' message if no teams exist", async () => {
    // Mock supabase to return no data
    supabase.from.mockImplementationOnce(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    }));

    await act(async () => {
      render(
        <MemoryRouter>
          <ShowTeams />
        </MemoryRouter>
      );
    });

    // Ensure it displays a 'No teams found' message
    await waitFor(() => {
      expect(screen.getByText("No teams found.")).toBeInTheDocument();
    });
  });

  test("renders Evaluate Now button with correct link", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ShowTeams />
        </MemoryRouter>
      );
    });

    // Ensure the 'Evaluate Now' button is rendered
    await waitFor(() => {
      const evaluateButton = screen.getByText("Evaluate Now");
      expect(evaluateButton).toBeInTheDocument();
      expect(evaluateButton.closest("a")).toHaveAttribute("href", "/Assessment");
    });
  });
});
