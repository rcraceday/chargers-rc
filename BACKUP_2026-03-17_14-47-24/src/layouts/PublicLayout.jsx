// src/layouts/PublicLayout.jsx
import { Outlet } from "react-router-dom";
import { useClub } from "@/app/providers/ClubProvider";

export default function PublicLayout() {
  const { club } = useClub();

  return (
    <main className="flex-1 w-full bg-white">
      <div className="max-w-[1024px] mx-auto px-4 py-6">
        <Outlet context={{ club }} />
      </div>
    </main>
  );
}
