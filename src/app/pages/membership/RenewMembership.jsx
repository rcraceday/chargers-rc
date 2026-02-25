import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useMembership from "@app/hooks/useMembership";
import { useNotifications } from "@app/hooks/useNotifications";
import Card from "@/components/ui/Card";

const PRICING = {
  single: { full: 80, half: 50 },
  family: { full: 110, half: 70 },
  junior: { full: 40, half: 40 },
};

export default function RenewMembership() {
  const { clubSlug } = useParams();
  const navigate = useNavigate();
  const { membership, loadingMembership, renewMembership } = useMembership();
  const { notify } = useNotifications();

  const [step, setStep] = useState(1);
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
          <Card>
            <p className="text-sm text-text-muted">
              You don’t currently have a membership to renew.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  const type = (membership.membership_type || "single").toLowerCase();
  const prices = PRICING[type] || PRICING.single;
  const price = duration === "full" ? prices.full : prices.half;

  const handleContinue = () => setStep(2);

  const handleComplete = async () => {
    setProcessing(true);
    try {
      await renewMembership();
      notify("Membership renewed successfully", "success");
      setStep(3);
    } catch (e) {
      console.error("Renew membership failed", e);
      notify("There was a problem renewing your membership.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleFinish = () => {
    if (clubSlug) navigate(`/${clubSlug}/membership`);
  };

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
                Renew Membership
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-4 pt-10 pb-12 space-y-8">
        {/* Step indicator */}
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <StepDot active={step === 1} label="Choose duration" />
          <span>›</span>
          <StepDot active={step === 2} label="Confirm" />
          <span>›</span>
          <StepDot active={step === 3} label="Done" />
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-base">
              Choose renewal period
            </h2>

            <div className="space-y-3">
              {/* FULL YEAR */}
              <button type="button" onClick={() => setDuration("full")} className="w-full text-left">
                <div
                  className={`rounded-xl border p-4 transition-colors ${
                    duration === "full"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 bg-white"
                  } hover:border-blue-500 hover:bg-blue-50`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-text-base">
                        Full Year (Jan – Dec)
                      </h3>
                      <p className="text-sm text-text-muted">
                        Best value for regular racers and families.
                      </p>
                    </div>
                    <div className="text-lg font-semibold text-text-base">
                      ${prices.full}
                    </div>
                  </div>
                </div>
              </button>

              {/* HALF YEAR */}
              <button type="button" onClick={() => setDuration("half")} className="w-full text-left">
                <div
                  className={`rounded-xl border p-4 transition-colors ${
                    duration === "half"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 bg-white"
                  } hover:border-blue-500 hover:bg-blue-50`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-text-base">
                        Half Year (Jan – Jun / Jul – Dec)
                      </h3>
                      <p className="text-sm text-text-muted">
                        Flexible 6‑month membership option.
                      </p>
                    </div>
                    <div className="text-lg font-semibold text-text-base">
                      ${prices.half}
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleContinue}
                className="rounded-md px-5 py-2.5 text-sm font-semibold"
                style={{ background: "#00438A", color: "white" }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-base">
              Confirm renewal
            </h2>

            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="font-medium text-text-base mb-1">
                {duration === "full"
                  ? "Full Year Membership"
                  : "Half Year Membership"}
              </h3>
              <p className="text-sm text-text-muted mb-2">
                Membership type:{" "}
                {membership.membership_type
                  ? membership.membership_type.charAt(0).toUpperCase() +
                    membership.membership_type.slice(1)
                  : "Member"}
              </p>
              <p className="text-lg font-semibold text-text-base">${price}</p>
            </div>

            <p className="text-xs text-text-muted">
              Payment processing will be integrated soon.
            </p>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                disabled={processing}
                className="rounded-md px-5 py-2.5 text-sm font-semibold border border-gray-200 bg-white text-text-base"
              >
                Back
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
                {processing ? "Processing…" : "Complete renewal"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-text-base">
              Membership renewed
            </h2>
            <p className="text-sm text-text-muted">
              Your membership has been renewed successfully.
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleFinish}
                className="rounded-md px-5 py-2.5 text-sm font-semibold"
                style={{ background: "#00438A", color: "white" }}
              >
                Back to Membership
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StepDot({ active, label }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-2.5 h-2.5 rounded-full"
        style={{ background: active ? "#10b981" : "#9ca3af" }}
      />
      <span
        className={active ? "font-medium text-text-base" : "text-text-muted"}
      >
        {label}
      </span>
    </div>
  );
}
