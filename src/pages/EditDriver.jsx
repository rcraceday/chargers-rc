import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useParams, useNavigate } from "react-router-dom";

export default function EditDriver() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isJunior, setIsJunior] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadDriver() {
      const { data } = await supabase
        .from("drivers")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setDriver(data);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setIsJunior(data.is_junior);
      }

      setLoading(false);
    }

    loadDriver();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!driver) return <div className="p-6">Driver not found</div>;

  const saveDriver = async () => {
    setSaving(true);

    await supabase
      .from("drivers")
      .update({
        first_name: firstName,
        last_name: lastName,
        is_junior: isJunior,
      })
      .eq("id", id);

    navigate("/profile");
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Edit Driver</h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block font-medium mb-1">First Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Last Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isJunior}
            onChange={(e) => setIsJunior(e.target.checked)}
          />
          <label className="font-medium">Junior Driver</label>
        </div>

        <button
          onClick={saveDriver}
          disabled={saving}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
