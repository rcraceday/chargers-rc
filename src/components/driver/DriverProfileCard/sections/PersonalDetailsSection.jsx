// src/app/components/driver/DriverProfileCard/sections/PersonalDetailsSection.jsx

import React from "react";

export default function PersonalDetailsSection({ driver }) {
  if (
    !driver.gender &&
    !driver.year_of_birth &&
    !driver.hometown
  ) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="text-sm space-y-1">

        {driver.gender && (
          <p>
            <span className="font-semibold">Gender:</span>{" "}
            {driver.gender}
          </p>
        )}

        {driver.year_of_birth && (
          <p>
            <span className="font-semibold">Year of Birth:</span>{" "}
            {driver.year_of_birth}
          </p>
        )}

        {driver.hometown && (
          <p>
            <span className="font-semibold">Hometown:</span>{" "}
            {driver.hometown}
          </p>
        )}

        {driver.occupation && (
          <p>
            <span className="font-semibold">Occupation:</span>{" "}
            {driver.occupation}
          </p>
        )}

      </div>
    </div>
  );
}
