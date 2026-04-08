// src/app/providers/ClubProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { useAuth } from "@/app/providers/AuthProvider";

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
  const { user, loadingUser } = useAuth();

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

  const clubSlug = (() => {
    const parts = (location.pathname || "").split("/").filter(Boolean);
    const first = parts.length > 0 ? parts[0] : null;
    if (!first) return null;
    if (RESERVED_TOP_SEGMENTS.has(first.toLowerCase())) return null;
    return first;
  })();

  const [club, setClub] = useState(null);
  const [loadingClub, setLoadingClub] = useState(true);

  /* ------------------------------------------------------------
     Load club
     ------------------------------------------------------------ */
  async function loadClub() {
    if (!clubSlug) {
      setClub(null);
      setLoadingClub(true);
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
          member_badge_url: data.member_badge_url || null,
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
  }

  /* ------------------------------------------------------------
     Membership linking logic
     ------------------------------------------------------------ */
  async function linkMembershipIfNeeded() {
    if (!user || !club) return;

    const userEmail = user.email?.toLowerCase();
    if (!userEmail) return;

    // 1️⃣ Find membership by email + club
    const { data: membership, error: mErr } = await supabase
      .from("household_memberships")
      .select("*")
      .eq("club_id", club.id)
      .ilike("email", userEmail)
      .maybeSingle();

    if (mErr) {
      console.error("Membership lookup error:", mErr);
      return;
    }

    if (!membership) {
      // User is not a financial member — nothing to link
      return;
    }

    // 2️⃣ If already linked, nothing to do
    if (membership.user_id === user.id) {
      return;
    }

    // 3️⃣ Link membership to user
    const { error: updateErr } = await supabase
      .from("household_memberships")
      .update({
        user_id: user.id,
        primary_first_name:
          user.user_metadata?.first_name || membership.primary_first_name,
        primary_last_name:
          user.user_metadata?.last_name || membership.primary_last_name,
        status: "active",
      })
      .eq("id", membership.id);

    if (updateErr) {
      console.error("Membership linking error:", updateErr);
      return;
    }

    console.log("Membership linked successfully:", membership.id);
  }

  /* ------------------------------------------------------------
     Load club when user hydration completes
     ------------------------------------------------------------ */
  useEffect(() => {
    if (loadingUser) return;
    loadClub();
  }, [clubSlug, loadingUser]);

  /* ------------------------------------------------------------
     Link membership when both user + club are ready
     ------------------------------------------------------------ */
  useEffect(() => {
    if (!loadingUser && !loadingClub && user && club) {
      linkMembershipIfNeeded();
    }
  }, [loadingUser, loadingClub, user, club]);

  /* ------------------------------------------------------------
     Provider output
     ------------------------------------------------------------ */
  if (loadingUser || !clubSlug || loadingClub) {
    return (
      <ClubContext.Provider
        value={{
          club: null,
          loadingClub: true,
          refreshClub: loadClub,
        }}
      >
        {children}
      </ClubContext.Provider>
    );
  }

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
