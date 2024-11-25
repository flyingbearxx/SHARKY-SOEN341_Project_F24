import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DateTime from "../components/DateTime";

describe("DateTime Component", () => {


  test("applies the passed style correctly", () => {
    const style = {
      color: "blue",
      fontWeight: "bold",
    };

//Unit test: checks if the style is aapplied correctly.
    // Render the component with a custom style
    render(<DateTime style={style} />);

    // Get the rendered element and check its style
    const dateTimeElement = screen.getByText(/./); // Match any text content
    expect(dateTimeElement.parentElement).toHaveStyle("color: blue");
    expect(dateTimeElement.parentElement).toHaveStyle("font-weight: bold");
  });

  //unit test: checks if the date and time is updated every second.
  test("updates the displayed date and time every second", async () => {
    jest.useFakeTimers();

    // Mock the initial date
    const initialDate = new Date(2024, 10, 25, 10, 30, 0); // Example: Nov 25, 2024, 10:30:00 AM
    jest.setSystemTime(initialDate);

    // Render the component
    render(<DateTime />);

    // Assert initial date and time
    const initialFormattedDate = initialDate.toLocaleString();
    expect(screen.getByText(initialFormattedDate)).toBeInTheDocument();

    // Advance time by 1 second
    jest.advanceTimersByTime(1000);

    // Use `findByText` with `await` to wait for the state update and DOM re-render
    const updatedDate = new Date(initialDate.getTime() + 1000);
    const updatedFormattedDate = updatedDate.toLocaleString();

    const updatedElement = await screen.findByText(updatedFormattedDate);
    expect(updatedElement).toBeInTheDocument();

    // Cleanup fake timers
    jest.useRealTimers();
  });

  //Unit test: check if the DateTime component is cleaning up the interval.
  test("cleans up the interval on component unmount", () => {
    jest.useFakeTimers();
    const clearIntervalSpy = jest.spyOn(global, "clearInterval");
  
    const { unmount } = render(<DateTime />);
    unmount();
  
    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
  
    clearIntervalSpy.mockRestore(); // Restore the original clearInterval function
    jest.useRealTimers();
  });
  
});
