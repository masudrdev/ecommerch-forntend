import { Bell, Menu, Settings } from "lucide-react";
import { useSelector } from "react-redux";

export default function DashboardTopbar({ collapsed, setCollapsed }) {

  const { user } = useSelector((state) => state.auth);
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#172033] px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg border border-white/10 p-2 hover:bg-white/10"
          >
            <Menu size={20} />
          </button>

          <div>
            <h1 className="text-lg font-bold">Dashboard</h1>
            <p className="text-xs text-gray-400">Welcome, {user?.name || "user"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-white/10 p-2 hover:bg-white/10">
            <Bell size={18} />
          </button>

          <button className="rounded-lg border border-white/10 p-2 hover:bg-white/10">
            <Settings size={18} />
          </button>

          <span className="hidden rounded-lg bg-[#1E293B] px-4 py-2 text-sm sm:block">
            {user?.role || "roll"}
          </span>
        </div>
      </div>
    </header>
  );
}