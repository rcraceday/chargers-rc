import React from "react";
import AdminInput from "./AdminInput.jsx";

export default function AdminSearchBar({ value, onChange, placeholder = "Search…" }) {
  return (
    <div
      className="w-full sm:w-64"
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        background: "white",
        padding: "4px",
        boxSizing: "border-box",
      }}
    >
      <AdminInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
