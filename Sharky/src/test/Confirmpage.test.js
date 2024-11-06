import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';  // Import for toBeInTheDocument
import { BrowserRouter as Router } from 'react-router-dom';
import Confirmpage from "../pages/Confirmpage";

describe('Confirmpage', () => {
  it('should render the confirmation message and button', () => {
    render(
      <Router>
        <Confirmpage />
      </Router>
    );

    // Check if the confirmation message is displayed
    expect(screen.getByText(/Thank you for filling out the form/i)).toBeInTheDocument();

    // Check if the "Go to Home Page" button is displayed
    expect(screen.getByText(/Go to Home Page/i)).toBeInTheDocument();
  });
});
