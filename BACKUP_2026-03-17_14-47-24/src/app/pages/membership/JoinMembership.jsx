import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotifications } from "@app/hooks/useNotifications";

const PRICING = {
  junior: { full: 40, half: 40 },
  single: { full: 80, half: 50 },
  family: { full: 110, half: 70 },
};

const CYCLES = [
  {
    id: "full",
    label: "Full Year (Jan – Dec)",
    description: "Best value for regular racers and families.",
  },
  {
    id: "half_jan",
    label: "Half Year (Jan – Jun)",
    description: "6‑month membership starting in January.",
  },
  {
    id: "half_jul",
    label: "Half Year (Jul – Dec)",
    description: "6‑month membership starting in July.",
  },
];

export default function JoinMembership() {
  const { clubSlug } = useParams();
  const navigate = useNavigate();
  const { notify } = useNotifications();

  const [step, setStep] = useState(1);
  const [membershipType, setMembershipType] = useState("family");
  const [cycle, setCycle] = useState("full");
  const [processing, setProcessing] = useState(false);

  const prices = PRICING[membershipType];
  const price = cycle === "full" ? prices.full : prices.half;

  const handleContinue = () => setStep(2);

  const handleComplete = async () => {
    setProcessing(true);
    try {
      notify("Membership created successfully (simulated)", "success");
      setStep(3);
    } catch (e) {
      notify("There was a problem creating your membership.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleFinish = () => navigate(`/${clubSlug}/membership`);

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
                Join Membership
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-4 pt-10 pb-12 space-y-10">
        {/* Step indicator */}
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <StepDot active={step === 1} label="Choose type & period" />
          <span>›</span>
          <StepDot active={step === 2} label="Confirm" />
          <span>›</span>
          <StepDot active={step === 3} label="Done" />
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-10">
            {/* Membership type */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-text-base">
                Choose membership type
              </h2>

              <div className="space-y-3">
                {["junior", "single", "family"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMembershipType(type)}
                    className="w-full text-left"
                  >
                    <div
                      className={`rounded-xl border p-4 transition-colors ${
                        membershipType === type
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-300 bg-white"
                      } hover:border-blue-500 hover:bg-blue-50`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-text-base">
                            {type === "junior"
                              ? "Junior Membership"
                              : type === "single"
                              ? "Single Membership"
                              : "Family Membership"}
                          </h3>

                          <p className="text-sm text-text-muted">
                            {type === "junior" &&
                              "For drivers aged 16 and under."}
                            {type === "single" &&
                              "For individual drivers."}
                            {type === "family" &&
                              "Includes 1–2 parents/guardians and their children under 16."}
                          </p>
                        </div>

                        <div className="text-sm text-text-muted text-right">
                          <div>Full: ${PRICING[type].full}</div>
                          <div>Half: ${PRICING[type].half}</div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Membership period */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-text-base">
                Choose membership period
              </h2>

              <div className="space-y-3">
                {CYCLES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCycle(c.id)}
                    className="w-full text-left"
                  >
                    <div
                      className={`rounded-xl border p-4 transition-colors ${
                        cycle === c.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-300 bg-white"
                      } hover:border-blue-500 hover:bg-blue-50`}
                    >
                      <h3 className="font-semibold text-text-base">
                        {c.label}
                      </h3>
                      <p className="text-sm text-text-muted">
                        {c.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

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
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-text-base">
              Confirm membership
            </h2>

            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="font-medium text-text-base mb-1">
                {membershipType === "junior"
                  ? "Junior Membership"
                  : membershipType === "single"
                  ? "Single Membership"
                  : "Family Membership"}
              </h3>

              <p className="text-sm text-text-muted mb-2">
                Period:{" "}
                {cycle === "full"
                  ? "Full Year (Jan – Dec)"
                  : cycle === "half_jan"
                  ? "Half Year (Jan – Jun)"
                  : "Half Year (Jul – Dec)"}
              </p>

              <p className="text-lg font-semibold text-text-base">${price}</p>
            </div>

            <p className="text-xs text-text-muted">
              Payment processing and membership creation will be wired to the backend.
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
                {processing ? "Processing…" : "Complete membership"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-base">
              Membership created
            </h2>

            <p className="text-sm text-text-muted">
              Your membership has been created. Benefits will apply from the selected start date.
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
