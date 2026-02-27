// src/app/pages/home/Home.jsx
import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useAuth } from "@app/providers/AuthProvider";
import { useTheme } from "@app/providers/ThemeProvider";
import { supabase } from "@/supabaseClient";

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
  const { palette } = useTheme();

  const clubSlug = club?.slug;
  const isLoggedIn = !!user;

  // -----------------------------
  // NEXT EVENT FETCHING
  // -----------------------------
  const [nextEvent, setNextEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);

  useEffect(() => {
    if (!club?.id) return;

    async function fetchNextEvent() {
      setLoadingEvent(true);

      const today = new Date().toISOString().split("T")[0]; // compare by date only

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

  return (
    <div className="w-full bg-background text-text-base font-[Poppins]">

      {/* MAIN CONTENT */}
      <main className="max-w-xl mx-auto px-4 pt-8 pb-12 space-y-10">

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
              to={`/${clubSlug}/events/${nextEvent.id}`}
              className="block no-underline"
            >
              <Card className="space-y-3 text-center cursor-pointer hover:opacity-90 transition">

                {/* EVENT LOGO */}
                {nextEvent.logoUrl && (
                  <img
                    src={nextEvent.logoUrl}
                    alt={`${nextEvent.name} logo`}
                    className="mx-auto"
                    style={{
                      width: "120px",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                )}

                {/* EVENT NAME */}
                <h3 className="text-lg font-semibold text-text-base">
                  {nextEvent.name}
                </h3>

                {/* EVENT DATE */}
                <p className="text-text-muted">
                  {new Date(nextEvent.event_date).toLocaleDateString("en-AU", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>

                {/* TRACK */}
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

          <div className="grid grid-cols-2 gap-4">

            {clubSlug && (
              <Card className="text-center">
                <Link to={`/${clubSlug}/events`} className="block no-underline">
                  <div className="flex items-center justify-center gap-3 py-2">
                    <CalendarDaysIcon className="h-6 w-6 text-blue-700" />
                    <span className="text-base text-text-base">Events</span>
                  </div>
                </Link>
              </Card>
            )}

            {clubSlug && (
              <Card className="text-center">
                <Link to={`/${clubSlug}/calendar`} className="block no-underline">
                  <div className="flex items-center justify-center gap-3 py-2">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-blue-700" />
                    <span className="text-base text-text-base">Calendar</span>
                  </div>
                </Link>
              </Card>
            )}

            {clubSlug && (
              <Card className="text-center">
                <Link to={`/${clubSlug}/nominate`} className="block no-underline">
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
              <Card className="text-center col-span-2">
                <Link to={`/${clubSlug}/membership`} className="block no-underline">
                  <div className="flex items-center justify-center gap-3 py-2">
                    <IdentificationIcon className="h-6 w-6 text-blue-700" />
                    <span className="text-base text-text-base">Membership</span>
                  </div>
                </Link>
              </Card>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
