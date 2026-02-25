// src/components/admin/AdminSidebar.jsx
import { useState } from "react";
import { useTheme } from "@/app/providers/ThemeProvider";
import { Link } from "react-router-dom";

export default function AdminSidebar() {
  const { palette } = useTheme();
  const [open, setOpen] = useState(false);

  const sidebarStyle = {
    background: "#ffffff",
    borderRight: `2px solid ${palette.primary}`,
    width: "260px",
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white shadow px-3 py-2 rounded"
        onClick={() => setOpen(true)}
      >
        Menu
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={sidebarStyle}
      >
        <div className="p-6 font-bold text-lg" style={{ color: palette.primary }}>
          Admin Panel
        </div>

        <nav className="flex flex-col gap-2 p-4">
          <Link to="dashboard" className="text-gray-800 hover:text-black">
            Dashboard
          </Link>
          <Link to="championships" className="text-gray-800 hover:text-black">
            Championships
          </Link>
          <Link to="/" className="text-gray-800 hover:text-black">
            Back to Club
          </Link>
        </nav>
      </aside>
    </>
  );
}
