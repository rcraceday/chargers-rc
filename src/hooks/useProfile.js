// src/hooks/useProfile.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function useProfile() {
  const [profile, setProfile] = useState(null);
  const [membership, setMembership] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      if (profileData?.membership_id) {
        // Load membership
        const { data: membershipData } = await supabase
          .from("memberships")
          .select("*")
          .eq("id", profileData.membership_id)
          .single();

        setMembership(membershipData);

        // Load drivers
        const { data: driverData } = await supabase
          .from("drivers")
          .select("*")
          .eq("membership_id", profileData.membership_id);

        setDrivers(driverData || []);
      }

      setLoading(false);
    }

    load();
  }, []);

  return { profile, membership, drivers, loading };
}
