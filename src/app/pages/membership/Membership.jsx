// src/app/pages/public/Membership.jsx
import { Link } from "react-router-dom";
import { IdentificationIcon } from "@heroicons/react/24/solid";
import { useOutletContext } from "react-router-dom";
import { useMembership } from "@/app/providers/MembershipProvider";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function Membership() {
  const { club } = useOutletContext();
  const { membership, loadingMembership } = useMembership();

  if (!club) {
    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          background: "var(--background)",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
        }}
      >
        Loading club…
      </div>
    );
  }

  const brand = club.theme?.hero?.backgroundColor || "#00438A";
  const clubSlug = club.slug;

  // ------------------------------------------------------------
  // MEMBERSHIP LOGIC (UNCHANGED)
  // ------------------------------------------------------------
  const now = new Date();
  const endDate = membership?.end_date ? new Date(membership.end_date) : null;

  const isMember = membership !== null;

  const isActive =
    isMember &&
    (!endDate || endDate >= now);

  const isExpired =
    isMember &&
    endDate &&
    endDate < now;

  const prettyType = membership?.membership_type
    ? membership.membership_type.charAt(0).toUpperCase() +
      membership.membership_type.slice(1)
    : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "var(--background)",
        color: "var(--text-base)",
      }}
    >
      {/* PAGE HEADER */}
      <section
        style={{
          width: "100%",
          borderBottom: "1px solid var(--surface-border)",
          background: "var(--surface)",
        }}
      >
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <IdentificationIcon
            style={{
              width: "20px",
              height: "20px",
              color: brand,
            }}
          />

          <h1
            style={{
              fontSize: "20px",
              fontWeight: 600,
              letterSpacing: "-0.3px",
            }}
          >
            Membership
          </h1>
        </div>
      </section>

      {/* MAIN */}
      <main
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "40px 16px",
        }}
      >
        <Card
          noPadding
          style={{
            border: `2px solid ${brand}`,
            background: "white",
            overflow: "hidden",   // ⭐ FIX — header now clips to rounded corners
          }}
        >
          {/* CARD HEADER BAR */}
          <div
            style={{
              background: brand,
              color: "white",
              padding: "16px 20px",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              Membership Details
            </h2>
          </div>

          {/* CARD BODY */}
          <div
            style={{
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "32px",
            }}
          >
            {/* STATUS */}
            <section style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {loadingMembership && (
                <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                  Loading membership…
                </p>
              )}

              {!loadingMembership && !isMember && (
                <>
                  <p style={{ fontWeight: 600 }}>
                    You’re not currently a member.
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                    Support the club and unlock full access to events, nominations, and member benefits.
                  </p>
                </>
              )}

              {!loadingMembership && isMember && isActive && (
                <>
                  <p style={{ fontWeight: 600, color: "#047857" }}>
                    You’re an active member — thank you for supporting the club.
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                    <strong>Membership type:</strong> {prettyType} •{" "}
                    <strong>Valid until:</strong>{" "}
                    {endDate ? endDate.toLocaleDateString() : "No expiry"}
                  </p>
                </>
              )}

              {!loadingMembership && isMember && isExpired && (
                <>
                  <p style={{ fontWeight: 600, color: "#B45309" }}>
                    Your membership has expired.
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                    <strong>Last membership type:</strong> {prettyType} •{" "}
                    <strong>Expired on:</strong>{" "}
                    {endDate?.toLocaleDateString()}
                  </p>
                </>
              )}
            </section>

            {/* BENEFITS */}
            {(!isMember || isExpired) && (
              <section style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <h3
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                  }}
                >
                  Member benefits
                </h3>

                <ul
                  style={{
                    paddingLeft: "20px",
                    fontSize: "14px",
                    color: "var(--text-muted)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <li>50% off race fees</li>
                  <li>Insurance coverage</li>
                  <li>Junior members race free</li>
                  <li>Access to RCRA sanctioned events</li>
                  <li>Helps increase the club’s profile for council and government investment</li>
                  <li>Voting rights at AGM</li>
                </ul>
              </section>
            )}

            {/* PRICING */}
            <section style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <h3
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                Membership options
              </h3>

              <div
                style={{
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: "4px", color: "var(--text-base)" }}>
                    Full Year (Jan – Dec)
                  </h4>
                  <p>Single: $80 • Family: $110 • Junior: $40</p>
                </div>

                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: "4px", color: "var(--text-base)" }}>
                    Half Year (Jan – Jun / Jul – Dec)
                  </h4>
                  <p>Single: $50 • Family: $70</p>
                </div>

                <div style={{ fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <p>* A family includes 1–2 parents/guardians and their children under 16.</p>
                  <p>** Junior members must be aged 16 or under at the time of application.</p>
                </div>
              </div>
            </section>

            {/* CTAS */}
            <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Non-member */}
              {!loadingMembership && !isMember && (
                <Link
                  to={`/${clubSlug}/membership/join`}
                  style={{
                    textAlign: "center",
                    padding: "12px",
                    borderRadius: "8px",
                    fontWeight: 600,
                    background: brand,
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  Join Membership
                </Link>
              )}

              {/* Active member — NO RENEW BUTTON */}
              {!loadingMembership && isMember && isActive && (
                <>
                  {membership.membership_type !== "family" && (
                    <Link
                      to={`/${clubSlug}/membership/upgrade`}
                      style={{
                        textAlign: "center",
                        padding: "12px",
                        borderRadius: "8px",
                        fontWeight: 600,
                        background: "#F3F4F6",
                        color: "#111827",
                        textDecoration: "none",
                      }}
                    >
                      Upgrade to Family Membership
                    </Link>
                  )}
                </>
              )}

              {/* Expired member */}
              {!loadingMembership && isMember && isExpired && (
                <>
                  <Link
                    to={`/${clubSlug}/membership/renew`}
                    style={{
                      textAlign: "center",
                      padding: "12px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      background: brand,
                      color: "white",
                      textDecoration: "none",
                    }}
                  >
                    Renew Membership
                  </Link>

                  <Link
                    to={`/${clubSlug}/membership/join`}
                    style={{
                      textAlign: "center",
                      padding: "12px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      background: "#F3F4F6",
                      color: "#111827",
                      textDecoration: "none",
                    }}
                  >
                    Start a New Membership
                  </Link>
                </>
              )}
            </section>
          </div>
        </Card>
      </main>
    </div>
  );
}
