// src/app/pages/Logout.jsx
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/supabaseClient";

export default function Logout() {
  const navigate = useNavigate();
  const { clubSlug } = useParams();

  useEffect(() => {
    async function run() {
      await supabase.auth.signOut();
      navigate(`/${clubSlug}/public/login`);
    }
    run();
  }, [navigate, clubSlug]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      Logging out…
    </div>
  );
}
