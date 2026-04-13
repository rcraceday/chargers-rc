import { Routes, Route, Navigate, useParams } from "react-router-dom";

import AppProviders from "@/app/providers/AppProviders";
import ClubLayout from "@/app/providers/ClubLayout";

import AppLayout from "@/layouts/AppLayout";
import PublicLayout from "@/layouts/PublicLayout";
import AdminLayout from "@app/pages/admin/AdminLayout";

// GLOBAL
import ClubSelect from "@/app/pages/global/ClubSelect";

// PUBLIC PAGES
import Login from "@app/pages/public/Login";
import Signup from "@app/pages/public/Signup";
import CheckEmail from "@app/pages/public/CheckEmail";
import ForgotPassword from "@app/pages/public/ForgotPassword";
import ResetPassword from "@app/pages/public/ResetPassword";
import ForgotEmail from "@app/pages/public/ForgotEmail";

// APP PAGES
import Home from "@app/pages/home/Home";
import Events from "@app/pages/events/Events";
import EventDetails from "@app/pages/events/EventDetails";
import EventNominate from "@app/pages/events/EventNominate";

// CALENDAR
import Calendar from "@app/pages/events/calendar/Calendar";
import CalendarItemDetails from "@app/pages/events/calendar/CalendarItemDetails";

// PROFILE
import UserProfile from "@app/pages/profile/UserProfile";
import EditUser from "@app/pages/profile/EditUser";          // UPDATED
import EditProfile from "@app/pages/profile/EditProfile";    // DRIVER EDITOR
import DriverManager from "@app/pages/profile/DriverManager";
import DriverProfile from "@app/pages/profile/DriverProfile";
import AddDriver from "@app/pages/profile/AddDriver";
import ChooseNumber from "@app/pages/profile/ChooseNumber";
import WelcomeAddDrivers from "@app/pages/profile/WelcomeAddDrivers";

// DRIVER PROVIDER
import DriverProvider from "@/app/providers/DriverProvider";

// ADMIN PAGES
import AdminDashboard from "@app/pages/admin/AdminDashboard";
import ChampionshipsList from "@app/pages/admin/championships/ChampionshipsList";
import CreateChampionship from "@app/pages/admin/championships/CreateChampionship";
import AdminEvents from "@app/pages/admin/AdminEvents";
import AdminEventEdit from "@app/pages/admin/AdminEventEdit";
import AdminEventNominations from "@app/pages/admin/nominations/AdminEventNominations";
import NominationsExport from "@app/pages/admin/NominationsExport";

// ADMIN SETTINGS
import ClubSettings from "@app/pages/admin/settings/ClubSettings";
import MembershipSettings from "@app/pages/admin/settings/MembershipSettings";
import EventDefaultsSettings from "@app/pages/admin/settings/EventDefaultsSettings";
import DriverSettings from "@app/pages/admin/settings/DriverSettings";
import SystemSettings from "@app/pages/admin/settings/SystemSettings";
import TracksAndClasses from "@app/pages/admin/settings/TracksAndClasses";
import ClassEditor from "@app/pages/admin/settings/ClassEditor";
import ClubInfoSettings from "@app/pages/admin/settings/ClubInfoSettings";

// MEMBERSHIP
import Membership from "@app/pages/membership/Membership";
import JoinMembership from "@app/pages/membership/JoinMembership";
import RenewMembership from "@app/pages/membership/RenewMembership";
import UpgradeMembership from "@app/pages/membership/UpgradeMembership";

// STYLE GUIDE
import StyleGuidePage from "@app/pages/style-guide/StyleGuidePage";

// LOGOUT
import Logout from "@app/pages/Logout";

// FALLBACK
import NotFound from "@app/pages/NotFound";

function ClubRootRedirect() {
  const { clubSlug } = useParams();
  if (!clubSlug) return null;
  return <Navigate to={`/${clubSlug}/public/login`} replace />;
}

function PublicRootRedirect() {
  const { clubSlug } = useParams();
  if (!clubSlug) return null;
  return <Navigate to={`/${clubSlug}/public/login`} replace />;
}

export default function RoutesFile() {
  return (
    <Routes>
      <Route path="/" element={<ClubSelect />} />

      <Route path="/:clubSlug" element={<ClubRootRedirect />} />

      <Route element={<AppProviders />}>
        {/* PUBLIC */}
        <Route
          path="/:clubSlug/public/*"
          element={
            <ClubLayout>
              <PublicLayout />
            </ClubLayout>
          }
        >
          <Route index element={<PublicRootRedirect />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="check-email/*" element={<CheckEmail />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="forgot-email" element={<ForgotEmail />} />
          <Route path="*" element={<Navigate to="login" replace />} />
        </Route>

        {/* APP */}
        <Route
          path="/:clubSlug/app/*"
          element={
            <ClubLayout>
              <AppLayout />
            </ClubLayout>
          }
        >
          <Route index element={<Home />} />

          {/* MEMBERSHIP */}
          <Route path="membership" element={<Membership />} />
          <Route path="membership/join" element={<JoinMembership />} />
          <Route path="membership/renew" element={<RenewMembership />} />
          <Route path="membership/upgrade" element={<UpgradeMembership />} />

          {/* STYLE GUIDE */}
          <Route path="style-guide" element={<StyleGuidePage />} />

          {/* CALENDAR */}
          <Route path="calendar" element={<Calendar />} />
          <Route path="calendar/:id" element={<CalendarItemDetails />} />

          {/* EVENTS */}
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="events/:eventId/nominate" element={<EventNominate />} />

          {/* PROFILE */}
          <Route path="profile" element={<UserProfile />} />
          <Route path="profile/edit" element={<EditUser />} /> {/* UPDATED */}

          {/* DRIVER MANAGEMENT */}
          <Route
            path="profile/drivers/*"
            element={
              <DriverProvider>
                <Routes>
                  <Route index element={<DriverManager />} />
                  <Route path="add" element={<AddDriver />} />
                  <Route path=":id/edit" element={<EditProfile />} /> {/* UPDATED */}
                  <Route path=":id/choose-number" element={<ChooseNumber />} />
                  <Route path=":id" element={<DriverProfile />} />
                  <Route path="welcome" element={<WelcomeAddDrivers />} />
                </Routes>
              </DriverProvider>
            }
          />

          {/* LOGOUT */}
          <Route path="logout" element={<Logout />} />

          <Route path="*" element={<Navigate to="" replace />} />
        </Route>

        {/* ADMIN */}
        <Route
          path="/:clubSlug/app/admin/*"
          element={
            <ClubLayout mode="admin">
              <AdminLayout />
            </ClubLayout>
          }
        >
          <Route index element={<AdminDashboard />} />

          <Route path="settings" element={<ClubSettings />} />
          <Route path="settings/club-info" element={<ClubInfoSettings />} />
          <Route path="settings/memberships" element={<MembershipSettings />} />
          <Route
            path="settings/event-defaults"
            element={<EventDefaultsSettings />}
          />
          <Route path="settings/drivers" element={<DriverSettings />} />
          <Route path="settings/system" element={<SystemSettings />} />

          <Route path="settings/classes">
            <Route index element={<TracksAndClasses />} />
            <Route path="new" element={<ClassEditor mode="create" />} />
            <Route path=":classId" element={<ClassEditor mode="edit" />} />
          </Route>

          <Route path="events" element={<AdminEvents />} />
          <Route path="events/new" element={<AdminEventEdit />} />
          <Route path="events/:id" element={<AdminEventEdit />} />
          <Route
            path="events/:id/nominations"
            element={<AdminEventNominations />}
          />
          <Route
            path="events/:id/nominations/export"
            element={<NominationsExport />}
          />

          <Route path="championships" element={<ChampionshipsList />} />
          <Route path="championships/create" element={<CreateChampionship />} />

          <Route path="*" element={<Navigate to="" replace />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
