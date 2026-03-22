// src/app/pages/profile/Membership.jsx

import { useNavigate, useParams } from "react-router-dom";
import { IdentificationIcon } from "@heroicons/react/24/solid";

import { useClub } from "@/app/providers/ClubProvider";
import { useMembership } from "@/app/providers/MembershipProvider";
import { useDrivers } from "@/app/providers/DriverProvider";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function Membership() {
  const { clubSlug } = useParams();
  const navigate = useNavigate();
  const { club } = useClub();

  const { membership, loadingMembership, isNonMember } = useMembership();
  const { drivers, loadingDrivers } = useDrivers();

  const brand = club?.theme?.hero?.backgroundColor || "#0A66C2";

  // STILL LOADING
  if (loadingMembership || loadingDrivers) {
    return (
      <div className="min-h-screen w-full bg-background text-text-base flex items-center justify-center">
        <p>Loading membership…</p>
      </div>
    );
  }

  // NON-MEMBER → CTA inside app shell
  if (isNonMember || !membership) {
    return (
      <div className="w-full flex flex-col items-center px-4 py-10">
        <Card
          className="p-6 space-y-4 w-full max-w-md text-center"
          style={{ border: `2px solid ${brand}` }}
        >
          <h2 className="text-xl font-semibold">Join the Club</h2>
          <p className="text-text-muted text-sm">
            Become a club member to enjoy racing privileges, event discounts,
            and full access to club features.
          </p>

          <div className="pt-2 flex justify-center">
            <Button
              variant="primary"
              className="!w-auto !px-6 !py-1.5 !text-sm !rounded-md"
              onClick={() => navigate(`/${clubSlug}/app/membership/join`)}
            >
              Join the Club
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const type = membership.membership_type;

  return (
    <div className="min-h-screen w-full bg-background text-text-base">

      {/* HEADER */}
      <section className="w-full border-b border-surfaceBorder bg-surface">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-2">
          <IdentificationIcon className="h-5 w-5" style={{ color: brand }} />
          <h1 className="text-xl font-semibold tracking-tight">Membership</h1>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-3xl mx-auto px-4 pb-10 space-y-6 flex flex-col items-center">

        {/* SUMMARY CARD */}
        <MembershipSummaryCard
          membership={membership}
          drivers={drivers}
          brand={brand}
        />

        {/* MEMBERS ON ACCOUNT */}
        <MembersOnAccountCard
          membership={membership}
          drivers={drivers}
          brand={brand}
        />

        {/* CTA: Move to Family */}
        {(type === "junior" || type === "single") && (
          <MoveToFamilyCTA
            brand={brand}
            onMove={() => navigate(`/${clubSlug}/app/membership/change`)}
          />
        )}
      </main>
    </div>
  );
}

/* ============================================================
   COMPONENT: Membership Summary Card
   ============================================================ */
function MembershipSummaryCard({ membership, drivers, brand }) {
  const typeLabel =
    membership.membership_type === "junior"
      ? "Junior Membership"
      : membership.membership_type === "single"
      ? "Single Membership"
      : membership.membership_type === "family"
      ? "Family Membership"
      : "Membership";

  const start = membership.start_date
    ? new Date(membership.start_date).toLocaleDateString()
    : "—";

  const end = membership.end_date
    ? new Date(membership.end_date).toLocaleDateString()
    : "—";

  return (
    <Card
      className="p-6 space-y-4 w-full"
      style={{ border: `2px solid ${brand}` }}
    >
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <IdentificationIcon className="h-5 w-5" style={{ color: brand }} />
        Membership Summary
      </h2>

      <div className="space-y-0.5">
        <p className="text-text-base font-medium">{typeLabel}</p>
        <p className="text-sm text-text-muted">Start: {start}</p>
        <p className="text-sm text-text-muted">End: {end}</p>
      </div>

      <div className="pt-2">
        <h3 className="text-sm font-semibold text-text-base mb-1">Drivers</h3>
        <DriverList membership={membership} drivers={drivers} />
      </div>
    </Card>
  );
}

/* ============================================================
   COMPONENT: Driver List
   ============================================================ */
function DriverList({ membership, drivers }) {
  const items = [];

  const primaryIsDriver = drivers.some(
    (d) =>
      d.first_name === membership.primary_first_name &&
      d.last_name === membership.primary_last_name
  );

  if (membership.membership_type === "family" || primaryIsDriver) {
    items.push({
      id: "primary",
      first_name: membership.primary_first_name,
      last_name: membership.primary_last_name,
      is_junior: false,
    });
  }

  drivers.forEach((d) => items.push(d));

  if (items.length === 0) {
    return <p className="text-sm text-text-muted">No drivers added yet.</p>;
  }

  return (
    <ul className="space-y-0.5">
      {items.map((d) => (
        <li key={d.id || "primary"} className="text-sm text-text-base">
          {d.first_name} {d.last_name}
          {d.is_junior && <span className="text-text-muted"> (Junior)</span>}
        </li>
      ))}
    </ul>
  );
}

/* ============================================================
   COMPONENT: Members On Account Card
   ============================================================ */
function MembersOnAccountCard({ membership, drivers, brand }) {
  return (
    <Card
      className="p-6 space-y-4 w-full"
      style={{ border: `2px solid ${brand}` }}
    >
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <IdentificationIcon className="h-5 w-5" style={{ color: brand }} />
        Members on Account
      </h2>

      <DriverList membership={membership} drivers={drivers} />
    </Card>
  );
}

/* ============================================================
   CTA: Move to Family Membership
   ============================================================ */
function MoveToFamilyCTA({ brand, onMove }) {
  return (
    <Card
      className="p-6 space-y-4 w-full"
      style={{ border: `2px solid ${brand}` }}
    >
      <h2 className="text-lg font-semibold">Move to Family Membership</h2>

      <p className="text-sm text-text-muted">
        Upgrade your membership to include parents/guardians and junior drivers.
      </p>

      <div className="pt-2 flex justify-center">
        <Button
          variant="primary"
          className="!w-auto !px-6 !py-1.5 !text-sm !rounded-md"
          onClick={onMove}
        >
          Move to Family
        </Button>
      </div>
    </Card>
  );
}
