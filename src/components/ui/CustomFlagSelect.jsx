// src/components/ui/CustomFlagSelect.jsx

import { useState } from "react";
import { COUNTRIES } from "@/data/countries";

export default function CustomFlagSelect({ value, onChange, brand }) {
  const [open, setOpen] = useState(false);

  const selected = COUNTRIES.find((c) => c.name === value);

  return (
    <div className="relative">
      {/* BUTTON */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-sm flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          {selected && (
            <img
              src={selected.flag}
              alt={selected.name}
              className="w-5 h-4 object-cover rounded-sm border"
            />
          )}
          {selected ? selected.name : "Select country"}
        </span>

        <span style={{ color: brand }}>▼</span>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {COUNTRIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => {
                onChange(c.name);
                setOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-100"
            >
              <img
                src={c.flag}
                alt={c.name}
                className="w-5 h-4 object-cover rounded-sm border"
              />
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
