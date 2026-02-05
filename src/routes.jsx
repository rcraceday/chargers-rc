// src/routes.jsx
import { createBrowserRouter } from "react-router-dom";

// Layout
import RootLayout from "./layouts/RootLayout";

// Public Pages
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";

// Auth
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

// Profile + Drivers
import Profile from "./pages/Profile";
import AddDriver from "./pages/AddDriver";
import EditDriver from "./pages/EditDriver";

// Nominations
import Nominations from "./pages/Nominations";
import NominationSelectClass from "./pages/NominationSelectClass";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminEventEdit from "./pages/admin/AdminEventEdit";

// Errors
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,

    children: [
      // Public
      { index: true, element: <Home /> },
      { path: "events", element: <Events /> },
      { path: "events/:id", element: <EventDetails /> },

      // Auth
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "dashboard", element: <Dashboard /> },

      // Profile + Drivers
      { path: "profile", element: <Profile /> },
      { path: "profile/drivers/add", element: <AddDriver /> },
      { path: "profile/drivers/:id/edit", element: <EditDriver /> },

      // Nominations
      { path: "nominations", element: <Nominations /> },
      {
        path: "nominations/select-class/:eventId/:driverId",
        element: <NominationSelectClass />,
      },

      // Admin
      { path: "admin", element: <AdminDashboard /> },
      { path: "admin/events", element: <AdminEvents /> },
      { path: "admin/events/:id", element: <AdminEventEdit /> },
    ],
  },
]);

export default router;
