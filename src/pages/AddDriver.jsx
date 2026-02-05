// src/pages/AddDriver.jsx
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AddDriver() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isJunior, setIsJunior] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.rpc("add_driver", {
      p_first_name: firstName.trim(),
      p_last_name: lastName.trim(),
      p_is_junior: isJunior,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/profile");
  };

  return (
    <div>
      <h1>Add driver</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First name</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Last name</label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={isJunior}
              onChange={(e) => setIsJunior(e.target.checked)}
            />
            Junior driver
          </label>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save driver"}
        </button>
      </form>
    </div>
  );
}
