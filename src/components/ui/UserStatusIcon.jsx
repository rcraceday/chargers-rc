// src/components/ui/UserStatusIcon.jsx
import { useMembership } from "@app/providers/MembershipProvider";
import { useAuth } from "@app/providers/AuthProvider";

export default function UserStatusIcon() {
  const { membership } = useMembership();
  const { user } = useAuth();

  const type = membership?.membership_type;
  const isMember = type && type !== "non_member";

  // Build initials from full name
  const fullName = user?.user_metadata?.full_name || "";
  const nameParts = fullName.trim().split(" ");

  let initials = "U";
  if (nameParts.length >= 2) {
    initials =
      nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase();
  } else if (nameParts.length === 1 && nameParts[0].length > 0) {
    initials = nameParts[0][0].toUpperCase();
  }

  // Badge text
  let badgeText = "NM";
  if (isMember) {
    if (type === "single") badgeText = "SM";
    else if (type === "family") badgeText = "FM";
    else if (type === "junior") badgeText = "JM";
    else badgeText = "M";
  }

  // Avatar background color
  const avatarColor = isMember
    ? "bg-[var(--brand-color)]"
    : "bg-gray-400";

  // Badge color
  const badgeColor = isMember ? "bg-green-600" : "bg-red-600";

  return (
    <div className="relative w-10 h-10 group">
      {/* Avatar */}
      <div
        className={`
          w-10 h-10 rounded-full
          flex items-center justify-center
          text-sm font-bold text-white select-none
          transition-all duration-150
          ${avatarColor}
        `}
      >
        {initials}
      </div>

      {/* Membership badge */}
      <div
        className={`
          absolute bottom-0 right-0
          w-4 h-4 rounded-full
          flex items-center justify-center
          text-[8px] font-bold text-white
          ${badgeColor}
          shadow-sm
        `}
      >
        {badgeText}
      </div>
    </div>
  );
}
