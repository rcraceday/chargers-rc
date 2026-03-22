// src/layouts/AppLayout.jsx
import { Outlet, Navigate, useParams } from "react-router-dom";
import { useClub } from "@/app/providers/ClubProvider";
import { useAuth } from "@/app/providers/AuthProvider";
import Header from "@/components/ui/Header";

export default function AppLayout() {
  const { club } = useClub();
  const { user, loadingUser } = useAuth();
  const { clubSlug } = useParams();

  // While auth is loading, avoid flashing the app UI
  if (loadingUser) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="p-6 text-center">Loading…</div>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to={`/${clubSlug}/public/login`} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header club={club} />
      <main className="flex-1 w-full">
        <Outlet context={{ club }} />
      </main>
    </div>
  );
}
