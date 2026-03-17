// src/app/providers/ClubProvider.jsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/supabaseClient";

const ClubContext = createContext({
  club: null,
  loadingClub: true,
  refreshClub: async () => {},
});

export function useClub() {
  return useContext(ClubContext);
}

export default function ClubProvider({ children }) {
  const location = useLocation();

  const [clubSlug, setClubSlug] = useState(null);
  const [club, setClub] = useState(null);
  const [loadingClub, setLoadingClub] = useState(true);

  // Extract slug from URL
  useEffect(() => {
    const match = location.pathname.match(/^\/([^/]+)/);
    const slug = match?.[1] || null;
    setClubSlug(slug);
  }, [location.pathname]);

  const loadClub = useCallback(async () => {
    // 🚫 DO NOT mark loadingClub=false when slug is missing
    if (!clubSlug) {
      // We are still waiting for the router to populate the slug
      return;
    }

    setLoadingClub(true);

    try {
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .eq("slug", clubSlug)
        .maybeSingle();

      if (error) {
        console.warn("ClubProvider loadClub error:", error);
        setClub(null);
      } else if (data) {
        let theme = data.theme;

        if (!theme) theme = {};
        if (typeof theme === "string") {
          try {
            theme = JSON.parse(theme);
          } catch {
            theme = {};
          }
        }

        theme.colors = theme.colors || {};
        theme.hero = theme.hero || {};

        setClub({
          ...data,
          theme,
        });
      } else {
        setClub(null);
      }
    } catch (err) {
      console.error("ClubProvider loadClub caught:", err);
      setClub(null);
    } finally {
      setLoadingClub(false);
    }
  }, [clubSlug]);

  useEffect(() => {
    loadClub();
  }, [loadClub]);

  return (
    <ClubContext.Provider
      value={{
        club,
        loadingClub,
        refreshClub: loadClub,
      }}
    >
      {children}
    </ClubContext.Provider>
  );
}
