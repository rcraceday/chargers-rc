// src/components/ui/UserStatusIcon.jsx
import { useMembership } from "@app/providers/MembershipProvider";
import { useAuth } from "@app/providers/AuthProvider";

export default function UserStatusIcon() {
  const { membership } = useMembership();
  const { user } = useAuth();

  const type = membership?.membership_type;
  const isMember = type && type !== "non_member";

  // Build initials from email
  const initials = user?.email
    ? user.email
        .split("@")[0]
        .split(/[.\-_]/)
        .map((p) => p[0]?.toUpperCase())
        .join("")
    : "U";

  // Badge text
  let badgeText = "NM"; // Non-member default
  if (isMember) {
    if (type === "single") badgeText = "SM";
    else if (type === "family") badgeText = "FM";
    else if (type === "junior") badgeText = "JM";
    else badgeText = "M";
  }

  // Badge color
  const badgeColor = isMember ? "bg-green-600" : "bg-red-600";

  return (
    <div className="relative w-8 h-8">
      {/* Avatar (initials only for now) */}
      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold text-gray-700 select-none">
        {initials}
      </div>

      {/* Membership badge */}
      <div
        className={`absolute bottom-0 right-0 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${badgeColor}`}
      >
        {badgeText}
      </div>
    </div>
  );
}
