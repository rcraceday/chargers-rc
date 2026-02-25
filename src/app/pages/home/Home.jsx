// src/app/pages/Home.jsx
import { Link, useOutletContext } from "react-router-dom";
import { useAuth } from "@app/providers/AuthProvider";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function Home() {
  const { club } = useOutletContext();
  const { user } = useAuth();

  const clubSlug = club?.slug;
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen w-full bg-background text-text-base">

      {/* HERO — Chargers Blue, White Text, Thin Outline, Centered */}
      <section className="w-full bg-surface border-b border-surfaceBorder">
        <div className="max-w-6xl mx-auto px-4 pt-10 pb-10">

          {/* OUTER WRAPPER WITH THIN OUTLINE + SHADOW */}
          <div
            className="rounded-lg"
            style={{
              padding: "1px",
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
                // ↑ bumped top padding by another ~2px (33 → 35)
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
                <Link to={`/${clubSlug}/events`}>
                  Events
                </Link>
              </Card>
            )}

            {/* CALENDAR */}
            {clubSlug && (
              <Card className="text-center">
                <Link to={`/${clubSlug}/calendar`}>
                  Calendar
                </Link>
              </Card>
            )}

            {/* NOMINATE */}
            {clubSlug && (
              <Card className="text-center">
                <Link to={`/${clubSlug}/nominate`}>
                  Nominate
                </Link>
              </Card>
            )}

            {/* RESULTS */}
            <Card className="text-center text-text-muted">
              Results (members only)
            </Card>

            {/* MEMBERSHIP */}
            {clubSlug && (
              <Card className="text-center col-span-2">
                <Link to={`/${clubSlug}/membership`}>
                  Membership
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
