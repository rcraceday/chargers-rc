// src/app/pages/public/Login.jsx
import { useState } from "react";
import { useNavigate, useParams, useOutletContext, Link } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";

export default function Login() {
  const { club } = useOutletContext();
  const { clubSlug } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!club) return <div className="p-6 text-center">Loading…</div>;

  const logoSrc =
    club?.logoUrl ||
    club?.logo ||
    club?.logo_url ||
    club?.theme?.hero?.logo ||
    club?.branding?.logo ||
    club?.assets?.logo ||
    null;

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password) {
      setErrorMsg("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setErrorMsg(
        error.message.includes("Invalid login credentials")
          ? "Incorrect email or password."
          : error.message
      );
      setLoading(false);
      return;
    }

    // 🔥 STOP HERE — MembershipProvider will handle membership creation/attachment
    navigate(`/${clubSlug}/app/`);
  }

  return (
    <div className="px-6 py-8 max-w-sm mx-auto flex flex-col items-center">
      {logoSrc && (
        <img
          src={logoSrc}
          alt={club.name}
          className="h-22 w-auto object-contain mb-4"
        />
      )}

      <h1 className="text-2xl font-bold mb-6 text-center">Log In</h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
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
        {errorMsg && (
          <p className="text-red-600 text-sm text-center">{errorMsg}</p>
        )}
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Logging in…" : "Log In"}
        </Button>
      </form>

      <p className="text-center mt-6 text-gray-600">
        Don’t have an account?{" "}
        <Link to={`/${clubSlug}/public/signup`} className="text-blue-600 underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
