"use client";

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardTopbar from "./DashboardTopbar";

export default function DashboardShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <DashboardSidebar collapsed={collapsed} />

      <div
        className={`transition-all duration-300 ${
          collapsed ? "pl-20" : "pl-64"
        }`}
      >
        <DashboardTopbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}