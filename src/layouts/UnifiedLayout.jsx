// src/layouts/UnifiedLayout.jsx
import { useTheme } from "@/app/providers/ThemeProvider";
import poweredLogo from "@/assets/RCRaceday_logo_300x300_Powered.png";

export default function UnifiedLayout({ children }) {
  const { palette } = useTheme();

  const bgStyle = {
    backgroundColor: palette.background,
    backgroundImage: palette.backgroundImage
      ? `url(${palette.backgroundImage})`
      : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div className="min-h-screen w-full flex flex-col" style={bgStyle}>
      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* GLOBAL FOOTER */}
      <footer className="py-6 bg-white text-[#6b7280] flex flex-col items-center gap-3 border-t border-gray-200">
        <img
          src={poweredLogo}
          alt="Powered by RCRaceday"
          className="w-24 h-auto opacity-90"
        />
        <p className="text-xs">
          © RCRaceday 2026
        </p>
      </footer>
    </div>
  );
}
