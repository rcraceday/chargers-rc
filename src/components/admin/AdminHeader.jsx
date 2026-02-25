// src/components/admin/AdminHeader.jsx
import { useTheme } from "@/app/providers/ThemeProvider";
import { Link } from "react-router-dom";

export default function AdminHeader() {
  const { palette } = useTheme();

  return (
    <header
      className="w-full px-6 py-4 flex items-center justify-between shadow-sm"
      style={{ background: "#ffffff", borderBottom: `2px solid ${palette.primary}` }}
    >
      <div className="text-xl font-bold" style={{ color: palette.primary }}>
        Admin Panel
      </div>

      <nav className="flex gap-6 text-gray-700">
        <Link to="dashboard" className="hover:text-black">Dashboard</Link>
        <Link to="championships" className="hover:text-black">Championships</Link>
        <Link to="/" className="hover:text-black">Back to Club</Link>
      </nav>
    </header>
  );
}
