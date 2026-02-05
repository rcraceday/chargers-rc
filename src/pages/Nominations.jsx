// src/pages/Nominations.jsx
import { useSearchParams, useNavigate } from "react-router-dom";
import useProfile from "../hooks/useProfile";

export default function Nominations() {
  const [params] = useSearchParams();
  const eventId = params.get("eventId");

  const navigate = useNavigate();
  const { drivers, loading } = useProfile();

  if (loading) return <p>Loading...</p>;

  // No drivers found
  if (!drivers || drivers.length === 0) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Nominations</h1>
        <p>You don’t have any drivers set up yet.</p>
      </div>
    );
  }

  // Auto-redirect if only one driver
  if (drivers.length === 1) {
    const driver = drivers[0];
    navigate(`/nominations/select-class/${eventId}/${driver.id}`);
    return null;
  }

  // Multiple drivers → show list
  return (
    <div style={{ padding: "20px" }}>
      <h1>Nominations</h1>
      <p>Select a driver to nominate for this event.</p>

      <ul style={{ marginTop: "20px" }}>
        {drivers.map((driver) => (
          <li key={driver.id} style={{ marginBottom: "10px" }}>
            <button
              onClick={() =>
                navigate(
                  `/nominations/select-class/${eventId}/${driver.id}`
                )
              }
              style={{ padding: "10px 20px", fontSize: "16px" }}
            >
              {driver.first_name} {driver.last_name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
