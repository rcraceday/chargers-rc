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

  // Reserved top-level segments that are NOT club slugs
  const RESERVED_TOP_SEGMENTS = new Set([
    "home",
    "public",
    "app",
    "login",
    "admin",
    "api",
    "static",
    "assets",
  ]);

  // Derive the top-level slug deterministically from the pathname,
  // but ignore reserved route names so we don't treat them as club slugs.
  const clubSlug = (() => {
    const parts = (location.pathname || "").split("/").filter(Boolean);
    const first = parts.length > 0 ? parts[0] : null;
    if (!first) return null;
    if (RESERVED_TOP_SEGMENTS.has(first.toLowerCase())) return null;
    return first;
  })();

  const [club, setClub] = useState(null);
  const [loadingClub, setLoadingClub] = useState(true);

  const loadClub = useCallback(async () => {
    console.log("ClubProvider.loadClub start", { clubSlug, pathname: location.pathname });

    // If slug is not yet available, clear loading and wait for next render
    if (!clubSlug) {
      console.log("ClubProvider: no clubSlug yet or reserved segment — clearing loading state", {
        clubSlug,
        pathname: location.pathname,
      });
      setClub(null);
      setLoadingClub(false);
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

        const loadedClub = {
          ...data,
          theme,
        };

        console.log("ClubProvider: club loaded", { slug: clubSlug, id: data.id, pathname: location.pathname });
        setClub(loadedClub);
      } else {
        console.log("ClubProvider: no club found for slug", { clubSlug, pathname: location.pathname });
        setClub(null);
      }
    } catch (err) {
      console.error("ClubProvider loadClub caught:", err);
      setClub(null);
    } finally {
      setLoadingClub(false);
      console.log("ClubProvider.loadClub finished", { clubSlug, pathname: location.pathname });
    }
  }, [clubSlug, location.pathname]);

  // Run only when the top-level clubSlug (derived) changes
  useEffect(() => {
    console.log("ClubProvider useEffect triggered", { clubSlug, pathname: location.pathname, loadingClub });
    loadClub();
    // Depend only on clubSlug / pathname so loadClub runs deterministically
  }, [clubSlug, location.pathname]);

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
