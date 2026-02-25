// src/app/routes.jsx
import { Routes, Route } from "react-router-dom";

import ClubLayout from "@app/providers/ClubLayout";

import Login from "@app/pages/public/Login";
import Signup from "@app/pages/public/Signup";
import Welcome from "@app/pages/public/Welcome";
import Membership from "@app/pages/public/Membership";

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

import AdminDashboard from "@app/pages/admin/AdminDashboard";
import AdminLayout from "@app/pages/admin/AdminLayout";

// Championships
import ChampionshipsList from "@app/pages/admin/championships/ChampionshipsList";
import CreateChampionship from "@app/pages/admin/championships/CreateChampionship";

// Membership flows
import JoinMembership from "@app/pages/membership/JoinMembership";
import RenewMembership from "@app/pages/membership/RenewMembership";
import UpgradeMembership from "@app/pages/membership/UpgradeMembership";

export default function RoutesFile() {
  return (
    <Routes>
      <Route path="/:clubSlug/*" element={<ClubLayout />}>
        {/* Public + Member Pages */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="welcome" element={<Welcome />} />
        <Route index element={<Home />} />

        {/* Membership */}
        <Route path="membership" element={<Membership />} />
        <Route path="membership/join" element={<JoinMembership />} />
        <Route path="membership/renew" element={<RenewMembership />} />
        <Route path="membership/upgrade" element={<UpgradeMembership />} />

        {/* Calendar */}
        <Route path="calendar" element={<Calendar />} />
        <Route path="calendar/:id" element={<CalendarItemDetails />} />

        {/* Events */}
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetails />} />

        {/* Profile + Drivers */}
        <Route path="profile" element={<UserProfile />} />
        <Route path="profile/drivers" element={<DriverManager />} />
        <Route path="profile/drivers/add" element={<AddDriver />} />
        <Route path="profile/drivers/:id/edit" element={<EditDriver />} />
        <Route path="profile/drivers/:id" element={<DriverProfile />} />

        {/* ADMIN AREA */}
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          {/* Championships */}
          <Route path="championships" element={<ChampionshipsList />} />
          <Route path="championships/create" element={<CreateChampionship />} />
        </Route>
      </Route>

      <Route path="*" element={<div>Page not found.</div>} />
    </Routes>
  );
}
