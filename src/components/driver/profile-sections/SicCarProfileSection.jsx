// src/app/components/driver/profile-sections/SicCarProfileSection.jsx

import Input from "@/components/ui/Input";

export default function SicCarProfileSection({ driver, update }) {
  return (
    <section className="space-y-4">
      <h3 className="text-sm font-semibold">Favorite SIC Surface Car Profile</h3>

      <Input
        label="Car Type"
        value={driver.sic_car_type || ""}
        onChange={(e) => update("sic_car_type", e.target.value)}
      />

      <Input
        label="Chassis"
        value={driver.sic_chassis || ""}
        onChange={(e) => update("sic_chassis", e.target.value)}
      />

      <Input
        label="Motor"
        value={driver.sic_motor || ""}
        onChange={(e) => update("sic_motor", e.target.value)}
      />

      <Input
        label="ESC"
        value={driver.sic_esc || ""}
        onChange={(e) => update("sic_esc", e.target.value)}
      />

      <Input
        label="Battery"
        value={driver.sic_battery || ""}
        onChange={(e) => update("sic_battery", e.target.value)}
      />

      <Input
        label="Servo"
        value={driver.sic_servo || ""}
        onChange={(e) => update("sic_servo", e.target.value)}
      />

      <Input
        label="Tires"
        value={driver.sic_tires || ""}
        onChange={(e) => update("sic_tires", e.target.value)}
      />

      <Input
        label="Transmitter"
        value={driver.sic_transmitter || ""}
        onChange={(e) => update("sic_transmitter", e.target.value)}
      />
    </section>
  );
}
