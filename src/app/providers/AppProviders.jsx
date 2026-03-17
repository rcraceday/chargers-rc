// src/app/providers/AppProviders.jsx

console.log(">>> APP PROVIDERS MOUNTED", import.meta.url);

import { useAuth } from "@/app/providers/AuthProvider";
import ClubProvider, { useClub } from "@/app/providers/ClubProvider";

import MembershipProvider from "@/app/providers/MembershipProvider";
import ProfileProvider from "@/app/providers/ProfileProvider";
import DriverProvider from "@/app/providers/DriverProvider";
import NumberProvider from "@/app/providers/NumberProvider";
import NotificationProvider from "@/app/providers/NotificationProvider";

function InnerAppProviders({ user, children }) {
  const { club } = useClub();

  console.log(">>> APP PROVIDERS CHILDREN", {
    hasMembershipProvider: typeof MembershipProvider === "function",
    user,
    club,
  });

  return (
    <ProfileProvider>
      <MembershipProvider user={user} club={club}>
        <DriverProvider>
          <NumberProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </NumberProvider>
        </DriverProvider>
      </MembershipProvider>
    </ProfileProvider>
  );
}

export default function AppProviders({ children }) {
  const { user } = useAuth();

  return (
    <ClubProvider>
      <InnerAppProviders user={user}>{children}</InnerAppProviders>
    </ClubProvider>
  );
}
