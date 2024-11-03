import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cxaalqtjgahwhmkzmqmh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4YWFscXRqZ2Fod2hta3ptcW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2NDkzNzgsImV4cCI6MjA0NjIyNTM3OH0.-bUGamqKOiiptXRzWgGsQMGNLy2XFmG4h1E-tMiz5z0";
export const supabase = createClient(supabaseUrl, supabaseKey);
