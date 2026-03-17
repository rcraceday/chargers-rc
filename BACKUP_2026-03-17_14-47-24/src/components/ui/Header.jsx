// src/components/ui/Header.jsx
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import AvatarMenu from "@/components/ui/AvatarMenu";
import HamburgerMenu from "@/components/ui/HamburgerMenu";
import rcracedayLogo from "@/assets/rcraceday_logo.png";

export default function Header({ club, hideMenu }) {
  const { clubSlug } = useParams();
  const { user } = useAuth();

  return (
    <header
      className="w-full bg-white"
      style={{
        borderBottom: "3px solid",
        borderImage: "linear-gradient(to right, #00438A, #0A66C2) 1"
      }}
    >
      <div className="w-full max-w-screen-lg mx-auto px-4 h-20 flex items-center justify-between">

        {/* PLATFORM LOGO */}
        <Link to={`/${clubSlug}`} className="flex items-center gap-3 no-underline">
          <img
            src={rcracedayLogo}
            alt="RCRaceDay"
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* RIGHT SIDE */}
        {!hideMenu && user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <AvatarMenu />
            </div>

            <HamburgerMenu />
          </div>
        )}

      </div>
    </header>
  );
}
