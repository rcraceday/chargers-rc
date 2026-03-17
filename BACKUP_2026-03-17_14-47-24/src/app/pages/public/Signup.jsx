// src/app/pages/public/Signup.jsx
import { useOutletContext, Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/supabaseClient";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";

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

  if (!club) return <div className="p-6 text-center">Loading…</div>;

  const logoSrc = club?.logo_url || club?.logo || null;

  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  async function handleSignup(e) {
    e.preventDefault();

    console.log("🔥 handleSignup CALLED");

    setErrorMsg("");

    if (!name.trim()) {
      console.log("❌ Name invalid");
      return setErrorMsg("Please enter your full name.");
    }
    if (!isValidEmail(email.trim())) {
      console.log("❌ Email invalid");
      return setErrorMsg("Please enter a valid email address.");
    }
    if (password.length < 6) {
      console.log("❌ Password too short");
      return setErrorMsg("Password must be at least 6 characters long.");
    }
    if (password !== confirmPassword) {
      console.log("❌ Passwords do not match");
      return setErrorMsg("Passwords do not match.");
    }

    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    console.log("🔥 Checking existing profile for:", cleanEmail);

    const { data: existingUser, error: existingError } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", cleanEmail)
      .maybeSingle();

    console.log("🔥 existingUser result:", existingUser, existingError);

    if (existingError) {
      console.log("❌ Profile lookup error:", existingError);
      setErrorMsg("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    if (existingUser) {
      console.log("❌ Email already exists in profiles");
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
        }
      }
    };

    console.log("🔥 SIGNUP PAYLOAD:", JSON.stringify(payload, null, 2));
    console.log("🔥 Calling supabase.auth.signUp…");

    const { data, error } = await supabase.auth.signUp(payload);

    console.log("🔥 signUp RESPONSE:", { data, error });

    if (error) {
      console.log("❌ Signup error:", error);
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // 🔥 IMPORTANT: Immediately sign out to avoid authenticated state freezing RLS
    await supabase.auth.signOut();

    console.log("✅ Signup success, navigating to check-email");

    navigate(
      `/${clubSlug}/public/check-email?email=${encodeURIComponent(cleanEmail)}`
    );

    setLoading(false);
  }

  return (
    <div className="px-6 py-10 max-w-sm mx-auto flex flex-col items-center">
      {logoSrc && (
        <img
          src={logoSrc}
          alt={club?.name}
          className="h-16 w-auto object-contain mb-4"
        />
      )}

      <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

      <form onSubmit={handleSignup} className="flex flex-col gap-4 w-full">
        <TextInput
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextInput
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {errorMsg && (
          <p className="text-red-600 text-sm text-center">{errorMsg}</p>
        )}

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Creating account…" : "Sign Up"}
        </Button>
      </form>

      <p className="text-center mt-6 text-gray-600">
        Already have an account?{" "}
        <Link
          to={`/${clubSlug}/public/login`}
          className="text-blue-600 underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
