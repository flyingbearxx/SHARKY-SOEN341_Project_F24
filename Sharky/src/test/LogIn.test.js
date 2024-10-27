import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LogIn from "../pages/LogIn";
import { supabase } from "../client";
import "@testing-library/jest-dom";

jest.mock("../client");

describe("LogIn Component Basic Functionality", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    render(
      <MemoryRouter>
        <LogIn setToken={jest.fn()} />
      </MemoryRouter>
    );
  });

  test("renders login form", () => {
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();

    // Get the Login button specifically within the form
    const loginButtons = screen.getAllByText("Login");
    const loginFormButton = loginButtons.find(
      (button) => button.closest("form") !== null
    );
    expect(loginFormButton).toBeInTheDocument();
  });

  test("displays error if login credentials are incorrect", async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      error: { message: "Invalid login" },
    });

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "wronguser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpassword" },
    });

    // Find the specific Login button within the form and click it
    const loginFormButton = screen
      .getAllByRole("button", { name: /login/i })
      .find((button) => button.closest("form") !== null);
    fireEvent.click(loginFormButton);

    const errorMessage = await screen.findByText(/invalid login/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test("successful login displays no error", async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { session: "mockSessionData" },
    });

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "halabelamri198@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "test123" },
    });

    // Find the specific Login button within the form and click it
    const loginFormButton = screen
      .getAllByRole("button", { name: /login/i })
      .find((button) => button.closest("form") !== null);
    fireEvent.click(loginFormButton);

    await waitFor(() => {
      const errorMessage = screen.queryByText(/invalid login/i);
      expect(errorMessage).not.toBeInTheDocument();
    });
  });
});
