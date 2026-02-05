import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ManufacturerLogoPicker from "./ManufacturerLogoPicker";
import SponsorTagInput from "./SponsorTagInput";

export default function FamilyMembers({ parentProfileId }) {
  const [family, setFamily] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [manufacturerLogo, setManufacturerLogo] = useState("");
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    const loadFamily = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("family_members")
          .select("*")
          .eq("parent_profile_id", parentProfileId)
          .order("name", { ascending: true });

        if (error) throw error;

        setFamily(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (parentProfileId) loadFamily();
  }, [parentProfileId]);

  const resetForm = () => {
    setName("");
    setDob("");
    setManufacturer("");
    setManufacturerLogo("");
    setSponsors([]);
    setEditingMember(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setName(member.name);
    setDob(member.dob || "");
    setManufacturer(member.manufacturer || "");
    setManufacturerLogo(member.manufacturer_logo || "");
    setSponsors(member.sponsors || []);
    setShowModal(true);
  };

  const saveMember = async () => {
    try {
      const payload = {
        parent_profile_id: parentProfileId,
        name,
        dob,
        manufacturer,
        manufacturer_logo: manufacturerLogo,
        sponsors,
      };

      if (editingMember) {
        const { error } = await supabase
          .from("family_members")
          .update(payload)
          .eq("id", editingMember.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("family_members")
          .insert([payload]);

        if (error) throw error;
      }

      const { data } = await supabase
        .from("family_members")
        .select("*")
        .eq("parent_profile_id", parentProfileId)
        .order("name", { ascending: true });

      setFamily(data || []);
      setShowModal(false);
      resetForm();
    } catch (err) {
      alert("Error saving family member: " + err.message);
    }
  };

  const deleteMember = async (id) => {
    if (!confirm("Delete this family member?")) return;

    try {
      const { error } = await supabase
        .from("family_members")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setFamily(family.filter((m) => m.id !== id));
    } catch (err) {
      alert("Error deleting member: " + err.message);
    }
  };

  if (loading) return <div>Loading family members…</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Family Members</h2>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Member
        </button>
      </div>

      {family.length === 0 && (
        <p className="text-gray-500">No family members added yet.</p>
      )}

      <ul className="space-y-4">
        {family.map((member) => (
          <li
            key={member.id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-gray-600">
                DOB: {member.dob || "Not set"}
              </p>
              <p className="text-sm text-gray-600">
                Manufacturer: {member.manufacturer || "None"}
              </p>
              {member.sponsors?.length > 0 && (
                <p className="text-sm text-gray-600">
                  Sponsors: {member.sponsors.join(", ")}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {member.manufacturer_logo && (
                <img
                  src={`https://YOURPROJECT.supabase.co/storage/v1/object/public/brand-logos/${member.manufacturer_logo}`}
                  alt={member.manufacturer}
                  className="h-10 w-auto"
                />
              )}

              <button
                onClick={() => openEditModal(member)}
                className="text-blue-600"
              >
                Edit
              </button>

              <button
                onClick={() => deleteMember(member.id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold">
              {editingMember ? "Edit Family Member" : "Add Family Member"}
            </h3>

            <input
              className="w-full border p-2 rounded"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="w-full border p-2 rounded"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />

            <input
              className="w-full border p-2 rounded"
              placeholder="Manufacturer"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
            />

            <ManufacturerLogoPicker
              value={manufacturerLogo}
              onChange={setManufacturerLogo}
            />

            <SponsorTagInput value={sponsors} onChange={setSponsors} />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-4 py-2"
              >
                Cancel
              </button>

              <button
                onClick={saveMember}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}