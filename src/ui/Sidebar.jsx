// src/ui/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiGrid,
  FiClipboard,
  FiUsers,
  FiTruck,
  FiLayers,
  FiBarChart2,
  FiBell,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const items = [
  { to: "/overview", label: "Overview", icon: FiGrid },
  { to: "/inspections", label: "Inspections", icon: FiClipboard },
  { to: "/drivers", label: "Drivers", icon: FiUsers },
  { to: "/vans", label: "Vans", icon: FiTruck },
  { to: "/assignments", label: "Assignments", icon: FiLayers },
  { to: "/analytics", label: "Analytics", icon: FiBarChart2 },
  { to: "/notifications", label: "Notifications", icon: FiBell },
  { to: "/settings", label: "Settings", icon: FiSettings },
];

export default function Sidebar() {
  const nav = useNavigate();
  const { logout } = useAuth();
  return (
    // Fixed on large screens so it doesn't scroll with the page
    <aside className="hidden lg:flex lg:flex-col w-60 bg-white border-r border-app lg:fixed lg:inset-y-0 lg:left-0 lg:z-20">
      {/* Logo area */}
      <div className="h-18 px-8 flex items-center border-b border-app">
        <div className="text-sm font-semibold tracking-wide text-slate-900">
          LOGO
        </div>
      </div>

      {/* Menu */}
      <nav className="py-6">
        <ul className="space-y-1">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <li key={it.to}>
                <NavLink
                  to={it.to}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 px-6 py-3 text-sm transition relative",
                      isActive
                        ? "text-teal-700 bg-teal-50"
                        : "text-slate-600 hover:bg-slate-50",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* left active indicator */}
                      <span
                        className={[
                          "absolute left-0 top-0 h-full w-0.75 rounded-r",
                          isActive ? "bg-teal-600" : "bg-transparent",
                        ].join(" ")}
                      />
                      <Icon className="text-base" />
                      <span className="font-medium">{it.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* Footer / logout */}
      <div className="mt-auto px-6 py-4 border-t border-app">
        <button
          type="button"
          onClick={async () => {
            await logout();
            nav("/login");
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-50"
        >
          <FiLogOut />
          <span className="font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
}
