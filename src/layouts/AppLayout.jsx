// src/layouts/AppLayout.jsx
import { Outlet, Navigate, useParams } from "react-router-dom";
import { useClub } from "@/app/providers/ClubProvider";
import { useAuth } from "@/app/providers/AuthProvider";
import { useProfile } from "@/app/providers/ProfileProvider";
import { useMembership } from "@/app/providers/MembershipProvider";
import Header from "@/components/ui/Header";

export default function AppLayout() {
  const { club } = useClub();
  const { user, loadingUser } = useAuth();
  const { profile, loadingProfile } = useProfile();
  const { membership, loadingMembership } = useMembership();
  const { clubSlug } = useParams();

  const loading =
    loadingUser ||
    loadingProfile ||
    loadingMembership ||
    !club; // club loads async too

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="p-6 text-center">Loading…</div>
      </div>
    );
  }

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
