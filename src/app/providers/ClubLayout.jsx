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

  // 🔥 NEW: Do not render anything until router provides a slug
  if (!clubSlug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div>Loading…</div>
      </div>
    );
  }

  // While either provider is still loading, do not mount nested routes
  if (loadingClub || loadingProfile) {
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
