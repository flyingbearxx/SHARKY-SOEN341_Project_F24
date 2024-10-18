import React, { useEffect, useState } from "react";
import {
  LogIn,
  SignUp,
  Homepage,
  ContactUs,
  ForgotPw,
  ResetPW,
  TeamManagement,
  ShowTeams,
  Logout,
  Assessment,
} from "./pages/main";
//import Assessment from './pages/Assessment';
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/protectedRoute";

const App = () => {
  const [token, setToken] = useState(false);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      setToken(JSON.parse(storedToken));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setToken(false); // Clear token from state
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<LogIn setToken={setToken} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPw />} />
        <Route path="/reset-password" element={<ResetPW />} />
        <Route path="/team-management" element={<TeamManagement />} />

        {/* Correcting the route for Contact Us */}
        <Route path="/contact-us" element={<ContactUs />} />

        {/* Use lowercase for consistency */}
        <Route path="/homepage" element={<Homepage />} />

        {/* Logout route with the logout function */}
        <Route path="/logout" element={<Logout />} />

        {/* ShowTeams route with the logout function */}
        <Route path="/ShowTeams" element={<ShowTeams />} />

        {/* Assessment route to redirect from ShowTeams */}
        <Route path="/assessment" element={<Assessment />}/>

        <Route
          path="/homepage"
          element={
            <ProtectedRoute token={token}>
              <Homepage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
