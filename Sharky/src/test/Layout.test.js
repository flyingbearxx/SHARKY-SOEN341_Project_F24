import React from "react";
import { render, screen } from "@testing-library/react";
import Layout from "../components/Layout"; 
import "@testing-library/jest-dom";

describe("Layout Component", () => {
    test("renders the DateTime component with correct styling and position", () => {
        // Unit test: Verifies if the DateTime component is rendered correctly within the Layout
      // Render the Layout component
      render(<Layout>Test Content</Layout>);
  
      // Find the DateTime element (assumes DateTime renders dynamic text)
      const dateTimeElement = screen.getByText((content, element) => {
        return element.tagName.toLowerCase() === "p" && element.textContent.trim() !== "";
      });
  
      // Assert the styles applied to the DateTime container
      expect(dateTimeElement.parentElement).toHaveStyle(`
        paddingTop: "10px",
    position: "absolute",
    top: "100px", // Adjusted to push it below the navigation
    right: "20px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#4b0082",
    background: "linear-gradient(to right, #f9f9f9, #ececff)",
    padding: "8px 12px",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    border: "1px solid #6a0dad",
    textAlign: "center",
      `);
    });
    
  // Unit test: Verifies if the Layout component correctly renders its child content
    test("renders child content correctly", () => {
      // Render the Layout component with child content
      render(
        <Layout>
          <p>Test Content</p>
        </Layout>
      );
  
      // Assert that the child content is rendered
      const childContent = screen.getByText("Test Content");
      expect(childContent).toBeInTheDocument();
    });
  });