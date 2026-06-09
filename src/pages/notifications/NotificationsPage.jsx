import React, { useEffect, useState } from "react";
import SendNotificationCard from "../../components/notifications/SendNotificationCard";
import NotificationHistoryTable from "../../components/notifications/NotificationHistoryTable";
import * as driversService from "../../services/drivers.service";

export default function NotificationsPage() {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const d = await driversService.getDrivers();
      if (!mounted) return;
      setDrivers(d.map((x) => ({ id: x.id, name: x.name })));
    })();
    return () => (mounted = false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold text-slate-900">Notification</div>

      <SendNotificationCard drivers={drivers} />
      <NotificationHistoryTable />
    </div>
  );
}
