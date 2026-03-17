// src/app/pages/admin/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import { useClub } from "@/app/providers/ClubProvider";
import Header from "@/components/ui/Header";

export default function AdminLayout() {
  const { club } = useClub();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header admin club={club} />
      <main className="flex-1 w-full">
        <div className="max-w-[1024px] mx-auto px-4 py-6">
          <Outlet context={{ club }} />
        </div>
      </main>
    </div>
  );
}
