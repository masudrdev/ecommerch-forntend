export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-[#1E293B] p-5">
          <p className="text-sm text-gray-400">Total Users</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-500">0</h2>
        </div>

        <div className="rounded-xl bg-[#1E293B] p-5">
          <p className="text-sm text-gray-400">Total Vendors</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-500">0</h2>
        </div>

        <div className="rounded-xl bg-[#1E293B] p-5">
          <p className="text-sm text-gray-400">Total Orders</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-500">0</h2>
        </div>

        <div className="rounded-xl bg-[#1E293B] p-5">
          <p className="text-sm text-gray-400">Revenue</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-500">৳0</h2>
        </div>
      </div>

      <div className="rounded-xl bg-[#1E293B] p-5">
        <h2 className="text-lg font-bold">Orders Overview</h2>
        <div className="mt-4 h-64 rounded-lg bg-[#334155]" />
      </div>
    </div>
  );
}