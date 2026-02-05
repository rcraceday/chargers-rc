import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ManufacturerLogoPicker({ value, onChange }) {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogos = async () => {
      setLoading(true);

      const { data, error } = await supabase.storage
        .from("brand-logos")
        .list("", { limit: 100 });

      if (!error && data) {
        setLogos(data.filter((f) => f.name !== ".emptyFolderPlaceholder"));
      }

      setLoading(false);
    };

    loadLogos();
  }, []);

  if (loading) return <p>Loading logos…</p>;

  return (
    <div className="space-y-2">
      <label className="font-semibold">Manufacturer Logo</label>

      <select
        className="w-full border p-2 rounded"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">No logo</option>
        {logos.map((file) => (
          <option key={file.name} value={file.name}>
            {file.name}
          </option>
        ))}
      </select>

      {value && (
        <img
          src={`https://YOURPROJECT.supabase.co/storage/v1/object/public/brand-logos/${value}`}
          alt="Logo preview"
          className="h-12 mt-2"
        />
      )}
    </div>
  );
}