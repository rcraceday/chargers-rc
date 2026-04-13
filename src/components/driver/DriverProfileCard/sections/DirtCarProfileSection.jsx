// src/app/components/driver/DriverProfileCard/sections/DirtCarProfileSection.jsx

import React from "react";

export default function DirtCarProfileSection({ driver }) {
  if (
    !driver.dirt_car_type &&
    !driver.dirt_chassis &&
    !driver.dirt_motor &&
    !driver.dirt_esc &&
    !driver.dirt_battery &&
    !driver.dirt_servo &&
    !driver.dirt_tires &&
    !driver.dirt_transmitter
  ) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="text-sm space-y-1">
        {driver.dirt_car_type && (
          <p>
            <span className="font-semibold">Car Type:</span>{" "}
            {driver.dirt_car_type}
          </p>
        )}
        {driver.dirt_chassis && (
          <p>
            <span className="font-semibold">Chassis:</span>{" "}
            {driver.dirt_chassis}
          </p>
        )}
        {driver.dirt_motor && (
          <p>
            <span className="font-semibold">Motor:</span>{" "}
            {driver.dirt_motor}
          </p>
        )}
        {driver.dirt_esc && (
          <p>
            <span className="font-semibold">ESC:</span>{" "}
            {driver.dirt_esc}
          </p>
        )}
        {driver.dirt_battery && (
          <p>
            <span className="font-semibold">Battery:</span>{" "}
            {driver.dirt_battery}
          </p>
        )}
        {driver.dirt_servo && (
          <p>
            <span className="font-semibold">Servo:</span>{" "}
            {driver.dirt_servo}
          </p>
        )}
        {driver.dirt_tires && (
          <p>
            <span className="font-semibold">Tires:</span>{" "}
            {driver.dirt_tires}
          </p>
        )}
        {driver.dirt_transmitter && (
          <p>
            <span className="font-semibold">Transmitter:</span>{" "}
            {driver.dirt_transmitter}
          </p>
        )}
      </div>
    </div>
  );
}
