// src/components/ui/Card.jsx
import { useTheme } from "@/app/providers/ThemeProvider";

export default function Card({ children, className = "", ...props }) {
  const { palette } = useTheme();

  const BORDER_THICKNESS = 3;
  const RADIUS = 18;
  const INNER_RADIUS = RADIUS - BORDER_THICKNESS;

  const wrapperStyle = {
    borderRadius: `${RADIUS}px`,
    padding: `${BORDER_THICKNESS}px`,
    background: "linear-gradient(135deg, #2e3192, #00aeef, #2e3192)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
    transition: "all 0.25s ease",
    cursor: "pointer",
  };

  const wrapperHoverStyle = {
    background: "linear-gradient(135deg, #3a3db8, #14c8ff, #3a3db8)",
    boxShadow: "0 6px 14px rgba(0,0,0,0.22)",
  };

  const innerStyle = {
    background: palette.surface,
    borderRadius: `${INNER_RADIUS}px`,
    padding: "18px",
    position: "relative",
    overflow: "hidden",

    // Bigger text for EVERYTHING inside
    fontSize: "1rem",
    lineHeight: "1.4",
    color: palette.textBase,

    // Remove underline globally
    textDecoration: "none",

    // Remove link styling
    // This is the key fix
    "--reset-link": `
      all: unset;
      color: inherit;
      text-decoration: none;
      cursor: inherit;
      display: block;
    `,

    transition: "background 0.25s ease",
  };

  const innerHoverStyle = {
    background: "#e6f4ff", // light blue hover
  };

  const bottomBarStyle = {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "5px",
    borderBottomLeftRadius: `${INNER_RADIUS}px`,
    borderBottomRightRadius: `${INNER_RADIUS}px`,
    background: "linear-gradient(90deg, #2e3192, #00aeef, #2e3192)",
  };

  return (
    <div
      className={`transition-all ${className}`}
      style={wrapperStyle}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, wrapperHoverStyle);
        const inner = e.currentTarget.querySelector(".card-inner");
        Object.assign(inner.style, innerHoverStyle);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, wrapperStyle);
        const inner = e.currentTarget.querySelector(".card-inner");
        Object.assign(inner.style, innerStyle);
      }}
    >
      <div
        {...props}
        className="card-inner"
        style={innerStyle}
      >
        <style>
          {`
            .card-inner a {
              all: unset;
              color: inherit;
              text-decoration: none;
              cursor: inherit;
              display: block;
            }
          `}
        </style>

        <div style={bottomBarStyle} />
        {children}
      </div>
    </div>
  );
}
