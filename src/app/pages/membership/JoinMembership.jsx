import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IdentificationIcon } from "@heroicons/react/24/solid";

import { useClub } from "@/app/providers/ClubProvider";
import Button from "@/components/ui/Button";

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
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-2">
          <IdentificationIcon className="h-5 w-5" style={{ color: brand }} />
          <h1 className="text-xl font-semibold tracking-tight">
            Join the Club
          </h1>
        </div>
      </section>

      {/* MAIN — tightened spacing */}
      <main className="max-w-6xl mx-auto px-4 pt-6 pb-10 space-y-6">

        <section className="rounded-xl border border-surfaceBorder bg-surface p-6 space-y-6">
          <h2 className="text-lg font-semibold">Choose Your Membership</h2>

          <div className="space-y-4">
            {membershipOptions.map((opt) => (
              <button
                key={opt.type}
                onClick={() => setSelected(opt.type)}
                className="w-full text-left rounded-xl px-5 py-4 transition shadow-sm"
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
                  <span className="font-medium text-text-base">{opt.label}</span>
                  <span className="text-text-muted text-sm">${opt.price}</span>
                </div>
              </button>
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-500 pt-2">{error}</p>
          )}

          <div className="flex justify-end pt-4">
            <Button
              variant="primary"
              className="!w-auto !px-5 !py-2.5 !text-sm"
              disabled={!selected || processing}
              onClick={handleJoin}
            >
              {processing ? "Processing…" : "Join the Club"}
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
