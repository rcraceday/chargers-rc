// src/components/ui/TextInput.jsx
import { useOutletContext } from "react-router-dom";

export default function TextInput({ label, error, className = "", ...props }) {
  const outlet = useOutletContext() || {};
  const club = outlet.club;
  const theme = club?.theme;

  const borderColor = error
    ? "#DC2626" // red-600
    : theme?.hero?.backgroundColor || "#D1D5DB"; // fallback gray

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`
          rounded-md px-3 py-2 w-full outline-none transition
          ${className}
        `}
        style={{
          border: `1px solid ${borderColor}`
        }}
      />

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
    </div>
  );
}
