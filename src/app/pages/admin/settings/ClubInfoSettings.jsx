// src/app/pages/admin/settings/ClubInfoSettings.jsx

import { useEffect, useRef, useState } from "react";
import { useClub } from "@/app/providers/ClubProvider";
import { supabase } from "@/supabaseClient";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function ClubInfoSettings() {
  const { club, loadingClub, refreshClub } = useClub();

  const [form, setForm] = useState(null);
  const [initialForm, setInitialForm] = useState(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const autosaveTimer = useRef(null);

  // -----------------------------
  // INITIAL LOAD
  // -----------------------------
  useEffect(() => {
    if (!club) return;

    const next = {
      name: club.name || "",
      logo_url: club.logo_url || "",
      primary_color: club.primary_color || "#3F7AEB", // Chargers Blue
      background_image_url: club.background_image_url || "",
    };

    setForm(next);
    setInitialForm(next);
    setError("");
  }, [club]);

  // -----------------------------
  // HARD GUARD — prevents blank page
  // -----------------------------
  if (loadingClub || !club || !form || !initialForm) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Loading club…
      </div>
    );
  }

  // -----------------------------
  // HELPERS
  // -----------------------------
  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");

    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);

    autosaveTimer.current = setTimeout(() => {
      save(true);
    }, 1000);
  }

  function hasChanges() {
    return (
      form.name !== initialForm.name ||
      form.logo_url !== initialForm.logo_url ||
      form.primary_color !== initialForm.primary_color ||
      form.background_image_url !== initialForm.background_image_url
    );
  }

  // -----------------------------
  // SAVE
  // -----------------------------
  async function save(isAutosave = false) {
    if (!form.name.trim()) {
      if (!isAutosave) setError("Club name is required.");
      return;
    }

    if (!hasChanges()) return;

    setSaving(true);

    const { error: updateError } = await supabase
      .from("clubs")
      .update({
        name: form.name,
        logo_url: form.logo_url || null,
        primary_color: form.primary_color,
        background_image_url: form.background_image_url || null,
      })
      .eq("id", club.id);

    setSaving(false);

    if (updateError) {
      console.error(">>> save club info error", updateError);
      setError("Error saving club info.");
      return;
    }

    setInitialForm(form);
    refreshClub();
  }

  // -----------------------------
  // RESET
  // -----------------------------
  function reset() {
    setForm(initialForm);
    setError("");
  }

  // -----------------------------
  // UPLOAD: LOGO
  // -----------------------------
  async function uploadLogo(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    const path = `${club.slug}/logo.${ext}`;

    await supabase.storage.from("club-assets").remove([path]);

    const { error: uploadError } = await supabase.storage
      .from("club-assets")
      .upload(path, file);

    if (uploadError) {
      console.error(">>> logo upload error", uploadError);
      setError("Error uploading logo.");
      return;
    }

    const { data } = supabase.storage
      .from("club-assets")
      .getPublicUrl(path);

    updateField("logo_url", data.publicUrl);
  }

  // -----------------------------
  // UPLOAD: BACKGROUND IMAGE
  // -----------------------------
  async function uploadBackground(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    const path = `${club.slug}/background.${ext}`;

    await supabase.storage.from("club-assets").remove([path]);

    const { error: uploadError } = await supabase.storage
      .from("club-assets")
      .upload(path, file);

    if (uploadError) {
      console.error(">>> background upload error", uploadError);
      setError("Error uploading background image.");
      return;
    }

    const { data } = supabase.storage
      .from("club-assets")
      .getPublicUrl(path);

    updateField("background_image_url", data.publicUrl);
  }

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "var(--background)",
        color: "var(--text-base)",
      }}
    >
      {/* PAGE HEADER — matches AdminEvents, Tracks, MembershipSettings */}
      <section
        style={{
          width: "100%",
          borderBottom: "1px solid var(--surface-border)",
          background: "var(--surface)",
        }}
      >
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: 20, fontWeight: 600 }}>Club Info</h1>

          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="secondary" onClick={reset}>
              Reset
            </Button>
            <Button
              variant="primary"
              onClick={() => save(false)}
              disabled={!hasChanges() || saving}
            >
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </section>

      {/* PAGE BODY — matches all admin pages */}
      <main
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "40px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {error && (
          <div
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #f87171",
              background: "#fef2f2",
              color: "#b91c1c",
            }}
          >
            {error}
          </div>
        )}

        {/* CARD 1 — CLUB DETAILS */}
        <Card
          noPadding
          style={{
            border: `2px solid ${form.primary_color}`,
            background: "white",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: form.primary_color,
              color: "white",
              padding: "16px 20px",
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Club Details</h2>
          </div>

          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
            <Field
              label="Club Name"
              value={form.name}
              onChange={(v) => updateField("name", v)}
              required
            />

            {/* LOGO */}
            <div style={{ display: "flex", gap: 20 }}>
              <div
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 12,
                  border: "1px solid var(--surface-border)",
                  background: "#f9fafb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {form.logo_url ? (
                  <img
                    src={form.logo_url}
                    alt="Club logo"
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                ) : (
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    No logo
                  </span>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 600 }}>Logo</label>
                <input type="file" accept="image/*" onChange={uploadLogo} />
              </div>
            </div>
          </div>
        </Card>

        {/* CARD 2 — BRANDING */}
        <Card
          noPadding
          style={{
            border: `2px solid ${form.primary_color}`,
            background: "white",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: form.primary_color,
              color: "white",
              padding: "16px 20px",
            }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Branding</h2>
          </div>

          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
            {/* PRIMARY COLOR */}
            <div>
              <label style={{ fontWeight: 600 }}>Primary Colour</label>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input
                  type="color"
                  value={form.primary_color}
                  onChange={(e) => updateField("primary_color", e.target.value)}
                  style={{
                    width: 50,
                    height: 34,
                    borderRadius: 6,
                    border: "1px solid var(--surface-border)",
                    cursor: "pointer",
                  }}
                />

                <input
                  type="text"
                  value={form.primary_color}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) {
                      updateField("primary_color", v);
                    }
                  }}
                  style={{
                    width: 100,
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: "1px solid var(--surface-border)",
                    fontFamily: "monospace",
                  }}
                />
              </div>
            </div>

            {/* BACKGROUND IMAGE */}
            <div>
              <label style={{ fontWeight: 600 }}>Background Image</label>

              <div
                style={{
                  width: "100%",
                  height: 160,
                  borderRadius: 12,
                  border: "1px solid var(--surface-border)",
                  background: "#f3f4f6",
                  overflow: "hidden",
                  marginBottom: 8,
                }}
              >
                {form.background_image_url ? (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundImage: `url(${form.background_image_url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-muted)",
                      fontSize: 12,
                    }}
                  >
                    No background image
                  </div>
                )}
              </div>

              <input type="file" accept="image/*" onChange={uploadBackground} />
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}

function Field({ label, value, onChange, required }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontWeight: 600 }}>
        {label}
        {required && <span style={{ color: "#dc2626" }}> *</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: 10,
          borderRadius: 8,
          border: "1px solid var(--surface-border)",
        }}
      />
    </div>
  );
}
