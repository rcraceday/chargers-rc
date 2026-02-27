import React from "react";

export default function AdminInput({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full text-sm"
      style={{
        padding: "6px 10px",
        border: "none",
        borderRadius: "6px",
        background: "white",
        boxSizing: "border-box",
      }}
    />
  );
}
