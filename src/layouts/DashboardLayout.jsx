// src/layouts/DashboardLayout.jsx
import React, { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../ui/Sidebar";
import Topbar from "../ui/Topbar";
import MobileNav from "../ui/MobileNav";

const titleMap = {
  "/overview": "Overview",
  "/inspections": "Inspections",
  "/inspections/": "Inspections",
  "/drivers": "Drivers",
  "/vans": "Vans",
  "/assignments": "Assignments",
  "/analytics": "Analytics",
  "/notifications": "Notification",
  "/settings": "Settings",
};

export default function DashboardLayout() {
  const loc = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const title = useMemo(() => {
    // Match details pages too
    if (loc.pathname.startsWith("/inspections")) return "Inspections";
    if (loc.pathname.startsWith("/drivers")) return "Drivers";
    return titleMap[loc.pathname] || "Overview";
  }, [loc.pathname]);

  return (
    <div className="min-h-screen bg-app">
      <div className="flex">
        <Sidebar />

        {/*
          Content area: add top padding to account for the fixed Topbar
          and left padding on large screens to account for the fixed Sidebar.
        */}
        <div className="flex-1 min-w-0 pt-18 lg:pl-60">
          <Topbar title={title} onOpenMobileNav={() => setMobileOpen(true)} />

          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </div>
  );
}
