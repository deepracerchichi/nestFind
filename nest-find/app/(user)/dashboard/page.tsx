export default function UserDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Welcome back</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Your Activity</p>
          <p className="text-2xl font-bold">—</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Notifications</p>
          <p className="text-2xl font-bold">—</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
        <p className="text-sm text-gray-400">No activity yet</p>
      </div>
    </div>
  );
}