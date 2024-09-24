import React, { useEffect, useState } from "react";
import { LogIn, SignUp, Homepage, ContactUs } from "./pages/main";
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

  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", JSON.stringify(token));
    }
  }, [token]);

  return (
    <div>
      <Routes>
        <Route path={"/"} element={<LogIn setToken={setToken} />} />
        <Route path={"/signup"} element={<SignUp />} />
        <Route
          path="/homepage"
          element={
            <ProtectedRoute token={token}>
              <Homepage />
            </ProtectedRoute>
          }
        />
        <Route path={"/contactus"} element={<ContactUs />} />
      </Routes>
    </div>
  );
};

export default App;
