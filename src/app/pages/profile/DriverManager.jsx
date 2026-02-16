// src/app/pages/profile/DriverManager.jsx
import { Link, useOutletContext } from "react-router-dom";
import useDrivers from "@/app/hooks/useDrivers";
import useMembership from "@app/hooks/useMembership";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function DriverManager() {
  const { club } = useOutletContext();

  // Single call to the driver hook
  const { drivers = [], loading: loadingDrivers = true, error } = useDrivers();

  // Debug logs
  console.log("DriverManager outlet club:", club);
  console.log("DriverManager useDrivers:", { drivers, loadingDrivers, error });

  const {
    loadingMembership,
    isNonMember,
    isJunior,
    isSingle,
    isFamily,
  } = useMembership();

  const clubSlug = club?.slug;

  // Only show the full loading screen when there are no drivers yet.
  // This prevents transient membership re-checks from hiding an already-loaded list.
  const isLoading = loadingDrivers || (loadingMembership && (drivers?.length || 0) === 0);

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <p className="text-gray-600">Loading drivers…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <p className="text-red-600">Error loading drivers.</p>
      </div>
    );
  }

  const hasDriver = (drivers || []).length > 0;
  const canAddDrivers = isFamily;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Driver Manager</h1>
        {canAddDrivers && clubSlug && (
          <Link to={`/${clubSlug}/profile/drivers/add`}>
            <Button variant="primary">Add Driver</Button>
          </Link>
        )}
      </div>

      {!hasDriver && (
        <Card className="p-6 text-center space-y-3">
          <p className="text-gray-600">You haven’t added any drivers yet.</p>
          {canAddDrivers && clubSlug && (
            <Link to={`/${clubSlug}/profile/drivers/add`}>
              <Button variant="primary">Add Your First Driver</Button>
            </Link>
          )}
          {!canAddDrivers && (
            <p className="text-gray-500 text-sm">
              Your membership type does not allow adding drivers. Move to a Family membership to add junior drivers.
            </p>
          )}
        </Card>
      )}

      {hasDriver && (
        <div className="space-y-4">
          {drivers.map((driver) => (
            <Card key={driver.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={driver.avatar_url || "/default-avatar.png"} alt="Driver avatar" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-medium">{driver.first_name} {driver.last_name}</p>
                  {driver.nickname && <p className="text-gray-600 text-sm">“{driver.nickname}”</p>}
                  <div className="flex gap-2 mt-1">
                    {driver.is_junior && <Badge color="blue">Junior</Badge>}
                    {driver.driver_type && <Badge color="gray">{driver.driver_type}</Badge>}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Link to={`/${clubSlug}/profile/drivers/${driver.id}/edit`}>
                  <Button variant="secondary">Edit</Button>
                </Link>
                <Link to={`/${clubSlug}/profile/drivers/${driver.id}/delete`}>
                  <Button variant="danger">Delete</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
