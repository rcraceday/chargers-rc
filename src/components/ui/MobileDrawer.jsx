// src/components/ui/MobileDrawer.jsx
import { Link } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function MobileDrawer({ open, onClose, items }) {
  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <div className={`mobile-drawer ${open ? "open" : ""}`}>
      <button className="close-btn" onClick={onClose}>
        <XMarkIcon className="h-6 w-6" />
      </button>

      <nav>
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => {
                if (item.logout) handleLogout();
                onClose();
              }}
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
