// src/app/pages/public/ForgotPassword.jsx
import { useState } from "react";
import { useNavigate, useParams, useOutletContext, Link } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import ClubHero from "@/components/ui/ClubHero";

export default function ForgotPassword() {
  const { club } = useOutletContext();
  const { clubSlug } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!club) return <div className="p-6 text-center">Loading…</div>;

  async function handleReset(e) {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");

    if (!email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    setLoading(true);

    // MUST end with trailing slash to avoid Supabase "#"
    const redirectUrl = `${window.location.origin}/${clubSlug}/public/reset-password/`;

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: redirectUrl,
      }
    );

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    setMessage("A password reset link has been sent to your email.");
    setLoading(false);
  }

  return (
    <>
      <ClubHero variant="small" showLogo={true} />

      <div className="px-6 py-10 max-w-sm mx-auto flex flex-col items-center">

        <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>

        <form onSubmit={handleReset} className="flex flex-col gap-4 w-full">

          <TextInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errorMsg.includes("email") ? errorMsg : ""}
          />

          {errorMsg && (
            <p className="text-red-600 text-sm text-center">{errorMsg}</p>
          )}

          {message && (
            <p className="text-emerald-600 text-sm text-center">{message}</p>
          )}

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Sending…" : "Send Reset Link"}
          </Button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Remember your password?{" "}
          <Link
            to={`/${clubSlug}/public/login`}
            className="text-blue-600 underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </>
  );
}
