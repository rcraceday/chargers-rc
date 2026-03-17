// src/main.jsx

import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";

import AuthProvider from "@/app/providers/AuthProvider";
import ThemeProvider from "@/app/providers/ThemeProvider";
import AppProviders from "@/app/providers/AppProviders";
import RoutesFile from "@/app/routes";
import "uno.css";

console.log(">>> MAIN JSX LOADED", import.meta.url);

function Root() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppProviders>
            <RoutesFile />
          </AppProviders>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
