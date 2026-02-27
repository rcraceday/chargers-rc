// src/app/pages/admin/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import ThemeProvider from "@/app/providers/ThemeProvider";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout() {
  return (
    <ThemeProvider mode="admin">
      {/* Full-page white canvas */}
      <div className="min-h-screen w-full flex flex-col bg-white">

        {/* Header with bottom border */}
        <header className="w-full bg-white border-b">
          <div className="w-full max-w-[1400px] mx-auto px-8">
            <AdminHeader />
          </div>
        </header>

        {/* Unified centered container for sidebar + content */}
        <div className="w-full flex-1 flex justify-center">
          <div className="w-full max-w-[1400px] flex">

            {/* Sidebar with right border */}
            <aside className="w-64 bg-white border-r px-6 py-8 shrink-0">
              <AdminSidebar />
            </aside>

            {/* Content area */}
            <main className="flex-1 px-10 py-10 flex justify-center">
              <div className="w-full max-w-[900px]">
                <Outlet />
              </div>
            </main>

          </div>
        </div>

        {/* Footer aligned with content */}
        <footer className="w-full border-t py-6 bg-white">
          <div className="w-full max-w-[900px] mx-auto text-center text-sm text-gray-500">
            © RCRaceday 2026
          </div>
        </footer>

      </div>
    </ThemeProvider>
  );
}
