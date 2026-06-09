import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiChevronLeft, FiDownload, FiSearch } from "react-icons/fi";

import InspectionPhotosGrid from "../../components/inspections/InspectionPhotosGrid";
import AiDamageSummaryPanel from "../../components/inspections/AiDamageSummaryPanel";
import DriverVanInfoPanel from "../../components/inspections/DriverVanInfoPanel";
import ErrorState from "../../components/shared/ErrorState";
import * as inspectionsService from "../../services/inspections.service";

function getInspectionErrorMessage(error) {
  if (error?.code === "permission-denied") {
    return "Firebase rejected access to this inspection. Update Firestore rules to allow this admin account to read inspections.";
  }

  return error?.message || "Unable to load inspection details.";
}

export default function InspectionDetailsPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [inspection, setInspection] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await inspectionsService.getInspectionById(id);
        if (!mounted) return;
        setInspection(data);
      } catch (ex) {
        if (!mounted) return;
        setInspection(null);
        setError(getInspectionErrorMessage(ex));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [id]);

  return (
    <div className="space-y-6">
      {error ? <ErrorState message={error} /> : null}

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
          <button
            onClick={() => nav("/inspections")}
            className="h-9 w-9 rounded-md hover:bg-slate-100 flex items-center justify-center"
          >
            <FiChevronLeft />
          </button>
          <div className="text-sm font-semibold text-slate-900">
            View Details
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="relative w-90 hidden md:block">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search"
                className="h-10 w-full rounded-md border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-teal-600"
              />
            </div>

            <button className="h-10 rounded-md bg-teal-600 text-white text-sm font-medium px-4 hover:bg-teal-700 flex items-center gap-2">
              <FiDownload />
              Download Report
            </button>
          </div>
        </div>

        <div className="px-6 py-6">
          <DriverVanInfoPanel loading={loading} inspection={inspection} />

          <div className="pt-6">
            <InspectionPhotosGrid
              loading={loading}
              photos={inspection?.photos || []}
              aiStatus={inspection?.aiStatus}
              onBeforeAfter={() => nav(`/inspections/${id}/before-after`)}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 items-stretch">
            <div className="lg:col-span-1">
              <AiDamageSummaryPanel
                loading={loading}
                items={inspection?.aiIssues || []}
                aiStatus={inspection?.aiStatus}
                inspectionId={inspection?.id}
              />
            </div>
            <div className="lg:col-span-1">
              <div className="h-full bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100">
                  <div className="text-sm font-semibold text-slate-900">
                    Driver & Van Details
                  </div>
                </div>
                <div className="px-6 py-5 text-sm text-slate-700 flex-1">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                    {/* Driver Info column */}
                    <div>
                      <div className="text-[12px] font-semibold text-slate-700 mb-3">
                        Driver Info
                      </div>
                      <div className="space-y-2 text-[12px]">
                        <div className="flex justify-between">
                          <div className="text-slate-600">Driver ID:</div>
                          <div className="font-medium">
                            {inspection?.driverId || "—"}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-slate-600">
                            Total Inspections:
                          </div>
                          <div className="font-medium">
                            {inspection?.totalInspections || "—"}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-slate-600">Damage Rate:</div>
                          <div
                            className={`font-medium ${inspection?.aiStatus?.toLowerCase() === "clear" ? "text-slate-600" : "text-rose-600"}`}
                          >
                            {inspection?.aiStatus?.toLowerCase() === "clear"
                              ? "—"
                              : inspection?.damageRate || "—"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Van Info column */}
                    <div>
                      <div className="text-[12px] font-semibold text-slate-700 mb-3">
                        Van Info
                      </div>
                      <div className="space-y-2 text-[12px]">
                        <div className="flex justify-between">
                          <div className="text-slate-600">Van Number:</div>
                          <div className="font-medium">
                            {inspection?.vanNumber || "—"}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-slate-600">VIN:</div>
                          <div className="font-medium">
                            {inspection?.vin || "—"}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-slate-600">Last Inspection:</div>
                          <div className="font-medium">
                            {inspection?.lastInspection || "—"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
