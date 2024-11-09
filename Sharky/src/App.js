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
      <Route path="/" element={<Layout><Welcomepage /></Layout>} />
        <Route path="/login" element={<Layout><LogIn setToken={setToken} /></Layout>} />
        <Route path="/signup" element={<Layout><SignUp /></Layout>} />
        <Route path="/forgot-password" element={<Layout><ForgotPw /></Layout>} />
        <Route path="/reset-password" element={<Layout><ResetPW /></Layout>} />
        <Route path="/contact-us" element={<Layout><ContactUs /></Layout>} />
        <Route path="/logout" element={<Layout><Logout onLogout={handleLogout} /></Layout>} />
        <Route path="/conceptualassessment" element={<Layout><ConceptualAssessment /></Layout>} />
        <Route path="/practicalassessment" element={<Layout><PracticalAssessment /></Layout>} />
        <Route path="/workethicassessment" element={<Layout><WorkEthicAssessment /></Layout>} />


      {/* Protected Routes */}
      


      {/* Student Homepage */}
      <Route
        path="/homepage"
        element={
          <ProtectedRoute token={token}>
            <Homepage />
          </ProtectedRoute>
        }
      />

      {/* Instructor Homepage */}
      <Route
        path="/team-management"
        element={
          <ProtectedRoute token={token}>
            <TeamManagement />
          </ProtectedRoute>
        }
      />

      {/* Student Show teams */}
      <Route
        path="/Show-teams"
        element={
          <ProtectedRoute token={token}>
           
            <ShowTeams/>
          </ProtectedRoute>
        }
      />
       <Route
        path="/Assessment"
        element={
          <ProtectedRoute token={token}>
            <Assessment />
          </ProtectedRoute>
        }
      /> 

        <Route
        path="/ConceptualAssessment"
        element={
          <ProtectedRoute token={token}>
            <ConceptualAssessment />
          </ProtectedRoute>
        }
      /> 

        <Route
        path="/PracticalAssessment"
        element={
          <ProtectedRoute token={token}>
            <PracticalAssessment />
          </ProtectedRoute>
        }
      /> 

        <Route
        path="/WorkEthicAssessment"
        element={
          <ProtectedRoute token={token}>
            <WorkEthicAssessment />
          </ProtectedRoute>
        }
      /> 


      <Route 
      path="/Confirmpage"
      element={
        <ProtectedRoute token={token}>
          <Confirmpage/>
        </ProtectedRoute>
      }
      /> 
      
      <Route 
      path="/Dashboard"
      element={
        <ProtectedRoute token={token}>
          <Dashboard />
        </ProtectedRoute>
      }
      />

      {/* Instructor Show/Handle Teams */}
      <Route
        path="/handle-teams"
        element={
          <ProtectedRoute token={token}>
            <HandleTeams />
          </ProtectedRoute>
        }
      />
    </Routes>
    
  );
};

export default App;
