// src/components/ui/DesktopDropdown.jsx
import { Link } from "react-router-dom";
import { supabase } from "@/supabaseClient";

export default function DesktopDropdown({ open, items }) {
  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <div className={`desktop-dropdown ${open ? "open" : ""}`}>
      <nav>
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.to}
              onClick={item.logout ? handleLogout : undefined}
            >
              <Icon className="menu-icon" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
