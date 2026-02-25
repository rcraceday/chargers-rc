// src/layouts/UnifiedLayout.jsx
import { useTheme } from "@/app/providers/ThemeProvider";

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
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
