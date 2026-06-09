import React from "react";
import Avatar from "../../components/shared/Avatar";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

function InfoRow({ label, value, valueClassName }) {
  return (
    <div className="flex items-center justify-between gap-4 text-[11px]">
      <div className="text-slate-600">{label}</div>
      <div className={`text-slate-700 font-medium ${valueClassName || ""}`}>
        {value}
      </div>
    </div>
  );
}

export default function DriverVanInfoPanel({ inspection }) {
  const driverName = inspection?.driverName || "-";
  const vanNumber = inspection?.vanNumber || "-";
  const inspectionDate =
    inspection?.inspectionDate || inspection?.inspectionDate || "-";
  const submissionTime =
    inspection?.submissionTime || inspection?.submitTime || "-";
  const aiStatus = inspection?.aiStatus || "-";

  return (
    <div className="rounded-[10px] bg-white border border-slate-100 shadow-sm px-6 py-5">
      <div className="flex items-start gap-6">
        <Avatar name={driverName} size={64} />

        <div className="flex-1">
          <div className="text-[16px] font-semibold text-slate-900">
            {driverName}
          </div>

          <div className="mt-3 text-[12px] text-slate-600 grid grid-cols-2 gap-x-6 gap-y-1 max-w-md">
            <div className="">Van</div>
            <div className="text-slate-700">{vanNumber}</div>

            <div className="">Inspection Date</div>
            <div className="text-slate-700">{inspectionDate}</div>

            <div className="">Submission Time</div>
            <div className="text-slate-700">{submissionTime}</div>
          </div>
        </div>

        <div className="ml-4">
          {aiStatus && aiStatus !== "-" ? (
            aiStatus.toLowerCase() === "clear" ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-green-600 font-semibold">
                <FiCheckCircle className="text-green-600" />
                <span>{aiStatus}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-red-600 font-semibold">
                <FiAlertTriangle className="text-red-500" />
                <span>{aiStatus}</span>
              </div>
            )
          ) : null}
        </div>
      </div>

      {/* Removed detailed Driver & Van Info block per request */}
    </div>
  );
}
