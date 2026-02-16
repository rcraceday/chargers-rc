// src/app/providers/MembershipProvider.jsx
import { createContext, useCallback, useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

export const MembershipContext = createContext({
  membership: null,
  loadingMembership: true,

  isNonMember: false,
  isJunior: false,
  isSingle: false,
  isFamily: false,

  renewMembership: async () => {},
  moveToFamilyMembership: async () => {},
  refreshMembership: async () => {},
});

export default function MembershipProvider({ user, children }) {
  const [membership, setMembership] = useState(null);
  const [loadingMembership, setLoadingMembership] = useState(true);

  // ------------------------------------------------------------
  // LOAD MEMBERSHIP
  // ------------------------------------------------------------
  const loadMembership = useCallback(async () => {
    if (!user?.id) {
      console.debug("MEMBERSHIP loadMembership: no user yet", { user });
      setMembership(null);
      setLoadingMembership(false);
      return;
    }

    setLoadingMembership(true);
    console.debug("MEMBERSHIP loadMembership: querying by user_id", { userId: user.id });

    try {
      const { data, error } = await supabase
        .from("household_memberships")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      console.debug("MEMBERSHIP query result", { data, error });

      if (error) {
        console.warn("MembershipProvider: membership fetch error", error);
        setMembership(null);
      } else if (!data) {
        setMembership(null);
      } else {
        const normalised = { ...data };

        // membership_type
        if (typeof normalised.membership_type === "string") {
          normalised.membership_type = normalised.membership_type.toLowerCase().trim();
        } else {
          normalised.membership_type = String(normalised.membership_type || "")
            .toLowerCase()
            .trim();
        }

        // status
        if (typeof normalised.status === "string") {
          normalised.status = normalised.status.toLowerCase().trim();
        }

        // end_date → Date object + ISO
        if (normalised.end_date) {
          const parsed = new Date(normalised.end_date);
          if (!Number.isNaN(parsed.getTime())) {
            normalised.endDateObj = parsed;
            normalised.end_date = parsed.toISOString();
          } else {
            normalised.endDateObj = null;
          }
        } else {
          normalised.endDateObj = null;
        }

        console.debug("MEMBERSHIP resolved", { membership: normalised });
        setMembership(normalised);
      }
    } catch (err) {
      console.error("MEMBERSHIP loadMembership caught", err);
      setMembership(null);
    } finally {
      setLoadingMembership(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadMembership();
  }, [user?.id, loadMembership]);

  // ------------------------------------------------------------
  // RENEW MEMBERSHIP
  // ------------------------------------------------------------
  const renewMembership = useCallback(async () => {
    if (!membership) return { error: "NO_MEMBERSHIP" };

    const newEndDate = new Date();
    newEndDate.setFullYear(newEndDate.getFullYear() + 1);

    const { error } = await supabase
      .from("household_memberships")
      .update({ end_date: newEndDate.toISOString() })
      .eq("id", membership.id);

    if (error) return { error: "UPDATE_FAILED" };

    await loadMembership();
    return { success: true };
  }, [membership, loadMembership]);

  // ------------------------------------------------------------
  // MOVE TO FAMILY MEMBERSHIP
  // ------------------------------------------------------------
  const moveToFamilyMembership = useCallback(async () => {
    if (!membership) return { error: "NO_MEMBERSHIP" };

    const currentType = membership.membership_type;
    if (currentType === "family") return { error: "ALREADY_FAMILY" };

    const PRICES = { junior: 20, single: 40, family: 60 };
    const difference = PRICES.family - PRICES[currentType];

    const newEndDate = new Date();
    newEndDate.setFullYear(newEndDate.getFullYear() + 1);

    const { error } = await supabase
      .from("household_memberships")
      .update({
        membership_type: "family",
        end_date: newEndDate.toISOString(),
      })
      .eq("id", membership.id);

    if (error) return { error: "UPDATE_FAILED" };

    await loadMembership();
    return { success: true };
  }, [membership, loadMembership]);

  // ------------------------------------------------------------
  // HELPER FLAGS
  // ------------------------------------------------------------
  const type = membership?.membership_type;

  const isNonMember = !membership || type === "non_member";
  const isJunior = type === "junior";
  const isSingle = type === "single";
  const isFamily = type === "family";

  return (
    <MembershipContext.Provider
      value={{
        membership,
        loadingMembership,

        isNonMember,
        isJunior,
        isSingle,
        isFamily,

        renewMembership,
        moveToFamilyMembership,
        refreshMembership: loadMembership,
      }}
    >
      {children}
    </MembershipContext.Provider>
  );
}
