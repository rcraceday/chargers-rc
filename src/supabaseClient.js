// src/supabaseClient.js
console.log("SUPABASE CLIENT CREATED");

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Supabase env vars missing: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true
  }
});

console.log(">>> supabaseClient init", {
  urlPresent: !!SUPABASE_URL,
  anonKeyPresent: !!SUPABASE_ANON_KEY,
});

// Expose client for production console debugging (remove after diagnosis)
if (typeof window !== "undefined") {
  // Use a clearly named global to avoid collisions
  window.__supabase = supabase;
  window.__SUPABASE_DEBUG = {
    url: SUPABASE_URL ? "[present]" : "[missing]",
    anonKeyPresent: !!SUPABASE_ANON_KEY,
    envDEV: !!import.meta.env.DEV
  };
  console.log(">>> window.__supabase exposed for debugging", window.__SUPABASE_DEBUG);
}
