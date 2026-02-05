import { Link } from "react-router-dom";

export default function AdminEvents() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Manage Events</h1>

      <p className="text-gray-700">
        Event management tools will appear here.
      </p>

      <div className="mt-4">
        <Link
          to="/admin/events/1"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit Example Event
        </Link>
      </div>
    </div>
  );
}
