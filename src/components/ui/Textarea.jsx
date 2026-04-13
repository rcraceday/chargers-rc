// src/components/ui/Textarea.jsx
import React from "react";
import { useOutletContext } from "react-router-dom";

export default function Textarea({
  label,
  value,
  onChange,
  required = false,
  className = "",
  style = {},
  ...props
}) {
  const outlet = useOutletContext() || {};
  const club = outlet.club;
  const theme = club?.theme;

  const brand = theme?.hero?.backgroundColor || "#0A66C2";

  // ⭐ Same base style as Input.jsx
  const baseStyle = {
    padding: "10px 14px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #D0D5DD",
    background: "#FFFFFF",
    color: "#1A1A1A",
    transition: "all 0.2s ease",
    outline: "none",
    boxSizing: "border-box",
    resize: "none", // no manual resize
    ...style,
  };

  const handleFocus = (e) => {
    e.target.style.border = `1px solid ${brand}`;
    e.target.style.boxShadow = `0 0 0 3px ${brand}33`;
  };

  const handleBlur = (e) => {
    e.target.style.border = "1px solid #D0D5DD";
    e.target.style.boxShadow = "none";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        width: "100%",
      }}
    >
      {label && (
        <label
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#333333",
          }}
        >
          {label}
        </label>
      )}

      <textarea
        value={value}
        onChange={onChange}
        required={required}
        style={baseStyle}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={className}
        {...props}
      />
    </div>
  );
}
