import React from "react";
import DataRetentionCard from "../../components/settings/DataRetentionCard";
import AdminUsersTable from "../../components/settings/AdminUsersTable";
import SystemSettingsCard from "../../components/settings/SystemSettingsCard";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold text-slate-900">Settings</div>

      <DataRetentionCard />
      <AdminUsersTable />
      <SystemSettingsCard />
    </div>
  );
}
