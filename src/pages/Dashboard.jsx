import useProfile from "../hooks/useProfile";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { profile, loading } = useProfile();

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome back, {profile.full_name || "Racer"}</h1>

      {/* Membership Status */}
      <div style={{ marginTop: 20 }}>
        <strong>Membership:</strong>{" "}
        {profile.is_member
          ? `Active until ${profile.membership_expires}`
          : "Not a member"}
      </div>

      <div className="bg-green-500 text-white p-10 text-3xl">
  If this is green, Tailwind is working
</div>


      {/* Nominations Status */}
      <div style={{ marginTop: 10 }}>
        <strong>Nominations:</strong>{" "}
        {profile.is_member ? "Allowed" : "Blocked"}
      </div>

      {/* Admin Dashboard Link */}
      {profile.role === "admin" && (
        <div style={{ marginTop: 30 }}>
          <Link to="/admin" style={{ fontWeight: "bold" }}>
            Go to Admin Dashboard
          </Link>
        </div>
      )}

      {/* Nomination Link */}
      <div style={{ marginTop: 30 }}>
        <Link to="/nominations">Nominate for an Event</Link>
      </div>

      {/* Events Link */}
      <div style={{ marginTop: 10 }}>
        <Link to="/events">View Events</Link>
      </div>

      {/* Profile Link */}
      <div style={{ marginTop: 10 }}>
        <Link to="/profile">My Profile</Link>
      </div>
    </div>
  );
}
