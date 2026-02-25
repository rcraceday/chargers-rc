// src/components/ui/Header.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { useAuth } from "@app/providers/AuthProvider";
import { useMembership } from "@app/providers/MembershipProvider";
import { useTheme } from "@/app/providers/ThemeProvider";

import rcracedayLogo from "../../assets/rcraceday_logo.png";
import chargersLogo from "../../assets/Chargers_RC_Logo_2026.png";

export default function Header({ club }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const { user } = useAuth();
  const { membership } = useMembership();
  const { palette } = useTheme();

  const isAdmin = user?.role === "admin";

  const homePath = club?.slug ? `/${club.slug}/` : "/";

  const headerLogo =
    club?.slug === "chargers-rc" ? chargersLogo : rcracedayLogo;

  const userName =
    user?.user_metadata?.full_name ??
    user?.email ??
    null;

  const isMember = membership?.status === "active";
  const membershipLabel = isMember ? "Club Member" : "Non‑Member";

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  const isActive = (path) => {
    const cleanA = location.pathname.replace(/\/+$/, "");
    const cleanB = path.replace(/\/+$/, "");
    return cleanA === cleanB;
  };

  return (
    <>
      <header
        className="w-full border-b"
        style={{
          background: palette.surface,
          borderColor: palette.surfaceBorder,
          boxShadow: "0 4px 10px rgba(0,0,0,0.18)", // CARD SHADOW
        }}
      >
        <div
          className="relative w-full max-w-6xl mx-auto px-4 h-20 flex items-center justify-between"
          style={{ color: palette.headerText }}
        >
          {/* LEFT: LOGO */}
          <Link to={homePath} className="flex items-center no-underline">
            <img
              src={headerLogo}
              alt="Header logo"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* CENTER NAV */}
          <nav
            className="
              hidden md:flex
              absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              items-center gap-10 font-medium
            "
          >
            {/* HOME */}
            <Link
              to={homePath}
              className="no-underline transition"
              style={{
                color: isActive(homePath)
                  ? palette.headerLinkActive
                  : palette.headerLink,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = palette.headerLinkHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = isActive(homePath)
                  ? palette.headerLinkActive
                  : palette.headerLink)
              }
            >
              Home
            </Link>

            {/* EVENTS */}
            {club?.slug && (
              <Link
                to={`/${club.slug}/events/`}
                className="no-underline transition"
                style={{
                  color: isActive(`/${club.slug}/events/`)
                    ? palette.headerLinkActive
                    : palette.headerLink,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = palette.headerLinkHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = isActive(
                    `/${club.slug}/events/`
                  )
                    ? palette.headerLinkActive
                    : palette.headerLink)
                }
              >
                Events
              </Link>
            )}

            {/* CALENDAR */}
            {club?.slug && (
              <Link
                to={`/${club.slug}/calendar/`}
                className="no-underline transition"
                style={{
                  color: isActive(`/${club.slug}/calendar/`)
                    ? palette.headerLinkActive
                    : palette.headerLink,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = palette.headerLinkHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = isActive(
                    `/${club.slug}/calendar/`
                  )
                    ? palette.headerLinkActive
                    : palette.headerLink)
                }
              >
                Calendar
              </Link>
            )}

            {/* NOMINATE */}
            {club?.slug && (
              <Link
                to={`/${club.slug}/nominate/`}
                className="no-underline transition"
                style={{
                  color: isActive(`/${club.slug}/nominate/`)
                    ? palette.headerLinkActive
                    : palette.headerLink,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = palette.headerLinkHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = isActive(
                    `/${club.slug}/nominate/`
                  )
                    ? palette.headerLinkActive
                    : palette.headerLink)
                }
              >
                Nominate
              </Link>
            )}

            {/* MEMBERSHIP */}
            {club?.slug && (
              <Link
                to={`/${club.slug}/membership/`}
                className="no-underline transition"
                style={{
                  color: isActive(`/${club.slug}/membership/`)
                    ? palette.headerLinkActive
                    : palette.headerLink,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = palette.headerLinkHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = isActive(
                    `/${club.slug}/membership/`
                  )
                    ? palette.headerLinkActive
                    : palette.headerLink)
                }
              >
                Membership
              </Link>
            )}

            {/* ADMIN PORTAL — RED OUTLINE */}
            {isAdmin && club?.slug && (
              <Link
                to={`/${club.slug}/admin`}
                className="text-sm font-medium no-underline transition px-2 py-1 rounded"
                style={{
                  color: palette.headerLink,
                  border: "2px solid #cc0000",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = palette.headerLinkHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = palette.headerLink)
                }
              >
                Admin Portal
              </Link>
            )}
          </nav>

          {/* RIGHT: USER INFO */}
          <div className="hidden md:flex items-center gap-6">
            {user && (
              <div className="flex flex-col text-right leading-tight">
                <span
                  className="font-semibold text-sm"
                  style={{ color: palette.headerText }}
                >
                  {userName}
                </span>
                <span
                  className="text-xs"
                  style={{ color: palette.headerTextMuted }}
                >
                  {membershipLabel}
                </span>
              </div>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="text-sm font-semibold transition"
                style={{ color: palette.headerLink }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = palette.headerLinkHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = palette.headerLink)
                }
              >
                Logout
              </button>
            ) : (
              club?.slug && (
                <Link
                  to={`/${club.slug}/login/`}
                  className="text-sm font-semibold no-underline transition"
                  style={{ color: palette.headerLink }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = palette.headerLinkHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = palette.headerLink)
                  }
                >
                  Login
                </Link>
              )
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className="md:hidden p-2 rounded-md transition"
            style={{ color: palette.headerLink }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = palette.headerLinkHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = palette.headerLink)
            }
          >
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* REVERSED GRADIENT STRIPE */}
        <div
          className="h-1 w-full"
          style={{
            background: "linear-gradient(315deg, #2e3192, #00aeef, #2e3192)",
          }}
        />
      </header>
    </>
  );
}
