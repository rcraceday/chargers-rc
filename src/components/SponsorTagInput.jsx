import { useState } from "react";

export default function SponsorTagInput({ value = [], onChange }) {
  const [input, setInput] = useState("");

  const addSponsor = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const updated = [...value, trimmed];
    onChange(updated);
    setInput("");
  };

  const removeSponsor = (sponsor) => {
    const updated = value.filter((s) => s !== sponsor);
    onChange(updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSponsor();
    }
  };

  return (
    <div className="space-y-2">
      <label className="font-semibold">Sponsors</label>

      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="Add sponsor and press Enter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={addSponsor}
          className="bg-blue-600 text-white px-3 rounded"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {value.map((sponsor) => (
          <span
            key={sponsor}
            className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2"
          >
            {sponsor}
            <button
              onClick={() => removeSponsor(sponsor)}
              className="text-red-600 font-bold"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}