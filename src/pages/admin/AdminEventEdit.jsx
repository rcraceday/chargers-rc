import { useParams } from "react-router-dom";

export default function AdminEventEdit() {
  const { id } = useParams();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Edit Event</h1>

      <p className="text-gray-700">
        Editing event with ID: <strong>{id}</strong>
      </p>

      <p className="text-gray-600">
        Event editing UI will go here.
      </p>
    </div>
  );
}
