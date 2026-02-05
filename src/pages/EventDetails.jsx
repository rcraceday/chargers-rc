// src/pages/EventDetails.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    async function fetchEvent() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) setEvent(data);
    }

    fetchEvent();
  }, [id]);

  if (!event) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{event.name}</h1>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Track Type:</strong> {event.track_type}</p>

      <h2>Classes</h2>
      <ul>
        {event.classes?.map((cls, index) => (
          <li key={index}>
            {cls.name} — ${cls.price}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "20px" }}>
        <Link to={`/nominations?eventId=${event.id}`}>
          <button style={{ padding: "10px 20px", fontSize: "16px" }}>
            Nominate for this Event
          </button>
        </Link>
      </div>
    </div>
  );
}
