export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col gap-6">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <nav className="flex flex-col gap-3">
          <a href="/admin" className="hover:text-blue-400">Dashboard</a>
          <a href="/admin/users" className="hover:text-blue-400">Users</a>
          <a href="/admin/settings" className="hover:text-blue-400">Settings</a>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Admin</h1>
          <button className="text-sm text-red-500">Logout</button>
        </header>
        <main className="p-6 bg-gray-50 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}