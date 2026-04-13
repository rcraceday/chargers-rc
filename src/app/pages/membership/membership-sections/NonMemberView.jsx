// src/app/pages/membership/membership-sections/NonMemberView.jsx

import Button from "@/components/ui/Button";

import NonMemberIntroCard from "./NonMemberIntroCard";
import MembershipFeesCard from "./MembershipFeesCard";
import RaceFeesCard from "./RaceFeesCard";

export default function NonMemberView({ brand, club }) {
  return (
    <main className="max-w-[720px] mx-auto px-4 py-10 flex flex-col gap-8">

      {/* INTRO CARD */}
      <NonMemberIntroCard brand={brand} />

      {/* TWO COLUMN FEES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MembershipFeesCard brand={brand} />
        <RaceFeesCard brand={brand} />
      </div>

      {/* CTA BUTTON */}
      <Button
        className="w-full bg-blue-600 text-white hover:bg-blue-700"
        onClick={() =>
          window.location.assign(`/${club.slug}/app/membership/join`)
        }
      >
        Join Membership
      </Button>
    </main>
  );
}
