// src/components/ui/HamburgerMenu.jsx
import { useState, useEffect } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useAuth } from "@/app/providers/AuthProvider";
import { useMembership } from "@/app/providers/MembershipProvider";

import DesktopDropdown from "@/components/ui/DesktopDropdown";
import MobileDrawer from "@/components/ui/MobileDrawer";
import { buildMenuItems } from "@/components/ui/menuItems.js";

export default function HamburgerMenu({ clubSlug }) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { user } = useAuth();
  const { membership } = useMembership();
  const isAdmin = membership?.role === "admin";

  const items = buildMenuItems({ clubSlug, isAdmin, user });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div
      className="menu-wrapper"
      onMouseEnter={() => !isMobile && setOpen(true)}
      onMouseLeave={() => !isMobile && setOpen(false)}
    >
      <button
        className="menu-button"
        onClick={() => isMobile && setOpen(true)}
      >
        <Bars3Icon className="hamburger-icon" />
        <span>Menu</span>
      </button>

      {!isMobile && <DesktopDropdown open={open} items={items} />}
      {isMobile && (
        <MobileDrawer open={open} onClose={() => setOpen(false)} items={items} />
      )}
    </div>
  );
}
