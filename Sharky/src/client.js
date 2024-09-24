import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sqlhvrevvwbudndyvtfe.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxbGh2cmV2dndidWRuZHl2dGZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4ODIwNzQsImV4cCI6MjA0MjQ1ODA3NH0.C00hW1BCUH3lEZZtY0ru4BdPiVQfv6eXO4ik4TE4b7E";
export const supabase = createClient(supabaseUrl, supabaseKey);
