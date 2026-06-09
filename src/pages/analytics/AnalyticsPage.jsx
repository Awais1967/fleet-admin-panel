import React, { useEffect, useState } from "react";
import AnalyticsKpiCards from "../../components/analytics/AnalyticsKpiCards";
import AnalyticsFiltersRow from "../../components/analytics/AnalyticsFiltersRow";
import InspectionCompletionChart from "../../components/analytics/InspectionCompletionChart";
import MostDamagedVansChart from "../../components/analytics/MostDamagedVansChart";
import DriversMostIncidentsChart from "../../components/analytics/DriversMostIncidentsChart";
import WeeklyIncidentTrendsChart from "../../components/analytics/WeeklyIncidentTrendsChart";

import * as driversService from "../../services/drivers.service";
import * as vansService from "../../services/vans.service";
import * as analyticsService from "../../services/analytics.service";

export default function AnalyticsPage() {
  const [filters, setFilters] = useState({ date: "", driver: "", van: "" });
  const [drivers, setDrivers] = useState([]);
  const [vans, setVans] = useState([]);
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [d, v, k] = await Promise.all([
        driversService.getDrivers(),
        vansService.getVans(),
        analyticsService.getKpis(),
      ]);
      if (!mounted) return;
      setDrivers(d.map((x) => ({ id: x.id, name: x.name })));
      setVans(v.map((x) => ({ id: x.id, label: x.vanNumber })));
      setKpis(k);
    })();
    return () => (mounted = false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold text-slate-900">Analytics</div>

      <AnalyticsKpiCards values={kpis} />

      <AnalyticsFiltersRow
        date={filters.date}
        onDate={(date) => setFilters((p) => ({ ...p, date }))}
        driver={filters.driver}
        onDriver={(driver) => setFilters((p) => ({ ...p, driver }))}
        van={filters.van}
        onVan={(van) => setFilters((p) => ({ ...p, van }))}
        drivers={drivers}
        vans={vans}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InspectionCompletionChart />
        <MostDamagedVansChart />
        <DriversMostIncidentsChart />
        <WeeklyIncidentTrendsChart />
      </div>
    </div>
  );
}
