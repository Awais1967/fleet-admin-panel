import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OverviewKpiCards from "../../components/overview/OverviewKpiCards";
import TodaysInspectionsTable from "../../components/overview/TodaysInspectionsTable";
import DamageAlertsPanel from "../../components/overview/DamageAlertsPanel";
import * as overviewService from "../../services/overview.service";

export default function OverviewPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState(null);
  const [today, setToday] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const [k, t, a] = await Promise.all([
        overviewService.getKpis(),
        overviewService.getTodaysInspections(),
        overviewService.getDamageAlerts(),
      ]);
      if (!mounted) return;
      setKpis(k);
      setToday(t);
      setAlerts(a);
      setLoading(false);
    })();
    return () => (mounted = false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold text-slate-900">Overview</div>

      <OverviewKpiCards
        loading={loading}
        data={kpis}
        onKpiClick={(key) => {
          switch (key) {
            case "totalVans":
              nav("/vans");
              break;
            case "totalDrivers":
              nav("/drivers");
              break;
            case "todaysInspections":
              nav("/inspections");
              break;
            case "pendingInspections":
              nav("/inspections");
              break;
            case "damageAlertsToday":
              nav("/inspections");
              break;
            default:
              break;
          }
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TodaysInspectionsTable
            loading={loading}
            rows={today}
            onViewAll={() => nav("/inspections")}
          />
        </div>
        <div className="lg:col-span-1">
          <DamageAlertsPanel
            loading={loading}
            alerts={alerts}
            onViewAll={() => nav("/inspections")}
            onViewDetail={(alert) =>
              nav(`/inspections/${alert.inspectionId || alert.id}`)
            }
          />
        </div>
      </div>
    </div>
  );
}
