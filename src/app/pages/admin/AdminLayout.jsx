// src/app/pages/admin/AdminLayout.jsx
import ThemeProvider from "@/app/providers/ThemeProvider";
import UnifiedLayout from "@/layouts/UnifiedLayout";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <ThemeProvider mode="admin">
      <div className="min-h-screen w-full flex">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <UnifiedLayout>
            {children}
          </UnifiedLayout>
        </div>
      </div>
    </ThemeProvider>
  );
}
