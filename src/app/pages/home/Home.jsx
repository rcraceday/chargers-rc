// src/app/pages/Home.jsx
import { Link, useOutletContext } from "react-router-dom";
import { useAuth } from "@app/providers/AuthProvider";

export default function Home() {
  const { club } = useOutletContext();
  const { user } = useAuth();

  const clubSlug = club?.slug;
  const isLoggedIn = !!user;

  const logoSrc =
    club?.logo_url ??
    club?.logo ??
    "/chargers-logo.png"; // Local fallback

  return (
    <div className="min-h-screen w-full flex justify-center px-4 py-10 bg-surface-alt">
      <div className="w-full max-w-4xl space-y-12">

        {/* HERO / CLUB HEADER */}
        <section className="card">
          <div className="flex items-center gap-6">
            <img
              src={logoSrc}
              alt={`${club?.name ?? "Club"} logo`}
              className="h-16 w-auto object-contain"
            />

            <div>
              <h1 className="text-3xl font-bold text-brand-secondary">
                {club?.name ?? "Your Club"}
              </h1>
              <p className="text-text-muted text-sm mt-1">
                Your home for racing, events, and community.
              </p>
            </div>
          </div>

          <div className="mt-4 text-sm">
            {isLoggedIn ? (
              <span className="text-brand-primary font-medium">
                You’re logged in
              </span>
            ) : (
              <span className="text-text-muted">
                Browsing as guest
              </span>
            )}
          </div>
        </section>

        {/* CLUB NEWS */}
        <section>
          <h2 className="section-title">Club News</h2>

          <div className="card">
            <p className="text-text-muted text-sm">
              No news posted yet. Stay tuned for updates from the club.
            </p>
          </div>
        </section>

        {/* NEXT EVENT */}
        <section>
          <h2 className="section-title">Next Event</h2>

          <div className="card">
            <p className="text-text-muted text-sm">
              The next event will appear here once scheduled.
            </p>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section>
          <h2 className="section-title">Quick Actions</h2>

          <div className="grid grid-cols-2 gap-4">

            {clubSlug && (
              <Link
                to={`/${clubSlug}/events`}
                className="card card-hover text-center text-sm font-semibold hover:bg-brand-primary/10 hover:text-brand-secondary transition"
              >
                Events
              </Link>
            )}

            {clubSlug && (
              <Link
                to={`/${clubSlug}/calendar`}
                className="card card-hover text-center text-sm font-semibold hover:bg-brand-primary/10 hover:text-brand-secondary transition"
              >
                Calendar
              </Link>
            )}

            <div className="card text-center text-sm text-text-muted shadow-inner">
              Results (members only)
            </div>

            {clubSlug && (
              <Link
                to={`/${clubSlug}/profile/drivers`}
                className="card card-hover text-center text-sm font-semibold hover:bg-brand-primary/10 hover:text-brand-secondary transition"
              >
                Driver Manager
              </Link>
            )}

            <div className="card text-center text-sm text-text-muted shadow-inner">
              Setups (members only)
            </div>

            {clubSlug && (
              <Link
                to={`/${clubSlug}/membership`}
                className="card card-hover text-center text-sm font-semibold hover:bg-brand-primary/10 hover:text-brand-secondary transition"
              >
                Membership
              </Link>
            )}
          </div>
        </section>

        {/* AUTH LINKS */}
        {!isLoggedIn && clubSlug && (
          <section>
            <h2 className="section-title">Get Started</h2>

            <div className="flex flex-col gap-3">
              <Link
                to={`/${clubSlug}/login`}
                className="btn-subtle text-center"
              >
                Member Login
              </Link>

              <Link
                to={`/${clubSlug}/signup`}
                className="btn text-center"
              >
                Create Account
              </Link>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
