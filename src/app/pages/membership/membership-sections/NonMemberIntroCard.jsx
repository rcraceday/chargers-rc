// src/app/pages/membership/membership-sections/NonMemberIntroCard.jsx

import Card from "@/components/ui/Card";

export default function NonMemberIntroCard({ brand }) {
  return (
    <Card
      noPadding
      className="w-full rounded-xl shadow-sm overflow-hidden !p-0"
      style={{ border: `2px solid ${brand}`, background: "white" }}
    >
      {/* BLUE HEADER — MATCH STYLE GUIDE */}
<div
  className="px-5 py-3 text-center"
  style={{ background: brand, color: "white" }}
>
  <h2 className="text-base font-semibold tracking-tight">Join the Club!</h2>
</div>

      {/* BODY */}
      <div className="p-6 space-y-4 text-center">

        {/* ⭐ RESTORED: Larger, bold, blue */}
        <h3
          className="text-lg font-semibold"
          style={{ color: brand }}
        >
          Our members are the backbone of our club
        </h3>

        <h3
          className="text-lg font-semibold"
          style={{ color: brand }}
        >
          Becoming a member has its benefits!
        </h3>

        <ul className="text-sm text-gray-800 space-y-1 text-left mx-auto w-fit">
          <li>50% off race fees</li>
          <li>Insurance coverage</li>
          <li>Junior members race free</li>
          <li>Access to RCRA sanctioned events</li>
          <li>Helps increase the club’s profile for council and government investment</li>
          <li>Voting rights at AGM</li>
        </ul>

        <h3
          className="text-sm font-semibold"
          style={{ color: brand }}
        >
          Your membership and involvement is appreciated and valuable to the strength of our club.
        </h3>
      </div>
    </Card>
  );
}
