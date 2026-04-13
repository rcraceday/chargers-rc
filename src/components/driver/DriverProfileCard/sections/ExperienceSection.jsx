// src/app/components/driver/DriverProfileCard/sections/ExperienceSection.jsx

import React from "react";

export default function ExperienceSection({ driver }) {
  if (
    !driver.year_started &&
    !driver.career_highlight &&
    !driver.best_thing_about_hobby &&
    !driver.inspiration &&
    !driver.race_number_meaning &&
    !driver.favourite_track
  ) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="text-sm space-y-1">
        {driver.year_started && (
          <p>
            <span className="font-semibold">Year Started:</span>{" "}
            {driver.year_started}
          </p>
        )}
        {driver.career_highlight && (
          <p className="whitespace-pre-line">
            <span className="font-semibold">Career Highlight:</span>{" "}
            {driver.career_highlight}
          </p>
        )}
        {driver.best_thing_about_hobby && (
          <p className="whitespace-pre-line">
            <span className="font-semibold">Best Thing About the Hobby:</span>{" "}
            {driver.best_thing_about_hobby}
          </p>
        )}
        {driver.inspiration && (
          <p className="whitespace-pre-line">
            <span className="font-semibold">Inspiration:</span>{" "}
            {driver.inspiration}
          </p>
        )}
        {driver.race_number_meaning && (
          <p className="whitespace-pre-line">
            <span className="font-semibold">Race Number Meaning:</span>{" "}
            {driver.race_number_meaning}
          </p>
        )}
        {driver.favourite_track && (
          <p>
            <span className="font-semibold">Favourite Track:</span>{" "}
            {driver.favourite_track}
          </p>
        )}
      </div>
    </div>
  );
}
