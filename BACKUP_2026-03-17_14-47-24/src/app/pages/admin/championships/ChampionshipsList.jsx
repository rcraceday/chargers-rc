// src/app/pages/admin/championships/ChampionshipsList.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/supabaseClient";

export default function ChampionshipsList() {
  const { clubSlug } = useParams();

  const [championships, setChampionships] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadChampionships() {
    setLoading(true);

    // Get club_id from slug
    const { data: club, error: clubError } = await supabase
      .from("clubs")
      .select("id")
      .eq("slug", clubSlug)
      .single();

    if (clubError) {
      console.error("Club lookup failed:", clubError);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("championships")
      .select("*")
      .eq("club_id", club.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setChampionships(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadChampionships();
  }, [clubSlug]);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">
          Championships
        </h2>

        <Link
          to={`/${clubSlug}/admin/championships/create`}
          className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold"
        >
          Create Championship
        </Link>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {loading && (
          <div className="text-slate-400">Loading championships…</div>
        )}

        {!loading && championships.length === 0 && (
          <div className="text-slate-400">
            No championships created yet.
          </div>
        )}

        {championships.map((champ) => (
          <div
            key={champ.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* LEFT SIDE */}
              <div className="space-y-1">
                <div className="text-xl font-semibold">{champ.name}</div>
                <div className="text-slate-400 text-sm">
                  Season: {champ.season}
                </div>

                <div className="text-slate-400 text-sm">
                  Classes:{" "}
                  <span className="text-slate-300">
                    {champ.classes.join(", ")}
                  </span>
                </div>

                <div className="text-slate-400 text-sm">
                  Rounds:{" "}
                  <span className="text-slate-300">
                    {champ.total_rounds}
                  </span>{" "}
                  | Drop:{" "}
                  <span className="text-slate-300">
                    {champ.drop_rounds}
                  </span>
                </div>

                <div className="text-slate-400 text-sm">
                  Members Only:{" "}
                  <span className="text-slate-300">
                    {champ.members_only ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <Link
                to={`/${clubSlug}/admin/championships/${champ.id}`}
                className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 font-medium text-slate-200 text-center"
              >
                Manage
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
