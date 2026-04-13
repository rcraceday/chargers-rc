// src/app/providers/AuthProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [signupEmail, setSignupEmail] = useState("");

  // ------------------------------------------------------------
  // Handle session (NO profile loading here)
  // ------------------------------------------------------------
  async function handleSession(newSession) {
    setSession(newSession);
  }

  // ------------------------------------------------------------
  // Mount: ONE getSession call
  // ------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const initialSession = sessionData?.session ?? null;

        if (!mounted) return;

        await handleSession(initialSession);
      } catch (err) {
        console.error(">>> AuthProvider init error", err);
      } finally {
        if (mounted) setLoadingUser(false);
      }
    }

    init();

    // ------------------------------------------------------------
    // Auth state listener
    // ------------------------------------------------------------
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        if (event === "PASSWORD_RECOVERY") return;

        if (event === "SIGNED_OUT") {
          setSession(null);
          setLoadingUser(false);
          return;
        }

        await handleSession(newSession);
        setLoadingUser(false);
      }
    );

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loadingUser,
        signupEmail,
        setSignupEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
