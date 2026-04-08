// src/app/pages/admin/settings/ClassEditor.jsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useClub } from "@/app/providers/ClubProvider";
import { supabase } from "@/supabaseClient";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import {
  ArrowLeftIcon,
  TrashIcon,
  CheckIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

export default function ClassEditor({ mode }) {
  const navigate = useNavigate();
  const { clubSlug, classId } = useParams();
  const { club } = useClub();

  const brand = club?.theme?.hero?.backgroundColor || "#0A66C2";
  const isEdit = mode === "edit";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(isEdit);

  /* LOAD EXISTING CLASS */
  useEffect(() => {
    if (!isEdit || !classId) return;

    async function loadClass() {
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .eq("id", classId)
        .maybeSingle();

      if (error) {
        console.error(">>> loadClass error", error);
        return;
      }

      if (data) {
        setName(data.name || "");
        setDescription(data.description || "");
      }

      setLoading(false);
    }

    loadClass();
  }, [isEdit, classId]);

  /* SAVE CLASS */
  async function saveClass() {
    if (!club || !club.id) {
      console.log("ClassEditor: club not ready");
      return;
    }

    if (!name.trim()) {
      alert("Class name is required");
      return;
    }

    if (isEdit) {
      const { error } = await supabase
        .from("classes")
        .update({ name, description })
        .eq("id", classId);

      if (error) {
        console.error(">>> update class error", error);
        alert("Error updating class");
        return;
      }
    } else {
      const { error } = await supabase.from("classes").insert({
        club_id: club.id,
        name,
        description,
      });

      if (error) {
        console.error(">>> create class error", error);
        alert("Error creating class");
        return;
      }
    }

    navigate(`/${clubSlug}/app/admin/settings/classes`);
  }

  /* DELETE CLASS */
  async function deleteClass() {
    if (!confirm("Delete this class?")) return;

    const { error } = await supabase
      .from("classes")
      .delete()
      .eq("id", classId);

    if (error) {
      console.error(">>> delete class error", error);
      alert("Error deleting class");
      return;
    }

    navigate(`/${clubSlug}/app/admin/settings/classes`);
  }

  return (
    <div className="min-h-screen w-full bg-background text-text-base">

      {/* PAGE HEADER */}
      <section className="w-full border-b border-surfaceBorder bg-surface">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">

          <Button
            className="!rounded-lg !py-2 !px-3 flex items-center gap-2"
            style={{ background: brand, color: "white" }}
            onClick={() => navigate(`/${clubSlug}/app/admin/settings`)}
          >
            <ArrowLeftIcon className="w-4 h-4 text-white" />
            Back
          </Button>

          <h1 className="text-xl font-semibold tracking-tight">
            {isEdit ? "Edit Class" : "Add Class"}
          </h1>
        </div>
      </section>

      {/* MAIN */}
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-10">

        <Card
          className="rounded-xl shadow-sm overflow-hidden !p-0 !pt-0"
          style={{ border: `2px solid ${brand}`, background: "white" }}
        >
          {/* BLUE HEADER BAR */}
          <div
            className="px-5 py-3"
            style={{ background: brand, color: "white" }}
          >
            <h2 className="text-base font-semibold">
              {isEdit ? "Edit Class" : "Create New Class"}
            </h2>
          </div>

          {/* BODY */}
          <div className="p-5 space-y-6">

            <Input
              label="Class Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 2WD Stock Buggy"
            />

            <Input
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />

            <div className="flex justify-between items-center pt-4">

              {isEdit ? (
                <Button
                  className="!rounded-lg !py-3 !px-4 bg-red-600 text-white flex items-center gap-2"
                  onClick={deleteClass}
                >
                  <TrashIcon className="w-5 h-5 text-white" />
                  Delete
                </Button>
              ) : (
                <div />
              )}

              <Button
                disabled={!club?.id}
                className="!rounded-lg !py-3 !px-4 text-white font-medium flex items-center gap-2"
                style={{ background: brand }}
                onClick={saveClass}
              >
                <CheckIcon className="w-5 h-5 text-white" />
                Save
              </Button>
            </div>

          </div>
        </Card>

      </main>
    </div>
  );
}
