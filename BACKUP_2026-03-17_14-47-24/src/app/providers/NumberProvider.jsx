// src/app/providers/NumberProvider.jsx
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useClub } from "@/app/providers/ClubProvider";

export const NumberContext = createContext({
  numbers: [],
  loadingNumbers: true,
  refreshNumbers: async () => {},
  assignNumber: async () => {},
  unassignNumber: async () => {},
});

export function useNumbers() {
  return useContext(NumberContext);
}

export default function NumberProvider({ children }) {
  const { club } = useClub();

  const [numbers, setNumbers] = useState([]);
  const [loadingNumbers, setLoadingNumbers] = useState(true);

  const loadNumbers = useCallback(async () => {
    if (!club?.id) {
      setNumbers([]);
      setLoadingNumbers(false);
      return;
    }

    setLoadingNumbers(true);

    try {
      const { data, error } = await supabase
        .from("numbers")
        .select("*")
        .eq("club_id", club.id)
        .order("number", { ascending: true });

      if (error) {
        console.warn("NumberProvider loadNumbers error:", error);
        setNumbers([]);
      } else {
        const normalized = (data || []).map((n) => ({
          ...n,
          status: (n.status || "available").toLowerCase(),
        }));

        setNumbers(normalized);
      }
    } catch (err) {
      console.error("NumberProvider loadNumbers caught", err);
      setNumbers([]);
    } finally {
      setLoadingNumbers(false);
    }
  }, [club?.id]);

  useEffect(() => {
    loadNumbers();
  }, [loadNumbers]);

  const assignNumber = useCallback(
    async (numberId, driver) => {
      if (!driver?.id) return { error: "NO_DRIVER" };

      try {
        const { error } = await supabase
          .from("numbers")
          .update({
            status: "assigned",
            assigned_to_driver: driver.id,
            assigned_driver_name: `${driver.first_name} ${driver.last_name}`,
            assigned_driver_email: driver.email || null,
          })
          .eq("id", numberId)
          .eq("club_id", club.id);

        if (error) {
          console.error("assignNumber error", error);
          return { error: "ASSIGN_FAILED" };
        }

        await loadNumbers();
        return { success: true };
      } catch (err) {
        console.error("assignNumber caught", err);
        return { error: "ASSIGN_FAILED" };
      }
    },
    [club?.id, loadNumbers]
  );

  const unassignNumber = useCallback(
    async (numberId) => {
      try {
        const { error } = await supabase
          .from("numbers")
          .update({
            status: "available",
            assigned_to_driver: null,
            assigned_driver_name: null,
            assigned_driver_email: null,
          })
          .eq("id", numberId)
          .eq("club_id", club.id);

        if (error) {
          console.error("unassignNumber error", error);
          return { error: "UNASSIGN_FAILED" };
        }

        await loadNumbers();
        return { success: true };
      } catch (err) {
        console.error("unassignNumber caught", err);
        return { error: "UNASSIGN_FAILED" };
      }
    },
    [club?.id, loadNumbers]
  );

  return (
    <NumberContext.Provider
      value={{
        numbers,
        loadingNumbers,
        refreshNumbers: loadNumbers,
        assignNumber,
        unassignNumber,
      }}
    >
      {children}
    </NumberContext.Provider>
  );
}
