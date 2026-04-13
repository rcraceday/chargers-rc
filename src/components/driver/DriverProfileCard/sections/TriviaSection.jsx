// src/app/components/driver/DriverProfileCard/sections/TriviaSection.jsx

import React from "react";

export default function TriviaSection({ driver }) {
  if (
    !driver.favourite_vintage_rc &&
    !driver.favourite_hobby_shop &&
    !driver.what_do_you_do_when_not_racing &&
    !driver.favourite_meal &&
    !driver.favourite_movie &&
    !driver.favourite_sports_team &&
    !driver.favourite_pro_driver
  ) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="text-sm space-y-1">

        {driver.favourite_vintage_rc && (
          <p>
            <span className="font-semibold">Favourite Vintage RC:</span>{" "}
            {driver.favourite_vintage_rc}
          </p>
        )}

        {driver.favourite_hobby_shop && (
          <p>
            <span className="font-semibold">Favourite Hobby Shop:</span>{" "}
            {driver.favourite_hobby_shop}
          </p>
        )}

        {driver.what_do_you_do_when_not_racing && (
          <p>
            <span className="font-semibold">When Not Racing:</span>{" "}
            {driver.what_do_you_do_when_not_racing}
          </p>
        )}

        {driver.favourite_meal && (
          <p>
            <span className="font-semibold">Favourite Meal:</span>{" "}
            {driver.favourite_meal}
          </p>
        )}

        {driver.favourite_movie && (
          <p>
            <span className="font-semibold">Favourite Movie:</span>{" "}
            {driver.favourite_movie}
          </p>
        )}

        {driver.favourite_sports_team && (
          <p>
            <span className="font-semibold">Favourite Sports Team:</span>{" "}
            {driver.favourite_sports_team}
          </p>
        )}

        {driver.favourite_pro_driver && (
          <p>
            <span className="font-semibold">Favourite Pro RC Driver:</span>{" "}
            {driver.favourite_pro_driver}
          </p>
        )}

      </div>
    </div>
  );
}
