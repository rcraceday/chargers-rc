// src/components/ui/DesktopDropdown.jsx
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@app/providers/AuthProvider";
import { useMembership } from "@app/providers/MembershipProvider";
import { supabase } from "@/supabaseClient";

import {
  CalendarDaysIcon,
  CalendarIcon,
  IdentificationIcon,
  UserCircleIcon,
  UsersIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function DesktopDropdown({ open }) {
  const { clubSlug } = useParams();
  const { user } = useAuth();
  const { membership } = useMembership();
  const isAdmin = membership?.role === "admin";

  async function handleLogoutClick(e) {
    // Let the Link still do the navigation, just make sure we sign out first
    await supabase.auth.signOut();
  }

  return (
    <div className={`desktop-dropdown ${open ? "open" : ""}`}>
      <nav>

        <Link to={`/${clubSlug}/events`}>
          <CalendarDaysIcon className="menu-icon" />
          Events
        </Link>

        <Link to={`/${clubSlug}/calendar`}>
          <CalendarIcon className="menu-icon" />
          Calendar
        </Link>

        <Link to={`/${clubSlug}/membership`}>
          <IdentificationIcon className="menu-icon" />
          Membership
        </Link>

        <Link to={`/${clubSlug}/profile`}>
          <UserCircleIcon className="menu-icon" />
          Profile
        </Link>

        <Link to={`/${clubSlug}/profile/drivers`}>
          <UsersIcon className="menu-icon" />
          Manage Drivers
        </Link>

        <Link to={`/${clubSlug}/settings`}>
          <Cog6ToothIcon className="menu-icon" />
          Settings
        </Link>

        {isAdmin && (
          <Link to={`/${clubSlug}/admin`}>
            <ShieldCheckIcon className="menu-icon" />
            Admin Portal
          </Link>
        )}

        {user && (
          <Link
            to={`/${clubSlug}/public/login`}
            className="logout"
            onClick={handleLogoutClick}
          >
            <ArrowRightOnRectangleIcon className="menu-icon" />
            Logout
          </Link>
        )}

      </nav>
    </div>
  );
}
