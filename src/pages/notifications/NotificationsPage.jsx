import React, { useEffect, useState } from "react";
import SendNotificationCard from "../../components/notifications/SendNotificationCard";
import NotificationHistoryTable from "../../components/notifications/NotificationHistoryTable";
import ErrorState from "../../components/shared/ErrorState";
import * as driversService from "../../services/drivers.service";

function getNotificationsErrorMessage(error) {
  if (error?.code === "permission-denied") {
    return "Firebase rejected access to notifications. Update Firestore rules to allow this admin account to manage notifications.";
  }

  return error?.message || "Unable to load notifications.";
}

export default function NotificationsPage() {
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState("");
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setError("");
        const d = await driversService.getDrivers();
        if (!mounted) return;
        setDrivers(d.map((x) => ({ id: x.id, name: x.name })));
      } catch (ex) {
        if (!mounted) return;
        setError(getNotificationsErrorMessage(ex));
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold text-slate-900">Notification</div>
      {error ? <ErrorState message={error} /> : null}

      <SendNotificationCard
        drivers={drivers}
        onSent={() => setHistoryRefreshKey((value) => value + 1)}
        onError={(ex) => setError(getNotificationsErrorMessage(ex))}
      />
      <NotificationHistoryTable refreshKey={historyRefreshKey} />
    </div>
  );
}
