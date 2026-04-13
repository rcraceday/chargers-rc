// src/app/components/driver/DriverProfileCard/sections/SicCarProfileSection.jsx

import React from "react";

export default function SicCarProfileSection({ driver }) {
  if (
    !driver.sic_car_type &&
    !driver.sic_chassis &&
    !driver.sic_motor &&
    !driver.sic_esc &&
    !driver.sic_battery &&
    !driver.sic_servo &&
    !driver.sic_tires &&
    !driver.sic_transmitter
  ) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="text-sm space-y-1">
        {driver.sic_car_type && (
          <p>
            <span className="font-semibold">Car Type:</span>{" "}
            {driver.sic_car_type}
          </p>
        )}
        {driver.sic_chassis && (
          <p>
            <span className="font-semibold">Chassis:</span>{" "}
            {driver.sic_chassis}
          </p>
        )}
        {driver.sic_motor && (
          <p>
            <span className="font-semibold">Motor:</span>{" "}
            {driver.sic_motor}
          </p>
        )}
        {driver.sic_esc && (
          <p>
            <span className="font-semibold">ESC:</span>{" "}
            {driver.sic_esc}
          </p>
        )}
        {driver.sic_battery && (
          <p>
            <span className="font-semibold">Battery:</span>{" "}
            {driver.sic_battery}
          </p>
        )}
        {driver.sic_servo && (
          <p>
            <span className="font-semibold">Servo:</span>{" "}
            {driver.sic_servo}
          </p>
        )}
        {driver.sic_tires && (
          <p>
            <span className="font-semibold">Tires:</span>{" "}
            {driver.sic_tires}
          </p>
        )}
        {driver.sic_transmitter && (
          <p>
            <span className="font-semibold">Transmitter:</span>{" "}
            {driver.sic_transmitter}
          </p>
        )}
      </div>
    </div>
  );
}
