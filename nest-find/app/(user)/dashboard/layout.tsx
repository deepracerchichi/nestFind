export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-blue-600">MyApp</h2>
        <nav className="flex flex-col gap-3 text-sm">
          <a href="/dashboard" className="hover:text-blue-600">Dashboard</a>
          <a href="/dashboard/profile" className="hover:text-blue-600">Profile</a>
          <a href="/dashboard/settings" className="hover:text-blue-600">Settings</a>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <button className="text-sm text-red-500">Logout</button>
        </header>
        <main className="p-6 bg-gray-50 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}