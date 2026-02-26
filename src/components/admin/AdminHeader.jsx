// src/components/admin/AdminHeader.jsx
import { Link, useParams } from "react-router-dom";
import ChargersLogo from "@/assets/Chargers_RC_Logo_2026.png";

export default function AdminHeader() {
  const { clubSlug } = useParams();

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LEFT: Chargers Logo */}
        <div className="flex items-center">
          <img
            src={ChargersLogo}
            alt="Chargers RC Logo"
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* RIGHT: Back to Club */}
        <Link
          to={`/${clubSlug}`}
          className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
        >
          ← Back to Club
        </Link>
      </div>
    </header>
  );
}
