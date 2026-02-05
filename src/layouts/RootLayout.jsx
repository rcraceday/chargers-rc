// src/layouts/RootLayout.jsx
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import logo from "../assets/Chargers_RC_Logo_2026.png";

export default function RootLayout() {
  const [session, setSession] = useState(null);
  const user = session?.user;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
  <div className="min-h-screen bg-white text-black flex flex-col font-poppins">


      {/* HEADER */}
      <header className="bg-white border-b-4 border-sky-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">

            {/* LEFT SIDE */}
            <div className="flex items-center gap-8">

              {/* LOGO */}
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="Chargers RC Logo"
                  className="h-14 w-auto"
                />
              </Link>

              {/* Racing stripe */}
              <div className="hidden sm:block h-6 w-1 bg-sky-700 transform -skew-x-12"></div>

              {/* NAV */}
              <nav className="hidden sm:flex items-center gap-6">
                <Link
                  to="/"
                  className="text-sm font-semibold hover:text-red-400 transition"
                >
                  Home
                </Link>
                <Link
                  to="/events"
                  className="text-sm font-semibold hover:text-red-400 transition"
                >
                  Events
                </Link>

                <Link
                  to="/nominations"
                  className="text-sm font-semibold hover:text-red-400 transition"
                >
                  Nominations
                </Link>

                <Link
                  to="/profile"
                  className="text-sm font-semibold hover:text-red-400 transition"
                >
                  My Profile
                </Link>
              </nav>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="hidden sm:inline text-sm text-slate-600">
                    {user.email}
                  </span>

                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-white font-bold bg-chargers-blue hover:bg-chargers-lblue rounded-md shadow-md transition"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-bold bg-red-600 hover:bg-red-700 rounded-md shadow-md transition"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-bold bg-gray-800 hover:bg-gray-700 rounded-md shadow-md transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-red-600 bg-black">
        <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-400">
          © {new Date().getFullYear()} Chargers RC Club
        </div>
      </footer>
    </div>
  );
}
