import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ShowTeams from "../pages/ShowTeams";
import "@testing-library/jest-dom";

describe("ShowTeams Component - Student View with Real Data", () => {
  test("displays 'TeamA' and member 'student1@example.com, student2@example.com, shayheartforever@gmail.com' from real database", async () => {
    // Render the ShowTeams component
    await act(async () => {
      render(
        <MemoryRouter>
          <ShowTeams />
        </MemoryRouter>
      );
    });

    // Wait for elements to appear and assert that they are in the document
    await waitFor(() => {
      expect(screen.getByText("TeamA")).toBeInTheDocument();
      expect(screen.getByText("Members: student1@example.com, student2@example.com, shayheartforever@gmail.com")).toBeInTheDocument();
    });
  });
});
