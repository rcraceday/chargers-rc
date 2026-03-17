// =========================
// 1. IMPORTS
// =========================

// --- React & Router ---
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

// --- Supabase client ---
import { supabase } from "@/supabaseClient";

// --- Drag and Drop (dnd-kit) ---
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

// =========================
// 2. CONSTANTS & HELPERS
// =========================

// --- Track options ---
const TRACK_OPTIONS = ["Dirt Track", "SIC Surface"];

// --- Date helpers ---
function toLocalInputValue(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const pad = (n) => n.toString().padStart(2, "0");
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}

function toLocalDateValue(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const pad = (n) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
}

// =========================
// 3. DRAG & DROP COMPONENTS
// =========================

// --- Sortable item with vertical SVG handle ---
function SortableItem({ cls, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cls.class_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400"
          aria-label="Reorder class"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <circle cx="7" cy="5" r="1.5" />
            <circle cx="13" cy="5" r="1.5" />
            <circle cx="7" cy="10" r="1.5" />
            <circle cx="13" cy="10" r="1.5" />
            <circle cx="7" cy="15" r="1.5" />
            <circle cx="13" cy="15" r="1.5" />
          </svg>
        </button>

        {children}
      </div>
    </div>
  );
}

// =========================
// 4. COMPONENT
// =========================

export default function AdminEventEdit() {
  const { clubSlug, id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "new";

  // --- Drag & drop sensors ---
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // =========================
  // 4.1 STATE
  // =========================

  // --- Event state ---
  const [event, setEvent] = useState({
    name: "",
    event_date: "",
    description: "",
    logoUrl: "",
    track: "",
    nominations_open: "",
    nominations_close: "",
    member_price: 10,
    non_member_price: 20,
    junior_price: 0,
    preference_enabled: true,
    class_limit: 3,
  });

  // --- Upload state ---
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // --- UI toggles ---
  const [showAdvanced, setShowAdvanced] = useState(false);

  // --- Class state ---
  const [allTrackClasses, setAllTrackClasses] = useState([]);
  const [nominationClasses, setNominationClasses] = useState([]);

  // --- Saving state ---
  const [saving, setSaving] = useState(false);

  // --- Derived state ---
  const enabledClasses = useMemo(
    () => nominationClasses.filter((c) => c.is_enabled),
    [nominationClasses]
  );
  // =========================
  // 5. EFFECTS
  // =========================

  // --- Load event + classes on mount ---
  useEffect(() => {
    loadEventAndClasses();
  }, [id]);

  // --- Load track classes when track changes ---
  useEffect(() => {
    if (event.track) {
      loadTrackClasses(event.track);
    }
  }, [event.track]);

  // =========================
  // 6. DATA LOADERS
  // =========================

  // --- Load event + nomination classes ---
  async function loadEventAndClasses() {
    if (isNew) {
      setNominationClasses([]);
      return;
    }

    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (eventError) {
      console.error("Error loading event:", eventError);
      return;
    }

    setEvent({
      ...eventData,
      event_date: toLocalInputValue(eventData.event_date),
      nominations_open: toLocalInputValue(eventData.nominations_open),
      nominations_close: toLocalInputValue(eventData.nominations_close),
    });

    const { data: classData, error: classError } = await supabase
      .from("event_classes")
      .select("*")
      .eq("event_id", id)
      .order("order_index", { ascending: true });

    if (classError) {
      console.error("Error loading event classes:", classError);
      return;
    }

    setNominationClasses(classData);
  }

  // --- Load classes for selected track ---
  async function loadTrackClasses(trackName) {
    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .eq("track", trackName)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error loading track classes:", error);
      return;
    }

    setAllTrackClasses(data);

    // If new event, initialize nomination classes
    if (isNew) {
      const initial = data.map((cls, index) => ({
        class_id: cls.id,
        class_name: cls.name,
        is_enabled: false,
        order_index: index + 1,
      }));
      setNominationClasses(initial);
    }
  }
  // =========================
  // 7. MUTATORS / HANDLERS
  // =========================

  // --- Handle drag & drop reordering ---
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setNominationClasses((prev) => {
      const oldIndex = prev.findIndex((c) => c.class_id === active.id);
      const newIndex = prev.findIndex((c) => c.class_id === over.id);

      const updated = [...prev];
      const [moved] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, moved);

      return updated.map((c, i) => ({ ...c, order_index: i + 1 }));
    });
  }

  // --- Toggle class enabled ---
  function toggleClassEnabled(classId) {
    setNominationClasses((prev) =>
      prev.map((c) =>
        c.class_id === classId ? { ...c, is_enabled: !c.is_enabled } : c
      )
    );
  }

  // --- Track change ---
  function handleTrackChange(e) {
    const newTrack = e.target.value;
    setEvent((prev) => ({ ...prev, track: newTrack }));
  }

  // --- File upload (logo) ---
  async function handleFileUpload(e) {
    try {
      setUploading(true);
      setUploadError("");

      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `event-${id}-${Date.now()}.${fileExt}`;
      const filePath = `event-logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("public")
        .upload(filePath, file);

      if (uploadError) {
        setUploadError("Upload failed.");
        return;
      }

      const { data: urlData } = supabase.storage
        .from("public")
        .getPublicUrl(filePath);

      setEvent((prev) => ({ ...prev, logoUrl: urlData.publicUrl }));
    } catch (err) {
      console.error(err);
      setUploadError("Unexpected upload error.");
    } finally {
      setUploading(false);
    }
  }

  // --- Save event + classes ---
  async function persistEventAndClasses() {
    setSaving(true);

    try {
      let eventId = id;

      // --- Insert new event ---
      if (isNew) {
        const { data, error } = await supabase
          .from("events")
          .insert([
            {
              club_slug: clubSlug,
              name: event.name,
              event_date: new Date(event.event_date).toISOString(),
              description: event.description,
              logoUrl: event.logoUrl,
              track: event.track,
              nominations_open: new Date(event.nominations_open).toISOString(),
              nominations_close: new Date(event.nominations_close).toISOString(),
              member_price: event.member_price,
              non_member_price: event.non_member_price,
              junior_price: event.junior_price,
              preference_enabled: event.preference_enabled,
              class_limit: event.class_limit,
            },
          ])
          .select()
          .single();

        if (error) {
          console.error("Error creating event:", error);
          return false;
        }

        eventId = data.id;
      }

      // --- Update existing event ---
      if (!isNew) {
        const { error } = await supabase
          .from("events")
          .update({
            name: event.name,
            event_date: new Date(event.event_date).toISOString(),
            description: event.description,
            logoUrl: event.logoUrl,
            track: event.track,
            nominations_open: new Date(event.nominations_open).toISOString(),
            nominations_close: new Date(event.nominations_close).toISOString(),
            member_price: event.member_price,
            non_member_price: event.non_member_price,
            junior_price: event.junior_price,
            preference_enabled: event.preference_enabled,
            class_limit: event.class_limit,
          })
          .eq("id", eventId);

        if (error) {
          console.error("Error updating event:", error);
          return false;
        }
      }

      // --- Upsert event classes ---
      const classPayload = nominationClasses.map((c) => ({
        event_id: eventId,
        class_id: c.class_id,
        class_name: c.class_name,
        is_enabled: c.is_enabled,
        order_index: c.order_index,
      }));

      const { error: classError } = await supabase
        .from("event_classes")
        .upsert(classPayload, {
          onConflict: "event_id,class_id",
        });

      if (classError) {
        console.error("Error saving classes:", classError);
        return false;
      }

      return eventId;
    } finally {
      setSaving(false);
    }
  }

  // --- Preview event (FIXED PATH) ---
  async function handlePreview() {
    const savedId = await persistEventAndClasses();
    if (savedId) {
      navigate(`/${clubSlug}/events/${savedId}`);
    }
  }

  // --- Submit/save event (FIXED PATH) ---
  async function handleSubmit() {
    const savedId = await persistEventAndClasses();
    if (savedId) {
      navigate(`/${clubSlug}/admin/events`);
    }
  }
  // =========================
  // 8. JSX RETURN
  // =========================

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
{/* Solid red AdminDashboard-style container */}
<div
  className="
    rounded-xl
    bg-white
    p-6
    border
    shadow-sm
  "
  style={{
    borderColor: "transparent",
    borderWidth: "2px",
    backgroundClip: "padding-box",

    // Solid, opaque, thicker red outline
    boxShadow: `
      0 0 0 4px #dc2626   /* main solid red border */
    `,
  }}
>
      {/* ========================= */}
      {/* 8.1 PAGE HEADER */}
      {/* ========================= */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isNew ? "Create Event" : "Edit Event"}
        </h1>

<Link
  to={`/${clubSlug}/admin/events`}
  className="text-sm text-gray-600 hover:text-gray-800"
>
  Back to Events
</Link>
      </div>

      {/* ========================= */}
      {/* 8.2 BASIC EVENT FIELDS */}
      {/* ========================= */}
      <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {/* --- Event name --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Event Name
          </label>
          <input
            type="text"
            value={event.name}
            onChange={(e) =>
              setEvent((prev) => ({ ...prev, name: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        {/* --- Event date --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Event Date
          </label>
          <input
            type="datetime-local"
            value={event.event_date}
            onChange={(e) =>
              setEvent((prev) => ({ ...prev, event_date: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        {/* --- Description --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={event.description}
            onChange={(e) =>
              setEvent((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        {/* ========================= */}
        {/* 8.3 TRACK SELECTOR */}
        {/* ========================= */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Track
          </label>
          <select
            value={event.track}
            onChange={handleTrackChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">Select a track</option>
            {TRACK_OPTIONS.map((track) => (
              <option key={track} value={track}>
                {track}
              </option>
            ))}
          </select>
        </div>

        {/* ========================= */}
        {/* 8.4 LOGO UPLOAD */}
        {/* ========================= */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Event Logo
          </label>

          {event.logoUrl && (
            <img
              src={event.logoUrl}
              alt="Event Logo"
              className="h-20 mt-2 rounded border"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="mt-2"
          />

          {uploading && (
            <p className="text-sm text-gray-500 mt-1">Uploading...</p>
          )}
          {uploadError && (
            <p className="text-sm text-red-600 mt-1">{uploadError}</p>
          )}
        </div>

        {/* ========================= */}
        {/* 8.5 NOMINATIONS WINDOW */}
        {/* ========================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* --- Nominations open --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nominations Open
            </label>
            <input
              type="datetime-local"
              value={event.nominations_open}
              onChange={(e) =>
                setEvent((prev) => ({
                  ...prev,
                  nominations_open: e.target.value,
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {/* --- Nominations close --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nominations Close
            </label>
            <input
              type="datetime-local"
              value={event.nominations_close}
              onChange={(e) =>
                setEvent((prev) => ({
                  ...prev,
                  nominations_close: e.target.value,
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        {/* ========================= */}
        {/* 8.6 PRICING */}
        {/* ========================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* --- Member price --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Member Price
            </label>
            <input
              type="number"
              value={event.member_price}
              onChange={(e) =>
                setEvent((prev) => ({
                  ...prev,
                  member_price: Number(e.target.value),
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {/* --- Non-member price --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Non‑Member Price
            </label>
            <input
              type="number"
              value={event.non_member_price}
              onChange={(e) =>
                setEvent((prev) => ({
                  ...prev,
                  non_member_price: Number(e.target.value),
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          {/* --- Junior price --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Junior Price
            </label>
            <input
              type="number"
              value={event.junior_price}
              onChange={(e) =>
                setEvent((prev) => ({
                  ...prev,
                  junior_price: Number(e.target.value),
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        {/* ========================= */}
        {/* 8.7 ADVANCED TOGGLE */}
        {/* ========================= */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced((prev) => !prev)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showAdvanced ? "Hide Advanced Settings" : "Show Advanced Settings"}
          </button>
        </div>
        {/* ========================= */}
        {/* 8.8 ADVANCED SETTINGS */}
        {/* ========================= */}
        {showAdvanced && (
          <div className="space-y-6 border-t pt-6">
            {/* --- Preference enabled --- */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={event.preference_enabled}
                onChange={(e) =>
                  setEvent((prev) => ({
                    ...prev,
                    preference_enabled: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-gray-400 text-red-600 focus:ring-red-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Enable Class Preference Selection
              </label>
            </div>

            {/* --- Class limit --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Class Limit
              </label>
              <input
                type="number"
                value={event.class_limit}
                onChange={(e) =>
                  setEvent((prev) => ({
                    ...prev,
                    class_limit: Number(e.target.value),
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================= */}
      {/* 8.9 CLASS LIST (DRAG & DROP) */}
      {/* ========================= */}
      <div className="mt-10 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Event Classes
        </h2>

        {!event.track && (
          <p className="text-sm text-gray-600">
            Select a track to load available classes.
          </p>
        )}

        {event.track && nominationClasses.length === 0 && (
          <p className="text-sm text-gray-600">
            No classes available for this track.
          </p>
        )}

        {event.track && nominationClasses.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={nominationClasses.map((c) => c.class_id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {nominationClasses
                  .slice()
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((cls) => (
                    <SortableItem key={cls.class_id} cls={cls}>
                      <>
                        <input
                          type="checkbox"
                          checked={cls.is_enabled}
                          onChange={() => toggleClassEnabled(cls.class_id)}
                          className="h-4 w-4 rounded border-gray-400 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-900">
                          {cls.class_name}
                        </span>
                      </>
                    </SortableItem>
                  ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* ========================= */}
      {/* 8.10 ACTION BUTTONS */}
      {/* ========================= */}
      <div className="mt-10 flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={handlePreview}
          disabled={saving}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Preview
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
        >
          {saving ? "Saving..." : "Save Event"}
        </button>
      </div>
          </div> {/* end Red outline container */}
    </div>
  );
}
