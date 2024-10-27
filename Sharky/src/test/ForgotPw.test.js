import React, { act } from "react"; // Import act from React
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import ForgotPw from "../pages/ForgotPw"; // linking ForgotPw.js to the test file
import '@testing-library/jest-dom';
import { supabase } from "../client"; // Import supabase from client file

// Mock the Supabase client to control the behavior of resetPasswordForEmail
jest.mock("../client", () => ({
    supabase: {
        auth: {
            resetPasswordForEmail: jest.fn(),
        },
    },
}));

describe("ForgotPw Component Simple Tests", () => {
    it("renders the forgot password form", () => {
        render(<ForgotPw />);
        const headingElement = screen.getByText(/Forgot Password/i);
        expect(headingElement).toBeInTheDocument();
    });
});

describe("ForgotPw Component Advanced Tests", () => {
    // Clear previous mock calls before each test to avoid interference
    beforeEach(() => {
        supabase.auth.resetPasswordForEmail.mockClear();
    });

    afterEach(() => {
        cleanup(); // Ensure proper cleanup
    });

    // Test that the Forgot Password form renders correctly
    test("renders the Forgot Password form", () => {
        render(<ForgotPw />);
        expect(screen.getByText("Forgot Password")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    });

    // Test that an invalid email input displays an error message
    test("displays error for invalid email", async () => {
        render(<ForgotPw />);
        const emailInput = screen.getByPlaceholderText("Email");
        const submitButton = screen.getByRole("button", { name: /submit/i });

        fireEvent.change(emailInput, { target: { value: "invalidEmail" } });
        await act(async () => {
            fireEvent.click(submitButton);
        });

        const errorMessage = await screen.findByText(/please enter a valid email/i);
        expect(errorMessage).toBeInTheDocument();
    });

    // Test that a valid email input calls the resetPasswordForEmail function
    test("calls resetPasswordForEmail with valid email", async () => {
        render(<ForgotPw />);
        const emailInput = screen.getByPlaceholderText("Email");
        const submitButton = screen.getByRole("button", { name: /submit/i });

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        await act(async () => {
            fireEvent.click(submitButton);
        });

        // Adjust the expectation to include the redirect options
        expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith("test@example.com", { redirectTo: "http://localhost:3000/reset-password" });
    });
});
