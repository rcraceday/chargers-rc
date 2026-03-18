// src/components/ui/AvatarMenu.jsx
import { useState } from "react";
import { useMembership } from "@app/providers/MembershipProvider";
import UserStatusIcon from "@/components/ui/UserStatusIcon";

export default function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const { membership } = useMembership();

  const type = membership?.membership_type;

  const label =
    type === "family"
      ? "Family Member"
      : type === "junior"
      ? "Junior Member"
      : type === "single"
      ? "Single Member"
      : type === "non_member"
      ? "Non‑Member"
      : "Member";

  return (
    <div
      className="relative avatar-wrapper cursor-default"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Avatar + Badge */}
      <UserStatusIcon />

      {/* Membership Status Hover */}
      <div className={`avatar-dropdown ${open ? "open" : ""}`}>
        <div className="avatar-status">{label}</div>
      </div>
    </div>
  );
}
