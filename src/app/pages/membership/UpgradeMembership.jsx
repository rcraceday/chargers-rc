import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useMembership from "@app/hooks/useMembership";
import { useNotifications } from "@app/hooks/useNotifications";

const PRICING = {
  single: { full: 80, half: 50 },
  family: { full: 110, half: 70 },
  junior: { full: 40, half: 40 },
};

export default function UpgradeMembership() {
  const { clubSlug } = useParams();
  const navigate = useNavigate();
  const { membership, loadingMembership } = useMembership();
  const { notify } = useNotifications();

  const [duration, setDuration] = useState("full");
  const [processing, setProcessing] = useState(false);

  if (loadingMembership) {
    return (
      <div className="min-h-screen w-full bg-background text-text-base flex items-center justify-center">
        <p className="text-text-muted text-sm">Loading membership…</p>
      </div>
    );
  }

  if (!membership) {
    return (
      <div className="min-h-screen w-full bg-background text-text-base flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm text-text-muted">
              You don’t currently have a membership to upgrade.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (membership.membership_type === "family") {
    return (
      <div className="min-h-screen w-full bg-background text-text-base flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm text-text-muted">
              You already have a Family Membership.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentType = membership.membership_type.toLowerCase();
  const currentPrices = PRICING[currentType];
  const familyPrices = PRICING.family;

  const currentPrice = duration === "full" ? currentPrices.full : currentPrices.half;
  const familyPrice = duration === "full" ? familyPrices.full : familyPrices.half;
  const difference = Math.max(familyPrice - currentPrice, 0);

  const handleComplete = async () => {
    setProcessing(true);
    try {
      notify("Upgrade recorded (simulated).", "success");
      navigate(`/${clubSlug}/membership`);
    } catch (e) {
      notify("There was a problem upgrading your membership.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = () => navigate(`/${clubSlug}/membership`);

  return (
    <div className="min-h-screen w-full bg-background text-text-base">
      {/* HERO */}
      <section className="w-full bg-surface">
        <div className="max-w-6xl mx-auto px-4 pt-10 pb-10">
          <div
            className="rounded-lg"
            style={{
              padding: "3px",
              background:
                "linear-gradient(315deg, #2e3192, #00aeef, #2e3192)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
            }}
          >
            <div
              className="rounded-md text-center"
              style={{
                background: "#00438A",
                padding: "28px 16px",
              }}
            >
              <h1
                className="text-3xl font-semibold tracking-tight"
                style={{ color: "white" }}
              >
                Upgrade to Family Membership
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-4 pt-10 pb-12 space-y-8">
        {/* Step title */}
        <h2 className="text-lg font-semibold text-text-base">
          Review upgrade details
        </h2>

        <p className="text-sm text-text-muted">
          Current membership type:{" "}
          <strong>{currentType.charAt(0).toUpperCase() + currentType.slice(1)}</strong>
        </p>

        {/* Duration selection */}
        <div className="space-y-3">
          {["full", "half"].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDuration(d)}
              className="w-full text-left"
            >
              <div
                className={`rounded-xl border p-4 transition-colors ${
                  duration === d
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 bg-white"
                } hover:border-blue-500 hover:bg-blue-50`}
              >
                <h4 className="font-semibold text-text-base">
                  {d === "full"
                    ? "Full Year (Jan – Dec)"
                    : "Half Year (Jan – Jun / Jul – Dec)"}
                </h4>

                <p className="text-sm text-text-muted">
                  Current: ${currentPrice} • Family: ${familyPrice} • Difference: ${difference}
                </p>
              </div>
            </button>
          ))}
        </div>

        <p className="text-xs text-text-muted">
          Payment processing and upgrade logic will be wired to the backend.
        </p>

        {/* CTA buttons */}
        <div className="flex justify-between pt-4">
          <button
            onClick={handleCancel}
            disabled={processing}
            className="rounded-md px-5 py-2.5 text-sm font-semibold border border-gray-200 bg-white text-text-base"
          >
            Cancel
          </button>

          <button
            onClick={handleComplete}
            disabled={processing}
            className="rounded-md px-5 py-2.5 text-sm font-semibold"
            style={{
              background: processing ? "#9ca3af" : "#00438A",
              color: "white",
            }}
          >
            {processing ? "Processing…" : "Confirm upgrade"}
          </button>
        </div>
      </main>
    </div>
  );
}
