import { useOutletContext, Link } from "react-router-dom";
import { useContext } from "react";
import { MembershipContext } from "@/app/providers/MembershipProvider";

export default function Membership() {
  const { club } = useOutletContext();
  const clubSlug = club?.slug;

  const { membership, loadingMembership } = useContext(MembershipContext);

  const now = new Date();
  const endDate =
    membership?.endDateObj ??
    (membership?.end_date ? new Date(membership.end_date) : null);

  const isActive =
    membership &&
    !loadingMembership &&
    membership.status?.toLowerCase() === "active" &&
    endDate &&
    endDate >= now;

  const isExpired =
    membership &&
    !loadingMembership &&
    endDate &&
    endDate < now;

  const prettyType = membership?.membership_type
    ? membership.membership_type.charAt(0).toUpperCase() +
      membership.membership_type.slice(1)
    : null;

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
                Membership at {club?.name}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto px-4 pt-10 pb-16 space-y-12">
        {/* STATUS */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-text-muted">
            Membership status
          </h2>

          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-2">
            {loadingMembership && (
              <p className="text-text-muted text-sm">Loading membership…</p>
            )}

            {!loadingMembership && !membership && (
              <>
                <p className="font-medium text-text-base">
                  You’re not currently a member.
                </p>
                <p className="text-sm text-text-muted">
                  Support the club and unlock full access to events, nominations, and member benefits.
                </p>
              </>
            )}

            {!loadingMembership && membership && isActive && (
              <>
                <p className="font-medium text-emerald-700">
                  You’re an active member — thank you for supporting the club.
                </p>
                <p className="text-sm text-text-muted">
                  <strong>Membership type:</strong> {prettyType} •{" "}
                  <strong>Valid until:</strong>{" "}
                  {endDate?.toLocaleDateString()}
                </p>
              </>
            )}

            {!loadingMembership && membership && isExpired && (
              <>
                <p className="font-medium text-amber-700">
                  Your membership has expired.
                </p>
                <p className="text-sm text-text-muted">
                  <strong>Last membership type:</strong> {prettyType} •{" "}
                  <strong>Expired on:</strong>{" "}
                  {endDate?.toLocaleDateString()}
                </p>
              </>
            )}
          </div>
        </section>

        {/* BENEFITS */}
        {(!membership || isExpired) && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-text-muted">
              Member benefits
            </h2>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <ul className="list-disc ml-5 text-sm text-text-muted space-y-1">
                <li>Access to all club racing events</li>
                <li>Driver profiles and race history</li>
                <li>Setup sharing and tuning notes</li>
                <li>Discounted entry fees</li>
                <li>Support track maintenance and improvements</li>
              </ul>
            </div>
          </section>
        )}

        {/* PRICING */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-text-muted">
            Membership options
          </h2>

          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4 text-sm text-text-muted">
            <div>
              <h3 className="font-semibold text-text-base mb-1">
                Full Year (Jan – Dec)
              </h3>
              <p>Single: $80 • Family: $110 • Junior: $40</p>
            </div>

            <div>
              <h3 className="font-semibold text-text-base mb-1">
                Half Year (Jan – Jun / Jul – Dec)
              </h3>
              <p>Single: $50 • Family: $70</p>
            </div>

            <div className="text-xs space-y-1">
              <p>* A family includes 1–2 parents/guardians and their children under 16.</p>
              <p>** Junior members must be aged 16 or under at the time of application.</p>
            </div>
          </div>
        </section>

        {/* CTAS */}
        <section className="space-y-3">
          {/* Non-member */}
          {!loadingMembership && !membership && (
            <Link
              to={`/${clubSlug}/membership/join`}
              className="block text-center py-3 rounded-md font-semibold"
              style={{ background: "#00438A", color: "white" }}
            >
              Join Membership
            </Link>
          )}

          {/* Active member */}
          {!loadingMembership && membership && isActive && (
            <>
              <Link
                to={`/${clubSlug}/membership/renew`}
                className="block text-center py-3 rounded-md font-semibold"
                style={{ background: "#00438A", color: "white" }}
              >
                Renew Membership
              </Link>

              {membership.membership_type !== "family" && (
                <Link
                  to={`/${clubSlug}/membership/upgrade`}
                  className="block text-center py-3 rounded-md font-semibold bg-gray-100 text-gray-900"
                >
                  Upgrade to Family Membership
                </Link>
              )}
            </>
          )}

          {/* Expired member */}
          {!loadingMembership && membership && isExpired && (
            <>
              <Link
                to={`/${clubSlug}/membership/renew`}
                className="block text-center py-3 rounded-md font-semibold"
                style={{ background: "#00438A", color: "white" }}
              >
                Renew Membership
              </Link>

              <Link
                to={`/${clubSlug}/membership/join`}
                className="block text-center py-3 rounded-md font-semibold bg-gray-100 text-gray-900"
              >
                Start a New Membership
              </Link>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

function StepDot() {
  return null; // Not used on this page
}
