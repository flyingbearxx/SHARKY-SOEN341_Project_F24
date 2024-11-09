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
  Confirmpage,
  Logout,
  Assessment,
  HandleTeams,
  Welcomepage,
  ConceptualAssessment,
  PracticalAssessment,
  WorkEthicAssessment,
  Dashboard,
} from "./pages/main";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/protectedRoute";
import Layout from "./components/Layout";

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
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <Layout>
            <Welcomepage />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={
          <Layout>
            <LogIn setToken={setToken} />
          </Layout>
        }
      />
      <Route
        path="/signup"
        element={
          <Layout>
            <SignUp />
          </Layout>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <Layout>
            <ForgotPw />
          </Layout>
        }
      />
      <Route
        path="/reset-password"
        element={
          <Layout>
            <ResetPW />
          </Layout>
        }
      />
      <Route
        path="/contact-us"
        element={
          <Layout>
            <ContactUs />
          </Layout>
        }
      />
      <Route
        path="/logout"
        element={
          <Layout>
            <Logout onLogout={handleLogout} />
          </Layout>
        }
      />
      <Route
        path="/conceptualassessment"
        element={
          <Layout>
            <ConceptualAssessment />
          </Layout>
        }
      />
      <Route
        path="/practicalassessment"
        element={
          <Layout>
            <PracticalAssessment />
          </Layout>
        }
      />
      <Route
        path="/workethicassessment"
        element={
          <Layout>
            <WorkEthicAssessment />
          </Layout>
        }
      />

      {/* Protected Routes */}

      {/* Student Homepage */}
      <Route
        path="/homepage"
        element={
          <ProtectedRoute token={token}>
            <Layout>
              <Homepage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Instructor Homepage */}
      <Route
        path="/team-management"
        element={
          <ProtectedRoute token={token}>
            <Layout>
              <TeamManagement />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Student Show Teams */}
      <Route
        path="/show-teams"
        element={
          <ProtectedRoute token={token}>
            <Layout>
              <ShowTeams />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assessment"
        element={
          <ProtectedRoute token={token}>
            <Layout>
              <Assessment />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/conceptual-assessment"
        element={
          <ProtectedRoute token={token}>
            <Layout>
              <ConceptualAssessment />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/practical-assessment"
        element={
          <ProtectedRoute token={token}>
            <Layout>
              <PracticalAssessment />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/work-ethic-assessment"
        element={
          <ProtectedRoute token={token}>
            <Layout>
              <WorkEthicAssessment />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/confirm-page"
        element={
          <ProtectedRoute token={token}>
            <Layout>
              <Confirmpage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Instructor Show/Handle Teams */}
      <Route
        path="/handle-teams"
        element={
          <ProtectedRoute token={token}>
            <Layout>
              <HandleTeams />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Instructor Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute token={token}>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
