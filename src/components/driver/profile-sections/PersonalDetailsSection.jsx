// src/app/components/driver/profile-sections/PersonalDetailsSection.jsx

import Input from "@/components/ui/Input";

export default function PersonalDetailsSection({ driver, update }) {
  return (
    <section className="space-y-4">
      <h3 className="text-sm font-semibold">Personal Details</h3>

      <Input
        label="Year of Birth"
        value={driver.year_of_birth || ""}
        onChange={(e) => update("year_of_birth", e.target.value)}
      />

      <Input
        label="Hometown"
        value={driver.hometown || ""}
        onChange={(e) => update("hometown", e.target.value)}
      />

       <Input
        label="Occupation"
        value={driver.occupation || ""}
        onChange={(e) => update("occupation", e.target.value)}
      />
    </section>
  );
}
