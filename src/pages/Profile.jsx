import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import useProfile from "../hooks/useProfile";
import { Link } from "react-router-dom";

export default function Profile() {
  const { profile, drivers, membership, loading } = useProfile();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!profile) return <div className="p-6">No profile found</div>;

  const saveProfile = async () => {
    setSaving(true);
    setSaved(false);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone: phone,
      })
      .eq("id", profile.id);

    setSaving(false);
    if (!error) setSaved(true);
  };

  const deleteDriver = async (id) => {
    await supabase.from("drivers").delete().eq("id", id);
    window.location.reload();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-10">
      {/* Header */}
      <h1 className="text-3xl font-bold">My Profile</h1>

      {/* Profile Form */}
      <div className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full max-w-sm px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full max-w-sm px-3 py-2 border rounded"
          />
        </div>

        {/* Membership Display */}
        <div className="bg-gray-50 p-4 rounded border">
          <strong>Membership:</strong>{" "}
          {membership?.membership_type === "family" && (
            <span className="text-green-700 font-semibold">Family Membership</span>
          )}
          {membership?.membership_type === "adult" && (
            <span className="text-blue-700 font-semibold">Adult Membership</span>
          )}
          {(!membership || membership.membership_type === "none") && (
            <span className="text-gray-700">No active membership</span>
          )}
        </div>

        <button
          onClick={saveProfile}
          disabled={saving}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {saved && (
          <div className="text-green-600 mt-2">
            Profile updated successfully
          </div>
        )}
      </div>

      {/* Drivers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">My Drivers</h2>

          <Link
            to="/profile/drivers/add"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Driver
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          {drivers.length === 0 ? (
            <p className="text-gray-600">You have no drivers yet.</p>
          ) : (
            <ul className="space-y-3">
              {drivers.map((driver) => (
                <li
                  key={driver.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div>
                    <p className="font-medium">
                      {driver.first_name} {driver.last_name}
                    </p>
                    {driver.is_junior && (
                      <p className="text-sm text-blue-600">Junior Driver</p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to={`/profile/drivers/${driver.id}/edit`}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteDriver(driver.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
