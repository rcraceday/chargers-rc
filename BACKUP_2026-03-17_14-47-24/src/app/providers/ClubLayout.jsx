// src/app/providers/ClubLayout.jsx
import { useClub } from "@/app/providers/ClubProvider";
import ThemeProvider from "@/app/providers/ThemeProvider";
import { useProfile } from "@/app/providers/ProfileProvider";

export default function ClubLayout({ children, mode = "drivers" }) {
  const { club, loadingClub } = useClub();
  const { profile, loadingProfile } = useProfile();

  console.log("[ClubLayout]", {
    club,
    loadingClub,
    profileRole: profile?.role,
    loadingProfile,
  });

  const isGlobalAdmin = profile?.role === "admin";

  // While club is loading, don't block UI — render children bare.
  if (loadingClub || loadingProfile) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        {children}
      </div>
    );
  }

  // If no club resolved:
  // - Normal users: render bare (login/signup/etc)
  // - Global admin: still render bare (they can navigate anywhere)
  if (!club) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        {children}
      </div>
    );
  }

  // When club is available, apply theme.
  return (
    <ThemeProvider mode={mode} clubTheme={club.theme}>
      {children}
    </ThemeProvider>
  );
}
