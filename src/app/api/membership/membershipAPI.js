import { supabase } from "@/supabaseClient";

/* ============================================================
   FETCH MEMBERSHIP
   ============================================================ */
export async function fetchMembership(clubSlug) {
  // 1. Get club ID from slug
  const { data: club, error: clubError } = await supabase
    .from("clubs")
    .select("id")
    .eq("slug", clubSlug)
    .single();

  if (clubError || !club) return null;

  // 2. Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  // 3. Fetch membership row
  const { data: membership, error: membershipError } = await supabase
    .from("household_memberships") // ✅ fixed
    .select("*")
    .eq("club_id", club.id)
    .eq("user_id", user.id)
    .single();

  if (membershipError) return null;

  return membership;
}

/* ============================================================
   FETCH DRIVERS
   ============================================================ */
export async function fetchDrivers(membershipId) {
  if (!membershipId) return [];

  const { data, error } = await supabase
    .from("drivers")
    .select("*")
    .eq("membership_id", membershipId)
    .order("created_at", { ascending: true });

  if (error) return [];

  return data || [];
}

/* ============================================================
   CREATE MEMBERSHIP (JOIN THE CLUB)
   ============================================================ */
export async function createMembership(clubSlug, membershipType) {
  // 1. Get club ID
  const { data: club } = await supabase
    .from("clubs")
    .select("id")
    .eq("slug", clubSlug)
    .single();

  if (!club) return { error: "Club not found" };

  // 2. Get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "User not logged in" };

  // 3. Create membership row
  const start = new Date();
  const end = new Date();
  end.setFullYear(end.getFullYear() + 1);

  const { data, error } = await supabase
    .from("household_memberships") // ✅ fixed
    .insert({
      club_id: club.id,
      user_id: user.id,
      membership_type: membershipType,
      status: "active",
      start_date: start.toISOString(),
      end_date: end.toISOString(),
      primary_first_name: user.user_metadata?.first_name || "",
      primary_last_name: user.user_metadata?.last_name || "",
    })
    .select()
    .single();

  return { data, error };
}

/* ============================================================
   MOVE TO FAMILY MEMBERSHIP
   ============================================================ */
export async function moveToFamily(membershipId) {
  if (!membershipId) return { error: "Missing membershipId" };

  const { data, error } = await supabase
    .from("household_memberships") // ✅ fixed
    .update({
      membership_type: "family",
    })
    .eq("id", membershipId)
    .select()
    .single();

  return { data, error };
}

/* ============================================================
   RENEW MEMBERSHIP
   ============================================================ */
export async function renewMembership(membershipId) {
  if (!membershipId) return { error: "Missing membershipId" };

  // Fetch current membership to get end_date
  const { data: current } = await supabase
    .from("household_memberships") // ✅ fixed
    .select("end_date")
    .eq("id", membershipId)
    .single();

  if (!current) return { error: "Membership not found" };

  const currentEnd = new Date(current.end_date);
  const newEnd = new Date(currentEnd);
  newEnd.setFullYear(newEnd.getFullYear() + 1);

  const { data, error } = await supabase
    .from("household_memberships") // ✅ fixed
    .update({
      end_date: newEnd.toISOString(),
    })
    .eq("id", membershipId)
    .select()
    .single();

  return { data, error };
}
