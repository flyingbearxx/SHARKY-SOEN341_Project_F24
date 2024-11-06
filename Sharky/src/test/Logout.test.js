import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';  // Import for toBeInTheDocument
import { BrowserRouter as Router } from 'react-router-dom';
import Logout from "../pages/Logout";

describe('Logout', () => {
  it('should render the logout message and button', () => {
    render(
      <Router>
        <Logout />
      </Router>
    );

    // Check if the logout message and button are displayed
    expect(screen.getByText(/You have been logged out/i)).toBeInTheDocument();
    expect(screen.getByText(/Go to Home Page/i)).toBeInTheDocument();
  });
});
