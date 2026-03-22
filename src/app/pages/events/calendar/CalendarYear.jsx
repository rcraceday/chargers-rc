import React from "react";
import CalendarEventCard from "./CalendarEventCard";

export default function CalendarYear({ year, events, brand, onEventClick }) {
  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const safeEvents = Array.isArray(events) ? events : [];

  const formatDate = (iso) => {
    const d = new Date(iso);
    const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
    const day = d.getDate();
    const month = d.toLocaleDateString("en-US", { month: "short" });
    return `${weekday} ${day} ${month}`;
  };

  return (
    <div
      style={{
        width: "100%",
        border: `3px solid ${brand}`,
        borderRadius: "16px",

        /* ⭐ FIX: remove horizontal padding */
        padding: "20px 0",

        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "grid",

          /* ⭐ FIX: center items on mobile */
          justifyItems: "center",

          /* ⭐ FIX: allow grid to shrink properly */
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",

          gap: "24px",
          boxSizing: "border-box",
          padding: "0 12px 20px", // bottom padding only
        }}
      >
        {MONTHS.map((label, monthIndex) => {
          const monthEvents = safeEvents.filter((e) => {
            const d = new Date(e.event_date);
            return d.getFullYear() === year && d.getMonth() === monthIndex;
          });

          return (
            <div
              key={monthIndex}
              style={{
                width: "100%",
                maxWidth: "420px", // ⭐ keeps cards centered and prevents drift

                display: "flex",
                flexDirection: "column",
                gap: "16px",

                background: "white",
                borderRadius: "12px",
                padding: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#222",
                }}
              >
                {label}
              </div>

              {monthEvents.length === 0 && (
                <div
                  style={{
                    fontSize: "14px",
                    color: "#999",
                    padding: "8px 0",
                  }}
                >
                  No events
                </div>
              )}

              {monthEvents.map((event) => (
                <div
                  key={event.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",

                    /* ⭐ FIX: align date + card */
                    paddingLeft: "4px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#333",
                    }}
                  >
                    {formatDate(event.event_date)}
                  </div>

                  <CalendarEventCard
                    event={event}
                    brand={brand}
                    onNavigate={() => onEventClick?.(event)} // ⭐ works once Calendar.jsx passes it
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
