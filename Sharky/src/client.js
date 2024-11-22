import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cxaalqtjgahwhmkzmqmh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4YWFscXRqZ2Fod2hta3ptcW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2NDkzNzgsImV4cCI6MjA0NjIyNTM3OH0.-bUGamqKOiiptXRzWgGsQMGNLy2XFmG4h1E-tMiz5z0";
export const supabase = createClient(supabaseUrl, supabaseKey);

// Listen for authentication state changes and save session to localStorage
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session) {
    // Save the session to localStorage for persistence
    localStorage.setItem("supabaseSession", JSON.stringify(session));
  } else {
    // Clear the session from localStorage if user logs out
    localStorage.removeItem("supabaseSession");
  }
});

// Function to retrieve the session from localStorage
export const getCurrentSession = () => {
  const storedSession = localStorage.getItem("supabaseSession");
  return storedSession ? JSON.parse(storedSession) : null;
};

// Function to set the session back into Supabase after a page reload
export const restoreSession = async () => {
  const session = getCurrentSession();
  if (session) {
    supabase.auth.setSession(session);
  }
};