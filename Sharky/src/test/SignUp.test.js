import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignUp from "../pages/SignUp"; 
import { supabase } from "../client";
import "@testing-library/jest-dom";

jest.mock("../client");

describe("SignUp Component Basic Functionality", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
  });

  test("renders sign-up form", () => {
    // Check if the email, username, and password fields are rendered
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();

    // Get the Sign Up button specifically within the form
    const signUpButtons = screen.getAllByText("Sign Up");
    const signUpFormButton = signUpButtons.find(
      (button) => button.closest("form") !== null
    );
    expect(signUpFormButton).toBeInTheDocument();
  });

  test("successful sign-up displays no error", async () => {
    supabase.auth.signUp.mockResolvedValueOnce({
      data: { user: "mockUserData" },
      error: null,
    });

    // Fill in the form fields
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "shayheartforever@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "shayheartforever@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });

    // Find the specific Sign Up button within the form and click it
    const signUpFormButton = screen
      .getAllByRole("button", { name: /sign up/i })
      .find((button) => button.closest("form") !== null);
    fireEvent.click(signUpFormButton);

    await waitFor(() => {
      const errorMessage = screen.queryByText(/sign-up failed/i);
      expect(errorMessage).not.toBeInTheDocument();
    });
  });
});
