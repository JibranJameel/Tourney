// ===============================
// Supabase Client Initialization
// ===============================

// Your Supabase project URL + anon key
const SUPABASE_URL = "https://gkhqczwriyjuvijzuqnu.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdraHFjendyaXlqdXZpanp1cW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjAxMjQsImV4cCI6MjA3OTczNjEyNH0.iyJO3XuT6Aceppwhow9XpS_NIxHTUy8LZBOnLws_Nv8";

// Use CDN global object "supabase"
const { createClient } = supabase;

// Create client
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("Supabase initialized:", supabaseClient);
