// src/app/pages/profile/EditProfile.jsx

import { useParams, useNavigate } from "react-router-dom";
import { UserIcon } from "@heroicons/react/24/solid";

import { useClub } from "@/app/providers/ClubProvider";
import { useDrivers } from "@/app/providers/DriverProvider";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EditDriverProfileCard from "@/components/driver/EditDriverProfileCard";

export default function EditProfile() {
  const { clubSlug, id } = useParams();
  const navigate = useNavigate();

  const { club } = useClub();
  const { drivers, updateDriver } = useDrivers();

  const brand = club?.theme?.hero?.backgroundColor || "#0A66C2";

  const driver = drivers?.find((d) => d.id === id);

  if (!driver) {
    return (
      <div className="min-h-screen w-full bg-background text-text-base flex items-center justify-center">
        <p className="text-text-muted">Driver not found.</p>
      </div>
    );
  }

  const update = (field, value) => {
    updateDriver(driver.id, { [field]: value });
  };

  return (
    <div className="min-h-screen w-full bg-background text-text-base">

      {/* HEADER */}
      <section className="w-full border-b border-surfaceBorder bg-surface">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-2">
          <UserIcon className="h-5 w-5" style={{ color: brand }} />
          <h1 className="text-xl font-semibold tracking-tight">Edit Driver</h1>
        </div>
      </section>

      {/* MAIN */}
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-10">

        {/* DRIVER EDITOR CARD */}
        <EditDriverProfileCard
          driver={driver}
          update={update}
          isMember={true}
          brand={brand}
          navigate={navigate}
          club={club}
          primaryColor={driver.primary_color}
          secondaryColor={driver.secondary_color}
          previewNumber={driver.permanent_number || driver.number}
          handleAvatarSelect={(e) =>
            update("avatar_file", e.target.files?.[0] || null)
          }
          handleRemoveAvatar={() => update("avatar_url", null)}
        />

        {/* BACK BUTTON */}
        <Card
          className="p-6 w-full text-center"
          style={{ border: `2px solid ${brand}` }}
        >
          <Button
            variant="secondary"
            className="!py-2 !px-4 !text-sm"
            onClick={() => navigate(`/${clubSlug}/app/profile/drivers/${id}`)}
          >
            Back to Driver Profile
          </Button>
        </Card>
      </main>
    </div>
  );
}
