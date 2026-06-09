import React, { useEffect, useState } from "react";
import AnalyticsKpiCards from "../../components/analytics/AnalyticsKpiCards";
import AnalyticsFiltersRow from "../../components/analytics/AnalyticsFiltersRow";
import InspectionCompletionChart from "../../components/analytics/InspectionCompletionChart";
import MostDamagedVansChart from "../../components/analytics/MostDamagedVansChart";
import DriversMostIncidentsChart from "../../components/analytics/DriversMostIncidentsChart";
import WeeklyIncidentTrendsChart from "../../components/analytics/WeeklyIncidentTrendsChart";
import ErrorState from "../../components/shared/ErrorState";

import * as driversService from "../../services/drivers.service";
import * as vansService from "../../services/vans.service";
import * as analyticsService from "../../services/analytics.service";

function getAnalyticsErrorMessage(error) {
  if (error?.code === "permission-denied") {
    return "Firebase rejected access to analytics data. Update Firestore rules to allow this admin account to read inspections.";
  }

  return error?.message || "Unable to load analytics.";
}

export default function AnalyticsPage() {
  const [filters, setFilters] = useState({ date: "", driver: "", van: "" });
  const [drivers, setDrivers] = useState([]);
  const [vans, setVans] = useState([]);
  const [kpis, setKpis] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setError("");
        const [d, v] = await Promise.all([
          driversService.getDrivers(),
          vansService.getVans(),
        ]);
        if (!mounted) return;
        setDrivers(d.map((x) => ({ id: x.id, name: x.name })));
        setVans(v.map((x) => ({ id: x.id, label: x.vanNumber })));
      } catch (ex) {
        if (!mounted) return;
        setError(getAnalyticsErrorMessage(ex));
      }
    })();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setError("");
        const [k, charts] = await Promise.all([
          analyticsService.getKpis(filters),
          analyticsService.getChartData(filters),
        ]);
        if (!mounted) return;
        setKpis(k);
        setChartData(charts);
      } catch (ex) {
        if (!mounted) return;
        setError(getAnalyticsErrorMessage(ex));
      }
    })();
    return () => (mounted = false);
  }, [filters]);

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold text-slate-900">Analytics</div>
      {error ? <ErrorState message={error} /> : null}

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
        <InspectionCompletionChart data={chartData?.completion} />
        <MostDamagedVansChart data={chartData?.damagedVans} />
        <DriversMostIncidentsChart data={chartData?.highRiskDrivers} />
        <WeeklyIncidentTrendsChart data={chartData?.weeklyIncidents} />
      </div>
    </div>
  );
}
