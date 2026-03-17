// src/components/ui/AvatarMenu.jsx
import { useState } from "react";
import { useMembership } from "@app/providers/MembershipProvider";
import UserStatusIcon from "@/components/ui/UserStatusIcon";

export default function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const { membership } = useMembership();

  const label =
    membership?.membership_type === "family"
      ? "Family Member"
      : membership?.membership_type === "junior"
      ? "Junior Member"
      : membership?.membership_type === "single"
      ? "Single Member"
      : membership?.membership_type === "non_member"
      ? "Non‑Member"
      : "Member";

  return (
    <div
      className="avatar-wrapper cursor-default"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="cursor-default">
        <UserStatusIcon />
      </div>

      <div className={`avatar-dropdown ${open ? "open" : ""}`}>
        <div className="avatar-status">{label}</div>
      </div>
    </div>
  );
}
