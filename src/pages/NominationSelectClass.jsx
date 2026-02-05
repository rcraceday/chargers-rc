import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function NominationSelectClass() {
  const { eventId, driverId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Selected classes
  const [class1, setClass1] = useState("");
  const [class2, setClass2] = useState("");
  const [preferenceClass, setPreferenceClass] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        // Load event
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();

        if (eventError) throw eventError;
        setEvent(eventData);

        // Load classes
        const { data: classData, error: classError } = await supabase
          .from("event_classes")
          .select("*")
          .eq("event_id", eventId)
          .order("class_name", { ascending: true });

        if (classError) throw classError;
        setClasses(classData);
      } catch (err) {
        console.error(err);
        setError("Unable to load event or classes.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [eventId]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;
  if (!event) return <p>Event not found.</p>;

  // Filtered dropdown options
  const class1Options = classes;

  const class2Options = classes.filter((c) => c.id !== class1);

  const preferenceOptions = classes.filter(
    (c) => c.id !== class1 && c.id !== class2
  );

  async function handleSubmit(e) {
    e.preventDefault();

    if (!class1) {
      alert("Please select your first class.");
      return;
    }

    try {
      const { error: insertError } = await supabase.from("nominations").insert({
        event_id: eventId,
        driver_id: driverId,
        class_1_id: class1,
        class_2_id: class2 || null,
        class_3_preference_id: preferenceClass || null,
      });

      if (insertError) throw insertError;

      navigate(`/nominations/confirm/${eventId}/${driverId}`);
    } catch (err) {
      console.error(err);
      alert("There was an error submitting your nomination.");
    }
  }

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1>Nominate for {event.name}</h1>

      <p>
        <strong>Date:</strong> {event.event_date}
      </p>

      <h2>Select Your Classes</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        {/* CLASS 1 */}
        <label>
          <strong>Class 1 (Required)</strong>
        </label>
        <select
          value={class1}
          onChange={(e) => {
            setClass1(e.target.value);
            setClass2("");
            setPreferenceClass("");
          }}
          required
        >
          <option value="">Select class…</option>
          {class1Options.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.class_name} — {cls.price === 0 ? "Free" : `$${cls.price}`}
            </option>
          ))}
        </select>

        <br /><br />

        {/* CLASS 2 */}
        <label>
          <strong>Class 2 (Optional)</strong>
        </label>
        <select
          value={class2}
          onChange={(e) => {
            setClass2(e.target.value);
            setPreferenceClass("");
          }}
        >
          <option value="">No second class</option>
          {class2Options.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.class_name} — {cls.price === 0 ? "Free" : `$${cls.price}`}
            </option>
          ))}
        </select>

        <br /><br />

        {/* PREFERENCE CLASS */}
        <label>
          <strong>Preference Class (Optional, Free)</strong>
        </label>
        <p style={{ marginTop: "0.25rem", fontSize: "0.9rem", color: "#555" }}>
          This class is not guaranteed. Admin may add you if numbers are needed.
        </p>

        <select
          value={preferenceClass}
          onChange={(e) => setPreferenceClass(e.target.value)}
        >
          <option value="">No preference class</option>
          {preferenceOptions.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.class_name}
            </option>
          ))}
        </select>

        <br /><br />

        <button type="submit" style={{ padding: "0.75rem 1.5rem" }}>
          Submit Nomination
        </button>
      </form>
    </div>
  );
}
