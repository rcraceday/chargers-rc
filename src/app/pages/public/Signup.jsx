// src/app/pages/public/Signup.jsx
import { useOutletContext, Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/supabaseClient";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

// 🔥 Import RC RaceDay global logo
import rcracedayLogo from "@/assets/rcraceday_logo.png";

export default function Signup() {
  const { club } = useOutletContext();
  const { clubSlug } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!club) return <div style={{ padding: 24, textAlign: "center" }}>Loading…</div>;

  const logoSrc = club?.logo_url || club?.logo || null;

  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  async function handleSignup(e) {
    e.preventDefault();

    setErrorMsg("");

    if (!name.trim()) return setErrorMsg("Please enter your full name.");
    if (!isValidEmail(email.trim())) return setErrorMsg("Please enter a valid email address.");
    if (password.length < 6) return setErrorMsg("Password must be at least 6 characters long.");
    if (password !== confirmPassword) return setErrorMsg("Passwords do not match.");

    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    const { data: existingUser, error: existingError } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (existingError) {
      setErrorMsg("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    if (existingUser) {
      setErrorMsg("This email is already registered. Please log in instead.");
      setLoading(false);
      return;
    }

    const redirectUrl = `${window.location.origin}/${clubSlug}/public/login/`;

    const parts = name.trim().split(/\s+/);
    const firstName = parts[0];
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : firstName;

    const payload = {
      email: cleanEmail,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        shouldCreateUser: true,
        data: {
          full_name: name.trim(),
          first_name: firstName,
          last_name: lastName,
          email: cleanEmail,
          club_name: club?.name || "",
          club_logo_url: club?.logo_url || club?.logo || "",
        },
      },
    };

    const { data, error } = await supabase.auth.signUp(payload);

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();

    navigate(
      `/${clubSlug}/public/check-email?email=${encodeURIComponent(cleanEmail)}`
    );

    setLoading(false);
  }

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        <div
          className="public-column"
          style={{
            width: "100%",
            maxWidth: "320px",
            marginLeft: "auto",
            marginRight: "auto",
            boxSizing: "border-box",
          }}
        >
          {logoSrc && (
            <img
              src={logoSrc}
              alt={club?.name}
              style={{
                height: 64,
                width: "auto",
                objectFit: "contain",
                marginBottom: 16,
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />
          )}

          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, textAlign: "center" }}>
            Create Account
          </h1>

          <form
            onSubmit={handleSignup}
            style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}
          >
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {errorMsg && (
              <p style={{ color: "#dc2626", fontSize: 14, textAlign: "center" }}>
                {errorMsg}
              </p>
            )}

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Creating account…" : "Sign Up"}
            </Button>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, color: "#6b7280" }}>
            Already have an account?{" "}
            <Link
              to={`/${clubSlug}/public/login`}
              style={{ color: "#0A66C2", textDecoration: "underline" }}
            >
              Log in
            </Link>
          </p>

          {/* 🔥 RC RaceDay global home link */}
          <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
            <img
              src={rcracedayLogo}
              alt="RC RaceDay"
              onClick={() => navigate("/")}
              style={{
                width: 96,
                cursor: "pointer",
                transition: "transform 0.2s ease",
                filter: "drop-shadow(0 0 0 transparent)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.filter = "drop-shadow(0 4px 6px rgba(0,0,0,0.15))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.filter = "drop-shadow(0 0 0 transparent)";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
