// src/app/pages/public/Welcome.jsx
import { Link, useOutletContext, useParams } from "react-router-dom";
import Button from "@/components/ui/Button";

export default function Welcome() {
  const { club, loadingClub } = useOutletContext();
  const { clubSlug } = useParams();

  const logoSrc =
    club?.logoUrl ||
    club?.logo ||
    club?.logo_url ||
    club?.theme?.hero?.logo ||
    club?.branding?.logo ||
    club?.assets?.logo ||
    null;

  if (loadingClub || !club) {
    return <div className="p-6 text-center">Loading…</div>;
  }

  return (
    <div className="px-6 py-4 max-w-sm mx-auto flex flex-col items-center text-center">
      {logoSrc && (
        <img
          src={logoSrc}
          alt={club.name}
          className="w-3/4 max-w-[300px] object-contain mb-6"
        />
      )}

      <div className="flex flex-col gap-4 w-full">
        <Link to={`/${clubSlug}/public/login`} className="w-full">
          <Button variant="primary" className="w-full py-3">
            Log In
          </Button>
        </Link>

        <Link to={`/${clubSlug}/public/signup`} className="w-full">
          <Button variant="secondary" className="w-full py-3">
            Create Account
          </Button>
        </Link>
      </div>
    </div>
  );
}
