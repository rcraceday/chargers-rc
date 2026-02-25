// src/app/pages/admin/championships/CreateChampionship.jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/supabaseClient";

const CLASS_OPTIONS = [
  "Juniors",
  "2wd Modified Buggy",
  "2wd Stock Buggy",
  "4wd Modified Buggy",
  "4wd Stock Buggy",
  "Stadium Truck",
  "Short Course Truck",
];

// Default points table (1–20)
const DEFAULT_POINTS = {
  1: 36,
  2: 29,
  3: 24,
  4: 20,
  5: 17,
  6: 15,
  7: 14,
  8: 13,
  9: 12,
  10: 11,
  11: 10,
  12: 9,
  13: 8,
  14: 7,
  15: 6,
  16: 5,
  17: 4,
  18: 3,
  19: 2,
  20: 1,
};

export default function CreateChampionship() {
  const { clubSlug } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [season, setSeason] = useState(new Date().getFullYear().toString());
  const [membersOnly, setMembersOnly] = useState(true);
  const [totalRounds, setTotalRounds] = useState(0);
  const [dropRounds, setDropRounds] = useState(0);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [pointsTable, setPointsTable] = useState(DEFAULT_POINTS);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleClass(className) {
    setSelectedClasses((prev) =>
      prev.includes(className)
        ? prev.filter((c) => c !== className)
        : [...prev, className]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Fetch club_id from slug
    const { data: club, error: clubError } = await supabase
      .from("clubs")
      .select("id")
      .eq("slug", clubSlug)
      .single();

    if (clubError) {
      setError("Unable to find club.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("championships").insert({
      club_id: club.id,
      name,
      season,
      members_only: membersOnly,
      total_rounds: totalRounds,
      drop_rounds: dropRounds,
      classes: selectedClasses,
      points_table: pointsTable,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    navigate(`/${clubSlug}/admin/championships`);
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold tracking-tight mb-4">
        Create Championship
      </h2>

      {error && (
        <div className="p-3 rounded bg-red-900/40 text-red-300 border border-red-800">
          {error}
        </div>
      )}

      {/* DETAILS CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold">Championship Details</h3>

        <div className="space-y-2">
          <label className="text-sm text-slate-300">Name</label>
          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="2025 Summer Series"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-300">Season</label>
          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
          />
        </div>
      </div>

      {/* CLASSES CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold">Classes</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CLASS_OPTIONS.map((cls) => (
            <label
              key={cls}
              className="flex items-center space-x-2 text-slate-300"
            >
              <input
                type="checkbox"
                checked={selectedClasses.includes(cls)}
                onChange={() => toggleClass(cls)}
              />
              <span>{cls}</span>
            </label>
          ))}
        </div>
      </div>

      {/* RULES CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold">Rules</h3>

        <label className="flex items-center space-x-2 text-slate-300">
          <input
            type="checkbox"
            checked={membersOnly}
            onChange={() => setMembersOnly(!membersOnly)}
          />
          <span>Only members earn championship points</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Total Rounds</label>
            <input
              type="number"
              min="0"
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100"
              value={totalRounds}
              onChange={(e) => setTotalRounds(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-300">Drop Rounds</label>
            <input
              type="number"
              min="0"
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-100"
              value={dropRounds}
              onChange={(e) => setDropRounds(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* POINTS TABLE CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold">Points Table</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.keys(pointsTable).map((pos) => (
            <div key={pos} className="space-y-1">
              <label className="text-xs text-slate-400">Position {pos}</label>
              <input
                type="number"
                className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-100"
                value={pointsTable[pos]}
                onChange={(e) =>
                  setPointsTable({
                    ...pointsTable,
                    [pos]: Number(e.target.value),
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 font-semibold"
      >
        {loading ? "Saving..." : "Create Championship"}
      </button>
    </div>
  );
}
