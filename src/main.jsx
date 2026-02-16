// src/main.jsx
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import ProfileProvider from "@/app/providers/ProfileProvider"; // ✅ CORRECT
import AppProvider from "@app/providers/AppProvider";
import ClubProvider from "@app/providers/ClubProvider";
import ThemeProvider from "@app/providers/ThemeProvider"; // <-- ADD THIS
import AppRoutes from "./app/routes.jsx";
import "uno.css";

function Root() {
  return (
    <ThemeProvider> {/* <-- WRAP EVERYTHING */}
      <BrowserRouter>
        <ProfileProvider>
          <AppProvider>
            <ClubProvider>
              <AppRoutes />
            </ClubProvider>
          </AppProvider>
        </ProfileProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
