import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

// Auth
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const VerifyCodePage = lazy(() => import("../pages/auth/VerifyCodePage"));

// Dashboard pages
const OverviewPage = lazy(() => import("../pages/overview/OverviewPage"));
const InspectionsPage = lazy(
  () => import("../pages/inspections/InspectionsPage"),
);
const InspectionDetailsPage = lazy(
  () => import("../pages/inspections/InspectionDetailsPage"),
);
const BeforeAfterPage = lazy(
  () => import("../pages/inspections/BeforeAfterPage"),
);
const DriversPage = lazy(() => import("../pages/drivers/DriversPage"));
const DriverDetailsPage = lazy(
  () => import("../pages/drivers/DriverDetailsPage"),
);
const VansPage = lazy(() => import("../pages/vans/VansPage"));
const AssignmentsPage = lazy(
  () => import("../pages/assignments/AssignmentsPage"),
);
const AnalyticsPage = lazy(() => import("../pages/analytics/AnalyticsPage"));
const NotificationsPage = lazy(
  () => import("../pages/notifications/NotificationsPage"),
);
const SettingsPage = lazy(() => import("../pages/settings/SettingsPage"));

export const routes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/verify", element: <VerifyCodePage /> },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/overview" replace /> },

      { path: "overview", element: <OverviewPage /> },

      { path: "inspections", element: <InspectionsPage /> },
      { path: "inspections/:id", element: <InspectionDetailsPage /> },
      { path: "inspections/:id/before-after", element: <BeforeAfterPage /> },

      { path: "drivers", element: <DriversPage /> },
      { path: "drivers/:id", element: <DriverDetailsPage /> },

      { path: "vans", element: <VansPage /> },
      { path: "assignments", element: <AssignmentsPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },

  { path: "*", element: <Navigate to="/overview" replace /> },
];
