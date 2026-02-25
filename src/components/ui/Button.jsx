// src/components/ui/Button.jsx
import { useTheme } from "@/app/providers/ThemeProvider";

export default function Button({
  as: Component = "button",
  children,
  className = "",
  disabled = false,
  ...props
}) {
  const { palette } = useTheme();

  const baseStyle = {
    background: palette.primary,
    color: "#fff",
    borderRadius: "8px",
    padding: "10px 16px",
    fontWeight: 600,
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    transition: "background 0.2s ease, opacity 0.2s ease",
  };

  const hoverStyle = {
    background: palette.primarySoft,
  };

  const handleMouseEnter = (e) => {
    if (!disabled) {
      e.currentTarget.style.background = hoverStyle.background;
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled) {
      e.currentTarget.style.background = baseStyle.background;
    }
  };

  return (
    <Component
      {...props}
      disabled={disabled}
      className={`inline-flex items-center justify-center ${className}`}
      style={baseStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Component>
  );
}
