// src/components/ui/Header.jsx
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import AvatarMenu from "@/components/ui/AvatarMenu";
import HamburgerMenu from "@/components/ui/HamburgerMenu";
import rcracedayLogo from "@/assets/rcraceday_logo.png";

export default function Header({ club, hideMenu }) {
  const { clubSlug } = useParams();
  const { user } = useAuth();

  const brand =
    club?.theme?.hero?.backgroundColor ||
    "#0A66C2";

  const logoSrc =
    club?.logoUrl ||
    club?.logo ||
    club?.logo_url ||
    club?.theme?.hero?.logo ||
    club?.branding?.logo ||
    club?.assets?.logo ||
    null;

  return (
    <header className="w-full bg-white">
      {/* SOLID BRAND STRIPE */}
      <div
        className="w-full"
        style={{
          borderBottom: `4px solid ${brand}`
        }}
      >
        <div className="w-full max-w-screen-lg mx-auto px-4 h-24 grid grid-cols-3 items-center">

          {/* LEFT — RCRaceDay */}
          <Link to={`/${clubSlug}`} className="flex items-center no-underline">
            <img
              src={rcracedayLogo}
              alt="RCRaceDay"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* CENTER — Club Logo (BIGGER) */}
          <div className="flex justify-center">
            {logoSrc && (
              <img
                src={logoSrc}
                alt={club?.name}
                className="h-20 w-auto object-contain"
              />
            )}
          </div>

          {/* RIGHT — User Menu */}
          {!hideMenu && user && (
            <div className="flex justify-end items-center gap-4">
              <AvatarMenu />
              <HamburgerMenu />
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
