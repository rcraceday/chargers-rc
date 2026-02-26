// src/components/admin/AdminSidebar.jsx
import { NavLink, useParams } from "react-router-dom";
import {
  UserGroupIcon,
  CalendarDaysIcon,
  TrophyIcon,
  IdentificationIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export default function AdminSidebar() {
  const { clubSlug } = useParams();

  const navItems = [
    {
      label: "Dashboard",
      to: `/${clubSlug}/admin`,
      icon: UserGroupIcon,
    },
    {
      label: "Memberships",
      to: `/${clubSlug}/admin/memberships`,
      icon: IdentificationIcon,
    },
    {
      label: "Events",
      to: `/${clubSlug}/admin/events`,
      icon: CalendarDaysIcon,
    },
    {
      label: "Championships",
      to: `/${clubSlug}/admin/championships`,
      icon: TrophyIcon,
    },
    {
      label: "Drivers",
      to: `/${clubSlug}/admin/drivers`,
      icon: UserGroupIcon,
    },
    {
      label: "Settings",
      to: `/${clubSlug}/admin/settings`,
      icon: Cog6ToothIcon,
    },
  ];

  return (
    <aside
      className="
        w-56
        bg-white
        border-r border-gray-200
        flex flex-col
        py-6
      "
    >
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `
              flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
              transition-colors
              ${
                isActive
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "text-gray-700 hover:bg-gray-100"
              }
            `
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
