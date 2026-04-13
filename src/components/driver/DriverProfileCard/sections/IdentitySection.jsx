import React from "react";

export default function IdentitySection({ driver }) {
  return (
    <div className="col-span-6 space-y-4 w-full text-center">
      <div className="text-4xl font-bold text-gray-900">
        {driver.first_name} {driver.last_name}
      </div>
    </div>
  );
}
