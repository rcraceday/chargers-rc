import { Link, useParams } from "react-router-dom";

export default function AdminDashboard() {
  const { clubSlug } = useParams();

  return (
    <div className="min-h-screen w-full bg-[#f7f7f7] text-gray-900">
      {/* PAGE HEADER */}
      <header className="max-w-6xl mx-auto px-4 pt-10 pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your club operations and settings
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16 space-y-12">
        {/* ========================= */}
        {/*   QUICK STATS ROW        */}
        {/* ========================= */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Active Members"
            value="—"
            description="Members with valid memberships"
          />

          <StatCard
            label="Upcoming Events"
            value="—"
            description="Events scheduled in the calendar"
          />

          <StatCard
            label="Pending Nominations"
            value="—"
            description="Drivers awaiting approval"
          />
        </section>

        {/* ========================= */}
        {/*   MAIN ACTION GRID       */}
        {/* ========================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <AdminCard
            title="Memberships"
            description="Manage member records, renewals, and upgrades"
            to={`/${clubSlug}/admin/memberships`}
          />

          <AdminCard
            title="Events"
            description="Create, edit, and manage club events"
            to={`/${clubSlug}/admin/events`}
          />

          <AdminCard
            title="Championships"
            description="Manage championship seasons and scoring"
            to={`/${clubSlug}/admin/championships`}
          />

          <AdminCard
            title="Drivers"
            description="Manage driver profiles and linked accounts"
            to={`/${clubSlug}/admin/drivers`}
          />
        </section>
      </main>
    </div>
  );
}

/* ========================= */
/*   COMPONENTS              */
/* ========================= */

function StatCard({ label, value, description }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-semibold mt-1">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{description}</p>
    </div>
  );
}

function AdminCard({ title, description, to }) {
  return (
    <Link to={to} className="block">
      <div
        className="
          rounded-xl border p-[2px] 
          bg-gradient-to-br from-red-500/40 via-red-400/20 to-red-500/40
          hover:shadow-md transition-shadow
        "
      >
        <div className="rounded-lg bg-white p-6 h-full">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );
}
