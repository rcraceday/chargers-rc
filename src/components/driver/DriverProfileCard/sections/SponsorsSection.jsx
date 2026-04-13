// src/app/components/driver/DriverProfileCard/sections/SponsorsSection.jsx

import React from "react";

export default function SponsorsSection({ driver, brand }) {
  if (!driver?.sponsors || driver.sponsors.length === 0) return null;

  return (
    <div className="space-y-2">

      {/* LABEL */}
      <label className="text-base font-medium text-gray-700">Sponsors:</label>

      {/* BADGES */}
      <div className="flex flex-wrap gap-2">
        {driver.sponsors.map((sponsor) => (
          <span
            key={sponsor}
            className="text-base font-medium rounded"
            style={{
              padding: "6px 10px",
              color: brand,
              backgroundColor: "white",
              border: `2px solid ${brand}`,
            }}
          >
            {sponsor}
          </span>
        ))}
      </div>

    </div>
  );
}
