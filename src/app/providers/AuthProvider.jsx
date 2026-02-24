// src/app/providers/AuthProvider.jsx
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

  // Load profile for a given user ID
  const loadProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("AuthProvider loadProfile error:", error);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error("AuthProvider loadProfile exception:", err);
      setProfile(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;

        const newSession = data?.session ?? null;
        setSession(newSession);

        if (newSession?.user?.id) {
          await loadProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("AuthProvider loadSession error", err);
        if (!mounted) return;
        setSession(null);
        setProfile(null);
      } finally {
        if (mounted) setLoadingUser(false);
      }
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        setSession(newSession ?? null);

        if (event === "SIGNED_OUT") {
          setProfile(null);
        } else if (newSession?.user?.id) {
          await loadProfile(newSession.user.id);
        }

        setLoadingUser(false);
      }
    );

    return () => {
      mounted = false;
      try {
        listener?.subscription?.unsubscribe?.();
      } catch {}
    };
  }, []);

  // Merge auth user + profile
  const mergedUser =
    session?.user && profile
      ? { ...session.user, ...profile }
      : session?.user ?? null;

  const value = {
    session,
    user: mergedUser,
    loadingUser,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
