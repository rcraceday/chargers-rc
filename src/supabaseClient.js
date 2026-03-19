console.log("SUPABASE CLIENT CREATED");

// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// after creating supabase client
console.log(">>> supabaseClient init", {
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKeyPresent: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
});


const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Supabase env vars missing: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 🔥 Only expose globally in development
if (import.meta.env.DEV) {
  window.supabase = supabase;
}
