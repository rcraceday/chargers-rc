import React from "react";

export default function AdminPanel({ children, className = "" }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        background: "white",
        padding: "12px",
        boxSizing: "border-box",
      }}
      className={className}
    >
      {children}
    </div>
  );
}
