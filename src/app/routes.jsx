// src/routes.jsx
import { createBrowserRouter } from "react-router-dom";

import AuthProvider from "@/app/providers/AuthProvider";
import ProfileProvider from "@/app/providers/ProfileProvider";
import MembershipProvider from "@/app/providers/MembershipProvider";
import DriverProvider from "@/app/providers/DriverProvider";
import ClubLayout from "@/app/providers/ClubLayout";

// Pages
import HomePage from "@/app/pages/HomePage";
import LoginPage from "@/app/pages/LoginPage";
import DashboardPage from "@/app/pages/DashboardPage";
import MembershipPage from "@/app/pages/MembershipPage";
import DriversPage from "@/app/pages/DriversPage";
import NotFoundPage from "@/app/pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/club/:clubSlug",
    element: (
      <AuthProvider>
        <ProfileProvider>
          <MembershipProvider>
            <DriverProvider>
              <ClubLayout />
            </DriverProvider>
          </MembershipProvider>
        </ProfileProvider>
      </AuthProvider>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "membership", element: <MembershipPage /> },
      { path: "drivers", element: <DriversPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default router;
