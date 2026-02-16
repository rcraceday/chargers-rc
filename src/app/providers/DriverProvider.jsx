// src/app/providers/DriverProvider.jsx
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useAuth } from "@/app/providers/AuthProvider";

export const DriverContext = createContext({
  drivers: [],
  loadingDrivers: true,
  refreshDrivers: async () => {},
  addDriverNumber: async () => {},
  removeDriverNumber: async () => {},
});

export function useDrivers() {
  return useContext(DriverContext);
}

export default function DriverProvider({ children }) {
  const { user } = useAuth();

  const [drivers, setDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);

  // ------------------------------------------------------------
  // LOAD DRIVERS
  // ------------------------------------------------------------
  const loadDrivers = useCallback(async () => {
    if (!user?.id) {
      setDrivers([]);
      setLoadingDrivers(false);
      return;
    }

    setLoadingDrivers(true);

    try {
      const { data, error } = await supabase
        .from("driver_numbers")
        .select("*")
        .eq("user_id", user.id)
        .order("number", { ascending: true });

      if (error) {
        console.warn("DriverProvider loadDrivers error", error);
        setDrivers([]);
      } else {
        setDrivers(data || []);
      }
    } catch (err) {
      console.error("DriverProvider loadDrivers caught", err);
      setDrivers([]);
    } finally {
      setLoadingDrivers(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadDrivers();
  }, [user?.id, loadDrivers]);

  // ------------------------------------------------------------
  // ADD DRIVER NUMBER
  // ------------------------------------------------------------
  const addDriverNumber = useCallback(
    async (number) => {
      if (!user?.id) return { error: "NO_USER" };

      try {
        const { error } = await supabase.from("driver_numbers").insert({
          user_id: user.id,
          number,
        });

        if (error) {
          console.error("addDriverNumber error", error);
          return { error: "INSERT_FAILED" };
        }

        await loadDrivers();
        return { success: true };
      } catch (err) {
        console.error("addDriverNumber caught", err);
        return { error: "INSERT_FAILED" };
      }
    },
    [user?.id, loadDrivers]
  );

  // ------------------------------------------------------------
  // REMOVE DRIVER NUMBER
  // ------------------------------------------------------------
  const removeDriverNumber = useCallback(
    async (id) => {
      if (!user?.id) return { error: "NO_USER" };

      try {
        const { error } = await supabase.from("driver_numbers").delete().eq("id", id);

        if (error) {
          console.error("removeDriverNumber error", error);
          return { error: "DELETE_FAILED" };
        }

        await loadDrivers();
        return { success: true };
      } catch (err) {
        console.error("removeDriverNumber caught", err);
        return { error: "DELETE_FAILED" };
      }
    },
    [user?.id, loadDrivers]
  );

  return (
    <DriverContext.Provider
      value={{
        drivers,
        loadingDrivers,
        refreshDrivers: loadDrivers,
        addDriverNumber,
        removeDriverNumber,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
}
