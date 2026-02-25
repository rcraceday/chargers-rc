import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
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

function formatDateTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EventDetails() {
  const { id, clubSlug } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [attending, setAttending] = useState([]);
  const [loadingAttending, setLoadingAttending] = useState(true);

  useEffect(() => {
    async function loadEvent() {
      setLoading(true);

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) setEvent(data);

      setLoading(false);
    }

    loadEvent();
  }, [id]);

  // ⭐ Load drivers attending (nominations)
  useEffect(() => {
    async function loadAttending() {
      setLoadingAttending(true);

      const { data, error } = await supabase
        .from("nominations")
        .select(`
          id,
          driver_id,
          drivers (
            id,
            first_name,
            last_name,
            number,
            driver_type,
            is_junior
          )
        `)
        .eq("event_id", id);

      if (!error && data) {
        setAttending(
          data
            .map((n) => n.drivers)
            .filter(Boolean)
            .sort((a, b) => (a.number || 9999) - (b.number || 9999))
        );
      }

      setLoadingAttending(false);
    }

    loadAttending();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center px-4 py-6">
        <div className="w-full max-w-xl">
          <p className="text-text-muted">Loading event…</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex justify-center px-4 py-6">
        <div className="w-full max-w-xl">
          <p className="text-text-muted">Event not found.</p>
        </div>
      </div>
    );
  }

  const now = new Date();
  const open = event.nominations_open ? new Date(event.nominations_open) : null;
  const close = event.nominations_close ? new Date(event.nominations_close) : null;

  const nominationsOpen =
    open && close && now >= open && now <= close;

  // ⭐ Event type badge
  const type = event.type || "race";
  const typeColors = {
    race: "#00438A",
    practice: "#008A2E",
    meeting: "#8A0043",
  };

  const badgeStyle = {
    background: typeColors[type] || "#00438A",
    color: "white",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "capitalize",
    display: "inline-block",
  };

  // ⭐ ICS download
  function downloadICS() {
    const start = new Date(event.event_date);
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000); // 3 hours default

    const pad = (n) => String(n).padStart(2, "0");

    const formatICS = (d) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
        d.getUTCHours()
      )}${pad(d.getUTCMinutes())}00Z`;

    const ics = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Chargers RC//Event Calendar//EN
BEGIN:VEVENT
UID:${event.id}
DTSTAMP:${formatICS(new Date())}
DTSTART:${formatICS(start)}
DTEND:${formatICS(end)}
SUMMARY:${event.event_name || event.name}
DESCRIPTION:${event.description || ""}
END:VEVENT
END:VCALENDAR
    `.trim();

    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.event_name || event.name}.ics`;
    a.click();

    URL.revokeObjectURL(url);
  }

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
                {event.event_name || event.name}
              </h1>
            </div>
          </div>

        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 pt-10 pb-12 space-y-10">

        {/* EVENT INFO */}
        <section>
          <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-text-muted mb-3">
            Event Information
          </h2>

          <Card>

            {/* Logo */}
            {event.event_logo && (
              <div className="w-full h-48 rounded-md bg-white overflow-hidden flex items-center justify-center mb-4">
                <img
                  src={event.event_logo}
                  alt="Event Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Type badge */}
            <div className="mb-3">
              <span style={badgeStyle}>{type}</span>
            </div>

            {/* Date */}
            <div className="text-lg font-medium mb-2">
              {formatDate(event.event_date)}
            </div>

            {/* Track */}
            {event.track_type && (
              <div className="text-text-muted mb-4">
                <span className="font-semibold">Track:</span> {event.track_type}
              </div>
            )}

            {/* Description */}
            {event.description && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Event Details</h3>
                <p className="text-text-base whitespace-pre-line leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

            {/* Add to Calendar */}
            <button
              onClick={downloadICS}
              className="mt-4 px-4 py-2 rounded-md font-semibold"
              style={{
                background: "#00438A",
                color: "white",
              }}
            >
              Add to Calendar
            </button>

          </Card>
        </section>

        {/* DRIVERS ATTENDING */}
        <section>
          <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-text-muted mb-3">
            Drivers Attending
          </h2>

          <Card>
            {loadingAttending && (
              <p className="text-text-muted">Loading drivers…</p>
            )}

            {!loadingAttending && attending.length === 0 && (
              <p className="text-text-muted">No nominations yet.</p>
            )}

            {!loadingAttending && attending.length > 0 && (
              <div className="space-y-3">
                {attending.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between border-b border-gray-200 pb-2"
                  >
                    <div className="flex items-center gap-3">

                      {/* Driver number */}
                      {d.number && (
                        <div
                          className="w-10 h-10 rounded-md flex items-center justify-center text-white font-bold"
                          style={{ background: "#00438A" }}
                        >
                          {d.number}
                        </div>
                      )}

                      {/* Name */}
                      <div className="text-text-base font-medium">
                        {d.first_name} {d.last_name}
                      </div>
                    </div>

                    {/* Junior badge */}
                    {d.is_junior && (
                      <span
                        className="px-2 py-1 rounded-md text-xs font-semibold"
                        style={{ background: "#8A0043", color: "white" }}
                      >
                        Junior
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>

        {/* EVENT RESULTS */}
        <section>
          <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-text-muted mb-3">
            Event Results
          </h2>

          <Card>
            <p className="text-text-muted">
              No results posted yet.
            </p>
          </Card>
        </section>

        {/* NOMINATE BUTTON */}
        <section>
          {nominationsOpen ? (
            <Link
              to={`/${clubSlug}/nominations/${event.id}/start`}
              className="block text-center py-3 rounded-md font-semibold"
              style={{
                background: "#00438A",
                color: "white",
              }}
            >
              Nominate for this Event
            </Link>
          ) : (
            <div
              className="text-center py-3 rounded-md font-semibold"
              style={{
                background: "#d1d5db",
                color: "#374151",
              }}
            >
              Nominations Closed
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
