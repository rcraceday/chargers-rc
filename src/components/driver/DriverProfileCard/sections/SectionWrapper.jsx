// src/app/components/driver/DriverProfileCard/sections/SectionWrapper.jsx

import React from "react";

export default function SectionWrapper({ title, brand, children }) {
  return (
    <div
      className="rounded-lg overflow-hidden border"
      style={{ borderColor: "#e5e7eb" }} // subtle separator
    >
      {/* HEADER */}
      <div
        className="px-4 py-2"
        style={{
          backgroundColor: brand,
          color: "white",
        }}
      >
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>

      {/* BODY */}
      <div className="p-4 space-y-4">
        {children}
      </div>
    </div>
  );
}
