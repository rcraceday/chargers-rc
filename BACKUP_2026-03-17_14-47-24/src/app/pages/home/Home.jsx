// src/app/pages/home/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@app/providers/AuthProvider";
import { supabase } from "@/supabaseClient";

import { useClub } from "@/app/providers/ClubProvider";

import Card from "@/components/ui/Card";
import ClubHero from "@/components/ui/ClubHero";

import {
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  IdentificationIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const { club, loadingClub } = useClub();
  const { user } = useAuth();

  const clubSlug = club?.slug;

  const [nextEvent, setNextEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);

  useEffect(() => {
    if (!club?.id) return;

    async function fetchNextEvent() {
      setLoadingEvent(true);

      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("club_id", club.id)
        .eq("is_published", true)
        .gte("event_date", today)
        .order("event_date", { ascending: true })
        .limit(1);

      if (!error && data?.length > 0) {
        setNextEvent(data[0]);
      }

      setLoadingEvent(false);
    }

    fetchNextEvent();
  }, [club?.id]);

  // Only show loading while the real ClubProvider is actually fetching
  if (loadingClub && club === null) {
    return (
      <div className="w-full text-center text-gray-400 py-10">
        Loading club…
      </div>
    );
  }

  return (
    <>
      {/* FULL-WIDTH HERO */}
      <ClubHero variant="medium" showLogo={true} />

      {/* PAGE CONTENT */}
      <div className="w-full max-w-[1024px] mx-auto px-4 py-10 space-y-10">

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

          {loadingEvent && (
            <Card>
              <p className="text-text-muted">Loading event...</p>
            </Card>
          )}

          {!loadingEvent && !nextEvent && (
            <Card>
              <p className="text-text-muted">No upcoming events scheduled.</p>
            </Card>
          )}

          {!loadingEvent && nextEvent && (
            <Link
              to={`/${clubSlug}/app/events/${nextEvent.id}`}
              className="block no-underline"
            >
              <Card className="space-y-3 text-center hover:opacity-90 transition">
                {nextEvent.logoUrl && (
                  <img
                    src={nextEvent.logoUrl}
                    alt={`${nextEvent.name} logo`}
                    className="mx-auto max-w-full h-auto"
                    style={{ objectFit: "contain", width: "120px" }}
                  />
                )}

                <h3 className="text-lg font-semibold text-text-base">
                  {nextEvent.name}
                </h3>

                <p className="text-text-muted">
                  {new Date(nextEvent.event_date).toLocaleDateString("en-AU", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>

                {nextEvent.track && (
                  <p className="text-text-muted">Track: {nextEvent.track}</p>
                )}
              </Card>
            </Link>
          )}
        </section>

        {/* QUICK ACTIONS */}
        <section>
          <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-text-muted mb-3">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {clubSlug && (
              <Card className="text-center">
                <Link
                  to={`/${clubSlug}/app/events`}
                  className="block no-underline"
                >
                  <div className="flex items-center justify-center gap-3 py-2">
                    <CalendarDaysIcon className="h-6 w-6 text-blue-700" />
                    <span className="text-base text-text-base">Events</span>
                  </div>
                </Link>
              </Card>
            )}

            {clubSlug && (
              <Card className="text-center">
                <Link
                  to={`/${clubSlug}/app/calendar`}
                  className="block no-underline"
                >
                  <div className="flex items-center justify-center gap-3 py-2">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-blue-700" />
                    <span className="text-base text-text-base">Calendar</span>
                  </div>
                </Link>
              </Card>
            )}

            {clubSlug && (
              <Card className="text-center">
                <Link
                  to={`/${clubSlug}/app/nominate`}
                  className="block no-underline"
                >
                  <div className="flex items-center justify-center gap-3 py-2">
                    <UserGroupIcon className="h-6 w-6 text-blue-700" />
                    <span className="text-base text-text-base">Nominate</span>
                  </div>
                </Link>
              </Card>
            )}

            <Card className="text-center text-text-muted">
              <div className="flex items-center justify-center gap-3 py-2">
                <TrophyIcon className="h-6 w-6 text-gray-400" />
                <span className="text-base">Results</span>
              </div>
            </Card>

            {clubSlug && (
              <Card className="text-center">
                <Link
                  to={`/${clubSlug}/app/membership`}
                  className="block no-underline"
                >
                  <div className="flex items-center justify-center gap-3 py-2">
                    <IdentificationIcon className="h-6 w-6 text-blue-700" />
                    <span className="text-base text-text-base">Membership</span>
                  </div>
                </Link>
              </Card>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
