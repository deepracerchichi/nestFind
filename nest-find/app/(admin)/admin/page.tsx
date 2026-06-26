"use client"
import { useRouter } from "next/dist/client/components/navigation";

export default function AdminDashboardPage() {

  const router = useRouter();
  const createListing = () => {
    router.push("/admin/create-listing");
  }

  const seeListings = () => {
    router.push("/listings")
  }
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold">—</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Active Sessions</p>
          <p className="text-2xl font-bold">—</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Admins</p>
          <p className="text-2xl font-bold">—</p>
        </div>
      </div>

      {/* Table placeholder */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
        <table className="w-full text-sm text-left">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="pb-2">Username</th>
              <th className="pb-2">Email</th>
              <th className="pb-2">Role</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-gray-400">
              <td colSpan={4} className="py-4 text-center">No data yet</td>
            </tr>
          </tbody>
        </table>
      </div>

      <button className="mx-auto rounded-2xl bg-blue-600 hover:bg-white hover:text-blue-600 text-white px-5 py-2" onClick={createListing}>
        CreateListing
      </button>

      <button className="mx-auto rounded-2xl bg-blue-600 hover:bg-white hover:text-blue-600 text-white px-5 py-2" onClick={seeListings}>
        Go see listings
      </button>
    </div>
  );
}