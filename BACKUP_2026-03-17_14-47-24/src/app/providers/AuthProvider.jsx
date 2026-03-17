// src/app/providers/AuthProvider.jsx

console.log(">>> AUTH PROVIDER MOUNTED", import.meta.url);

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [signupEmail, setSignupEmail] = useState("");

  async function loadProfile(userId) {
    if (!userId) {
      setProfile(null);
      return;
    }

    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      setProfile(data || null);
    } catch {
      setProfile(null);
    }
  }

  async function refreshUser() {
    const { data } = await supabase.auth.getUser();
    return data?.user ?? null;
  }

  async function handleSession(newSession) {
    setSession(newSession ?? null);

    const user = newSession?.user ?? (await refreshUser());

    if (user?.id) {
      await loadProfile(user.id);
    } else {
      setProfile(null);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function loadInitial() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      await handleSession(data?.session ?? null);

      if (mounted) setLoadingUser(false);
    }

    loadInitial();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        if (event === "SIGNED_OUT") {
          setSession(null);
          setProfile(null);
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

  const mergedUser =
    session?.user && profile
      ? { ...session.user, ...profile }
      : session?.user ?? null;

  return (
    <AuthContext.Provider
      value={{
        session,
        user: mergedUser,
        profile,
        loadingUser,
        signupEmail,
        setSignupEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
