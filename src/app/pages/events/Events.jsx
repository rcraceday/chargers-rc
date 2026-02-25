import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import Card from "@/components/ui/Card";

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // ⭐ race / practice / meeting / all
  const { clubSlug } = useParams();

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

      if (!error && data) {
        setEvents(data);
      }

      setLoading(false);
    }

    loadEvents();
  }, []);

  // ⭐ Split into upcoming + past
  const now = new Date();

  const upcoming = events.filter((e) => new Date(e.event_date) >= now);
  const past = events.filter((e) => new Date(e.event_date) < now);

  // ⭐ Apply filter
  const filteredUpcoming = useMemo(() => {
    if (filter === "all") return upcoming;
    return upcoming.filter((e) => (e.type || "race") === filter);
  }, [upcoming, filter]);

  const filteredPast = useMemo(() => {
    if (filter === "all") return past;
    return past.filter((e) => (e.type || "race") === filter);
  }, [past, filter]);

  // ⭐ Group by Year → Month
  function groupByYearMonth(list) {
    const groups = {};

    list.forEach((event) => {
      const d = new Date(event.event_date);
      const year = d.getFullYear();
      const month = d.toLocaleString("en-GB", { month: "long" });

      if (!groups[year]) groups[year] = {};
      if (!groups[year][month]) groups[year][month] = [];

      groups[year][month].push(event);
    });

    return groups;
  }

  const upcomingGroups = groupByYearMonth(filteredUpcoming);
  const pastGroups = groupByYearMonth(filteredPast);

  // ⭐ Badge colours
  const typeColors = {
    race: "#00438A",
    practice: "#008A2E",
    meeting: "#8A0043",
  };

  const badgeStyle = (type) => ({
    background: typeColors[type] || "#00438A",
    color: "white",
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "capitalize",
    display: "inline-block",
  });

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
                Events
              </h1>
            </div>
          </div>

        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 pt-10 pb-12 space-y-12">

        {/* FILTERS */}
        <section>
          <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-text-muted mb-4">
            Filter Events
          </h2>

          <div className="flex gap-3 flex-wrap">
            {["all", "race", "practice", "meeting"].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className="px-4 py-2 rounded-md text-sm font-medium transition-all"
                style={{
                  background: filter === t ? "#00438A" : "#e5e7eb",
                  color: filter === t ? "white" : "#374151",
                }}
              >
                {t === "all" ? "All Events" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {/* UPCOMING EVENTS */}
        <section>
          <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-text-muted mb-4">
            Upcoming Events
          </h2>

          {loading && <p className="text-text-muted">Loading events…</p>}

          {!loading && filteredUpcoming.length === 0 && (
            <p className="text-text-muted">No upcoming events.</p>
          )}

          {!loading &&
            Object.keys(upcomingGroups).map((year) => (
              <div key={year} className="space-y-6 mb-10">

                <h3 className="text-xl font-semibold">{year}</h3>

                {Object.keys(upcomingGroups[year]).map((month) => (
                  <div key={month} className="space-y-4">

                    <h4 className="text-lg font-medium text-text-muted">{month}</h4>

                    {upcomingGroups[year][month].map((event) => (
                      <Card key={event.id} className="p-0">
                        <Link
                          to={`/${clubSlug}/events/${event.id}`}
                          className="block p-4"
                        >
                          <div className="flex gap-4 items-center">

                            {/* Logo */}
                            {event.event_logo && (
                              <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                                <img
                                  src={event.event_logo}
                                  alt="Event Logo"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}

                            {/* Text */}
                            <div className="flex-1 space-y-1">
                              <div className="text-lg font-semibold leading-snug">
                                {event.event_name || event.name}
                              </div>

                              <div className="text-text-muted text-sm">
                                {formatDate(event.event_date)}
                              </div>

                              <span style={badgeStyle(event.type || "race")}>
                                {event.type || "race"}
                              </span>
                            </div>

                            {/* Details button */}
                            <div className="hidden sm:flex flex-shrink-0">
                              <span
                                className="px-4 py-2 rounded-lg text-sm"
                                style={{
                                  background: "#00438A",
                                  color: "white",
                                }}
                              >
                                Details
                              </span>
                            </div>

                          </div>
                        </Link>
                      </Card>
                    ))}

                  </div>
                ))}

              </div>
            ))}
        </section>

        {/* PAST EVENTS */}
        <section>
          <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-text-muted mb-4">
            Past Events
          </h2>

          {!loading && filteredPast.length === 0 && (
            <p className="text-text-muted">No past events.</p>
          )}

          {!loading &&
            Object.keys(pastGroups).map((year) => (
              <div key={year} className="space-y-6 mb-10">

                <h3 className="text-xl font-semibold">{year}</h3>

                {Object.keys(pastGroups[year]).map((month) => (
                  <div key={month} className="space-y-4">

                    <h4 className="text-lg font-medium text-text-muted">{month}</h4>

                    {pastGroups[year][month].map((event) => (
                      <Card key={event.id} className="p-0 opacity-80">
                        <Link
                          to={`/${clubSlug}/events/${event.id}`}
                          className="block p-4"
                        >
                          <div className="flex gap-4 items-center">

                            {/* Logo */}
                            {event.event_logo && (
                              <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                                <img
                                  src={event.event_logo}
                                  alt="Event Logo"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}

                            {/* Text */}
                            <div className="flex-1 space-y-1">
                              <div className="text-lg font-semibold leading-snug">
                                {event.event_name || event.name}
                              </div>

                              <div className="text-text-muted text-sm">
                                {formatDate(event.event_date)}
                              </div>

                              <span style={badgeStyle(event.type || "race")}>
                                {event.type || "race"}
                              </span>
                            </div>

                          </div>
                        </Link>
                      </Card>
                    ))}

                  </div>
                ))}

              </div>
            ))}
        </section>

      </main>
    </div>
  );
}
