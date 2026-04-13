// src/app/components/driver/profile-sections/DirtCarProfileSection.jsx

import Input from "@/components/ui/Input";

export default function DirtCarProfileSection({ driver, update }) {
  return (
    <section className="space-y-4">
      <h3 className="text-sm font-semibold">Favorite Dirt Track Car Profile</h3>

      <Input
        label="Car Type"
        value={driver.dirt_car_type || ""}
        onChange={(e) => update("dirt_car_type", e.target.value)}
      />

      <Input
        label="Chassis"
        value={driver.dirt_chassis || ""}
        onChange={(e) => update("dirt_chassis", e.target.value)}
      />

      <Input
        label="Motor"
        value={driver.dirt_motor || ""}
        onChange={(e) => update("dirt_motor", e.target.value)}
      />

      <Input
        label="ESC"
        value={driver.dirt_esc || ""}
        onChange={(e) => update("dirt_esc", e.target.value)}
      />

      <Input
        label="Battery"
        value={driver.dirt_battery || ""}
        onChange={(e) => update("dirt_battery", e.target.value)}
      />

      <Input
        label="Servo"
        value={driver.dirt_servo || ""}
        onChange={(e) => update("dirt_servo", e.target.value)}
      />

      <Input
        label="Tires"
        value={driver.dirt_tires || ""}
        onChange={(e) => update("dirt_tires", e.target.value)}
      />

      <Input
        label="Transmitter"
        value={driver.dirt_transmitter || ""}
        onChange={(e) => update("dirt_transmitter", e.target.value)}
      />
    </section>
  );
}
