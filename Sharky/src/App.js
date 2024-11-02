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
      <Route path="/" element={<Welcomepage />} />
      <Route path="/login" element={<LogIn setToken={setToken} />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPw />} />
      <Route path="/reset-password" element={<ResetPW />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
      <Route path="/conceptualassessment" element={<ConceptualAssessment />} /> 
      <Route path="/practicalassessment" element={<PracticalAssessment />} />
      <Route path="/workethicassessment" element={<WorkEthicAssessment />} />
    

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
