import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IdentificationIcon } from "@heroicons/react/24/solid";

import { useClub } from "@/app/providers/ClubProvider";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import { createMembership } from "@/app/api/membership/membershipAPI";

const PRICING = {
  junior: 40,
  single: 80,
  family: 110,
};

export default function JoinMembership() {
  const { clubSlug } = useParams();
  const navigate = useNavigate();
  const { club } = useClub();

  const brand = club?.theme?.hero?.backgroundColor || "#0A66C2";

  const [selected, setSelected] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async () => {
    if (!selected) return;

    setProcessing(true);
    setError("");

    const { data, error } = await createMembership(clubSlug, selected);

    if (error) {
      setError("Something went wrong joining the club.");
      setProcessing(false);
      return;
    }

    navigate(`/${clubSlug}/membership`);
  };

  const membershipOptions = [
    { type: "junior", label: "Junior Membership", price: PRICING.junior },
    { type: "single", label: "Single Membership", price: PRICING.single },
    { type: "family", label: "Family Membership", price: PRICING.family },
  ];

  return (
    <div className="min-h-screen w-full bg-background text-text-base">

      {/* HEADER */}
<section className="w-full border-b border-surfaceBorder bg-surface">
  <div className="w-full mx-auto px-4 py-4 flex items-center gap-2">
    <IdentificationIcon className="h-5 w-5" style={{ color: brand }} />
    <h1 className="text-xl font-semibold tracking-tight">Join the Club</h1>
  </div>
</section>

      {/* MAIN */}
      <main className="max-w-[720px] mx-auto px-4 py-10 space-y-8">

        {/* CARD — MATCHES STYLE GUIDE EXACTLY */}
        <Card
          noPadding
          className="w-full rounded-xl shadow-sm overflow-hidden !p-0 !pt-0"
          style={{
            border: `2px solid ${brand}`,
            background: "white",
            padding: 0,
          }}
        >
          {/* BLUE HEADER BAR — EXACT STYLE GUIDE */}
          <div
            className="px-5 py-3"
            style={{ background: brand, color: "white" }}
          >
            <h2 className="text-base font-semibold">
              Choose Your Membership
            </h2>
          </div>

          {/* BODY */}
          <div className="p-6 space-y-6">

            {/* MEMBERSHIP OPTIONS */}
            <div className="space-y-4">
              {membershipOptions.map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => setSelected(opt.type)}
                  className="w-full text-left rounded-md px-5 py-4 transition"
                  style={{
                    background: "#FFFFFF",
                    border: `2px solid ${
                      selected === opt.type ? brand : "rgba(0,0,0,0.08)"
                    }`,
                    boxShadow:
                      selected === opt.type
                        ? `0 0 0 3px ${brand}22`
                        : "0 1px 2px rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-text-base">
                      {opt.label}
                    </span>
                    <span className="text-text-muted text-sm">
                      ${opt.price}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {/* CTA */}
            <div className="flex justify-end pt-2">
              <Button
                className="w-auto px-5 py-2"
                disabled={!selected || processing}
                onClick={handleJoin}
              >
                {processing ? "Processing…" : "Join the Club"}
              </Button>
            </div>

          </div>
        </Card>
      </main>
    </div>
  );
}
