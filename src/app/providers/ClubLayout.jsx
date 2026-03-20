// src/app/providers/ClubLayout.jsx
import { Navigate, useMatch, useParams } from "react-router-dom";
import { useClub } from "@/app/providers/ClubProvider";
import ThemeProvider from "@/app/providers/ThemeProvider";
import { useProfile } from "@/app/providers/ProfileProvider";

export default function ClubLayout({ children, mode = "drivers" }) {
  const { club, loadingClub } = useClub();
  const { profile, loadingProfile } = useProfile();

  const params = useParams();
  const topMatch = useMatch("/:clubSlug/*");

  const clubSlug = topMatch?.params?.clubSlug || null;

  console.log("ClubLayout params", {
    params,
    topMatch: topMatch?.params,
    loadingClub,
    loadingProfile,
    clubSlug,
  });

  // Do not render anything until router provides a slug
  if (!clubSlug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div>Loading…</div>
      </div>
    );
  }

  // 🚨 CRITICAL FIX:
  // Do NOT render children until BOTH club and profile are fully loaded.
  // This prevents downstream providers from crashing during boot.
  if (loadingClub || loadingProfile || !club || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div>Loading…</div>
      </div>
    );
  }

  // Only redirect after loading finished AND slug exists
  if (!club) {
    return <Navigate to="/" replace />;
  }

  return (
    <ThemeProvider mode={mode} clubTheme={club.theme}>
      {children}
    </ThemeProvider>
  );
}
