// src/pages/admin/AdminDashboard.jsx
import { Link, useLocation, useParams } from "react-router-dom";

export default function AdminDashboard() {
  const { clubSlug } = useParams();
  const location = useLocation();

  const navItems = [
    {
      key: "overview",
      label: "Overview",
      to: `/${clubSlug}/admin`,
      match: (path) => path === `/${clubSlug}/admin`,
    },
    {
      key: "events",
      label: "Events",
      to: `/${clubSlug}/admin/events`,
      match: (path) => path.startsWith(`/${clubSlug}/admin/events`),
    },
    {
      key: "memberships",
      label: "Memberships",
      to: `/${clubSlug}/admin/memberships`,
      match: (path) => path.startsWith(`/${clubSlug}/admin/memberships`),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      {/* SIDEBAR */}
      <aside className="hidden md:flex md:flex-col w-64 border-r border-slate-800 bg-slate-950/95">
        <div className="px-6 py-5 border-b border-slate-800">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
            Admin
          </div>
          <div className="text-lg font-semibold truncate">
            {clubSlug?.replace(/-/g, " ") || "Club"}
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = item.match(location.pathname);
            return (
              <Link
                key={item.key}
                to={item.to}
                className={[
                  "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-slate-900 text-slate-50"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <header className="w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage events, memberships, and club operations.
            </p>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 px-4 sm:px-6 py-6">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* OVERVIEW CARDS */}
            <section>
              <h2 className="text-sm font-semibold text-slate-300 mb-3">
                Quick actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* EVENTS */}
                <Link
                  to={`/${clubSlug}/admin/events`}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 hover:bg-slate-900 transition-colors cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-slate-50 mb-2">
                      Manage Events
                    </h3>
                    <p className="text-sm text-slate-400">
                      Add, edit, and manage all club events.
                    </p>
                  </div>
                </Link>

                {/* MEMBERSHIPS */}
                <Link
                  to={`/${clubSlug}/admin/memberships`}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 hover:bg-slate-900 transition-colors cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-slate-50 mb-2">
                      Manage Memberships
                    </h3>
                    <p className="text-sm text-slate-400">
                      View, edit, and link member accounts.
                    </p>
                  </div>
                </Link>

                {/* FUTURE TILES */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 opacity-70 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">
                      Coming Soon
                    </h3>
                    <p className="text-sm text-slate-500">
                      Drivers, calendar, reports, and more.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
