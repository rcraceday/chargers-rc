import { Link, useParams } from "react-router-dom";
import {
  IdentificationIcon,
  CalendarDaysIcon,
  TrophyIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import Card from "@/components/ui/Card";

export default function AdminDashboard() {
  const { clubSlug } = useParams();

  return (
    <>
      {/* PAGE HEADER */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your club operations and settings
        </p>
      </header>

      {/* ========================= */}
      {/*   QUICK STATS ROW        */}
      {/* ========================= */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
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
          label="Current Event Nominations"
          value="—"
          description="Nominations for the next upcoming event"
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
          icon={IdentificationIcon}
        />

        <AdminCard
          title="Events"
          description="Create, edit, and manage club events"
          to={`/${clubSlug}/admin/events`}
          icon={CalendarDaysIcon}
        />

        <AdminCard
          title="Championships"
          description="Manage championship seasons and scoring"
          to={`/${clubSlug}/admin/championships`}
          icon={TrophyIcon}
        />

        <AdminCard
          title="Drivers"
          description="Manage driver profiles and linked accounts"
          to={`/${clubSlug}/admin/drivers`}
          icon={UserGroupIcon}
        />
      </section>
    </>
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

function AdminCard({ title, description, to, icon: Icon }) {
  return (
    <Link to={to} className="block no-underline">
      <Card>
        <div className="flex items-center gap-4">
          <Icon className="h-7 w-7 text-[#C62828]" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
