// src/app/providers/ThemeProvider.jsx
import { createContext, useContext, useMemo } from "react";

export const ThemeContext = createContext(null);

export default function ThemeProvider({ mode = "drivers", clubTheme = {}, children }) {
  //
  // 1. Base neutral palette (global)
  //
  const base = {
    background: "#ffffff",
    backgroundImage: null,
    backgroundMode: "full",

    text: "#1f2937",
    textMuted: "#6b7280",

    surface: "#ffffff",
    surfaceAlt: "#f9fafb",
    surfaceBorder: "#e5e7eb",

    // Header defaults (overridden by mode palettes)
    headerAccent: "#e5e7eb",
    headerLink: "#1f2937",
    headerLinkHover: "#00438a",
    headerLinkActive: "#00438a",
    headerText: "#1f2937",
    headerTextMuted: "#6b7280",
  };

  //
  // 2. Drivers Portal palette (Chargers Blue + Electric Glow)
  //
  const drivers = {
    primary: "#00438a",
    primarySoft: "#0a5bb8",

    brandPrimary: "#00438a",
    brandSecondary: "#0a5bb8",

    // ELECTRIC GLOW (2e3192 → 00aeef)
    cardBorder: "rgba(46, 49, 146, 0.35)",
    cardGlow: `
      0 0 12px rgba(46, 49, 146, 0.45),
      0 0 22px rgba(0, 174, 239, 0.35)
    `,

    // ⭐ NEW — Home card gradients + hover
    cardGradient: "linear-gradient(135deg, #2e3192, #00aeef, #2e3192)",
    cardGradientHover: "linear-gradient(135deg, #3a3db8, #14c8ff, #3a3db8)",
    cardInnerHover: "#e6f4ff",

    // Header colours
    headerAccent: "#00438a",
    headerLink: "#1f2937",
    headerLinkHover: "#0a5bb8",
    headerLinkActive: "#00438a",
    headerText: "#1f2937",
    headerTextMuted: "#6b7280",
  };

  //
  // 3. Admin Portal palette (Red)
  //
  const admin = {
    primary: "#b91c1c",
    primarySoft: "#ef4444",

    brandPrimary: "#b91c1c",
    brandSecondary: "#ef4444",

    cardBorder: "rgba(185, 28, 28, 0.35)",
    cardGlow: `
      0 0 12px rgba(185, 28, 28, 0.45),
      0 0 22px rgba(239, 68, 68, 0.35)
    `,

    // ⭐ NEW — Admin card gradients + hover (RED)
    cardGradient: "linear-gradient(135deg, #C62828, #E53935, #C62828)",
    cardGradientHover: "linear-gradient(135deg, #D32F2F, #EF5350, #D32F2F)",
    cardInnerHover: "#ffe6e6",

    // Header colours
    headerAccent: "#b91c1c",
    headerLink: "#1f2937",
    headerLinkHover: "#ef4444",
    headerLinkActive: "#b91c1c",
    headerText: "#1f2937",
    headerTextMuted: "#6b7280",
  };

  //
  // 4. Select palette based on mode
  //
  const modePalette = mode === "admin" ? admin : drivers;

  //
  // 5. Merge everything
  //
  const theme = useMemo(() => {
    return {
      palette: {
        ...base,
        ...modePalette,
        ...clubTheme,
      },
      mode,
    };
  }, [mode, clubTheme]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
