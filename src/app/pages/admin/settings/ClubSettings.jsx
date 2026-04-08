// src/app/pages/admin/settings/ClubSettings.jsx

import { useNavigate, useParams } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";

import { useClub } from "@/app/providers/ClubProvider";
import Card from "@/components/ui/Card";

export default function ClubSettings() {
  const navigate = useNavigate();
  const { clubSlug } = useParams();
  const { club } = useClub();

  const brand = club?.theme?.hero?.backgroundColor || "#0A66C2";

  const settings = [
    {
      title: "Club Info",
      description: "Update club name, logo, colours, contact details and social links.",
      path: "club-info",
    },
    {
      title: "Membership Settings",
      description: "Configure membership types, pricing, renewals and badge settings.",
      path: "memberships",
    },
    {
      title: "Event Defaults",
      description: "Set default nomination fees, classes, schedules and event formats.",
      path: "event-defaults",
    },
    {
      title: "Driver Settings",
      description: "Manage driver number rules, transponders and age brackets.",
      path: "drivers",
    },
    {
      title: "System Settings",
      description: "Admin email, maintenance mode and platform-level configuration.",
      path: "system",
    },
    {
      title: "Classes",
      description: "Manage club classes, categories and class defaults.",
      path: "classes",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-background text-text-base">

      {/* PAGE HEADER */}
      <section className="w-full border-b border-surfaceBorder bg-surface">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-2">
          <Cog6ToothIcon className="h-5 w-5" style={{ color: brand }} />
          <h1 className="text-xl font-semibold tracking-tight">Club Settings</h1>
        </div>
      </section>

      {/* MAIN */}
      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">

        {/* SETTINGS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {settings.map((item) => (
            <Card
              key={item.path}
              className="rounded-xl shadow-sm cursor-pointer overflow-hidden !p-0 !pt-0 transition hover:shadow-md"
              style={{ border: `2px solid ${brand}`, background: "white" }}
              onClick={() => navigate(`/${clubSlug}/app/admin/settings/${item.path}`)}
            >
              {/* BLUE HEADER BAR — flush to top */}
              <div
                className="px-5 py-3 rounded-t-lg"
                style={{ background: brand, color: "white" }}
              >
                <h2 className="text-base font-semibold">{item.title}</h2>
              </div>

              {/* BODY */}
              <div className="p-5">
                <p className="text-sm text-text-muted">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>

      </main>
    </div>
  );
}
