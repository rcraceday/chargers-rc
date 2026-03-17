// src/components/ui/PublicHeader.jsx
import { Link, useParams } from "react-router-dom";
import rcracedayLogo from "@/assets/rcraceday_logo.png";

export default function PublicHeader() {
  const { clubSlug } = useParams();

  return (
    <header
      className="w-full bg-white"
      style={{
        borderBottom: "3px solid",
        borderImage: "linear-gradient(to right, #00438A, #0A66C2) 1"
      }}
    >
      <div className="w-full max-w-screen-lg mx-auto px-4 h-20 flex items-center">
        <Link to={`/${clubSlug}`}>
          <img
            src={rcracedayLogo}
            alt="RCRaceDay"
            className="h-10 w-auto object-contain"
          />
        </Link>
      </div>
    </header>
  );
}
