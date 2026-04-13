// src/app/components/driver/profile-sections/RacingInfoSection.jsx

import Input from "@/components/ui/Input";

export default function RacingInfoSection({ driver, update }) {
  return (
    <section className="space-y-4">
      <h3 className="text-sm font-semibold">Racing / Driving Information</h3>

      <Input
        label="Favourite Classes (comma separated)"
        value={(driver.favourite_classes || []).join(", ")}
        onChange={(e) =>
          update(
            "favourite_classes",
            e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          )
        }
      />

      <Input
        label="Preferred Surface"
        value={driver.preferred_surface || ""}
        onChange={(e) => update("preferred_surface", e.target.value)}
      />

      <Input
        label="Home Track"
        value={driver.home_track || ""}
        onChange={(e) => update("home_track", e.target.value)}
      />
    </section>
  );
}
