import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import useProfile from "../hooks/useProfile";

export default function NominationStart() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const { profile, loading: profileLoading } = useProfile();

  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadEvent() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error) {
        console.error("Error loading event:", error);
        setErrorMsg("Unable to load event.");
      } else {
        setEvent(data);
      }

      setLoadingEvent(false);
    }

    loadEvent();
  }, [eventId]);

  if (profileLoading || loadingEvent) return <p>Loading…</p>;
  if (errorMsg) return <p>{errorMsg}</p>;
  if (!event) return <p>Event not found.</p>;

  // When user selects themselves or a family member
  function handleSelectDriver(driverId) {
    navigate(`/nominations/select-class/${eventId}/${driverId}`);
  }

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1>Nominate for {event.name}</h1>

      <p>
        <strong>Date:</strong> {event.event_date}
      </p>

      <h2 style={{ marginTop: "2rem" }}>Who are you nominating?</h2>

      {/* User themselves */}
      <div
        onClick={() => handleSelectDriver(profile.id)}
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "1rem",
          cursor: "pointer",
        }}
      >
        <strong>{profile.full_name}</strong>
        <p style={{ margin: "0.25rem 0" }}>This is you</p>
      </div>

      {/* Family members (future expansion) */}
      {profile.family_members && profile.family_members.length > 0 && (
        <>
          <h3>Family Members</h3>
          {profile.family_members.map((member) => (
            <div
              key={member.id}
              onClick={() => handleSelectDriver(member.id)}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
                cursor: "pointer",
              }}
            >
              <strong>{member.full_name}</strong>
            </div>
          ))}
        </>
      )}

      <div style={{ marginTop: "2rem" }}>
        <Link to={`/events/${eventId}`}>← Back to Event</Link>
      </div>
    </div>
  );
}
