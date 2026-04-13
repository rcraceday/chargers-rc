// src/app/pages/membership/membership-sections/RaceFeesCard.jsx

import Card from "@/components/ui/Card";

export default function RaceFeesCard({ brand }) {
  return (
    <Card
      noPadding
      className="w-full rounded-xl shadow-sm overflow-hidden !p-0"
      style={{ border: `2px solid ${brand}`, background: "white" }}
    >
      {/* BLUE HEADER */}
<div
  className="px-5 py-3"
  style={{ background: brand, color: "white" }}
>
  <h2 className="text-base font-semibold tracking-tight">Race Fees</h2>
</div>

      <div className="p-6 text-sm space-y-2">
        <p className="font-semibold">MEMBERS</p>
        <p>First Class — $10</p>
        <p>Additional Class — $10 (per class)</p>

        <p className="font-semibold pt-3">JUNIOR MEMBERS (16 and under)</p>
        <p>Free (all classes)</p>

        <p className="font-semibold pt-3">NON‑MEMBERS</p>
        <p>First Class — $20</p>
        <p>Additional Class — $20 (per class)</p>

        <p className="font-semibold pt-3">NON‑MEMBER JUNIORS (16 and under)</p>
        <p>All Classes — $20 (per class)</p>

        <p className="font-semibold pt-3">TIMED PRACTICE FEES</p>
        <p>Adult Member — $5</p>
        <p>Adult Non‑member — $10</p>
        <p>All juniors — Free</p>
      </div>
    </Card>
  );
}
