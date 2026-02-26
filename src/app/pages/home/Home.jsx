// src/app/pages/Home.jsx
import { Link, useOutletContext } from "react-router-dom";
import { useAuth } from "@app/providers/AuthProvider";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

import {
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  IdentificationIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const { club } = useOutletContext();
  const { user } = useAuth();

  const clubSlug = club?.slug;
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen w-full bg-background text-text-base">

      {/* HERO — Chargers Blue, White Text, Thin Outline, Centered */}
      <section className="w-full bg-surface">
        <div className="max-w-6xl mx-auto px-4 pt-10 pb-10">

          {/* OUTER WRAPPER WITH THIN OUTLINE + SHADOW */}
          <div
            className="rounded-lg"
            style={{
              padding: "3px",
              background:
                "linear-gradient(315deg, #2e3192, #00aeef, #2e3192)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
            }}
          >
            {/* INNER HERO */}
            <div
              className="
                rounded-md
                flex items-center justify-center text-center
              "
              style={{
                background: "#00438A",
                padding: "35px 16px 23px 16px",
              }}
            >
              <h1
                className="text-3xl font-semibold tracking-tight"
                style={{ color: "white" }}
              >
                Welcome to Chargers RC Driver Portal
              </h1>
            </div>
          </div>

        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 pt-10 pb-12 space-y-10">

        {/* CLUB NEWS */}
        <section>
          <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-text-muted mb-3">
            Club News
          </h2>

          <Card>
            <p className="text-text-muted leading-relaxed">
              No news posted yet. Stay tuned for updates from the club.
            </p>
          </Card>
        </section>

        {/* NEXT EVENT */}
        <section>
          <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-text-muted mb-3">
            Next Event
          </h2>

          <Card>
            <p className="text-text-muted leading-relaxed">
              The next event will appear here once scheduled.
            </p>
          </Card>
        </section>

        {/* QUICK ACTIONS */}
        <section>
          <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-text-muted mb-3">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-4">

            {/* EVENTS */}
            {clubSlug && (
              <Card className="text-center">
                <Link
                  to={`/${clubSlug}/events`}
                  className="block no-underline"
                >
                  <div className="flex items-center justify-center gap-4 py-2">
                    <CalendarDaysIcon className="h-7 w-7 text-blue-700" />
                    <span className="text-base text-text-base">
                      Events
                    </span>
                  </div>
                </Link>
              </Card>
            )}

            {/* CALENDAR */}
            {clubSlug && (
              <Card className="text-center">
                <Link
                  to={`/${clubSlug}/calendar`}
                  className="block no-underline"
                >
                  <div className="flex items-center justify-center gap-4 py-2">
                    <ClipboardDocumentListIcon className="h-7 w-7 text-blue-700" />
                    <span className="text-base text-text-base">
                      Calendar
                    </span>
                  </div>
                </Link>
              </Card>
            )}

            {/* NOMINATE */}
            {clubSlug && (
              <Card className="text-center">
                <Link
                  to={`/${clubSlug}/nominate`}
                  className="block no-underline"
                >
                  <div className="flex items-center justify-center gap-4 py-2">
                    <UserGroupIcon className="h-7 w-7 text-blue-700" />
                    <span className="text-base text-text-base">
                      Nominate
                    </span>
                  </div>
                </Link>
              </Card>
            )}

            {/* RESULTS */}
            <Card className="text-center text-text-muted">
              <div className="flex items-center justify-center gap-4 py-2">
                <TrophyIcon className="h-7 w-7 text-gray-400" />
                <span className="text-base">
                  Results (members only)
                </span>
              </div>
            </Card>

            {/* MEMBERSHIP */}
            {clubSlug && (
              <Card className="text-center col-span-2">
                <Link
                  to={`/${clubSlug}/membership`}
                  className="block no-underline"
                >
                  <div className="flex items-center justify-center gap-4 py-2">
                    <IdentificationIcon className="h-7 w-7 text-blue-700" />
                    <span className="text-base text-text-base">
                      Membership
                    </span>
                  </div>
                </Link>
              </Card>
            )}

          </div>
        </section>

        {/* AUTH LINKS */}
        {!isLoggedIn && clubSlug && (
          <section>
            <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-text-muted mb-3">
              Get Started
            </h2>

            <div className="flex flex-col gap-3">

              <Card className="p-0">
                <Link
                  to={`/${clubSlug}/login`}
                  className="block w-full text-center py-3"
                >
                  Member Login
                </Link>
              </Card>

              <Button
                as={Link}
                to={`/${clubSlug}/signup`}
                className="w-full text-center py-3"
              >
                Create Account
              </Button>

            </div>
          </section>
        )}

      </main>
    </div>
  );
}
