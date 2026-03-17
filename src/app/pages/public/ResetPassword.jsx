// src/app/pages/public/ResetPassword.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext, Link } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import ClubHero from "@/components/ui/ClubHero";

export default function ResetPassword() {
  const { club } = useOutletContext();
  const { clubSlug } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState(null);

  if (!club) return <div className="p-6 text-center">Loading…</div>;

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", "?"));
    const accessToken = params.get("access_token");

    if (!accessToken) {
      setErrorMsg("Invalid or expired reset link.");
      return;
    }

    setToken(accessToken);
  }, []);

  async function handleReset(e) {
    e.preventDefault();
    setErrorMsg("");
    setMessage("");

    if (!password || !confirm) {
      setErrorMsg("Please enter and confirm your new password.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (!token) {
      setErrorMsg("Missing or invalid reset token.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser(
      { password },
      { accessToken: token }
    );

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    setMessage("Your password has been updated.");
    setLoading(false);

    setTimeout(() => {
      navigate(`/${clubSlug}/public/login`);
    }, 1500);
  }

  return (
    <>
      <ClubHero variant="small" showLogo={true} />

      <div className="px-6 py-10 max-w-sm mx-auto flex flex-col items-center">

        <h1 className="text-2xl font-bold mb-6 text-center">Set New Password</h1>

        {!token && (
          <p className="text-center text-red-600 mb-6">
            Invalid or expired reset link.
          </p>
        )}

        {token && (
          <form onSubmit={handleReset} className="flex flex-col gap-4 w-full">

            <TextInput
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errorMsg.includes("Password") ? errorMsg : ""}
            />

            <TextInput
              label="Confirm Password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={errorMsg.includes("match") ? errorMsg : ""}
            />

            {errorMsg && (
              <p className="text-red-600 text-sm text-center">{errorMsg}</p>
            )}

            {message && (
              <p className="text-emerald-600 text-sm text-center">{message}</p>
            )}

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Updating…" : "Update Password"}
            </Button>
          </form>
        )}

        <p className="text-center mt-6 text-gray-600">
          Back to{" "}
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
