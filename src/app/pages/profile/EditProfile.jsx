// src/app/pages/profile/EditProfile.jsx

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserIcon } from "@heroicons/react/24/solid";

import { useClub } from "@/app/providers/ClubProvider";
import { useProfile } from "@/app/providers/ProfileProvider";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { supabase } from "@/supabaseClient";

export default function EditProfile() {
  const { clubSlug } = useParams();
  const navigate = useNavigate();

  const { club } = useClub();
  const { profile } = useProfile();

  const brand = club?.theme?.hero?.backgroundColor || "#0A66C2";

  const [firstName] = useState(profile?.first_name || "");
  const [lastName] = useState(profile?.last_name || "");

  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  /* ============================================================
     EMAIL + PASSWORD LOGIC
     ============================================================ */

  const handleUpdateEmail = async () => {
    setEmailError("");
    setEmailMessage("");

    if (oldEmail !== profile.email) {
      setEmailError("Old email does not match your current email.");
      return;
    }

    if (!newEmail || !emailPassword) {
      setEmailError("Enter your new email and password.");
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password: emailPassword,
    });

    if (signInError) {
      setEmailError("Incorrect password.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      email: newEmail,
    });

    if (updateError) {
      setEmailError("Unable to update email.");
      return;
    }

    setEmailMessage(
      "A confirmation email has been sent to your new address. Your email will update once confirmed."
    );
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordMessage("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("Fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password: oldPassword,
    });

    if (signInError) {
      setPasswordError("Old password is incorrect.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setPasswordError("Unable to update password.");
      return;
    }

    setPasswordMessage("Password updated successfully.");
  };

  return (
    <div className="min-h-screen w-full bg-background text-text-base">
      {/* HEADER */}
      <section className="w-full border-b border-surfaceBorder bg-surface">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-2">
          <UserIcon className="h-5 w-5" style={{ color: brand }} />
          <h1 className="text-xl font-semibold tracking-tight">Edit Profile</h1>
        </div>
      </section>

      {/* MAIN */}
      <main className="max-w-3xl mx-auto px-4 pt-6 pb-10 flex flex-col items-center">
        <Card
          className="w-full max-w-[500px] p-6 space-y-8"
          style={{ border: `2px solid ${brand}` }}
        >
          {/* USER DETAILS */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Account Details</h2>

            <div className="space-y-4">
              <Input label="First Name" value={firstName} readOnly />
              <Input label="Last Name" value={lastName} readOnly />
            </div>
          </div>

          {/* UPDATE EMAIL */}
          <div className="pt-6 border-t border-surfaceBorder space-y-4">
            <h2 className="text-lg font-semibold">Update Email</h2>

            <div className="space-y-4">
              <Input
                label="Old Email"
                value={oldEmail}
                onChange={(e) => setOldEmail(e.target.value)}
              />

              <Input
                label="New Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />

              <Input
                label="Current Password"
                type="password"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
              />
            </div>

            {emailError && <p className="text-sm text-red-500">{emailError}</p>}
            {emailMessage && (
              <p className="text-sm text-green-600">{emailMessage}</p>
            )}

            <Button
              variant="primary"
              className="w-full !py-2.5 !text-sm"
              onClick={handleUpdateEmail}
            >
              Update Email
            </Button>
          </div>

          {/* CHANGE PASSWORD */}
          <div className="pt-6 border-t border-surfaceBorder space-y-4">
            <h2 className="text-lg font-semibold">Change Password</h2>

            <div className="space-y-4">
              <Input
                label="Old Password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />

              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {passwordError && (
              <p className="text-sm text-red-500">{passwordError}</p>
            )}
            {passwordMessage && (
              <p className="text-sm text-green-600">{passwordMessage}</p>
            )}

            <Button
              variant="primary"
              className="w-full !py-2.5 !text-sm"
              onClick={handleChangePassword}
            >
              Change Password
            </Button>
          </div>

          {/* BACK TO PROFILE */}
          <div className="pt-4 flex justify-center">
            <Button
              variant="secondary"
              className="!py-2 !px-4 !text-sm"
              onClick={() => navigate(`/${clubSlug}/app/profile`)}
            >
              Back to Profile
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
