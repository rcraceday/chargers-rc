// src/components/ui/MobileDrawer.jsx
import { Link, useParams } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { useAuth } from "@app/providers/AuthProvider";
import { useMembership } from "@app/providers/MembershipProvider";

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

export default function MobileDrawer({ open, onClose }) {
  const { clubSlug } = useParams();
  const { user } = useAuth();
  const { membership } = useMembership();
  const isAdmin = membership?.role === "admin";

  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose}></div>}

      <div className={`mobile-drawer ${open ? "open" : ""}`}>
        <div className="drawer-header">
          <h2>Menu</h2>
          <button className="drawer-close" onClick={onClose}>
            <XMarkIcon className="drawer-close-icon" />
          </button>
        </div>

        <nav className="drawer-nav">

          <Link to={`/${clubSlug}/events`} onClick={onClose}>
            <CalendarDaysIcon className="menu-icon" />
            Events
          </Link>

          <Link to={`/${clubSlug}/calendar`} onClick={onClose}>
            <CalendarIcon className="menu-icon" />
            Calendar
          </Link>

          <Link to={`/${clubSlug}/membership`} onClick={onClose}>
            <IdentificationIcon className="menu-icon" />
            Membership
          </Link>

          <Link to={`/${clubSlug}/profile`} onClick={onClose}>
            <UserCircleIcon className="menu-icon" />
            Profile
          </Link>

          <Link to={`/${clubSlug}/profile/drivers`} onClick={onClose}>
            <UsersIcon className="menu-icon" />
            Manage Drivers
          </Link>

          <Link to={`/${clubSlug}/settings`} onClick={onClose}>
            <Cog6ToothIcon className="menu-icon" />
            Settings
          </Link>

          {isAdmin && (
            <Link to={`/${clubSlug}/admin`} onClick={onClose}>
              <ShieldCheckIcon className="menu-icon" />
              Admin Portal
            </Link>
          )}

          {user && (
            <Link to={`/${clubSlug}/logout`} className="logout" onClick={onClose}>
              <ArrowRightOnRectangleIcon className="menu-icon" />
              Logout
            </Link>
          )}

        </nav>
      </div>
    </>
  );
}
