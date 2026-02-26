import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { useTheme } from "@/app/providers/ThemeProvider";

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isNominationsOpen(event) {
  const now = new Date();
  const openAt = event.nominations_open ? new Date(event.nominations_open) : null;
  const closeAt = event.nominations_close ? new Date(event.nominations_close) : null;

  if (!openAt) return false;
  if (now < openAt) return false;
  if (closeAt && now > closeAt) return false;
  return true;
}

export default function AdminEvents() {
  const { clubSlug } = useParams();
  const { palette } = useTheme();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  // Filters
  const [query, setQuery] = useState("");
  const [trackFilter, setTrackFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data: eventRows, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const { data: nomRows } = await supabase
        .from("nominations")
        .select("event_id");

      const counts = {};
      (nomRows || []).forEach((n) => {
        counts[n.event_id] = (counts[n.event_id] || 0) + 1;
      });

      const enriched = eventRows.map((ev) => ({
        ...ev,
        nomination_count: counts[ev.id] || 0,
      }));

      setEvents(enriched);
      setLoading(false);
    }

    load();
  }, []);

  function applyFilters(list) {
    return list.filter((e) => {
      const q = query.toLowerCase();
      const name = (e.name || "").toLowerCase();
      const track = (e.track_type || e.track || "").toLowerCase();
      const dateStr = formatDate(e.event_date).toLowerCase();
      const open = isNominationsOpen(e);

      const matchesQuery =
        !q || name.includes(q) || track.includes(q) || dateStr.includes(q);

      const matchesTrack =
        trackFilter === "all" || track.includes(trackFilter);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "open" && open) ||
        (statusFilter === "closed" && !open);

      return matchesQuery && matchesTrack && matchesStatus;
    });
  }

  let filteredEvents = applyFilters(events);

  filteredEvents = [...filteredEvents].sort((a, b) => {
    const da = a.event_date ? new Date(a.event_date) : new Date(0);
    const db = b.event_date ? new Date(b.event_date) : new Date(0);
    return sortOrder === "asc" ? da - db : db - da;
  });

  function clearFilters() {
    setQuery("");
    setTrackFilter("all");
    setStatusFilter("all");
    setSortOrder("asc");
  }

  async function handleDuplicate(event) {
    setSavingId(event.id);

    const payload = {
      name: `${event.name || "Event"} (Copy)`,
      event_date: event.event_date,
      track_type: event.track_type,
      open_at: event.open_at,
      close_at: event.close_at,
      logourl: event.logourl,
      logoUrl: event.logoUrl,
      track: event.track,
      classes: event.classes,
      description: event.description,
      nominations_open: null,
      nominations_close: null,
      member_price: event.member_price,
      non_member_price: event.non_member_price,
      junior_price: event.junior_price,
      class_limit: event.class_limit,
      preference_enabled: event.preference_enabled,
    };

    const { data, error } = await supabase
      .from("events")
      .insert(payload)
      .select()
      .single();

    if (!error) {
      setEvents((prev) => [...prev, { ...data, nomination_count: 0 }]);
    }

    setSavingId(null);
  }

  return (
    <div className="min-h-screen w-full bg-[#f7f7f7]">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-900">Events</h1>

          {/* NEW: Chargers-style red pill button */}
          <Link
            to={`/${clubSlug}/admin/events/new`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 text-sm font-medium transition no-underline"
            style={{ textDecoration: "none" }}
          >
            ➕ <span>Add Event</span>
          </Link>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-wrap gap-3">

          <input
            type="text"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-64 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm"
          />

          <select
            value={trackFilter}
            onChange={(e) => setTrackFilter(e.target.value)}
            className="w-full sm:w-40 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm"
          >
            <option value="all">All Tracks</option>
            <option value="dirt">Dirt</option>
            <option value="sic">SIC</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-40 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm"
          >
            <option value="all">All Status</option>
            <option value="open">Nominations Open</option>
            <option value="closed">Nominations Closed</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full sm:w-40 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm"
          >
            <option value="asc">Date ↑</option>
            <option value="desc">Date ↓</option>
          </select>

          <button
            onClick={clearFilters}
            className="px-4 py-1.5 rounded-md text-sm bg-gray-200 hover:bg-gray-300"
          >
            Clear
          </button>
        </div>

        {/* LOADING */}
        {loading && <p className="text-gray-500">Loading events…</p>}

{/* EVENT LIST */}
<div className="space-y-6">
  {filteredEvents.map((event) => {
    const open = isNominationsOpen(event);
    const logoSrc = event.logoUrl || event.logourl || null;
    const isBusy = savingId === event.id;

    return (
<div
  key={event.id}
  className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
>
  <div className="flex items-start gap-6">

    {/* LEFT: LOGO + INFO */}
    <div className="flex gap-4 flex-grow min-w-0">

      {/* LOGO */}
      {logoSrc && (
        <div className="w-16 h-16 border border-gray-200 rounded-md overflow-hidden flex items-center justify-center">
          <img
            src={logoSrc}
            alt="Event Logo"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* INFO */}
      <div className="space-y-1">
        <p className="text-lg font-semibold text-gray-900 truncate">
          {event.name}
        </p>

        <p className="text-sm text-gray-500">
          {event.event_date ? formatDate(event.event_date) : "No date set"}
        </p>

        {event.track_type && (
          <p className="text-xs text-gray-500">
            Track: {event.track_type}
          </p>
        )}

        <p className="text-xs text-gray-500">
          Nominations:{" "}
          <span className="font-semibold text-gray-900">
            {event.nomination_count}
          </span>
        </p>
      </div>
    </div>

    {/* RIGHT: BADGE + DATES + ACTIONS */}
    <div className="flex flex-col items-end gap-2 text-xs flex-shrink-0 min-w-[240px]">

      {/* BADGE */}
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
          open
            ? "bg-green-100 text-green-700 border-green-300"
            : "bg-red-100 text-red-700 border-red-300"
        }`}
      >
        {open ? "Nominations Open" : "Nominations Closed"}
      </span>

      {/* NOMINATION WINDOW INFO */}
      <div className="text-[11px] text-gray-500 text-right leading-tight">
        {event.nominations_open && (
          <div>Opens: {formatDate(event.nominations_open)}</div>
        )}
        {event.nominations_close && (
          <div>Closes: {formatDate(event.nominations_close)}</div>
        )}
      </div>

      {/* ACTION BAR */}
      <div className="flex flex-wrap justify-end gap-2 pt-1">

        <Link
          to={`/${clubSlug}/admin/events/${event.id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border bg-white hover:bg-gray-100"
        >
          ✏️ Edit
        </Link>

        <Link
          to={`/${clubSlug}/admin/events/${event.id}/nominations`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border bg-white hover:bg-gray-100"
        >
          📝 Nominations
        </Link>

        <Link
          to={`/${clubSlug}/admin/events/${event.id}/classes`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border bg-white hover:bg-gray-100"
        >
          📦 Classes
        </Link>

        <button
          onClick={() => handleDuplicate(event)}
          disabled={isBusy}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border bg-white hover:bg-gray-100 disabled:opacity-60"
        >
          📄 {isBusy ? "Duplicating…" : "Duplicate"}
        </button>

      </div>
    </div>
  </div>
</div>
    );
  })}
</div>

      </div>
    </div>
  );
}
