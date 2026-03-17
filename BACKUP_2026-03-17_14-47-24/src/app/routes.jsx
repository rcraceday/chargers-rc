// src/app/routes.jsx
import { Routes, Route, Navigate, useParams } from "react-router-dom";

import ClubLayout from "@/app/providers/ClubLayout";

import AppLayout from "@/layouts/AppLayout";
import PublicLayout from "@/layouts/PublicLayout";
import AdminLayout from "@app/pages/admin/AdminLayout";

// PUBLIC PAGES
import Login from "@app/pages/public/Login";
import Signup from "@app/pages/public/Signup";
import Welcome from "@app/pages/public/Welcome";
import CheckEmail from "@app/pages/public/CheckEmail";
import ForgotPassword from "@app/pages/public/ForgotPassword";
import ResetPassword from "@app/pages/public/ResetPassword";

// APP PAGES
import Home from "@app/pages/home/Home";
import Events from "@app/pages/events/Events";
import EventDetails from "@app/pages/events/EventDetails";
import Calendar from "@app/pages/events/Calendar";
import CalendarItemDetails from "@app/pages/events/CalendarItemDetails";

import UserProfile from "@app/pages/profile/UserProfile";
import DriverManager from "@app/pages/profile/DriverManager";
import DriverProfile from "@app/pages/profile/DriverProfile";
import AddDriver from "@app/pages/profile/AddDriver";
import EditDriver from "@app/pages/profile/EditDriver";

// ADMIN PAGES
import AdminDashboard from "@app/pages/admin/AdminDashboard";
import ChampionshipsList from "@app/pages/admin/championships/ChampionshipsList";
import CreateChampionship from "@app/pages/admin/championships/CreateChampionship";
import AdminEvents from "@app/pages/admin/AdminEvents";
import AdminEventEdit from "@app/pages/admin/AdminEventEdit";
import AdminClassManager from "@app/pages/admin/AdminClassManager";
import AdminEventNominations from "@app/pages/admin/nominations/AdminEventNominations";
import NominationsExport from "@app/pages/admin/NominationsExport";

// MEMBERSHIP
import JoinMembership from "@app/pages/membership/JoinMembership";
import RenewMembership from "@app/pages/membership/RenewMembership";
import UpgradeMembership from "@app/pages/membership/UpgradeMembership";

// LOGOUT
import Logout from "@app/pages/Logout";

// FALLBACK
import NotFound from "@app/pages/NotFound";

function ClubRootRedirect() {
  const { clubSlug } = useParams();
  return <Navigate to={`/${clubSlug}/public/welcome`} replace />;
}

export default function RoutesFile() {
  return (
    <Routes>
      {/* DEFAULT CLUB ROOT */}
      <Route path="/:clubSlug" element={<ClubRootRedirect />} />

      {/* PUBLIC */}
      <Route
        path="/:clubSlug/public/*"
        element={
          <ClubLayout>
            <PublicLayout />
          </ClubLayout>
        }
      >
        <Route index element={<Welcome />} />
        <Route path="welcome" element={<Welcome />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="check-email/*" element={<CheckEmail />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="welcome" replace />} />
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

        <Route path="membership" element={<JoinMembership />} />
        <Route path="membership/join" element={<JoinMembership />} />
        <Route path="membership/renew" element={<RenewMembership />} />
        <Route path="membership/upgrade" element={<UpgradeMembership />} />

        <Route path="calendar" element={<Calendar />} />
        <Route path="calendar/:id" element={<CalendarItemDetails />} />

        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetails />} />

        <Route path="profile" element={<UserProfile />} />
        <Route path="profile/drivers" element={<DriverManager />} />
        <Route path="profile/drivers/add" element={<AddDriver />} />
        <Route path="profile/drivers/:id/edit" element={<EditDriver />} />
        <Route path="profile/drivers/:id" element={<DriverProfile />} />

        {/* LOGOUT ROUTE */}
        <Route path="logout" element={<Logout />} />

        <Route path="*" element={<Navigate to="" replace />} />
      </Route>

      {/* ADMIN */}
      <Route
        path="/:clubSlug/admin/*"
        element={
          <ClubLayout mode="admin">
            <AdminLayout />
          </ClubLayout>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="events/new" element={<AdminEventEdit />} />
        <Route path="events/:id" element={<AdminEventEdit />} />
        <Route path="events/:id/classes" element={<AdminClassManager />} />
        <Route path="events/:id/nominations" element={<AdminEventNominations />} />
        <Route path="events/:id/nominations/export" element={<NominationsExport />} />
        <Route path="championships" element={<ChampionshipsList />} />
        <Route path="championships/create" element={<CreateChampionship />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Route>

      {/* GLOBAL FALLBACK */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
