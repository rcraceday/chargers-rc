// src/app/pages/admin/AdminDashboard.jsx
import { Link, useParams } from "react-router-dom";

export default function AdminDashboard() {
  const { clubSlug } = useParams();

  return (
    <div className="space-y-8">
      {/* QUICK ACTIONS */}
      <section>
        <h2 className="text-sm font-semibold text-neutral-700 mb-3">
          Quick actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              label: "Manage Events",
              desc: "Add, edit, and manage all club events.",
              to: `/${clubSlug}/admin/events`,
            },
            {
              label: "Manage Memberships",
              desc: "View, edit, and link member accounts.",
              to: `/${clubSlug}/admin/memberships`,
            },
            {
              label: "Championships",
              desc: "Create and manage championships.",
              to: `/${clubSlug}/admin/championships`,
            },
          ].map((card) => (
            <Link
              key={card.label}
              to={card.to}
              className="
                relative rounded-2xl p-6 bg-white shadow-xl
                text-neutral-800 transition-transform hover:scale-[1.01]
                border border-transparent
                before:absolute before:inset-0 before:rounded-2xl
                before:p-[3px] before:bg-gradient-to-br before:from-red-400 before:to-red-200
                before:z-0
              "
            >
              <div className="relative z-10">
                <h3 className="text-lg font-semibold mb-2">{card.label}</h3>
                <p className="text-sm text-neutral-600">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
