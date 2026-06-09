// src/ui/MobileNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiClipboard,
  FiUsers,
  FiTruck,
  FiLayers,
  FiBarChart2,
  FiBell,
  FiSettings,
  FiX,
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

export default function MobileNav({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-90 lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-70 bg-white border-r border-app">
        <div className="h-18 px-6 flex items-center border-b border-app">
          <div className="text-sm font-semibold text-slate-900">LOGO</div>
          <button
            onClick={onClose}
            className="ml-auto h-10 w-10 rounded-md hover:bg-slate-100 flex items-center justify-center"
            aria-label="Close menu"
          >
            <FiX />
          </button>
        </div>

        <nav className="py-4">
          <ul className="space-y-1 px-2">
            {items.map((it) => {
              const Icon = it.icon;
              return (
                <li key={it.to}>
                  <NavLink
                    to={it.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition relative",
                        isActive
                          ? "text-teal-700 bg-teal-50"
                          : "text-slate-600 hover:bg-slate-50",
                      ].join(" ")
                    }
                  >
                    <Icon className="text-base" />
                    <span className="font-medium">{it.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
