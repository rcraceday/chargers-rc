// src/pages/Events.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("event_date", { ascending: true });

        if (error) throw error;
        setEvents(data);
      } catch (err) {
        console.error("Error loading events:", err);
        setError("There was a problem loading events.");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Events</h1>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <Link to={`/events/${event.id}`}>
                {event.name} — {event.event_date}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
