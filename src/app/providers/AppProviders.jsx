// src/app/providers/AppProviders.jsx
import { Outlet } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import ClubProvider, { useClub } from "@/app/providers/ClubProvider";

import MembershipProvider from "@/app/providers/MembershipProvider";
import ProfileProvider from "@/app/providers/ProfileProvider";
import DriverProvider from "@/app/providers/DriverProvider";
import NumberProvider from "@/app/providers/NumberProvider";
import NotificationProvider from "@/app/providers/NotificationProvider";

function InnerAppProviders() {
  const { user } = useAuth();
  const { club } = useClub();

  // 🔥 DIAGNOSTIC LOG — THIS IS WHAT WE NEED
  console.log("[InnerAppProviders]", { user, club });

  return (
    <ProfileProvider>
      <MembershipProvider user={user} club={club}>
        <DriverProvider>
          <NumberProvider>
            <NotificationProvider>
              <Outlet />
            </NotificationProvider>
          </NumberProvider>
        </DriverProvider>
      </MembershipProvider>
    </ProfileProvider>
  );
}

export default function AppProviders() {
  return (
    <ClubProvider>
      <InnerAppProviders />
    </ClubProvider>
  );
}
