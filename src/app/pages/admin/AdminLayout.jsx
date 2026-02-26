// src/app/pages/admin/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import ThemeProvider from "@/app/providers/ThemeProvider";
import UnifiedLayout from "@/layouts/UnifiedLayout";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout() {
  return (
    <ThemeProvider mode="admin">
      <div className="min-h-screen w-full flex">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          <AdminHeader />

          <UnifiedLayout>
            <Outlet />
          </UnifiedLayout>
        </div>
      </div>
    </ThemeProvider>
  );
}
