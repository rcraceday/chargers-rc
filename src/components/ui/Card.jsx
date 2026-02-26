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
    background: palette.cardGradient,
    boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
    transition: "all 0.25s ease",
    cursor: "pointer",
  };

  const wrapperHoverStyle = {
    background: palette.cardGradientHover,
    boxShadow: "0 6px 14px rgba(0,0,0,0.22)",
  };

  const innerStyle = {
    background: palette.surface,
    borderRadius: `${INNER_RADIUS}px`,
    padding: "18px",
    position: "relative",
    overflow: "hidden",
    fontSize: "1rem",
    lineHeight: "1.4",
    color: palette.textBase,
    textDecoration: "none",
    transition: "background 0.25s ease",
  };

  const innerHoverStyle = {
    background: palette.cardInnerHover,
  };

  const thinBottomBorderStyle = {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "1px",
    background: "rgba(0,0,0,0.10)",
  };

  return (
    <div
      className={`transition-all ${className}`}
      style={wrapperStyle}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, wrapperHoverStyle);
        const inner = e.currentTarget.querySelector(".card-inner");
        if (inner) Object.assign(inner.style, innerHoverStyle);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, wrapperStyle);
        const inner = e.currentTarget.querySelector(".card-inner");
        if (inner) Object.assign(inner.style, innerStyle);
      }}
    >
      <div {...props} className="card-inner" style={innerStyle}>
        <div style={thinBottomBorderStyle} />
        {children}
      </div>
    </div>
  );
}
